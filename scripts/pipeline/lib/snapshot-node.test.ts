import assert from 'node:assert/strict';
import {
  buildSnapshotNodeEntry,
  collectComponentPropLeaves,
  collectTextLeaves,
} from './snapshot-node.ts';

const sampleNode = {
  id: '1:1',
  name: 'Button',
  type: 'COMPONENT',
  visible: true,
  absoluteBoundingBox: { x: 10, y: 20, width: 100, height: 44 },
  componentPropertyDefinitions: {
    Variant: { type: 'VARIANT', defaultValue: 'Primary' },
  },
  children: [
    {
      id: '1:2',
      name: 'Label',
      type: 'TEXT',
      characters: 'Confirm',
    },
    {
      id: '1:3',
      name: 'Icon instance',
      type: 'INSTANCE',
      componentProperties: {
        Size: { type: 'VARIANT', value: 'lg' },
        Disabled: { type: 'BOOLEAN', value: false },
      },
      variantProperties: {
        State: 'Default',
      },
    },
  ],
} as const;

assert.deepEqual(collectTextLeaves(sampleNode), [
  {
    nodeId: '1:2',
    nodeName: 'Label',
    path: ['Button', 'Label'],
    value: 'Confirm',
  },
]);

assert.deepEqual(collectComponentPropLeaves(sampleNode), [
  {
    nodeId: '1:1',
    nodeName: 'Button',
    path: ['Button'],
    source: 'componentPropertyDefinitions',
    propName: 'Variant',
    propType: 'VARIANT',
    value: 'Primary',
  },
  {
    nodeId: '1:3',
    nodeName: 'Icon instance',
    path: ['Button', 'Icon instance'],
    source: 'componentProperties',
    propName: 'Disabled',
    propType: 'BOOLEAN',
    value: false,
  },
  {
    nodeId: '1:3',
    nodeName: 'Icon instance',
    path: ['Button', 'Icon instance'],
    source: 'componentProperties',
    propName: 'Size',
    propType: 'VARIANT',
    value: 'lg',
  },
  {
    nodeId: '1:3',
    nodeName: 'Icon instance',
    path: ['Button', 'Icon instance'],
    source: 'variantProperties',
    propName: 'State',
    propType: 'VARIANT',
    value: 'Default',
  },
]);

const entry = buildSnapshotNodeEntry(sampleNode, '2026-04-30T00:00:00.000Z');
assert.equal(entry.id, '1:1');
assert.equal(entry.texts.length, 1);
assert.equal(entry.componentProps.length, 4);
assert.match(entry.textHash, /^sha256:/);
assert.match(entry.componentPropsHash, /^sha256:/);
