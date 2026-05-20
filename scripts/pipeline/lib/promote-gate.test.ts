import assert from 'node:assert/strict';
import { buildDesignerReport, approveReport, rejectReport } from './designer-review.ts';
import { verifyPromotionGates } from './promote-gate.ts';

const baseInput = {
  changeSetId: 'cs-test',
  classifiedPath: '/tmp/classified.json',
  applyReportPath: '/tmp/apply.md',
  verifyReportPath: '/tmp/verify.md',
  classifiedSummary: { total: 0, autoApply: 0, reportOnly: 0, unknown: 0 },
  applyStatus: 'noop',
  verifyStatus: 'passed',
  changedFiles: [],
  verificationRows: [{ check: 'build', status: 'passed', message: '' }],
  generatedAt: '2026-05-04T00:00:00.000Z',
  artifactsSha256: 'sha256:artifacts',
};

const pendingReport = buildDesignerReport(baseInput);
const approvedReport = approveReport(pendingReport, {
  approvedBy: 'designer',
  approvedAt: '2026-05-04T01:00:00.000Z',
});
const rejectedReport = rejectReport(pendingReport, { reason: 'no' });

// Case 1 — all gates pass
{
  const result = verifyPromotionGates({
    reportMarkdown: approvedReport,
    approvedMarkerExists: true,
    reportPath: '/tmp/cs-test.md',
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.failures, []);
  assert.equal(result.gateChecks.markerPresent, true);
  assert.equal(result.gateChecks.statusApproved, true);
  assert.equal(result.gateChecks.reportSha256Match, true);
}

// Case 2 — gate 1 fails (no .approved marker)
{
  const result = verifyPromotionGates({
    reportMarkdown: approvedReport,
    approvedMarkerExists: false,
    reportPath: '/tmp/cs-test.md',
  });
  assert.equal(result.ok, false);
  assert.equal(result.gateChecks.markerPresent, false);
  assert.match(result.failures.join('\n'), /\.approved marker/);
}

// Case 3 — gate 2 fails (status pending)
{
  const result = verifyPromotionGates({
    reportMarkdown: pendingReport,
    approvedMarkerExists: true,
    reportPath: '/tmp/cs-test.md',
  });
  assert.equal(result.ok, false);
  assert.equal(result.gateChecks.statusApproved, false);
  assert.match(result.failures.join('\n'), /status.*pending/);
}

// Case 4 — gate 2 fails (status rejected)
{
  const result = verifyPromotionGates({
    reportMarkdown: rejectedReport,
    approvedMarkerExists: true,
    reportPath: '/tmp/cs-test.md',
  });
  assert.equal(result.ok, false);
  assert.equal(result.gateChecks.statusApproved, false);
  assert.match(result.failures.join('\n'), /status.*rejected/);
}

// Case 5 — gate 3 fails (body tampered after approval)
{
  const tampered = approvedReport + '\n<!-- injected after approval -->\n';
  const result = verifyPromotionGates({
    reportMarkdown: tampered,
    approvedMarkerExists: true,
    reportPath: '/tmp/cs-test.md',
  });
  assert.equal(result.ok, false);
  assert.equal(result.gateChecks.reportSha256Match, false);
  assert.match(result.failures.join('\n'), /reportSha256/);
}

// Case 6 — multi-failure (no marker AND status pending)
{
  const result = verifyPromotionGates({
    reportMarkdown: pendingReport,
    approvedMarkerExists: false,
    reportPath: '/tmp/cs-test.md',
  });
  assert.equal(result.ok, false);
  assert.equal(result.failures.length, 2);
}

console.log('promote-gate.test.ts — all assertions passed');
