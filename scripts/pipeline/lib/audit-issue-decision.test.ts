import assert from 'node:assert/strict';
import {
  buildHeartbeatCommentBody,
  decideAuditIssueAction,
} from './audit-issue-decision.ts';

type Case = () => void;
let failed = 0;
function run(label: string, fn: Case): void {
  try {
    fn();
    console.log(`ok  ${label}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${label}`);
    console.error(err instanceof Error ? err.stack ?? err.message : err);
  }
}

run('T1 no previous Issue -> create', () => {
  const d = decideAuditIssueAction({
    prevTitle: null,
    prevNumber: null,
    currentDetached: 1295,
    currentUnreg: 0,
  });
  assert.equal(d.action, 'create');
  assert.match(d.reason, /no previous open audit Issue/);
});

run('T2 identical counts -> reuse', () => {
  const d = decideAuditIssueAction({
    prevTitle: '[audit] 2026-05-25 — 1295 detached styles, 0 unregistered frames',
    prevNumber: 133,
    currentDetached: 1295,
    currentUnreg: 0,
  });
  assert.equal(d.action, 'reuse');
  assert.equal(d.reuseNumber, 133);
  assert.match(d.reason, /counts unchanged/);
});

run('T3 different detached -> create', () => {
  const d = decideAuditIssueAction({
    prevTitle: '[audit] 2026-05-25 — 1295 detached styles, 0 unregistered frames',
    prevNumber: 133,
    currentDetached: 1280,
    currentUnreg: 0,
  });
  assert.equal(d.action, 'create');
  assert.match(d.reason, /1295→1280/);
});

run('T4 different unreg -> create', () => {
  const d = decideAuditIssueAction({
    prevTitle: '[audit] 2026-05-25 — 1295 detached styles, 0 unregistered frames',
    prevNumber: 133,
    currentDetached: 1295,
    currentUnreg: 2,
  });
  assert.equal(d.action, 'create');
  assert.match(d.reason, /0→2/);
});

run('T5 malformed title -> create (safe fallback)', () => {
  const d = decideAuditIssueAction({
    prevTitle: 'random non-audit title',
    prevNumber: 99,
    currentDetached: 1295,
    currentUnreg: 0,
  });
  assert.equal(d.action, 'create');
  assert.match(d.reason, /unrecognized/);
});

run('T6 singular form "1 detached style, 1 unregistered frame"', () => {
  // Defensive — workflow currently always pluralizes, but be tolerant
  const d = decideAuditIssueAction({
    prevTitle: '[audit] 2026-05-26 — 1 detached style, 1 unregistered frame',
    prevNumber: 200,
    currentDetached: 1,
    currentUnreg: 1,
  });
  assert.equal(d.action, 'reuse');
});

run('T7 zero counts identical -> reuse', () => {
  // Edge case: 0/0 won't trigger has_violations so this path isn't hit live,
  // but the function should still be deterministic in that case.
  const d = decideAuditIssueAction({
    prevTitle: '[audit] 2026-05-25 — 0 detached styles, 0 unregistered frames',
    prevNumber: 1,
    currentDetached: 0,
    currentUnreg: 0,
  });
  assert.equal(d.action, 'reuse');
});

run('T8 prevNumber null with title -> create', () => {
  const d = decideAuditIssueAction({
    prevTitle: '[audit] 2026-05-25 — 100 detached styles, 0 unregistered frames',
    prevNumber: null,
    currentDetached: 100,
    currentUnreg: 0,
  });
  assert.equal(d.action, 'create');
  assert.match(d.reason, /no previous open audit Issue/);
});

run('T9 heartbeat comment body shape', () => {
  const body = buildHeartbeatCommentBody({
    dateUtc: '2026-05-26',
    detached: 1295,
    unreg: 0,
    autoReg: 0,
    runUrl: 'https://github.com/x/y/actions/runs/123',
  });
  assert.match(body, /2026-05-26 audit re-run: counts unchanged/);
  assert.match(body, /1295 detached/);
  assert.match(body, /0 unregistered/);
  assert.match(body, /0 auto-registered/);
  assert.match(body, /actions\/runs\/123/);
});

if (failed > 0) {
  console.error(`\n${failed} test case(s) failed`);
  process.exit(1);
}
console.log('\nall audit-issue-decision tests passed');
