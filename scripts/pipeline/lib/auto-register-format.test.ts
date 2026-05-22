import assert from 'node:assert/strict';
import yaml from 'js-yaml';
import { generateMappingKey, buildYamlEntry, encodeRegisteredItems } from '../auto-register.ts';

interface DecodedItem { nodeId: string; name: string }
function decode(b64: string): DecodedItem[] {
  return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8')) as DecodedItem[];
}
function makeCandidate(nodeId: string, name: string) {
  return { nodeId, name, firstSeenAt: '', lastSeenAt: '', sightingCount: 2 };
}

// ─────────────────────────────────────────────────────────────────────────────
// generateMappingKey
// ─────────────────────────────────────────────────────────────────────────────

{
  // Plain ASCII name
  const key = generateMappingKey({
    nodeId: '35:244', name: 'test1',
    firstSeenAt: '', lastSeenAt: '', sightingCount: 2,
  });
  assert.equal(key, 'auto_test1_35_244');
}

{
  // Name with spaces, hyphens, periods (e.g. "Phone · My Account")
  const key = generateMappingKey({
    nodeId: '35:45', name: 'Phone · My Account',
    firstSeenAt: '', lastSeenAt: '', sightingCount: 2,
  });
  assert.equal(key, 'auto_phone_my_account_35_45');
}

{
  // Empty-ish name → fallback slug
  const key = generateMappingKey({
    nodeId: '1:1', name: '———',
    firstSeenAt: '', lastSeenAt: '', sightingCount: 2,
  });
  assert.equal(key, 'auto_frame_1_1');
}

// ─────────────────────────────────────────────────────────────────────────────
// buildYamlEntry: round-trip via js-yaml parser
// ─────────────────────────────────────────────────────────────────────────────

{
  const entry = buildYamlEntry({
    nodeId: '35:244', name: 'test1',
    firstSeenAt: '2026-05-21T13:00:00Z', lastSeenAt: '2026-05-22T13:00:00Z',
    sightingCount: 2,
  }, '2026-05-22');

  // Wrap in screens: to parse as full mapping
  const synthetic = `screens:\n${entry}`;
  const parsed = yaml.load(synthetic) as { screens: Record<string, unknown> };
  const screens = parsed.screens;

  const key = 'auto_test1_35_244';
  assert.ok(screens[key], `expected key ${key} to exist`);
  const entryParsed = screens[key] as Record<string, unknown>;
  assert.equal(entryParsed.figmaNodeId, '35:244');
  assert.equal(entryParsed.figmaNodeName, 'test1');
  assert.deepEqual(entryParsed.figmaNodePath, []);
  assert.equal(entryParsed.code, '../src/screens/FigmaFrameTracking.ts');
  assert.equal(entryParsed.targetType, 'screen');
  const automation = entryParsed.automation as Record<string, unknown>;
  assert.equal(automation.apply, 'report-only');
  assert.equal(automation.audit, 'include');
  assert.deepEqual(automation.allowedClasses, ['token', 'text', 'layout', 'structure']);
}

{
  // Name with YAML-special chars should still round-trip safely
  const entry = buildYamlEntry({
    nodeId: '99:1', name: 'Phone · My Account',
    firstSeenAt: '2026-05-21T13:00:00Z', lastSeenAt: '2026-05-22T13:00:00Z',
    sightingCount: 2,
  }, '2026-05-22');
  const synthetic = `screens:\n${entry}`;
  const parsed = yaml.load(synthetic) as { screens: Record<string, unknown> };
  const e = parsed.screens['auto_phone_my_account_99_1'] as Record<string, unknown>;
  assert.equal(e.figmaNodeName, 'Phone · My Account');
}

// YAML poison names — frame names users could plausibly type that would
// be re-typed by an unquoted YAML serializer.
{
  const cases: Array<[string, string]> = [
    ['true', 'true'],
    ['123', '123'],
    ['null', 'null'],
    ['yes', 'yes'],
    ['', ''],
    ['1.5', '1.5'],
  ];
  for (const [input, expected] of cases) {
    const entry = buildYamlEntry({
      nodeId: '88:88', name: input,
      firstSeenAt: '', lastSeenAt: '', sightingCount: 2,
    }, '2026-05-22');
    const parsed = yaml.load(`screens:\n${entry}`) as { screens: Record<string, unknown> };
    const key = Object.keys(parsed.screens)[0];
    const e = parsed.screens[key] as Record<string, unknown>;
    assert.equal(typeof e.figmaNodeName, 'string', `name "${input}" should stay a string`);
    assert.equal(e.figmaNodeName, expected, `name "${input}" should round-trip exactly`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// encodeRegisteredItems — GITHUB_OUTPUT base64 JSON envelope.
// Regression suite for the PR #25 class of bugs where parallel `registered_ids`
// + `registered_names_b64` arrays lost the trailing name when bash `while read`
// hit decoded content with no trailing newline.
// ─────────────────────────────────────────────────────────────────────────────

{
  // Empty list still produces a valid base64 of "[]".
  const b64 = encodeRegisteredItems([]);
  assert.deepEqual(decode(b64), []);
}

{
  // Single item round-trips.
  const b64 = encodeRegisteredItems([makeCandidate('35:244', 'test1')]);
  assert.deepEqual(decode(b64), [{ nodeId: '35:244', name: 'test1' }]);
}

{
  // PR #25 regression: two items, both names must survive — the old
  // newline-joined-then-base64 + `while read` decode dropped the last name
  // when decoded content had no trailing newline.
  const b64 = encodeRegisteredItems([
    makeCandidate('35:244', 'test1'),
    makeCandidate('35:382', 'test2'),
  ]);
  assert.deepEqual(decode(b64), [
    { nodeId: '35:244', name: 'test1' },
    { nodeId: '35:382', name: 'test2' },
  ]);
}

{
  // Frame name with an embedded newline must stay one name, not split into two.
  const b64 = encodeRegisteredItems([makeCandidate('1:1', 'line1\nline2')]);
  assert.deepEqual(decode(b64), [{ nodeId: '1:1', name: 'line1\nline2' }]);
}

{
  // Frame names with YAML/CSV/quote-hostile chars must round-trip exactly.
  const cases = ['Phone · My Account', 'a,b,c', 'with "quotes"', 'eq=sign', 'back\\slash'];
  const b64 = encodeRegisteredItems(cases.map((n, i) => makeCandidate(`9:${i}`, n)));
  const decoded = decode(b64);
  assert.equal(decoded.length, cases.length);
  cases.forEach((n, i) => assert.equal(decoded[i].name, n, `case ${i}: ${n}`));
}

console.log('auto-register-format tests passed');
