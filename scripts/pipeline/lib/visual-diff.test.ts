import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import {
  comparePngBuffers,
  collectScreenTargets,
  renderVisualDiffMarkdown,
} from './visual-diff.ts';
import type { FigmaMapping } from './config-loader.ts';

function pngBuffer(width: number, height: number, rgba: [number, number, number, number]): Buffer {
  const png = new PNG({ width, height });
  for (let index = 0; index < png.data.length; index += 4) {
    png.data[index] = rgba[0];
    png.data[index + 1] = rgba[1];
    png.data[index + 2] = rgba[2];
    png.data[index + 3] = rgba[3];
  }
  return PNG.sync.write(png);
}

const black = pngBuffer(2, 2, [0, 0, 0, 255]);
const white = pngBuffer(2, 2, [255, 255, 255, 255]);

const identical = comparePngBuffers(black, black, { threshold: 0.1 });
assert.equal(identical.changedPixels, 0);
assert.equal(identical.diffRatio, 0);
assert.equal(identical.passed, true);

const different = comparePngBuffers(black, white, { threshold: 0.1, maxDiffRatio: 0.5 });
assert.equal(different.changedPixels, 4);
assert.equal(different.diffRatio, 1);
assert.equal(different.passed, false);
assert.ok(different.diffPng.length > 0);

const mapping = {
  version: 2,
  project: { name: 'UNO HOME', figmaFileKey: 'file-1' },
  pathResolution: { base: 'config-dir' },
  tokens: {
    source: { file: '../../tokens.json' },
    output: { css: '../src/index.css' },
    automation: { apply: 'auto', classes: ['token'] },
  },
  components: {},
  compositions: {},
  screens: {
    splash: {
      figmaNodeId: '1:1',
      figmaNodeName: 'Splash',
      figmaNodePath: ['Page1'],
      code: '../src/screens/SplashScreen.tsx',
      targetType: 'screen',
      route: '/screens/splash',
      automation: { apply: 'report-only', allowedClasses: ['token'] },
    },
    home: {
      figmaNodeId: '1:2',
      figmaNodeName: 'Home',
      figmaNodePath: ['Page1'],
      code: '../src/screens/HomeScreen.tsx',
      targetType: 'screen',
      route: '/screens/home',
      automation: { apply: 'report-only', allowedClasses: ['token'] },
    },
  },
} satisfies FigmaMapping;

assert.deepEqual(collectScreenTargets(mapping), [
  { key: 'splash', route: '/screens/splash', fileName: 'splash.png' },
  { key: 'home', route: '/screens/home', fileName: 'home.png' },
]);

const markdown = renderVisualDiffMarkdown({
  changeSetId: 'cs-test',
  threshold: 0.5,
  results: [
    {
      key: 'home',
      route: '/screens/home',
      status: 'passed',
      diffRatio: 0.01,
      changedPixels: 1,
      totalPixels: 100,
      beforePath: 'before/home.png',
      afterPath: 'after/home.png',
      diffPath: 'diff/home.png',
    },
  ],
});

assert.match(markdown, /# Visual Diff Report/);
assert.match(markdown, /\| home \| `\/screens\/home` \| passed \| 1\.00% \| 1\/100 \|/);
