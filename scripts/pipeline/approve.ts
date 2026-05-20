import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { approveReport, parseReviewReport } from './lib/designer-review.ts';
import { createLogger } from './lib/logger.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');

const logger = createLogger('approve');

function main(): void {
  const changeSetId = process.argv[2];
  if (!changeSetId) {
    logger.error('Usage: npm run figma:approve <change-set-id>');
    process.exit(1);
  }

  const reportPath = resolve(REPORTS_DIR, `${changeSetId}.md`);
  if (!existsSync(reportPath)) {
    logger.error(`Designer review report not found: ${reportPath}`);
    process.exit(1);
  }

  const current = readFileSync(reportPath, 'utf-8');
  const parsed = parseReviewReport(current, reportPath);
  if (parsed.frontmatter.status === 'rejected') {
    logger.error(`Cannot approve rejected report without regenerating it: ${reportPath}`);
    process.exit(1);
  }

  const approved = approveReport(current, {
    approvedBy: process.env.USER || 'local-designer',
    approvedAt: new Date().toISOString(),
  });
  writeFileSync(reportPath, approved, 'utf-8');
  writeFileSync(resolve(REPORTS_DIR, `${changeSetId}.approved`), '', 'utf-8');

  logger.success(`Approved change set: ${changeSetId}`);
}

main();
