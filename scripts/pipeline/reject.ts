import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseReviewReport, rejectReport } from './lib/designer-review.ts';
import { createLogger } from './lib/logger.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');

const logger = createLogger('reject');

function main(): void {
  const changeSetId = process.argv[2];
  const reason = process.argv.slice(3).join(' ').trim();
  if (!changeSetId || !reason) {
    logger.error('Usage: npm run figma:reject <change-set-id> "reason"');
    process.exit(1);
  }

  const reportPath = resolve(REPORTS_DIR, `${changeSetId}.md`);
  if (!existsSync(reportPath)) {
    logger.error(`Designer review report not found: ${reportPath}`);
    process.exit(1);
  }

  const current = readFileSync(reportPath, 'utf-8');
  const parsed = parseReviewReport(current, reportPath);
  if (parsed.frontmatter.status === 'approved') {
    logger.error(`Cannot reject approved report without regenerating it: ${reportPath}`);
    process.exit(1);
  }

  const rejected = rejectReport(current, { reason });
  writeFileSync(reportPath, rejected, 'utf-8');
  writeFileSync(resolve(REPORTS_DIR, `${changeSetId}.rejected`), reason + '\n', 'utf-8');

  logger.success(`Rejected change set: ${changeSetId}`);
}

main();
