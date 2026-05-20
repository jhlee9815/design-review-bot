# Phase 1 Plan — 현 상태 고정 및 Apple DS 입력 등록

## 목표

기존 UNO HOME 자동화 파이프라인을 보존한 상태에서 Apple-inspired 디자인 시스템을 별도 입력으로 등록한다. 이 단계에서는 코드 리디자인을 하지 않고, 현재 상태/증거/정리 범위를 고정한다.

## 작업 절차

1. 현재 프로젝트 구조와 자동화 자산 확인
2. 기존 `plan.md`를 새 목표 기준으로 갱신
3. 새 실행 계획 폴더 `project-plan/phase-*` 구성
4. Apple DS 원본 위치를 `design-systems/apple/source-index.md`에 등록
5. 재생성 가능한 임시 파일만 정리
6. `npm run figma:preflight`, `npm run build`, `npm run lint`로 상태 확인

## 산출물

- `plan.md`
- `project-plan/phase-1/phase-plan-1.md`
- `project-plan/phase-1/current-state.md`
- `design-systems/apple/source-index.md`
- `project-plan/phase-1/cleanup-report.md`

## 완료 조건

- 전체 목표와 단계별 계획이 문서화됨
- Apple DS가 기존 UNO DS를 덮어쓰지 않고 별도 입력으로 등록됨
- 삭제한 파일 목록과 보존한 파일 기준이 남아 있음
- build/lint/preflight 결과가 기록됨

## 주의

- `.env`는 열람/출력하지 않는다.
- 기존 `.automation/baseline/`은 삭제하지 않는다.
- 기존 `phase1`~`phase7`은 과거 이력으로 보존한다.
