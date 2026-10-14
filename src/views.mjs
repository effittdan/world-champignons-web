import rawCatalog from "../data/catalog.json" with { type: "json" };
import designDetails from "../data/design-details.json" with { type: "json" };
import { applyProductPricing } from './pricing.js';
const catalog = rawCatalog.map(applyProductPricing);
import { originStory, manifesto, teachings, collections } from "./content.mjs";
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
export const link = (url, label, cls = "text-link") =>
  `<a class="${cls}" href="${url}">${label}<span aria-hidden="true">↗</span></a>`;
export const art = (name, alt, cls = "") =>
  `<img class="${cls}" src="/assets/art/${name}-1536.webp" srcset="/assets/art/${name}-768.webp 768w, /assets/art/${name}-1536.webp 1536w" sizes="(max-width: 700px) 100vw, 50vw" width="1536" height="1024" alt="${alt}" loading="lazy">`;
export const prose = (s) =>
  s
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .map((p) =>
      p.startsWith("## ")
        ? `<h2>${esc(p.replace(/^## /, ""))}</h2>`
        : `<p>${esc(p)
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\r?\n/g, "<br>")}</p>`,
    )
    .join("");
const nav = (active) =>
  [
    ["/shop", "Shop"],
    ["/collections", "Collections"],
    ["/lore", "Lore"],
    ["/field-notes", "Field Notes"],
  ]
    .map(
      ([href, t]) =>
        `<a href="${href}" ${active === href ? 'aria-current="page"' : ""}>${t}</a>`,
    )
    .join("");
const footer = () =>
  `<footer class="footer"><div class="wrap footer-top"><div><a href="/" aria-label="World Champignons home"><img src="/assets/brand/wordmark.webp" width="230" height="90" alt="World Champignons" loading="lazy"></a><p>Rooted in mystery.<br>Grown to inspire.</p></div><div><span class="eyebrow">The underground</span><a href="/shop">Shop all apparel</a><a href="/collections">Our collections</a><a href="/lore">Our story</a><a href="/manifesto">The manifesto</a></div><div><span class="eyebrow">A little guidance</span><a href="/field-notes">Field Notes</a><a href="/support">Shipping & returns</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></div><div class="footer-dispatch"><span class="eyebrow">Stay curious</span><h3>Notes from<br>the underground.</h3><p>New drops, forest transmissions,<br>and better questions.</p>${link("/dispatch", "Join the Circle")}</div></div><div class="wrap footer-bottom"><span>© 2026 World Champignons</span><span>Seek. Study. Preserve.</span><a href="/terms">Terms</a></div></footer>`;
const drawer = () =>
  `<dialog id="bag-dialog" class="bag-dialog" aria-labelledby="bag-title"><div class="dialog-top"><div><span class="eyebrow">Your finds</span><h2 id="bag-title">The bag</h2></div><button class="icon-button" data-close-dialog aria-label="Close bag">×</button></div><div data-bag-items></div><div data-bag-footer></div></dialog><div class="toast" role="status" aria-live="polite" hidden></div>`;
