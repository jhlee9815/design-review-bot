# Phase 3-6 — NotificationCard (Deprecated)

## 상태

🗄️ **Deprecated (2026-05-06)** — `NotificationListItem`로 대체됨. 후속 작업 추적은 [phase3-8.md](./phase3-8.md).

> **사유**: 알림 페이지가 독립 카드 대신 리스트 아이템 구조로 통합 (Figma `179:11395` 기준). 결정 근거는 [plan.md](../../plan.md) 결정사항 표.
>
> **마이그레이션**: 코드(`NotificationCard.tsx`) 삭제 + `NotificationListItem.tsx` 신설 + `NotificationsScreen.tsx` 렌더 교체는 phase3-8 ⑤ 단계에서 일괄 처리.

---

## 원본 사양 (참고용 — 신규 작업에는 사용하지 말 것)

✅ 이전 완료 상태:

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `20:11424` |
| Name | `Notification Card` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/NotificationCard.tsx` |
| 라인 수 | 71 |
| 사용 atomic | Avatar, Button |

---

## Props

```ts
type NotificationState = 'Pending' | 'Accepted' | 'Declined'

interface NotificationCardProps {
  state?: NotificationState   // default 'Pending'
  name?: string               // default 'Kim Juhee'
  initials?: string           // default 'KJ'
  onAccept?: () => void
  onDecline?: () => void
}
```

## State ↔ Footer 렌더링 매핑

| State | Footer |
|---|---|
| `Pending` | `<Button variant="secondary" label="Decline">` + `<Button variant="primary" label="Accept">` (각 flex:1) |
| `Accepted` | "Accepted" 텍스트 (12px secondary) |
| `Declined` | "Declined" 텍스트 (12px secondary) |

335px width, radius 16px, padding 16px, 1px border.

Header: Avatar + name (14px bold) + "invited you to join" (12px secondary).

---

## 자동화 정책

```yaml
notificationCard:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

화면(Phase 4)에서 직접 사용처 없음. NotificationsScreen은 더 단순한 inline `NotificationItem`을 사용 (NotificationCard 미사용).

→ Design System 페이지 갤러리 전용. 향후 알림 위젯 추가 시 사용 예정.

---

## Phase 5-4 마커 후보

| 항목 | 위치 | 마커 |
|---|---|---|
| `'invited you to join'` | `NotificationCard.tsx:38` | `figma:text id="notifcard.invited"` |
| `'Decline'`, `'Accept'` | line 48, 55 | Button label, atomic Button에 위임 가능 |
| `'Accepted'`, `'Declined'` | line 63, 67 | state별 텍스트 |
