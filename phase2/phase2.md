# Phase 2 — Atomic 컴포넌트 6종 (개요)

## 상태

✅ **완료**

## 목표

Phase 1에서 만든 Tailwind v4 테마를 기반으로, Figma "Design System" 페이지의 atomic 컴포넌트 6종을 React + TypeScript로 구현.

## 담당 에이전트

`executor` (Sonnet) + Figma MCP + Playwright MCP

---

## 서브 단계

| 순서 | 컴포넌트 | 파일 | 라인 수 | Figma 노드 ID | apply 정책 | 상세 |
|---|---|---|---|---|---|---|
| 2-1 | `Icon` | `Icon.tsx` | 35 | `36:11471` | `report-only` | [phase2-1.md](./phase2-1.md) |
| 2-2 | `Badge` | `Badge.tsx` | 36 | `15:11403` | `auto` | [phase2-2.md](./phase2-2.md) |
| 2-3 | `Avatar` | `Avatar.tsx` | 35 | `15:11398` | `auto` | [phase2-3.md](./phase2-3.md) |
| 2-4 | `Button` | `Button.tsx` | 71 | `14:11402` | `auto` | [phase2-4.md](./phase2-4.md) |
| 2-5 | `Input` | `Input.tsx` | 66 | `127:11410` | `partial` | [phase2-5.md](./phase2-5.md) |
| 2-6 | `OTPGroup` | `OTPGroup.tsx` | 82 | `139:11398` | `partial` | [phase2-6.md](./phase2-6.md) |

**합계**: 325 줄, 파일 위치 `uno-home/src/components/`

---

## 자동화 정책 요약 (figma-mapping.yaml)

| 컴포넌트 | apply | token | text | component-props | layout | asset |
|---|---|:-:|:-:|:-:|:-:|:-:|
| icon | report-only | | | ✅ | | ✅ |
| badge | auto | ✅ | ✅ | ✅ | | |
| avatar | auto | ✅ | | ✅ | | |
| button | auto | ✅ | ✅ | ✅ | ✅ | |
| input | partial | ✅ | ✅ | ✅ | ✅ | |
| otpGroup | partial | ✅ | ✅ | ✅ | ✅ | |

→ Phase 5-3 classify 단계가 이 정책에 따라 자동 반영 여부 결정.

---

## 검증 결과 (전체)

| 검증 | 결과 |
|---|---|
| Figma 스크린샷 ↔ 컴포넌트 시각 일치 | 모든 variant 통과 |
| 다크 모드 토큰 자동 반영 | Phase 1 `@theme` 그대로 동작 |
| Playwright 검증 스크린샷 | `design-test/phase2-all-components.png` |
| 추가 미세조정 검증 | `design-test/focused-effect-verify.png`, `subtext-verify.png` |
| Tailwind 토큰 클래스만 사용 (raw hex 금지) | 통과 |
| `npm run build` / `npm run lint` | 통과 |

`uno-home/src/App.tsx`(308 줄)에 6개 컴포넌트의 모든 variant 갤러리 추가 → Playwright 캡처 대상.

---

## 의존성

- ✅ Phase 1 토큰 → CSS 변수 연결 완료
- ✅ Figma "Design System" 페이지 (9:11386) 접근 가능
- ✅ lucide-react 설치

---

## 다음 단계로의 영향

| 다음 단계 | 영향 |
|---|---|
| Phase 3 composition | atomic 6종을 build block으로 사용 |
| Phase 5-1.5 bind | 6개 atomic 모두 `figma-mapping.yaml`에 등록 |
| Phase 5-4 M2/M3 마커 주입 | atomic 컴포넌트는 우선순위 1순위 (5-4 마커 후보 통계의 `components.*`) |
