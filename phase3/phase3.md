# Phase 3 — 복합 컴포넌트 7종 (개요)

## 상태

✅ 초기 7종 완료 / ✅ **NotificationCard → NotificationListItem 마이그레이션 완료 (2026-05-06)** — 추적: [phase3-8.md](./phase3-8.md)

## 목표

Phase 2 atomic 6종을 조합한 중간 단위 컴포넌트 7종을 완성. Phase 4 화면 조립의 직전 단계.

## 담당 에이전트

`executor` (Sonnet) + Figma MCP + Playwright MCP

**예상 시간**: 약 30분

---

## 서브 단계

| 순서 | 컴포넌트 | 파일 | 라인 수 | Figma 노드 ID | 사용 atomic | 상세 |
|---|---|---|---|---|---|---|
| 3-1 | `ListItem` | `ListItem.tsx` | 95 | `16:11415` | Avatar, Badge, Icon | [phase3-1.md](./phase3-1.md) |
| 3-2 | `Header` | `Header.tsx` | 74 | `18:11416` | Icon | [phase3-2.md](./phase3-2.md) |
| 3-3 | `TabNavigation` | `TabNavigation.tsx` | 49 | `20:11386` | — | [phase3-3.md](./phase3-3.md) |
| 3-4 | `BottomNavBar` | `BottomNavBar.tsx` | 70 | `18:11386` | Icon | [phase3-4.md](./phase3-4.md) |
| 3-5 | `ContextMenu` | `ContextMenu.tsx` | 68 | `20:11394` | Icon | [phase3-5.md](./phase3-5.md) |
| ~~3-6~~ | ~~`NotificationCard`~~ 🗄️ Deprecated | ~~`NotificationCard.tsx`~~ | ~~71~~ | ~~`20:11424`~~ | — | [phase3-6.md](./phase3-6.md) → [phase3-8.md](./phase3-8.md) |
| 3-7 | `Modal` | `Modal.tsx` | 106 | `19:11406` | Icon, Button | [phase3-7.md](./phase3-7.md) |
| 3-8 ✅ | `NotificationListItem` (NotificationCard 대체) | `NotificationListItem.tsx` | 163 | `179:11404` (reference) | Button | [phase3-8.md](./phase3-8.md) |

**합계 (3-6 폐기 후)**: NotificationCard 71줄 제거 + NotificationListItem 163줄 추가. 파일 위치 `uno-home/src/compositions/`

---

## 자동화 정책 요약 (figma-mapping.yaml)

모든 composition 7종이 `apply: partial`, `allowedClasses: [token, text, component-props, layout]` (단 `bottomNavBar`는 `text` 미포함).

| 컴포넌트 | apply | text 허용 |
|---|---|:-:|
| listItemMember | partial | ✅ |
| header | partial | ✅ |
| tabNavigation | partial | ✅ |
| bottomNavBar | partial | (✗) |
| contextMenu | partial | ✅ |
| ~~notificationCard~~ 🗄️ | ~~partial~~ | — |
| modalDialog | partial | ✅ |
| notificationListItem ✅ | report-only (잠정) | ✅ |

**`partial` 통일 이유**: composition은 atomic 조합 + 레이아웃이 섞여 있어 자동 반영 위험이 atomic보다 높음. 5-3 classify에서 분류별 결정.

---

## 검증 결과 (전체)

| 검증 | 결과 |
|---|---|
| Figma 스크린샷 ↔ 모든 상태 시각 일치 | 통과 |
| 다크 모드 토큰 자동 반영 | 통과 |
| Playwright 스크린샷 | `design-test/phase3-all-components.png` |
| Phase 2 atomic만 build block 사용 | 통과 |
| `npm run build` / `npm run lint` | 통과 |

---

## Phase 4 화면별 사용 매트릭스

| 화면 | ListItem | Header | TabNav | BottomNav | ContextMenu | NotifCard | Modal |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Splash | | | | | | | |
| Home | | (custom) | ✅ | ✅ | | | |
| Family | | ✅ | | | ✅ | | |
| CreateGroup | ✅ | ✅ | | | | | |
| ManageMembers | ✅ | ✅ | | | | | |
| HomeHubModal | | | | | | | ✅ |
| SuccessModal | | | | | | | ✅ |
| Notifications | | ✅ | | | | ✅ `NotificationListItem` | |

→ HomeScreen은 custom header. NotificationsScreen은 `NotificationListItem`으로 교체 완료.

---

## 의존성

- ✅ Phase 2 atomic 6종 완료
- ✅ Figma "Design System" 페이지 composition 노드 접근 가능

---

## 다음 단계로의 영향

| 다음 단계 | 영향 |
|---|---|
| Phase 4 화면 조립 | 7개 composition이 화면 build block |
| Phase 5-1.5 bind | 7개 composition 모두 `figma-mapping.yaml`에 등록 |
| Phase 5-4 M2/M3 | atomic과 동일 우선순위 1순위 (`marker-candidates.compositions.*`) |
