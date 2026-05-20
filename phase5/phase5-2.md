# Phase 5-2 — Figma 스냅샷 저장

## 상태

✅ **완료** (2026-04-30)

## 목표

Figma 파일/노드/토큰 현재 상태를 `.automation/snapshots/{timestamp}.json`에 저장. 5-3 diff에서 비교 기준이 됨.

## 담당 에이전트

`executor` (Sonnet)

---

## 작업 정의 / 산출물

| 산출물 | 역할 |
|---|---|
| `scripts/pipeline/snapshot.ts` | REST API 2회 병렬 호출 (`/v1/files/{key}/nodes` + `/v1/files/{key}?depth=1`) → snapshot JSON 출력 |
| `scripts/pipeline/lib/snapshot-node.ts` (+ test) | 노드 단위 hash/leaf 추출 로직 |
| `package.json` `figma:snapshot` 스크립트 | `tsx --env-file=.env scripts/pipeline/snapshot.ts` |
| `scripts/pipeline/run.sh`의 `[2/8] snapshot` placeholder 활성화 | 실제 호출로 교체 |

---

## 구현 결과 (cross-check)

### 코드 산출물

| 파일 | 라인 수 |
|---|---|
| `scripts/pipeline/snapshot.ts` | 289 |
| `scripts/pipeline/lib/snapshot-node.ts` | 233 |
| `scripts/pipeline/lib/snapshot-node.test.ts` | 92 |

### snapshot JSON 스키마

```
{
  fileKey,
  timestamp,
  source: "figma-rest",
  tokensHash (SHA256),
  nodes: {
    [key]: {
      id,
      name,
      lastModified,
      visible,
      boundingBox,
      textHash,                  // 모든 TEXT 노드 문자열 정렬·연결 후 SHA256
      propsHash,                 // type + fills + effects 만 해시 (geometry 제외)
      componentPropsHash,
      texts: [
        { nodeId, nodeName, path, value }
      ],
      componentProps: [
        { nodeId, nodeName, path, source, propName, propType, value }
      ]
    }
  }
}
```

### 해시 정책

| 필드 | 의미 | 변경 감지 대상 |
|---|---|---|
| `textHash` | 모든 TEXT 노드 문자열 정렬·연결 후 SHA256 | 카피 변경 |
| `propsHash` | `type + fills + effects`만 해시 | 시각 스타일 변경 (의도적으로 geometry 제외 → noise 감소) |
| `componentPropsHash` | component/variant property 전체 해시 | Figma component prop 변경 |
| `tokensHash` | `tokens.json` 파일 자체 해시 | 디자인 토큰 변경 |
| `boundingBox` | 별도 필드 (해시 안 함) | 5-3에서 직접 비교 → 레이아웃 변경 감지 |

### Leaf 개념

- `texts[]` = Figma 트리 안의 실제 TEXT leaf 목록. 예: Button 전체가 아니라 `Variant=Danger / Delete` 같은 말단 텍스트 단위
- `componentProps[]` = Figma component/variant property leaf 목록. 향후 `figma:prop` 마커 후보와 연결

---

## 검증 결과

| 검증 | 결과 |
|---|---|
| `npm run figma:snapshot` | exit 0 |
| `.automation/snapshots/{ts}.json` 생성 | ✅ |
| `npm run figma:test:snapshot` | exit 0 |
| `npm run build` | 통과 |
| `npm run lint` | 통과 |

### 실제 산출물

| 파일 | 크기 | 노드 수 | 비고 |
|---|---|---|---|
| `2026-04-30T05-08-32.json` | 9.6 KB | 21 | 초기 스냅샷 (texts/componentProps 추가 전) |
| `2026-04-30T06-54-11.json` | 300 KB | 21 | 5-4 선행 작업 후 (`texts[]`, `componentProps[]` 포함) |

**최신 snapshot 로그**:

```
INFO: Starting snapshot.ts — Figma node state capture
INFO: fileKey: SXPVingkmqkrcLzcXYFsZd
INFO: Fetching 21 nodes from Figma...
SUCCESS: Fetched 21 nodes
INFO: Tokens file hashed: /Users/juhee/Work/Test/design-test/tokens.json
INFO: Nodes captured: 21, missing from API: 0
SUCCESS: Snapshot written: .automation/snapshots/2026-04-30T06-54-11.json
```

---

## 검증 기준 (계약)

- ✅ snapshot JSON에 fileKey, 생성 시각, 대상 node 목록 포함
- ✅ `npm run figma:snapshot` exit 0
- ✅ `.automation/snapshots/{timestamp}.json` 파일 생성

---

## 5-2 → 5-3 결정사항 (이어지는 정의)

| 결정 항목 | 결정 |
|---|---|
| `lastModified` 활용 | 파일 수준 → diff에서 변경 트리거 신호로만, 실제 비교는 `textHash`/`propsHash` 우선 |
| `boundingBox` null | 노드 삭제/누락 → 별도 `structure` 분류 |
| `tokensHash` 변경 | 토큰 재생성 단계 트리거 조건 |
| 스냅샷 누적 전략 | 결정 필요: "최근 2개 비교" vs "baseline 비교" — `.automation/baseline/` 디렉토리 존재 |

---

## 5-4 진입 전 선행 작업 (스냅샷 스키마 확장)

5-2 완료 후 **5-4 마커 도입을 위한 사전 작업**으로 추가 산출:

| 산출물 | 라인 수 | 역할 |
|---|---|---|
| `scripts/pipeline/lib/snapshot-node.ts` (확장) | 233 | mapped node 내부 leaf `texts[]`, `componentProps[]`, `componentPropsHash` 저장 |
| `scripts/pipeline/lib/code-candidates.ts` (+ test) | 140 + 45 | TypeScript AST 기반 코드 literal 후보 추출 |
| `scripts/pipeline/marker-candidates.ts` | 220 | 최신 snapshot과 코드 후보를 매칭해 `.automation/reports/marker-candidates-{ts}.md` 생성 |
| `package.json` `figma:marker-candidates`, `figma:test:snapshot`, `figma:test:marker-candidates` 추가 | — | — |

**최신 marker-candidates 리포트** (`marker-candidates-2026-04-30T06-57-15.md`):

| Metric | Count |
|---|---:|
| Entries with text | 19 |
| Figma text leaves | 262 |
| Matched exactly | 80 |
| Ambiguous | 19 |
| Missing code candidate | 163 |

→ 자세한 처리 방향은 [phase5-4.md](./phase5-4.md) ⚠️ 결정사항 섹션 참조.

---

## 다음 단계로의 영향

| 다음 단계 | 5-2가 미친 영향 |
|---|---|
| 5-3 diff | snapshot JSON 구조가 diff 입력 형식. textHash/propsHash/boundingBox/componentPropsHash가 변경 분류 근거 |
| 5-3 classify | `texts[]` / `componentProps[]` leaf가 마커 ID 매칭 후보 |
| 5-4 apply (M1) | `tokensHash` 변경 → style-dictionary 재생성 트리거 |
