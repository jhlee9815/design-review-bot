# Phase 4-8 — Notifications Screen

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:7687` |
| Name | `Settings > Notifications` |
| Path | `["Page1"]` |
| 비고 | 5-1.5 보정. 이전 `0:3759` (alert 모달 dim 레이어) false positive. reference(Settings _ Notifications.png) 픽셀 단위 일치 |

## 레퍼런스 이미지

`design-test/refernce/Settings _ Notifications.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/NotificationsScreen.tsx` |
| 라인 수 | 101 |
| Route | `/screens/notifications` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Header` | 상단 | `variant="BackTitleNoAction"`, title "Notifications" |
| `Button` | 각 NotificationItem 내부 | `primary`/`secondary`/`ghost` |

**Inline `NotificationItem`**: composition `NotificationCard` 미사용. 같은 파일 내 별도 함수 컴포넌트로 정의 (구조가 NotificationCard와 다름 — `timeAgo`/`description` 필드, 4가지 status).

```ts
type NotifStatus = 'pending' | 'accepted' | 'declined-self' | 'declined-other'
```

---

## NotificationItem status별 액션 영역

| Status | Footer |
|---|---|
| `pending` | `<Button variant="secondary" label="Decline">` + `<Button variant="primary" label="Accept">` |
| `accepted` | `<Button variant="ghost" label="Invitation Accepted" />` (전체 너비) |
| `declined-self` / `declined-other` | "Invitation declined" 텍스트 (14px, disabled) |

---

## 레이아웃 — 5개 NotificationItem

| # | Title | Status |
|---|---|---|
| 1 | "Group Invitation" | `pending` |
| 2 | "Group Invitation" | `accepted` |
| 3 | "Group Invitation" | `declined-self` |
| 4 | "Group invitation declined" | `declined-other` |
| 5 | "Group invitation declined" | `declined-other` |

각 항목 사이 1px divider (`var(--border-default)`).

---

## 자동화 정책

```yaml
notifications:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보 (텍스트 다수)

| 항목 | 위치 |
|---|---|
| Header title `"Notifications"` | `NotificationsScreen.tsx:64` |
| Section header `'Requests'` | `NotificationsScreen.tsx:68` |
| `'Group Invitation'` (default title) | `NotificationsScreen.tsx:74` |
| `'Group invitation declined'` | `NotificationsScreen.tsx:89, 94` |
| Description default `"Invited by mom@gmail.com to join Mom's House"` | `NotificationsScreen.tsx:14, 76, ...` |
| `'Invitation Accepted'` (Button label) | `NotificationsScreen.tsx:44` |
| `'Invitation declined'` | `NotificationsScreen.tsx:48` |
| `timeAgo` default `'2 mins ago'` | `NotificationsScreen.tsx:13` |

→ 데이터 바인딩 후보 다수 (timeAgo, description, name@email). 정적 텍스트는 status별 라벨/버튼.

---

## Composition vs Inline 결정 기록

NotificationsScreen은 의도적으로 NotificationCard를 사용하지 않음:

| 구조 | NotificationCard | NotificationsScreen 항목 |
|---|---|---|
| 좌측 Avatar | ✅ | ✗ |
| timeAgo 표시 | ✗ | ✅ |
| status 종류 | 3 (`Pending`/`Accepted`/`Declined`) | 4 (+`declined-other`) |
| 카드 border + radius | ✅ (16px, 1px) | ✗ (행 단위, divider만) |

→ 향후 통합 검토 가능하지만 현재는 분리 유지.
