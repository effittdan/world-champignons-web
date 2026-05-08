const WOO_CONFIG = {
  siteUrl: "https://shop.worldchampignons.com",
  productsEndpoint: "https://shop.worldchampignons.com/wp-json/wc/store/v1/products?per_page=24"
};

const fallbackProducts = [
  {
    id: "beneath-obvious-tee",
    name: "Check Beneath the Obvious Tee",
    category: "field",
    label: "Field Guide Collection",
    price: 38,
    color: "#1C1B19",
    mark: "Check Beneath the Obvious",
    type: "tee",
    fit: "Garment-dyed cotton tee",
    story: "A printed field instruction for people who stop mid-hike because a tiny marvelous thing happened near a root."
  },
  {
    id: "mycelium-athletic-crew",
    name: "Mycelium Athletic Club Crew",
    category: "league",
    label: "Underground League",
    price: 68,
    color: "#4C3A2E",
    mark: "Mycelium Athletic Club",
    type: "tee",
    fit: "Heavy fleece crewneck",
    story: "Varsity energy for the spore-counting trials, the blindfolded morel hunt, and other sanctioned feats of perception."
  },
  {
    id: "forest-receipts-hoodie",
    name: "The Forest Has Receipts Hoodie",
    category: "strange",
    label: "Strange Growth Society",
    price: 82,
    color: "#1C1B19",
    mark: "The Forest Has Receipts",
    type: "tee",
    fit: "Oversized brushed hoodie",
    story: "For midnight thinkers, damp archivists, and anyone who suspects the trees have been keeping very careful records."
  },
  {
    id: "preserve-understory-cap",
    name: "Preserve the Understory Cap",
    category: "preserve",
    label: "Preservation Club",
    price: 34,
    color: "#7B7650",
    mark: "Preserve the Understory",
    type: "hat",
    fit: "Unstructured six-panel cap",
    story: "Old park-service restraint with a quiet warning: leave no trace, take good notes, and protect the weird places."
  },
  {
    id: "spore-division-ringer",
    name: "Spore Division Ringer",
    category: "league",
    label: "Underground League",
    price: 42,
    color: "#E8DFCF",
    mark: "Spore Division",
    type: "tee",
    fit: "Cream ringer tee",
    story: "A championship shirt for the unofficial underground, issued somewhere between science, folklore, and a questionable locker room."
  },
  {
    id: "soup-portal-tote",
    name: "Soup Is a Portal Market Tote",
    category: "field",
    label: "Culinary Cryptid Series",
    price: 28,
    color: "#F4EEDF",
    mark: "Soup Is a Portal",
    type: "tote",
    fit: "Heavy cotton market tote",
    story: "Madame Chanterelle insisted every great civilization could be judged by how it treated soup. This tote agrees."
  },
  {
    id: "born-from-rot-longsleeve",
    name: "Born From the Rot Longsleeve",
    category: "strange",
    label: "Strange Growth Society",
    price: 54,
    color: "#4C3A2E",
    mark: "Born From the Rot",
    type: "tee",
    fit: "Pigment-dyed long sleeve",
    story: "Decay is not failure. It is a costume change. Wear accordingly while becoming suspiciously improved."
  },
  {
    id: "forest-archive-workshirt",
    name: "Forest Archive Division Workshirt",
    category: "preserve",
    label: "Preservation Club",
    price: 74,
    color: "#7C8D8A",
    mark: "Forest Archive Division",
    type: "tee",
    fit: "Canvas overshirt",
    story: "A field uniform for cataloging moss, arguing with trail signs, and filing reports with the underground library."
  },
  {
    id: "certified-forest-person",
    name: "Certified Forest Person Tee",
    category: "field",
    label: "Field Guide Collection",
    price: 38,
    color: "#7B7650",
    mark: "Certified Forest Person",
    type: "tee",
    fit: "Soft washed cotton tee",
    story: "Credentials for the naturally credentialed: dirt under the nails, a notebook in the pocket, wonder still intact."
  }
];

let products = [...fallbackProducts];

const state = {
  filter: "all",
  cart: [],
  detailProduct: null,
  isLiveCatalog: false
};

