# Phase 3-3 — TabNavigation

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `20:11386` |
| Name | `Tab Navigation` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/TabNavigation.tsx` |
| 라인 수 | 49 |
| 사용 atomic | — (raw button) |

---

## Props

```ts
type TabName = 'All' | 'My Family' | 'Guests'

interface TabNavigationProps {
  activeTab?: TabName                       // default 'All'
  onTabChange?: (tab: TabName) => void
}

const TABS: TabName[] = ['All', 'My Family', 'Guests']
```

## 활성 / 비활성 스타일

| State | 글자색 | 하단 border |
|---|---|---|
| Active | `var(--text-primary)` | `2px solid var(--brand-primary)` |
| Inactive | `var(--text-secondary)` | `2px solid transparent` |

Width 390px, height 44px. 3개 탭이 `flex: 1`로 균등 분배.

---

## 자동화 정책

```yaml
tabNavigation:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

| 화면 | activeTab |
|---|---|
| HomeScreen | `'All'` |

---

## Phase 5-4 마커 후보

탭 라벨 `'All'`/`'My Family'`/`'Guests'`는 `TABS` 상수 내부 → 마커 주입 가능. 다만 Figma도 동일 라벨이라 변경 빈도 낮음.

| 항목 | 위치 | 마커 |
|---|---|---|
| TABS 배열 | `TabNavigation.tsx:8` | `figma:text id="tabnav.tabs"` (배열 단위) |
