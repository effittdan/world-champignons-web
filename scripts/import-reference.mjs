import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const base = "https://shop.worldchampignons.com";
const clean = (s) =>
  String(s || "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
async function get(path) {
  const r = await fetch(base + path);
  if (!r.ok) throw Error("Catalog reference unavailable " + r.status);
  return r.json();
}
const products = await get("/wp-json/wc/store/v1/products?per_page=100");
await mkdir("public/assets/products", { recursive: true });
const output = [];
for (const p of products) {
  const variations = await get(
    "/wp-json/wc/store/v1/products?type=variation&parent=" +
      p.id +
      "&per_page=100",
  );
  const urls = [
    ...new Set([
      ...p.images.slice(0, 4).map((i) => i.src),
      ...variations.flatMap((v) => v.images.slice(0, 1).map((i) => i.src)),
    ]),
  ];
  const images = new Map();
  for (let i = 0; i < urls.length; i++) {
    const file = `/assets/products/${p.id}-${i}.webp`;
    const r = await fetch(urls[i]);
    if (!r.ok) throw Error("Image unavailable");
    await sharp(Buffer.from(await r.arrayBuffer()))
      .resize({ width: 1100, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile("public" + file);
    images.set(urls[i], file);
  }
  const slug = p.name
    .replace(" Short-Sleeve Unisex T-Shirt", "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "");
  output.push({
    id: slug,
    sourceId: p.id,
    name: p.name.replace(" Short-Sleeve Unisex T-Shirt", ""),
    fullName: p.name,
    type: "Unisex T-Shirt",
    description: clean(p.description),
    price: Number(p.prices.price) / 100,
    images: p.images.slice(0, 4).map((i) => images.get(i.src)),
    sourceUrl: p.permalink,
    referenceVariants: variations.map((v) => ({
      sourceId: v.id,
      color:
        v.attributes.find((a) => /color/i.test(a.name))?.value ||
        /Color: ([^,]+)/i.exec(v.variation)?.[1] ||
        "",
      size:
        v.attributes.find((a) => /size/i.test(a.name))?.value ||
        /Size: ([^,]+)/i.exec(v.variation)?.[1] ||
        "",
      price: Number(v.prices.price) / 100,
      available: v.is_in_stock && v.is_purchasable,
      image: images.get(v.images[0]?.src),
    })),
  });
  console.log(
    `Saved ${p.name}: ${variations.length} reference variants, ${urls.length} images.`,
  );
}
await writeFile("data/catalog.json", JSON.stringify(output, null, 2) + "\n");
await writeFile(
  "data/reference-source.json",
  JSON.stringify(
    {
      retrievedAt: new Date().toISOString(),
      source: base,
      role: "Visual catalog reference only. Printful is required to validate purchasable variants.",
    },
    null,
    2,
  ),
);
