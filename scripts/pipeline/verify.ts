import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { createLogger } from './lib/logger.ts';
import { loadFigmaMapping } from './lib/config-loader.ts';
import {
  parseApplyReport,
  renderVerifyReport,
  summarizeVerification,
  type VerificationCheck,
} from './lib/verify-report.ts';
import {
  collectScreenTargets,
  comparePngFiles,
  renderVisualDiffMarkdown,
  visualReportPaths,
  type ScreenTarget,
  type VisualDiffResult,
} from './lib/visual-diff.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');
const VISUAL_BASELINE_DIR = resolve(REPO_ROOT, '.automation/baseline/screenshots');
const VISUAL_PIXEL_THRESHOLD = 0.1;
const VISUAL_MAX_DIFF_RATIO = 0.01;
const PREVIEW_PORT = 4173;

const logger = createLogger('verify');

async function main(): Promise<void> {
  logger.info('Starting verify.ts — build/lint verification gate');

  const applyReportPath = findLatestApplyReport();
  if (!applyReportPath) {
    logger.error(`No apply report found in ${REPORTS_DIR}. Run npm run figma:apply first.`);
    process.exit(1);
  }

  const apply = parseApplyReport(readFileSync(applyReportPath, 'utf-8'), applyReportPath);
  const checks: VerificationCheck[] = [
    runCommand('build', 'npm', ['run', 'build']),
    runCommand('lint', 'npm', ['run', 'lint']),
    await visualCheck(apply.status, apply.changeSetId),
  ];

  const summary = summarizeVerification({ apply, checks });
  mkdirSync(REPORTS_DIR, { recursive: true });

  const outputPath = resolve(REPORTS_DIR, `verify-${apply.changeSetId}.md`);
  writeFileSync(outputPath, renderVerifyReport(summary), 'utf-8');

  if (summary.status === 'failed') {
    logger.error(`Verify FAILED — report written: ${outputPath}`);
    process.exit(1);
  }

  logger.success(`Verify PASSED — report written: ${outputPath}`);
}

function findLatestApplyReport(): string | null {
  if (!existsSync(REPORTS_DIR)) {
    return null;
  }

  const files = readdirSync(REPORTS_DIR)
    .filter(file => file.startsWith('apply-') && file.endsWith('.md'))
    .sort()
    .reverse();

  return files[0] ? resolve(REPORTS_DIR, files[0]) : null;
}

function runCommand(name: string, command: string, args: string[]): VerificationCheck {
  const printable = `${command} ${args.join(' ')}`;
  logger.info(`Running: ${printable}`);

  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });

  const exitCode = result.status ?? 1;
  return {
    name,
    command: printable,
    status: exitCode === 0 ? 'passed' : 'failed',
    exitCode,
    message: exitCode === 0 ? undefined : `${printable} failed`,
  };
}

async function visualCheck(applyStatus: string, changeSetId: string): Promise<VerificationCheck> {
  if (applyStatus === 'noop') {
    return {
      name: 'visual',
      command: 'Playwright visual diff',
      status: 'skipped',
      message: 'No changed files in apply report.',
    };
  }

  try {
    const results = await runVisualDiff(changeSetId);
    const failed = results.filter(result => result.status !== 'passed').length;
    return {
      name: 'visual',
      command: 'Playwright visual diff',
      status: failed === 0 ? 'passed' : 'failed',
      exitCode: failed === 0 ? 0 : 1,
      message: failed === 0 ? undefined : `${failed} visual target(s) failed`,
    };
  } catch (err) {
    return {
      name: 'visual',
      command: 'Playwright visual diff',
      status: 'failed',
      exitCode: 1,
      message: String(err),
    };
  }
}

async function runVisualDiff(changeSetId: string): Promise<VisualDiffResult[]> {
  const mapping = loadFigmaMapping();
  const targets = collectScreenTargets(mapping);
  if (targets.length === 0) {
    throw new Error('No screen routes configured for visual diff');
  }

  const reportRoot = resolve(REPORTS_DIR, changeSetId);
  const afterDir = resolve(reportRoot, 'after');
  mkdirSync(afterDir, { recursive: true });

  const preview = startPreviewServer();
  try {
    await waitForPreview(`http://127.0.0.1:${PREVIEW_PORT}`);
    await captureScreenshots(`http://127.0.0.1:${PREVIEW_PORT}`, targets, afterDir);
  } finally {
    stopPreviewServer(preview);
  }

  const results: VisualDiffResult[] = [];
  for (const target of targets) {
    const paths = visualReportPaths(reportRoot, target);
    const baselinePath = resolve(VISUAL_BASELINE_DIR, target.fileName);
    if (!existsSync(baselinePath)) {
      results.push({
        key: target.key,
        route: target.route,
        status: 'missing-baseline',
        diffRatio: 1,
        changedPixels: 0,
        totalPixels: 0,
        beforePath: baselinePath,
        afterPath: paths.afterPath,
        diffPath: paths.diffPath,
        message: 'Baseline screenshot missing. Approve a baseline before visual diff can pass.',
      });
      continue;
    }

    results.push(
      comparePngFiles({
        key: target.key,
        route: target.route,
        beforePath: baselinePath,
        afterPath: paths.afterPath,
        diffPath: paths.diffPath,
        threshold: VISUAL_PIXEL_THRESHOLD,
        maxDiffRatio: VISUAL_MAX_DIFF_RATIO,
      })
    );
  }

  writeFileSync(
    resolve(reportRoot, 'visual-diff.md'),
    renderVisualDiffMarkdown({
      changeSetId,
      threshold: VISUAL_MAX_DIFF_RATIO,
      results,
    }),
    'utf-8'
  );

  return results;
}

function startPreviewServer(): ChildProcessWithoutNullStreams {
  logger.info(`Starting preview server on 127.0.0.1:${PREVIEW_PORT}`);
  return spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT)], {
    cwd: REPO_ROOT,
    stdio: 'pipe',
  });
}

function stopPreviewServer(process: ChildProcessWithoutNullStreams): void {
  if (!process.killed) {
    process.kill('SIGTERM');
  }
}

async function waitForPreview(baseUrl: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready: ${baseUrl}`);
}

async function captureScreenshots(baseUrl: string, targets: ScreenTarget[], outputDir: string): Promise<void> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    for (const target of targets) {
      const outputPath = resolve(outputDir, target.fileName);
      await page.goto(`${baseUrl}${target.route}`, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
      });
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  logger.error(`Unhandled verify error: ${String(err)}`);
  process.exit(1);
});
