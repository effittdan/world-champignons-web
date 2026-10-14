import test from 'node:test';
import assert from 'node:assert/strict';
import {customerShipping,selectLines} from '../server/validation.mjs';
import catalog from '../data/catalog.json' with {type:'json'};
test('McKenna server selections charge 39 and absorb delivery cost for all sizes',()=>{
 const current=catalog.map(p=>({...p,variants:p.referenceVariants}));
 for(const p of current)for(const v of p.variants){
  const items=selectLines([{id:p.id,color:v.color,size:v.size,qty:1,price:1,freeShipping:false}],current);
  assert.equal(items[0].unitCents,3900);
  assert.equal(customerShipping(items,'12.95'),0);
 }
 assert.equal(customerShipping([{freeShipping:false}], '12.95'),1295);
 assert.throws(()=>customerShipping([{freeShipping:true}], 'invalid'));
});
