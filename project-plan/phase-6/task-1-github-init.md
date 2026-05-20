# Task 6-1 — GitHub Remote init + 초기 push

> **목표**: local-only git repo를 GitHub에 올린다.
> **예상 시간**: 30분
> **선행**: 없음
> **블록 해제**: task-2 ~ task-7 전부

## 사전 점검

```bash
git status --short    # 변경 없는지 확인
git log --oneline -5  # 현재 커밋 (3개여야 함)
gh auth status        # GitHub CLI 인증 필요
```

`gh auth status`가 실패하면 먼저 `gh auth login` 실행.

## 단계

### 1. GitHub repo 생성 (private 권장)

```bash
gh repo create uno-home --private --description "Figma → React design sync pipeline (Pesse Apple-inspired demo)" --confirm
```

옵션 결정:
- `--private` (권장): 토큰/내부 데모 보호
- `--public`: 발표 후 코드 공유할 거면

### 2. Remote 추가 + push

```bash
git remote add origin git@github.com:<YOUR_GH_USERNAME>/uno-home.git
git push -u origin main
```

### 3. 기본 브랜치 보호 룰 적용

```bash
gh api -X PUT "repos/:owner/uno-home/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

`require_code_owner_reviews: true`가 핵심 — task-4의 CODEOWNERS와 짝.

### 4. GitHub Secrets 등록

```bash
# Figma API 토큰 (필수)
gh secret set FIGMA_TOKEN < <(echo -n "$(grep FIGMA_TOKEN .env | cut -d= -f2)")

# Slack/Discord webhook URL (task-3에서 사용, 일단 placeholder 가능)
# gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/..."
# gh secret set DISCORD_WEBHOOK_URL --body "https://discord.com/api/webhooks/..."

# Resend API key (task-6에서 사용)
# gh secret set RESEND_API_KEY --body "re_..."

# Figma webhook signing secret (task-5에서 사용)
# gh secret set FIGMA_WEBHOOK_SECRET --body "..."

gh secret list
```

### 5. `.gitignore` 점검 — `.env` 누락 없는지

```bash
grep -E "^\.env$|^\.automation" .gitignore
```

없으면 추가하고 즉시 커밋. **절대 `.env` push 금지.**

### 6. README 한 줄 업데이트

```bash
# README 파일 첫 줄을 다음과 같이:
# > Status: internal demo · pipeline runs via GitHub Actions · NOT a reusable product yet
```

## 완료 확인

- [ ] `gh repo view` 명령으로 repo 표시됨
- [ ] `git push origin main` 정상 동작
- [ ] `gh api "repos/:owner/uno-home/branches/main/protection"` 응답에 `required_pull_request_reviews` 보임
- [ ] `gh secret list` 출력에 `FIGMA_TOKEN` 보임 (값은 안 보임)

## 함정

- **`.env` 실수 push 방지**: `git status`로 push 전 한 번 더 확인
- **개인 GitHub vs 회사 GitHub Organization**: 회사 발표용이면 org 권장 (`gh repo create <org>/uno-home`)
- **SSH 키 vs HTTPS**: 회사 정책 확인
