type TokenTree = Record<string, unknown>;

interface TokenLeaf {
  $value: unknown;
  $type?: string;
}

interface CssToken {
  name: string;
  value: string;
}

const THEME_BLOCK_RE = /@theme\s*\{[\s\S]*?\n\}/;

export function generateThemeBlock(tokens: TokenTree): string {
  const cssTokens = [
    ...collectPrimitiveColors(tokens),
    ...collectNamedSection(tokens, 'spacing', '--spacing'),
    ...collectNamedSection(tokens, 'radius', '--radius'),
    ...collectFontTokens(tokens),
    ...collectNamedSection(tokens, 'shadow', '--shadow'),
    ...collectComponentTokens(tokens),
  ];

  const lines = ['@theme {'];
  for (const token of cssTokens) {
    lines.push(`  ${token.name}: ${token.value};`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function replaceThemeBlock(css: string, themeBlock: string): string {
  if (!THEME_BLOCK_RE.test(css)) {
    throw new Error('Unable to find @theme block in CSS');
  }
  return css.replace(THEME_BLOCK_RE, themeBlock);
}

export function resolveTokenValue(value: unknown, tokens: TokenTree): string {
  if (typeof value !== 'string') {
    return String(value);
  }

  const refMatch = value.match(/^\{(.+)\}$/);
  if (!refMatch) {
    return normalizeCssValue(value);
  }

  const leaf = getTokenLeaf(tokens, refMatch[1].split('.'));
  if (!leaf) {
    throw new Error(`Token reference not found: ${value}`);
  }

  return resolveTokenValue(leaf.$value, tokens);
}

function collectPrimitiveColors(tokens: TokenTree): CssToken[] {
  const primitives = getObject(tokens.primitives);
  const result: CssToken[] = [];

  for (const [groupName, groupValue] of sortedEntries(primitives)) {
    const group = getObject(groupValue);
    for (const [tokenName, tokenValue] of sortedEntries(group)) {
      const leaf = asLeaf(tokenValue);
      if (!leaf || leaf.$type !== 'color') {
        continue;
      }
      result.push({
        name: `--color-${kebab(groupName)}-${kebab(tokenName)}`,
        value: resolveTokenValue(leaf.$value, tokens),
      });
    }
  }

  return result;
}

function collectNamedSection(tokens: TokenTree, sectionName: string, cssPrefix: string): CssToken[] {
  const section = getObject(tokens[sectionName]);
  const result: CssToken[] = [];

  for (const [tokenName, tokenValue] of sortedEntries(section)) {
    const leaf = asLeaf(tokenValue);
    if (!leaf) {
      continue;
    }
    result.push({
      name: `${cssPrefix}-${kebab(tokenName)}`,
      value: resolveTokenValue(leaf.$value, tokens),
    });
  }

  return result;
}

function collectFontTokens(tokens: TokenTree): CssToken[] {
  const typography = getObject(tokens.typography);
  const fontFamily = getObject(typography['font-family']);
  const base = asLeaf(fontFamily.base);
  if (!base) {
    return [];
  }

  return [
    {
      name: '--font-sans',
      value: normalizeFontValue(resolveTokenValue(base.$value, tokens)),
    },
  ];
}

function collectComponentTokens(tokens: TokenTree): CssToken[] {
  const component = getObject(tokens.component);
  const result: CssToken[] = [];

  function visit(value: unknown, path: string[]): void {
    const leaf = asLeaf(value);
    if (leaf) {
      result.push({
        name: `--component-${path.map(kebab).join('-')}`,
        value: resolveTokenValue(leaf.$value, tokens),
      });
      return;
    }

    for (const [key, child] of sortedEntries(getObject(value))) {
      visit(child, [...path, key]);
    }
  }

  for (const [key, child] of sortedEntries(component)) {
    visit(child, [key]);
  }

  return result;
}

function getTokenLeaf(tokens: TokenTree, path: string[]): TokenLeaf | null {
  let current: unknown = tokens;
  for (const part of path) {
    current = getObject(current)[part];
  }
  return asLeaf(current);
}

function asLeaf(value: unknown): TokenLeaf | null {
  if (!isObject(value) || !('$value' in value)) {
    return null;
  }
  return value as unknown as TokenLeaf;
}

function getObject(value: unknown): TokenTree {
  return isObject(value) ? (value as TokenTree) : {};
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sortedEntries(value: TokenTree): [string, unknown][] {
  return Object.entries(value).sort(([a], [b]) => numericAwareCompare(a, b));
}

function numericAwareCompare(a: string, b: string): number {
  const aNum = Number(a);
  const bNum = Number(b);
  if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
    return aNum - bNum;
  }
  return a.localeCompare(b);
}

function kebab(value: string): string {
  return value.replace(/_/g, '-').replace(/\s+/g, '-');
}

function normalizeCssValue(value: string): string {
  if (!/rgba?\(/.test(value)) {
    return value;
  }
  return value.replace(/,\s+/g, ',');
}

function normalizeFontValue(value: string): string {
  return value.replace(/^Noto Sans KR/, '"Noto Sans KR"');
}
