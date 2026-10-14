# Collection expansion — October 14, 2026

Adds 24 designs to the existing four McKenna products: Cultivation (9), Psychedelic Experience (8), and Connection & Spirituality (7). Each design has 13 color mockups and 91 mapped variants, priced at $39 with free standard US shipping. Existing bundle pricing and payment/fulfillment settings are preserved.

The new collection artwork uses 312 original Printful shirts composited onto three collection-specific backgrounds. Full-resolution files and source-preservation hashes remain in the S: artwork archive. The site includes separate original-mockup and design-detail views plus colorful descriptions for every design.

Validation: 52 built pages; 24 automated checks passing. Desktop collection layout reviewed; mobile product width checked at 390px without horizontal overflow. Sage/4XL selection updates the mockup and retains $39 pricing. No payment or paid fulfillment order was submitted during this release.

Deployment: `node scripts/package-siteground.mjs` creates the allowlisted upload. SiteGround Node 22 builds with `npm run build` and starts with `npm start`, preserving its existing private environment. Only optimized website derivatives are uploaded; master PNGs and private working files remain local.
