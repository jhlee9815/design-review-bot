# Phase 6 부속 — Slack 통합 가이드

> 작성: 2026-05-20 21:00 KST
> 목적: figma-pipeline workflow를 Slack에서 수동/자동 트리거하고, 결과 알림을 채널로 받는 두 가지 경로를 설명.
> 상태: 경로 A (GitHub 공식 Slack 앱) — 바로 가능. 경로 B (Cloudflare Worker /slack 엔드포인트) — task-5 옵션.

## 0. 한 줄 요약

```
"지금 Figma 변경된거 확인해줘"  ──┐
                                 ├── 둘 다 결국 figma-pipeline workflow를 돌리고 결과를 Slack에 알림
schedule cron (2h)            ───┘
```

Slack에서 자연어 ("변경된거 확인해줘") 대신 슬래시 명령(`/github workflow run …`)이 들어가지만, 채널 북마크/단축어로 한 클릭이 가능해 실용적으로는 동일.

## 1. 경로 비교

| 항목 | A. GitHub 공식 Slack 앱 | B. Cloudflare Worker `/slack` 엔드포인트 (task-5 옵션) |
|---|---|---|
| 작업량 | 사용자 UI 조작 ~10분 | 코드 작성 ~30분 + Slack 앱 manifest |
| 추가 코드 | 0 | Worker ~50줄 + Slack 앱 1개 |
| 자체 인프라 | 없음 | Cloudflare Worker (task-5 webhook proxy와 동거) |
| 결과 알림 | GitHub 앱이 워크플로 시작/끝/실패를 채널에 자동 포스팅 | `post-run-actions.ts`의 `notifySlack()` (별도 webhook URL 필요) |
| 자연어 alias | ❌ (슬래시 명령만) | ⚠️ 별도 NLP/규칙 추가 필요 |
| 권한 단위 | Slack 워크스페이스 멤버 = GitHub OAuth | Slack signing secret + Worker auth |
| 추천 | ✅ 지금 즉시 | task-5에서 자체 webhook 처리하면서 같이 |

**현재 추천**: 경로 A부터 즉시 적용. task-5 진행 시 경로 B를 옵션으로 추가 검토.

## 2. 경로 A — GitHub 공식 Slack 앱 (즉시 가능)

> 사전 조건: Slack 워크스페이스 존재 + 사용자 GitHub 계정이 `jhlee9815/uno-home` 접근 권한 보유.

### 2-1. Slack 워크스페이스에 GitHub 앱 추가
1. Slack 웹/앱에서 좌측 사이드바 하단 **Apps** 클릭 (또는 `Cmd+K` → "Apps")
2. 검색창에 `GitHub` 입력 → 공식 **GitHub** 앱 (verified ✓ 마크) 선택
3. **Add to Slack** → OAuth 동의 → GitHub 계정 연결
4. 알림 받을 채널 (예: `#figma-pipeline`) 선택 또는 신규 생성

### 2-2. 채널에서 repo 구독
알림 받을 채널에서 한 줄씩 실행:

```
/github login
/github subscribe jhlee9815/uno-home workflows:{name:"figma-pipeline",event:"workflow_dispatch","schedule","repository_dispatch"}
/github subscribe jhlee9815/uno-home issues pulls
```

- 1행: GitHub 계정 연결 (브라우저 OAuth)
- 2행: figma-pipeline 워크플로 실행 시작/종료/실패 알림
- 3행: post-run-actions가 생성한 Issue/PR 알림

### 2-3. 트리거 명령
`workflow_dispatch` 트리거를 채널에서 실행:

```
/github workflow run jhlee9815/uno-home figma-pipeline.yml -r main
```

또는 사유 명시:

```
/github workflow run jhlee9815/uno-home figma-pipeline.yml -r main -F reason="slack manual check"
```

채널 북마크에 위 명령을 박아두면 클릭 → 입력 → 엔터로 1초.

### 2-4. 결과 흐름
1. 워크플로 시작: GitHub 앱이 채널에 "🟢 figma-pipeline started by …" 포스팅
2. 워크플로 종료 (~1-3분): "✅ Succeeded" 또는 "❌ Failed" 포스팅 + 요약
3. 변경이 감지되어 Issue/PR이 생성됐으면: 채널에 별도 알림으로 표시
4. (선택) GitHub Secrets에 `SLACK_WEBHOOK_URL` 등록하면 `post-run-actions.ts`의 `notifySlack()`이 추가로 풍부한 메시지 발송

