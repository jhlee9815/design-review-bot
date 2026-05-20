# Phase 5-3 — 변경 감지 및 분류

## 상태

✅ **완료** (2026-05-04)

## 목표

approved baseline vs latest snapshot을 비교 → 변경된 노드 + 변경 유형 후보 산출 → `figma-mapping.yaml`과 대조하여 자동 반영 가능 여부 결정.

현재 `.automation/baseline/`이 비어 있으면 5-3 bootstrap 테스트를 위해서만 최신 2개 snapshot fallback을 사용한다.

## 담당 에이전트

`executor` (Sonnet, 5-2와 같은 패턴)

---

## 작업 정의 / 산출물

| 산출물 | 역할 |
|---|---|
| `scripts/pipeline/diff.ts` | approved baseline vs latest snapshot 비교 → 변경된 노드 목록 + 변경 유형 후보 산출 |
| `scripts/pipeline/classify.ts` | diff 결과를 `figma-mapping.yaml`과 대조 → 변경 유형 분류 + 자동 반영 가능 여부 표시 |
| `.automation/diffs/{ts}.json` | diff/classify 출력 |
| `.automation/reports/` (report-only 항목) | 매핑 안 된 변경 기록 |
| `package.json` `figma:diff`, `figma:classify` 스크립트 | 수동 실행 |
| `scripts/pipeline/run.sh` `[3/8]`, `[4/8]` placeholder 활성화 | 실제 호출로 교체 |

---

## 변경 분류 (5-0에서 확정)

| 분류 | 기준 |
|---|---|
| `token` | `tokensHash` 변경 |
| `text` | `textHash` 변경 |
| `component-props` | `componentPropsHash` 변경 |
| `asset` | fills 내 IMAGE 참조 변경 (propsHash로 감지) |
| `layout` | `boundingBox` 변경 (geometry diff) |
| `structure` | 노드 추가/삭제, `boundingBox` null |
| `unknown` | 매핑 안 된 노드의 변경 |

---

## 입력 데이터 (5-2 산출물)

```
.automation/snapshots/{ts}.json
{
  fileKey, timestamp, tokensHash,
  nodes: {
    [key]: {
      id, name, lastModified, visible, boundingBox,
      textHash, propsHash, componentPropsHash,
      texts: [...], componentProps: [...]
    }
  }
}
```

---

## 5-2에서 5-3으로 이어지는 결정사항 (재확인)

| 결정 항목 | 결정 |
|---|---|
| `lastModified` 활용 | 파일 수준 → diff에서 변경 트리거 신호로만 사용. 실제 비교는 `textHash`/`propsHash` 우선 |
| `boundingBox` null | 노드 삭제/누락 → 별도 `structure` 분류 |
| `tokensHash` 변경 | 토큰 재생성 단계 트리거 조건 |
| 스냅샷 누적 전략 | **승인된 change-set만 baseline**. diff는 baseline vs HEAD. baseline이 비어 있으면 bootstrap 테스트용 최신 2개 fallback |

---

## 검증 기준 (계약)

- ❌ 매핑된 node만 코드 반영 후보가 됨
- ❌ 매핑되지 않은 변경은 `.automation/reports/`에 report-only로 기록
- ✅ `npm run figma:diff` / `npm run figma:classify` exit 0
- ✅ `.automation/diffs/{timestamp}.json` 생성
- ✅ `.automation/diffs/{timestamp}-classified.json` 생성

## 구현 결과

- 추가: `scripts/pipeline/diff.ts`, `scripts/pipeline/classify.ts`
- 추가: `scripts/pipeline/lib/diff-snapshot.ts`, `scripts/pipeline/lib/classify-diff.ts`
- 추가 테스트: `scripts/pipeline/lib/diff-snapshot.test.ts`, `scripts/pipeline/lib/classify-diff.test.ts`
- `figma-api.ts`에 429/5xx retry/backoff 추가
- `snapshot.ts`는 공통 `fetchFigmaJson` helper를 사용하도록 변경
- `package.json`에 `figma:diff`, `figma:classify`, 관련 테스트 스크립트 추가
- `run.sh`의 `[3/8]`, `[4/8]` 활성화
- 실제 산출물:
  - `.automation/diffs/2026-05-04T03-35-16.json`
  - `.automation/diffs/2026-05-04T03-35-16-classified.json`

---

## 구현 가이드 (제안)

### diff.ts

1. `.automation/snapshots/` 디렉터리에서 최신 2개 JSON 로드
2. 노드별 비교:
   - `textHash` 다름 → `text` 후보
   - `propsHash` 다름 → `asset` 또는 시각 스타일 변경 후보
   - `componentPropsHash` 다름 → `component-props` 후보
   - `boundingBox` 좌표 변경 → `layout` 후보
   - `boundingBox` null 또는 노드 삭제 → `structure` 후보
   - `tokensHash` 다름 → `token` 후보 (전역 1건)
3. JSON으로 저장: `{ baseTs, headTs, changes: [...] }`

### classify.ts

1. diff 결과 로드
2. 각 변경에 대해 `figma-mapping.yaml`과 매칭:
   - 매핑된 노드 + `automation.apply == auto` + 변경 유형이 `allowedClasses` 포함 → `auto-apply`
   - 매핑되었으나 `apply == report-only` 또는 분류 불일치 → `report-only`
   - 매핑 안 됨 → `unknown` → `report-only`
3. 결과를 `.automation/diffs/{ts}.json`에 저장
4. `report-only` 항목은 `.automation/reports/`에 별도 기록

---

## 다음 단계로의 영향

| 다음 단계 | 5-3이 미칠 영향 |
|---|---|
| 5-4 apply | classify 결과의 `auto-apply` 항목만 처리 대상. `allowedClasses`로 마일스톤(M1/M2/M3) 분기 |
| 5-6 designer-review | `report-only` 항목들이 디자이너 리포트의 "매핑 외 변경" 섹션 |

---

## 의존성

- ✅ 5-2 snapshot.ts 완료 (입력 형식 확정)
- ✅ 5-0 figma-mapping.yaml의 `automation.apply`/`allowedClasses` 스키마 확정
