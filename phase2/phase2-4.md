# Phase 2-4 — Button

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `14:11402` |
| Name | `Button` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/components/Button.tsx` |
| 라인 수 | 71 |

---

## Props

```ts
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'  // default 'primary'
  size?: 'md' | 'lg'                                       // default 'lg'
  label?: string                                           // default 'Button'
  disabled?: boolean
  onClick?: () => void
  style?: React.CSSProperties                              // override (flex, width 등)
}
```

## Variant ↔ Figma 매핑

| 코드 | 배경 | 글자 | 테두리 |
|---|---|---|---|
| `primary` | `var(--interactive-primary)` | `var(--text-inverse)` | none |
| `secondary` | `var(--bg-primary)` | `var(--text-primary)` | `1.5px solid var(--border-default)` |
| `danger` | `var(--status-danger-default)` | `var(--text-inverse)` | none |
| `ghost` | `var(--interactive-disabled)` | `var(--text-disabled)` | none |

| Size | Height | Font |
|---|---|---|
| `md` | 44px | 15px |
| `lg` | 52px | 16px |

기본 width = 335px (`style` prop으로 override 가능).

---

## 자동화 정책 (figma-mapping.yaml)

```yaml
button:
  apply: auto
  allowedClasses: [token, text, component-props, layout]
```

**`auto` + `layout` 포함**: 가장 사용도 높은 atomic. 모든 분류 자동 반영 허용.

---

## 사용처

| 위치 | 컴포넌트 | 사용 |
|---|---|---|
| `compositions/NotificationCard.tsx` | NotificationCard | `secondary` (Decline), `primary` (Accept) |
| `compositions/Modal.tsx` | Modal | `secondary` (Done), `danger` (Delete) |
| `screens/SplashScreen.tsx` | SplashScreen | `primary` "Login" |
| `screens/FamilyScreen.tsx` | FamilyScreen | `secondary` "+ Create New Group" |
| `screens/CreateGroupScreen.tsx` | CreateGroupScreen | `primary` "Create" |
| `screens/NotificationsScreen.tsx` | NotificationsScreen | `primary`/`secondary`/`ghost` |

---

## Phase 5-4 마커 후보

| Status | 비고 |
|---|---|
| matched (default `label = 'Button'`) | Figma leaf 다수가 코드 default 하나에 매칭 → **마커 ID 정책 결정 필요** |

**문제**: Figma `Button` 컴포넌트는 variant별로 여러 leaf (`Variant=Primary / Login`, `Variant=Danger / Delete` 등)가 있는데, 코드는 `label = 'Button'` default 하나만 가짐. 호출처(`SplashScreen`의 "Login")가 실제 Figma leaf와 매칭됨.

→ 5-4 진입 전 결정: 마커를 컴포넌트 정의에 둘지, 호출처에 둘지. plan.md `5-4 진입 전 필수 결정 사항`의 **다음 액션 확정** 단락에서 언급된 케이스.
