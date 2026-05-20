# Phase 5-6 — 디자이너 재확인 리포트 + 승인 인터페이스

## 상태

✅ **완료** (2026-05-04)

## 목표

Figma 변경, 코드 변경, before/after 스크린샷, 검증 결과를 한 문서로 생성하고, 디자이너가 CLI로 승인/반려할 수 있게 한다.

## 담당 에이전트

`executor` (Sonnet)

---

## 작업 정의 / 산출물

| 산출물 | 역할 |
|---|---|
| `scripts/pipeline/report.ts` | ✅ `.automation/reports/{change-set-id}.md` 생성 |
| `scripts/pipeline/approve.ts` | ✅ 디자이너 승인 CLI |
| `scripts/pipeline/reject.ts` | ✅ 디자이너 반려 CLI |
| `scripts/pipeline/lib/designer-review.ts` | ✅ 리포트 생성/파싱/승인/반려/해시 유틸, report-only 상세 링크 포함 |
| `.automation/reports/{change-set-id}.md` | ✅ 변경 요약, 파일 목록, 검증 결과 |
| `.automation/reports/{change-set-id}.approved` | ✅ 빈 파일 마커 (승인) |
| `.automation/reports/{change-set-id}.rejected` | ✅ 사유 포함 마커 (반려) |
| `package.json` `figma:report`, `figma:approve`, `figma:reject` 스크립트 | ✅ 디자이너 CLI |
| `scripts/pipeline/run.sh` `[7/8]` 활성화 | ✅ designer-review report 생성 |

---

## 리포트 frontmatter 스키마

```yaml
---
changeSetId: cs-2026-04-30-001
status: pending           # pending | approved | rejected
approvedBy: null
approvedAt: null
reportSha256: <리포트 본문 해시>
artifactsSha256: <apply.ts 출력 diff 해시>
rejectReason: null
---
```

---

## 디자이너 CLI

| 명령 | 동작 |
|---|---|
| `npm run figma:approve <change-set-id>` | frontmatter `status: approved` + `.automation/reports/{id}.approved` 빈 파일 생성 |
| `npm run figma:reject <change-set-id> "사유"` | frontmatter `status: rejected` + 사유가 담긴 `.rejected` 파일 생성 + `rejectReason` 채움 |

---

## 알림

- 리포트 생성 직후 macOS 환경이면 `osascript` 네이티브 알림 시도
- 알림 실패는 warning으로 기록하고 리포트 생성은 성공 처리
- 추가 의존성 없음

---

## 검증 기준 (계약)

- ✅ 리포트는 변경 요약, 파일 목록, 검증 결과, visual diff 산출물 링크, report-only 상세 링크를 포함
- ✅ classified summary `total === 0`이면 designer-review 리포트 생성을 skip해 no-change pending 리포트를 만들지 않음
- ✅ frontmatter SHA256은 본문 변경 시 자동 갱신
- ✅ 단일 사용자 환경이므로 인증은 SHA256 체크섬만 (위변조 감지)

현재 5-5 visual diff는 apply된 변경이 있을 때 after screenshot과 baseline screenshot을 비교하고 `.automation/reports/{change-set-id}/visual-diff.md`에 before/after/diff 경로를 기록한다. no-op change-set은 스크린샷이 없으므로 리포트의 visual check가 `skipped`로 기록된다.

---

## 리포트 본문 구조 (제안)

```markdown
---
changeSetId: cs-2026-04-30-001
status: pending
...
---

# Change Set cs-2026-04-30-001

## 요약
- Figma 변경: 3건 (token 1, text 2)
- 코드 변경: 4 파일 수정
- 검증: build ✅ / lint ✅ / 시각 diff 0.03%

## Figma 변경
| 노드 | 분류 | before | after |
|---|---|---|---|
| ... | text | "Login" | "Sign in" |

## 코드 변경
- `src/components/Button.tsx` (M2 text)
- `src/index.css` (M1 token)
- ...

## Before / After
![before](./{change-set-id}/before/home.png)
![after](./{change-set-id}/after/home.png)

## 검증 결과
- npm run build: ✅
- npm run lint: ✅
- Visual diff: 0.03% (기준 0.1% 이하)

## 디자이너 액션
- 승인: `npm run figma:approve cs-2026-04-30-001`
- 반려: `npm run figma:reject cs-2026-04-30-001 "사유"`
```

---

## 다음 단계로의 영향

| 다음 단계 | 5-6이 미칠 영향 |
|---|---|
| 5-7 promote-dev | 3중 게이트 = `.approved` 파일 + frontmatter `status == approved` + `reportSha256` 일치 |

### 반려 시 거동 (5-7과 연계)

- `.rejected` 존재 시 다음 사이클 diff에서 동일 노드+동일 값 변경은 자동 report-only로 강등 (중복 푸시 방지)
- 매핑 갱신 트리거는 별도 CLI (`npm run figma:remap <id>`)로 분리

---

## 의존성

- ✅ 5-4 apply.ts M1 완료
- ✅ 5-5 verify.ts 완료

---

## 구현 완료 내용 (2026-05-04)

### 추가 파일

- `scripts/pipeline/report.ts`
- `scripts/pipeline/approve.ts`
- `scripts/pipeline/reject.ts`
- `scripts/pipeline/lib/designer-review.ts`
- `scripts/pipeline/lib/designer-review.test.ts`

### 추가 스크립트

```bash
npm run figma:report
npm run figma:approve <change-set-id>
npm run figma:reject <change-set-id> "사유"
npm run figma:test:designer-review
```

### 실제 산출물

- `.automation/reports/cs-2026-05-04T03-35-16.md`
- 상태: `pending`
- 최신 결과: Figma/classified 변경 0건, apply `noop`, verify `passed`, visual `skipped`

### 검증

- `npm run figma:test:designer-review`
- `npm run figma:run` no-change 운영 검증: `cs-2026-05-06T05-44-39.md` 미생성, apply/verify 로그만 생성
- 임시 token 변경 운영 검증: `cs-2026-05-06T05-43-41.md` 생성, build/lint/visual passed, 검증 후 rejected 처리
- `npm run figma:report`
- TypeScript 단독 컴파일 검사 (`report.ts`, `approve.ts`, `reject.ts`, `designer-review.test.ts`)
