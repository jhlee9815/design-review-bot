# Task 6-2 — GitHub Actions Workflow

> **목표**: `.github/workflows/figma-pipeline.yml` 작성 + cron 안전망 + manual dispatch
> **예상 시간**: 1시간
> **선행**: task-1 (GitHub remote)
> **블록 해제**: task-3, task-5

## 설계 의도

- **3가지 트리거**:
  1. `repository_dispatch` (Figma webhook → Cloudflare Worker → here)
  2. `schedule` (2시간 cron — webhook 누락 안전망)
  3. `workflow_dispatch` (수동 트리거 — 디버깅/리허설용)
- **Extraction-friendly 4가지 env var 노출**:
  - `FIGMA_FILE_KEY` (Codex 차단점 ①)
  - `FIGMA_CONFIG_DIR` (③)
  - `FIGMA_VERIFY_BUILD_CMD` (⑤)
  - `FIGMA_VERIFY_LINT_CMD` (⑤)
  - 미설정 시 yaml/default fallback. Phase 6에서는 이 repo 값 그대로 사용.

## 파일 내용 (`.github/workflows/figma-pipeline.yml`)

```yaml
name: figma-pipeline

on:
  repository_dispatch:
    types: [figma-file-update]
  schedule:
    - cron: '0 */2 * * *'   # 2시간 cron (webhook 누락 안전망)
  workflow_dispatch:
    inputs:
      reason:
        description: 'Manual trigger reason'
        required: false
        default: 'manual'

concurrency:
  group: figma-pipeline-${{ github.ref }}
  cancel-in-progress: false   # 이전 실행 끝까지 두고 새 실행 큐잉

jobs:
  figma-pipeline:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: write        # auto-apply branch push
      pull-requests: write   # PR create/update
      issues: write          # report-only Issue
    env:
      FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
      RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
      # extraction-friendly overrides (미설정이면 default 사용)
      FIGMA_FILE_KEY: ${{ vars.FIGMA_FILE_KEY }}
      FIGMA_CONFIG_DIR: ${{ vars.FIGMA_CONFIG_DIR }}
      FIGMA_VERIFY_BUILD_CMD: ${{ vars.FIGMA_VERIFY_BUILD_CMD }}
      FIGMA_VERIFY_LINT_CMD: ${{ vars.FIGMA_VERIFY_LINT_CMD }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0    # baseline 비교용 전체 history

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Trigger summary
        run: |
          echo "Trigger: ${{ github.event_name }}"
          echo "Event action: ${{ github.event.action }}"
          if [ "${{ github.event_name }}" = "repository_dispatch" ]; then
            echo "Figma payload: ${{ toJson(github.event.client_payload) }}"
          fi

      - name: Run figma pipeline
        id: pipeline
        run: |
          npm run figma:run 2>&1 | tee /tmp/pipeline.log
          # cs-id 추출
          CS_ID=$(ls -t .automation/reports/cs-*.md 2>/dev/null | head -1 | xargs -I{} basename {} .md)
          echo "cs_id=$CS_ID" >> $GITHUB_OUTPUT
          # auto-apply 변경 수
          AUTO_COUNT=$(grep -E "^Changes: " /tmp/pipeline.log | tail -1 | grep -oE "[0-9]+" || echo 0)
          echo "auto_count=$AUTO_COUNT" >> $GITHUB_OUTPUT

      - name: Post-run routing (PR + Issue + Notifications)
        if: steps.pipeline.outputs.cs_id != ''
        run: npx tsx scripts/pipeline/post-run-actions.ts ${{ steps.pipeline.outputs.cs_id }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TRIGGER_EVENT: ${{ github.event_name }}

      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: figma-pipeline-${{ github.run_id }}
          path: |
            .automation/reports/
            .automation/snapshots/
            .automation/diffs/
          retention-days: 30
```

## 작업 절차

```bash
mkdir -p .github/workflows
# 위 YAML을 .github/workflows/figma-pipeline.yml로 저장
git add .github/workflows/figma-pipeline.yml
git commit -m "ci: add figma-pipeline workflow (cron + dispatch triggers)"
git push
```

## 검증

```bash
# 수동 트리거 테스트
gh workflow run figma-pipeline.yml -f reason="task-6-2 verification"

# 진행 상황 확인
gh run watch

# 결과 확인
gh run list --workflow=figma-pipeline.yml
gh run view --log
```

성공 기준:
- workflow가 `figma-pipeline` 이름으로 보임
- 수동 실행 시 7~10분 내 success
- artifacts에 `cs-*.md` 보고서 포함

## 함정

- **`fetch-depth: 0`**: baseline 비교에 git history 필요. 기본 `1`이면 동작 안 함.
- **`concurrency.cancel-in-progress: false`**: webhook+cron이 겹치면 이전 실행 끝까지 두고 큐잉. `true`로 하면 baseline 쓰기 race.
- **`permissions`**: `contents: write` + `pull-requests: write` + `issues: write` 셋 다 필요. 기본은 read-only.
- **`npm ci` 캐시 미스**: package-lock.json 없으면 실패. 있는지 확인.
- **`tsx` vs `ts-node`**: `scripts/pipeline/*.ts`가 ESM이면 `tsx` 사용. 현재 `npm run figma:run`이 어떻게 ts 실행하는지 `package.json`에서 확인 후 동일 방식 사용.

## 후속

task-3에서 `post-run-actions.ts` 작성 필요. 그 전엔 이 step이 무시됨 (file not found error는 if 조건으로 막혀 있음).
