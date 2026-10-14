# World Champignons — Cathedral of Leaves

Approved direction: Cathedral of Leaves with Moonlit Forest Path depth. A luminous woodland canopy opens into a winding path; dense ferns, moss, natural mushrooms and foliage continue around content throughout the site. Dark, quiet clearings protect reading and shopping controls. Existing brand artwork, authentic catalog imagery and canonical copy are retained.

## Visual system

- Deep forest `#081b13`; near-black forest `#04120c`; panel `#12271c`.
- Ivory `#f3efde`; muted text `#c1c9b7`; gold accents `#d3c294`.
- Sage action buttons `#506642`, with pale text and visible focus outlines.
- Cormorant Garamond headings; Libre Franklin body and controls. Fonts are self-hosted.
- Maximum content width 1320px, generous editorial spacing, fine botanical rules, restrained square controls.
- Immersive forest art supplies atmosphere. Product imagery remains authentic photography from the existing catalog.
- Hover effects are small. Reduced-motion preferences disable transitions and smooth scrolling.

## Layout and interaction

Home introduces the garden, featured apparel, Seek / Study / Preserve teachings, story, and field notes. Shop is a searchable nine-design catalog. Product pages provide authentic galleries, color and size selection, quantity, persistent bag, and disclosures. Lore preserves the canonical origin story and manifesto. Collection pages describe themes without inventing product assignments.

Desktop navigation gives way to an explicit mobile menu below 768px. The bag is a native dialog with keyboard dismissal and focus handling. Native form controls and visible labels support checkout. Checkout and order pages distinguish saved selections, quotes, verified payment, and fulfillment preparation.

## Content and assets

`WORLD_CHAMPIGNONS_CONTENT_SOURCE.md` is the editorial authority. `data/catalog.json` contains legacy product references; these do not authorize fulfillment. Generated forest art lives under `public/assets/art/`; approved brand images under `public/assets/brand/`; authentic product photos under `public/assets/products/`.

Do not invent reviews, urgency, shipping promises, product availability, material claims, measurements, or completed payments. Preview and unavailable states must remain explicit until verified production integrations are ready.

## Commerce

Node.js, PostgreSQL, Printful API, Stripe Checkout, and PayPal replace the earlier WooCommerce checkout handoff for this build. The legacy store supplies reference product content only. New fulfillment is isolated to World Champignons API store 18899129. See `docs/COMMERCE-READINESS.md` before enabling payments.

