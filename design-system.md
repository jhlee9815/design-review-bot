# UNO HOME Design System

> **출처:** 레퍼런스 이미지 8장 직접 관찰값 + Figma 구현 검증값
> 추측값 없음 — 이미지에서 관찰 불가능한 값은 표기함

---

## 1. 컬러 토큰

> **팔레트 출처:** `Content.png` — Tailwind CSS 스케일 기반 (base / neutral / red / yellow / green / blue, 각 50–950)

---

### Primitives (원시값)

#### Base

| 토큰 | HEX |
|---|---|
| `primitives.base.white` | `#FFFFFF` |
| `primitives.base.black` | `#000000` |

#### Neutral (50–950)

| 토큰 | HEX | 밝기 |
|---|---|---|
| `primitives.neutral.50`  | `#FAFAFA` | 거의 흰색 |
| `primitives.neutral.100` | `#F5F5F5` | |
| `primitives.neutral.200` | `#E5E5E5` | |
| `primitives.neutral.300` | `#D4D4D4` | |
| `primitives.neutral.400` | `#A3A3A3` | 중간 회색 |
| `primitives.neutral.500` | `#737373` | |
| `primitives.neutral.600` | `#525252` | |
| `primitives.neutral.700` | `#404040` | |
| `primitives.neutral.800` | `#262626` | |
| `primitives.neutral.900` | `#171717` | 거의 검정 |
| `primitives.neutral.950` | `#0A0A0A` | |

#### Red (50–950) — 브랜드 강조 / Danger

| 토큰 | HEX |
|---|---|
| `primitives.red.50`  | `#FEF2F2` |
| `primitives.red.100` | `#FEE2E2` |
| `primitives.red.200` | `#FECACA` |
| `primitives.red.300` | `#FCA5A5` |
| `primitives.red.400` | `#F87171` |
| `primitives.red.500` | `#EF4444` |
| `primitives.red.600` | `#DC2626` |
| `primitives.red.700` | `#B91C1C` |
| `primitives.red.800` | `#991B1B` |
| `primitives.red.900` | `#7F1D1D` |
| `primitives.red.950` | `#450A0A` |

#### Yellow (50–950) — Warning

| 토큰 | HEX |
|---|---|
| `primitives.yellow.50`  | `#FEFCE8` |
| `primitives.yellow.100` | `#FEF9C3` |
| `primitives.yellow.200` | `#FEF08A` |
| `primitives.yellow.300` | `#FDE047` |
| `primitives.yellow.400` | `#FACC15` |
| `primitives.yellow.500` | `#EAB308` |
| `primitives.yellow.600` | `#CA8A04` |
| `primitives.yellow.700` | `#A16207` |
| `primitives.yellow.800` | `#854D0E` |
| `primitives.yellow.900` | `#713F12` |
| `primitives.yellow.950` | `#422006` |

#### Green (50–950) — Success

| 토큰 | HEX |
|---|---|
| `primitives.green.50`  | `#F0FDF4` |
| `primitives.green.100` | `#DCFCE7` |
| `primitives.green.200` | `#BBF7D0` |
| `primitives.green.300` | `#86EFAC` |
| `primitives.green.400` | `#4ADE80` |
| `primitives.green.500` | `#22C55E` |
| `primitives.green.600` | `#16A34A` |
| `primitives.green.700` | `#15803D` |
| `primitives.green.800` | `#166534` |
| `primitives.green.900` | `#14532D` |
| `primitives.green.950` | `#052E16` |

#### Blue (50–950) — Info

| 토큰 | HEX |
|---|---|
| `primitives.blue.50`  | `#EFF6FF` |
| `primitives.blue.100` | `#DBEAFE` |
| `primitives.blue.200` | `#BFDBFE` |
| `primitives.blue.300` | `#93C5FD` |
| `primitives.blue.400` | `#60A5FA` |
| `primitives.blue.500` | `#3B82F6` |
| `primitives.blue.600` | `#2563EB` |
| `primitives.blue.700` | `#1D4ED8` |
| `primitives.blue.800` | `#1E40AF` |
| `primitives.blue.900` | `#1E3A8A` |
| `primitives.blue.950` | `#172554` |

---

### Semantic Tokens — Light 모드

#### Background (bg)

| 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|
| `semantic.bg.primary`   | `neutral.50` → white 위 | `#FFFFFF` | 화면 기본 배경 |
| `semantic.bg.secondary` | `neutral.50`  | `#FAFAFA` | 앱 전체 배경 (오프화이트) |
| `semantic.bg.card`      | `neutral.100` | `#F5F5F5` | Sleep, Health 카드 배경 |
| `semantic.bg.avatar`    | `neutral.200` | `#E5E5E5` | 비활성 아바타 배경 |
| `semantic.bg.disabled`  | `neutral.200` | `#E5E5E5` | 비활성 버튼 배경 |
| `semantic.bg.overlay`   | `rgba(23,23,23,0.6)` | — | 모달 딤 |
| `semantic.bg.invert`    | `neutral.900` | `#171717` | 다크 강조 배경 |

#### Text

