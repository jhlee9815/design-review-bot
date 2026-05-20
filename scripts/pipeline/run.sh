#!/bin/bash
# UNO HOME Figma → Code Pipeline Runner
# 매일 21:00 launchd가 이 스크립트 호출

set -e  # 한 단계 실패 시 즉시 중단

cd "$(dirname "$0")/../.."  # uno-home/ 로 이동

echo "[1/8] preflight..."
npx tsx --env-file=.env scripts/pipeline/preflight.ts

# [2/8] snapshot...
echo "[2/8] snapshot..."
npx tsx --env-file=.env scripts/pipeline/snapshot.ts

# [3/8] diff...
echo "[3/8] diff..."
npx tsx --env-file=.env scripts/pipeline/diff.ts

# [4/8] classify...
echo "[4/8] classify..."
npx tsx --env-file=.env scripts/pipeline/classify.ts

# [5/8] apply-to-code...
echo "[5/8] apply-to-code..."
npx tsx --env-file=.env scripts/pipeline/apply.ts

# [6/8] verify...
echo "[6/8] verify..."
npx tsx --env-file=.env scripts/pipeline/verify.ts

# [7/8] designer-review...
echo "[7/8] designer-review..."
npx tsx --env-file=.env scripts/pipeline/report.ts

# [8/8] promote-to-dev...
echo "[8/8] promote-to-dev..."
npx tsx --env-file=.env scripts/pipeline/promote-dev.ts

echo "✅ Pipeline complete"