const productGrid = document.querySelector("[data-product-grid]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const productDrawer = document.querySelector("[data-product-drawer]");
const backdrop = document.querySelector("[data-drawer-backdrop]");
const cartCount = document.querySelector("[data-cart-count]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartTotal = document.querySelector("[data-cart-total]");
const shopStatus = document.querySelector("[data-shop-status]");
const checkoutButton = document.querySelector("[data-checkout]");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripHtml(value = "") {
  const element = document.createElement("div");
  element.innerHTML = value;
  return element.textContent || element.innerText || "";
}

function money(value) {
  if (typeof value === "string" && value.trim().startsWith("$")) return value;
  const numeric = Number(value) || 0;
  return `$${numeric.toLocaleString("en-US", { minimumFractionDigits: numeric % 1 ? 2 : 0 })}`;
}

function wooPriceToNumber(product) {
  const raw = product?.prices?.price;
  const minorUnit = product?.prices?.currency_minor_unit ?? 2;
  if (!raw) return 0;
  return Number(raw) / 10 ** minorUnit;
}

function wooPriceText(product) {
  const amount = wooPriceToNumber(product);
  const symbol = product?.prices?.currency_symbol || "$";
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2
  })}`;
}

function categorizeWooProduct(product) {
  const text = `${product.name || ""} ${(product.categories || []).map((category) => category.name).join(" ")}`.toLowerCase();
  if (text.includes("preserve") || text.includes("forest") || text.includes("understory")) return "preserve";
  if (text.includes("league") || text.includes("athletic") || text.includes("varsity") || text.includes("spore")) return "league";
  if (text.includes("strange") || text.includes("midnight") || text.includes("rot") || text.includes("cosmic")) return "strange";
  return "field";
}

function mapWooProduct(product) {
  const category = categorizeWooProduct(product);
  const categoryName = product.categories?.[0]?.name || "Live WooCommerce Product";
  const description = stripHtml(product.short_description || product.description || "").trim();
  return {
    id: `woo-${product.id}`,
    wooId: product.id,
    source: "woo",
    name: stripHtml(product.name || "World Champignons Product"),
    category,
    label: categoryName,
    price: wooPriceToNumber(product),
    priceText: wooPriceText(product),
    color: "#1C1B19",
    mark: stripHtml(product.name || "World Champignons").slice(0, 54),
    type: "tee",
    fit: product.type ? `${product.type} product` : "WooCommerce product",
    story: description || "A live artifact pulled from the World Champignons WooCommerce archive.",
    image: product.images?.[0]?.src || "",
    permalink: product.permalink || `${WOO_CONFIG.siteUrl}/?p=${product.id}`,
    addToCartUrl: `${WOO_CONFIG.siteUrl}/?add-to-cart=${product.id}`
  };
}

async function loadWooProducts() {
  if (!shopStatus) return;
  shopStatus.textContent = "Consulting the live WooCommerce archive...";

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 3200);

  try {
    const response = await fetch(WOO_CONFIG.productsEndpoint, {
      headers: { Accept: "application/json" },
      mode: "cors",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API returned ${response.status}`);
    }

    const liveProducts = await response.json();
    if (!Array.isArray(liveProducts) || liveProducts.length === 0) {
      throw new Error("WooCommerce returned no visible products");
    }

    products = liveProducts.map(mapWooProduct);
    state.isLiveCatalog = true;
    state.cart = [];
    shopStatus.textContent = "Live products pulled from shop.worldchampignons.com.";
    renderProducts();
    renderCart();
  } catch (error) {
    state.isLiveCatalog = false;
    products = [...fallbackProducts];
    shopStatus.textContent = "Live WooCommerce products are blocked here, showing the local specimen cabinet.";
    renderProducts();
    renderCart();
    console.warn("WooCommerce product fetch failed:", error);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function isLightProduct(product) {
  return ["#E8DFCF", "#F4EEDF"].includes(String(product.color).toUpperCase());
}

function productVisual(product) {
  if (product.image) {
    return `
      <div class="product-visual">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
      </div>
    `;
  }

  const lightClass = isLightProduct(product) ? " light" : "";
  const typeClass = product.type === "tee" ? "" : ` ${product.type}`;
  return `
    <div class="product-visual${lightClass}">
      <div class="garment${typeClass}" style="--garment-color: ${escapeHtml(product.color)}">
        <div class="garment-mark">${escapeHtml(product.mark)}</div>
      </div>
    </div>
  `;
}

function productAction(product) {
  if (product.source === "woo") {
    return `<a class="icon-button" href="${escapeHtml(product.addToCartUrl)}" aria-label="Add ${escapeHtml(product.name)} through WooCommerce">+</a>`;
  }

  return `<button class="icon-button" type="button" data-add="${escapeHtml(product.id)}" aria-label="Add ${escapeHtml(product.name)} to cart">+</button>`;
}

function renderProducts() {
  const visible = state.filter === "all"
    ? products
    : products.filter((product) => product.category === state.filter);

  productGrid.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card" data-product-id="${escapeHtml(product.id)}">
          ${productVisual(product)}
          <div class="product-body">
            <span class="product-kicker">${escapeHtml(product.label)}</span>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.story)}</p>
            <div class="product-card-footer">
              <span class="product-price">${escapeHtml(product.priceText || money(product.price))}</span>
              <div>
                <button class="icon-button quick-view" type="button" data-view="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(product.name)}">⌕</button>
                ${productAction(product)}
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  const counts = state.cart.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts)
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);

  const totalQuantity = state.cart.length;
  const total = entries.reduce((sum, product) => sum + product.price * product.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = money(total);
  cartEmpty.hidden = entries.length > 0;

  cartItems.innerHTML = entries
    .map(
      (product) => `
        <div class="cart-line">
          <div class="cart-line-thumb">
            ${
              product.image
                ? `<img src="${escapeHtml(product.image)}" alt="" />`
                : `<span style="--garment-color: ${escapeHtml(product.color)}"></span>`
            }
          </div>
          <div>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${product.quantity} x ${escapeHtml(product.priceText || money(product.price))}</p>
          </div>
          <button type="button" data-remove="${escapeHtml(product.id)}">Remove</button>
        </div>
      `
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (product?.source === "woo") {
    window.location.href = product.addToCartUrl;
    return;
  }

  state.cart.push(id);
  renderCart();
  openCart();
}

function removeFromCart(id) {
  const index = state.cart.indexOf(id);
  if (index > -1) {
    state.cart.splice(index, 1);
  }
  renderCart();
}

function openCart() {
  closeProduct();
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!productDrawer.classList.contains("is-open")) {
    backdrop.hidden = true;
  }
}

function openProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  state.detailProduct = product;
  closeCart();
  document.querySelector("[data-detail-kicker]").textContent = product.label;
  document.querySelector("[data-detail-title]").textContent = product.name;
  document.querySelector("[data-detail-visual]").innerHTML = productVisual(product);
  document.querySelector("[data-detail-story]").textContent = product.story;
  document.querySelector("[data-detail-price]").textContent = product.priceText || money(product.price);
  document.querySelector("[data-detail-fit]").textContent = product.source === "woo" ? "Purchased securely on shop.worldchampignons.com" : product.fit;
  productDrawer.classList.add("is-open");
  productDrawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function closeProduct() {
  productDrawer.classList.remove("is-open");
  productDrawer.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("is-open")) {
    backdrop.hidden = true;
  }
}

function checkout() {
  window.location.href = `${WOO_CONFIG.siteUrl}/cart/`;
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");
  const removeButton = event.target.closest("[data-remove]");
  const filterButton = event.target.closest("[data-filter]");

  if (addButton) {
    addToCart(addButton.dataset.add);
  }

  if (viewButton) {
    openProduct(viewButton.dataset.view);
  }

  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
  }

  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("is-active", button === filterButton);
    });
    renderProducts();
  }
});

document.querySelector("[data-cart-open]").addEventListener("click", openCart);
document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
document.querySelector("[data-detail-close]").addEventListener("click", closeProduct);
document.querySelector("[data-detail-add]").addEventListener("click", () => {
  if (!state.detailProduct) return;
  if (state.detailProduct.source === "woo") {
    window.location.href = state.detailProduct.addToCartUrl;
    return;
  }
  addToCart(state.detailProduct.id);
});
checkoutButton.addEventListener("click", checkout);

backdrop.addEventListener("click", () => {
  closeCart();
  closeProduct();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeProduct();
  }
});

document.querySelector("[data-newsletter]").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("[data-newsletter-message]");
  message.textContent = "You are now on the underground dispatch. Watch the understory.";
  event.currentTarget.reset();
});

renderProducts();
renderCart();
loadWooProducts();
