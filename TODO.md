# TODO — 다음 세션 시작 가이드

> 작성: 2026-05-20
> 최신 갱신: 2026-05-20 13:45 KST (Pesse 디자인 시스템 완성, 자동 반영 데모 준비됨)

---

## 0. 이 세션이 끝난 시점의 상태 (30초 요약)

- **현재 파이프라인 활성**: Pesse Figma `9cevQvPHlQ5vZv5Pz3QaLL` (UNO 설정은 `.automation/backups/`에 안전 보관)
- **Pesse 디자인 시스템 완성**:
  - 색상 토큰 34개 (Apple-strict, no lime) — primitives 17 + semantic 17
  - 폰트 토큰 2개 (display, text)
  - radius 7개
  - **텍스트 스타일 16개** (`apple/display`, `apple/heading/*`, `apple/title/*`, `apple/label/*`, `apple/body/*`, `apple/caption`, `apple/nano`)
  - **Icon 컴포넌트 셋 1개 (28 variants)** — UNO Lucide 셋 1:1
- **Pesse 3개 화면**: 색상+타이포+아이콘 토큰에 모두 연결됨 (67 텍스트 + 16 아이콘 인스턴스)
- **React 코드**: `PesseHomeScreen/CardsScreen/SendScreen.tsx` + `Send money` CTA에 `figma:text` 마커 (자동 반영 대상)
- **Skill + Wrapper**: `.claude/skills/{uno,apple}-design-system/SKILL.md` + `npm run figma:claude-review`
- **baseline**: `2026-05-20T02-09-13.json` (Pesse) + 3 screenshot baseline
- **git**: 로컬 3 커밋 (`b9adf2b feat: phase 3-5` + `756756f` + `e499bbe`). Pesse 추가 작업은 미커밋
- **테스트 기록**: `project-plan/pesse-demo/test-record.md` + `snapshots/` (3장 PNG)

---

## 1. 첫 진입 — 5분

체크하고 시작:

```bash
cd /Users/juhee/Work/Test/design-test/uno-home

# 상태 확인
git status                                        # 미커밋 9개 파일 확인
git log --oneline                                 # e499bbe + 756756f 2개 커밋

# 최종 검증 재실행 (예전 세션 결과 그대로인지 확인)
npm run build && npm run lint                     # 둘 다 PASS 기대
npm run figma:claude-review                       # UNO 트랙 리포트 생성
npm run figma:claude-review -- --source apple     # Apple 트랙 리포트 생성
```

문제 없으면 §2로. 문제 있으면 §6 트러블슈팅 먼저.

---

## 2. 우선순위 1 — 자동 반영 데모 직접 돌려보기 (5분)

`plan.md` §10-A의 STEP 1~7 그대로:

