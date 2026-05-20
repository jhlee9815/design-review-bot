# Phase 4-1 — Splash / Login Screen

## 상태

✅ **완료**

## Figma 노드

| 항목 | 값 |
|---|---|
| ID | `0:3823` |
| Name | `mo` |
| Path | `["Page1"]` |
| 비고 | 4개 "mo" 후보 중 Login 버튼 변형 (5-1.5 수동 보정). Sign in 변형은 `0:3832` |

## 레퍼런스 이미지

`design-test/refernce/mo.png`

## 코드

| 항목 | 값 |
|---|---|
| 파일 | `uno-home/src/screens/SplashScreen.tsx` |
| 라인 수 | 42 |
| Route | `/screens/splash` |

---

## 사용 컴포넌트

| 컴포넌트 | 위치 | 비고 |
|---|---|---|
| `Button` | 하단 CTA | `variant="primary"`, `size="lg"`, `label="Login"`, width 100% |

---

## 레이아웃

```
┌────────────────────────────┐
│                            │
│                            │ ← top spacer (flex:1)
│                            │
│ UNO HOME (32px bold)       │
│ Connect with your space    │ ← center content (padding 0 32px)
│ Experience the seamless    │
│   integration              │
│                            │
│                            │ ← bottom spacer (flex:1)
│                            │
│      [ Login button ]      │ ← padding 24px
└────────────────────────────┘
```

390×600px, `var(--bg-primary)` 배경.

---

## 자동화 정책

```yaml
splash:
  apply: report-only
  allowedClasses: [token, text, layout, structure]
```

---

## Phase 5-4 마커 후보

| 항목 | 위치 | 마커 |
|---|---|---|
| `'UNO HOME'` | `SplashScreen.tsx:19` | `figma:text id="splash.title"` |
| `'Connect with your space'` | `SplashScreen.tsx:22` | `figma:text id="splash.tagline1"` |
| `'Experience the seamless integration'` | `SplashScreen.tsx:25` | `figma:text id="splash.tagline2"` |
| `'Login'` (Button label) | `SplashScreen.tsx:38` | `figma:text id="splash.cta"` |

→ 화면은 `apply: report-only`이므로 마커 주입 우선순위 제외 (5-4 ⚠️ 결정사항 옵션 A 채택 시에도 atomic/composition 이후).
