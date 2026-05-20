# Phase 4-2 — Home Screen (대시보드)

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:2652` |
| Name | `mo - Home Hub` |
| Path | `["Page1"]` |
| 비고 | 5-1.5 보정. 이전 `18:11387` (BottomNav 'Home' 탭 78×66) false positive |

## 레퍼런스 이미지

`design-test/refernce/mo - Home.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/HomeScreen.tsx` |
| 라인 수 | 134 |
| Route | `/screens/home` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Icon` | custom header, family status, stat cards | `ChevronDown`, `BellDot`, `User`, `Moon`, `Heart` |
| `Avatar` | family status row | `size="lg"`, `state="active"`/`default` |
| `TabNavigation` | family status section | `activeTab="All"` |
| `BottomNavBar` | 하단 | `activeTab="Home"` |

**Header는 custom**: `Header` composition 미사용. center에 "Parent's Home Hub" + chevron, right에 BellDot + User 아이콘.

---

## 레이아웃 섹션

1. Custom header (56px) — center title + right icons
2. Family Status section header (uppercase, 11px tertiary)
3. `<TabNavigation activeTab="All" />`
4. Avatar row — Charles (Me, active), Sara, Mike, Peter (overflowX scroll)
5. Stat cards — Sleep (12.30 hrs) + Health (75/100), 2-col grid
6. `<BottomNavBar activeTab="Home" />`

390px width, `var(--bg-secondary)` 배경.

---

## 자동화 정책

```yaml
home:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보 (텍스트 다수)

| 항목 | 위치 |
|---|---|
| `"Parent's Home Hub"` | `HomeScreen.tsx:28` |
| `'FAMILY STATUS'` | `HomeScreen.tsx:53` |
| Avatar labels (`Charles (Me)`, `Sara`, `Mike`, `Peter`) | line 70~73 |
| `'Sleep'`, `'12.30'`, `'hrs'` | line 100, 103, 105 |
| `'Health'`, `'75'`, `'/100'` | line 120, 123, 125 |

→ 화면 텍스트가 가장 많은 곳. 데이터 바인딩 가능성도 높음 (Sleep 시간, Health 점수). 5-4 진입 시 코드 구조 결정 필요.
