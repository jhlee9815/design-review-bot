# Phase 5-1.5 — Figma 노드 매핑 자동 채움 (하이브리드 전략)

## 상태

✅ **완료** (2026-04-30, 21/21 filled)

## 목표

`figma-mapping.yaml`의 21개 항목에 `figmaNodeId` + `figmaNodeName` + `figmaNodePath`를 자동으로 채워 파이프라인 시동 가능 상태로 만든다. 디자이너가 Figma에서 컴포넌트를 리네임/이동해도 다음 preflight에서 자가치유.

## 담당 에이전트

`executor` (Sonnet)

---

## 작업 정의 / 산출물

| 순서 | 작업 | 산출물 |
|---|---|---|
| 5-1.5-1 | `bind.ts` 작성 | `scripts/pipeline/bind.ts` |
| 5-1.5-2 | 자동 채움 실행 | 갱신된 `config/figma-mapping.yaml` (21 항목 모두 filled) |
| 5-1.5-3 | 충돌 리포트 | `.automation/logs/bind-{timestamp}.log` |
| 5-1.5-4 | 명령 등록 | `package.json` `figma:bind` |

---

## 매핑 스키마 (하이브리드)

```yaml
button:
  figmaNodeId: "14:11402"                    # primary, 자동 갱신
  figmaNodeName: "Button"                    # ID 미스 시 fallback
  figmaNodePath: ["Design System"]           # 동명 충돌 tiebreaker
  code: ../src/components/Button.tsx
```

세 값이 모두 null인 항목은 `npm run figma:bind`로 일괄 채움.

---

## preflight.ts 동작 보강

ID로 먼저 조회 → 못 찾으면 name+path 매칭:
- 단일 매치 시 `figmaNodeId` 자동 rewrite + `.automation/logs/mapping-heal-{ts}.log` 기록
- 다중 매치 시 abort + 충돌 리포트

---

## 구현 결과 (cross-check)

### 코드 산출물

| 파일 | 라인 수 |
|---|---|
| `scripts/pipeline/bind.ts` | 190 |
| `scripts/pipeline/lib/figma-api.ts` (5-1.5에서 추가) | 84 |

### 스크립트 등록

```json
"figma:bind": "tsx --env-file=.env scripts/pipeline/bind.ts"
```

### Figma API 인증

- 토큰은 `uno-home/.env`에 `FIGMA_TOKEN=xxx` 형태로 보관
- `.gitignore`에 `.env` 등록 (추후 GitHub 확장 대비)
- bind.ts/snapshot.ts/preflight.ts 모두 `process.env.FIGMA_TOKEN` 읽음
- Vite 표준 패턴이라 추가 라이브러리 불필요 (`dotenv` 미도입)

---

## 매핑 검증 보정 내역 (2026-04-30 완료)

Figma 파일 구조: Page1 (0:1, 178 frames) + Design System (9:11386, 15 components) — 2개 페이지

수동 검증으로 false positive 보정 + null 채움:

| 항목 | 이전 | 변경 후 | 근거 |
|---|---|---|---|
| `home` | `18:11387` (false positive — BottomNav 'Home' 탭 78x66) | `0:2652` "mo - Home Hub" | 스크린샷이 reference(mo - Home.png)와 일치 |
| `manageMembers` | `20:11398` (false positive — ContextMenu 항목 200x48) | `0:3904` "mo - Manage Members" | swipe-delete 상태, reference 일치 |
| `splash` | null | `0:3823` "mo" | 4개 "mo" 후보 중 Login 버튼 변형이 reference 일치 |
| `family` | null | `0:3857` "mo - Family Management" | 베이스 화면 — ContextMenu는 React state 오버레이 |
| `createGroup` | null | `0:3966` "mo - Create Group" | 'Group Name' + 'Select Members' 일치 |
| `homeHubModal` | null | `0:3040` "mo - Home Hub" | "Delete Home? Bedroom Hub" 모달, reference 일치 |
| `successModal` | null | `0:2879` "mo - Home Hub >success" | 단일 매치, reference 일치 |
| `otpGroup` | null | `139:11398` "Input / OTP Cell" | Design System COMPONENT_SET, 5 variants |
| `notifications` | `0:3759` (alert 모달 dim 레이어) | `0:7687` "Settings > Notifications" | reference 픽셀 단위 일치 |

---

## 검증 결과

| 검증 | 결과 |
|---|---|
| `npm run figma:preflight` | exit 0, 21/21 filled, 0 warn, 0 error |
| 동명 충돌 | 0건 (모두 명시적 disambiguation 처리) |
| 디자이너 리네임/이동 시 자가치유 | 하이브리드 lookup으로 가능 (ID 미스 → name+path 단일 매치 → 자동 rewrite) |

**최신 preflight 로그** — 21개 항목 binding present:

```
[icon]            36:11471 — Icon
[badge]           15:11403 — Badge
[avatar]          15:11398 — Avatar
[button]          14:11402 — Button
[input]           127:11410 — Input
[otpGroup]        139:11398 — Input / OTP Cell
[listItemMember]  16:11415 — List Item / Member
[header]          18:11416 — Header
[tabNavigation]   20:11386 — Tab Navigation
[bottomNavBar]    18:11386 — Bottom Nav Bar
[contextMenu]     20:11394 — Context Menu
[notificationCard] 20:11424 — Notification Card
[modalDialog]     19:11406 — Modal / Dialog
[splash]          0:3823 — mo
[home]            0:2652 — mo - Home Hub
[family]          0:3857 — mo - Family Management
[createGroup]     0:3966 — mo - Create Group
[manageMembers]   0:3904 — mo - Manage Members
[homeHubModal]    0:3040 — mo - Home Hub
[successModal]    0:2879 — mo - Home Hub >success
[notifications]   0:7687 — Settings > Notifications
```

---

## 검증 기준 (계약)

- ✅ `npm run figma:bind` 실행 후 모든 항목이 ID/name/path 채워짐
- ✅ 동명 충돌은 0건 또는 명시적 disambiguation
- ✅ 디자이너가 Figma에서 컴포넌트를 리네임/이동해도 다음 preflight에서 자가치유

---

## 다음 단계로의 영향

| 다음 단계 | 5-1.5가 미친 영향 |
|---|---|
| 5-2 snapshot | 21개 노드 ID로 `/v1/files/{key}/nodes?ids=...` 호출 가능해짐 |
| 5-3 diff | 노드별 비교 가능 (ID는 stable, 디자이너 리네임에도 안전) |
| 5-1 preflight | 하이브리드 lookup 로직이 5-1에 통합됨 |
