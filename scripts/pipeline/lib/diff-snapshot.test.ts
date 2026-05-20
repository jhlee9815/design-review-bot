import assert from 'node:assert/strict';
import { diffSnapshots, selectSnapshotPair } from './diff-snapshot.ts';
import type { SnapshotFile } from './diff-snapshot.ts';

const baseSnapshot: SnapshotFile = {
  fileKey: 'file-1',
  timestamp: '2026-05-04T10:00:00.000Z',
  source: 'figma-rest',
  tokensHash: 'sha256:tokens-a',
  nodes: {
    button: {
      id: '1:1',
      name: 'Button',
      lastModified: '2026-05-04T10:00:00.000Z',
      visible: true,
      boundingBox: { x: 0, y: 0, width: 100, height: 40 },
      textHash: 'sha256:text-a',
      propsHash: 'sha256:props-a',
      componentPropsHash: 'sha256:component-a',
      texts: [],
      componentProps: [],
    },
    removed: {
      id: '1:2',
      name: 'Removed',
      lastModified: '2026-05-04T10:00:00.000Z',
      visible: true,
      boundingBox: { x: 0, y: 0, width: 50, height: 50 },
      textHash: 'sha256:removed-text',
      propsHash: 'sha256:removed-props',
      componentPropsHash: 'sha256:removed-component',
      texts: [],
      componentProps: [],
    },
  },
};

const headSnapshot: SnapshotFile = {
  ...baseSnapshot,
  timestamp: '2026-05-04T11:00:00.000Z',
  tokensHash: 'sha256:tokens-b',
  nodes: {
    button: {
      ...baseSnapshot.nodes.button,
      textHash: 'sha256:text-b',
      boundingBox: { x: 0, y: 0, width: 112, height: 40 },
    },
    added: {
      id: '1:3',
      name: 'Added',
      lastModified: '2026-05-04T11:00:00.000Z',
      visible: true,
      boundingBox: { x: 0, y: 0, width: 50, height: 50 },
      textHash: 'sha256:added-text',
      propsHash: 'sha256:added-props',
      componentPropsHash: 'sha256:added-component',
      texts: [],
      componentProps: [],
    },
  },
};

const diff = diffSnapshots(baseSnapshot, headSnapshot, {
  comparisonMode: 'baseline',
  basePath: '.automation/baseline/approved.json',
  headPath: '.automation/snapshots/head.json',
});

assert.equal(diff.stage, 'diff');
assert.equal(diff.comparisonMode, 'baseline');
assert.equal(diff.baseTs, '2026-05-04T10:00:00.000Z');
assert.equal(diff.headTs, '2026-05-04T11:00:00.000Z');

const tokenChange = diff.changes.find(change => change.key === 'tokens');
assert.ok(tokenChange);
assert.deepEqual(tokenChange.classes, ['token']);

const buttonChange = diff.changes.find(change => change.key === 'button');
assert.ok(buttonChange);
assert.deepEqual(buttonChange.classes, ['text', 'layout']);
assert.equal(buttonChange.nodeId, '1:1');

const removedChange = diff.changes.find(change => change.key === 'removed');
assert.ok(removedChange);
assert.deepEqual(removedChange.classes, ['structure']);
assert.match(removedChange.reasons[0], /missing from head/);

const addedChange = diff.changes.find(change => change.key === 'added');
assert.ok(addedChange);
assert.deepEqual(addedChange.classes, ['structure']);
assert.match(addedChange.reasons[0], /missing from base/);

assert.equal(
  selectSnapshotPair(['2026-05-04T09-00-00.json'], []),
  null
);

assert.deepEqual(
  selectSnapshotPair(
    ['2026-05-04T09-00-00.json', '2026-05-04T10-00-00.json'],
    ['2026-05-04T08-00-00.json']
  ),
  {
    comparisonMode: 'baseline',
    baseFile: '2026-05-04T08-00-00.json',
    headFile: '2026-05-04T10-00-00.json',
  }
);

assert.deepEqual(
  selectSnapshotPair(['2026-05-04T09-00-00.json', '2026-05-04T10-00-00.json'], []),
  {
    comparisonMode: 'bootstrap-latest-two',
    baseFile: '2026-05-04T09-00-00.json',
    headFile: '2026-05-04T10-00-00.json',
  }
);