### 2-5. 한 줄 사용 예 (디자이너용)
> "지금 figma 변경된거 확인해줘" 를 채널에서:
> ```
> /github workflow run jhlee9815/uno-home figma-pipeline.yml -r main
> ```

## 3. 경로 B — Cloudflare Worker `/slack` 엔드포인트 (task-5 옵션)

task-5에서 Figma webhook을 받을 Cloudflare Worker를 만들 예정. 같은 Worker에 `/slack` 경로 하나만 더 추가하면 자체 슬래시 커맨드를 운영 가능.

### 3-1. 추가 작업
- Slack 앱 manifest (workspace 자체 앱)
- Worker `/slack` 핸들러:
  1. Slack signing secret 검증 (timestamp + HMAC-SHA256)
  2. command body 파싱 (`/figma-check` 등 사용자 정의 명령)
  3. GitHub `POST /repos/jhlee9815/uno-home/dispatches` 호출 (또는 `actions/workflows/.../dispatches`)
  4. Slack ephemeral 응답 ("확인 시작했어, 1-3분 후 결과 올라옴")
- Slack 앱에서 슬래시 커맨드 `/figma-check` 등록 → Worker `/slack` URL 연결

### 3-2. 경로 B의 장점
- 명령어 이름을 짧게/한국어로 정의 가능 (예: `/체크`, `/도디자인변경`)
- 워크플로 외에 부수 액션 추가 가능 (특정 cs 재실행, dry-run 토글 등)
- Slack 자체 앱이므로 GitHub OAuth 안 거치는 사람도 사용 가능

### 3-3. 경로 B의 단점
- Slack 앱 등록 + Worker 코드 추가 시간
- `post-run-actions.ts`의 `notifySlack()`이 풍부한 메시지를 보내려면 별도 `SLACK_WEBHOOK_URL` (Incoming Webhook 또는 Bot 토큰) 필요
- 유지보수 부담이 작게 늘어남

### 3-4. 도입 결정 기준
- "워크플로 시작이 1-3초만 빨라도 좋다" + "한국어 alias가 중요" → 경로 B
- 그 외 → 경로 A로 충분

## 4. 자연어 트리거에 대한 솔직한 평가

"지금 변경된거 확인해줘" 라는 자연어를 인식하려면:
- (a) Slack `app_mention` 이벤트 + LLM 의도 분류 — 정확도/지연/비용 부담
- (b) 키워드 매칭 ("변경된거", "체크", "디자인") + 일부 정규식 — 간단하지만 false-trigger 위험

실무적으로는 슬래시 명령이 가장 빠르고 안정적. 자연어 인식은 후속 과제로 분리.

## 5. 보안 / 권한 메모

- 경로 A: Slack 사용자가 자기 GitHub OAuth로 워크플로를 트리거. 워크플로는 repo `Actions: write` 권한 필요. private repo는 멤버만 가능.
- 경로 B: Slack signing secret 누출 시 누구나 트리거 가능. Cloudflare Worker에서 signing 검증 필수.
- 워크플로 자체는 변경 감지 + Draft PR + Issue 생성만 함 (auto-merge 없음). 그래서 트리거 권한이 사고로 이어질 위험은 낮음. 단, push frequency 비정상 폭주는 GitHub Actions 무료 분 빠르게 소진 가능.

## 6. 적용 순서 권장

1. **지금**: 사용자가 직접 2-1 ~ 2-3 진행 (5-10분).
2. **task-5 진행 중**: Cloudflare Worker 만들 때 `/slack` 추가 여부 결정. 기본은 ❌. 자연어/한국어 alias 강하게 필요할 때만 ✅.
3. **task-6 완료 후**: 안정 운영 2주 관찰 후 추가 필요 기능 정리.

## 7. 참고

- 경로 A에서 사용하는 `/github` 명령 전체 목록: `/github help`
- repo 구독 해제: `/github unsubscribe jhlee9815/uno-home`
- 워크플로 ID 확인: `/github workflow list jhlee9815/uno-home`
