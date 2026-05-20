# Phase 2-6 — OTPGroup

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `139:11398` |
| Name | `Input / OTP Cell` (COMPONENT_SET, 5 variants) |
| Path | `["Design System"]` |
| Variants | Empty / Filled / Error / Focused / Error+Focused |

→ 5-1.5 매핑 검증에서 Design System 페이지 COMPONENT_SET으로 확정 (이전 null이었음).

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/components/OTPGroup.tsx` |
| 라인 수 | 82 |

---

## Props

```ts
type OTPState = 'empty' | 'focused' | 'filled' | 'error' | 'error+focused'

interface OTPGroupProps {
  label?: string             // default 'Verification Code'
  showLabel?: boolean        // default true
  timer?: string             // default '03:00'
  showTimer?: boolean        // default true
  cells?: string[]           // default ['4','8','2','1','9','2']
  cellState?: OTPState       // default 'filled'
  subText?: string
  showSubText?: boolean      // default false
}

// Internal:
function OTPCell({ value, state }: { value?: string; state: OTPState })
```

## Cell State ↔ Figma variant 매핑

| State | Border | BoxShadow |
|---|---|---|
| `empty` | `1px solid var(--border-default)` | none |
| `focused` | `1.4px solid var(--border-focus)` | `var(--shadow-focused)` |
| `filled` | `1.4px solid var(--border-focus)` | none |
| `error` | `1.4px solid var(--status-error-border)` | none |
| `error+focused` | `2px solid var(--status-error-default)` | `var(--shadow-error-focused)` |

각 cell: 50px × 56px, radius 12px, font 20px.

---

## 자동화 정책 (figma-mapping.yaml)

```yaml
otpGroup:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

---

## 사용처

현재 화면(Phase 4)에서 직접 사용처 없음 — Design System 페이지 갤러리 전용.
향후 OTP 검증 화면 추가 시 사용 예정.

---

## Phase 5-4 마커 후보

| 항목 | 위치 | 마커 |
|---|---|---|
| `'Verification Code'` | `OTPGroup.tsx:46` | `figma:text id="otp.label"` |
| `'03:00'` (timer) | `OTPGroup.tsx:48` | placeholder, 데이터 바인딩 |
| 셀 default value `['4','8','2','1','9','2']` | `OTPGroup.tsx:50` | 데이터, 마커 외 |

→ M2 마커 대상은 `label`만.
