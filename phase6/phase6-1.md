# Phase 6-1 — CSS 변수 교체 대상 감사

## 상태

✅ **완료** (2026-05-07)

## 작업 내용

`src/` 전체 파일에서 하드코딩 색상(`#hex`, `rgba(...)`)을 grep으로 수집하고,
`index.css`의 시맨틱 변수와 매핑하여 교체 대상을 확정했다.

---

## 결론: 교체 필요 파일 6개

### Screens (4개)

| 파일 | 하드코딩 값 | 매핑할 CSS 변수 |
|---|---|---|
| `SplashScreen.tsx` | `#262626`, `#ffffff`, `#737373`, `#0a0a0a` | `--text-primary`, `--bg-primary`, `--text-secondary`, `--interactive-primary` |
| `ChooseHubScreen.tsx` | `#ffffff`, `#262626`, `#f5f5f5`, `#0a0a0a`, `#e5e5e5`, `#a3a3a3`, `rgba(10,10,10,0.9)` | `--bg-primary`, `--text-primary`, `--bg-card`, `--interactive-primary`, `--border-default`, `--text-tertiary`, `--bg-overlay` |
| `EnterPasscodeScreen.tsx` | `#262626`, `#737373`, `#b91c1c`, `rgba(185,28,28,0.3)`, `rgba(220,38,38,0.2)`, `#e5e5e5` | `--text-primary`, `--text-secondary`, `--status-error-text`, `--status-error-bg`, `--shadow-error-focused`, `--border-default` |
| `HomeHubToastScreen.tsx` | `#a3a3a3`, `#171717`, `#e5e5e5`, `#262626`, `#ffffff` | `--text-tertiary`, `--bg-invert`, `--border-default`, `--text-primary`, `--bg-primary` |

### Components / Compositions (2개)

| 파일 | 하드코딩 값 | 매핑 |
|---|---|---|
| `StatusBar.tsx` | `#262626` × 3 | `var(--text-primary)` |
| `NotificationListItem.tsx` | `#D4D4D4`, `#A3A3A3` × 2 | `var(--icon-disabled)`, `var(--text-tertiary)` |

---

## 이미 CSS 변수 사용 중 (교체 불필요)

- `CreateGroupScreen.tsx` ✅
- `ManageMembersScreen.tsx` ✅
- `FamilyScreen.tsx` ✅
- `NotificationsScreen.tsx` ✅

---

## 특이사항

- `rgba(185,28,28,0.3)` — `--status-error-bg` (`#FEF2F2`)와 값이 다름.
  OTP 에러 배경 전용 값이므로 `EnterPasscodeScreen`에서 직접 유지하거나 별도 토큰 추가 필요.
- `rgba(10,10,10,0.9)` — `--bg-overlay`는 `rgba(23,23,23,0.6)`으로 완전 불일치.
  ChooseHub 토스트 오버레이 전용이므로 로컬 값 유지 또는 토큰 추가.
