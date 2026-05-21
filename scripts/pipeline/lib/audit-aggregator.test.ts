import assert from 'node:assert/strict';
import {
  aggregateDetachedStyles,
  findUnregisteredTopLevelFrames,
  buildAuditReport,
  renderAuditMarkdown,
  type TopLevelFrameRef,
} from './audit-aggregator.ts';
import type { DetachedStyleEntry } from './compliance-types.ts';
import type { SnapshotNodeEntry } from './snapshot-node.ts';
import type { FigmaMapping } from './config-loader.ts';

// ──────────────────────────────────────────────────────────────────────────────
// aggregateDetachedStyles
// ──────────────────────────────────────────────────────────────────────────────

{
  // empty list → zero totals
  const summary = aggregateDetachedStyles([]);
  assert.equal(summary.total, 0);
  assert.deepEqual(summary.byKind, { color: 0, typography: 0, effect: 0 });
  assert.deepEqual(summary.byProperty, {});
  assert.deepEqual(summary.topNodes, []);
}

{
  // mixed list → grouped counts + topNodes
  const entries: DetachedStyleEntry[] = [
    {
      nodeId: 'a:1', nodeName: 'A', nodePath: ['root', 'A'],
      kind: 'color', property: 'fill', rawValue: '#fff',
      suggestedToken: null,
      evidence: { hasNodeBoundVariables: false, styleId: null },
    },
    {
      nodeId: 'a:1', nodeName: 'A', nodePath: ['root', 'A'],
      kind: 'color', property: 'stroke', rawValue: '#000',
      suggestedToken: null,
      evidence: { hasNodeBoundVariables: false, styleId: null },
    },
    {
      nodeId: 'b:1', nodeName: 'B', nodePath: ['root', 'B'],
      kind: 'typography', property: 'fontFamily', rawValue: 'Inter',
      suggestedToken: null,
      evidence: { hasNodeBoundVariables: false, styleId: null },
    },
  ];
  const summary = aggregateDetachedStyles(entries);
  assert.equal(summary.total, 3);
  assert.equal(summary.byKind.color, 2);
  assert.equal(summary.byKind.typography, 1);
  assert.equal(summary.byProperty.fill, 1);
  assert.equal(summary.byProperty.stroke, 1);
  assert.equal(summary.byProperty.fontFamily, 1);
  // topNodes ordered by count desc
  assert.equal(summary.topNodes[0].nodeId, 'a:1');
  assert.equal(summary.topNodes[0].count, 2);
}

// ──────────────────────────────────────────────────────────────────────────────
// findUnregisteredTopLevelFrames
// ──────────────────────────────────────────────────────────────────────────────

{
  const pageFrames: TopLevelFrameRef[] = [
    { id: '2:2', name: 'Apple-inspired DS' },
    { id: '7:2', name: 'Pesse 3 screens' },
    { id: '35:244', name: 'test1' },
    { id: '35:382', name: 'test2' },
    { id: '22:129', name: 'Icon' },
  ];
  const mapping: FigmaMapping = makeMappingWithRegisteredIds(['2:2', '7:2']);
  const unregistered = findUnregisteredTopLevelFrames(pageFrames, mapping);
  const unregisteredIds = unregistered.map(f => f.nodeId).sort();
  assert.deepEqual(unregisteredIds, ['22:129', '35:244', '35:382']);
}

{
  // audit.excludeNodeIds excludes Icon library even if unregistered
  const pageFrames: TopLevelFrameRef[] = [
    { id: '2:2', name: 'Apple-inspired DS' },
    { id: '22:129', name: 'Icon' },
    { id: '35:244', name: 'test1' },
  ];
  const mapping: FigmaMapping = {
    ...makeMappingWithRegisteredIds(['2:2']),
    audit: { excludeNodeIds: ['22:129'] },
  };
  const unregistered = findUnregisteredTopLevelFrames(pageFrames, mapping);
  const unregisteredIds = unregistered.map(f => f.nodeId).sort();
  assert.deepEqual(unregisteredIds, ['35:244']);
}

{
  // empty registered → all unregistered
  const pageFrames: TopLevelFrameRef[] = [{ id: 'x:1', name: 'X' }];
  const mapping: FigmaMapping = makeMappingWithRegisteredIds([]);
  const unregistered = findUnregisteredTopLevelFrames(pageFrames, mapping);
  assert.equal(unregistered.length, 1);
}

// ──────────────────────────────────────────────────────────────────────────────
// buildAuditReport + renderAuditMarkdown integration
// ──────────────────────────────────────────────────────────────────────────────

