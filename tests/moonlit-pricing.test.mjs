import test from 'node:test';
import assert from 'node:assert/strict';
import { applyProductPricing, cartSelections } from '../src/pricing.js';
import { selectLines, customerShipping } from '../server/validation.mjs';
const product = (id, type = 'Comfort Colors 1717') => ({ id, name: id, type,
  variants: [{color:'Black',size:'M',available:true,currency:'USD',price:50,
    syncVariantId:123,catalogVariantId:456}] });
const cart = (id, qty) => ({id,qty,color:'Black',size:'M',price:0.01});
const subtotal = lines => lines.reduce((s,l)=>s+l.quantity*l.unitCents,0);
test('single, pair, triple and repeated bundles have exact totals', () => {
  for (const [qty,total] of [[1,3900],[2,7200],[3,9900],[4,13800],[5,17100],[6,19800],[10,33600]]) {
    const lines = selectLines([cart('a',qty)],[product('a')]);
    assert.equal(subtotal(lines),total);
    assert.equal(customerShipping(lines,'12.50'),0);
    assert.deepEqual(selectLines(cartSelections(lines),[product('a')]),lines);
  }
});
test('mix and match counts only eligible garments and keeps other shipping', () => {
  const lines = selectLines([cart('a',1),cart('b',1),cart('hoodie',1)],
    [product('a'),product('b'),product('hoodie','Hoodie')]);
  assert.equal(subtotal(lines),12200);
  assert.equal(customerShipping(lines,'8.50'),850);
  assert.equal(lines.find(l=>l.id==='hoodie').unitCents,5000);
});
test('new 1717 products get permanent price and shipping rule', () => {
  const p = applyProductPricing({...product('future'),price:50,referenceVariants:[{price:50}]});
  assert.equal(p.price,39);
  assert.equal(p.priceOverride,39);
  assert.equal(p.freeShipping,true);
  assert.equal(p.referenceVariants[0].price,39);
  assert.equal(applyProductPricing(product('hoodie','Hoodie')).priceOverride,undefined);
});
