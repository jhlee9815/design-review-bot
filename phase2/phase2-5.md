# Phase 2-5 — Input

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `127:11410` |
| Name | `Input` |
| Path | `["Design System"]` |

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/components/Input.tsx` |
| 라인 수 | 66 |

---

## Props

```ts
type InputState = 'default' | 'filled' | 'focused' | 'error' | 'error+focused'

interface InputProps {
  state?: InputState         // default 'default'
  value?: string
  placeholder?: string       // default 'Group name'
  subText?: string
  showSubText?: boolean      // default false
}
```

## State ↔ Figma 매핑

| State | Border | BoxShadow |
|---|---|---|
| `default` | `1px solid var(--border-default)` | none |
| `filled` | `1px solid var(--border-default)` | none |
| `focused` | `2px solid var(--border-focus)` | `var(--shadow-focused)` |
| `error` | `1px solid var(--status-error-border)` | none |
| `error+focused` | `2px solid var(--status-error-default)` | `var(--shadow-error-focused)` |

---

## 자동화 정책 (figma-mapping.yaml)

```yaml
input:
  apply: partial
  allowedClasses: [token, text, component-props, layout]
```

**`partial` 이유**: state별 시각 변화는 토큰 + 시각 스타일 조합. Figma에서 변경 시 코드 자동 반영하면 회귀 위험. 5-3 classify에서 변경 분류 후 케이스별 결정.

---

## 사용처

| 위치 | 컴포넌트 | State |
|---|---|---|
| `screens/CreateGroupScreen.tsx` | CreateGroupScreen | `filled` ("Group Name") |

---

## Phase 5-4 마커 후보

| 항목 | 위치 | 마커 |
|---|---|---|
| placeholder `'Group name'` | `Input.tsx:24` | `figma:text id="input.placeholder.default"` |
| subText (외부 주입) | `Input.tsx:26~30` | 데이터 바인딩이라 마커 외부 |
| `'Send'` 텍스트 (line 56) | `Input.tsx:56` | `figma:text id="input.send"` |

→ 5-4 M2 마커 주입 시 `Send`/`placeholder` 단순 텍스트 우선.
