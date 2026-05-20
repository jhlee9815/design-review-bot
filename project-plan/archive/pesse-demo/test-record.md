# Pesse 데모 테스트 기록

> 발표용 Pesse Apple-inspired 트랙의 작업 이력 + 알려진 이슈 + 사용자 수동 수정 로그.
> 모든 시각은 KST (Asia/Seoul).

---

## 1. 캡처된 스냅샷

| 파일 | 시점 | 상태 |
|---|---|---|
| `snapshots/2026-05-20_full-board.png` | 2026-05-20 13:45 KST | **현재 최종 상태** — 토큰(색상+타이포)+아이콘 모두 적용 |
| `snapshots/2026-05-20_pre-typography.png` | 2026-05-20 ~10:30 KST | 아이콘 적용 직후, 타이포 토큰 전 |
| `snapshots/2026-05-20_icon-set.png` | 2026-05-20 ~10:20 KST | Icon 컴포넌트 셋 (7×4 그리드, 28 variants) |

확인 링크 (Figma): https://www.figma.com/design/9cevQvPHlQ5vZv5Pz3QaLL/Untitled?node-id=7-2

---

## 2. 현재 토큰/스타일 상태 (2026-05-20 13:45 KST 기준)

### 2-1. Apple 변수 컬렉션 (43개)
- 색상 primitives 17개 (Apple 정합)
- 색상 semantic 17개 (별칭)
- radius 7개
- 폰트 family 2개 (display, text)

### 2-2. Apple 텍스트 스타일 (16개)
`apple/display`, `apple/heading/lg|md|sm`, `apple/title/lg|md|sm`, `apple/label/lg|md|sm|xs`, `apple/body/md|sm|xs`, `apple/caption`, `apple/nano`

### 2-3. Icon 컴포넌트 셋 (1개, 28 variants)
Activity · ArrowLeft · BatteryFull · Bell · BellDot · Check · ChevronDown · ChevronRight · CircleAlert · CircleCheck · CirclePlay · Heart · HeartPulse · Home · Laugh · Moon · MoreVertical · Play · Plus · Podcast · Settings · Signal · Trash2 · User · UserPlus · Users · Wifi · X

---

## 3. 아이콘 적용 결과 (알려진 이슈 포함)

### 3-1. 정상 적용 (10건)
| 위치 | UNO 아이콘 | 비고 |
|---|---|---|
| Phone 1 Send 버튼 화살표 | ChevronRight | 원본 ↗ 대체 (UNO에 ArrowUpRight 없음) |
| Phone 1 Receive 버튼 화살표 | ArrowLeft | 원본 ↙ 대체 |
| Phone 1 Balance 옆 ▼ | ChevronDown | ✓ 정확 매칭 |
| Phone 1 바텀 nav [Home] | Home | ✓ 정확 매칭 |
| Phone 1 바텀 nav [User] | User | ✓ 정확 매칭 |
| Phone 2 New card pill | Plus | ✓ 정확 매칭 |
| Phone 2 Main card pill ✓ | Check | apple-blue 색상 |
| Phone 2 Close 버튼 ✕ | X | inverse 색상 |
| Phone 3 헤더 백 ← | ArrowLeft | ✓ 정확 매칭 |
| Phone 3 numpad backspace ⌫ | ArrowLeft | 대체 (UNO에 Delete 없음) |

### 3-2. ⚠️ 부정확한 대체 (UNO 셋에 정확한 아이콘 없음)
| 위치 | 원본 | 현재 대체 | 부정확 사유 |
|---|---|---|---|
| Phone 1 헤더 ? | 도움말 | CircleAlert | UNO에 HelpCircle 없음 — 경고 아이콘으로 대체 |
| Phone 1 Rewards pill 🎁 | 선물 상자 | Heart | UNO에 Gift 없음 — 의미상 stretch |
| Phone 1 바텀 nav [신용카드] 💳 | 카드 | CircleCheck | UNO에 CreditCard 없음 — 의미상 잘못됨 |
| Phone 1 바텀 nav [달러] $ | 통화 | CirclePlay | UNO에 DollarSign 없음 — 의미상 잘못됨 |
| Phone 1 바텀 nav [중간] ◎ | 눈/원 | Activity | UNO에 Eye 없음 |
| Phone 3 헤더 ? | 도움말 | CircleAlert | Phone 1과 동일 사유 |

### 3-3. ⚠️ 미해결 시각 이슈 (수동 수정 필요할 수 있음)
- Phone 2 "X Close" 버튼: X 아이콘과 "Close" 텍스트가 살짝 겹침 — itemSpacing 보강 또는 아이콘 크기 조정 필요
- Phone 2 "+ New card" pill: + 아이콘 위치가 텍스트와 너무 가까움 — 동일 사유
- Phone 1 Rewards pill의 Heart 아이콘: 다크 배경 위 흰색이지만 디자이너 의도(선물=따뜻한 느낌)과 어긋남 — 일관성 위해 다른 아이콘 권장
- Phone 1 바텀 nav 5개 중 가운데 3개 (CircleCheck, CirclePlay, Activity 등): 의미 부정확. 발표 시 청중이 "이건 뭐예요?" 물을 가능성

