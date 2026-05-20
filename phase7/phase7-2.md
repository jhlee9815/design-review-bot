# Phase 7-2 — 컴포넌트 구현

## 상태

✅ **완료** (2026-05-07)

## 빌드 결과

```
1751 modules transformed
빌드 시간: 138ms
에러: 0
```

---

## 신규 컴포넌트 (5개)

### Switch.tsx

| 항목 | 값 |
|---|---|
| 경로 | `src/components/Switch.tsx` |
| 크기 | 44×26px 컨테이너, thumb 20×20px |
| OFF | bg `#d4d4d4`, thumb left 3px |
| ON  | bg `#0a0a0a`, thumb left 21px |
| Transition | 120ms cubic-bezier(0.2,0,0,1) |
| Props | `checked`, `onChange`, `disabled` |

### Chip.tsx

| 항목 | 값 |
|---|---|
| 경로 | `src/components/Chip.tsx` |
| 높이 | 32px, padding 0 12px, radius 9999px |
| default | bg `#f5f5f5`, color `#404040` |
| on | bg `#0a0a0a`, color white |
| outline | bg white, border `1px solid #d4d4d4` |
| Props | `label`, `variant`, `onClick` |

### Card.tsx (DeviceCard)

| 항목 | 값 |
|---|---|
| 경로 | `src/components/Card.tsx` |
| OFF | bg white, border `#e5e5e5`, radius 16px, shadow `0 0 4px 0 rgba(0,0,0,0.05)` |
| ON  | bg `#0a0a0a`, 텍스트/아이콘 반전, shadow `0 0 16px 0 rgba(0,0,0,0.10)` |
| 레이아웃 | flex column, gap 14px / head: icon + switch |
| Switch | 내장 (Switch 컴포넌트 사용) |
| Props | `icon`, `name`, `room`, `state`, `isOn`, `onToggle` |

### Toast.tsx

| 항목 | 값 |
|---|---|
| 경로 | `src/components/Toast.tsx` |
| success | bg `#0a0a0a`, text white, icon `#DCFCE7` |
| error   | bg `#FECACA`, text `#B91C1C`, icon `#B91C1C` |
| 공통 | 14px/500, radius 12px, shadow `0 0 16px 0 rgba(0,0,0,0.12)`, max-width 360px |
| Props | `message`, `variant`, `icon` (optional) |

### Text.tsx

| 항목 | 값 |
|---|---|
| 경로 | `src/components/Text.tsx` |
| variants | h1(24px) / h2(20px) / h3(18px) / title(20px) / body(16px) / body-strong(16px) / small(14px) / small-strong(14px) / caption(12px) |
| colors | primary / secondary / tertiary / inverse / danger / disabled |
| Props | `variant`, `color`, `as`, `children`, `style` |

---

## 업데이트 컴포넌트 (3개)

### Button.tsx

| 변경 항목 | 이전 | 이후 |
|---|---|---|
| sizes | md/lg | **sm**(40px) / md(48px) / lg(56px) |
| 높이 | md=44px, lg=52px | md=48px, lg=56px |
| radius | 9999px 고정 | sm/md=12px, lg=16px |
| ghost variant | bg disabled, color disabled | transparent, `--text-primary` |
| danger variant | `--status-danger-default` (dark red) | bg `#fee2e2`, color `#b91c1c` |
| iconOnly prop | 없음 | 44×44px, radius 9999px |

### Badge.tsx

| 변경 항목 | 이전 | 이후 |
|---|---|---|
| variants | admin / member / owner | + success / danger / info / caution / default |
| success | - | bg `#DCFCE7`, color `#15803D` |
| danger  | - | bg `#FECACA`, color `#B91C1C` |
| info    | - | bg `#BFDBFE`, color `#2563EB` |
| caution | - | bg `#FEF08A`, color `#854D0E` |

### Input.tsx

| 변경 항목 | 이전 | 이후 |
|---|---|---|
| label | 없음 | label prop, 500 13px `#404040` |
| helperText | subText (제한적) | helperText prop, error 시 red |
| radius | 8px | **12px** |
| focus shadow | `--shadow-focused` | `0 0 0 3px rgba(163,163,163,0.5)` |
| error shadow | `--shadow-error-focused` | `0 0 4px 3px rgba(220,38,38,0.20)` |
| Send 버튼 | 내장 | **제거** — 단순 텍스트 input |
| 구조 | div 기반 mock | `<input>` controlled component |
