# Phase 3-4 — BottomNavBar

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `18:11386` |
| Name | `Bottom Nav Bar` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/BottomNavBar.tsx` |
| 라인 수 | 70 |
| 사용 atomic | Icon |

---

## Props

```ts
type NavTabName = 'Home' | 'Activity' | 'Moon' | 'Podcast' | 'Play'

interface BottomNavBarProps {
  activeTab?: NavTabName                    // default 'Home'
  onTabChange?: (tab: NavTabName) => void
}

const NAV_TABS: { name: NavTabName; icon: IconName }[] = [
  { name: 'Home', icon: 'Home' },
  { name: 'Activity', icon: 'Activity' },
  { name: 'Moon', icon: 'Moon' },
  { name: 'Podcast', icon: 'Podcast' },
  { name: 'Play', icon: 'Play' },
]
```

## 활성 / 비활성 렌더링

| State | 렌더링 |
|---|---|
| Active | 56×28 알약 (`brand-primary`) + Icon (`icon-inverse`) |
| Inactive | Icon만 (`icon-secondary`) |

Width 390px, height 83px (iOS safe area 16px 포함), padding-bottom 16px.

---

## 자동화 정책

```yaml
bottomNavBar:
  apply: partial
  allowedClasses: [token, component-props, layout]   # text 제외
```

**`text` 제외 이유**: 탭 이름은 라벨 아니고 식별자. 아이콘만 보여줌.

---

## 사용처

| 화면 | activeTab |
|---|---|
| HomeScreen | `'Home'` |

---

## Phase 5-4 마커 후보

텍스트 없음. `figma:prop` 마커 대상 아님 (탭 정의는 코드 상수).
