import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("public/assets/art", { recursive: true });
for (const name of ["hero", "detail"]) {
  const source = `output/eden-concepts/moonlit-${name}-original.png`;
  for (const width of [768, 1536])
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(`public/assets/art/${name}-${width}.webp`);
}
for (const name of ["wordmark", "emblem"])
  await sharp(`public/assets/brand/${name}.png`)
    .trim()
    .resize({
      width: name === "wordmark" ? 480 : 480,
      withoutEnlargement: true,
    })
    .webp({ quality: 92 })
    .toFile(`public/assets/brand/${name}.webp`);
const stylesheet = await fetch(
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Libre+Franklin:wght@400;500;600&display=swap",
  { headers: { "User-Agent": "Mozilla/5.0" } },
).then((r) => r.text());
let css = stylesheet;
let index = 0;
for (const url of [
  ...new Set(
    [...stylesheet.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]),
  ),
]) {
  const response = await fetch(url);
  if (!response.ok) throw Error("Font download failed");
  const path = `/assets/fonts/font-${index++}.woff2`;
  await writeFile("public" + path, Buffer.from(await response.arrayBuffer()));
  css = css.replaceAll(url, path);
}
await writeFile("public/assets/fonts/fonts.css", css);
console.log("Optimized moonlit artwork, brand assets and local fonts.");
