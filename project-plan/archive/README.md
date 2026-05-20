# Archive — Phase 1~5 + 데모 트랙 (2026-04-30 ~ 2026-05-20)

> 2026-05-20에 phase 1~5와 Pesse 라이브 데모 트랙이 전부 완료되었습니다.
> 이 폴더는 완료된 작업의 증거 자료를 보존합니다.
> **현재 진행 중인 작업은 [`../phase-6/`](../phase-6/) 부터 시작.**

## 폴더 인덱스 (원본 보존)

| 폴더 | 내용 | 완료일 |
|---|---|---|
| `phase-1/` | 현 상태 고정, Apple DS 입력 등록, 정리 작업 | 2026-05-08 |
| `phase-2/` | Apple DS 토큰 후보 추출 (`apple-tokens.json` 초안) | 2026-05-08 |
| `phase-3/` | Apple Skill 운영 가이드 명시화 | 2026-05-13 |
| `phase-4/` | Button apple-variants + AppleCard + AppleDemoScreen | 2026-05-13 |
| `phase-5/` | 발표 리포트 13 슬라이드 작성 | 2026-05-18 |
| `supplementary-2026-05-20/` | Claude–Codex 합의 보완 작업 (5/5 완료) | 2026-05-20 |
| `pesse-demo/` | Pesse 라이브 데모 트랙 (3개 화면 + 자동 반영) | 2026-05-20 |

## 핵심 산출물 요약 (한눈에)

### 코드 (활성)
- `design-systems/apple/apple-tokens.css` · `apple-tokens.json`
- `src/components/Button.tsx` · `AppleCard.tsx`
- `src/screens/AppleDemoScreen.tsx`
- `src/screens/PesseHomeScreen.tsx` · `PesseCardsScreen.tsx` · `PesseSendScreen.tsx`
- `.claude/skills/apple-design-system/SKILL.md` · `uno-design-system/SKILL.md`
- `scripts/pipeline/claude-review.ts` + `npm run figma:claude-review`

### Figma (활성)
- 파일: `9cevQvPHlQ5vZv5Pz3QaLL` (Pesse Apple Demo)
- 43 variables (17 색상 primitives + 17 semantic + 7 radii + 2 폰트 family)
- 16 텍스트 스타일 (`apple/display`, `apple/heading/*`, `apple/title/*`, …)
- Icon 컴포넌트 셋 28 variants (node `22:129`)
- 3개 화면: Home `7:3` · Cards `7:4` · Send `7:5`

### 파이프라인 상태
- 활성 baseline: `.automation/baseline/2026-05-20T02-09-13.json` + 3 screenshots
- 활성 매핑: `config/figma-mapping.yaml` (5 entries)
- 활성 마커: `pesse.send.cta` → node `10:62` (`PesseSendScreen.tsx` line ~20)
- UNO 설정 백업: `.automation/backups/figma-mapping.2026-05-20T02-07-19-249Z.yaml`

## Phase 1~5에서 얻은 발표 메시지

> "Apple-inspired Markdown 디자인 시스템을 외부 입력값으로 등록하고, 이를 토큰/컴포넌트/개발 체크리스트로 변환해 기존 Figma 변경 감지 파이프라인과 연결 가능한지 검증하는 실험입니다. 완전 자동 코드 반영이 아니라, 자동 감지 가능한 항목과 사람 검토가 필요한 항목을 분리해 개발 전달 비용을 줄이는 것이 목표입니다."

자세한 발표 흐름은 [`phase-5/presentation-report.md`](./phase-5/presentation-report.md) 13 슬라이드 참조.

## Phase 1~5의 한계 (다음 단계에서 해소 대상)

| # | 한계 | Phase 6에서 다룸? |
|---|---|---|
| 1 | 자동 반영 범위 좁음 (마커 부착된 노드만) | 일부 — 마커 확장은 Phase 7 |
| 2 | Visual diff는 routed screens 일부만 | 그대로 유지 |
| 3 | 레이아웃/구조 자동 적용 영구 보류 | 그대로 |
| 4 | Claude 분석 deterministic encoding (`--use-claude` 미구현) | Phase 7 후순위 |
| 5 | Pesse auto-apply는 CTA 텍스트 1건만 | Phase 6에서 마커 확장 옵션 |

## Codex-Claude 합의 (2026-05-20)

기술 데모 평점 60~65 / 발표 평점 75~80. Skill 부재가 블로커였고, Phase 1~5 완료 시점에 모두 해소됨.
세부: [`supplementary-2026-05-20/README.md`](./supplementary-2026-05-20/README.md)
