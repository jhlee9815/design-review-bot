# Phase 2 Plan — Apple DS 토큰 후보 추출

## 목표

`awesome-design-md/design-md/apple/DESIGN.md`에서 색상, typography, spacing, radius, shadow를 추출해 프로젝트가 사용할 수 있는 토큰 후보로 구조화한다.

## 작업 절차

1. Apple `DESIGN.md`의 섹션별 토큰 후보 추출
2. `design-systems/apple/apple-tokens.json` 초안 작성
3. 기존 `tokens.json`/`src/index.css`와 충돌 가능성 비교
4. UNO 토큰을 덮어쓰지 않는 adapter 전략 정의
5. 자동 적용 가능/사람 검토 필요 항목 분류

## 산출물

- `project-plan/phase-2/phase-plan-2.md`
- `design-systems/apple/apple-tokens.json`
- `design-systems/apple/token-mapping.md`

## 완료 조건

- Apple-inspired 토큰 후보가 JSON/문서로 정리됨
- 기존 UNO 토큰과 충돌하지 않는 적용 전략이 명확함


---

## 진행 결과 (2026-05-20)

Phase 2를 실행해 Apple-inspired DS 토큰 후보를 추출했다.

### 작성된 산출물

| 파일 | 역할 |
|---|---|
| `apple-tokens.json` | Apple-inspired 색상/타입/spacing/radius/shadow/component token 후보 |
| `token-mapping.md` | 기존 UNO 토큰과 Apple 후보의 대응, 적용 가능성, 리스크 |
| `source-summary.md` | 원본 문서에서 읽은 범위와 추출/비추출 범위 |
| `phase-2-status.md` | Phase 2 완료 상태와 다음 단계 |

### 판단

Apple DS는 바로 Figma 자동화 source가 아니라 Markdown 기반 외부 DS 입력이다. 따라서 Phase 3에서 Skill로 감싸고, Phase 4에서 Button/Card/Hero 같은 제한된 컴포넌트에 적용한다.