export function layout({
  title,
  description,
  body,
  active = "",
  kind = "",
  image = "/assets/art/canopy-1536.webp",
  path = "/",
}) {
  const base = process.env.SITE_URL || "https://worldchampignons.com";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | World Champignons</title><meta name="description" content="${esc(description || "Mushroom-inspired apparel for seekers, naturalists, and students of the Great Beneath. Rooted in mystery. Grown to inspire.")}"><meta name="robots" content="${process.env.EXPECT_INDEXABLE === "true" ? "index,follow" : "noindex,nofollow"}"><meta name="theme-color" content="#071b16"><link rel="canonical" href="${base}${path}"><meta property="og:title" content="${esc(title)} | World Champignons"><meta property="og:description" content="${esc(description || "Rooted in mystery. Grown to inspire.")}"><meta property="og:image" content="${base}${image}"><meta property="og:url" content="${base}${path}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/brand/emblem.webp"><link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/styles.css?v=collection-mockups-20261014">${kind === "home" ? '<link rel="preload" as="image" href="/assets/art/canopy-1536.webp">' : ""}<script type="module" src="/storefront-collections.js"></script></head><body class="forest-site ${kind}"><a class="skip-link" href="#main">Skip to content</a><div class="announcement"><span>The hidden world is alive</span><span>Seek. Study. Preserve.</span></div><header class="site-header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="World Champignons home"><img src="/assets/brand/wordmark.webp" width="190" height="74" alt="World Champignons"></a><nav class="desktop-nav" aria-label="Main">${nav(active)}</nav><div class="header-tools"><a href="/shop#search" class="search-link" aria-label="Search the shop">Search</a><button class="bag-toggle" data-open-bag>Bag <span data-bag-count>(0)</span></button><button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">Menu</button></div></div><nav id="mobile-nav" aria-label="Mobile" hidden>${nav(active)}<a href="/contact">Contact</a></nav></header><main id="main">${body}</main>${footer()}${drawer()}</body></html>`;
}
export const productCard = (p) =>
  `<article class="product-card" data-product-card data-name="${esc(p.name.toLowerCase())}" data-price="${p.price}"><a href="/product/${p.id}" class="product-image"><img src="${p.images[0]}" alt="${esc(p.fullName)}" width="800" height="800" loading="lazy"><span class="view-product">Discover the design <span aria-hidden="true">↗</span></span></a><div class="product-meta"><div><a href="/product/${p.id}"><h3>${esc(p.name)}</h3></a><p>${esc(p.type)}</p></div><span>${p.priceOverride ? "" : "From "}${money(p.price)}</span></div></article>`;
export const sectionHead = (label, title, url, text) =>
  `<div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${title}</h2></div>${url ? link(url, text) : ""}</div>`;
export const beliefBanner = () =>
  `<section class="belief-banner"><div class="wrap"><p class="eyebrow">A little closer to the living world</p><h2>The Mushroom<br>Is the Teacher</h2><p class="spaced">Seek. Study. Preserve.</p>${link("/lore", "Our story", "button outline")}</div></section>`;
