import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createLogger } from './lib/logger.ts';
import { loadFigmaMapping, resolveCodePath } from './lib/config-loader.ts';
import { renderApplyReport, type MissingMarkerFollowUp } from './lib/apply-report.ts';
import { shouldApplyTokens } from './lib/apply-token.ts';
import {
  applyMarkedPropUpdates,
  applyMarkedTextUpdates,
  extractComponentPropUpdates,
  extractTextUpdates,
  type ComponentPropUpdate,
  type TextUpdate,
} from './lib/apply-code.ts';
import { generateThemeBlock, replaceThemeBlock } from './lib/token-css.ts';
import type { ClassifiedDiffFile } from './lib/classify-diff.ts';
import type { SnapshotFile } from './lib/diff-snapshot.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const SRC_DIR = resolve(REPO_ROOT, 'src');
const DIFFS_DIR = resolve(REPO_ROOT, '.automation/diffs');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');
const BACKUPS_DIR = resolve(REPO_ROOT, '.automation/backups');
const BASELINE_DIR = resolve(REPO_ROOT, '.automation/baseline');
const INDEX_BASELINE = resolve(BASELINE_DIR, 'index.css');

const logger = createLogger('apply');

function main(): void {
  logger.info('Starting apply.ts — M1 tokens + M2 text + M3 component-props auto-apply');

  const classifiedPath = findLatestClassifiedDiff();
  if (!classifiedPath) {
    logger.error(`No classified diff JSON found in ${DIFFS_DIR}. Run npm run figma:classify first.`);
    process.exit(1);
  }

  const classified = JSON.parse(readFileSync(classifiedPath, 'utf-8')) as ClassifiedDiffFile;
  const mapping = loadFigmaMapping();
  const indexCssPath = resolveCodePath(mapping.tokens.output.css);
  const baseSnapshot = readSnapshot(classified.basePath);
  const headSnapshot = readSnapshot(classified.headPath);

  ensureIndexBaseline(indexCssPath);

  const changeSetId = `cs-${safeTimestamp(classified.generatedAt)}`;
  const reportPath = resolve(REPORTS_DIR, `apply-${changeSetId}.md`);
  const shouldApplyTokenCss = shouldApplyTokens(classified);
  const textUpdates = extractTextUpdates(classified, baseSnapshot, headSnapshot);
  const propUpdates = extractComponentPropUpdates(classified, baseSnapshot, headSnapshot);
  const codeApplyPlan = planCodeApply(textUpdates, propUpdates);

  if (!shouldApplyTokenCss && codeApplyPlan.changedFiles.length === 0) {
    mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(
      reportPath,
      renderApplyReport({
        changeSetId,
        classifiedPath,
        status: 'noop',
        changedFiles: [],
        message: 'No marked auto-apply token/text/component-props changes found in latest classified diff.',
        missingMarkers: codeApplyPlan.missingMarkers,
      }),
      'utf-8'
    );
    logger.info('No marked auto-apply changes found. Apply is a no-op.');
    logger.success(`Apply report written: ${reportPath}`);
    return;
  }

  const backupDir = resolve(BACKUPS_DIR, changeSetId);
  backupSrc(backupDir);

  try {
    if (shouldApplyTokenCss) {
      applyTokenCss(indexCssPath, resolveCodePath(mapping.tokens.source.file));
    }
    applyCodePlan(codeApplyPlan);
    runVerification();
  } catch (err) {
    logger.error(`Apply failed, rolling back: ${String(err)}`);
    restoreSrc(backupDir);
    process.exit(1);
  }

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(
    reportPath,
      renderApplyReport({
        changeSetId,
        classifiedPath,
        status: 'applied',
        changedFiles: [
          ...(shouldApplyTokenCss ? ['src/index.css'] : []),
          ...codeApplyPlan.changedFiles,
        ],
        message: 'Auto-apply completed and build/lint verification passed.',
        missingMarkers: codeApplyPlan.missingMarkers,
      }),
      'utf-8'
    );

  logger.success(`Apply report written: ${reportPath}`);
}

function readSnapshot(path: string): SnapshotFile {
  return JSON.parse(readFileSync(path, 'utf-8')) as SnapshotFile;
}

