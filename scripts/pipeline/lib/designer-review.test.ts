import assert from 'node:assert/strict';
import {
  approveReport,
  buildDesignerReport,
  parseReviewReport,
  rejectReport,
  shouldCreateDesignerReport,
} from './designer-review.ts';

const report = buildDesignerReport({
  changeSetId: 'cs-test',
  classifiedPath: '/tmp/classified.json',
  applyReportPath: '/tmp/apply.md',
  verifyReportPath: '/tmp/verify.md',
  reportOnlyReportPath: '/tmp/diff-report-only.md',
  classifiedSummary: {
    total: 1,
    autoApply: 1,
    reportOnly: 0,
    unknown: 0,
  },
  applyStatus: 'applied',
  verifyStatus: 'passed',
  changedFiles: ['src/index.css'],
  visualReportPath: '/tmp/reports/cs-test/visual-diff.md',
  verificationRows: [
    { check: 'build', status: 'passed', message: '' },
    { check: 'visual', status: 'passed', message: '0.25%' },
  ],
  generatedAt: '2026-05-04T00:00:00.000Z',
  artifactsSha256: 'sha256:artifacts',
});

const parsed = parseReviewReport(report, '/tmp/cs-test.md');
assert.equal(parsed.frontmatter.changeSetId, 'cs-test');
assert.equal(parsed.frontmatter.status, 'pending');
assert.equal(parsed.frontmatter.reportSha256, parsed.bodySha256);
assert.equal(parsed.frontmatter.artifactsSha256, 'sha256:artifacts');
assert.match(parsed.body, /# Change Set cs-test/);
assert.match(parsed.body, /Report-only detail: `\/tmp\/diff-report-only.md`/);
assert.match(parsed.body, /Visual diff: `\/tmp\/reports\/cs-test\/visual-diff.md`/);
assert.match(parsed.body, /승인: `npm run figma:approve cs-test`/);

const approved = approveReport(report, {
  approvedBy: 'designer',
  approvedAt: '2026-05-04T01:00:00.000Z',
});
const approvedParsed = parseReviewReport(approved, '/tmp/cs-test.md');
assert.equal(approvedParsed.frontmatter.status, 'approved');
assert.equal(approvedParsed.frontmatter.approvedBy, 'designer');
assert.equal(approvedParsed.frontmatter.approvedAt, '2026-05-04T01:00:00.000Z');
assert.equal(approvedParsed.frontmatter.rejectReason, 'null');
assert.equal(approvedParsed.frontmatter.reportSha256, approvedParsed.bodySha256);

const rejected = rejectReport(report, {
  reason: 'copy needs another pass',
});
const rejectedParsed = parseReviewReport(rejected, '/tmp/cs-test.md');
assert.equal(rejectedParsed.frontmatter.status, 'rejected');
assert.equal(rejectedParsed.frontmatter.rejectReason, 'copy needs another pass');
assert.equal(rejectedParsed.frontmatter.approvedBy, 'null');
assert.equal(rejectedParsed.frontmatter.reportSha256, rejectedParsed.bodySha256);

assert.equal(
  shouldCreateDesignerReport({ total: 0, autoApply: 0, reportOnly: 0, unknown: 0 }),
  false
);
assert.equal(
  shouldCreateDesignerReport({ total: 1, autoApply: 0, reportOnly: 1, unknown: 0 }),
  true
);
