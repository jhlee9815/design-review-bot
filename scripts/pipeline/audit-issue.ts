#!/usr/bin/env tsx
/**
 * audit-issue.ts
 *
 * Creates or refreshes the daily figma-audit GitHub Issue. Replaces the
 * inline bash block that used to live in `.github/workflows/figma-audit.yml`.
 *
 * Behavior:
 *   - If the most recent open audit-label Issue has the same scalar counts
 *     (detached + unregistered) as the current run, post a heartbeat
 *     comment on it and reuse the existing Issue. Avoids #122/#133-style
 *     daily inbox noise when the underlying state is stable.
 *   - Otherwise, close all open audit-label Issues and create a fresh one
 *     (preserves the prior "Superseded" cleanup behavior).
 *
 * Env (required):
 *   GITHUB_TOKEN        — repo-scoped token with issues:write
 *   GITHUB_REPOSITORY   — "owner/repo"
 *   DETACHED            — current detached-style total (integer)
 *   UNREG               — current unregistered-frame total (integer)
 *   AUTO_REG            — number of auto-registered candidates this run
 *   RUN_URL             — workflow run URL (for cross-reference)
 *
 * Env (optional):
 *   AUDIT_MD            — path to the markdown audit report (head appended
 *                         to new-Issue body)
 *   DRY_RUN=1           — log decision without calling GitHub API
 *
 * Output (stdout): two GITHUB_OUTPUT-style lines so the workflow can
 *   capture the URL and the reused flag.
 *
 *     issue_url=<html_url>
 *     reused=<true|false>
 */

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { Octokit } from 'octokit';
import {
  buildHeartbeatCommentBody,
  decideAuditIssueAction,
} from './lib/audit-issue-decision.ts';

interface Env {
  token: string;
  owner: string;
  repo: string;
  detached: number;
  unreg: number;
  autoReg: number;
  runUrl: string;
  auditMdPath: string | undefined;
  dryRun: boolean;
}

function readEnv(): Env {
  const required = (name: string): string => {
    const v = process.env[name];
    if (!v) {
      console.error(`[audit-issue] env ${name} required`);
      process.exit(1);
    }
    return v;
  };
  const repo = required('GITHUB_REPOSITORY').split('/');
  if (repo.length !== 2) {
    console.error('[audit-issue] GITHUB_REPOSITORY must be owner/repo');
    process.exit(1);
  }
  return {
    token: required('GITHUB_TOKEN'),
    owner: repo[0],
    repo: repo[1],
    detached: parseInt(required('DETACHED'), 10),
    unreg: parseInt(required('UNREG'), 10),
    autoReg: parseInt(process.env.AUTO_REG ?? '0', 10),
    runUrl: required('RUN_URL'),
    auditMdPath: process.env.AUDIT_MD,
    dryRun: process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true',
  };
}

function emitOutputs(issueUrl: string, reused: boolean): void {
  console.log(`issue_url=${issueUrl}`);
  console.log(`reused=${reused}`);
  const ghOutput = process.env.GITHUB_OUTPUT;
  if (ghOutput) {
    appendFileSync(ghOutput, `issue_url=${issueUrl}\nreused=${reused}\n`);
  }
}

function buildNewIssueBody(env: Env, dateUtc: string): string {
  let reportHead = '(report file missing)';
  if (env.auditMdPath && existsSync(env.auditMdPath)) {
    const md = readFileSync(env.auditMdPath, 'utf-8');
    reportHead = md.split('\n').slice(0, 80).join('\n');
  }
  return [
    'Daily Figma DS audit found violations.',
    '',
    `- Detached styles: **${env.detached}**`,
    `- Unregistered top-level frames: **${env.unreg}**`,
    `- Auto-registered this run: **${env.autoReg}**`,
    '',
    `Workflow run: ${env.runUrl}`,
    'Full report attached as workflow artifact (`.automation/audits/audit-*.md`).',
    '',
    '---',
    '',
    '<details><summary>Top of audit report</summary>',
    '',
    reportHead,
    '',
    '</details>',
    '',
    `_Created on ${dateUtc} by figma-audit workflow._`,
  ].join('\n');
}

