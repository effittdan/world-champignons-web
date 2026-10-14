# World Champignons storefront

Node.js storefront with 28 Comfort Colors 1717 designs across Cultivation (9), Psychedelic Experience (8), Connection & Spirituality (7), and McKenna (4). The build generates 48 routes.

## Development

Requires Node 22+. Run `npm ci`, then `npm run dev` and open http://127.0.0.1:4173. Use `.env.example` for a new environment. Existing private configuration must remain outside Git and deployment archives.

Run `npm run build` and `npm test` before release. `npm start` serves the generated `dist/` and commerce API. SiteGround supplies production environment variables; its build initializes the database schema and regenerates the static pages.

## Commerce

All 28 designs have 13 colors and sizes S–4XL: 2,548 mapped variants. Each shirt is $39 with free standard US shipping. The existing mix-and-match bundles remain: 2 for $72 and 3 for $99, repeating triples for larger quantities. See [pricing](docs/SHIRT-PRICING.md).

The live Node storefront runs at https://worldchampignons.com/. On October 14, 2026, the public capabilities endpoint reported card and PayPal checkout enabled for US destinations. Provider settings are managed privately in SiteGround. This collection release does not submit a payment or paid fulfillment order.

## Source and assets

- `src/`: pages, styling, browser interactions, bag, shared pricing.
- `server/` and `netlify/functions/`: commerce API, database and fulfillment.
- `data/catalog.json` and `data/fulfillment.json`: catalog and Printful mappings.
- `public/assets/`: website derivatives, color mockups and artwork details.
- `scripts/build.mjs`: static route generation.
- `scripts/package-siteground.mjs`: explicit deployment allowlist.
- `tests/moonlit*.test.mjs`: build, API and pricing verification.

Original artwork, Printful PNGs, full-resolution composites and manifests remain in `S:\World Champs\2026 Update\Shirt Designs`. Deployment uses WebP derivatives; original design-detail PNGs and private `output/` working files are excluded from Git and the upload. Each new collection has its own background; the shirts retain Printful's garment, color and print placement.

Earlier root-level prototype files and WooCommerce code are historical. The active build uses `src/` and `scripts/build.mjs`. Earlier migration/readiness notes describe historical states and are superseded by live verification.
