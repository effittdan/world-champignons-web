import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { storefrontServer } from "../server/http.mjs";
import { normalizeVariants } from "../server/printful-catalog.mjs";
import { selectLines } from "../server/validation.mjs";
import catalog from "../data/catalog.json" with { type: "json" };
test("All four collections include their approved designs and variants", () => {
  assert.equal(catalog.length, 28);
  assert.deepEqual(Object.fromEntries(['mckenna','cultivation','psychedelic-experience','connection-spirituality'].map(c=>[c,catalog.filter(p=>p.collection===c).length])),{mckenna:4,cultivation:9,'psychedelic-experience':8,'connection-spirituality':7});
  for(const p of catalog){assert.equal(p.referenceVariants.length,91);assert.equal(p.priceOverride,39);assert.equal(p.freeShipping,true);assert.equal(new Set(p.referenceVariants.map(v=>v.color)).size,13);assert.ok(p.referenceVariants.every(v=>v.price===39));}
  for (const p of catalog)
    for (const v of p.referenceVariants) {
      assert.ok(v.color);
      assert.ok(v.size);
      assert.ok(v.price > 0);
    }
});
test("only synced, ready USD Printful artwork becomes selectable", () => {
  const valid = {
    id: 10,
    variant_id: 20,
    color: "Ash",
    size: "M",
    synced: true,
    retail_price: "26.00",
    currency: "USD",
    availability_status: "active",
    files: [{ type: "front", status: "ok" }],
  };
  const result = normalizeVariants({
    sync_variants: [
      valid,
      { ...valid, id: 11, files: [{ type: "front_large", status: "ok" }] },
      { ...valid, currency: "EUR" },
      { ...valid, synced: false },
      { ...valid, retail_price: "0" },
      { ...valid, files: [{ type: "front", status: "waiting" }] },
      { ...valid, files: [{ type: "front_large", status: "waiting" }] },
      { ...valid, files: [{ type: "preview", status: "ok" }] },
    ],
  });
  assert.equal(result.length, 2);
  assert.equal(result[0].price, 26);
  assert.equal(
    normalizeVariants({
      sync_variants: [{ ...valid, availability_status: "discontinued" }],
    })[0].available,
    false,
  );
});
test("null cart entries are rejected as a public validation error", () =>
  assert.throws(
    () => selectLines([null], []),
    (e) => e.status === 400,
  ));
test("all generated internal page and asset links resolve", async () => {
  const routes = JSON.parse(await readFile("dist/routes.json", "utf8"));
  assert.equal(routes.length, 52);
  assert.equal(routes.filter(route=>route.startsWith("/product/")).length,28);
  assert.ok(routes.includes("/collections/mckenna"));
  for (const route of routes) {
    const html = await readFile(
      "dist" + (route === "/" ? "" : route) + "/index.html",
      "utf8",
    );
    assert.match(html, /<h1[ >]/);
    assert.match(html, /noindex,nofollow/);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)[^"]*"/g)) {
      const url = match[1];
      const file =
        url === "/"
          ? "dist/index.html"
          : url.match(/\.[a-z0-9]+$/i)
            ? "dist" + url
            : "dist" + url + "/index.html";
      await stat(file);
    }
  }
});
test("Node host retires old products, serves the fresh-start shop and protects private files", async () => {
  const server = storefrontServer({ siteUrl: "http://127.0.0.1" });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    let r = await fetch(base + "/product/so-mushroom");
    assert.equal(r.status, 404);
    r = await fetch(base + "/shop");
    assert.equal(r.status, 200);
    assert.match(await r.text(), /Nature Loves Courage/);
    for (const path of [
      "/unknown-page",
      "/.env",
      "/package.json",
      "/assets/missing.webp",
    ])
      assert.equal((await fetch(base + path)).status, 404, path);
    r = await fetch(base + "/", {
      method: "POST",
      headers: {
        Origin: "https://wrong.example",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "form-name=contact",
    });
    assert.equal(r.status, 403);
    const config = await (await fetch(base + "/api/config")).json();
    assert.equal(config.enabled, false);
  } finally {
    await new Promise((r) => server.close(r));
  }
});
