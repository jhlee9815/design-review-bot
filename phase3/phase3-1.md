# Phase 3-1 — ListItem

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `16:11415` |
| Name | `List Item / Member` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/ListItem.tsx` |
| 라인 수 | 95 |
| 사용 atomic | Avatar, Badge, Icon |

---

## Props

```ts
type ListItemState = 'Default' | 'Selected' | 'SwipeDelete'

interface ListItemProps {
  state?: ListItemState              // default 'Default'
  name?: string                      // default 'Kim Juhee'
  email?: string                     // default 'juhee@example.com'
  badge?: 'admin' | 'member' | 'owner'
  initials?: string                  // default 'KJ'
  avatarState?: 'default' | 'active' // default 'default'
}
```

## State ↔ 렌더링 매핑

| State | Right indicator | 비고 |
|---|---|---|
| `Default` | optional `<Badge>` + 빈 원형 (1.5px border) | 일반 목록 |
| `Selected` | optional `<Badge>` + 68×28 알약 (`brand-primary`) + `Check` 아이콘 | 선택 표시 |
| `SwipeDelete` | 72×64 적색(`status-danger-default`) 박스 + `Trash2` 아이콘 | 스와이프 삭제 상태 |

전체 64px 높이, paddingLeft 20px. `SwipeDelete`는 paddingRight 0.

---

## 자동화 정책

```yaml
listItemMember:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

| 위치 | State |
|---|---|
| `screens/CreateGroupScreen.tsx` | `Default` × 3 (Sarah, Mike, Sarah) |
| `screens/ManageMembersScreen.tsx` | `Default`/`SwipeDelete` 혼용 |

---

## Phase 5-4 마커 후보

기본값 `name`/`email`/`initials`은 데이터 바인딩이라 마커 외. atomic Avatar/Badge에 종속.
