import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { createLogger } from './lib/logger.ts';
import { loadFigmaMapping } from './lib/config-loader.ts';
import { collectScreenTargets, type ScreenTarget } from './lib/visual-diff.ts';
import { verifyPromotionGates } from './lib/promote-gate.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');
const SNAPSHOTS_DIR = resolve(REPO_ROOT, '.automation/snapshots');
const BASELINE_DIR = resolve(REPO_ROOT, '.automation/baseline');
const BASELINE_SCREENSHOTS_DIR = resolve(BASELINE_DIR, 'screenshots');
const PREVIEW_PORT = 4174;
const SMOKE_KEYS = ['home', 'family'];

const logger = createLogger('promote-dev');

// ------------------------------------------------------------------ helpers

function autoDiscoverChangeSetId(): string | null {
  if (!existsSync(REPORTS_DIR)) return null;
  const markers = readdirSync(REPORTS_DIR)
    .filter(f => f.endsWith('.approved'))
    .sort()
    .reverse();

  for (const marker of markers) {
    const id = marker.replace(/\.approved$/, '');
    const promotedMarker = resolve(REPORTS_DIR, `${id}.promoted`);
    if (!existsSync(promotedMarker)) {
      return id;
    }
  }
  return null;
}

function findLatestSnapshot(): string | null {
  if (!existsSync(SNAPSHOTS_DIR)) return null;
  const files = readdirSync(SNAPSHOTS_DIR)
    .filter(f => f.endsWith('.json') && !f.endsWith('-classified.json'))
    .sort();
  return files.length > 0 ? files[files.length - 1] : null;
}

function startPreviewServer(): ChildProcessWithoutNullStreams {
  logger.info(`Starting preview server on 127.0.0.1:${PREVIEW_PORT}`);
  return spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT)],
    { cwd: REPO_ROOT, stdio: 'pipe' }
  );
}

function stopPreviewServer(proc: ChildProcessWithoutNullStreams): void {
  if (!proc.killed) {
    proc.kill('SIGTERM');
  }
}

async function waitForPreview(baseUrl: string): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // retry
    }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`Preview server did not become ready: ${baseUrl}`);
}

async function captureScreenshots(
  baseUrl: string,
  targets: ScreenTarget[],
  outputDir: string
): Promise<Map<string, string>> {
  const captured = new Map<string, string>();
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
      captured.set(target.key, outputPath);
    }
  } finally {
    await browser.close();
  }
  return captured;
}

// ------------------------------------------------------------------ report rendering

interface PromoteReportInput {
  changeSetId: string;
  status: 'promoted' | 'aborted';
  gates: 'passed' | 'failed';
  markerPresent: boolean;
  statusApproved: boolean;
  reportSha256Match: boolean;
  buildStatus: 'passed' | 'failed' | 'skipped';
  smokeStatus: 'passed' | 'failed' | 'skipped';
  distDevPath: string | null;
  snapshotBaseline: string | null;
  screenshotBaseline: string | null;
  promotedAt: string;
  failures: string[];
  smokeRows: Array<{ key: string; route: string; role: string; status: string }>;
  screenshotCount: number;
}

function renderPromoteReport(input: PromoteReportInput): string {
  const lines: string[] = [
    '---',
    `changeSetId: ${input.changeSetId}`,
    `status: ${input.status}`,
    `gates: ${input.gates}`,
    `markerPresent: ${input.markerPresent}`,
    `statusApproved: ${input.statusApproved}`,
    `reportSha256Match: ${input.reportSha256Match}`,
    `buildStatus: ${input.buildStatus}`,
    `smokeStatus: ${input.smokeStatus}`,
    `distDevPath: ${input.distDevPath ?? 'null'}`,
    `snapshotBaseline: ${input.snapshotBaseline ?? 'null'}`,
    `screenshotBaseline: ${input.screenshotBaseline ?? 'null'}`,
    `promotedAt: ${input.promotedAt}`,
    '---',
    '',
    `# Promote-Dev Report — ${input.changeSetId}`,
    '',
    '## Gates',
    '',
    '| Gate | Result | Detail |',
    '|---|---|---|',
    `| .approved marker | ${input.markerPresent ? 'passed' : 'failed'} | ${input.markerPresent ? 'Marker file exists' : 'Marker file missing'} |`,
    `| status == approved | ${input.statusApproved ? 'passed' : 'failed'} | ${input.statusApproved ? 'Status is approved' : 'Status is not approved'} |`,
    `| reportSha256 match | ${input.reportSha256Match ? 'passed' : 'failed'} | ${input.reportSha256Match ? 'SHA256 matches' : 'SHA256 mismatch — body may have been tampered'} |`,
    '',
    '## Build',
    '',
    `\`npm run build\` → ${input.buildStatus}`,
    '',
    '## Smoke Test',
    '',
    '| Target | Route | Role | Status |',
    '|---|---|---|---|',
    ...input.smokeRows.map(r => `| ${r.key} | ${r.route} | ${r.role} | ${r.status} |`),
  ];

  if (input.status === 'promoted') {
    lines.push(
      '',
      '## Baseline Updated',
      '',
      `- Snapshot: \`${input.snapshotBaseline ?? 'null'}\``,
      `- Screenshots: \`${input.screenshotBaseline ?? 'null'}\` (${input.screenshotCount} files)`
    );
  } else {
    lines.push(
      '',
      '## Failures',
      '',
      ...input.failures.map(f => `- ${f}`)
    );
  }

  lines.push('');
  return lines.join('\n');
}

