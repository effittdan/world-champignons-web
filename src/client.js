import { readCart, addLine, lineKey, CART_KEY } from "./cart.js?v=collections-20261014";
import { isComfort1717, bundleLines } from './pricing.js?v=bundles-20261014';
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
let catalog = [],
  cart = readCart(localStorage),
  capabilities = { enabled: false, stripe: false, paypal: false },
  live = false,
  quote = null,
  quoteRevision = 0;
let toastTimer;
function toast(message) {
  const el = $(".toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 4000);
}
async function api(path, body) {
  const r = await fetch("/api/" + path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(25000),
  });
  const data = await r.json();
  if (!r.ok)
    throw Error(
      data.error || "The connection was interrupted. Please try again.",
    );
  return data;
}
function save() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    toast("Your browser could not save the bag.");
  }
  invalidateQuote();
  renderBag();
}
function invalidateQuote() {
  quoteRevision++;
  quote = null;
  if ($("#payment-options")) $("#payment-options").hidden = true;
  if ($("#quote-totals")) $("#quote-totals").innerHTML = "";
}
const variant = (l) =>
  catalog
    .find((p) => p.id === l.id)
    ?.variants.find((v) => v.color === l.color && v.size === l.size);
function currentLines() {
  return cart.map((l) => {
    const p = catalog.find((p) => p.id === l.id);
    const v = variant(l);
    return { ...l, p, v };
  });
}
function bagHTML() {
  if (!cart.length)
    return '<div class="empty-state"><h3>Your satchel is empty.</h3><p>Begin the forage and find your first artifact.</p><a class="button" href="/shop">Explore the shop ↗</a></div>';
  return currentLines()
    .map(
      (l, i) =>
        `<article class="bag-line"><a href="/product/${esc(l.id)}"><img src="${esc(l.v?.image || l.p?.images[0] || "/assets/brand/emblem.webp")}" width="85" height="85" alt="${esc(l.p?.name || l.id)}"></a><div><a href="/product/${esc(l.id)}"><h3>${esc(l.p?.name || l.id)}</h3></a><p>${esc(l.color)} / ${esc(l.size)} · ${l.v ? money(l.v.price) : "No longer available"}</p><div class="bag-line-controls"><div class="stepper"><button data-cart-index="${i}" data-delta="-1" aria-label="Decrease ${esc(l.p?.name || l.id)} quantity">−</button><span>${l.qty}</span><button data-cart-index="${i}" data-delta="1" aria-label="Increase ${esc(l.p?.name || l.id)} quantity">+</button></div><button class="remove-line" data-remove="${i}" aria-label="Remove ${esc(l.p?.name || l.id)}">Remove</button></div></div></article>`,
    )
    .join("");
}
function renderBag() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  $$("[data-bag-count]").forEach((el) => (el.textContent = "(" + count + ")"));
  $("[data-bag-items]").innerHTML = bagHTML();
  const priced = bundleLines(currentLines().map(l => ({ quantity: l.qty,
    unitCents: Math.round((l.v?.price || 0) * 100), bundleEligible: !!l.v && isComfort1717(l.p) })));
  const subtotal = priced.reduce((s, l) => s + l.unitCents * l.quantity, 0) / 100;
  const regular = currentLines().reduce((s, l) => s + (l.v?.price || 0) * l.qty, 0);
  $("[data-bag-footer]").innerHTML = cart.length
    ? `<div class="bag-footer">${regular > subtotal ? `<p class="small">Bundle savings: ${money(regular - subtotal)}</p>` : ''}<div class="total-row"><span>Estimated subtotal</span><strong>${money(subtotal)}</strong></div><p class="small">Comfort Colors 1717: 1 for $39 · 2 for $72 · 3 for $99. Mix and match; bundles apply automatically.</p><p class="small muted">${currentLines().every(l => l.p?.freeShipping) ? "Free standard shipping. Applicable tax at checkout." : "Shipping and tax calculated at checkout."}</p>${!live ? '<p class="small muted">Preview selections. Orders are not open yet.</p>' : ""}<a class="button" href="/checkout">Continue to checkout ↗</a></div>`
    : "";
  if ($("[data-checkout-items]"))
    $("[data-checkout-items]").innerHTML = bagHTML();
  if ($("#quote-button"))
    $("#quote-button").disabled = !capabilities.enabled || !cart.length;
}
function openBag() {
  $("#bag-dialog").showModal();
}
$$("[data-open-bag]").forEach((el) => el.addEventListener("click", openBag));
$$("[data-close-dialog]").forEach((el) =>
  el.addEventListener("click", () => el.closest("dialog").close()),
);
$$("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);
$(".menu-toggle")?.addEventListener("click", () => {
  const menu = $("#mobile-nav"),
    open = menu.hidden;
  menu.hidden = !open;
  $(".menu-toggle").setAttribute("aria-expanded", String(open));
  $(".menu-toggle").setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu",
  );
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#mobile-nav").hidden) {
    $("#mobile-nav").hidden = true;
    $(".menu-toggle").setAttribute("aria-expanded", "false");
    $(".menu-toggle").focus();
  }
});
document.addEventListener("click", (e) => {
  const remove = e.target.closest("[data-remove]"),
    qty = e.target.closest("[data-cart-index]");
  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    save();
  }
  if (qty) {
    const l = cart[Number(qty.dataset.cartIndex)];
    if (!l) return;
    const q = l.qty + Number(qty.dataset.delta);
    if (q < 1 || q > 10) return;
    l.qty = q;
    save();
  }
});
const search = $("#search");
if (search) {
  const grid = $("#shop-grid"),
    cards = $$("[data-product-card]");
  const filter = () => {
    const term = search.value.trim().toLowerCase();
    let shown = 0;
    for (const c of cards) {
      c.hidden = !c.dataset.name.includes(term);
      if (!c.hidden) shown++;
    }
    $("[data-result-count]").textContent =
      shown + " design" + (shown === 1 ? "" : "s");
    $("#no-results").hidden = shown > 0;
  };
  search.addEventListener("input", filter);
  $("#reset-search").addEventListener("click", () => {
    search.value = "";
    filter();
    search.focus();
  });
  $("#sort").addEventListener("change", (e) => {
    const sorted = [...cards];
    if (e.target.value === "name")
      sorted.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    if (e.target.value.startsWith("price"))
      sorted.sort(
        (a, b) =>
          (Number(a.dataset.price) - Number(b.dataset.price)) *
          (e.target.value === "price-low" ? 1 : -1),
      );
    sorted.forEach((c) => grid.append(c));
  });
}
function setupProduct() {
  const id = $("[data-product-id]")?.dataset.productId;
  if (!id) return;
  const p = catalog.find((p) => p.id === id);
  if (!p) return;
  const variants = p.variants;
  const colors = [...new Set(variants.map((v) => v.color))];
  let color = variants.find((v) => v.image === p.images[0])?.color || colors[0],
    size = "";
  const sizeOrder = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "XXL",
    "3XL",
    "4XL",
    "5XL",
  ];
  const swatches = {
    "True Navy":"#28313f", Red:"#a52c36", Graphite:"#555357", Sage:"#a4b7a4", Hemp:"#a69b81", Pepper:"#535458", Grape:"#766779", Brick:"#9c565f", Denim:"#646c7b", "Blue Spruce":"#425e56", Emerald:"#26747a", Crimson:"#bf5d60",
    Ash: "#d6d6d2",
    White: "#f2f1ec",
    Black: "#202420",
    "Heather Forest": "#384937",
    Forest: "#2b4536",
    "Dark Grey Heather": "#555754",
    "Athletic Heather": "#adaeab",
    "Heather Prism Dusty Blue": "#adc4c9",
    "Heather Prism Lilac": "#c3b8c0",
    "Heather Prism Mint": "#b6c3ab",
    Natural: "#dbd3bc",
    "Soft Cream": "#e4dbc1",
    "Heather Dust": "#c8c5b8",
    "Heather Deep Teal": "#356569",
    Navy: "#263344",
    Brown: "#554333",
    "Heather True Royal": "#50649b",
    "Heather Midnight Navy": "#333e4c",
  };
  function gallery(url) {
    if (!url) return;
    const isDetail = url === $("[data-product-id]").dataset.detailImage;
    const alt = isDetail ? `${p.name} — artwork detail` : p.fullName || p.name;
    $(".main-image-button").classList.toggle("design-detail", isDetail);
    $("#image-dialog").classList.toggle("design-detail", isDetail);
    $("#main-product-image").alt = alt;
    $("#image-dialog img").alt = alt;
    $("#main-product-image").src = url;
    $("#image-dialog img").src = url;
    $$(".thumb").forEach((b) => {
      const selected = b.dataset.image === url;
      b.classList.toggle("selected", selected);
      b.setAttribute("aria-pressed", String(selected));
    });
  }
  function render() {
    $("#selected-color").textContent = color || "Unavailable";
    $("#color-options").innerHTML = colors
      .map(
        (c) =>
          `<button type="button" class="color-button" data-color="${esc(c)}" aria-label="Color: ${esc(c)}" title="${esc(c)}" aria-pressed="${c === color}"><span style="--swatch:${swatches[c] || "#8b8f7b"}"></span></button>`,
      )
      .join("");
    const sizes = variants
      .filter((v) => v.color === color)
      .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
    $("#size-options").innerHTML = sizes
      .map(
        (v) =>
          `<button type="button" class="size-button" data-size="${esc(v.size)}" aria-label="Size ${esc(v.size)}" aria-pressed="${v.size === size}" ${v.available ? "" : "disabled"}>${esc(v.size)}</button>`,
      )
      .join("");
    const v = variants.find((v) => v.color === color && v.size === size);
    $(".add-button").disabled = !v?.available;
    $("[data-product-price]").textContent = v
      ? money(v.price)
      : sizes.length
        ? (p.priceOverride ? "" : "From ") + money(Math.min(...sizes.map((v) => v.price)))
        : "Currently unavailable";
    $(".selection-status").textContent = v
      ? ""
      : colors.length
        ? "Choose your size."
        : "This design is not available for selection.";
  }
  $("#color-options").addEventListener("click", (e) => {
    const b = e.target.closest("[data-color]");
    if (!b) return;
    color = b.dataset.color;
    if (
      !variants.some((v) => v.color === color && v.size === size && v.available)
    )
      size = "";
    gallery(variants.find((v) => v.color === color)?.image);
    render();
  });
  $("#original-view")?.addEventListener("click", () => gallery(p.originalImagesByColor?.[color]));
  $("#design-detail-view")?.addEventListener("click", () => gallery($("[data-product-id]").dataset.detailImage));
  $("#size-options").addEventListener("click", (e) => {
    const b = e.target.closest("[data-size]");
    if (!b) return;
    size = b.dataset.size;
    render();
  });
  $$("[data-image]").forEach((b) =>
    b.addEventListener("click", () => gallery(b.dataset.image)),
  );
  $$("[data-quantity]").forEach((b) =>
    b.addEventListener("click", () => {
      $("#quantity").value = Math.min(
        10,
        Math.max(1, Number($("#quantity").value) + Number(b.dataset.quantity)),
      );
    }),
  );
  $(".main-image-button").addEventListener("click", () =>
    $("#image-dialog").showModal(),
  );
  $("[data-size-help]").addEventListener(
    "click",
    () => ($("#size-fit").open = true),
  );
  $("#product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const v = variants.find((v) => v.color === color && v.size === size);
      if (!v?.available) throw Error("Choose an available size and color.");
      cart = addLine(cart, {
        id: p.id,
        color,
        size,
        qty: Number($("#quantity").value),
      });
      save();
      openBag();
    } catch (e) {
      $(".selection-status").textContent = e.message;
    }
  });
  if (live)
    $("[data-commerce-status]").textContent = capabilities.enabled
      ? (p.freeShipping ? "Free standard shipping. Applicable tax at checkout." : "Shipping and tax calculated at checkout.")
      : "Orders are not open yet.";
  render();
}
function setupCheckout() {
  const form = $("#checkout-form");
  if (!form) return;
  $("[data-checkout-status]").textContent = capabilities.enabled
    ? "Review your address, then calculate delivery and tax."
    : "The new storefront is in preview. Your bag is saved; payments are not open yet.";
  $("#countries").innerHTML = (capabilities.countries || ["US"])
    .map(
      (c) =>
        `<option value="${esc(c)}">${c === "US" ? "United States" : esc(c)}</option>`,
    )
    .join("");
  form.addEventListener("input", invalidateQuote);
  form.addEventListener("change", invalidateQuote);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = $("#quote-button");
    invalidateQuote();
    const revision = quoteRevision;
    button.disabled = true;
    $("#checkout-message").textContent = "Finding your delivery route…";
    try {
      const result = await api("quote", {
        address: Object.fromEntries(new FormData(form)),
        cart,
      });
      if (revision !== quoteRevision) {
        $("#checkout-message").textContent =
          "Your details changed. Calculate delivery again.";
        return;
      }
      quote = result;
      try {
        sessionStorage.setItem(
          "wc:receipt",
          JSON.stringify({ id: quote.id, token: quote.token }),
        );
      } catch {
        throw Error("Enable session storage to continue securely.");
      }
      $("#quote-totals").innerHTML = ["subtotal", "shipping", "tax", "total"]
        .map(
          (k) =>
            `<div class="total-row ${k === "total" ? "grand" : ""}"><span>${{ subtotal: "Subtotal", shipping: "Shipping", tax: "Tax", total: "Total" }[k]}</span><strong>${money(quote[k] / 100)}</strong></div>`,
        )
        .join("");
      $("#payment-options").hidden = false;
      $$("[data-pay]").forEach(
        (b) => { b.disabled = !capabilities[b.dataset.pay]; b.hidden = !capabilities[b.dataset.pay]; },
      );
      $("#checkout-message").textContent =
        "Your quote is ready. Review the total before choosing a payment method.";
    } catch (e) {
      invalidateQuote();
      $("#checkout-message").textContent = e.message;
    } finally {
      button.disabled = !capabilities.enabled || !cart.length;
    }
  });
  $$("[data-pay]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!quote) return;
      $$("[data-pay]").forEach((x) => (x.disabled = true));
      try {
        const r = await api("checkout", {
          quoteId: quote.id,
          token: quote.token,
          provider: b.dataset.pay,
        });
        const u = new URL(r.url);
        const allowed = [
          "checkout.stripe.com",
          "www.paypal.com",
          "www.sandbox.paypal.com",
        ];
        if (u.protocol !== "https:" || !allowed.includes(u.hostname))
          throw Error("The payment destination could not be verified.");
        location.assign(u.href);
      } catch (e) {
        $("#checkout-message").textContent = e.message;
        $$("[data-pay]").forEach(
          (x) => (x.disabled = !capabilities[x.dataset.pay]),
        );
      }
    }),
  );
}
async function checkOrder() {
  if (!$("#order-status")) return;
  let receipt;
  try {
    receipt = JSON.parse(sessionStorage.getItem("wc:receipt") || "null");
  } catch {}
  if (!receipt) {
    $("#order-title").textContent = "No order to follow yet.";
    $("#order-status").textContent =
      "Your order status appears here after checkout in this browser.";
    $("#refresh-order").hidden = true;
    return;
  }
  try {
    const paypalId = new URLSearchParams(location.search).get("token");
    if (paypalId)
      await api("paypal-capture", { ...receipt, paypalOrderId: paypalId });
    const r = await api("order", receipt);
    $("#order-title").textContent = r.paid
      ? "Your payment is confirmed."
      : "Your payment is being checked.";
    $("#order-status").textContent = r.paid
      ? "Thank you. Your order is recorded, and fulfillment is being prepared."
      : "Your payment has not been confirmed yet. Check again shortly before starting another payment.";
    $("#order-reference").textContent = "Order reference: " + r.reference;
    if (r.paid) {
      cart = [];
      save();
      $("#refresh-order").hidden = true;
    }
  } catch (e) {
    $("#order-status").textContent = e.message;
  }
}
$("#refresh-order")?.addEventListener("click", checkOrder);
$$("[data-message-form]").forEach((f) =>
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = f.querySelector("button"),
      status = f.querySelector("[data-form-status]");
    button.disabled = true;
    status.textContent = "Sending…";
    try {
      const r = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(f)),
      });
      if (!r.ok) throw Error(await r.text());
      status.textContent = "Thank you. Your message has been received.";
      f.reset();
    } catch (e) {
      status.textContent =
        e.message || "Your message could not be sent. Please try again later.";
    } finally {
      button.disabled = false;
    }
  }),
);
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) {
    cart = readCart(localStorage);
    invalidateQuote();
    renderBag();
  }
});
async function start() {
  try {
    const [snapshot, config, current] = await Promise.all([
      fetch("/catalog.json?v=collections-20261014", { cache: "no-store" }).then((r) => {
        if (!r.ok) throw Error("Catalog unavailable");
        return r.json();
      }),
      api("capabilities").catch(() => ({ enabled: false })),
      api("catalog").catch(() => ({ live: false, products: [] })),
    ]);
    capabilities = config;
    live = current.live === true;
    catalog = snapshot.map((p) => ({
      ...p,
      variants: live
        ? current.products.find((q) => q.id === p.id)?.variants || []
        : p.referenceVariants,
    }));
    cart = cart.filter((line) => catalog.some((product) => product.id === line.id));
    save();
    setupProduct();
    setupCheckout();
    await checkOrder();
  } catch (e) {
    toast("The catalog could not load. Please refresh to try again.");
    if ($(".selection-status"))
      $(".selection-status").textContent =
        "Product options are temporarily unavailable.";
  }
}
await start();
