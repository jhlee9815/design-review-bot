# Phase 5 — 디자인 변경 감지 → 검증 → dev 반영 파이프라인

## 목표

디자이너가 Figma에서 1차 디자인을 수정하면, 스케줄러가 변경을 감지하고, 개발 코드에 반영 가능한 변경만 적용한 뒤, 2차 검증과 디자이너 재확인을 거쳐 dev 환경까지 반영한다.

GitHub PR 자동 생성, 리뷰, 상용 배포는 dev 반영 파이프라인이 안정화된 뒤 확장한다.

---

## 진행 상태 (2026-05-06 기준)

| 서브 단계 | 산출물 | 상태 | 상세 문서 |
|---|---|---|---|
| 5-0 | 파이프라인 계약/매핑 구조 | ✅ 완료 | [phase5-0.md](./phase5-0.md) |
| 5-1 | preflight.ts 설정/파일 접근 검증 | ✅ 완료 | [phase5-1.md](./phase5-1.md) |
| 5-1.5 | bind.ts 노드 ID 자동 채움 + 전체 top-level frame 등록 (186/186) | ✅ 완료 | [phase5-1-5.md](./phase5-1-5.md) |
| 5-2 | snapshot.ts Figma 상태 저장 | ✅ 완료 | [phase5-2.md](./phase5-2.md) |
| 5-3 | diff.ts + classify.ts 변경 감지/분류 | ✅ 완료 | [phase5-3.md](./phase5-3.md) |
| 5-4 | apply.ts 개발 코드 반영 (M1~M4) | ✅ M1/M2/M3 components/compositions + report-only 고도화 완료, M4 보류 | [phase5-4.md](./phase5-4.md) |
| 5-5 | verify.ts 빌드/린트/시각 검증 | ✅ 완료 | [phase5-5.md](./phase5-5.md) |
| 5-6 | 리포트 + 승인 인터페이스 | ✅ 완료 | [phase5-6.md](./phase5-6.md) |
| 5-7 | dev 반영 (3중 게이트) | ✅ 완료 | [phase5-7.md](./phase5-7.md) |
| 5-8 | launchd 스케줄러 등록 | ✅ 완료 | [phase5-8.md](./phase5-8.md) |

**완료율**: launchd까지 완료. 5-4는 M1과 M2/M3 components/compositions 안전 후보 커버리지 및 report-only 리포트 품질 개선 완료, M4 보류. NotificationListItem Track A baseline 재산출과 전체 top-level Figma frame 등록 baseline 재산출도 완료.

---

## 파이프라인 흐름

```
preflight → snapshot → diff → classify → apply-to-code → verify → designer-review → promote-to-dev
   ✅         ✅         ✅      ✅          ✅ M1-M3        ✅        ✅                ✅
```

`scripts/pipeline/run.sh` 단일 진입점이 8단계를 순차 실행. 현재 `[1/8] preflight`부터 `[8/8] promote-to-dev`까지 활성. apply는 M1 token CSS, M2 text marker, M3 component-prop marker를 처리하고, verify는 build/lint + Playwright/pixelmatch visual diff tooling까지 구현됨.

---

## 다음 작업 (NEXT)

### M4 layout 자동화 보류 유지

상세: [phase5-4.md](./phase5-4.md)

**핵심 산출물**:
- M4 layout 자동화는 별도 결정 전까지 보류
- screens 8개는 영구 `report-only` 유지

---

## 5-4 진입 전 상태

src/ 전체에 `figma:text` 36건, `figma:prop` 14건. NotificationCard 마커는 NotificationListItem 마커로 대체됐고, components/compositions 텍스트 후보는 최신 marker-candidates 기준 gap 0개이며, screens는 영구 `report-only` 정책을 유지한다.

**선행 작업 완료 (2026-04-30)**:
- ✅ snapshot.ts 스키마 보강 (`texts[]`, `componentProps[]`, `componentPropsHash`)
- ✅ `marker-candidates.ts` + `code-candidates.ts` — TypeScript AST 기반 코드 literal 후보 추출
- ✅ 최신 리포트: 19 entry, Figma text leaf 262개, exact match 121개, ambiguous 16개, missing 125개
- ✅ components/compositions 텍스트 gap 0개 (`figma:text` 코드 마커 36개)
- ✅ component-props 자동 반영용 `figma:prop` 코드 마커 14개 주입
- ✅ components/compositions 범위 component-props leaf 19개를 14개 marker로 커버
- ✅ NotificationListItem baseline 재산출: `cs-2026-05-06T05-08-36` promoted, baseline `2026-05-06T05-08-33.json` 및 screenshots 8장 갱신
- ✅ 전체 top-level Figma frame 등록: screens/top-level frames 173개, total mapping 186개. 등록 change-set `cs-2026-05-06T06-00-51` promoted, baseline `2026-05-06T06-00-44.json` 및 screenshots 8장 갱신
- ✅ report-only 리포트 품질 개선: `Why blocked` / `Manual action` 컬럼, no-marker `Manual Follow-up`, designer report 상세 링크
- ✅ no-change 운영 정책: classified summary `total === 0`이면 designer-review `cs-{id}.md` 생성 skip
- ✅ 운영 검증: no-change 사이클은 report skip, 임시 token 변경 사이클은 autoApply/apply/verify/designer-review 경로 통과

**결정 완료**:
- 옵션 A 하이브리드 채택
- atomic/composition의 `matched` 28 leaf는 14개 코드 마커로 주입
- screens 8개는 영구 `report-only`
- baseline은 승인된 change-set만 보존

