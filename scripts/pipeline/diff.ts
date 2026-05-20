import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './lib/logger.ts';
import {
  diffSnapshots,
  selectSnapshotPair,
  type SnapshotFile,
} from './lib/diff-snapshot.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const SNAPSHOTS_DIR = resolve(REPO_ROOT, '.automation/snapshots');
const BASELINE_DIR = resolve(REPO_ROOT, '.automation/baseline');
const DIFFS_DIR = resolve(REPO_ROOT, '.automation/diffs');

const logger = createLogger('diff');

function main(): void {
  logger.info('Starting diff.ts — compare approved baseline against latest snapshot');

  const snapshotFiles = listJsonFiles(SNAPSHOTS_DIR);
  const baselineFiles = listJsonFiles(BASELINE_DIR);
  const pair = selectSnapshotPair(snapshotFiles, baselineFiles);

  if (!pair) {
    logger.error(
      `Need an approved baseline or at least two snapshots. Found snapshots=${snapshotFiles.length}, baselines=${baselineFiles.length}`
    );
    process.exit(1);
  }

  if (pair.comparisonMode === 'bootstrap-latest-two') {
    logger.warn(
      'No approved baseline found. Using latest two snapshots as bootstrap fallback for 5-3 testing only.'
    );
  }

  const baseDir = pair.comparisonMode === 'baseline' ? BASELINE_DIR : SNAPSHOTS_DIR;
  const basePath = resolve(baseDir, pair.baseFile);
  const headPath = resolve(SNAPSHOTS_DIR, pair.headFile);

  const base = readSnapshot(basePath);
  const head = readSnapshot(headPath);

  const diff = diffSnapshots(base, head, {
    comparisonMode: pair.comparisonMode,
    basePath,
    headPath,
  });

  mkdirSync(DIFFS_DIR, { recursive: true });
  const outputPath = resolve(DIFFS_DIR, `${safeTimestamp(diff.generatedAt)}.json`);
  writeFileSync(outputPath, JSON.stringify(diff, null, 2), 'utf-8');

  logger.success(`Diff written: ${outputPath}`);
  logger.info(`Base: ${basename(basePath)} (${diff.baseTs})`);
  logger.info(`Head: ${basename(headPath)} (${diff.headTs})`);
  logger.info(`Changes: ${diff.changes.length}`);
}

function listJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter(file => file.endsWith('.json') && !file.endsWith('-classified.json'))
    .sort();
}

function readSnapshot(path: string): SnapshotFile {
  return JSON.parse(readFileSync(path, 'utf-8')) as SnapshotFile;
}

function safeTimestamp(timestamp: string): string {
  return timestamp.replace(/:/g, '-').replace(/\..+$/, '');
}

main();
