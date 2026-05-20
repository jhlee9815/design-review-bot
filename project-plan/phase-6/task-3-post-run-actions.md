# Task 6-3 — Post-run Routing Script

> **목표**: `scripts/pipeline/post-run-actions.ts` 작성 — cs 리포트를 PR/Issue/Slack/Email로 분기
> **예상 시간**: 2시간
> **선행**: task-2 (workflow에서 호출됨)
> **블록 해제**: task-4 (CODEOWNERS는 별도, 동시 가능)

## 설계 의도

cs-{id}.md 리포트 1개를 입력으로 받아 4갈래 분기:

```
cs-{id}.md
   ├─ auto-apply 변경 있음 → gh pr create --draft --label designer-bot
   ├─ report-only 변경 있음 → gh issue create --label designer-review
   ├─ 항상 → Slack/Discord webhook (있을 때)
   └─ 항상 → Resend 이메일 (있을 때, task-6에서 활성화)
```

**중요 거버넌스 룰**:
- PR은 **항상 Draft**로 생성 (디자이너가 머지 불가)
- 동일 노드 변경은 **기존 PR을 업데이트** (새 PR 안 만듦) — `branch reuse`
- 라벨 `designer-bot`, `auto-apply` 부착으로 출처 명시
- Issue도 `designer-review` 라벨 + assignee는 CODEOWNERS 첫 사람

## 의존성

```bash
npm install --save-dev octokit @octokit/webhooks-types
# Resend는 task-6에서
```

## 파일 스켈레톤 (`scripts/pipeline/post-run-actions.ts`)

```typescript
#!/usr/bin/env tsx
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Octokit } from 'octokit';

const csId = process.argv[2];
if (!csId) {
  console.error('Usage: post-run-actions.ts <cs-id>');
  process.exit(1);
}

const REPO = process.env.GITHUB_REPOSITORY ?? '';
const [owner, repo] = REPO.split('/');
const token = process.env.GITHUB_TOKEN;
if (!token || !owner || !repo) {
  console.error('GITHUB_TOKEN / GITHUB_REPOSITORY missing');
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

// 1. cs 리포트 읽기
const csPath = join('.automation/reports', `${csId}.md`);
const csReport = readFileSync(csPath, 'utf-8');

// 2. classified diff JSON 읽기 — auto-apply / report-only 분리
const classifiedPath = join('.automation/diffs', `${csId.replace('cs-', '')}-classified.json`);
const classified = JSON.parse(readFileSync(classifiedPath, 'utf-8'));

const autoApplyChanges = classified.changes.filter((c: any) => c.decision === 'auto-apply');
const reportOnlyChanges = classified.changes.filter((c: any) => c.decision === 'report-only');

console.log(`auto-apply: ${autoApplyChanges.length}, report-only: ${reportOnlyChanges.length}`);

// 3. Slack/Discord (항상)
await notifyWebhooks({ csId, autoApply: autoApplyChanges.length, reportOnly: reportOnlyChanges.length, csReport });

// 4. auto-apply → PR
if (autoApplyChanges.length > 0) {
  await createOrUpdatePR({ csId, changes: autoApplyChanges, body: csReport });
}

// 5. report-only → Issue
if (reportOnlyChanges.length > 0) {
  await createIssue({ csId, changes: reportOnlyChanges, body: csReport });
}

// 6. Resend 이메일 (task-6에서 활성)
if (process.env.RESEND_API_KEY) {
  await sendEmail({ csId, autoApply: autoApplyChanges.length, reportOnly: reportOnlyChanges.length });
}

// === helpers ===

async function notifyWebhooks(args: { csId: string; autoApply: number; reportOnly: number; csReport: string }) {
  const summary = `🎨 Figma 변경 감지: ${args.csId}\nauto-apply: ${args.autoApply}건 · report-only: ${args.reportOnly}건`;
  const slack = process.env.SLACK_WEBHOOK_URL;
  if (slack) {
    await fetch(slack, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: summary }),
    });
  }
  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (discord) {
    await fetch(discord, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: summary }),
    });
  }
}

async function createOrUpdatePR(args: { csId: string; changes: any[]; body: string }) {
  const branchName = `designer-bot/${args.csId}`;

  // 1. 변경된 파일 git add + commit (이미 apply.ts가 코드 수정함)
  await execAsync(`git config user.name "designer-bot"`);
  await execAsync(`git config user.email "designer-bot@users.noreply.github.com"`);
  await execAsync(`git checkout -b ${branchName} || git checkout ${branchName}`);
  await execAsync(`git add -A`);
  await execAsync(`git commit -m "design: ${args.csId} auto-apply" || true`);
  await execAsync(`git push origin ${branchName} --force-with-lease`);

  // 2. 기존 PR 찾기 (브랜치명 기준)
  const existingPRs = await octokit.rest.pulls.list({ owner, repo, head: `${owner}:${branchName}`, state: 'open' });

  if (existingPRs.data.length > 0) {
    // 업데이트
    const pr = existingPRs.data[0];
    await octokit.rest.pulls.update({
      owner, repo, pull_number: pr.number,
      body: args.body,
    });
    console.log(`Updated existing PR #${pr.number}`);
  } else {
    // 신규 생성 (Draft)
    const pr = await octokit.rest.pulls.create({
      owner, repo,
      head: branchName,
      base: 'main',
      title: `[designer-bot] ${args.csId} — ${args.changes.length} auto-apply changes`,
      body: args.body,
      draft: true,
    });
    await octokit.rest.issues.addLabels({
      owner, repo, issue_number: pr.data.number,
      labels: ['designer-bot', 'auto-apply'],
    });
    console.log(`Created Draft PR #${pr.data.number}`);
  }
}

