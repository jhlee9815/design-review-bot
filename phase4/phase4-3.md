# Phase 4-3 — Family Management Screen

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:3857` |
| Name | `mo - Family Management` |
| Path | `["Page1"]` |
| 비고 | 베이스 화면. reference의 ContextMenu 메뉴 오픈 상태는 코드 React state 오버레이 (Figma는 베이스 프레임만 분리) |

## 레퍼런스 이미지

`design-test/refernce/mo - Family.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/FamilyScreen.tsx` |
| 라인 수 | 63 |
| Route | `/screens/family` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Icon` | Group card (좌측 원형 아이콘) | `Users` 20px |
| `Button` | 하단 CTA | `secondary`, `lg`, label "+ Create New Group" |
| `Header` | 상단 | `variant="BackTitle"`, title "Family Management" |
| `ContextMenu` | Group card 아래 (오버레이) | (default props) |

---

## 레이아웃

1. `<Header variant="BackTitle" title="Family Management" />`
2. Group card — 40×40 원형(`Users` 아이콘) + "My Family" + "2 Members"
3. `<ContextMenu />` (group card 아래 — 베이스 화면 위 오버레이)
4. 하단 `<Button variant="secondary" label="+ Create New Group" />`

390px width, `var(--bg-secondary)` 배경, minHeight 500px.

---

## 자동화 정책

```yaml
family:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보

| 항목 | 위치 |
|---|---|
| Header title `"Family Management"` | `FamilyScreen.tsx:17` |
| `'My Family'` | `FamilyScreen.tsx:47` |
| `'2 Members'` | `FamilyScreen.tsx:48` |
| Button label `"+ Create New Group"` | `FamilyScreen.tsx:59` |

→ 멤버 수("2 Members")는 데이터 바인딩 후보. 정적 텍스트는 헤더/버튼 라벨.
