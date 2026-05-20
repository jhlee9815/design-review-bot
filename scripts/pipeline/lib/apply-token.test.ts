import assert from 'node:assert/strict';
import { shouldApplyTokens } from './apply-token.ts';
import type { ClassifiedDiffFile } from './classify-diff.ts';

const base = {
  stage: 'classified',
  sourceStage: 'diff',
  generatedAt: '2026-05-04T12:00:00.000Z',
  fileKey: 'file-1',
  comparisonMode: 'baseline',
  baseTs: '2026-05-04T10:00:00.000Z',
  headTs: '2026-05-04T11:00:00.000Z',
  basePath: 'baseline.json',
  headPath: 'head.json',
  summary: {
    total: 0,
    autoApply: 0,
    reportOnly: 0,
    unknown: 0,
  },
  changes: [],
} satisfies ClassifiedDiffFile;

assert.equal(shouldApplyTokens(base), false);

assert.equal(
  shouldApplyTokens({
    ...base,
    changes: [
      {
        key: 'tokens',
        nodeId: null,
        nodeName: 'tokens.json',
        classes: ['token'],
        reasons: ['tokensHash changed'],
        before: {},
        after: {},
        decision: 'auto-apply',
        decisionReasons: ['Mapped target allows all changed classes'],
        target: {
          section: 'tokens',
          apply: 'auto',
          allowedClasses: ['token'],
          code: '../src/index.css',
          targetType: 'tokens',
        },
      },
    ],
  }),
  true
);

assert.equal(
  shouldApplyTokens({
    ...base,
    changes: [
      {
        key: 'tokens',
        nodeId: null,
        nodeName: 'tokens.json',
        classes: ['token'],
        reasons: ['tokensHash changed'],
        before: {},
        after: {},
        decision: 'report-only',
        decisionReasons: ['blocked'],
        target: {
          section: 'tokens',
          apply: 'report-only',
          allowedClasses: ['token'],
          code: '../src/index.css',
          targetType: 'tokens',
        },
      },
    ],
  }),
  false
);
