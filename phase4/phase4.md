# Phase 4 — 화면 조립 8개 (개요)

## 상태

✅ **완료**

## 목표

Phase 2 atomic + Phase 3 composition을 조합해 실제 앱 화면 8개를 구성. Phase 5 자동화 파이프라인의 검증 대상이 됨.

## 담당 에이전트

`executor` (Sonnet) + Playwright MCP

**예상 시간**: 약 50분

---

## 서브 단계

| 순서 | 화면 | 파일 | 라인 수 | Figma 노드 ID | 레퍼런스 이미지 | 상세 |
|---|---|---|---|---|---|---|
| 4-1 | 스플래시 / 로그인 | `SplashScreen.tsx` | 42 | `0:3823` "mo" | `mo.png` | [phase4-1.md](./phase4-1.md) |
| 4-2 | 홈 (대시보드) | `HomeScreen.tsx` | 134 | `0:2652` "mo - Home Hub" | `mo - Home.png` | [phase4-2.md](./phase4-2.md) |
| 4-3 | 패밀리 매니지먼트 | `FamilyScreen.tsx` | 63 | `0:3857` "mo - Family Management" | `mo - Family.png` | [phase4-3.md](./phase4-3.md) |
| 4-4 | 그룹 생성 | `CreateGroupScreen.tsx` | 52 | `0:3966` "mo - Create Group" | `mo - Family Management.png` | [phase4-4.md](./phase4-4.md) |
| 4-5 | 멤버 관리 (스와이프 삭제) | `ManageMembersScreen.tsx` | 43 | `0:3904` "mo - Manage Members" | `mo - Family Management-delete.png` | [phase4-5.md](./phase4-5.md) |
| 4-6 | 홈 허브 삭제 모달 | `HomeHubModalScreen.tsx` | 48 | `0:3040` "mo - Home Hub" | `mo - Home Hub.png` | [phase4-6.md](./phase4-6.md) |
| 4-7 | 성공 모달 | `SuccessModalScreen.tsx` | 38 | `0:2879` "mo - Home Hub >success" | `mo - Home Hub _success.png` | [phase4-7.md](./phase4-7.md) |
| 4-8 | 알림 화면 | `NotificationsScreen.tsx` | 101 | `0:7687` "Settings > Notifications" | `Settings _ Notifications.png` | [phase4-8.md](./phase4-8.md) |

**합계**: 521 줄, 파일 위치 `uno-home/src/screens/`

---

## 자동화 정책 (figma-mapping.yaml)

8개 화면 모두 통일:

```yaml
apply: report-only
allowedClasses: [token, text, layout, structure]
```

**`report-only` 통일 이유**: 화면은 atomic/composition보다 변경 위험 높음 (레이아웃·구조 변경 잦음). M2/M3 마커 주입 시에도 화면은 우선순위 제외.

---

## 라우팅 / 갤러리

라우터 없이 `App.tsx` 갤러리 뷰로 8개 화면 모두 한 화면에 나란히 렌더링하여 Playwright 캡처 대상.

---

## 검증 결과 (전체)

| 검증 | 결과 |
|---|---|
| 레퍼런스 이미지 ↔ 레이아웃·색상·간격 일치 | 통과 |
| 모든 컴포넌트 인스턴스 정상 렌더 | 통과 |
| Playwright 스크린샷 | `phase4-screens.png`, `phase4-screens-1~4.png`, `phase4-bottom.png`, `phase4-home-family.png`, `phase4-manage-modal.png`, `phase4-modals.png`, `phase4-splash-home.png`, `phase4-all-components.png` |
| `npm run build` / `npm run lint` | 통과 |

---

## 5-1.5 매핑 보정 내역

화면 노드 매핑은 5-1.5 bind 단계에서 false positive 발견 후 수동 보정됨:

| 화면 | bind 자동 결과 | 수동 보정 후 |
|---|---|---|
| home | `18:11387` (BottomNav 'Home' 탭, FP) | `0:2652` |
| manageMembers | `20:11398` (ContextMenu 항목, FP) | `0:3904` |
| splash | null | `0:3823` |
| family | null | `0:3857` |
| createGroup | null | `0:3966` |
| homeHubModal | null | `0:3040` |
| successModal | null | `0:2879` |
| notifications | `0:3759` (alert 모달 dim 레이어, FP) | `0:7687` |

→ 자세한 보정 근거는 [../phase5/phase5-1-5.md](../phase5/phase5-1-5.md).

---

## 의존성

- ✅ Phase 2 atomic 6종 완료
- ✅ Phase 3 composition 7종 완료
- ✅ Figma 화면 노드 접근 가능 (Page1 = `0:1`, 178 frames)
- ✅ 레퍼런스 이미지 (`design-test/refernce/` 폴더)

---

## 다음 단계로의 영향

| 다음 단계 | 영향 |
|---|---|
| Phase 5-1.5 bind | 8개 화면 모두 `figma-mapping.yaml`에 등록 (총 21 매핑 항목 중 8개) |
| Phase 5-4 apply | 화면은 `apply: report-only` (composition·atomic보다 위험 높음) |
| Phase 5-4 M2/M3 마커 주입 | `screens`는 우선순위 제외 — atomic/composition부터 |
| Phase 5-5 verify | Playwright 시각 검증 대상은 8개 화면 + atomic/composition 갤러리 |