| 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|
| `semantic.text.primary`   | `neutral.900` | `#171717` | 헤더 타이틀, 이름, 숫자 |
| `semantic.text.secondary` | `neutral.500` | `#737373` | 설명 텍스트, 이메일 |
| `semantic.text.tertiary`  | `neutral.400` | `#A3A3A3` | 타임스탬프, 섹션 라벨, 비활성 탭 |
| `semantic.text.inverse`   | `base.white`  | `#FFFFFF` | 검정 버튼 위 텍스트, 활성 아바타 이니셜 |
| `semantic.text.danger`    | `red.700`     | `#B91C1C` | Delete 모달 제목 |
| `semantic.text.disabled`  | `neutral.400` | `#A3A3A3` | 비활성 버튼 텍스트 |

#### Border

| 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|
| `semantic.border.default` | `neutral.200` | `#E5E5E5` | 입력 필드 테두리, 카드 외곽 |
| `semantic.border.strong`  | `neutral.400` | `#A3A3A3` | 강조 테두리 |
| `semantic.border.focus`   | `neutral.900` | `#171717` | 포커스 링 |

#### Icon

| 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|
| `semantic.icon.primary`   | `neutral.900` | `#171717` | 기본 아이콘 |
| `semantic.icon.secondary` | `neutral.400` | `#A3A3A3` | 보조 아이콘 |
| `semantic.icon.inverse`   | `base.white`  | `#FFFFFF` | 다크 배경 위 아이콘 |
| `semantic.icon.disabled`  | `neutral.300` | `#D4D4D4` | 비활성 아이콘 |

#### Brand

| 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|
| `semantic.brand.primary` | `neutral.900` | `#171717` | 브랜드 버튼, 활성 탭 바, 하단 네비 활성 배경 |
| `semantic.brand.inverse` | `base.white`  | `#FFFFFF` | 브랜드 역색상 |
| `semantic.brand.accent`  | `red.600`     | `#DC2626` | 레드 강조 (알림 뱃지, 포인트 요소) |

#### Interactive

| 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|
| `semantic.interactive.primary` | `neutral.900` | `#171717` | 기본 인터랙티브 요소 |
| `semantic.interactive.hover`   | `neutral.800` | `#262626` | Hover 상태 |
| `semantic.interactive.pressed` | `neutral.700` | `#404040` | Pressed 상태 |
| `semantic.interactive.disabled`| `neutral.200` | `#E5E5E5` | 비활성 인터랙티브 |

#### Status

| 그룹 | 토큰 | 참조 | HEX | 사용처 |
|---|---|---|---|---|
| **Success** | `status.success.default` | `green.500` | `#22C55E` | 성공 아이콘/인디케이터 |
| | `status.success.bg`      | `green.50`  | `#F0FDF4` | 성공 알림 배경 |
| | `status.success.text`    | `green.700` | `#15803D` | 성공 메시지 텍스트 |
| | `status.success.border`  | `green.300` | `#86EFAC` | 성공 상태 테두리 |
| **Warning** | `status.warning.default` | `yellow.500` | `#EAB308` | 경고 아이콘/인디케이터 |
| | `status.warning.bg`      | `yellow.50`  | `#FEFCE8` | 경고 알림 배경 |
| | `status.warning.text`    | `yellow.700` | `#A16207` | 경고 메시지 텍스트 |
| | `status.warning.border`  | `yellow.300` | `#FDE047` | 경고 상태 테두리 |
| **Info** | `status.info.default` | `blue.500` | `#3B82F6` | 정보 아이콘/인디케이터 |
| | `status.info.bg`      | `blue.50`  | `#EFF6FF` | 정보 알림 배경 |
| | `status.info.text`    | `blue.700` | `#1D4ED8` | 정보 메시지 텍스트 |
| | `status.info.border`  | `blue.300` | `#93C5FD` | 정보 상태 테두리 |
| **Error** | `status.error.default` | `red.600` | `#DC2626` | 에러 아이콘/인디케이터, Input Error 테두리 |
| | `status.error.bg`      | `red.50`  | `#FEF2F2` | 에러 배경 |
| | `status.error.text`    | `red.700` | `#B91C1C` | 에러 메시지 텍스트 |
| | `status.error.border`  | `red.300` | `#FCA5A5` | 에러 Input 테두리 |
| **Danger** | `status.danger.default` | `red.700` | `#B91C1C` | Delete 버튼, 스와이프 삭제 영역 |
| | `status.danger.bg`      | `red.50`  | `#FEF2F2` | Trash 아이콘 원형 배경 |
| | `status.danger.text`    | `red.700` | `#B91C1C` | "Delete Home?" 제목 텍스트 |

> Error vs Danger 구분: **Error**는 폼 유효성 검사 / 시스템 오류, **Danger**는 파괴적 액션(삭제 확인) UI에 사용

---

### Semantic Tokens — Dark 모드

