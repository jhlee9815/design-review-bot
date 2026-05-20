import assert from 'node:assert/strict';
import {
  parseApplyReport,
  renderVerifyReport,
  summarizeVerification,
} from './verify-report.ts';

const applyReport = [
  '---',
  'changeSetId: cs-2026-05-04T03-35-16',
  'status: noop',
  'classifiedPath: /tmp/classified.json',
  '---',
  '',
  '# Apply Report',
  '',
  'No auto-apply token changes found.',
  '',
].join('\n');

const parsed = parseApplyReport(applyReport, '/tmp/apply.md');
assert.equal(parsed.changeSetId, 'cs-2026-05-04T03-35-16');
assert.equal(parsed.status, 'noop');
assert.equal(parsed.classifiedPath, '/tmp/classified.json');
assert.equal(parsed.path, '/tmp/apply.md');

const summary = summarizeVerification({
  apply: parsed,
  checks: [
    { name: 'build', command: 'npm run build', status: 'passed', exitCode: 0 },
    { name: 'lint', command: 'npm run lint', status: 'passed', exitCode: 0 },
    {
      name: 'visual',
      command: 'Playwright visual diff',
      status: 'skipped',
      message: 'No changed files in apply report.',
    },
  ],
});

assert.equal(summary.status, 'passed');
assert.equal(summary.blockingFailures, 0);
assert.equal(summary.skipped, 1);

const markdown = renderVerifyReport(summary);
assert.match(markdown, /changeSetId: cs-2026-05-04T03-35-16/);
assert.match(markdown, /status: passed/);
assert.ok(markdown.includes('| build | `npm run build` | passed | 0 |  |'));
assert.ok(
  markdown.includes(
    '| visual | `Playwright visual diff` | skipped |  | No changed files in apply report. |'
  )
);

const failed = summarizeVerification({
  apply: parsed,
  checks: [
    { name: 'build', command: 'npm run build', status: 'failed', exitCode: 1, message: 'tsc failed' },
  ],
});

assert.equal(failed.status, 'failed');
assert.equal(failed.blockingFailures, 1);
