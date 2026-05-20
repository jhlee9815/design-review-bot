# Phase 2-1 — Icon

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `36:11471` |
| Name | `Icon` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/components/Icon.tsx` |
| 라인 수 | 35 |
| 라이브러리 | lucide-react |

---

## Props

```ts
interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName       // ICON_MAP key
  size?: number        // default 24
  color?: string       // default 'var(--icon-primary)'
}
```

## 지원 아이콘 (ICON_MAP, 21종)

`Home`, `Bell`, `BellDot`, `Settings`, `User`, `UserPlus`, `Users`, `ChevronDown`, `ArrowLeft`, `X`, `Trash2`, `Check`, `CircleCheck`, `CircleAlert`, `Activity`, `Moon`, `Podcast`, `Play`, `Heart`, `Plus`, `MoreVertical`

새 아이콘 추가 시 `ICON_MAP`에 등록 + `IconName` 자동 추론.

---

## 자동화 정책 (figma-mapping.yaml)

```yaml
icon:
  apply: report-only
  allowedClasses: [asset, component-props]
```

**`report-only` 이유**: Figma의 Icon 변경은 대부분 `name` (asset replacement) 또는 `size`/`color` 변경. lucide-react import 추가가 필요하므로 자동 반영 위험.

---

## 사용처

| 위치 | 컴포넌트 | 사용 |
|---|---|---|
| `compositions/ListItem.tsx` | ListItem (Selected, SwipeDelete) | `Check`, `Trash2` |
| `compositions/Header.tsx` | Header | `ArrowLeft`, `User`, `Bell`, `Settings` |
| `compositions/BottomNavBar.tsx` | BottomNavBar | `Home`, `Activity`, `Moon`, `Podcast`, `Play` |
| `compositions/ContextMenu.tsx` | ContextMenu | `UserPlus`, `Users` |
| `compositions/Modal.tsx` | Modal | `X`, `CircleCheck`, `Trash2` |
| `screens/HomeScreen.tsx` | HomeScreen | `ChevronDown`, `BellDot`, `User`, `Moon`, `Heart` |
| `screens/FamilyScreen.tsx` | FamilyScreen | `Users` |

---

## Phase 5-4 마커 후보

`marker-candidates` 리포트에는 `text leaves: 0`으로 분류 (Icon은 텍스트 없음). `figma:prop` 마커가 `name` 속성에 적용 가능하지만, lucide import 추가 필요로 보류.