// ------------------------------------------------------------------ main

async function main(): Promise<void> {
  logger.info('Starting promote-dev.ts');

  // Step 1: resolve change-set-id
  const argId = process.argv[2];
  let changeSetId: string;

  if (argId) {
    changeSetId = argId;
  } else {
    const discovered = autoDiscoverChangeSetId();
    if (!discovered) {
      logger.info('No approved+unpromoted change-set found. Nothing to promote.');
      process.exit(0);
    }
    changeSetId = discovered;
    logger.info(`Auto-discovered change-set: ${changeSetId}`);
  }

  // Step 2: load report markdown
  const reportPath = resolve(REPORTS_DIR, `${changeSetId}.md`);
  if (!existsSync(reportPath)) {
    logger.error(`Report not found: ${reportPath}`);
    process.exit(1);
  }
  const reportMarkdown = readFileSync(reportPath, 'utf-8');

  // Step 3: run gate checks
  const approvedMarkerPath = resolve(REPORTS_DIR, `${changeSetId}.approved`);
  const gateResult = verifyPromotionGates({
    reportMarkdown,
    approvedMarkerExists: existsSync(approvedMarkerPath),
    reportPath,
  });

  const promotedAt = new Date().toISOString();
  const promoteReportPath = resolve(REPORTS_DIR, `promote-${changeSetId}.md`);

  if (!gateResult.ok) {
    logger.error(`Promotion gates failed:\n${gateResult.failures.join('\n')}`);
    const abortReport = renderPromoteReport({
      changeSetId,
      status: 'aborted',
      gates: 'failed',
      markerPresent: gateResult.gateChecks.markerPresent,
      statusApproved: gateResult.gateChecks.statusApproved,
      reportSha256Match: gateResult.gateChecks.reportSha256Match,
      buildStatus: 'skipped',
      smokeStatus: 'skipped',
      distDevPath: null,
      snapshotBaseline: null,
      screenshotBaseline: null,
      promotedAt,
      failures: gateResult.failures,
      smokeRows: [],
      screenshotCount: 0,
    });
    mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(promoteReportPath, abortReport, 'utf-8');
    logger.error(`Abort report written: ${promoteReportPath}`);
    process.exit(1);
  }

  // Step 4: build
  logger.info('Running npm run build...');
  const buildResult = spawnSync('npm', ['run', 'build'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  const buildExitCode = buildResult.status ?? 1;

  if (buildExitCode !== 0) {
    const abortReport = renderPromoteReport({
      changeSetId,
      status: 'aborted',
      gates: 'passed',
      markerPresent: gateResult.gateChecks.markerPresent,
      statusApproved: gateResult.gateChecks.statusApproved,
      reportSha256Match: gateResult.gateChecks.reportSha256Match,
      buildStatus: 'failed',
      smokeStatus: 'skipped',
      distDevPath: null,
      snapshotBaseline: null,
      screenshotBaseline: null,
      promotedAt,
      failures: [`Build failed with exit code ${buildExitCode}`],
      smokeRows: [],
      screenshotCount: 0,
    });
    mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(promoteReportPath, abortReport, 'utf-8');
    logger.error(`Build failed. Abort report written: ${promoteReportPath}`);
    process.exit(1);
  }
  logger.info('Build passed.');

  // Step 5: copy dist → dist-dev
  const distSrc = resolve(REPO_ROOT, 'dist');
  const distDev = resolve(REPO_ROOT, 'dist-dev');
  if (existsSync(distDev)) {
    rmSync(distDev, { recursive: true, force: true });
  }
  cpSync(distSrc, distDev, { recursive: true, force: true });
  logger.info(`Copied dist/ → dist-dev/`);

  // Step 6: smoke test
  const mapping = loadFigmaMapping();
  const allTargets = collectScreenTargets(mapping);
  const screenshotDir = resolve(REPORTS_DIR, changeSetId, 'promote-screenshots');
  mkdirSync(screenshotDir, { recursive: true });

  let smokeStatus: 'passed' | 'failed' = 'passed';
  let captured = new Map<string, string>();
  const smokeRows: PromoteReportInput['smokeRows'] = [];

  const preview = startPreviewServer();
  try {
    await waitForPreview(`http://127.0.0.1:${PREVIEW_PORT}`);
    captured = await captureScreenshots(
      `http://127.0.0.1:${PREVIEW_PORT}`,
      allTargets,
      screenshotDir
    );

    for (const target of allTargets) {
      const isSmokeTarget = SMOKE_KEYS.includes(target.key);
      const capturedPath = captured.get(target.key);
      const captureOk = capturedPath !== undefined && existsSync(capturedPath);

      if (isSmokeTarget && !captureOk) {
        smokeStatus = 'failed';
      }

      smokeRows.push({
        key: target.key,
        route: target.route,
        role: isSmokeTarget ? 'smoke' : 'baseline',
        status: captureOk ? 'captured' : 'failed',
      });
    }
  } catch (err) {
    smokeStatus = 'failed';
    stopPreviewServer(preview);
    const abortReport = renderPromoteReport({
      changeSetId,
      status: 'aborted',
      gates: 'passed',
      markerPresent: gateResult.gateChecks.markerPresent,
      statusApproved: gateResult.gateChecks.statusApproved,
      reportSha256Match: gateResult.gateChecks.reportSha256Match,
      buildStatus: 'passed',
      smokeStatus: 'failed',
      distDevPath: null,
      snapshotBaseline: null,
      screenshotBaseline: null,
      promotedAt,
      failures: [`Smoke test threw: ${String(err)}`],
      smokeRows,
      screenshotCount: 0,
    });
    mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(promoteReportPath, abortReport, 'utf-8');
    logger.error(`Smoke test failed. Abort report written: ${promoteReportPath}`);
    process.exit(1);
  }
  stopPreviewServer(preview);

  if (smokeStatus === 'failed') {
    const abortReport = renderPromoteReport({
      changeSetId,
      status: 'aborted',
      gates: 'passed',
      markerPresent: gateResult.gateChecks.markerPresent,
      statusApproved: gateResult.gateChecks.statusApproved,
      reportSha256Match: gateResult.gateChecks.reportSha256Match,
      buildStatus: 'passed',
      smokeStatus: 'failed',
      distDevPath: null,
      snapshotBaseline: null,
      screenshotBaseline: null,
      promotedAt,
      failures: ['Smoke test: one or more smoke targets (home, family) failed to capture'],
      smokeRows,
      screenshotCount: 0,
    });
    mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(promoteReportPath, abortReport, 'utf-8');
    logger.error(`Smoke test failed. Abort report written: ${promoteReportPath}`);
    process.exit(1);
  }

  logger.info('Smoke test passed.');

  // Step 7: baseline update
  const latestSnapshot = findLatestSnapshot();
  let snapshotBaselinePath: string | null = null;

  if (latestSnapshot) {
    mkdirSync(BASELINE_DIR, { recursive: true });
    const srcSnapshot = resolve(SNAPSHOTS_DIR, latestSnapshot);
    const destSnapshot = resolve(BASELINE_DIR, latestSnapshot);
    cpSync(srcSnapshot, destSnapshot, { force: true });
    snapshotBaselinePath = destSnapshot;
    logger.info(`Snapshot baseline updated: ${destSnapshot}`);
  }

  mkdirSync(BASELINE_SCREENSHOTS_DIR, { recursive: true });
  let screenshotCount = 0;
  for (const target of allTargets) {
    const srcPath = captured.get(target.key);
    if (srcPath && existsSync(srcPath)) {
      const destPath = resolve(BASELINE_SCREENSHOTS_DIR, target.fileName);
      cpSync(srcPath, destPath, { force: true });
      screenshotCount++;
    }
  }
  logger.info(`Screenshot baselines updated: ${screenshotCount} files in ${BASELINE_SCREENSHOTS_DIR}`);

  // Step 8: write promote report
  const promoteReport = renderPromoteReport({
    changeSetId,
    status: 'promoted',
    gates: 'passed',
    markerPresent: gateResult.gateChecks.markerPresent,
    statusApproved: gateResult.gateChecks.statusApproved,
    reportSha256Match: gateResult.gateChecks.reportSha256Match,
    buildStatus: 'passed',
    smokeStatus: 'passed',
    distDevPath: distDev,
    snapshotBaseline: snapshotBaselinePath,
    screenshotBaseline: BASELINE_SCREENSHOTS_DIR,
    promotedAt,
    failures: [],
    smokeRows,
    screenshotCount,
  });
  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(promoteReportPath, promoteReport, 'utf-8');

  // Step 9: touch .promoted marker
  writeFileSync(resolve(REPORTS_DIR, `${changeSetId}.promoted`), '', 'utf-8');

  // Step 10: done
  logger.success(`Promote-dev complete for ${changeSetId}. Report: ${promoteReportPath}`);
}

main().catch(err => {
  logger.error(`Unhandled promote-dev error: ${String(err)}`);
  process.exit(1);
});
