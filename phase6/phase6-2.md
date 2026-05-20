# Phase 6-2 — UNO Design System 토큰 동기화

## 상태

🔄 **진행 중** (2026-05-07)

## 작업 내용

UNO Design System Figma(`qDCHLZbwY41wKVYIVXiZst`)의 Variables / Text Styles / Effect Styles를 추출하여 `src/index.css`에 통합한다.

- **모드**: `UnoHome` 컬렉션의 **Mobile 모드만** 적용 (Display 모드 무시)
- **네이밍 정책**: UNO DS Figma 변수명을 그대로 (`/` → `-`로 치환)
- **Tailwind v4**: primitives는 `@theme`에 두어 utility 생성 가능 (`bg-neutral-50` 등)
- **시맨틱 토큰**: `:root`에 두어 `var()` 직접 사용

---

## 추출 요약

| 영역 | 출처 | 개수 |
|---|---|---|
| Color primitives | `TailwindCSS` collection | 59 |
| Color semantic (Mobile) | `UnoHome` collection (Mobile mode) | 67 |
| Spacing | `Num` collection (Mode 1) | 19 |
| Radius | `Radius` collection | 6 |
| Font family / weight / size | `Font` collection | 14 |
| Mobile text styles | Local text styles (Mobile/* 만) | 10 |
| Effect styles | Local effect styles | 7 |

---

## 1. Color Primitives (`@theme`)

| Figma 변수 | CSS 변수 | 값 |
|---|---|---|
| `base/white` | `--color-base-white` | `#FFFFFF` |
| `base/black` | `--color-base-black` | `#000000` |
| `neutral/50..950` | `--color-neutral-50..950` | 11개 |
| `red/50..950` | `--color-red-50..950` | 11개 |
| `yellow/50..950` | `--color-yellow-50..950` | 11개 |
| `green/50..950` | `--color-green-50..950` | 11개 |
| `blue/50..950` | `--color-blue-50..950` | 11개 |
| `purple/400` `purple/600` | `--color-purple-400/600` | UNO DS 한정 |

---

## 2. Semantic Tokens (`:root`, Mobile 모드)

### Base / Primary

| Figma | CSS | Mobile 값 |
|---|---|---|
| `Base/Black` | `--base-black` | → `base-black` |
| `Base/White` | `--base-white` | → `base-white` |
| `Base/Gray` | `--base-gray` | → `neutral-600` |
| `Primary/Accent` | `--primary-accent` | → `neutral-950` |

### Background / Text / Border

| Figma | CSS | Mobile alias |
|---|---|---|
| `Background/Primary` | `--background-primary` | `neutral-100` |
| `Background/Secondary` | `--background-secondary` | `neutral-50` |
| `Background/Modal` | `--background-modal` | `base-white` |
| `Background/Card` | `--background-card` | `neutral-100` |
| `Background/Accent` | `--background-accent` | `neutral-900` |
| `Text/Primary` | `--text-primary` | `neutral-800` |
| `Text/Secondary` | `--text-secondary` | `neutral-500` |
| `Text/Disabled` | `--text-disabled` | `neutral-300` |
| `Text/Accent` | `--text-accent` | `base-black` |
| `Text/Pressed` | `--text-pressed` | `neutral-400` |
| `Border/Default` | `--border-default` | `neutral-200` |
| `Border/Accent` | `--border-accent` | `neutral-900` |
| `Border/Divider` | `--border-divider` | `neutral-50` |
| `Border/Card` | `--border-card` | `neutral-300` |

### Button

| Figma | CSS | Mobile alias |
|---|---|---|
| `Button/primary/Default` | `--button-primary-default` | `neutral-950` |
| `Button/primary/Hover` | `--button-primary-hover` | `neutral-900` |
| `Button/primary/Pressed` | `--button-primary-pressed` | `neutral-700` |
| `Button/primary/Disabled` | `--button-primary-disabled` | `neutral-300` |
| `Button/Secondary/Default` | `--button-secondary-default` | `base-white` |
| `Button/Secondary/Hover` | `--button-secondary-hover` | `neutral-50` |
| `Button/Secondary/Pressed` | `--button-secondary-pressed` | `neutral-200` |
| `Button/Secondary/Disabled` | `--button-secondary-disabled` | `neutral-100` |
| `Button/Secondary/text` | `--button-secondary-text` | `neutral-950` |
| `Button/Secondary/Pressed/text` | `--button-secondary-pressed-text` | `neutral-900` |
| `Button/Secondary/Disabled/text` | `--button-secondary-disabled-text` | `neutral-300` |

### Status / System

| Figma | CSS | 값 |
|---|---|---|
| `Status/Average/{Text,Bg}` | `--status-average-{text,bg}` | `green-600 / green-200` |
| `Status/Good/{Text,Bg}` | `--status-good-{text,bg}` | `green-700 / green-100` |
| `Status/Healthy/{Text,Bg}` | `--status-healthy-{text,bg}` | `blue-600 / blue-200` |
| `Status/Very Healthy/{Text,Bg}` | `--status-very-healthy-{text,bg}` | `blue-700 / blue-100` |
| `Status/Danger/{Text,Color,Bg}` | `--status-danger-{text,color,bg}` | `red-700 / #FFFFFF / red-200` |
| `Status/Caution/{Text,Bg}` | `--status-caution-{text,bg}` | `red-600 / red-100` |
| `Status/Warning/{Text,Bg}` | `--status-warning-{text,bg}` | `yellow-800 / yellow-200` |
| `Status/Attention/{Text,Bg}` | `--status-attention-{text,bg}` | `yellow-700 / yellow-100` |
| `System/Error/{primary,subtle}` | `--system-error-{primary,subtle}` | `red-700 / rgba(185,28,28,0.3)` |
| `System/Success/{primary,subtle}` | `--system-success-{primary,subtle}` | `green-700 / rgba(21,128,61,0.3)` |
| `System/Caution/{primary,subtle}` | `--system-caution-{primary,subtle}` | `yellow-700 / rgba(161,98,7,0.3)` |
| `System/Info/{primary,subtle}` | `--system-info-{primary,subtle}` | `blue-700 / rgba(29,78,216,0.3)` |

### Chart / Placeholder / Doc

`--chart-{background,surface,text,accent,teal}`, `--placeholder-{background,dark}`, `--doc-{surface,surface-subtle,border,border-light,border-medium,text-secondary}` — 모두 Display/Mobile 동일 리터럴 값.

---

## 3. Spacing / Radius / Font

| 카테고리 | 토큰 |
|---|---|
| Spacing | `--spacing-{2,4,6,8,10,12,14,16,18,20,24,28,32,36,40,48,64,72,80}` |
| Radius | `--radius-{xs:6, sm:8, md:12, lg:16, xl:20, full:99999}` |
| Font family | `--font-pretendard: "Pretendard"` |
| Font weight | `--font-weight-{regular:400, medium:500, semibold:600, bold:700}` |
| Font size | `--font-size-{16,18,20,24,28,32,36,48}` (8 = 64는 네이밍 오류로 보여 제외) |

---

## 4. Mobile Text Styles (10개)

모두 Pretendard, letterSpacing 0%.

| 클래스 | 크기 | weight | line-height |
|---|---|---|---|
| `.text-mobile-h1` | 32 | SemiBold | 125% |
| `.text-mobile-h2` | 28 | SemiBold | 130% |
| `.text-mobile-h3` | 24 | SemiBold | 135% |
| `.text-mobile-title` | 20 | SemiBold | 140% |
| `.text-mobile-body-large-strong` | 16 | SemiBold | 130% |
| `.text-mobile-body-large` | 16 | Regular | 140% |
| `.text-mobile-body-small-strong` | 14 | SemiBold | 130% |
| `.text-mobile-body-small` | 14 | Regular | 140% |
| `.text-mobile-caption` | 12 | Medium | 140% |
| `.text-mobile-chip-caption` | 10 | Regular | 140% |

---

## 5. Effect Styles (7개)

| 이름 | CSS 변수 | 값 |
|---|---|---|
| `shadow/type/xs` | `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow/type/sm` | `--shadow-sm` | `0 0 4px rgba(0,0,0,0.10)` |
| `shadow/type/md` | `--shadow-md` | `0 4px 16px rgba(0,0,0,0.12)` |
| `shadow/type/lg` | `--shadow-lg` | `0 20px 50px rgba(0,0,0,0.20)` |
| `shadow/state/focus` | `--shadow-focus` | `0 0 0 3px rgba(163,163,163,0.50)` |
| `shadow/state/error` | `--shadow-error` | `0 0 4px 3px rgba(220,38,38,0.20)` |
| `glass` | `--glass-blur` | `blur(15px)` (백드롭 필터로 적용) |

---

## 6. 기존 → 신규 변수 마이그레이션 매핑

기존 `index.css`의 시맨틱 변수 → UNO DS 변수 (Phase 6-3 사용)

| 기존 | UNO DS 신규 | 비고 |
|---|---|---|
| `--bg-primary` | `--background-modal` | 흰색 배경 (UNO DS는 modal로 명명) |
| `--bg-secondary` | `--background-secondary` | |
| `--bg-card` | `--background-card` | |
| `--bg-avatar` | `--border-card` (`#D4D4D4`) | UNO DS 직접 매핑 없음 → 가까운 값 |
| `--bg-disabled` | `--button-secondary-pressed` (`#E5E5E5`) | |
| `--bg-overlay` | `--system-error-subtle` 비슷한 톤 또는 인라인 유지 | 직접 대응 없음 |
| `--bg-invert` | `--background-accent` | `neutral-900` |
| `--text-primary` | `--text-primary` | ✅ 동일 |
| `--text-secondary` | `--text-secondary` | ✅ 동일 |
| `--text-tertiary` | `--text-disabled` | UNO DS는 tertiary 없음 |
| `--text-inverse` | `--button-secondary-default` (`#FFFFFF`) | |
| `--text-danger` | `--system-error-primary` | |
| `--text-disabled` | `--text-disabled` | ✅ 동일 |
| `--border-default` | `--border-default` | ✅ 동일 |
| `--border-strong` | `--border-card` | |
| `--border-focus` | `--border-accent` | |
| `--icon-primary` | `--text-primary` | UNO DS는 icon 별도 토큰 없음 |
| `--icon-secondary` | `--text-disabled` | |
| `--icon-inverse` | `--button-secondary-default` | |
| `--icon-disabled` | `--border-card` | |
| `--brand-primary` | `--primary-accent` | |
| `--brand-inverse` | `--button-secondary-default` | |
| `--brand-accent` | (인라인 `#DC2626` 또는 `--color-red-600`) | UNO DS 시맨틱 없음 |
| `--interactive-primary` | `--button-primary-default` | |
| `--interactive-hover` | `--button-primary-hover` | |
| `--interactive-pressed` | `--button-primary-pressed` | |
| `--interactive-disabled` | `--button-primary-disabled` | |
| `--status-success-*` | `--status-good-*` 또는 `--system-success-*` | 카테고리 분리됨 |
| `--status-warning-*` | `--status-warning-*` | ✅ 동일 |
| `--status-info-*` | `--status-very-healthy-*` 또는 `--system-info-*` | |
| `--status-error-*` | `--status-caution-*` 또는 `--system-error-*` | |
| `--status-danger-*` | `--status-danger-*` | ✅ 동일 |
| `--shadow-card` | `--shadow-sm` | |
| `--shadow-modal` | `--shadow-md` | |
| `--shadow-dropdown` | `--shadow-md` | |
| `--shadow-focused` | `--shadow-focus` | |
| `--shadow-error-focused` | `--shadow-error` | |

---

## 7. 결정사항 / 알아둘 점

- **다크 모드 제거**: UNO DS Mobile 모드는 light 전용. 기존 `@media (prefers-color-scheme: dark)` 블록은 제거.
- **Display 모드 데이터**: 추출되었으나 Mobile만 적용 — 향후 `data-platform="display"` 분기로 확장 가능.
- **`fontSize/8 = 64`**: Figma 네이밍 오류로 보임 (실제 값 64). Mobile text style에서 사용 안 됨, 무시.
- **`Status/Danger/Color`**: 유일한 비-alias 시맨틱 토큰 (`#FFFFFF`). danger 배경 위 텍스트 색상.
- **`glass` effect**: Tailwind/CSS에 직접 대응 없음. `backdrop-filter: blur(15px)`로 변환.
- **빌드 영향**: 변수명이 일괄 변경되므로 Phase 6-3에서 모든 `var(--xxx)` 참조 업데이트 필요.

---

## 8. 다음 단계 (Phase 6-3)

1. `src/index.css` 적용 후 `npm run build` 실행 — TS는 영향 없음, 런타임 시각 검증 필요
2. 6-1 감사 결과 6개 파일 + 그 외 변수 사용 파일 일괄 grep & 교체
3. Playwright 시각 회귀 테스트로 결과 확인