| 그룹 | 토큰 | Light | Dark |
|---|---|---|---|
| bg | `primary`   | `#FFFFFF` → white | `#0A0A0A` → neutral.950 |
| bg | `secondary` | `#FAFAFA` | `#171717` → neutral.900 |
| bg | `card`      | `#F5F5F5` | `#262626` → neutral.800 |
| bg | `avatar`    | `#E5E5E5` | `#404040` → neutral.700 |
| bg | `disabled`  | `#E5E5E5` | `#404040` → neutral.700 |
| text | `primary`   | `#171717` | `#FAFAFA` → neutral.50 |
| text | `secondary` | `#737373` | `#A3A3A3` → neutral.400 |
| text | `tertiary`  | `#A3A3A3` | `#737373` → neutral.500 |
| text | `inverse`   | `#FFFFFF` | `#171717` → neutral.900 |
| text | `danger`    | `#B91C1C` | `#F87171` → red.400 |
| text | `disabled`  | `#A3A3A3` | `#525252` → neutral.600 |
| border | `default` | `#E5E5E5` | `#404040` → neutral.700 |
| border | `strong`  | `#A3A3A3` | `#737373` → neutral.500 |
| border | `focus`   | `#171717` | `#F5F5F5` → neutral.100 |
| icon | `primary`   | `#171717` | `#F5F5F5` → neutral.100 |
| icon | `secondary` | `#A3A3A3` | `#737373` → neutral.500 |
| icon | `inverse`   | `#FFFFFF` | `#171717` → neutral.900 |
| icon | `disabled`  | `#D4D4D4` | `#525252` → neutral.600 |
| brand | `primary`  | `#171717` | `#FFFFFF` → base.white |
| brand | `inverse`  | `#FFFFFF` | `#171717` → neutral.900 |
| brand | `accent`   | `#DC2626` | `#EF4444` → red.500 |
| interactive | `primary`  | `#171717` | `#FFFFFF` → base.white |
| interactive | `disabled` | `#E5E5E5` | `#404040` → neutral.700 |
| status.success | `default` | `#22C55E` | `#4ADE80` → green.400 |
| status.success | `bg`      | `#F0FDF4` | `#052E16` → green.950 |
| status.success | `text`    | `#15803D` | `#86EFAC` → green.300 |
| status.warning | `default` | `#EAB308` | `#FACC15` → yellow.400 |
| status.warning | `bg`      | `#FEFCE8` | `#422006` → yellow.950 |
| status.warning | `text`    | `#A16207` | `#FDE047` → yellow.300 |
| status.info | `default`   | `#3B82F6` | `#60A5FA` → blue.400 |
| status.info | `bg`        | `#EFF6FF` | `#172554` → blue.950 |
| status.info | `text`      | `#1D4ED8` | `#93C5FD` → blue.300 |
| status.error | `default`  | `#DC2626` | `#F87171` → red.400 |
| status.error | `bg`       | `#FEF2F2` | `#450A0A` → red.950 |
| status.error | `text`     | `#B91C1C` | `#FCA5A5` → red.300 |

---

## 2. 타이포그래피 토큰

**폰트 패밀리:** `Noto Sans KR` (Figma 클라우드 폰트)
**기준:** 이미지 시각적 계층 관찰 + 모바일 HIG 표준 크기 (390px 화면 기준)
**노트:** Noto Sans KR에 SemiBold(600) 없음 → Bold(700)로 대체 적용

| 토큰명 | Weight | Size (px) | Line Height (px) | 사용처 (관찰) |
|---|---|---|---|---|
| `text.heading.h1` | Bold (700) | 22 | 28 | "Family Management", "Create Group", "Manage Members", "Notifications" — 화면 타이틀 |
| `text.heading.h2` | Bold (700) | 18 | 24 | "Parent's Home Hub" — 헤더 중앙 타이틀 |
| `text.heading.h3` | Bold (700) | 16 | 22 | "Sleep", "Health", "Group Invitation", "Requests" — 카드/섹션 소제목 |
| `text.body.lg` | Regular (400) | 16 | 24 | 일반 본문 텍스트 |
| `text.body.lg.med` | Medium (500) | 16 | 24 | 강조 본문 |
| `text.body.md` | Regular (400) | 15 | 22 | "Are you sure you want to delete...", "Invited by mom@gmail.com..." — 설명 텍스트 |
| `text.body.md.med` | Medium (500) | 15 | 22 | 리스트 이름 "Sarah", "Mike", "Olive" |
| `text.body.sm` | Regular (400) | 14 | 20 | 이메일 주소 sarah.j@example.com |
| `text.body.sm.med` | Medium (500) | 14 | 20 | 탭 레이블 "My Family", "Guests" |
| `text.caption.md` | Regular (400) | 12 | 16 | "FAMILY STATUS", "hrs", "/100", "2 mins ago" |
| `text.caption.sm` | Regular (400) | 11 | 14 | 세부 보조 텍스트 |
| `text.label.lg` | Bold (700) | 14 | 20 | 섹션 라벨 "Group Name", "Select Members" |
| `text.label.md` | Bold (700) | 12 | 16 | ADMIN, MEMBER 뱃지 텍스트 (대문자) |
| `text.label.sm` | Bold (700) | 11 | 14 | 소형 라벨 |
| `text.button.lg` | Bold (700) | 16 | 24 | "Login", "Create", "Delete", "Done" 버튼 — 대형 버튼 |
| `text.button.md` | Bold (700) | 14 | 20 | "Decline", "Accept" — 중형 버튼 |

