# Phase 3-2 — Header

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `18:11416` |
| Name | `Header` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/Header.tsx` |
| 라인 수 | 74 |
| 사용 atomic | Icon |

---

## Props

```ts
type HeaderVariant = 'BackTitle' | 'TitleActions' | 'BackTitleNoAction'

interface HeaderProps {
  variant?: HeaderVariant   // default 'BackTitle'
  title?: string            // default 'Title'
}
```

## Variant ↔ 렌더링 매핑

| Variant | Left | Center | Right |
|---|---|---|---|
| `BackTitle` | `ArrowLeft` | title (centered, 16px bold) | `User` |
| `TitleActions` | title (left, 18px bold) | — | `Bell`, `Settings` |
| `BackTitleNoAction` | `ArrowLeft` | title (centered, 16px bold) | placeholder div (24×24, 균형용) |

Width 390px, height 56px, padding 0 20px.

---

## 자동화 정책

```yaml
header:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

| 화면 | Variant | Title |
|---|---|---|
| FamilyScreen | `BackTitle` | "Family Management" |
| CreateGroupScreen | `BackTitleNoAction` | "Create Group" |
| ManageMembersScreen | `BackTitleNoAction` | "Manage Members" |
| NotificationsScreen | `BackTitleNoAction` | "Notifications" |
| HomeScreen | (custom header, Header 미사용) | — |

---

## Phase 5-4 마커 후보

`title` default 'Title'은 placeholder. 호출처에서 실제 화면 타이틀이 들어감 → 마커는 호출처(화면)에 둠.
