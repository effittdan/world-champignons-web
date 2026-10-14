import { build } from "./build.mjs";
await build();
process.env.SITE_URL ||= "http://127.0.0.1:4173";
const { storefrontServer } = await import("../server/http.mjs");
storefrontServer({ siteUrl: process.env.SITE_URL }).listen(
  4173,
  "127.0.0.1",
  () => console.log("Moonlit Mycelium: http://127.0.0.1:4173"),
);
