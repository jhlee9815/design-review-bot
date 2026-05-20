# Phase 5-0 — 파이프라인 계약 확정

## 상태

✅ **완료**

## 목표

이후 5-1~5-8 단계에서 따를 자동화 파이프라인의 계약(분류 체계·자동 반영 정책·매핑 스키마)을 사전 확정.

## 담당 에이전트

`architect` (Opus)

---

## 작업 정의 / 산출물

| 산출물 | 위치 | 역할 |
|---|---|---|
| 파이프라인 계약 문서 | `uno-home/docs/design-automation-pipeline.md` | 변경 분류, 자동 반영 정책, 검증/승인/dev 반영 흐름 |
| Figma 파일 설정 | `uno-home/config/figma.yaml` | `fileKey`, `fileUrl`, `automation.stages` (8단계 선언) |
| Figma ↔ 코드 매핑 | `uno-home/config/figma-mapping.yaml` | 21 항목, 하이브리드(`figmaNodeId` + `figmaNodeName` + `figmaNodePath`) 스키마 |

---

## 핵심 결정 사항

### 변경 분류 7종

| 분류 | 의미 | 자동 반영 가능성 |
|---|---|---|
| `token` | 디자인 토큰 (color/spacing/typography) | ✅ M1 |
| `text` | 코드 내 string literal | ✅ M2 (마커 필요) |
| `component-props` | JSX 속성 값 | ✅ M3 (마커 필요) |
| `asset` | 이미지/아이콘 | ⚠️ report-only |
| `layout` | bounding box / flex 변경 | ⚠️ report-only (M4 보류) |
| `structure` | 노드 추가/삭제 | ❌ 수동 |
| `unknown` | 매핑되지 않음 | ❌ 자동 반영 금지 |

### 매핑 스키마

```yaml
button:
  figmaNodeId: "14:11402"               # primary lookup
  figmaNodeName: "Button"               # ID 미스 시 fallback
  figmaNodePath: ["Design System"]      # 동명 충돌 tiebreaker
  code: ../src/components/Button.tsx
  targetType: atomic-component
  automation:
    apply: auto                         # auto | report-only
    allowedClasses:                     # 허용된 변경 분류
      - token
      - text
      - component-props
```

### 파이프라인 8단계 (figma.yaml `automation.stages`)

```
preflight → snapshot → diff → classify → apply-to-code → verify → designer-review → promote-to-dev
```

### 게이트 정책

- `unknown` 또는 매핑되지 않은 code-impacting 변경은 코드 자동 반영 금지
- 빌드/린트/스크린샷 검증 통과 전에는 디자이너 리뷰로 넘기지 않음
- 디자이너 승인 기록 없이는 dev 반영 금지

---

## 검증 결과

- ✅ `figma.yaml`, `figma-mapping.yaml` YAML 파싱 정상 (5-1 preflight에서 cross-check 완료)
- ✅ stage 순서 일치 — preflight 로그에서 `stages: preflight, snapshot, diff, classify, apply-to-code, verify, designer-review, promote-to-dev` 출력 확인
- ✅ `figma-mapping.yaml`은 `pathResolution.base: config-dir` 사용
- ✅ `../../tokens.json`, `../src/index.css`, 모든 `../src/...` 매핑 경로 실제 파일 존재 확인 완료 (5-1)

---

## 다음 단계로의 영향

| 다음 단계 | 5-0이 미친 영향 |
|---|---|
| 5-1 preflight | `figma.yaml`, `figma-mapping.yaml` 검증 대상으로 사용 |
| 5-1.5 bind | 하이브리드 스키마(`figmaNodeId/Name/Path`) 적용 대상 |
| 5-3 classify | 7가지 분류 체계 그대로 사용 |
| 5-4 apply | `automation.apply` (auto/report-only) + `allowedClasses`로 적용 여부 결정 |
| 5-6 designer-review | "디자이너 승인 없이는 dev 반영 금지" 정책 → 3중 게이트 설계 근거 |
