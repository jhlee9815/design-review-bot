# Phase 5-1 — Preflight 설정/파일 접근 검증

## 상태

✅ **완료**

## 목표

snapshot/diff/apply가 실행되기 전에 로컬 설정, 매핑 파일, Figma 파일 접근 가능 여부를 먼저 검증한다. 실패 시 이후 단계로 진행하지 않는다.

## 담당 에이전트

`executor` (Sonnet)

---

## 작업 정의 / 산출물

| 순서 | 작업 | 산출물 | 검증 항목 |
|---|---|---|---|
| 5-1-1 | 자동화 폴더 구조 생성 | `.automation/{snapshots,diffs,reports,logs,baseline,backups}/.gitkeep` (6개) | snapshot/diff/report/log 저장 위치 고정 |
| 5-1-2 | Figma 설정 검증 | `scripts/pipeline/preflight.ts` | `config/figma.yaml` 존재, `fileKey`, `fileUrl`, `automation.stages` 유효성 |
| 5-1-3 | 매핑 설정 검증 | `scripts/pipeline/preflight.ts` | `config/figma-mapping.yaml` 존재, `config-dir` 기준 상대 경로 해석, 매핑된 `code` 경로 실제 존재 |
| 5-1-4 | Figma 파일 접근 검증 | `scripts/pipeline/preflight.ts` | 파일키 `SXPVingkmqkrcLzcXYFsZd` 접근 가능 여부 확인 |
| 5-1-5 | 실행 명령 등록 | `package.json`, `scripts/pipeline/run.sh` | `npm run figma:preflight`로 수동 실행 가능 |

---

## 구현 결과 (cross-check)

### 코드 산출물

| 파일 | 역할 | 라인 수 |
|---|---|---|
| `scripts/pipeline/preflight.ts` | 21개 매핑 항목 순회, code 파일 존재 검증, FIGMA_TOKEN 환경변수 확인 | 108 |
| `scripts/pipeline/lib/config-loader.ts` | `loadFigmaConfig`, `loadFigmaMapping`, `resolveCodePath`, `ConfigError` | 151 |
| `scripts/pipeline/lib/logger.ts` | `createLogger(stage)` (콘솔 + `.automation/logs/{stage}-{ts}.log`) | 55 |
| `scripts/pipeline/run.sh` | 단일 진입점 (5-2~5-8 placeholder 포함) | 35 |

### 의존성 추가

```json
"devDependencies": {
  "tsx": "^4.21.0",
  "js-yaml": "^4.1.1",
  "@types/js-yaml": "^4.0.9"
}
```

### 스크립트 등록 (package.json)

- `figma:preflight`: `tsx --env-file=.env scripts/pipeline/preflight.ts`
- `figma:run`: `bash scripts/pipeline/run.sh`

### 폴더 초기화

```
.automation/
├── snapshots/.gitkeep
├── diffs/.gitkeep
├── reports/.gitkeep
├── logs/.gitkeep
├── baseline/.gitkeep
└── backups/.gitkeep
```

---

## 검증 결과

| 검증 | 결과 |
|---|---|
| `npm run figma:preflight` | exit 0 |
| `npm run build` | 통과 |
| `npm run lint` | 통과 |
| 21개 매핑 항목 code 파일 존재 | 모두 확인 |
| FIGMA_TOKEN 환경변수 | 설정됨 |

**최신 preflight 로그** (`.automation/logs/preflight-2026-04-30T05-08-37.log`):

```
INFO: figma.yaml OK — fileKey: SXPVingkmqkrcLzcXYFsZd, stages: preflight, snapshot, diff, classify, apply-to-code, verify, designer-review, promote-to-dev
INFO: figma-mapping.yaml OK — project: UNO HOME
INFO: [icon] node binding present — id:36:11471 name:Icon
... (21개 항목 모두 binding present)
INFO: FIGMA_TOKEN is set
INFO: --- Preflight Summary ---
INFO: Total mapping entries: 21
INFO: Filled bindings:       21
INFO: Empty bindings (warn): 0
INFO: Missing code files:    0
INFO: Fatal errors:          0
SUCCESS: Preflight PASSED — all code files exist.
```

---

## 검증 기준 (계약)

- ❌ `config/figma.yaml` 또는 `config/figma-mapping.yaml`이 없으면 실패
- ✅ `figma-mapping.yaml`의 상대 경로는 `uno-home/config/` 기준으로 해석 (예: `../../tokens.json` → `design-test/tokens.json`)
- ❌ 매핑된 코드 파일이 없으면 실패
- ⚠️ `figmaNodeId: null`은 경고 (5-1.5 실행 전 상태). 5-1.5 완료 후 0건이 됨
- ❌ Figma 파일 접근 실패 시 snapshot 단계로 진행하지 않음
- ✅ 성공 시 결과를 `.automation/logs/preflight-{timestamp}.log`에 기록

---

## 진행 히스토리

| 일자 | 이벤트 |
|---|---|
| 2026-04-30 00:51~01:01 | 초기 preflight 실행 (5-1 검증) |
| 2026-04-30 01:09 | 5-1.5 bind.ts 실행 후 재검증 (21/21 filled) |
| 2026-04-30 04:41~05:08 | 후속 검증 (snapshot 작업 직전 마지막 통과 확인) |

---

## 다음 단계로의 영향

| 다음 단계 | 5-1이 미친 영향 |
|---|---|
| 5-1.5 bind | `preflight.ts`의 하이브리드 lookup 보강 로직과 통합 (ID → name+path fallback, 단일 매치 시 자동 rewrite) |
| 5-2 snapshot | `lib/config-loader.ts`, `lib/logger.ts` 재사용 |
| 5-3 diff | `lib/logger.ts` 패턴 그대로 사용 |
| 모든 단계 | run.sh가 첫 단계로 preflight 호출 → 실패 시 후속 단계 차단 |
