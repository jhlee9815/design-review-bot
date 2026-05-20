import assert from 'node:assert/strict';
import { fetchFigmaJson } from './figma-api.ts';

const originalToken = process.env.FIGMA_TOKEN;
process.env.FIGMA_TOKEN = 'test-token';

let attempts = 0;
const retryResult = await fetchFigmaJson<{ ok: true }>('https://api.figma.test/file', {
  fetchImpl: async () => {
    attempts++;
    if (attempts === 1) {
      return new Response('rate limited', {
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'retry-after': '0' },
      });
    }
    return Response.json({ ok: true });
  },
  sleep: async () => {},
  maxAttempts: 2,
});

assert.deepEqual(retryResult, { ok: true });
assert.equal(attempts, 2);

await assert.rejects(
  () =>
    fetchFigmaJson('https://api.figma.test/file', {
      fetchImpl: async () => new Response('bad token', { status: 403, statusText: 'Forbidden' }),
      sleep: async () => {},
      maxAttempts: 2,
    }),
  /Figma API error 403 Forbidden/
);

if (originalToken === undefined) {
  delete process.env.FIGMA_TOKEN;
} else {
  process.env.FIGMA_TOKEN = originalToken;
}
