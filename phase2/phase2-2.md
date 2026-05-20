# Phase 2-2 — Badge

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `15:11403` |
| Name | `Badge` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/components/Badge.tsx` |
| 라인 수 | 36 |

---

## Props

```ts
interface BadgeProps {
  variant?: BadgeVariant   // 'admin' | 'member' | 'owner', default 'member'
  label?: string           // override (default = variant 대문자)
}
```

## Variant ↔ Figma 매핑

| 코드 | Figma variant | 라벨 | 배경 |
|---|---|---|---|
| `admin` | `Type=ADMIN` (15:11400) | "ADMIN" | `var(--bg-card)` |
| `member` | `Type=MEMBER` (15:11402) | "MEMBER" | `var(--bg-card)` |
| `owner` | (코드 전용) | "OWNER" | `var(--bg-avatar)` |

---

## 자동화 정책 (figma-mapping.yaml)

```yaml
badge:
  apply: auto
  allowedClasses: [token, text, component-props]
```

**`auto` 이유**: 단순한 텍스트/색상 변경만 발생할 가능성이 높음. Phase 5-4 M1(token)/M2(text)/M3(props) 모두 안전.

---

## 사용처

| 위치 | 컴포넌트 | 사용 |
|---|---|---|
| `compositions/ListItem.tsx` | ListItem | optional `badge` prop |
| `screens/ManageMembersScreen.tsx` | 멤버 목록 | `admin`, `member` 라벨 |

---

## Phase 5-4 마커 후보

`marker-candidates-2026-04-30T06-57-15.md` 통계:

| Status | Count |
|---|---:|
| matched | 3 |
| ambiguous | 0 |
| missing | 0 |

**Matched 마커 후보**:

| Figma value | Code 위치 | 제안 마커 |
|---|---|---|
| `ADMIN` | `Badge.tsx:9` (string-literal) | `figma:text id="badge.admin" node="15:11400"` |
| `MEMBER` | `Badge.tsx:10` (string-literal) | `figma:text id="badge.member" node="15:11402"` |
| `OWNER` | `Badge.tsx:11` (string-literal) | `figma:text id="badge.owner" node="..."` |

→ M2 텍스트 자동 반영 활성화 시 가장 먼저 마커 주입할 후보.
