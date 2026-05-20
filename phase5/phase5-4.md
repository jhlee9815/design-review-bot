# Phase 5-4 — 개발 코드 반영 (마일스톤 분할)

## 상태

✅ **완료** — M1/M2/M3 components/compositions 및 report-only 리포트 고도화 완료, M4 layout 보류

## 목표

5-3 classify에서 자동 반영 가능으로 분류된 변경만 코드에 적용. 위험도 순으로 마일스톤 분할.

## 담당 에이전트

`executor` (Sonnet) — `code-reviewer` (Opus) 검토

---

## 5-4 진입 전 상태

src/ 전체에 `figma:text` 36건, `figma:prop` 14건. NotificationCard 마커는 NotificationListItem 마커로 대체됐다. components/compositions 텍스트 후보는 최신 marker-candidates 기준 `ambiguous`/`missing-code-candidate` gap 0개다. `figma:prop` 14건은 컴포넌트 기본 prop 값과 안전한 child JSX prop을 커버한다.

### 선행 작업 완료 (2026-04-30)

| 산출물 | 위치 |
|---|---|
| snapshot.ts 스키마 보강 | `texts[]`, `componentProps[]`, `componentPropsHash` 저장 |
| `scripts/pipeline/lib/snapshot-node.ts` (+ test) | leaf 추출 로직 |
| `scripts/pipeline/lib/code-candidates.ts` (+ test) | TypeScript AST 기반 코드 literal 후보 추출 |
| `scripts/pipeline/marker-candidates.ts` | 최신 snapshot과 코드 후보 매칭 → `.automation/reports/marker-candidates-{ts}.md` |
| NotificationListItem baseline 재산출 | `cs-2026-05-06T05-08-36` promoted, `.automation/baseline/2026-05-06T05-08-33.json` + screenshots 8장 갱신 |

**최신 리포트 통계**:

| Metric | Count |
|---|---:|
| Entries with text | 19 |
| Figma text leaves | 262 |
| Matched exactly | 121 |
| Ambiguous | 16 |
| Missing code candidate | 125 |

components/compositions 범위의 remaining gap은 0개. 남은 ambiguous/missing은 screens/report-only 중심.

### 리포트 status 의미

- `matched`: 코드 후보 1개라 마커 주입 가능성이 높음
- `ambiguous`: 같은 문자열 후보가 여러 개라 사람 확인 필요
- `missing-code-candidate`: 코드에 같은 문자열이 없거나 데이터/props로 생성되어 별도 설계 필요

### 결정 완료

- 옵션 A 하이브리드 채택
- components/compositions 텍스트 gap 0개까지 `figma:text` 마커 36건 주입
- component-props 자동 반영용 `figma:prop` 마커 14건 주입
- components/compositions 범위의 component-props leaf 19개는 14개 prop marker로 커버
- screens 8개는 영구 `report-only`
- Button/Input/OTP처럼 Figma leaf 여러 개가 코드 literal 하나를 공유하면 `node="a,b,c"` 목록으로 한 마커에 묶음
- `figma:prop`은 Figma variant 값과 코드 union 값의 표기 차이를 위해 `transform="lower"` / `transform="pascal-compact"` 지원
- 같은 node id 안의 다중 prop 변경은 marker `id`/`prop` 기준으로 매칭

### report-only 고도화 완료 (2026-05-06)

- `screens`는 현재 `apply: report-only`이므로 마커 주입 우선순위에서 제외 유지
- `scripts/pipeline/lib/report-only-guidance.ts` 추가: `Why blocked` / `Manual action` 컬럼으로 screen policy, deferred class, unmapped target, mapping policy를 구분
- `scripts/pipeline/lib/apply-report.ts` 추가: 마커가 없어 적용되지 않은 auto-apply 후보를 `Manual Follow-up`에 기록
- `scripts/pipeline/lib/designer-review.ts`가 report-only 상세 리포트 링크를 디자이너 리포트에 포함
- 테스트: `figma:test:report-only`, `figma:test:apply-report`, `figma:test:designer-review`

→ M2/M3 엔진, components/compositions 범위 prop 커버리지, report-only 리포트 품질 개선은 구현됨. 남은 일은 M4 layout 보류 결정 유지 또는 별도 범위 재정의.

---

## 마일스톤 분할

### M1 — tokens-only (시작 마일스톤)

| 항목 | 내용 |
|---|---|
| 도구 | deterministic token `@theme` generator (`scripts/pipeline/lib/token-css.ts`) |
| 입력 | `tokens.json` |
| 출력 | `src/index.css` (Tailwind v4 `@theme` 블록만 갱신) |
| 회귀 호환 | 첫 실행 시 현재 수동 작성된 `src/index.css`를 `.automation/baseline/index.css`로 보존. 자동 생성 결과가 baseline과 `@theme` 블록 외부를 건드리면 abort |
| AST 변환 | 불필요 |
| 위험도 | 가장 낮음 |

