import assert from 'node:assert/strict';
import { extractCodeTextCandidates, matchFigmaTextsToCode } from './code-candidates.ts';
import type { SnapshotTextLeaf } from './snapshot-node.ts';

const source = `
export function Example({ label = 'Button' }) {
  return (
    <section>
      <h1>Family Management</h1>
      <Button label="Create" title={'Create Group'} />
      <Input placeholder="Group name" />
    </section>
  )
}
`;

const candidates = extractCodeTextCandidates(source, 'src/Example.tsx');

assert(candidates.some(candidate => candidate.value === 'Family Management'));
assert(candidates.some(candidate => candidate.value === 'Create'));
assert(candidates.some(candidate => candidate.value === 'Create Group'));
assert(candidates.some(candidate => candidate.value === 'Group name'));
assert(candidates.some(candidate => candidate.value === 'Button'));

const figmaTexts: SnapshotTextLeaf[] = [
  {
    nodeId: '1:1',
    nodeName: 'Create',
    path: ['Button', 'Create'],
    value: 'Create',
  },
  {
    nodeId: '1:2',
    nodeName: 'Missing',
    path: ['Button', 'Missing'],
    value: 'Missing',
  },
];

const matches = matchFigmaTextsToCode(figmaTexts, candidates);

assert.equal(matches[0].status, 'matched');
assert.equal(matches[0].codeCandidates.length, 1);
assert.equal(matches[1].status, 'missing-code-candidate');
assert.equal(matches[1].codeCandidates.length, 0);
