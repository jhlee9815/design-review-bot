import assert from 'node:assert/strict';
import { renderApplyReport } from './apply-report.ts';

const markdown = renderApplyReport({
  changeSetId: 'cs-test',
  classifiedPath: '/tmp/classified.json',
  status: 'noop',
  changedFiles: [],
  message: 'No marked changes found.',
  missingMarkers: [
    {
      kind: 'text',
      code: '../src/components/Button.tsx',
      nodeIds: ['14:11387'],
    },
    {
      kind: 'component-props',
      code: '../src/compositions/Header.tsx',
      nodeIds: ['18:11416'],
    },
  ],
});

assert.match(markdown, /## Manual Follow-up/);
assert.match(markdown, /No marker found/);
assert.match(markdown, /text/);
assert.match(markdown, /component-props/);
assert.match(markdown, /\.\.\/src\/components\/Button\.tsx/);
assert.match(markdown, /14:11387/);
