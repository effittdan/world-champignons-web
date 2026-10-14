import fs from 'node:fs/promises';
import sharp from 'sharp';
const root=process.argv[2];
if(!root)throw Error('Pass the collection mockup archive directory');
const rows=JSON.parse(await fs.readFile(root+'/composite-manifest.json','utf8'));
const inventory=JSON.parse(await fs.readFile(root+'/product-inventory.json','utf8'));
const collections={'Cultivation':'cultivation','Psychedelic Experience':'psychedelic-experience','Connection & Spirituality':'connection-spirituality'};
const copy=[
['Leave an Impression','A spore print leaves a quiet signature long after the mushroom has gone. Fine gills, woodland detail, and a little fungal confidence turn this design into a reminder to make your mark.'],
['Is This Contam?','Every grower knows the stare: one suspicious spot, three second opinions, and a magnifying glass. A worried little mushroom brings the lab-bench drama to life with a wink for the cultivation crowd.'],
['Enlightened. Still Annoying.','A little illumination does not erase a big personality. This sunlit mushroom sage keeps one foot in cosmic wonder and the other firmly in the wonderfully irritating business of being human.'],
['Still Integrating','Some experiences take the scenic route home. A wearable pause for the thoughts still settling, the lessons still unfolding, and the person you are becoming between revelations.'],
['Nothing Grows Alone','Roots, mushrooms, and woodland life gather into one connected world. A warm reminder that growth is a shared project, even when the most important connections are out of sight.'],
['Trichy Business','A little grow-room wordplay for people who inspect every shade of green. Mischievous mushroom character meets the suspicious side of cultivation in this knowing nod to the daily contamination watch.'],
['Underground Work','The forest gets busy below the surface. Celebrate the patient, branching work that happens before anything breaks through: quiet effort, unseen connections, and growth on its own schedule.'],
['Rhize Up','Small threads. Collective ambition. A fungal rallying cry for growing toward the light while keeping your connections deep in the ground.'],
['First Flush Club','Membership earned one patient grow at a time. Celebrate the first proud cluster, the daily check-ins, and that particular joy of seeing your careful work finally fruit.'],
['Grow Your Own Way','There is more than one route through the substrate. A spirited invitation to follow your curiosity, trust your pace, and let your own strange shape emerge.'],
['Prints and the Revolution','Let the gills do the talking. A big spore-print statement with a musical wink, made for fungal enthusiasts who like their natural history with a little stage presence.'],
['Mush Love','A little fungal affection goes a long way. Carry a warm-hearted signal from the underground: stay connected, share the good things, and leave room for something tender.'],
['Ego Rebooting...','Please allow a moment while the usual story reloads. A playful status update for minds in motion, cosmic overthinkers, and anyone learning to take themselves a little less seriously.'],
['Ground Crew','Someone has to remember the water, the blanket, and the way back. A friendly salute to the steady presence in the room and the simple art of keeping both feet on the earth.'],
['Unclench the Universe','The cosmos can probably manage for a minute. A generous reminder to loosen your grip, breathe some room into the day, and let a little mystery remain unsolved.'],
['Have We Been Here Before?','That familiar feeling has taken the long way around again. A curious little loop for lovers of déjà vu, strange coincidences, and conversations that wander beyond the clock.'],
['Inner Compass','Not every direction comes with a signpost. Follow the quieter signal with a design for thoughtful wanderers, intuitive detours, and finding your bearings from the inside out.'],
['Carry the Wonder','Bring a little of the extraordinary back into the ordinary day. A keepsake for the curious part of you that still stops, looks closer, and finds a whole world in a small thing.'],
['Student of the Forest','No graduation date. No final answers. Just an ongoing education in roots, rain, mushrooms, and the patient intelligence of the living world.'],
['Back in Touch','Put the noise down for a moment. Find the soil, the leaves, the small living details, and the feeling of belonging to something that does not need a screen.'],
['The Ordinary Is Strange Enough','Look closely at what is already here. The everyday world is full of improbable shapes, hidden networks, and small mysteries waiting for an unhurried pair of eyes.'],
['More Moss. Less Noise','A soft green vote for a quieter day. For fern-side wanderers, slow walkers, and anyone who would happily trade another notification for a patch of woodland stillness.'],
['Ask the Quiet Things','The best questions do not always need a loud answer. Follow the small details, listen below the chatter, and let the forest set the pace of the conversation.'],
['Still Becoming','Growth rarely announces itself all at once. A gentle companion for unfinished chapters, changing seasons, and the patient work of turning into yourself.']
];
let catalog=JSON.parse(await fs.readFile('data/catalog.json','utf8'));
const mappings=JSON.parse(await fs.readFile('data/fulfillment.json','utf8'));
for(let i=0;i<inventory.length;i++){
 const item=inventory[i], collection=collections[item.collection];
 const pf=JSON.parse(await fs.readFile('output/collection-expansion/'+item.slug+'-printful.json','utf8'));
 const imagesByColor={},originalImagesByColor={};
 for(const row of rows.filter(r=>r.slug===item.slug)){
  const dir='public/assets/products/'+collection+'/'+item.slug;await fs.mkdir(dir,{recursive:true});
  const file=item.slug+'--'+row.color.toLowerCase().replaceAll(' ','-')+'.webp';
  await sharp(row.composite).webp({quality:88}).toFile(dir+'/'+file);
  await sharp(row.path).webp({quality:90}).toFile(dir+'/original-'+file);
  imagesByColor[row.color]='/assets/products/'+collection+'/'+item.slug+'/'+file;
  originalImagesByColor[row.color]='/assets/products/'+collection+'/'+item.slug+'/original-'+file;
 }
 const [name,description]=copy[i];
 const product={id:item.slug,name,fullName:name+' — Comfort Colors 1717',type:'Comfort Colors 1717 · Free shipping',garmentModel:'comfort-colors-1717',collection,price:39,priceOverride:39,freeShipping:true,description:description+'\n\nUnisex Garment-Dyed Heavyweight T-Shirt | Comfort Colors 1717. Available in 13 colors and sizes S–4XL. $39 in every size, with free standard US shipping. Applicable tax is calculated at checkout.',images:Object.values(imagesByColor),imagesByColor,originalImagesByColor,referenceVariants:pf.sync_variants.map(v=>({syncVariantId:v.id,catalogVariantId:v.variant_id,color:v.color,size:v.size,price:39,currency:'USD',available:v.availability_status==='active',image:imagesByColor[v.color]}))};
 catalog=catalog.filter(p=>p.id!==item.slug);catalog.push(product);mappings[item.slug]=item.productId;
}
await fs.writeFile('data/catalog.json',JSON.stringify(catalog,null,2)+'\n');
await fs.writeFile('data/fulfillment.json',JSON.stringify(mappings,null,2)+'\n');
console.log('Imported '+inventory.length+' products; '+catalog.length+' total.');