> `text.body.lg` / `text.heading.h2` 등의 아바타 아래 이름 텍스트 ("Charles (Me)", "Sara")는 `text.caption.md` 또는 `text.label.md` 크기로 관찰됨

---

## 3. Spacing Scale

**기준:** 390px 너비 화면 기준 관찰값 (iOS 표준 8px 그리드)

| 토큰명 | 값 (px) | 사용처 (관찰) |
|---|---|---|
| `space.2` | 2 | 미세 간격 |
| `space.4` | 4 | 뱃지 내부 패딩 (좌우), 아이콘-레이블 최소 간격 |
| `space.6` | 6 | 뱃지 상하 패딩 |
| `space.8` | 8 | 소형 컴포넌트 내부 간격 |
| `space.12` | 12 | 리스트 아이템 상하 패딩, 카드 내부 간격 |
| `space.16` | 16 | 화면 콘텐츠 내부 패딩, 아바타-텍스트 간격, 카드 패딩 |
| `space.20` | 20 | 화면 좌우 여백 (콘텐츠 시작점 ~20px) |
| `space.24` | 24 | 섹션 간격, 모달 내부 패딩 |
| `space.32` | 32 | 주요 섹션 사이 여백 |
| `space.40` | 40 | 대형 컴포넌트 내부 (버튼 좌우 패딩) |
| `space.48` | 48 | 여백 최대값 |

---

## 4. Radius / Shadow

### Border Radius

| 토큰명 | 값 (px) | 사용처 (관찰) |
|---|---|---|
| `radius.none` | 0 | 테두리 없음 |
| `radius.xs` | 4 | 미세 라운드 |
| `radius.sm` | 8 | 컨텍스트 메뉴, 소형 요소 |
| `radius.md` | 12 | 입력 필드, Sleep·Health 카드, 하단 네비 활성 아이콘 배경, NotificationListItem 내부 버튼 |
| `radius.lg` | 16 | 그룹 리스트 아이템 컨테이너 |
| `radius.xl` | 20 | 모달/다이얼로그 (Home Hub Delete modal, Success modal), NotificationListItem 외곽 |
| `radius.full` | 9999 | 버튼 전체 (Login, Create, Delete, Done, Decline, Accept), 아바타, 뱃지 |

### Shadow

| 토큰명 | 값 | 사용처 (관찰) |
|---|---|---|
| `shadow.card` | `0 2px 8px rgba(0,0,0,0.08)` | Sleep/Health 카드 미세 그림자 |
| `shadow.modal` | `0 8px 24px rgba(0,0,0,0.16)` | 모달 다이얼로그 |
| `shadow.dropdown` | `0 4px 16px rgba(0,0,0,0.12)` | 컨텍스트 메뉴 (Invite to Hub / Manage Members) |

> Shadow 값은 시각적 깊이 관찰값으로, 픽셀 단위 측정 불가능. 상대적 계층 관계만 확인됨.

---

## 5. 컴포넌트 규칙

### Button

