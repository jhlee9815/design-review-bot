# Phase 6 — 디자인 토큰 시스템 구축

## 상태

🔄 **진행 중** (6-1: 완료 / 6-2: 완료 / 6-3: 대기)

## 목표

UNO Design System Figma(`qDCHLZbwY41wKVYIVXiZst`)를 source of truth로 삼아 CSS 커스텀 프로퍼티 레이어를 전면 재구성하고,
기존 코드의 변수 참조를 UNO DS 네이밍으로 일괄 교체한다.

---

## 하위 작업

| 서브 태스크 | 내용 | 상태 |
|---|---|:-:|
| 6-1 | CSS 변수 교체 대상 감사 | ✅ |
| 6-2 | UNO DS Variables/Styles 추출 → `src/index.css` 전면 재작성 | ✅ |
| 6-3 | 기존 코드 변수 참조 일괄 교체 (UNO DS 네이밍) | ⏳ |

---

## 산출물

| 산출물 | 위치 |
|---|---|
| CSS 변수 감사 리포트 | `phase6/phase6-1.md` |
| UNO DS 토큰 매핑 명세 | `phase6/phase6-2.md` |
| 새 토큰 시스템 | `src/index.css` |
| 변수 참조 교체 내역 (예정) | `phase6/phase6-3.md` |

---

## 결정사항

- 토큰 SoT를 `index.css` → **UNO DS Figma**(`qDCHLZbwY41wKVYIVXiZst`)로 이동
- `UnoHome` 컬렉션의 **Mobile 모드만 적용** (Display 모드는 추후 확장용으로 보존만)
- 변수 네이밍은 **UNO DS 그대로** (`Background/Primary` → `--background-primary`)
- 다크모드 제거 (UNO DS Mobile은 light 전용)
- Tailwind v4 utility 호환을 위해 primitives는 `@theme`, semantic은 `:root`
