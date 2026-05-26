// Pure decision function for the daily figma-audit Issue management.
//
// Background: figma-audit runs daily and surfaces the absolute count of
// design-system violations as a GitHub Issue with the `audit` label. The
// original implementation closed every open audit Issue and created a fresh
// one on every run — even when the scalar counts hadn't changed at all.
// That produced #122/#133-style noise where the audit-label inbox accrued a
// new Issue every morning that said the exact same thing.
//
// Strategy: parse the previous Issue's title (which already encodes the
// counts in canonical form `[audit] YYYY-MM-DD — N detached styles, M
// unregistered frames`). If the current run's (detached, unreg) tuple
// matches, **reuse** the existing Issue with a heartbeat comment. If it
// differs (or no recognizable previous Issue exists), **create** a new one
// and close the olds (existing behavior).
//
// The function is intentionally pure — it does no I/O. The CLI wrapper
// (audit-issue.ts) fetches the latest open audit Issue via octokit, calls
// this function, and acts on the returned decision.

export interface IssueDecisionInput {
  /** Title of the most recently opened audit-label Issue, or null if none. */
  prevTitle: string | null;
  /** Issue number of the most recently opened audit-label Issue, or null. */
  prevNumber: number | null;
  /** Current run's total detached-style count. */
  currentDetached: number;
  /** Current run's total unregistered-frame count. */
  currentUnreg: number;
}

export type IssueAction = 'reuse' | 'create';

export interface IssueDecision {
  action: IssueAction;
  /** Set when action === 'reuse'. */
  reuseNumber?: number;
  /** Human-readable rationale, surfaced to workflow logs for debuggability. */
  reason: string;
}

// Matches "— N detached styles, M unregistered frames" (singular and plural
// forms both accepted to survive future copy edits).
const TITLE_COUNT_RE = /—\s*(\d+)\s+detached\s+styles?,\s*(\d+)\s+unregistered\s+frames?/;

export function decideAuditIssueAction(input: IssueDecisionInput): IssueDecision {
  if (!input.prevTitle || input.prevNumber == null) {
    return { action: 'create', reason: 'no previous open audit Issue' };
  }
  const m = input.prevTitle.match(TITLE_COUNT_RE);
  if (!m) {
    return {
      action: 'create',
      reason: `previous title format unrecognized: ${input.prevTitle}`,
    };
  }
  const prevDetached = parseInt(m[1], 10);
  const prevUnreg = parseInt(m[2], 10);
  if (prevDetached === input.currentDetached && prevUnreg === input.currentUnreg) {
    return {
      action: 'reuse',
      reuseNumber: input.prevNumber,
      reason: `counts unchanged (${prevDetached} detached / ${prevUnreg} unregistered)`,
    };
  }
  return {
    action: 'create',
    reason: `counts changed (detached ${prevDetached}→${input.currentDetached}, unregistered ${prevUnreg}→${input.currentUnreg})`,
  };
}

// Heartbeat comment body used when an existing Issue is reused. Keep it
// terse — designers see this as a "still ${N}" daily notification, not a
// full report.
export function buildHeartbeatCommentBody(input: {
  dateUtc: string;
  detached: number;
  unreg: number;
  autoReg: number;
  runUrl: string;
}): string {
  return [
    `${input.dateUtc} audit re-run: counts unchanged (${input.detached} detached / ${input.unreg} unregistered / ${input.autoReg} auto-registered).`,
    '',
    `Workflow run: ${input.runUrl}`,
  ].join('\n');
}
