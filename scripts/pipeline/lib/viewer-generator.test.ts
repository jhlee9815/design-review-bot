import assert from 'node:assert/strict';
import { buildViewerHtml, extractChangedNodeIds, viewerUrlFor } from './viewer-generator.ts';

const classified = {
  summary: { total: 2, autoApply: 0, reportOnly: 2, unknown: 0 },
  changes: [
    {
      key: 'pesse_home',
      nodeId: '7:3',
      nodeName: 'Pesse Home',
      classes: ['detached-style', 'new-frame'],
      reasons: ['1 new detached style(s)'],
      decision: 'report-only',
      decisionReasons: ['manual only'],
      target: { code: '../src/screens/PesseHomeScreen.tsx', section: 'screens' },
      subcategories: ['detached-style', 'new-frame'],
    },
    {
      key: 'pesse_cards',
      nodeId: '7:4',
      nodeName: 'Pesse Cards',
      classes: ['image-change'],
      reasons: ['1 image asset change(s)'],
      decision: 'report-only',
      decisionReasons: ['manual only'],
      target: { code: '../src/screens/PesseCardsScreen.tsx', section: 'screens' },
      subcategories: ['image-change'],
    },
  ],
};

assert.deepEqual(extractChangedNodeIds(classified), ['7:3', '7:4']);
assert.equal(
  viewerUrlFor('https://jhlee9815.github.io/uno-home', 'cs-test'),
  'https://jhlee9815.github.io/uno-home/cs/cs-test/'
);

const html = buildViewerHtml({
  csId: 'cs-test',
  fileKey: 'figma-file',
  issueUrl: 'https://github.com/jhlee9815/uno-home/issues/9',
  classified,
  imageRefs: {
    '7:3': { before: 'images/7-3-before.png', after: 'images/7-3-after.png' },
    '7:4': { before: null, after: 'images/7-4-after.png' },
  },
});

assert.match(html, /이전 \(Before\)/);
assert.match(html, /현재 \(After\)/);
assert.match(html, /designer-approved/);
assert.match(html, /designer-rejected/);
assert.match(html, /Pesse Home/);
// Category tags now render the Korean label instead of the raw class.
assert.match(html, /디자인 시스템 미사용/);
assert.match(html, /새 화면 추가/);
assert.match(html, /이미지 변경/);
assert.match(html, /Figma에서 열기/);
assert.match(html, /src\/screens\/PesseHomeScreen\.tsx/);
console.log('viewer-generator PASS');
