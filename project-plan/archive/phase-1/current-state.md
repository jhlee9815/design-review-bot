# Phase 1 Current State

## 프로젝트 위치

- 메인 프로젝트: `/Users/juhee/Work/Test/design-test/uno-home`
- 보조 데모: `/Users/juhee/Work/Test/design-test/minimal-test`
- 외부 Apple-inspired DS: `/Users/juhee/Work/Test/awesome-design-md/design-md/apple`

## 현재 자동화 자산

- `package.json`에 Figma pipeline scripts 존재
- `config/figma.yaml`: 기존 Figma file key `SXPVingkmqkrcLzcXYFsZd`
- `config/figma-mapping.yaml`: 기존 Figma node mapping
- `.automation/baseline/`: 승인 baseline 보존 필요
- `scripts/pipeline/`: snapshot/diff/classify/apply/verify/report 파이프라인

## 현재 전략

Apple DS로 기존 UNO DS를 덮어쓰지 않는다. Apple DS는 외부 입력값으로 등록하고, 추후 token adapter/Skill/component demo를 통해 연결한다.

## 보존 대상

- `src/`
- `scripts/`
- `config/`
- `tokens.json`
- `design-system.md`
- `.automation/baseline/`
- 기존 `phase1`~`phase7` 이력

## 정리 후보

- 루트 임시 screenshot PNG
- `.DS_Store`
- `.playwright-mcp/` 과거 브라우저 로그
- `.omc/` HUD 캐시
