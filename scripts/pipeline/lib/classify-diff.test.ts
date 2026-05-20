import assert from 'node:assert/strict';
import { classifyDiff } from './classify-diff.ts';
import type { DiffFile } from './diff-snapshot.ts';
import type { FigmaMapping } from './config-loader.ts';

const diff: DiffFile = {
  stage: 'diff',
  generatedAt: '2026-05-04T12:00:00.000Z',
  fileKey: 'file-1',
  comparisonMode: 'baseline',
  baseTs: '2026-05-04T10:00:00.000Z',
  headTs: '2026-05-04T11:00:00.000Z',
  basePath: 'baseline.json',
  headPath: 'head.json',
  changes: [
    {
      key: 'tokens',
      nodeId: null,
      nodeName: 'tokens.json',
      classes: ['token'],
      reasons: ['tokensHash changed'],
      before: { tokensHash: 'sha256:a' },
      after: { tokensHash: 'sha256:b' },
    },
    {
      key: 'button',
      nodeId: '1:1',
      nodeName: 'Button',
      classes: ['text'],
      reasons: ['textHash changed'],
      before: {},
      after: {},
    },
    {
      key: 'home',
      nodeId: '2:1',
      nodeName: 'Home screen',
      classes: ['text'],
      reasons: ['textHash changed'],
      before: {},
      after: {},
    },
    {
      key: 'unknownThing',
      nodeId: '3:1',
      nodeName: 'Unknown',
      classes: ['text'],
      reasons: ['textHash changed'],
      before: {},
      after: {},
    },
    {
      key: 'button',
      nodeId: '1:1',
      nodeName: 'Button',
      classes: ['layout'],
      reasons: ['boundingBox changed'],
      before: {},
      after: {},
    },
  ],
};

const mapping = {
  version: 2,
  project: { name: 'UNO HOME', figmaFileKey: 'file-1' },
  pathResolution: { base: 'config-dir' },
  tokens: {
    source: { file: '../../tokens.json' },
    output: { css: '../src/index.css' },
    automation: { apply: 'auto', classes: ['token'] },
  },
  components: {
    button: {
      figmaNodeId: '1:1',
      figmaNodeName: 'Button',
      figmaNodePath: ['Design System'],
      code: '../src/components/Button.tsx',
      targetType: 'atomic-component',
      automation: { apply: 'auto', allowedClasses: ['token', 'text', 'component-props'] },
    },
  },
  compositions: {},
  screens: {
    home: {
      figmaNodeId: '2:1',
      figmaNodeName: 'Home screen',
      figmaNodePath: ['Page 1'],
      code: '../src/screens/HomeScreen.tsx',
      targetType: 'screen',
      route: '/screens/home',
      automation: { apply: 'report-only', allowedClasses: ['token', 'text', 'layout'] },
    },
  },
} satisfies FigmaMapping;

const classified = classifyDiff(diff, mapping);

assert.equal(classified.stage, 'classified');
assert.equal(classified.summary.total, 5);
assert.equal(classified.summary.autoApply, 2);
assert.equal(classified.summary.reportOnly, 3);
assert.equal(classified.summary.unknown, 1);

assert.equal(classified.changes[0].decision, 'auto-apply');
assert.equal(classified.changes[0].target.section, 'tokens');

assert.equal(classified.changes[1].decision, 'auto-apply');
assert.equal(classified.changes[1].target.section, 'components');

assert.equal(classified.changes[2].decision, 'report-only');
assert.match(classified.changes[2].decisionReasons[0], /report-only/);

assert.equal(classified.changes[3].decision, 'report-only');
assert.equal(classified.changes[3].classes[0], 'unknown');
assert.match(classified.changes[3].decisionReasons[0], /No mapping/);

assert.equal(classified.changes[4].decision, 'report-only');
assert.match(classified.changes[4].decisionReasons[0], /manual-only/);
