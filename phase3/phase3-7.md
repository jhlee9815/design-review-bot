# Phase 3-7 — Modal / Dialog

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `19:11406` |
| Name | `Modal / Dialog` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/compositions/Modal.tsx` |
| 라인 수 | 106 |
| 사용 atomic | Icon, Button |

---

## Props

```ts
type ModalType = 'Success' | 'Danger'

interface ModalProps {
  type?: ModalType            // default 'Success'
  title?: string              // default = type별 default
  description?: string        // default = type별 default
  onClose?: () => void
  onAction?: () => void
}
```

## Type ↔ 렌더링 매핑

| Type | 기본 Title | 기본 Description | Icon | Icon BG | Action Button |
|---|---|---|---|---|---|
| `Success` | "Success!" | "Your action was completed successfully." | `CircleCheck` (green) | `var(--status-success-bg)` | `<Button variant="secondary" label="Done">` |
| `Danger` | "Delete?" | "This action cannot be undone. Are you sure?" | `Trash2` (red) | `var(--status-danger-bg)` | `<Button variant="danger" label="Delete">` |

335px width, radius 20px, padding 24px, 1px border. Top-right `X` close button. 64×64 원형 아이콘 영역.

---

## 자동화 정책

```yaml
modalDialog:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

| 화면 | type | title | description |
|---|---|---|---|
| HomeHubModalScreen | `Danger` | "Delete Home?" | 'Are you sure you want to delete "Bedroom Hub"?' |
| SuccessModalScreen | `Success` | "Name Updated!" | "Your home name has been successfully updated." |

→ 화면별 title/description은 호출처 prop으로 override.

---

## Phase 5-4 마커 후보

| 항목 | 위치 | 마커 |
|---|---|---|
| `'Success!'` (default) | `Modal.tsx:21` | `figma:text id="modal.success.title"` |
| `'Your action was completed successfully.'` | `Modal.tsx:23` | `figma:text id="modal.success.desc"` |
| `'Delete?'` | `Modal.tsx:21` | `figma:text id="modal.danger.title"` |
| `'This action cannot be undone. Are you sure?'` | `Modal.tsx:25` | `figma:text id="modal.danger.desc"` |
| Button label `'Done'`, `'Delete'` | line 100, 102 | atomic Button에 위임 |

→ Modal default 텍스트는 Figma leaf와 정확히 매칭될 가능성 높음. M2 마커 주입 우선 후보.