### 3-4. UNO 셋 확장 후보 (선택)
프로젝트 정책상 "UNO 디자인 시스템 아이콘만" 사용 중이지만, 발표 임팩트 위해 다음 추가 가능:
- HelpCircle (도움말 ?)
- Gift (선물 🎁)
- CreditCard (카드 💳)
- DollarSign (통화 $)
- Eye 또는 Circle (보안/시각화 ◎)
- ArrowUpRight, ArrowDownLeft (Send/Receive 정확 매칭)

→ 추가 시 `uno-home/src/components/Icon.tsx`의 `ICON_MAP`도 함께 확장해야 정합성 유지.

---

## 4. 사용자 수동 수정 로그

> 사용자가 직접 Figma 또는 코드에서 수정한 내용 기록.
> 각 수정 후 한 줄 추가하세요. 형식: `[시각 KST] (위치) 무엇을 어떻게 → 이유`

### 2026-05-20

- _아직 수동 수정 없음 — 진행 시 추가_

<!-- 예시:
- [2026-05-20 14:10 KST] (Phone 1 바텀 nav 4번째) CirclePlay → Plus로 수동 교체 → Plus가 "송금/추가" 의미에 더 가까움
- [2026-05-20 14:25 KST] (Phone 2 Close 버튼) itemSpacing 6 → 10으로 늘림 → X와 텍스트 겹침 해소
-->

---

## 5. 작업 타임라인 (2026-05-20)

| 시각 (KST) | 작업 | 상태 |
|---|---|---|
| ~08:00 | 이전 세션 (보완 트랙 ① git init, ②-a/②-b SKILL.md, ③ claude-review.ts wrapper, ④ minimal-test, ⑤ sample report) | ✅ |
| ~09:30 | A/B/C 작업 (Phase 3 정합성, Phase 4 Apple adapter, Phase 5 발표 리포트 초안) | ✅ |
| ~10:00 | Pesse Figma 토큰 셋업 초기 (lime 포함 31 variables) | ✅ 추후 수정됨 |
| ~10:05 | Pesse 3개 화면 Figma에 빌드 (Home/Cards/Send) | ✅ |
| ~10:15 | 사용자 피드백: "Apple에 라임 없음" → 토큰 Apple-strict로 재정렬 (41 variables) | ✅ |
| ~10:30 | Pesse React 화면 3개 작성 (`PesseHomeScreen/CardsScreen/SendScreen.tsx`) | ✅ |
| ~10:50 | Figma 토큰 만료 → 사용자가 새 토큰 발급 후 .env 갱신 | ✅ |
| ~11:05 | 파이프라인 Pesse로 재등록 + baseline 사이클 (`cs-2026-05-20T02-09-13`) | ✅ |
| ~11:30 | 매핑 편집: PesseSendScreen 7:5 → `apply: partial`, `allowedClasses: [text]` | ✅ |
| ~11:35 | `figma:text` 마커 `pesse.send.cta` → Figma node 10:62 | ✅ |
| ~12:00 | plan.md 전체 재작성 (11 섹션) | ✅ |
| ~12:30 | UNO Lucide 아이콘 28개를 Pesse Figma에 컴포넌트 셋으로 등록 | ✅ |
| ~12:50 | Pesse 3개 화면에 아이콘 16건 교체 (emoji/symbol → Icon instances) | ✅ |
| ~13:00 | 헬프 아이콘 중심 정렬 fix | ✅ |
| ~13:30 | Apple 타이포그래피 16개 텍스트 스타일 + 폰트 변수 2개 등록 | ✅ |
| ~13:40 | 67개 텍스트 노드를 텍스트 스타일에 자동 매핑 | ✅ |
| **2026-05-20 13:45** | **현재 스냅샷 캡처 + 본 기록 작성** | ✅ |

---

## 6. 다음 액션 (사용자 확정 대기)

| 옵션 | 내용 | 시간 |
|---|---|---|
| A | UNO 아이콘 셋 확장 (HelpCircle, Gift, CreditCard, DollarSign 등 추가) | 30분 |
| B | 시각 polish (Close 겹침, 바텀 nav 의미 부정확 수정) | 20분 |
| C | **자동 반영 데모 진행** — Figma "Send money" 텍스트 수정 → `npm run figma:run` | 5분 |
| D | 본 시점에서 일단 git commit | 5분 |

기본 추천: **C (데모) → D (커밋)** 순. A/B는 발표 일정 여유 있을 때.

---

## 7. 참고 경로

| 종류 | 경로 |
|---|---|
| Pesse Figma 파일 | https://www.figma.com/design/9cevQvPHlQ5vZv5Pz3QaLL/Untitled?node-id=7-2 |
| Pesse React 화면 | `src/screens/Pesse{Home,Cards,Send}Screen.tsx` |
| Apple 토큰 CSS (어댑터) | `design-systems/apple/apple-tokens.css` |
| Apple 토큰 JSON | `design-systems/apple/apple-tokens.json` |
| 매핑 | `config/figma-mapping.yaml` |
| 마커 | `src/screens/PesseSendScreen.tsx` (line ~14, `pesse.send.cta` → 10:62) |
| Baseline | `.automation/baseline/2026-05-20T02-09-13.json` |
| UNO 백업 | `.automation/backups/figma-mapping.2026-05-20T02-07-19-249Z.yaml` 등 |
| 전체 계획 | `plan.md` |
| 다음 세션 가이드 | `TODO.md` |
| 발표 리포트 초안 | `project-plan/phase-5/presentation-report.md` |
