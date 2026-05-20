# Phase 7-1 — Mobile UI Kit 분석

## 상태

✅ **완료** (2026-05-07)

## 소스

- URL: `https://api.anthropic.com/v1/design/h/QY26xKwxlFGxoaIo3m_edw`
- 파일: `ui_kits/mobile/index.html`
- 디자인 시스템 CSS: `colors_and_type.css`

---

## 컴포넌트 현황 분석

| 컴포넌트 | 디자인 스펙 | 현재 구현 | 차이 |
|---|---|---|---|
| Button | primary/secondary/ghost/danger, sm(40)/md(48)/lg(56)px, radius 12–16px | `Button.tsx` 있음 | sm 없음, 높이 44/52px, radius 9999px |
| Input | label + control + error msg, 48px, radius 12px | `Input.tsx` 있음 | label 없음, Send버튼 내장 등 다른 구조 |
| Badge | default/success/danger/info/caution | `Badge.tsx` 있음 | admin/member/owner만 존재 |
| Switch | 44×26px, on=#0a0a0a, off=#d4d4d4 | **없음** | 신규 |
| Chip | on/default/outline, h32, full-radius | **없음** | 신규 |
| Card (DeviceCard) | on/off 반전, switch, icon+name+room+state | **없음** | 신규 |
| Toast | dark/error 2종, 14px/500, shadow-md | **없음** | 신규 |
| Text | m-h1~m-caption scale variant | **없음** | 신규 |
| Header | back+title+action | `Header.tsx` 있음 | 일치 |
| Tab Bar | Home/IoT/Health/Alerts/Profile | `BottomNavBar.tsx` 있음 | 일치 |
| List Item | leading+body+trailing | `ListItem.tsx` 있음 | 일치 |
| Bottom Sheet | handle+제목+설명+액션 | `Modal.tsx` 있음 | 일치 |

---

## 핵심 디자인 토큰 (Mobile Kit 기준)

```
Button:
  lg  → height 56px, radius 16px
  md  → height 48px, radius 12px
  sm  → height 40px, radius 12px

Input:
  height 48px, radius 12px
  focus   → box-shadow: 0 0 0 3px rgba(163,163,163,0.5)
  error   → border #DC2626, box-shadow: 0 0 4px 3px rgba(220,38,38,0.20)

Badge:
  success → bg #DCFCE7 / text #15803D
  danger  → bg #FECACA / text #B91C1C
  info    → bg #BFDBFE / text #2563EB
  caution → bg #FEF08A / text #854D0E

Switch:
  size    → 44×26px, thumb 20×20px
  on      → bg #0a0a0a, thumb left 21px
  off     → bg #d4d4d4, thumb left 3px

Toast:
  success → bg #0a0a0a, text white, radius 12px, shadow-md
  error   → bg #FECACA, text #B91C1C

Device Card:
  off → bg white, border #e5e5e5, radius 16px, shadow xs
  on  → bg #0a0a0a, text/icon 반전, border none

Font: Pretendard (--uno-font-ui)
```