→ M1 apply, M2 components/compositions text coverage, M3 marker apply engine/coverage, report-only 리포트 품질 개선, 5-5 verify, 5-6 designer-review, 5-7 promote-dev, 5-8 launchd는 구현됨. 남은 큰 결정은 M4 layout 자동화 보류 유지 여부. 상세는 [phase5-4.md](./phase5-4.md).

---

## 결정사항 (Phase 5 전체 고정)

| 항목 | 결정 |
|---|---|
| 저장소 | 로컬 전용 (GitHub은 추후) |
| 스케줄 | 매일 오후 9시 (macOS launchd) |
| 검증 도구 | npm build/lint + Playwright 스크린샷 |
| 자동화 트리거 | 스케줄러 + 수동 run script |
| dev 반영 조건 | 3중 게이트 (.approved 파일 + frontmatter status + SHA256 일치) |
| dev 환경 | `uno-home/dist-dev/` (`npm run preview`로 검증) |
| 매핑 경로 기준 | `uno-home/config/figma-mapping.yaml` 위치 기준 (`config-dir`) |
| 노드 매핑 전략 | 하이브리드 (figmaNodeId + figmaNodeName + figmaNodePath) |
| 토큰 변환 도구 | deterministic `@theme` generator (M1, `scripts/pipeline/lib/token-css.ts`) |
| AST 변환 도구 | 스냅샷 leaf diff + 마커 주석 (`figma:text`, `figma:prop`) (M2/M3) |
| 코드 변경 안전망 | 전체 src 백업 → 파일별 재파싱 검증 → tsc/eslint → 실패 시 all-or-nothing 롤백 |
| 승인 인터페이스 | report.md frontmatter (status/SHA256) + `.approved`/`.rejected` 빈 파일 마커 |
| no-change 리포트 | 변경 0건이면 디자이너 승인 리포트 생성 안 함. `apply-*` / `verify-*` 로그만 보존 |
| 전체 프레임 추적 | 2026-05-06 기준 Figma top-level frame 173개를 screens에 등록. 미구현 프레임은 `src/screens/FigmaFrameTracking.ts` + `report-only`, route 없음 |
| 알림 채널 | macOS `osascript display notification` |
| Figma API 인증 | `uno-home/.env`에 `FIGMA_TOKEN` (`.gitignore` 등록, dotenv 미도입) |
| 파이프라인 실행 도구 | `tsx` (TypeScript 직접 실행), `js-yaml` (YAML 파싱) |

---

## 에이전트 & 스킬 맵

| 에이전트/스킬 | 역할 | 사용 단계 |
|---|---|---|
| `executor` (Sonnet) | 스크립트 코드 구현 | 5-1, 5-1.5, 5-2, 5-3, 5-4, 5-6, 5-7, 5-8 |
| `architect` (Opus) | 자동화 구조 설계 | 5-0 |
| `qa-tester` | Playwright 시각 검증 | 5-5, 5-7 |
| `git-master` | 자동 커밋 전략 | 5-7 이후 |
| `code-reviewer` (Opus) | 자동 생성 코드 품질 검토 | 5-4 이후 |
| Figma MCP / REST API | 디자인 스펙 읽기, 변경 감지 | 5-1.5, 5-2 |

---

## 폴더 구조 (현재 상태)

```
uno-home/
├── .env                                     ✅ FIGMA_TOKEN 보관
├── docs/
│   ├── design-automation-pipeline.md        ✅ 5-0 계약 문서
│   ├── phase5.md                            ← 본 파일
│   ├── phase5-0.md ~ phase5-8.md            ← 단계별 상세
├── config/
│   ├── figma.yaml                           ✅
│   └── figma-mapping.yaml                   ✅ 186 항목, 하이브리드 ID/name/path
├── scripts/pipeline/
│   ├── lib/
│   │   ├── config-loader.ts                 ✅ 5-1
│   │   ├── logger.ts                        ✅ 5-1
│   │   ├── figma-api.ts (+ test)            ✅ 5-1.5, retry/backoff
│   │   ├── snapshot-node.ts (+ test)        ✅ 5-2
│   │   ├── code-candidates.ts (+ test)      ✅ 5-4 선행
│   │   ├── token-css.ts (+ test)            ✅ 5-4 M1
│   │   ├── apply-token.ts (+ test)          ✅ 5-4 M1
│   │   ├── verify-report.ts (+ test)        ✅ 5-5
│   │   ├── visual-diff.ts (+ test)          ✅ 5-5
│   │   └── designer-review.ts (+ test)      ✅ 5-6
│   ├── preflight.ts                         ✅ 5-1
│   ├── bind.ts                              ✅ 5-1.5
│   ├── snapshot.ts                          ✅ 5-2
│   ├── marker-candidates.ts                 ✅ 5-4 선행
│   ├── diff.ts                              ✅ 5-3
│   ├── classify.ts                          ✅ 5-3
│   ├── apply.ts                             ✅ 5-4 M1/M2/M3
│   ├── verify.ts                            ✅ 5-5
│   ├── report.ts                            ✅ 5-6
│   ├── approve.ts / reject.ts               ✅ 5-6
│   ├── promote-dev.ts                       ✅ 5-7
│   └── run.sh                               ✅ 5-1~5-8, 8/8 활성
├── dist-dev/                                ✅ 5-7
└── .automation/
    ├── snapshots/                           ✅ 2 파일 (9.6KB, 300KB)
    ├── diffs/                                ✅ 5-3
    ├── reports/                              ✅ apply/verify/designer-review 리포트
    ├── logs/                                 ✅ preflight, snapshot, bind 로그 다수
    ├── baseline/                             ✅ snapshot `2026-05-06T06-00-44.json` + index.css + screenshots
    └── backups/                              ⬜ 5-4
```
