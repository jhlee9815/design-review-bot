import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './lib/logger.ts';
import { loadFigmaMapping } from './lib/config-loader.ts';
import { classifyDiff } from './lib/classify-diff.ts';
import { renderReportOnlyMarkdown } from './lib/report-only-guidance.ts';
import type { DiffFile } from './lib/diff-snapshot.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const DIFFS_DIR = resolve(REPO_ROOT, '.automation/diffs');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');

const logger = createLogger('classify');

function main(): void {
  logger.info('Starting classify.ts — map diff changes to automation decisions');

  const inputPath = findLatestRawDiff();
  if (!inputPath) {
    logger.error(`No raw diff JSON found in ${DIFFS_DIR}. Run npm run figma:diff first.`);
    process.exit(1);
  }

  const diff = JSON.parse(readFileSync(inputPath, 'utf-8')) as DiffFile;
  if (diff.stage !== 'diff') {
    logger.error(`Input is not a raw diff file: ${inputPath}`);
    process.exit(1);
  }

  const mapping = loadFigmaMapping();
  const classified = classifyDiff(diff, mapping);

  mkdirSync(DIFFS_DIR, { recursive: true });
  mkdirSync(REPORTS_DIR, { recursive: true });

  const outputPath = resolve(
    DIFFS_DIR,
    `${safeTimestamp(classified.generatedAt)}-classified.json`
  );
  writeFileSync(outputPath, JSON.stringify(classified, null, 2), 'utf-8');

  const reportOnly = classified.changes.filter(change => change.decision === 'report-only');
  if (reportOnly.length > 0) {
    const reportPath = resolve(
      REPORTS_DIR,
      `diff-report-only-${safeTimestamp(classified.generatedAt)}.md`
    );
    writeFileSync(reportPath, renderReportOnlyMarkdown(classified, reportOnly), 'utf-8');
    logger.info(`Report-only markdown written: ${reportPath}`);
  }

  logger.success(`Classified diff written: ${outputPath}`);
  logger.info(`Input: ${basename(inputPath)}`);
  logger.info(
    `Summary: total=${classified.summary.total}, autoApply=${classified.summary.autoApply}, reportOnly=${classified.summary.reportOnly}, unknown=${classified.summary.unknown}`
  );
}

function findLatestRawDiff(): string | null {
  if (!existsSync(DIFFS_DIR)) {
    return null;
  }

  const files = readdirSync(DIFFS_DIR)
    .filter(file => file.endsWith('.json') && !file.endsWith('-classified.json'))
    .sort()
    .reverse();

  for (const file of files) {
    const path = resolve(DIFFS_DIR, file);
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf-8')) as { stage?: string };
      if (parsed.stage === 'diff') {
        return path;
      }
    } catch {
      logger.warn(`Skipping malformed diff file: ${path}`);
    }
  }

  return null;
}

function safeTimestamp(timestamp: string): string {
  return timestamp.replace(/:/g, '-').replace(/\..+$/, '');
}

main();