function applyTokenCss(indexCssPath: string, tokensPath: string): void {
  logger.info(`Generating @theme block from ${tokensPath}`);
  const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8')) as Record<string, unknown>;
  const themeBlock = generateThemeBlock(tokens);
  const currentCss = readFileSync(indexCssPath, 'utf-8');
  const nextCss = replaceThemeBlock(currentCss, themeBlock);

  writeFileSync(indexCssPath, nextCss, 'utf-8');
  logger.success(`Updated @theme block: ${indexCssPath}`);
}

function planCodeApply(
  textUpdates: TextUpdate[],
  propUpdates: ComponentPropUpdate[]
): {
  files: Map<string, string>;
  changedFiles: string[];
  missingMarkers: MissingMarkerFollowUp[];
} {
  const nextSources = new Map<string, string>();
  const missingMarkers: MissingMarkerFollowUp[] = [];
  const allFiles = new Set([...textUpdates.map(update => update.code), ...propUpdates.map(update => update.code)]);

  for (const codePath of allFiles) {
    const absPath = resolveCodePath(codePath);
    const source = readFileSync(absPath, 'utf-8');
    const textResult = applyMarkedTextUpdates(
      source,
      textUpdates.filter(update => update.code === codePath)
    );
    const propResult = applyMarkedPropUpdates(
      textResult.source,
      propUpdates.filter(update => update.code === codePath)
    );

    if (textResult.missingNodeIds.length > 0) {
      missingMarkers.push({ kind: 'text', code: codePath, nodeIds: textResult.missingNodeIds });
      logger.warn(`${codePath}: no text marker found for node(s): ${textResult.missingNodeIds.join(', ')}`);
    }
    if (propResult.missingNodeIds.length > 0) {
      missingMarkers.push({
        kind: 'component-props',
        code: codePath,
        nodeIds: propResult.missingNodeIds,
      });
      logger.warn(`${codePath}: no component-props marker found for node(s): ${propResult.missingNodeIds.join(', ')}`);
    }

    if (textResult.changed || propResult.changed) {
      nextSources.set(absPath, propResult.source);
    }
  }

  return {
    files: nextSources,
    changedFiles: [...nextSources.keys()].map(path => path.replace(`${REPO_ROOT}/`, '')),
    missingMarkers,
  };
}

function applyCodePlan(plan: { files: Map<string, string> }): void {
  for (const [path, source] of plan.files) {
    writeFileSync(path, source, 'utf-8');
    logger.success(`Updated marked code changes: ${path}`);
  }
}

function ensureIndexBaseline(indexCssPath: string): void {
  mkdirSync(BASELINE_DIR, { recursive: true });
  if (existsSync(INDEX_BASELINE)) {
    return;
  }
  cpSync(indexCssPath, INDEX_BASELINE);
  logger.info(`Preserved initial index.css baseline: ${INDEX_BASELINE}`);
}

function backupSrc(backupDir: string): void {
  if (existsSync(backupDir)) {
    rmSync(backupDir, { recursive: true, force: true });
  }
  mkdirSync(backupDir, { recursive: true });
  cpSync(SRC_DIR, resolve(backupDir, 'src'), { recursive: true });
  logger.info(`Source backup written: ${backupDir}`);
}

function restoreSrc(backupDir: string): void {
  const srcBackup = resolve(backupDir, 'src');
  if (!existsSync(srcBackup)) {
    logger.error(`Rollback backup missing: ${srcBackup}`);
    return;
  }
  rmSync(SRC_DIR, { recursive: true, force: true });
  cpSync(srcBackup, SRC_DIR, { recursive: true });
  logger.warn(`Source restored from backup: ${srcBackup}`);
}

function runVerification(): void {
  runCommand('npm', ['run', 'build']);
  runCommand('npm', ['run', 'lint']);
}

function runCommand(command: string, args: string[]): void {
  logger.info(`Running: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit ${String(result.status)}`);
  }
}

function findLatestClassifiedDiff(): string | null {
  if (!existsSync(DIFFS_DIR)) {
    return null;
  }

  const files = readdirSync(DIFFS_DIR)
    .filter(file => file.endsWith('-classified.json'))
    .sort()
    .reverse();

  return files[0] ? resolve(DIFFS_DIR, files[0]) : null;
}

function safeTimestamp(timestamp: string): string {
  return timestamp.replace(/:/g, '-').replace(/\..+$/, '');
}

main();
