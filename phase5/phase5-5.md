# Phase 5-5 — 2차 검증 (빌드/린트/시각)

## 상태

✅ **구현 완료** — build/lint gate + verify report + Playwright/pixelmatch visual diff tooling

## 목표

5-4 apply가 만든 change-set에 대해 `npm run build`, `npm run lint`, Playwright 스크린샷, 시각 diff 리포트를 실행하여 디자이너 리뷰로 넘기기 전 자동 검증.

현재 최신 apply report가 `noop`이므로 visual check는 `skipped`로 기록된다. 실제 `applied` change-set에서는 Playwright로 after screenshot을 캡처하고 `.automation/baseline/screenshots/`의 승인 baseline과 pixelmatch로 비교한다. baseline screenshot이 없거나 threshold를 넘으면 verify가 실패한다.

## 담당 에이전트

`qa-tester` (Playwright)

---

## 작업 정의 / 산출물

| 산출물 | 역할 |
|---|---|
| `scripts/pipeline/verify.ts` | ✅ build / lint / visual gate 통합 실행 |
| `scripts/pipeline/lib/verify-report.ts` | ✅ apply report frontmatter 파싱 + verify report 렌더링 |
| `.automation/reports/verify-{change-set-id}.md` | ✅ 검증 리포트 |
| `.automation/reports/{change-set-id}/after/` | ✅ Playwright after 스크린샷 (`applied` change-set) |
| `.automation/baseline/screenshots/` | ⏳ 승인 baseline 스크린샷 위치 (5-7 promote 성공 시 갱신 예정) |
| `.automation/reports/{change-set-id}/visual-diff.md` | ✅ 시각 diff 리포트 (`applied` change-set) |
| `package.json` `figma:verify` 스크립트 | ✅ 수동 실행 |
| `scripts/pipeline/run.sh` `[6/8]` placeholder 활성화 | ✅ |

---

## 검증 항목

| 검증 | 도구 | 통과 기준 |
|---|---|---|
| 빌드 | `npm run build` | exit 0 |
| 린트 | `npm run lint` | exit 0, 0 error |
| 시각 (스크린샷) | Playwright Chromium | no-op change-set은 skipped, applied change-set은 after screenshot 캡처 |
| 시각 diff | pixelmatch + pngjs | 승인 baseline 대비 diff ratio 1% 이하 |

---

## 검증 기준 (계약)

- ❌ build/lint 실패 시 디자이너 리뷰로 넘기지 않음
- ⚠️ 시각 diff가 기준치를 넘으면 자동 승인 불가 상태로 기록 (디자이너 수동 판단 필요)
- ✅ 검증 결과를 `.automation/reports/{change-set-id}.md`에 추가 (5-6 리포트의 일부)

## 구현 결과 (2026-05-04)

구현 파일:
- `scripts/pipeline/verify.ts`
- `scripts/pipeline/lib/verify-report.ts`
- `scripts/pipeline/lib/visual-diff.ts`

테스트 파일:
- `scripts/pipeline/lib/verify-report.test.ts`
- `scripts/pipeline/lib/visual-diff.test.ts`

스크립트:
- `npm run figma:verify`
- `npm run figma:test:verify-report`
- `npm run figma:test:visual-diff`

파이프라인 연결:
- `scripts/pipeline/run.sh` `[6/8] verify` 활성화

의존성:
- `@playwright/test`
- `pixelmatch`
- `pngjs`
- `@types/pixelmatch`
- `@types/pngjs`
- `npx playwright install chromium` 실행 완료

실제 검증 산출물:
- `.automation/reports/verify-cs-2026-05-04T03-35-16.md`

최신 결과:
- build: passed
- lint: passed
- visual: skipped (`apply`가 no-op이라 변경 파일 없음)
- overall: passed

주의:
- 현재는 최신 apply가 `noop`이라 actual screenshot capture 경로는 실행되지 않았다.
- 실제 변경이 있는 `applied` change-set은 `.automation/baseline/screenshots/*.png`가 있어야 visual diff를 통과할 수 있다.
- baseline screenshot 갱신은 5-7 promote-dev 성공 시점에 연결하는 것이 안전하다.

---

## 구현 가이드 (제안)

### Playwright 스크립트 위치

기존 Phase 3·4에서 사용한 Playwright MCP 패턴을 스크립트화. `uno-home/.automation/playwright/` 또는 `scripts/pipeline/playwright/` 검토.

### 검증 흐름

1. apply 직전 백업(`.automation/backups/{id}/`)을 임시 디렉토리에 복원 → `npm run build` → before 스크린샷
2. 현재 src(apply 적용된 상태) → `npm run build` → after 스크린샷
3. before/after 픽셀 diff 계산
4. 각 화면별 결과를 markdown 리포트에 기록

### 또는 (단순화)

5-4 안전망에서 이미 `tsc --noEmit + eslint` 검증 후 commit하므로, verify는 **시각 diff에만 집중**하는 것도 옵션.

---

## 다음 단계로의 영향

| 다음 단계 | 5-5가 미칠 영향 |
|---|---|
| 5-6 designer-review | verify 결과(빌드/린트/시각 diff)가 리포트의 "검증" 섹션. before/after 스크린샷이 리포트의 핵심 |
| 5-7 promote-dev | smoke test도 verify와 비슷한 패턴 (`npm run preview` + Playwright 1회) — 코드 재사용 가능 |

---

## 의존성

- ⏳ 5-4 apply.ts M1 완료 (noop/apply report 생성 가능)
- ✅ visual diff 도구 설치/연결 완료
- ⬜ 승인 baseline screenshot 갱신 흐름 필요 (5-7 promote-dev)
