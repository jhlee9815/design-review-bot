import assert from 'node:assert/strict';
import { classifyDiff } from './classify-diff.ts';
import type { FigmaMapping } from './config-loader.ts';
import type { DiffFile } from './diff-snapshot.ts';
import { renderReportOnlyMarkdown } from './report-only-guidance.ts';

const diff = {
  stage: 'diff',
  generatedAt: '2026-05-06T12:00:00.000Z',
  fileKey: 'file-1',
  comparisonMode: 'baseline',
  baseTs: '2026-05-06T10:00:00.000Z',
  headTs: '2026-05-06T11:00:00.000Z',
  basePath: 'baseline.json',
  headPath: 'head.json',
  changes: [
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
      key: 'button',
      nodeId: '1:1',
      nodeName: 'Button',
      classes: ['layout'],
      reasons: ['boundingBox changed'],
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
  ],
} satisfies DiffFile;

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
const markdown = renderReportOnlyMarkdown(
  classified,
  classified.changes.filter(change => change.decision === 'report-only'),
  '2026-05-06T12:30:00.000Z'
);

assert.match(markdown, /Why blocked/);
assert.match(markdown, /Manual action/);

assert.match(markdown, /Screen policy/);
assert.match(markdown, /screens are intentionally report-only/);
assert.match(markdown, /Edit `\.\.\/src\/screens\/HomeScreen\.tsx` manually/);

assert.match(markdown, /Deferred class/);
assert.match(markdown, /layout/);
assert.match(markdown, /M4 layout automation is deferred/);

assert.match(markdown, /Unmapped target/);
assert.match(markdown, /Add this node to `config\/figma-mapping\.yaml`/);
