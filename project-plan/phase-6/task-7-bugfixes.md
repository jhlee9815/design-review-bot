# Task 6-7 — Bug Fixes (Codex 발견)

> **목표**: Codex consult 시 발견된 코드 결함 수정 + extraction-friendly env var 도입
> **예상 시간**: 30분
> **선행**: 없음
> **블록 해제**: 없음

## 6-7-A. `promote-dev.ts` 스모크 키 불일치

**증상**: `scripts/pipeline/promote-dev.ts:25-26`에 스모크 테스트 키가 `home`, `family`로 하드코딩되어 있으나, 현재 활성 mapping (Pesse Apple Demo)의 키는 `pesse_home`, `pesse_cards`, `pesse_send`. 결과적으로 promote 단계의 스모크 검증이 의도된 화면을 안 거침.

**검증**:

```bash
grep -n "home\|family" scripts/pipeline/promote-dev.ts | head -10
grep -n "^[a-z_]*:" config/figma-mapping.yaml | head -10
# 두 출력 비교 시 키 불일치 확인
```

**수정 방안 — env var로 추출 (extraction-friendly)**:

```typescript
// 기존 (대략 line 25-26)
const SMOKE_KEYS = ['home', 'family'];

// 변경
const SMOKE_KEYS = (process.env.FIGMA_SMOKE_KEYS ?? 'pesse_home,pesse_cards,pesse_send')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
```

`.env`에 추가:
```
FIGMA_SMOKE_KEYS=pesse_home,pesse_cards,pesse_send
```

GitHub Actions에서:
```yaml
env:
  FIGMA_SMOKE_KEYS: ${{ vars.FIGMA_SMOKE_KEYS }}
```

## 6-7-B. `promote-dev.ts` 포트 4174 하드코딩

**증상**: 동일 파일에 포트 4174 하드코딩. 다른 프로젝트에서 충돌 가능.

**수정**:
```typescript
const PROMOTE_PORT = Number(process.env.FIGMA_PROMOTE_PORT ?? 4174);
```

## 6-7-C. `verify.ts` 포트 4173 + viewport 하드코딩

**위치**: `scripts/pipeline/verify.ts:191, 223`

**수정**:
```typescript
const PREVIEW_PORT = Number(process.env.FIGMA_VERIFY_PORT ?? 4173);
const VIEWPORT_WIDTH = Number(process.env.FIGMA_VERIFY_VIEWPORT_WIDTH ?? 390);
const VIEWPORT_HEIGHT = Number(process.env.FIGMA_VERIFY_VIEWPORT_HEIGHT ?? 844);
```

## 6-7-D. `verify.ts` build/lint 명령 하드코딩

**위치**: `scripts/pipeline/verify.ts:43`

**수정**:
```typescript
const BUILD_CMD = process.env.FIGMA_VERIFY_BUILD_CMD ?? 'npm run build';
const LINT_CMD = process.env.FIGMA_VERIFY_LINT_CMD ?? 'npm run lint';
```

## 6-7-E. `config-loader.ts` 상대경로 + fileKey

**위치**: `scripts/pipeline/lib/config-loader.ts:13`

**수정**:
```typescript
const CONFIG_DIR = process.env.FIGMA_CONFIG_DIR
  ?? path.resolve(__dirname, '../../../config');

// fileKey 우선순위: env > yaml
const fileKey = process.env.FIGMA_FILE_KEY ?? config.figma.fileKey;
```

## 작업 절차

```bash
# 1. 각 파일 수정 (위 5개 변경)
# 2. local 테스트
npm run figma:preflight
npm run figma:run
# 모두 success여야 함 (기본값으로 fallback 동작 확인)

# 3. env var 적용 테스트
FIGMA_VERIFY_BUILD_CMD="npm run build" \
FIGMA_SMOKE_KEYS="pesse_home,pesse_cards,pesse_send" \
npm run figma:run
# 명시적 env로도 동작 확인

# 4. 커밋
git add scripts/pipeline/promote-dev.ts scripts/pipeline/verify.ts scripts/pipeline/lib/config-loader.ts
git commit -m "fix: smoke key mismatch + env var overrides for ports/cmds/config-dir

- promote-dev.ts: SMOKE_KEYS now reads FIGMA_SMOKE_KEYS env var (default matches active Pesse mapping)
- promote-dev.ts: port via FIGMA_PROMOTE_PORT
- verify.ts: port/viewport/build/lint cmds via env vars
- config-loader.ts: FIGMA_CONFIG_DIR + FIGMA_FILE_KEY env overrides

Discovered by Codex consult 019e4407-9f23 (Phase 6 prep)"
git push
```

## 검증

```bash
# 1. 기본값으로 동작 (모든 env 미설정)
unset FIGMA_SMOKE_KEYS FIGMA_PROMOTE_PORT FIGMA_VERIFY_PORT FIGMA_VERIFY_BUILD_CMD FIGMA_CONFIG_DIR FIGMA_FILE_KEY
npm run figma:run
# 기존과 동일하게 PASS

# 2. env var override로 동작
FIGMA_FILE_KEY=9cevQvPHlQ5vZv5Pz3QaLL FIGMA_VERIFY_PORT=4175 npm run figma:run
# 다른 포트로도 PASS
```

## 함정

- **후방 호환성**: 모든 env var는 미설정 시 기존 값 그대로 fallback. 깨지면 안 됨.
- **`config-loader.ts` 호출자가 여러 곳**: 변경 시 전체 grep 후 영향 확인.
- **commit 메시지에 Codex 세션 명시**: 추적성을 위해 `019e4407-9f23` 같은 식별자 포함.

## 영향 범위

이 task의 5개 수정 = Codex의 9가지 차단점 중 ①, ③, ⑤, ⑦ 해소.
나머지 ②(매핑), ④(마커), ⑥(viewport는 ⑤로 같이), ⑧(plist 안 씀), ⑨(package.json)은 Phase 7로.

## 6-7-F. (task-2 작업 중 발견) GitHub Actions Node 20 deprecation

**증상**: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4` 가 Node.js 20 기반으로 동작. 2026-06-02부터 GitHub이 Node 24로 강제 전환 예정. 2026-09-16에 Node 20 제거.

**대응 옵션**:
- 즉시 fix (권장): action 버전을 최신으로 — `@v4` 그대로 두되 GitHub이 자동으로 Node 24 빌드를 publish하면 자동 적용됨. 별도 변경 불필요. (GitHub blog 2025-09-19 안내)
- 보수적: workflow에 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` env 추가 — 강제 Node 24 활성화
- 최소: 이번 Phase 6 동안은 warning만, June 이후 동작 확인 후 패치

이 task-7에서는 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`를 workflow `env`에 추가해 미리 검증.

```yaml
# .github/workflows/figma-pipeline.yml의 job env에 추가
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'
  # ... 기존 env vars
```

**검증**: workflow 재실행 시 deprecation warning 사라지고 Node 24로 동작.