{
  const snapshotNodes: Record<string, SnapshotNodeEntry> = {
    pesse_home: makeSnapshotNode('7:3', 'Home', 5, 3, 1),
    pesse_send: makeSnapshotNode('7:5', 'Send', 2, 0, 0),
  };
  const mapping = makeMappingWithRegisteredIds(['7:3', '7:5']);
  const topLevelFrames: TopLevelFrameRef[] = [
    { id: '7:3', name: 'Home' },
    { id: '7:5', name: 'Send' },
    { id: '99:1', name: 'Stray frame' },
  ];

  const report = buildAuditReport({
    fileKey: 'file-key',
    snapshotNodes,
    mapping,
    topLevelFrames,
    generatedAt: '2026-05-21T13:00:00Z',
  });

  assert.equal(report.totalDetachedStyles, 7);
  assert.equal(report.totalUnregisteredTopLevelFrames, 1);
  assert.equal(report.byRegisteredRoot.length, 2);
  assert.equal(report.hasViolations, true);
  assert.equal(report.unregisteredTopLevelFrames[0].name, 'Stray frame');
  assert.deepEqual(report.skippedRoots, []);

  // no violations case
  const cleanReport = buildAuditReport({
    fileKey: 'file-key',
    snapshotNodes: { x: makeSnapshotNode('1:1', 'X', 0, 0, 0) },
    mapping: makeMappingWithRegisteredIds(['1:1']),
    topLevelFrames: [{ id: '1:1', name: 'X' }],
    generatedAt: '2026-05-21T13:00:00Z',
  });
  assert.equal(cleanReport.hasViolations, false);

  // markdown render smoke
  const md = renderAuditMarkdown(report);
  assert.ok(md.includes('Audit Report'));
  assert.ok(md.includes('Stray frame'));
  assert.ok(md.includes('Home'));
}

{
  // automation.audit: skip excludes the entry from the report total
  const snapshotNodes: Record<string, SnapshotNodeEntry> = {
    pesse_home: makeSnapshotNode('7:3', 'Home', 5, 0, 0),
    ds_preview: makeSnapshotNode('2:2', 'DS Preview', 50, 0, 0),
  };
  const mapping = makeMappingWithRegisteredIds(['7:3', '2:2']);
  // mark ds_preview as skip
  mapping.screens['key_2_2'].automation.audit = 'skip';
  // rename screens to match keys we pass in snapshotNodes
  mapping.screens.pesse_home = mapping.screens.key_7_3;
  delete mapping.screens.key_7_3;
  mapping.screens.ds_preview = mapping.screens.key_2_2;
  delete mapping.screens.key_2_2;

  const report = buildAuditReport({
    fileKey: 'file-key',
    snapshotNodes,
    mapping,
    topLevelFrames: [],
    generatedAt: '2026-05-21T13:30:00Z',
  });

  assert.equal(report.totalDetachedStyles, 5, 'should exclude DS preview from total');
  assert.equal(report.byRegisteredRoot.length, 1);
  assert.equal(report.byRegisteredRoot[0].key, 'pesse_home');
  assert.equal(report.skippedRoots.length, 1);
  assert.equal(report.skippedRoots[0].key, 'ds_preview');
  assert.equal(report.skippedRoots[0].skippedDetachedStyles, 50);
  const md = renderAuditMarkdown(report);
  assert.ok(md.includes('Skipped roots'), 'markdown should mention skipped roots');
}

console.log('audit-aggregator tests passed');

// ──────────────────────────────────────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────────────────────────────────────

function makeSnapshotNode(
  id: string,
  name: string,
  detachedCount: number,
  descendantFrameCount: number,
  assetRefCount: number
): SnapshotNodeEntry {
  const detachedStyles: DetachedStyleEntry[] = Array.from({ length: detachedCount }, (_, i) => ({
    nodeId: `${id}-child${i}`,
    nodeName: `child${i}`,
    nodePath: [name, `child${i}`],
    kind: i % 2 === 0 ? 'color' : 'typography',
    property: i % 2 === 0 ? 'fill' : 'fontFamily',
    rawValue: i,
    suggestedToken: null,
    evidence: { hasNodeBoundVariables: false, styleId: null },
  }));
  return {
    id,
    name,
    lastModified: '2026-05-21T07:43:40Z',
    visible: true,
    boundingBox: { x: 0, y: 0, width: 100, height: 100 },
    textHash: 'sha256:t',
    propsHash: 'sha256:p',
    componentPropsHash: 'sha256:c',
    texts: [],
    componentProps: [],
    detachedStyles,
    descendantFrames: Array.from({ length: descendantFrameCount }, (_, i) => ({
      nodeId: `${id}-f${i}`,
      nodeName: `f${i}`,
      nodePath: [name, `f${i}`],
      name: `f${i}`,
      parentRegisteredKey: id,
    })),
    assetRefs: Array.from({ length: assetRefCount }, (_, i) => ({
      nodeId: `${id}-img${i}`,
      nodeName: `img${i}`,
      nodePath: [name, `img${i}`],
      kind: 'image',
      paintIndex: 0,
      ref: `ref-${i}`,
    })),
  };
}

function makeMappingWithRegisteredIds(ids: string[]): FigmaMapping {
  const screens: Record<string, FigmaMapping['screens'][string]> = {};
  for (const id of ids) {
    screens[`key_${id.replace(/:/g, '_')}`] = {
      figmaNodeId: id,
      figmaNodeName: `Name-${id}`,
      figmaNodePath: null,
      code: '../src/x.ts',
      targetType: 'screen',
      automation: { apply: 'report-only', allowedClasses: [] },
    };
  }
  return {
    version: 2,
    project: { name: 'Test', figmaFileKey: 'file-key' },
    pathResolution: { base: 'config-dir' },
    tokens: { source: { file: '../tokens.json' }, output: { css: '../src/index.css' }, automation: { classes: [], apply: 'report-only' } },
    components: {},
    compositions: {},
    screens,
  };
}