async function createIssue(args: { csId: string; changes: any[]; body: string }) {
  const title = `[designer-review] ${args.csId} — ${args.changes.length} manual review items`;
  const issue = await octokit.rest.issues.create({
    owner, repo,
    title,
    body: args.body,
    labels: ['designer-review', 'report-only'],
  });
  console.log(`Created Issue #${issue.data.number}`);
}

async function sendEmail(args: { csId: string; autoApply: number; reportOnly: number }) {
  // task-6에서 구현
  console.log('Email send: TODO task-6');
}

async function execAsync(cmd: string): Promise<void> {
  const { execSync } = await import('node:child_process');
  execSync(cmd, { stdio: 'inherit' });
}
```

## 검증

```bash
# 로컬에서 (dry-run 보강 권장)
npx tsx scripts/pipeline/post-run-actions.ts cs-2026-05-20T05-48-54

# GitHub Actions에서 (task-2 워크플로 통해)
gh workflow run figma-pipeline.yml -f reason="post-run-actions test"
```

성공 기준:
- auto-apply 0건일 때 PR 안 만들어짐
- auto-apply ≥1건일 때 Draft PR 1개 생성 + 라벨 부착
- report-only ≥1건일 때 Issue 1개 생성 + 라벨 부착
- Slack/Discord/Email 변수 있을 때만 발송 (없으면 skip)

## 함정

- **`git commit` 권한**: workflow에 `contents: write` 필요 (task-2에서 이미 설정)
- **`force-with-lease`**: 같은 브랜치 재push 시 충돌 방지. `--force`는 위험.
- **`apply.ts`가 수정한 파일 위치**: 워크플로의 same job에서 같은 working dir이라야 함.
- **PR body 길이**: GitHub 최대 65,536 chars. cs-*.md가 그보다 크면 자르거나 link로.
- **라벨 사전 생성**: `designer-bot`, `auto-apply`, `designer-review`, `report-only` 라벨이 repo에 없으면 자동 생성됨 (Octokit). 색상 통일하려면 task-4에서 명시.

## 다음

task-4에서 CODEOWNERS + PR 템플릿으로 거버넌스 보강.
