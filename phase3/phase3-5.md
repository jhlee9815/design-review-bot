# Phase 3-5 — ContextMenu

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `20:11394` |
| Name | `Context Menu` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/ContextMenu.tsx` |
| 라인 수 | 68 |
| 사용 atomic | Icon |

---

## Props

```ts
interface ContextMenuProps {
  onInviteToHub?: () => void
  onManageMembers?: () => void
}
```

## 메뉴 항목 (고정 2개)

| 항목 | Icon | Label |
|---|---|---|
| Invite to Hub | `UserPlus` | "Invite to Hub" |
| Manage Members | `Users` | "Manage Members" |

200×112px, radius 12px, `var(--shadow-dropdown)`. 항목 사이 1px divider.

---

## 자동화 정책

```yaml
contextMenu:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

| 화면 | 위치 |
|---|---|
| FamilyScreen | Group card 아래 (베이스 화면 위 React state 오버레이) |

---

## Phase 5-4 마커 후보

| 항목 | 위치 | 마커 |
|---|---|---|
| `'Invite to Hub'` | `ContextMenu.tsx:39` | `figma:text id="contextmenu.invite"` |
| `'Manage Members'` | `ContextMenu.tsx:64` | `figma:text id="contextmenu.manage"` |

→ 5-4 M2 마커 주입 시 단순 텍스트 후보.

→ 5-1.5 보정 내역 참고: `manageMembers` 화면 매핑이 처음에 이 ContextMenu의 'Manage Members' 항목(200×48 false positive)으로 잘못 매칭됐던 사례. 자세한 보정은 [../phase5/phase5-1-5.md](../phase5/phase5-1-5.md).