**구현 완료 (2026-05-04)**:
- `scripts/pipeline/apply.ts`
- `scripts/pipeline/lib/token-css.ts`
- `scripts/pipeline/lib/apply-token.ts`
- `package.json` `figma:apply`, `figma:test:token-css`, `figma:test:apply-token`
- `run.sh` `[5/8] apply-to-code` 활성화
- `.automation/baseline/index.css` 생성
- 최신 diff에는 token change가 없어 `.automation/reports/apply-cs-2026-05-04T03-35-16.md` no-op report 생성

### M2 — text 변경

| 항목 | 내용 |
|---|---|
| 도구 | classified diff + base/head snapshot leaf 비교 + marker scanner |
| 패치 영역 | `/* figma:text id="<key>" node="<nodeId[,nodeId]>" */` 주석 다음 string literal만 교체 |
| 마커 없는 텍스트 | 자동 반영 거부 → report-only로 fallback |
| 상태 | ✅ 엔진 구현, components/compositions gap 0개 |

### M3 — component-props 변경

| 항목 | 내용 |
|---|---|
| 도구 | classified diff + base/head snapshot leaf 비교 + marker scanner |
| 패치 영역 | `{/* figma:prop id="<key>" node="<nodeId>" prop="<jsxProp>" */}` 직후 JSX attribute 값 또는 마커 다음 string literal 교체 |
| 적용 조건 | 매핑의 `allowedClasses`에 `component-props` 포함된 항목만 |
| 값 변환 | `transform="lower"` / `transform="pascal-compact"` |
| 상태 | ✅ 엔진 구현, prop marker 14건 주입 |

### M4 — layout 자동 적용

당분간 보류. 5-6 report-only 유지.

---

## 안전망 (모든 마일스톤 공통, all-or-nothing)

| 단계 | 동작 |
|---|---|
| **preApply** | 변경 대상 src 전체를 `.automation/backups/{change-set-id}/`에 복사 |
| **perFile** | marker 변환 결과를 build/lint에서 검증 → 실패 시 rollback |
| **postApply** | `tsc --noEmit` + `eslint` 통과 검증 → 실패 시 전체 rollback |
| **partialFailure** | change-set 단위 **all-or-nothing** (한 파일이라도 실패하면 전체 롤백) |

---

## 산출물

| 산출물 | 역할 |
|---|---|
| `scripts/pipeline/apply.ts` | ✅ M1 tokens + M2 text + M3 component-props 자동 반영 |
| `scripts/pipeline/lib/apply-code.ts` | ✅ 스냅샷 leaf diff 추출 + marker source patch |
| `scripts/pipeline/lib/apply-code.test.ts` | ✅ M2/M3 unit test |
| `scripts/pipeline/lib/report-only-guidance.ts` | ✅ report-only 사유/수동 조치 Markdown 렌더러 |
| `scripts/pipeline/lib/report-only-guidance.test.ts` | ✅ report-only 리포트 품질 테스트 |
| `scripts/pipeline/lib/apply-report.ts` | ✅ apply/no-marker 수동 follow-up 렌더러 |
| `scripts/pipeline/lib/apply-report.test.ts` | ✅ apply report follow-up 테스트 |
| `.automation/backups/{change-set-id}/` | 변경 전 src 백업 |
| `.automation/baseline/index.css` | ✅ M1 첫 실행 시 보존된 baseline |
| `package.json` `figma:apply`, `figma:test:apply-code` 스크립트 | ✅ 수동 실행 |
| `scripts/pipeline/run.sh` `[5/8]` placeholder 활성화 | ✅ |

---

## 검증 기준 (계약)

- ✅ M1: `npm run build` 통과 + 자동 생성 `index.css`가 baseline과 `@theme` 외부 일치
- ✅ M2/M3: marker patch unit test + 변경 후 `tsc --noEmit` + `eslint` 통과
- ✅ 안전망 트리거 시 코드 상태가 변경 전과 100% 동일

---

## 다음 단계로의 영향

| 다음 단계 | 5-4가 미칠 영향 |
|---|---|
| 5-5 verify | 빌드/린트는 안전망에 이미 포함 → verify는 그 이후 시각 검증 담당 |
| 5-6 designer-review | apply 결과 diff + 백업 위치를 리포트에 기록 |
| 5-7 promote-dev | apply가 만든 change-set-id 기준으로 3중 게이트 작동 |

---

## 의존성

- ✅ 5-3 classify 완료 (입력 형식)
- ✅ 마커 정책 결정
- ✅ matched text 마커 1차 주입
