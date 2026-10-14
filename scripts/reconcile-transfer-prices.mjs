// Run only after reviewing the original artwork/placements in Printful's UI.
// Usage: node --env-file=.env scripts/reconcile-transfer-prices.mjs <catalog-id> <sync-product-id>
import fs from 'node:fs/promises';
import catalog from '../data/catalog.json' with { type: 'json' };
import { printful } from '../server/providers.mjs';
const [slug, rawId] = process.argv.slice(2);
const id = Number(rawId);
const reference = catalog.find(p => p.id === slug);
if (!reference || !Number.isSafeInteger(id) || id <= 0 || process.env.PRINTFUL_STORE_ID !== '18899129') throw Error('Expected a reviewed reference product and the isolated API store');
const stores = await printful('/stores');
if (stores.length !== 1 || stores[0].id !== 18899129) throw Error('Token must be scoped to the isolated API store');
const endpoint = '/store/products/' + id;
const before = await printful(endpoint);
if (before.sync_product.name !== reference.fullName) throw Error('Product title does not match reference');
const prices = new Map();
for (const variant of reference.referenceVariants) {
  if (prices.has(variant.size) && prices.get(variant.size) !== variant.price) throw Error('Color-specific prices require manual reconciliation');
  prices.set(variant.size, variant.price);
}
const updates = before.sync_variants.map(v => {
  const price = prices.get(v.size);
  if (!Number.isFinite(price) || price <= 0) throw Error('No original price for ' + v.size);
  return { id: v.id, retail_price: price.toFixed(2) };
});
await fs.mkdir('output/pre-moonlit', { recursive: true });
await fs.writeFile(`output/pre-moonlit/${slug}-${id}-before-prices.json`, JSON.stringify(before, null, 2));
const response = await fetch('https://api.printful.com' + endpoint, {
  method: 'PUT', headers: { Authorization: 'Bearer ' + process.env.PRINTFUL_API_TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ sync_variants: updates }), signal: AbortSignal.timeout(30000)
});
if (!response.ok) throw Error('Price update failed: ' + response.status);
const after = await printful(endpoint);
const artwork = d => JSON.stringify(d.sync_variants.map(v => [v.id, v.variant_id, v.files, v.options]));
if (artwork(before) !== artwork(after)) throw Error('Artwork comparison changed; inspect before mapping');
if (after.sync_variants.length !== before.sync_variants.length || !after.sync_variants.every(v => Number(v.retail_price) === prices.get(v.size))) throw Error('Price verification failed');
const mappings = JSON.parse(await fs.readFile('data/fulfillment.json', 'utf8'));
mappings[slug] = id;
await fs.writeFile('data/fulfillment.json', JSON.stringify(mappings, null, 2) + '\n');
console.log(`${slug}: ${after.sync_variants.length} prices verified; artwork unchanged; local mapping saved.`);
