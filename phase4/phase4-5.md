# Phase 4-5 — Manage Members Screen (스와이프 삭제)

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:3904` |
| Name | `mo - Manage Members` |
| Path | `["Page1"]` |
| 비고 | 5-1.5 보정. 이전 `20:11398` (ContextMenu 'Manage Members' 항목 200×48) false positive. swipe-delete (red trash) 상태가 reference 일치 |

## 레퍼런스 이미지

`design-test/refernce/mo - Family Management-delete.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/ManageMembersScreen.tsx` |
| 라인 수 | 43 |
| Route | `/screens/manage-members` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Header` | 상단 | `variant="BackTitleNoAction"`, title "Manage Members" |
| `ListItem` | 멤버 목록 (3개) | `Default`/`SwipeDelete` 혼용 |

---

## 멤버 목록 데이터

| 이름 | State | Badge | Avatar |
|---|---|---|---|
| Charles (Me) | `Default` | `admin` | `active` |
| Sarah | `SwipeDelete` | `member` | default |
| Olive | `Default` | `member` | default |

---

## 자동화 정책

```yaml
manageMembers:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보

| 항목 | 위치 |
|---|---|
| Header title `"Manage Members"` | `ManageMembersScreen.tsx:14` |

→ 정적 텍스트는 Header title 1개뿐. 멤버 데이터(Charles/Sarah/Olive)는 데이터 바인딩으로 변경 예정.