| 속성 | 값 | 근거 |
|---|---|---|
| 높이 (LG) | 52px | Login, Create, Delete, Done 버튼 시각적 높이 |
| 높이 (MD) | 40px | Decline, Accept 버튼 시각적 높이 |
| 너비 | `100%` (최대 335px) | 화면 좌우 여백 20px 기준, 350px 콘텐츠 폭에서 약 335px |
| Border Radius | `radius.full` (9999px) | 모든 버튼 완전 필 형태 |
| Typography | `text.button.lg` (LG), `text.button.md` (MD) | |

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `brand.primary` (#191919) | `text.inverse` (#FFFFFF) | 없음 |
| Secondary | `bg.primary` (#FFFFFF) | `text.primary` (#1C1C1E) | 1.5px `border.default` (#E5E5EA) — Done 버튼 관찰 |
| Danger | `danger.default` (#CC1A1A) | `text.inverse` (#FFFFFF) | 없음 |
| Disabled | `bg.disabled` (#E5E5EA) | `text.disabled` (#9B9B9B) | 없음 |

> **Ghost variant**: Create New Group 버튼 — Secondary와 동일하게 아웃라인, 내부 배경 white, `+ Create New Group` 아이콘 포함

### Card

| 속성 | 값 | 근거 |
|---|---|---|
| Background | `bg.card` (#F2F2F7) | Home 화면 Sleep/Health 카드 관찰 |
| Border Radius | `radius.md` (12px) | 카드 모서리 관찰 |
| Padding | `space.16` (16px) | 카드 내부 여백 |
| Shadow | `shadow.card` | 미세 그림자 |
| Width | ~165px (2열 grid, 총 너비 350px, gap 16px 가정) | Home 화면 2열 배치 |

카드 구성:
- 아이콘 + 레이블 (상단 좌측, Moon/Heart 아이콘 + "Sleep"/"Health")
- 큰 숫자 (중앙, `text.heading.h1` 또는 더 큰 Display 크기)
- 단위 레이블 하단 ("hrs", "/100")
- 데이터 시각화 영역 (차트/도넛 그래프, 우측 정렬)

### Input

| 속성 | 값 | 근거 |
|---|---|---|
| 높이 | 52px | Create Group 화면 Group Name 입력 필드 |
| Border Radius | `radius.md` (12px) | 입력 필드 모서리 |
| Border | 1.5px `border.default` (#E5E5EA) | 관찰된 테두리 두께/색상 |
| Background | `bg.primary` (#FFFFFF) | 흰 배경 |
| Padding (horizontal) | `space.16` (16px) | |

| State | Border | Text |
|---|---|---|
| Default | `border.default` (#E5E5EA) | `text.tertiary` (#9B9B9B) placeholder |
| Filled | `border.default` (#E5E5EA) | `text.primary` (#1C1C1E) |
| Error | `danger.default` (#CC1A1A) | `text.danger` (#CC1A1A) 에러 메시지 |

### Tab Navigation

| 속성 | 값 | 근거 |
|---|---|---|
| 전체 너비 | 390px | 화면 전체 폭 |
| 높이 | 44px | 탭 영역 시각적 높이 |
| Active Tab | `text.primary` (#1C1C1E), 하단 2px 바 `brand.primary` | All 탭 관찰 |
| Inactive Tab | `text.tertiary` (#9B9B9B) | My Family, Guests 탭 관찰 |
| Typography | `text.body.sm.med` (14px Medium) | 탭 레이블 크기 |
| 하단 인디케이터 | 2px solid `brand.primary` | 관찰 |

### Bottom Navigation Bar

| 속성 | 값 | 근거 |
|---|---|---|
| 높이 | 83px | iOS safe area 포함 하단 네비 높이 |
| 너비 | 390px | 화면 전체 폭 |
| 탭 수 | 5개 | Home, Activity(맥박), Moon(수면), Podcast, Play |
| Active Background | `brand.primary` (#191919), `radius.md` (12px) 라운드 정사각형 | Home 아이콘 배경 |
| Active Icon | `text.inverse` (#FFFFFF) | 흰 아이콘 |
| Inactive Icon | `text.tertiary` (#9B9B9B) | 회색 아이콘 |
| 아이콘 크기 | 24×24px | Lucide 표준 |

### Avatar

| Size | 지름 | 관찰 근거 |
|---|---|---|
| LG | 48px | Charles 활성 아바타 |
| MD | 40px | 중간 크기 |
| SM | 32px | Sara, Mike, Peter 홈 화면 아바타 |

| State | Background | Text |
|---|---|---|
| Active | `brand.primary` (#191919) | `text.inverse` (#FFFFFF) 이니셜 |
| Default | `bg.avatar` (#E5E5EA) | `text.primary` (#1C1C1E) 이니셜 |

Border Radius: `radius.full` (완전 원형)

### Modal / Dialog

| 속성 | 값 |
|---|---|
| 너비 | 335px |
| Border Radius | `radius.xl` (20px) |
| Background | `bg.primary` (#FFFFFF) |
| Shadow | `shadow.modal` |
| 오버레이 | `bg.overlay` (#1C1C1E + 60% opacity) |
| 닫기 버튼 | X 아이콘, 우측 상단, `text.secondary` 색상 |
| 내부 패딩 | `space.24` (24px) |

| Type | 아이콘 | 아이콘 배경 | 타이틀 색상 | 버튼 |
|---|---|---|---|---|
| Success | CircleCheck | `bg.avatar` (#E5E5EA) 원형 | `text.primary` | Secondary (아웃라인) "Done" |
| Danger | Trash2 | `danger.bg` (#FDECEA) 원형 | `text.danger` (#CC1A1A) | Danger "Delete" + 텍스트 "Cancel" |

### Badge

| 속성 | 값 |
|---|---|
| Background | `bg.avatar` (#E5E5EA) |
| Text | `text.primary` (#1C1C1E) |
| Typography | `text.label.md` (12px SemiBold 대문자) |
| Padding | `space.4` 상하, `space.8` 좌우 |
| Border Radius | `radius.full` |

Variants: `ADMIN`, `MEMBER`

### List Item / Member

구성: 아바타(SM 32px) + 이름(`text.body.md.med`) + 뱃지 + 이메일(`text.body.sm`, `text.secondary`) + 상태 인디케이터(우측)

| State | 우측 인디케이터 |
|---|---|
| Default | 빈 원 (border `border.default`) |
| Selected | Check 아이콘 + `brand.primary` (#191919) 원형 배경 |
| Swipe-Delete | 좌측에 `danger.default` (#CC1A1A) 영역 + Trash2 아이콘 (`text.inverse`) |

### Context Menu

| 속성 | 값 |
|---|---|
| 너비 | ~200px |
| Border Radius | `radius.sm` (8px) 또는 `radius.md` (12px) |
| Background | `bg.primary` (#FFFFFF) |
| Shadow | `shadow.dropdown` |
| 항목 수 | 2개 (Invite to Hub, Manage Members) |
| 항목 높이 | ~56px |
| 아이콘 | 24px Lucide (UserPlus, Users) |
| Typography | `text.body.md.med` |

### Notification List Item

알림 페이지(`Notifications`) 안의 리스트 아이템. 기존 `Notification Card`(독립 카드 컴포넌트)를 대체. Figma `179:11395` 기준 (2026-05-06).

**컨테이너 (모든 variant 공통)**

| 속성 | 값 |
|---|---|
| 너비 | 350px (페이지 컨텐츠 가로 폭) |
| Padding | 16px (4면) |
| Border Radius | `radius.xl` (20px) |
| Background | `bg.secondary` (#FAFAFA) |
| Shadow | `shadow.xs` (`0 1px 2px rgba(0,0,0,0.05)`) |
| 내부 gap | 16px (헤더 블록 ↔ 하단 슬롯) |

**헤더 블록 (모든 variant 공통)**

- 1행: 타이틀 (좌) + 시간 (우, 60px 폭). `justify-between`.
  - 타이틀: `text.body.sm.strong` (Pretendard SemiBold 14px, lh 1.3), 색 `text.primary` (#262626)
  - 시간: `text.caption.md` (Pretendard Medium 12px, lh 1.4), 색 `text.disabled` (#D4D4D4)
- 2행: 서브텍스트 1줄. `text.caption.md` (Pretendard Medium 12px, lh 1.4), 색 `text.secondary` (#737373)
- 1행 ↔ 2행 gap: 8px

**Variant 4종 (하단 슬롯)**

| Variant | 하단 슬롯 | 사양 |
|---|---|---|
| `actions` | Decline + Accept (각 153px, gap 12) | 두 버튼 모두 h=40, `radius.md` (12), label 12px Medium. Decline = Secondary (bg `bg.primary`, border `neutral.950`, text `neutral.950`). Accept = Primary (bg `neutral.950`, text `base.white`) |
| `confirmed` | 단일 disabled 버튼 (318px) | h=40, `radius.md` (12), bg `neutral.300` (#D4D4D4), label `button.primary.disabled` (#A3A3A3) 12px Medium. 기본 라벨 "Invitation Accepted" |
| `status-text` | 상태 텍스트 1줄 (318px) | 12px Medium, 색 `button.primary.disabled` (#A3A3A3). 예: "Invitation declined" |
| `none` | 없음 | 헤더 블록만. 내부 gap(16px) 미적용 |

**전체 높이 (참고치, 컨테이너 padding 포함)**

| Variant | 높이 |
|---|---|
| `actions`, `confirmed` | 147px |
| `status-text` | 124px |
| `none` | 75px |

---

## 6. 상태값 (States)

### Button States

```
primary:
  default  → bg #191919, text #FFFFFF
  hover    → bg #333333 (10% lighter — 직접 관찰 불가, hover 상태 이미지 없음)
  active   → bg #000000 (pressed)
  disabled → bg #E5E5EA, text #9B9B9B
  
danger:
  default  → bg #CC1A1A, text #FFFFFF
  hover    → bg #B31717
  active   → bg #991515
  disabled → bg #E5E5EA, text #9B9B9B

secondary:
  default  → bg #FFFFFF, border 1.5px #E5E5EA, text #1C1C1E
  hover    → bg #F8F8F8
  active   → bg #F2F2F7
  disabled → bg #E5E5EA, text #9B9B9B (= Invitation Accepted 버튼)
```

> hover/active/pressed 상태는 이미지에 존재하지 않음. disabled만 이미지에서 직접 관찰됨 (Invitation Accepted 버튼).

### Input States

```
default  → border #E5E5EA, text #9B9B9B (placeholder)
filled   → border #E5E5EA, text #1C1C1E
focus    → border #191919 (brand primary — 이미지 관찰 불가)
error    → border #CC1A1A, message text #CC1A1A
disabled → bg #F2F2F7, text #9B9B9B (이미지 관찰 불가)
```

### Tab States

```
active   → text #1C1C1E, bottom bar 2px #191919
inactive → text #9B9B9B, no bar
```

### Avatar States

```
active  (Me) → bg #191919, initial #FFFFFF
default      → bg #E5E5EA, initial #1C1C1E
```

### List Item States

```
default       → right: empty circle (border #E5E5EA)
selected      → right: filled #191919 circle + white check icon
swipe-delete  → left: #CC1A1A bg area + white Trash2 icon
```

### Navigation States

```
active   → icon bg #191919 (rounded square r=12px), icon #FFFFFF
inactive → icon #9B9B9B, no bg
```

### Notification List Item Variants

```
actions      → 헤더 + 서브텍스트 + [Decline (Secondary) | Accept (Primary)]  (각 153px, gap 12)
confirmed    → 헤더 + 서브텍스트 + [단일 disabled 버튼 318px, "Invitation Accepted"]
status-text  → 헤더 + 서브텍스트 + 상태 텍스트 1줄 (예: "Invitation declined", #A3A3A3)
none         → 헤더 + 서브텍스트만 (하단 슬롯 없음)
```

상세 사양은 §5 컴포넌트 규칙의 `Notification List Item` 참조.

---

## 7. JSON 토큰 (CSS Variables / Tailwind Config)

### CSS Variables

```css
:root {
  /* Primitives */
  --color-black: #191919;
  --color-white: #FFFFFF;
  --color-gray-900: #1C1C1E;
  --color-gray-700: #6B6B6B;
  --color-gray-500: #9B9B9B;
  --color-gray-300: #E5E5EA;
  --color-gray-100: #F2F2F7;
  --color-gray-50: #F8F8F8;
  --color-red-700: #CC1A1A;
  --color-red-100: #FDECEA;

  /* Semantic */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-gray-50);
  --bg-card: var(--color-gray-100);
  --bg-avatar: var(--color-gray-300);
  --bg-overlay: rgba(28, 28, 30, 0.6);
  --bg-disabled: var(--color-gray-300);

  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-700);
  --text-tertiary: var(--color-gray-500);
  --text-inverse: var(--color-white);
  --text-danger: var(--color-red-700);
  --text-disabled: var(--color-gray-500);

  --border-default: var(--color-gray-300);
  --border-strong: var(--color-gray-500);

  --brand-primary: var(--color-black);
  --brand-inverse: var(--color-white);
  --danger-default: var(--color-red-700);
  --danger-bg: var(--color-red-100);

  /* Spacing */
  --space-2: 2px;
  --space-4: 4px;
  --space-6: 6px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-32: 32px;
  --space-40: 40px;
  --space-48: 48px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Typography */
  --font-family: 'Noto Sans KR', sans-serif;

  --text-h1-size: 22px;
  --text-h1-weight: 600;
  --text-h1-line-height: 28px;

  --text-h2-size: 18px;
  --text-h2-weight: 600;
  --text-h2-line-height: 24px;

  --text-h3-size: 16px;
  --text-h3-weight: 600;
  --text-h3-line-height: 22px;

  --text-body-lg-size: 16px;
  --text-body-lg-weight: 400;
  --text-body-lg-line-height: 24px;

  --text-body-md-size: 15px;
  --text-body-md-weight: 400;
  --text-body-md-line-height: 22px;

  --text-body-sm-size: 14px;
  --text-body-sm-weight: 400;
  --text-body-sm-line-height: 20px;

  --text-caption-md-size: 12px;
  --text-caption-md-weight: 400;
  --text-caption-md-line-height: 16px;

  --text-label-lg-size: 14px;
  --text-label-lg-weight: 600;
  --text-label-lg-line-height: 20px;

  --text-label-md-size: 12px;
  --text-label-md-weight: 600;
  --text-label-md-line-height: 16px;

  --text-button-lg-size: 16px;
  --text-button-lg-weight: 600;
  --text-button-lg-line-height: 24px;

  --text-button-md-size: 14px;
  --text-button-md-weight: 600;
  --text-button-md-line-height: 20px;
}
```

### Tailwind Config

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        black: '#191919',
        white: '#FFFFFF',
        gray: {
          900: '#1C1C1E',
          700: '#6B6B6B',
          500: '#9B9B9B',
          300: '#E5E5EA',
          100: '#F2F2F7',
          50:  '#F8F8F8',
        },
        red: {
          700: '#CC1A1A',
          100: '#FDECEA',
        },
      },
      borderRadius: {
        none: '0px',
        xs:   '4px',
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '20px',
        full: '9999px',
      },
      spacing: {
        2:  '2px',
        4:  '4px',
        6:  '6px',
        8:  '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        48: '48px',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      fontSize: {
        'h1':        ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'h2':        ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'h3':        ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'body-lg':   ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md':   ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':   ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption':   ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg':  ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md':  ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'btn-lg':    ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'btn-md':    ['14px', { lineHeight: '20px', fontWeight: '600' }],
      },
      boxShadow: {
        card:     '0 2px 8px rgba(0,0,0,0.08)',
        modal:    '0 8px 24px rgba(0,0,0,0.16)',
        dropdown: '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
}
```

---

## 8. React 컴포넌트 구현 가이드

### Button

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'disabled'
type ButtonSize = 'lg' | 'md'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-black text-white',
  secondary: 'bg-white text-gray-900 border border-gray-300',
  danger:    'bg-red-700 text-white',
  disabled:  'bg-gray-300 text-gray-500 cursor-not-allowed',
}

const sizeStyles: Record<ButtonSize, string> = {
  lg: 'h-[52px] text-btn-lg px-10',
  md: 'h-[40px] text-btn-md px-8',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  children,
  onClick,
  disabled,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || variant === 'disabled'
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      className={[
        'rounded-full font-semibold transition-colors',
        fullWidth ? 'w-full max-w-[335px]' : '',
        sizeStyles[size],
        isDisabled ? variantStyles.disabled : variantStyles[variant],
      ].join(' ')}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
```

### Avatar

```tsx
type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarState = 'active' | 'default'

interface AvatarProps {
  initial: string
  size?: AvatarSize
  state?: AvatarState
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-caption',     // 32px
  md: 'w-10 h-10 text-label-lg',  // 40px
  lg: 'w-12 h-12 text-h3',        // 48px
}

export function Avatar({ initial, size = 'md', state = 'default' }: AvatarProps) {
  return (
    <div className={[
      'rounded-full flex items-center justify-center font-semibold select-none',
      sizeMap[size],
      state === 'active' ? 'bg-black text-white' : 'bg-gray-300 text-gray-900',
    ].join(' ')}>
      {initial.charAt(0).toUpperCase()}
    </div>
  )
}
```

### Badge

```tsx
type BadgeType = 'ADMIN' | 'MEMBER'

export function Badge({ type }: { type: BadgeType }) {
  return (
    <span className="bg-gray-300 text-gray-900 text-label-md px-2 py-1 rounded-full uppercase tracking-wide">
      {type}
    </span>
  )
}
```

### Input

```tsx
type InputState = 'default' | 'filled' | 'error'

interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  error?: string
  state?: InputState
}

export function Input({ label, placeholder, value, onChange, error }: InputProps) {
  const hasError = !!error
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-label-lg text-gray-900">{label}</label>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'h-[52px] w-full rounded-md px-4 text-body-md bg-white outline-none transition-colors',
          hasError
            ? 'border-[1.5px] border-red-700 text-gray-900'
            : 'border-[1.5px] border-gray-300 text-gray-900 focus:border-black',
          !value && 'text-gray-500',
        ].join(' ')}
      />
      {error && <p className="text-caption text-red-700">{error}</p>}
    </div>
  )
}
```

### Modal

```tsx
interface ModalProps {
  type: 'success' | 'danger'
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  onClose: () => void
}

export function Modal({ type, title, description, actionLabel, onAction, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl w-[335px] p-6 shadow-modal flex flex-col items-center gap-4">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-700">
          <X size={20} />
        </button>

        {/* Icon */}
        <div className={[
          'w-12 h-12 rounded-full flex items-center justify-center',
          type === 'danger' ? 'bg-red-100' : 'bg-gray-300',
        ].join(' ')}>
          {type === 'danger'
            ? <Trash2 size={24} className="text-red-700" />
            : <CheckCircle size={24} className="text-gray-900" />
          }
        </div>

        {/* Text */}
        <h2 className={['text-h2 font-semibold text-center', type === 'danger' ? 'text-red-700' : 'text-gray-900'].join(' ')}>
          {title}
        </h2>
        <p className="text-body-md text-gray-700 text-center">{description}</p>

        {/* Action */}
        <Button
          variant={type === 'danger' ? 'danger' : 'secondary'}
          onClick={onAction}
        >
          {actionLabel}
        </Button>

        {type === 'danger' && (
          <button onClick={onClose} className="text-body-md text-gray-900">Cancel</button>
        )}
      </div>
    </div>
  )
}
```

### ListItem (Member)

```tsx
type ListItemState = 'default' | 'selected' | 'swipe-delete'

interface ListItemProps {
  name: string
  email: string
  initial: string
  badgeType?: 'ADMIN' | 'MEMBER'
  state?: ListItemState
  onDelete?: () => void
  onSelect?: () => void
}

export function ListItem({ name, email, initial, badgeType, state = 'default', onDelete, onSelect }: ListItemProps) {
  return (
    <div className="relative flex items-center overflow-hidden">
      {/* Swipe Delete Area */}
      {state === 'swipe-delete' && (
        <div
          className="absolute right-0 w-[72px] h-full bg-red-700 flex items-center justify-center cursor-pointer"
          onClick={onDelete}
        >
          <Trash2 size={24} className="text-white" />
        </div>
      )}

      {/* Main Row */}
      <div
        className={[
          'flex items-center gap-3 py-3 px-5 w-full',
          state === 'swipe-delete' ? 'translate-x-[-72px]' : '',
        ].join(' ')}
        onClick={onSelect}
      >
        <Avatar initial={initial} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-body-md font-medium text-gray-900">{name}</span>
            {badgeType && <Badge type={badgeType} />}
          </div>
          <span className="text-body-sm text-gray-700 truncate block">{email}</span>
        </div>
        {/* State Indicator */}
        {state === 'selected' ? (
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <Check size={14} className="text-white" />
          </div>
        ) : state === 'default' ? (
          <div className="w-6 h-6 rounded-full border-[1.5px] border-gray-300 flex-shrink-0" />
        ) : null}
      </div>
    </div>
  )
}
```

### BottomNav

```tsx
const NAV_ITEMS = [
  { id: 'home',     icon: Home,     label: 'Home'     },
  { id: 'activity', icon: Activity, label: 'Activity' },
  { id: 'sleep',    icon: Moon,     label: 'Sleep'    },
  { id: 'podcast',  icon: Podcast,  label: 'Podcast'  },
  { id: 'play',     icon: Play,     label: 'Play'     },
]

export function BottomNav({ active }: { active: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[83px] bg-white flex items-center justify-around px-5 pb-safe">
      {NAV_ITEMS.map(({ id, icon: Icon }) => (
        <button key={id} className="flex items-center justify-center w-12 h-12">
          <div className={[
            'w-10 h-10 flex items-center justify-center rounded-md transition-colors',
            active === id ? 'bg-black' : '',
          ].join(' ')}>
            <Icon size={24} className={active === id ? 'text-white' : 'text-gray-500'} />
          </div>
        </button>
      ))}
    </nav>
  )
}
```

---

## 관찰 불가 항목 목록

아래 항목은 레퍼런스 이미지에서 정적 스크린샷으로는 확인 불가능하여 **포함하지 않음**:

- hover / pressed 상태 배경색 (인터랙션 없음)
- focus-ring 색상/두께
- 애니메이션 duration/easing
- 폰트 letter-spacing 수치 (FAMILY STATUS 캡션 외)
- 정확한 카드 shadow blur/spread 수치 (상대적 관찰만 가능)
- 스와이프 제스처 threshold 값
