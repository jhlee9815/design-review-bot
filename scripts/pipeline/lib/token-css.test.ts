import assert from 'node:assert/strict';
import {
  generateThemeBlock,
  replaceThemeBlock,
  resolveTokenValue,
} from './token-css.ts';

const tokens = {
  primitives: {
    base: {
      white: { $value: '#FFFFFF', $type: 'color' },
    },
    neutral: {
      '50': { $value: '#FAFAFA', $type: 'color' },
    },
  },
  spacing: {
    '4': { $value: '4px', $type: 'spacing' },
  },
  radius: {
    sm: { $value: '8px', $type: 'borderRadius' },
  },
  shadow: {
    card: { $value: '0 2px 8px rgba(0,0,0,0.08)', $type: 'shadow' },
  },
  typography: {
    'font-family': {
      base: { $value: 'Noto Sans KR, sans-serif', $type: 'fontFamily' },
    },
  },
  component: {
    button: {
      'border-radius': { $value: '{radius.sm}', $type: 'borderRadius' },
    },
  },
};

assert.equal(resolveTokenValue('{radius.sm}', tokens), '8px');

const themeBlock = generateThemeBlock(tokens);
assert.match(themeBlock, /@theme \{/);
assert.match(themeBlock, /--color-base-white: #FFFFFF;/);
assert.match(themeBlock, /--spacing-4: 4px;/);
assert.match(themeBlock, /--radius-sm: 8px;/);
assert.match(themeBlock, /--shadow-card: 0 2px 8px rgba\(0,0,0,0.08\);/);
assert.match(themeBlock, /--font-sans: "Noto Sans KR", sans-serif;/);
assert.match(themeBlock, /--component-button-border-radius: 8px;/);

const originalCss = [
  '@import "tailwindcss";',
  '',
  '@theme {',
  '  --old-token: red;',
  '}',
  '',
  ':root {',
  '  --outside: keep;',
  '}',
  '',
].join('\n');

const replaced = replaceThemeBlock(originalCss, themeBlock);
assert.ok(!replaced.includes('--old-token'));
assert.ok(replaced.includes('--outside: keep;'));
assert.ok(replaced.startsWith('@import "tailwindcss";'));
