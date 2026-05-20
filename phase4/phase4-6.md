# Phase 4-6 — Home Hub Delete Modal Screen

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:3040` |
| Name | `mo - Home Hub` |
| Path | `["Page1"]` |
| 비고 | "Delete Home? Bedroom Hub" 확인 모달. reference(mo - Home Hub.png) 정확히 일치 |

## 레퍼런스 이미지

`design-test/refernce/mo - Home Hub.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/HomeHubModalScreen.tsx` |
| 라인 수 | 48 |
| Route | `/screens/home-hub-modal` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Modal` | 중앙 | `type="Danger"`, title "Delete Home?", description 'Are you sure you want to delete "Bedroom Hub"?' |

---

## 레이아웃

1. 어두운 dim 오버레이 (`rgba(23,23,23,0.6)`)
2. 중앙 `<Modal type="Danger" />`
3. Modal 아래 `Cancel` 텍스트 버튼 (14px, secondary, marginTop 8px)

390×600px, position relative, overflow hidden.

---

## 자동화 정책

```yaml
homeHubModal:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보

| 항목 | 위치 |
|---|---|
| Modal title `"Delete Home?"` | `HomeHubModalScreen.tsx:32` |
| Modal description `'Are you sure you want to delete "Bedroom Hub"?'` | `HomeHubModalScreen.tsx:33` |
| `'Cancel'` (text button) | `HomeHubModalScreen.tsx:43` |

→ 모달 타이틀/설명은 prop으로 호출처에 명시. Modal default를 override함.
