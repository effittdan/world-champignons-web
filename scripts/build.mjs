import { mkdir, cp, writeFile, readFile, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import rawCatalog from "../data/catalog.json" with { type: "json" };
import { applyProductPricing } from '../src/pricing.js';
const catalog = rawCatalog.map(applyProductPricing);
import { collections, teachings } from "../src/content.mjs";
import {
  home,
  shop,
  product,
  lore,
  manifest,
  collectionPage,
  notes,
} from "../src/views.mjs";
import {
  checkout,
  order,
  formPage,
  infoPage,
  notFound,
} from "../src/service-pages.mjs";
export async function build() {
  const pages = new Map([
    ["/", home()],
    ["/shop", shop()],
    ["/lore", lore()],
    ["/manifesto", manifest()],
    ["/collections", collectionPage()],
    ["/field-notes", notes()],
    ["/checkout", checkout()],
    ["/order", order()],
    ["/contact", formPage("contact")],
    ["/dispatch", formPage("dispatch")],
    ...["support", "privacy", "terms"].map((t) => ["/" + t, infoPage(t)]),
    ...catalog.map((p) => ["/product/" + p.id, product(p)]),
    ...collections.map((c) => ["/collections/" + c.id, collectionPage(c)]),
    ...teachings.map((t) => ["/field-notes/" + t.id, notes(t)]),
  ]);
  const output = resolve("dist");
  const expected = new URL("../dist", import.meta.url);
  if (pathToFileURL(output).href !== expected.href)
    throw Error("Build must run from the project root");
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp("public", "dist", { recursive: true, filter: source => !source.replaceAll("\\", "/").match(/products\/design-details\/.*\.png$/) });
  for (const file of ["client.js", "cart.js", "pricing.js", "styles.css"])
    await cp("src/" + file, "dist/" + file);
  await cp("src/client.js", "dist/storefront-collections.js");
  await writeFile("dist/catalog.json", JSON.stringify(catalog));
  for (const [route, html] of pages) {
    const file = "dist" + (route === "/" ? "" : route) + "/index.html";
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  await writeFile("dist/404.html", notFound());
  const base = process.env.SITE_URL || "https://worldchampignons.com";
  await writeFile(
    "dist/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      [...pages.keys()]
        .filter((p) => !["/order", "/checkout"].includes(p))
        .map((p) => "<url><loc>" + base + p + "</loc></url>")
        .join("") +
      "</urlset>",
  );
  await writeFile(
    "dist/robots.txt",
    process.env.EXPECT_INDEXABLE === "true"
      ? "User-agent: *\nAllow: /\nDisallow: /checkout\nDisallow: /order\nSitemap: " +
          base +
          "/sitemap.xml\n"
      : "User-agent: *\nDisallow: /\n",
  );
  await writeFile("dist/routes.json", JSON.stringify([...pages.keys()]));
  console.log(
    `Built ${pages.size} Moonlit Mycelium pages, ${catalog.length} product designs.`,
  );
  return pages;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await build();
