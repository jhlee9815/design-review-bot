# Phase 1 — 프로젝트 초기화 + 토큰 → CSS 변수 연결

## 상태

✅ **완료**

## 목표

React + Tailwind v4 프로젝트를 scaffold하고, Figma에서 추출한 디자인 토큰(`tokens.json`)을 Tailwind v4 `@theme` 블록으로 연결하여 컴포넌트 작업의 시작 토대를 만든다.

## 담당 에이전트

`executor` (Sonnet)

---

## 작업 정의 / 산출물

| 산출물 | 위치 | 역할 |
|---|---|---|
| 디자인 토큰 원본 | `design-test/tokens.json` | Figma에서 추출. 색상·spacing·radius·shadow·typography 모든 token의 source of truth |
| 디자인 스펙 문서 | `design-test/handoff.md` | 토큰 외 추가 디자인 결정사항 (text style, component spec) |
| React + Vite + Tailwind v4 scaffold | `uno-home/` | TypeScript 기반, `@vitejs/plugin-react`, `@tailwindcss/vite` |
| Tailwind v4 테마 정의 | `uno-home/src/index.css` | `@import "tailwindcss"` + `@theme { ... }` 블록 |
| `package.json` scripts | `uno-home/package.json` | `dev`, `build`, `lint`, `preview` |

---

## 구현 결과 (cross-check)

### tokens.json (396 줄)

Figma에서 추출한 모든 디자인 토큰의 source of truth. 5-2 snapshot 단계에서 SHA256으로 해시되어 변경 감지의 기준이 됨 (`tokensHash`).

### src/index.css (220 줄)

Tailwind v4 표준 `@theme` 블록 사용:

```css
@import "tailwindcss";

@theme {
  /* Primitives — Neutral */
  --color-neutral-50:  #FAFAFA;
  --color-neutral-100: #F5F5F5;
  ...
  /* Primitives — Red, Yellow, Green, Blue, ... */
  /* Semantic — surface, content, border, accent, ... */
  /* Spacing, Radius, Shadow, Typography */
}
```

### 의존성 (package.json)

| 패키지 | 버전 | 역할 |
|---|---|---|
| react | ^19.2.5 | UI |
| react-dom | ^19.2.5 | UI |
| lucide-react | ^1.11.0 | 아이콘 라이브러리 |
| tailwindcss | ^4.2.4 | 스타일 |
| @tailwindcss/vite | ^4.2.4 | Tailwind v4 Vite 플러그인 |
| vite | ^8.0.10 | 번들러 |
| typescript | ~6.0.2 | 타입 |

### scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## 검증 결과

| 검증 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 |
| Playwright 검증 스크린샷 | `design-test/phase1-verify.png` |
| 토큰 → CSS 변수 적용 확인 | `bg-neutral-100`, `text-content-primary` 등 의미적 클래스 동작 |
| 다크 모드 토큰 자동 반영 | `@media (prefers-color-scheme: dark)` 또는 `.dark` 클래스 기반 |

---

## 검증 기준 (계약)

- ✅ Tailwind v4 `@theme` 블록만 사용 (CSS 변수 직접 선언 없음)
- ✅ tokens.json의 모든 의미적 token이 `@theme`에 매핑됨
- ✅ `npm run build` / `npm run lint` 통과

---

## 다음 단계로의 영향

| 다음 단계 | Phase 1이 미친 영향 |
|---|---|
| Phase 2 atomic 컴포넌트 | `bg-surface-primary`, `text-content-primary` 등 토큰 기반 클래스만 사용 (raw hex 금지) |
| Phase 5-2 snapshot | `tokens.json`의 SHA256(`tokensHash`)이 변경 감지 트리거 |
| Phase 5-4 M1 (style-dictionary) | `tokens.json` → `src/index.css` 자동 생성 시, **현재 수동 작성된 index.css가 baseline**이 되어 회귀 비교 기준이 됨 |

---

## 의존성

- ✅ Figma 파일에서 토큰 사전 추출 완료
- ✅ handoff.md에 추가 스펙 정리 완료
