# Apple-inspired Token Mapping

> Phase 2 산출물  
> 기준 소스: `/Users/juhee/Work/Test/awesome-design-md/design-md/apple/DESIGN.md`  
> JSON 토큰: `apple-tokens.json`

## 결론

Apple-inspired DS는 기존 UNO DS를 대체하지 않고, 별도 adapter 레이어로 다룬다. 현재 Figma pipeline은 `figmaNodeId`와 `figma-mapping.yaml`에 의존하므로, Apple Markdown 토큰만으로는 `snapshot/diff/classify`가 자동 작동하지 않는다.

따라서 Phase 2의 산출물은 다음 단계의 입력이다.

1. Phase 3: Apple Design System Skill이 이 토큰을 읽고 변경을 체크리스트로 번역
2. Phase 4: Button/Card/Hero 등 대표 컴포넌트에 제한 적용
3. Phase 5: 자동/Claude/사람 검토 경계 리포트화

---

## 1. UNO 기존 토큰과 Apple 토큰의 대응

| 목적 | UNO 현재 토큰 예시 | Apple 후보 | 적용 판단 |
|---|---|---|---|
| 기본 배경 | `--background-secondary`, `--background-primary` | `apple.semantic.light.background.page/section` | partial — 화면 전체 교체는 위험, demo section부터 적용 |
| 카드 배경 | `--background-card` | `apple.component.card.productTile.background` | good candidate |
| 기본 텍스트 | `--text-primary` | `apple.semantic.light.text.primary` | good candidate |
| 보조 텍스트 | `--text-secondary` | `apple.semantic.light.text.secondary` | good candidate |
| 링크/CTA | 기존 UNO accent 또는 button primary | `apple.semantic.light.interactive.primary` | good candidate |
| 다크 배경 | `--background-accent`, chart dark tokens | `apple.semantic.dark.background.page/card` | partial — UNO health/status 화면과 충돌 가능 |
| radius | `--radius-sm/md/lg/full` | `apple.radius.standard/comfortable/large/pill` | good candidate |
| shadow | `--shadow-md/lg` | `apple.shadow.card` | partial — Apple은 shadow 사용이 적음 |
| typography | `--font-sans`, `--font-size-*` | `apple.typography.roles.*` | partial — SF Pro 직접 사용 대신 system fallback 권장 |

---

## 2. 자동 적용 가능성 분류

### 자동 적용 후보

- 색상 값 변경: `#0071e3`, `#1d1d1f`, `#f5f5f7` 등
- radius 값 변경: `8px`, `11px`, `12px`, `980px`
- shadow 값 변경: card/focus shadow
- typography 수치: font-size, weight, line-height, letter-spacing

### Claude 요약/체크리스트 후보

- Button variant를 Apple Primary Blue / Pill Link로 재해석
- Card를 product tile 구조로 바꾸기
- Hero section을 full-width cinematic layout으로 재구성
- Navigation glass effect 적용 여부 판단

### 사람 검토 필요

- Apple풍이 UNO HOME의 가족/건강/상태 정보 UX와 맞는지
- 상태 색상 체계(red/yellow/green/blue)를 Apple의 단일 blue accent 철학과 어떻게 조화할지
- Apple visual language 모방 수준이 발표/브랜드 관점에서 적절한지
- Figma component set을 새로 만들지 기존 UNO Figma에 adapter로만 둘지

---

## 3. Phase 4 추천 적용 범위

전체 앱에 바로 적용하지 않고 아래 순서로 제한한다.

1. `Button.tsx`
   - `apple-primary-blue`
   - `apple-pill-link`
   - `apple-dark`
2. `Card.tsx`
   - `apple-product-tile`
   - `apple-elevated`
3. Demo Hero section
   - 기존 화면을 바꾸기보다 `App.tsx` 갤러리에 Apple DS demo section 추가

---

## 4. CSS 변수 변환 초안

실제 적용은 Phase 4에서 한다. Phase 2에서는 후보만 둔다.

```css
:root {
  --apple-color-pure-black: #000000;
  --apple-color-white: #ffffff;
  --apple-color-light-gray: #f5f5f7;
  --apple-color-near-black: #1d1d1f;
  --apple-color-blue: #0071e3;
  --apple-color-link-blue: #0066cc;
  --apple-color-bright-blue: #2997ff;
  --apple-radius-standard: 8px;
  --apple-radius-pill: 980px;
  --apple-shadow-card: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;
  --apple-font-display: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --apple-font-text: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

---

## 5. 리스크

| 리스크 | 완화 |
|---|---|
| Apple DS가 공식 자료가 아님 | 발표/문서에서 Apple-inspired로 명시 |
| Figma node가 없음 | 기존 Figma 자동화와 별도 Markdown DS adapter로 설명 |
| UNO 상태 색상과 Apple 단일 accent 철학 충돌 | 상태/알림/건강 색상은 UNO 유지, CTA/hero/card만 Apple 실험 |
| 전체 리디자인 범위 폭증 | Button/Card/Hero 2~3개만 적용 |
| 폰트 라이선스/가용성 | SF Pro 직접 번들 금지, system fallback 사용 |

---

## 6. Phase 2 완료 기준

- `apple-tokens.json` 작성 완료
- token mapping 문서 작성 완료
- JSON 파싱 검증 완료
- 기존 build/lint/preflight 영향 없음 확인
