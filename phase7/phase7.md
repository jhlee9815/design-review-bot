# Phase 7 — 컴포넌트 시스템 강화

## 상태

✅ **완료** (2026-05-07)

## 목표

디자인 토큰 기반으로 기존 컴포넌트를 업데이트하고,
Mobile UI Kit에 정의된 신규 컴포넌트를 추가한다.

---

## 하위 작업

| 서브 태스크 | 내용 | 상태 |
|---|---|:-:|
| 7-1 | Mobile UI Kit 분석 (`ui_kits/mobile/index.html`) | ✅ |
| 7-2 | 신규 컴포넌트 구현 (Switch, Chip, Card, Toast, Text) | ✅ |
| 7-3 | 기존 컴포넌트 업데이트 (Button, Badge, Input) | ✅ |

---

## 산출물

| 산출물 | 위치 |
|---|---|
| Mobile UI Kit 분석 리포트 | `phase7/phase7-1.md` |
| Switch.tsx | `src/components/Switch.tsx` |
| Chip.tsx | `src/components/Chip.tsx` |
| Card.tsx | `src/components/Card.tsx` |
| Toast.tsx | `src/components/Toast.tsx` |
| Text.tsx | `src/components/Text.tsx` |
| Button.tsx (업데이트) | `src/components/Button.tsx` |
| Badge.tsx (업데이트) | `src/components/Badge.tsx` |
| Input.tsx (업데이트) | `src/components/Input.tsx` |

---

## 디자인 기준

- 소스: `ui_kits/mobile/index.html` (UNO Design System handoff bundle)
- 베이스: 375 × 812px, light theme, Pretendard 14–16px
- 모노크롬 accent: `#0A0A0A`
