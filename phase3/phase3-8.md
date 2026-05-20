# Phase 3-8 — NotificationListItem

## 상태

✅ **Track A 완료 (2026-05-06)** — `NotificationCard` (phase3-6) 대체. ⑦ report-only 고도화는 Track B로 분리.

| 단계 | 산출물 | 상태 |
|---|---|:-:|
| ① | plan.md 결정사항 기록 | ✅ |
| ② | handoff.md 컴포넌트 표 갱신 | ✅ |
| ③ | design-system.md 사양 확정 (radius.xl 20, 토큰 매핑) | ✅ |
| ④ | figma-mapping.yaml 항목 교체 (apply: report-only 잠정) | ✅ |
| ⑤ | 코드 마이그레이션 (NotificationCard.tsx 삭제 → NotificationListItem.tsx 신설 → NotificationsScreen.tsx 교체) | ✅ |
| ⑥ | baseline 재산출 (`.automation/baseline/`) | ✅ (`cs-2026-05-06T05-08-36` approved/promoted, baseline JSON + screenshots 갱신) |
| ⑦ | report-only 리포트 품질 개선 (Phase 5-4 후속) | ⏳ |

---

## Figma 참조

| 항목 | 값 |
|---|---|
| 페이지 | `Settings > Notifications` (`179:11395`) |
| Reference 노드 | `179:11404` (List, actions variant) — 가장 풍부한 케이스 |
| File Key | `SXPVingkmqkrcLzcXYFsZd` |
| ComponentSet | **미구성** — Design System에 정식 컴포넌트 없음 (변형은 페이지 인스턴스로만 존재) |

### Variant 4종

| Variant | Figma 노드 | 하단 슬롯 | 전체 높이 |
|---|---|---|:-:|
| `actions` | `179:11404` | Decline + Accept (각 153px, gap 12) | 147px |
| `confirmed` | `179:11417` | 단일 disabled 버튼 318px ("Invitation Accepted") | 147px |
| `status-text` | `179:11428` | 텍스트 1줄 ("Invitation declined" 등, `#A3A3A3`) | 124px |
| `none` | `179:11439`, `179:11448` | 없음 | 75px |

---

## 사양 요약

`350×{147·147·124·75}`, padding 16, `radius.xl` (20), bg `bg.secondary` (#FAFAFA), shadow `shadow.xs`.

상세는 [`design-system.md`](../../design-system.md) §5 `Notification List Item` 섹션.

### Props (잠정 — ⑤에서 확정)

```ts
type NotificationVariant = 'actions' | 'confirmed' | 'status-text' | 'none'

interface NotificationListItemProps {
  variant: NotificationVariant
  title: string
  time: string                        // 예: "2 mins ago"
  subtext: string
  // variant === 'actions'
  onDecline?: () => void
  onAccept?: () => void
  declineLabel?: string               // default 'Decline'
  acceptLabel?: string                // default 'Accept'
  // variant === 'confirmed'
  confirmedLabel?: string             // default 'Invitation Accepted'
  // variant === 'status-text'
  statusText?: string                 // default 'Invitation declined'
}
```

---

## ⑤ 코드 마이그레이션 체크리스트

다음 세션에서 ⑤ 진입 시 순서대로 수행. 각 항목 완료 시 `[ ]` → `[x]`로 갱신.

- [x] `uno-home/src/compositions/NotificationListItem.tsx` 신설 — variant 4종 렌더링
- [x] atomic 재사용 검증 — Button(Secondary/Primary/Disabled) 활용. 새 atomic 추가 금지
- [x] `uno-home/src/screens/NotificationsScreen.tsx` 교체 — inline `NotificationItem` (phase3-6 메모 참조) 또는 NotificationCard 사용처를 NotificationListItem으로 치환
- [x] `uno-home/src/compositions/NotificationCard.tsx` 삭제
- [x] `uno-home/src/App.tsx` / 라우터 / Design System 갤러리 등에서 `NotificationCard` import 잔재 제거
- [x] `npm run typecheck` (또는 `tsc --noEmit`) — 통과 확인
- [x] `npm run lint` — 통과 확인
- [x] `npm run build` — 통과 확인
- [x] Playwright 시각 스냅샷 재캡처 (NotificationsScreen) — ⑥ promote-dev에서 baseline screenshots 갱신

## ⑥ baseline 재산출 체크리스트

- [x] `.automation/baseline/` 내 NotificationCard 관련 산출물 식별 — `2026-04-30T06-54-11.json:944` `notificationCard`(node 20:11424) 1건, screenshot은 `notifications.png` 1장(report-only screen 범위라 자동 갱신 X)
- [x] `npm run figma:bind` 재실행 → 21/21 유지. matched 13, not-found 8 (`notificationListItem` 포함 — ComponentSet 미구성, 잠정 매핑 보존 OK)
- [x] preflight + snapshot + diff + classify 부분 실행 → diff 2건(`notificationCard` removed / `notificationListItem` added, 둘 다 `structure` 클래스), classify autoApply=0 / reportOnly=2 (의도치 않은 변경 0건)
- [x] `npm run figma:apply` — **no-op** (autoApply=0, src/ 미수정 mtime diff로 확인) → `apply-cs-2026-05-06T05-08-36.md`
- [x] `npm run figma:verify` — build ✅ / lint ✅ / visual=skipped (변경 파일 없음) → `verify-cs-2026-05-06T05-08-36.md`
- [x] `npm run figma:report` — change-set `cs-2026-05-06T05-08-36` 생성, status=pending → `cs-2026-05-06T05-08-36.md`
- [x] `npm run figma:approve cs-2026-05-06T05-08-36` — report status=approved + `.approved` marker 생성
- [x] `npm run figma:promote cs-2026-05-06T05-08-36` — gates/build/smoke 통과, `dist-dev/` 반영
- [x] baseline JSON 갱신 — `.automation/baseline/2026-05-06T05-08-33.json`에 `notificationListItem` 반영, `notificationCard` 제거 확인
- [x] Playwright 시각 스냅샷 재캡처 (NotificationsScreen) — `.automation/baseline/screenshots/notifications.png` 갱신
- [ ] (선택) NotificationListItem이 안정화되면 figma-mapping.yaml `apply: report-only` → `partial` 승격 검토

## ⑦ report-only 고도화 (별 트랙)

⑤⑥ 완료 후 진입. 상세는 [phase5-4.md](../phase5/phase5-4.md). 핵심: 마커 없는 leaf의 사유 표시 품질 개선.

---

## 차단 요소 / 미결 사항

- **Figma 정식 ComponentSet 부재** — NotificationListItem의 4 variant가 Design System에 컴포넌트로 등록되지 않음. 자동 반영(`apply: partial` 이상)을 안전하게 하려면 디자이너가 Design System 페이지에 `Notification List Item` ComponentSet을 만들어야 함. 그 전까지는 `report-only`로 유지.
- **마커 카운트 확인 완료** — ⑥ 완료 후 `src/` 기준 `figma:text` 36건, `figma:prop` 14건 유지. NotificationCard 마커는 제거되고 NotificationListItem 마커로 대체됨.
