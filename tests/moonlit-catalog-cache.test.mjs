import test from 'node:test';
import assert from 'node:assert/strict';
import { cachedCatalog } from '../server/catalog-cache.mjs';
test('browsing shares concurrent reads and refreshes after expiration', async () => {
  let calls = 0, time = 0;
  const get = cachedCatalog(async () => [++calls], { ttl: 100, now: () => time });
  assert.deepEqual(await Promise.all([get(), get(), get()]), [[1], [1], [1]]);
  assert.deepEqual(await get(), [1]);
  time = 101;
  assert.deepEqual(await get(), [2]);
});
test('failed catalog requests are not cached', async () => {
  let calls = 0;
  const get = cachedCatalog(async () => { if (++calls === 1) throw Error('temporary'); return [2]; });
  await assert.rejects(get(), /temporary/);
  assert.deepEqual(await get(), [2]);
});