async function main(): Promise<void> {
  const env = readEnv();
  const octokit = new Octokit({ auth: env.token });
  const { owner, repo } = env;
  const dateUtc = new Date().toISOString().slice(0, 10);

  // Fetch the most recent open audit-label Issue. In DRY_RUN we'd still
  // like to inspect the live state when possible; if the token is invalid
  // (common for local smoke tests), fall back to "no previous Issue" so the
  // decision function can still be exercised.
  let openIssues: Array<{ number: number; title: string; html_url: string }> = [];
  try {
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'audit',
      per_page: 100,
      sort: 'created',
      direction: 'desc',
    });
    openIssues = data.map(d => ({ number: d.number, title: d.title, html_url: d.html_url }));
  } catch (err) {
    if (!env.dryRun) throw err;
    console.warn('[audit-issue] DRY_RUN: failed to list issues, assuming none:', err instanceof Error ? err.message : err);
  }
  const latest = openIssues[0];

  const decision = decideAuditIssueAction({
    prevTitle: latest?.title ?? null,
    prevNumber: latest?.number ?? null,
    currentDetached: env.detached,
    currentUnreg: env.unreg,
  });
  console.log(`[audit-issue] decision=${decision.action} reason=${decision.reason}`);

  if (env.dryRun) {
    console.log('[audit-issue] DRY_RUN=1 — skipping GitHub API mutations');
    emitOutputs(latest?.html_url ?? '', decision.action === 'reuse');
    return;
  }

  if (decision.action === 'reuse' && decision.reuseNumber) {
    const body = buildHeartbeatCommentBody({
      dateUtc,
      detached: env.detached,
      unreg: env.unreg,
      autoReg: env.autoReg,
      runUrl: env.runUrl,
    });
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: decision.reuseNumber,
      body,
    });
    // Preserve the "at most one open audit Issue" invariant. The create
    // path always closes olds; the reuse path comments only on the latest,
    // so any stray older open audit-label Issue would persist indefinitely.
    // Best-effort close + supersede comment, mirroring the create path.
    for (const oldIssue of openIssues) {
      if (oldIssue.number === decision.reuseNumber) continue;
      try {
        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: oldIssue.number,
          body: `Superseded by #${decision.reuseNumber} (counts unchanged in latest audit run ${env.runUrl}).`,
        });
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: oldIssue.number,
          state: 'closed',
        });
        console.log(`[audit-issue] closed older #${oldIssue.number} during reuse`);
      } catch (err) {
        console.warn(`[audit-issue] reuse-path failed to close #${oldIssue.number}:`, err instanceof Error ? err.message : err);
      }
    }
    const issueUrl = latest?.html_url ?? '';
    console.log(`[audit-issue] reused #${decision.reuseNumber} — ${issueUrl}`);
    emitOutputs(issueUrl, true);
    return;
  }

  // action === 'create' — close olds, create new
  const title = `[audit] ${dateUtc} — ${env.detached} detached styles, ${env.unreg} unregistered frames`;
  const body = buildNewIssueBody(env, dateUtc);

  for (const oldIssue of openIssues) {
    try {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: oldIssue.number,
        body: `Superseded by latest audit run (${env.runUrl}).`,
      });
      await octokit.rest.issues.update({
        owner,
        repo,
        issue_number: oldIssue.number,
        state: 'closed',
      });
      console.log(`[audit-issue] closed #${oldIssue.number}`);
    } catch (err) {
      // Best-effort cleanup — old issue might already be closed by a
      // concurrent run; don't fail the entire workflow on the supersede step.
      console.warn(`[audit-issue] failed to close #${oldIssue.number}:`, err instanceof Error ? err.message : err);
    }
  }

  const { data: created } = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    labels: ['audit'],
  });
  console.log(`[audit-issue] created #${created.number} — ${created.html_url}`);
  emitOutputs(created.html_url, false);
}

main().catch(err => {
  console.error('[audit-issue] FATAL', err);
  process.exit(1);
});
