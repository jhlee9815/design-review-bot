# Phase 2-3 — Avatar

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `15:11398` |
| Name | `Avatar` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/components/Avatar.tsx` |
| 라인 수 | 35 |

---

## Props

```ts
interface AvatarProps {
  initials?: string         // default 'AB'
  size?: 'sm' | 'md' | 'lg' // default 'md'
  state?: 'default' | 'active' // default 'default'
}
```

## Variant 매트릭스

| Size | px | Font px |
|---|---|---|
| `sm` | 32 | 13 |
| `md` | 40 | 16 |
| `lg` | 48 | 18 |

| State | 배경 | 글자색 |
|---|---|---|
| `default` | `var(--bg-avatar)` | `var(--text-primary)` |
| `active` | `var(--interactive-primary)` | `var(--text-inverse)` |

---

## 자동화 정책 (figma-mapping.yaml)

```yaml
avatar:
  apply: auto
  allowedClasses: [token, component-props]
```

**`text` 미포함 이유**: 이니셜은 사용자 데이터(데이터 바인딩)이므로 Figma에서 변경되지 않음.

---

## 사용처

| 위치 | 컴포넌트 | 사용 |
|---|---|---|
| `compositions/ListItem.tsx` | ListItem | size `md` |
| `compositions/NotificationCard.tsx` | NotificationCard | size `md` |
| `screens/HomeScreen.tsx` | HomeScreen | size `lg`, `active`/`default` 혼용 |

---

## Phase 5-4 마커 후보

이니셜은 데이터 바인딩이므로 마커 대상 아님. `size`/`state`는 `figma:prop` 마커 대상이지만, ListItem/NotificationCard에서 고정값으로 사용 중이라 자동 반영 효용 낮음.