1. Figma 열기 (https://www.figma.com/design/9cevQvPHlQ5vZv5Pz3QaLL/Untitled?node-id=7-5)
2. Send Money 화면 다크 CTA 버튼 안의 "Send money" 텍스트 더블클릭
3. 다른 단어로 변경 (예: "Send funds")
4. `npm run figma:run`
5. `grep "Send money\|Send funds" src/screens/PesseSendScreen.tsx` → 텍스트가 코드에 자동 패치됐는지 확인
6. `npm run figma:claude-review` → 3-band markdown 생성 확인
7. (선택) `npm run figma:approve cs-{id}` + `npm run figma:promote cs-{id}` → 사이클 닫기

작업 기록: 매 시도 후 `project-plan/pesse-demo/test-record.md` §4에 한 줄 추가.

---

## 3. 우선순위 2 — 미커밋 9개 묶어서 커밋 (5분)

> 사용자 명시 승인 후에만 실행 (글로벌 정책 — 명시 없이 git 명령 금지).

**커밋 대상 (다음 세션 시작 시 git status 확인)**:
```
 M plan.md
 M src/App.tsx
 M src/components/Button.tsx
 M src/main.tsx
 M handoff.md            # 본 세션에서 추가 갱신될 수 있음
 M README.md             # 본 세션에서 추가 갱신될 수 있음
?? TODO.md               # 본 파일
?? design-systems/apple/apple-tokens.css
?? design-systems/apple/checklist-example.md
?? project-plan/phase-5/presentation-report.md
?? src/components/AppleCard.tsx
?? src/screens/AppleDemoScreen.tsx
```

**제안 커밋 메시지** (또는 분할 — 사용자 선택):
- 통합: `feat: phase 3-5 (apple adapter + checklist-example + presentation report)`
- 분할 시:
  - `docs(phase-3): add Apple DS checklist-example`
  - `feat(phase-4): Button apple-variants + AppleCard + AppleDemoScreen`
  - `docs(phase-5): presentation report draft`
  - `docs: update README/handoff with claude-review + TODO`

---

## 4. 우선순위 3 — 발표 데모 리허설 (15분)

```bash
# 데모 1: UNO 트랙 자동 리포트
npm run figma:claude-review
# → .automation/reports/claude-review-uno-<ts>.md 생성, 3-band markdown 확인

# 데모 2: Apple 트랙 자동 리포트
npm run figma:claude-review -- --source apple
# → 4 Claude items + 3 Human items 자동 생성 확인

# 데모 3: 시각 (npm run dev)
npm run dev
# 브라우저에서 http://localhost:5173 → 가장 하단 "Phase 4 — Apple-inspired Adapter Demo" 섹션
# - Apple primary 파란 pill 버튼
# - Apple pill-link outline 버튼
# - light surface AppleCard (Cinematic neutrals)
# - dark surface AppleCard (Focused moments)

# 데모 4: 모범 리포트
cat project-plan/supplementary-2026-05-20/sample-cs-report.md
# → 7섹션 발표용 표본
```

발표 흐름 (`project-plan/phase-5/presentation-report.md` §1~§12 그대로):
1. 한 문장 요약
2. 문제 정의 → 목표
3. 파이프라인 다이어그램
4. 감지 기준
5. 3단계 분류표
6. Skill 두 트랙
7. Button 사례 (Phase 4 결과)
8. 페이지별 리포트 (sample-cs-report.md 인용)
9. 산출물 표
10. 기대효과
11. 한계 5개 (정직 공개)
12. 다음 단계

---

## 5. 선택 작업 (시간 여유 있을 때)

| 우선도 | 작업 | 예상 |
|:-:|---|---|
| Low | `--use-claude` 옵션 실제 구현 (Anthropic SDK 통합) | 1~2h |
| Low | minimal-test에 동일 wrapper 이식 | 2h |
| Low | Apple Phase 4 확장 (Navigation glass, Hero) | 1d |
| Low | Slack/PR comment 알림 출력 | 1d |
| Low | git remote 추가 + GitHub 푸시 (사용자 명시 필요) | 30분 |

이 항목들은 **발표 자체에 필수가 아님**. 발표 끝나고 다음 사이클로.

---

## 6. 트러블슈팅

| 증상 | 확인 |
|---|---|
| `npm run figma:claude-review` 실패: "Skill file missing" | `.claude/skills/{uno,apple}-design-system/SKILL.md` 존재 확인 |
| `npm run figma:claude-review` 실패: "No classified diff found" | `npm run figma:classify` 먼저 실행하거나 `--input` 직접 지정 |
| `npm run build` TS 에러 | `src/components/Button.tsx`의 `ButtonVariant` 타입에 apple 변형 두 개 들어있는지 확인 |
| `npm run dev` Apple 섹션이 빈 화면 | `src/main.tsx`에서 `apple-tokens.css` import 라인 확인 |
| Codex 응답 없음 | 1시 이후 재시도, 그래도 없으면 토큰 한도 갱신 여부 확인 |

---

## 7. 참고 문서 인덱스

| 종류 | 경로 |
|---|---|
| 전체 계획 | [plan.md](./plan.md) |
| 디자이너 핸드오프 | [handoff.md](./handoff.md) |
| 운영 가이드 | [README.md](./README.md) |
| Apple 트랙 phase 단계 | [project-plan/phase-1/](./project-plan/phase-1/) ~ [phase-5/](./project-plan/phase-5/) |
| 보완 트랙 | [project-plan/supplementary-2026-05-20/](./project-plan/supplementary-2026-05-20/) |
| 발표 리포트 초안 | [project-plan/phase-5/presentation-report.md](./project-plan/phase-5/presentation-report.md) |
| 모범 cs 리포트 | [project-plan/supplementary-2026-05-20/sample-cs-report.md](./project-plan/supplementary-2026-05-20/sample-cs-report.md) |
| UNO Skill | [.claude/skills/uno-design-system/SKILL.md](./.claude/skills/uno-design-system/SKILL.md) |
| Apple Skill | [.claude/skills/apple-design-system/SKILL.md](./.claude/skills/apple-design-system/SKILL.md) |
| Apple checklist example | [design-systems/apple/checklist-example.md](./design-systems/apple/checklist-example.md) |
| Apple preview HTML | http://127.0.0.1:4177/design-systems/apple/preview.html (또는 `design-systems/apple/preview.html`) |
