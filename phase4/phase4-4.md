# Phase 4-4 — Create Group Screen

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:3966` |
| Name | `mo - Create Group` |
| Path | `["Page1"]` |
| 비고 | 4 variants 중 베이스. reference(mo - Family Management.png)와 정확히 일치 |

## 레퍼런스 이미지

`design-test/refernce/mo - Family Management.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/CreateGroupScreen.tsx` |
| 라인 수 | 52 |
| Route | `/screens/create-group` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Button` | 하단 CTA | `primary`, `lg`, label "Create" |
| `Input` | Group Name 필드 | `state="filled"`, value "Gr0upGr0upGr0upGr0upGr0upGr0up" |
| `Header` | 상단 | `variant="BackTitleNoAction"`, title "Create Group" |
| `ListItem` | Select Members (3개) | `state="Default"`, Sarah/Mike/Sarah |

---

## 레이아웃

1. `<Header variant="BackTitleNoAction" title="Create Group" />`
2. Form area (padding 24px 20px, gap 24px)
   - "Group Name" 라벨 + `<Input state="filled" />`
   - "Select Members" 라벨 + ListItem × 3
3. 하단 `<Button variant="primary" label="Create" />`

390px width, `var(--bg-secondary)` 배경.

---

## 자동화 정책

```yaml
createGroup:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보

| 항목 | 위치 |
|---|---|
| Header title `"Create Group"` | `CreateGroupScreen.tsx:16` |
| `'Group Name'` 라벨 | `CreateGroupScreen.tsx:28` |
| `'Select Members'` 라벨 | `CreateGroupScreen.tsx:36` |
| Button label `"Create"` | `CreateGroupScreen.tsx:48` |

→ 정적 폼 라벨 + CTA. ListItem에 들어가는 Sarah/Mike는 데이터 바인딩 후보.
