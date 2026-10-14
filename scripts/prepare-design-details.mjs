import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Display the existing transparent masters on a dark CSS canvas, without editing pixels.
const source = 'S:/World Champs/2026 Update/Shirt Designs';
const output = 'public/assets/products/design-details';
const review = 'output/design-details';
const hash = data => createHash('sha256').update(data).digest('hex');
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
await fs.mkdir(output, { recursive: true });
await fs.mkdir(review, { recursive: true });
const records = [];
for (const folder of await fs.readdir(source, { withFileTypes: true })) {
  if (!folder.isDirectory() || folder.name === 'Shop Mockups') continue;
  for (const file of await fs.readdir(path.join(source, folder.name))) {
    if (!/^\d+-.+-transparent-v1\.png$/.test(file)) continue;
    const slug = file.replace(/^\d+-/, '').replace(/-transparent-v1\.png$/, '').replace('you-dont-', 'you-don-t-');
    const original = path.join(source, folder.name, file);
    const bytes = await fs.readFile(original);
    const destination = path.join(output, slug + '.png');
    await fs.writeFile(destination, bytes);
    if (hash(await fs.readFile(original)) !== hash(bytes) || hash(await fs.readFile(destination)) !== hash(bytes)) throw Error('Artwork preservation failed: ' + slug);
    records.push({ slug, collection: folder.name, source: original, image: '/assets/products/design-details/' + slug + '.png', sha256: hash(bytes) });
  }
}
records.sort((a,b) => a.collection.localeCompare(b.collection) || a.slug.localeCompare(b.slug));
await fs.writeFile('data/design-details.json', JSON.stringify(Object.fromEntries(records.map(r => [r.slug, r.image])), null, 2) + '\n');
await fs.writeFile(review + '/manifest.json', JSON.stringify(records, null, 2) + '\n');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>World Champignons — Design details</title><style>*{box-sizing:border-box}body{margin:0;padding:clamp(16px,4vw,56px);background:#101714;color:#f3efde;font:16px system-ui}h1{font:clamp(32px,5vw,56px) Georgia}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:24px}figure{margin:0}a{display:block;background:#242824;aspect-ratio:1;cursor:zoom-in}img{width:100%;height:100%;object-fit:contain;padding:6%}figcaption{padding:14px 0 24px;text-transform:capitalize}small{display:block;color:#aeb8a8;margin-top:6px}dialog{padding:0;border:1px solid #72816c;background:#242824;max-width:95vw;max-height:95dvh}dialog::backdrop{background:#000d}dialog img{display:block;width:min(85vw,1000px);height:85dvh;object-fit:contain}button{position:absolute;right:12px;top:12px;background:#101714;color:white;border:1px solid #72816c;padding:10px;cursor:pointer}</style><h1>Design details</h1><p>${records.length} original designs on charcoal. Select a design to inspect it.</p><main>${records.map(r => `<figure><a href="../../public${r.image}" aria-label="Enlarge ${escape(r.slug.replaceAll('-',' '))}"><img loading="lazy" src="../../public${r.image}" alt="${escape(r.slug.replaceAll('-',' '))}"></a><figcaption>${escape(r.slug.replaceAll('-',' '))}<small>${escape(r.collection)}</small></figcaption></figure>`).join('')}</main><dialog><button aria-label="Close detail">Close ×</button><img alt=""></dialog><script>const d=document.querySelector('dialog');document.querySelectorAll('a').forEach(a=>a.onclick=e=>{e.preventDefault();d.querySelector('img').src=a.href;d.querySelector('img').alt=a.querySelector('img').alt;d.showModal()});d.querySelector('button').onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close()};</script></html>`;
await fs.writeFile(review + '/index.html', html);
console.log(`Prepared ${records.length} exact artwork copies and dark-background review views.`);