export function home() {
  return layout({
    title: "The Mushroom Is the Teacher",
    kind: "home",
    body: `<section class="hero"><div class="wrap hero-content"><p class="eyebrow">Seek. Study. Preserve.</p><h1>Rooted in mystery.<br>Grown to inspire.</h1><p class="hero-motto">Apparel for students of the Great Beneath.</p>${link("/shop", "Explore the Shop", "button")}<div class="hero-foot"><span>For seekers of the hidden.<br>Champions of the underground.</span><a href="#fresh">Begin the forage <span aria-hidden="true">↓</span></a></div></div></section><section id="fresh" class="wrap section">${sectionHead("Clothing for the curious", "Find your collection", "/collections", "Explore all collections")}<div class="product-grid forest-featured">${catalog.length ? ["leave-an-impression", "enlightened-still-annoying", "nothing-grows-alone"].map(id => catalog.find(p => p.id === id)).filter(Boolean).map(productCard).join("") : '<p>A new collection is taking root. There are currently no items for sale.</p>'}</div></section><section class="teachings-section"><div class="wrap"><div class="center-heading"><p class="eyebrow">The three teachings</p><h2>Seek. Study. Preserve.</h2><p>The forest is not quiet. It is simply using another language.</p></div><div class="teachings-grid">${teachings.map((t, i) => `<a class="teaching" href="/field-notes/${t.id}"><span class="teaching-number">0${i + 1}</span><h3>${t.title}</h3><p>${t.lead}</p><span class="text-link">Follow the thread <span aria-hidden="true">↗</span></span></a>`).join("")}</div></div></section>${catalog.length > 3 ? `<section class="wrap section">${sectionHead("From the forest floor", "A few more curious things", "/shop", "Explore the collection")}<div class="product-grid">${catalog.slice(3, 6).map(productCard).join("")}</div></section>` : ""}<section class="lore-split wrap section"><div>${art("hero", "A pale mushroom illuminated in the moonlit undergrowth")}</div><div><p class="eyebrow">Our origin story</p><h2>It began with<br>a whisper.</h2><p>Not the kind of whisper you hear with your ears. The older kind. The kind that arrives through the soles of your feet, through damp soil.</p><p>What else is hidden beneath the surface?</p>${link("/lore", "Read our story")}</div></section><section class="wrap section field-preview">${sectionHead("Dispatches from the root world", "Field Notes", "/field-notes", "Read the journal")}<div class="notes-grid">${teachings.map((t, i) => `<a class="note-card" href="/field-notes/${t.id}">${art(t.image, "Mushrooms in the night forest")}<p class="eyebrow">0${i + 1} / ${t.kicker}</p><h3>${["The hidden thing is often the living thing.", "Nothing grows alone.", "Preserve the living mystery."][i]}</h3><span class="text-link">Read the note <span aria-hidden="true">↗</span></span></a>`).join("")}</div></section>${beliefBanner()}`,
  });
}
export function shop() {
  if (!catalog.length) return layout({
    title: "A new collection is taking root", path: "/shop", active: "/shop",
    body: `<section class="page-intro wrap"><p class="eyebrow">World Champignons / A fresh start</p><h1>A new collection<br>is taking root.</h1><p>There are currently no items for sale.<br>In the meantime, explore the world beneath your feet.</p>${link("/lore", "Read our story", "button")}</section>${beliefBanner()}`,
  });
  return layout({
    title: "Shop the Underground",
    path: "/shop",
    active: "/shop",
    body: `<section class="page-intro wrap"><p class="eyebrow">Apparel & a little fungal love</p><h1>Find your strange.</h1><p>Clothing for seekers of the hidden, students of the mushroom,<br class="desktop-only"> and champions of the underground.</p></section><section class="wrap shop-section"><div class="shop-controls"><label class="search-field" for="search"><span class="sr-only">Search apparel</span><input id="search" type="search" placeholder="Find something curious…" autocomplete="off"></label><span data-result-count>${catalog.length} designs</span><label class="sort-field">Sort by <select id="sort"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div><div class="product-grid" id="shop-grid">${catalog.map(productCard).join("")}</div><div id="no-results" class="empty-state" hidden><h2>No mushrooms here.</h2><p>Try another search, or wander back to all the designs.</p><button class="button" id="reset-search">Clear search</button></div><p class="small muted catalog-note">Comfort Colors 1717 shirts: $39 each, 2 for $72, or 3 for $99. Mix and match designs, colors, and sizes, with free standard US shipping. Bundles apply automatically. Applicable tax is calculated at checkout.</p></section>${beliefBanner()}`,
  });
}
export function product(p) {
  const detailImage = designDetails[p.id];
  const galleryImages = detailImage ? [p.images[0], detailImage, ...p.images.slice(1)] : p.images;
  return layout({
    title: p.fullName,
    path: "/product/" + p.id,
    image: p.images[0],
    active: "/shop",
    kind: "product-page",
    body: `<section class="wrap product-section" data-product-id="${p.id}" data-detail-image="${detailImage || ""}"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/shop">Shop</a><span>/</span><span>${esc(p.name)}</span></nav><div class="product-layout"><div class="product-gallery"><button class="main-image-button" aria-label="Enlarge product image"><img id="main-product-image" src="${p.images[0]}" alt="${esc(p.fullName)}" width="1000" height="1000" fetchpriority="high"><span>View closer ↗</span></button><button type="button" class="text-link" id="original-view">View original Printful mockup</button>${detailImage ? `<button type="button" class="text-link" id="design-detail-view">View design detail</button>` : ""}<div class="gallery-thumbs">${galleryImages.map((img, i) => `<button data-image="${img}" class="thumb ${img === detailImage ? "design-detail" : ""} ${i === 0 ? "selected" : ""}" aria-label="${img === detailImage ? "View design detail" : `View product image ${i + 1}`}" aria-pressed="${i === 0}"><img src="${img}" width="100" height="100" alt="" loading="lazy"></button>`).join("")}</div></div><div class="product-info"><p class="eyebrow">World Champignons / ${esc(collections.find(c => c.id === p.collection)?.name || "Apparel")}</p><h1>${esc(p.name)}</h1><p class="product-subtitle">Unisex Garment-Dyed Heavyweight T-Shirt · Comfort Colors 1717</p><p class="price" data-product-price>${money(p.price)}</p><p class="small">Free standard shipping · All sizes $39</p><p class="small">Mix &amp; match: 2 for $72 · 3 for $99. Bundles apply automatically in your bag.</p><p class="product-motto">Rooted in Mystery. Grown to Inspire.</p><form id="product-form"><fieldset><legend>Color: <span id="selected-color"></span></legend><div id="color-options" class="color-options"></div></fieldset><fieldset><legend>Size</legend><div class="size-row"><div id="size-options" class="size-options"></div><a href="#size-fit" class="small text-link" data-size-help>Size & fit</a></div></fieldset><div class="quantity-field"><label for="quantity">Quantity</label><div class="stepper"><button type="button" data-quantity="-1" aria-label="Decrease quantity">−</button><input id="quantity" name="quantity" type="number" min="1" max="10" value="1" required><button type="button" data-quantity="1" aria-label="Increase quantity">+</button></div></div><button type="submit" class="button add-button" disabled>Add to Bag <span aria-hidden="true">↗</span></button><p class="selection-status small" role="status"></p></form><div class="payment-hint"><span>Card checkout</span></div><p class="small muted" data-commerce-status>Checking checkout availability…</p><div class="product-details"><details open><summary>Details</summary><div class="product-description">${prose(p.description)}</div></details><details id="size-fit"><summary>Size & fit</summary><p>Choose a color to see its available sizes. Check your measurements against the garment’s size guide before ordering.</p><p>The full size chart will be confirmed with the Printful product connection.</p></details><details><summary>Delivery & returns</summary><p>Free standard shipping for this shirt to supported delivery destinations. Applicable tax is calculated at checkout. Delivery availability is confirmed for your address at checkout.</p>${link("/support", "Delivery questions")}</details></div></div></div></section><dialog id="image-dialog" class="image-dialog" aria-label="Product image"><button class="icon-button" data-close-dialog aria-label="Close product image">×</button><img src="${p.images[0]}" alt="${esc(p.fullName)}"></dialog>${beliefBanner()}<section class="wrap section">${sectionHead("Keep foraging", "You might find a connection", "/shop", "Shop all")}<div class="product-grid">${catalog
      .filter((q) => q.id !== p.id)
      .slice(0, 3)
      .map(productCard)
      .join("")}</div></section>`,
  });
}
export function lore() {
  return layout({
    title: "Our Story",
    path: "/lore",
    active: "/lore",
    body: `<section class="story-hero wrap"><p class="eyebrow">The origin story</p><h1>It began with a whisper<br>from the forest floor.</h1><p>Rooted in Mystery. Grown to Inspire.</p></section><div class="story-image">${art("detail", "Moonlight on mushrooms, ferns and moss")}</div><section class="wrap reading-layout"><aside><span class="eyebrow">World Champignons</span><p>Seekers of the hidden.<br>Students of the strange.</p><a href="/manifesto" class="text-link">Our manifesto ↗</a></aside><article class="prose">${prose(originStory)}</article></section>${beliefBanner()}`,
  });
}
export function manifest() {
  return layout({
    title: "The Manifesto",
    path: "/manifesto",
    body: `<section class="page-intro wrap"><p class="eyebrow">The World Champignons manifesto</p><h1>Enter the world<br>more fully.</h1></section><section class="wrap reading-layout"><aside>${art("detail", "Mushrooms growing quietly in the dark")}</aside><article class="prose">${prose(manifesto)}</article></section>${beliefBanner()}`,
  });
}
export function collectionPage(c) {
  if (c && catalog.some(p => p.collection === c.id)) return layout({
    title: c.name, path: "/collections/" + c.id, active: "/collections",
    body: `<section class="page-intro wrap"><p class="eyebrow">World Champignons / ${esc(c.name)}</p><h1>${esc(c.line)}</h1><p>${esc(c.description)}</p><p class="small">Comfort Colors 1717 · $39 each · Free standard US shipping</p></section><section class="wrap section"><div class="product-grid">${catalog.filter(p => p.collection === c.id).map(productCard).join("")}</div></section>${beliefBanner()}`,
  });
  return layout({
    title: c ? c.name : "Collections",
    path: c ? "/collections/" + c.id : "/collections",
    active: "/collections",
    body: `<section class="page-intro wrap"><p class="eyebrow">Portals into the living mystery</p><h1>${c ? esc(c.name) : "Choose your<br>transmission."}</h1><p>${c ? esc(c.description) : "Four paths through the undergrowth. From grow-room rituals and cosmic detours to forest wisdom and McKenna’s restless curiosity—find the thread that feels like yours."}</p></section>${c ? `<section class="collection-feature wrap">${art("detail", "Mushrooms in a flourishing night garden")}<div><p class="eyebrow">A creative world</p><h2>${esc(c.line)}</h2><p>This is one of the themes behind World Champignons. Explore the current apparel while this collection takes root.</p>${link("/shop", "Explore all apparel", "button")}</div></section>` : `<section class="wrap collection-list">${collections.map((x, i) => { const featured = catalog.find(p => p.id === ({cultivation:"leave-an-impression","psychedelic-experience":"enlightened-still-annoying","connection-spirituality":"nothing-grows-alone",mckenna:"nature-loves-courage"})[x.id]); return `<a class="collection-with-mockup" href="/collections/${x.id}"><img class="collection-mockup" src="${featured.images[0]}" alt="${esc(featured.name)} shirt on the ${esc(x.name)} collection background" width="1000" height="1000" loading="lazy"><div class="collection-copy"><span class="eyebrow">0${i + 1} / ${catalog.filter(p => p.collection === x.id).length} designs</span><h2>${esc(x.name)}</h2><p>${esc(x.description)}</p><span class="text-link collection-cta">Explore the collection <span aria-hidden="true">↗</span></span></div></a>`; }).join("")}</section>`}${beliefBanner()}`,
  });
}
export function notes(t) {
  return layout({
    title: t ? t.title + " — The Three Teachings" : "Field Notes",
    path: t ? "/field-notes/" + t.id : "/field-notes",
    active: "/field-notes",
    body: t
      ? `<section class="page-intro wrap"><p class="eyebrow">Field Notes / ${t.kicker}</p><h1>${t.title}.</h1><p>${t.lead}</p></section><section class="wrap reading-layout"><aside>${art(t.image, "The moonlit forest floor")}</aside><article class="prose">${prose(t.body)}<p>From the World Champignons Three Teachings.</p>${link("/field-notes", "Back to Field Notes")}</article></section>${beliefBanner()}`
      : `<section class="page-intro wrap"><p class="eyebrow">Dispatches from the root world</p><h1>Field Notes.</h1><p>No official answers. Only better questions.</p></section><section class="wrap section notes-grid">${teachings.map((t) => `<a class="note-card" href="/field-notes/${t.id}">${art(t.image, "Moonlit mushrooms")}<p class="eyebrow">${t.kicker}</p><h2>${t.title}.</h2><p>${t.lead}</p><span class="text-link">Read the note ↗</span></a>`).join("")}</section>`,
  });
}
