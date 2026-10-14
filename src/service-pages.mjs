import { layout, link, art, esc } from "./views.mjs";
const orderEmail = "info@worldchampignons.com";
const inquiryEmail = "info@worldchampignons.com";
export function checkout() {
  return layout({
    title: "Checkout",
    path: "/checkout",
    kind: "checkout-page",
    body: `<section class="page-intro wrap"><p class="eyebrow">A few good finds</p><h1>Make them yours.</h1></section><section class="wrap checkout-layout"><div><div class="notice" data-checkout-status role="status">Checking checkout availability…</div><form id="checkout-form"><h2>Where are we growing?</h2><p>Enter your delivery address to confirm delivery and calculate applicable tax. Comfort Colors 1717 shirts include free standard shipping.</p><div class="form-grid">${[
      ["name", "Full name", "name"],
      ["email", "Email address", "email"],
      ["address1", "Street address", "address-line1"],
      ["address2", "Apartment, suite (optional)", "address-line2"],
      ["city", "City", "address-level2"],
      ["state_code", "State / province", "address-level1"],
      ["zip", "ZIP / postal code", "postal-code"],
    ]
      .map(
        ([n, l, a]) =>
          `<label class="${["name", "email", "address1", "address2"].includes(n) ? "full" : ""}">${l}<input name="${n}" autocomplete="${a}" ${n === "email" ? 'type="email"' : 'type="text"'} ${n === "address2" ? "" : "required"} maxlength="200"></label>`,
      )
      .join(
        "",
      )}<label>Country<select name="country_code" id="countries"><option value="US">United States</option></select></label></div><button class="button" type="submit" id="quote-button" disabled>Calculate shipping & tax</button></form><div id="payment-options" hidden><h2>Choose how to pay.</h2><div class="payment-buttons"><button class="button" data-pay="stripe">Pay by card ↗</button><button class="button paypal-button" data-pay="paypal">PayPal ↗</button></div><p class="small">Payment opens securely with your selected provider.</p></div><p id="checkout-message" role="status"></p></div><aside class="order-summary"><h2>Your bag</h2><div data-checkout-items></div><div id="quote-totals"></div>${link("/shop", "Continue foraging")}</aside></section>`,
  });
}
export function order() {
  return layout({
    title: "Your Order",
    path: "/order",
    body: `<section class="wrap section narrow"><p class="eyebrow">World Champignons</p><h1 id="order-title">Following the thread.</h1><p id="order-status" role="status">Checking your payment status…</p><p id="order-reference"></p><button class="button" id="refresh-order">Check again</button><p>${link("/shop", "Return to the shop")}</p></section>`,
  });
}
export function formPage(type) {
  const contact = type === "contact";
  return layout({
    title: contact ? "Contact" : "Join the Circle",
    path: "/" + type,
    body: `<section class="wrap section form-page"><div><p class="eyebrow">${contact ? "A conversation starts somewhere" : "The underground dispatch"}</p><h1>${contact ? "Send a little<br>signal." : "Join the<br>Circle."}</h1><p>${contact ? "A question about an order, a design, or something you found underneath? We’re listening." : "New drops, forest transmissions, forbidden footnotes, and better questions."}</p>${contact ? `<p>Order support &amp; general inquiries: <a href="mailto:${inquiryEmail}">${inquiryEmail}</a></p>` : ""}${art("detail", "Small mushrooms in the lush forest")}</div><form class="message-form" data-message-form method="post" action="/api/forms"><input type="hidden" name="form-name" value="${contact ? "contact" : "frequency"}"><div class="honeypot" aria-hidden="true"><label>Leave empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></div>${contact ? '<label>Your name<input name="name" autocomplete="name" required maxlength="120"></label>' : ""}<label>Email address<input type="email" name="email" autocomplete="email" required maxlength="254"></label>${contact ? '<label>Your message<textarea name="message" rows="6" required maxlength="5000"></textarea></label>' : ""}<label class="consent"><input type="checkbox" required> <span>${contact ? "I agree to share these details so World Champignons can respond." : "I’d like to receive emails from World Champignons."} <a href="/privacy">Privacy details</a>.</span></label><button class="button" type="submit">${contact ? "Send message" : "Join the Circle"} ↗</button><p role="status" data-form-status></p></form></section>`,
  });
}
export function infoPage(type) {
  const info = {
    support: [
      "Shipping & returns",
      "A little guidance.",
      `<details open><summary>When can I order?</summary><p>Choose a shirt, color, and size, then continue from your bag to checkout. Enter a US delivery address to review your total and pay securely by card or PayPal.</p></details><details><summary>How much is delivery?</summary><p>Comfort Colors 1717 shirts include free standard shipping to supported delivery destinations. Applicable tax and delivery availability are confirmed for your address at checkout.</p></details><details><summary>What is the returns policy?</summary><p>Each shirt is made to order. We replace or refund items that arrive damaged or incorrect. We do not accept returns for size changes or change of mind. Email <a href="mailto:${orderEmail}">${orderEmail}</a> about an issue with your order.</p></details><details><summary>How do I choose a size?</summary><p>Product pages show the available colors and sizes from Printful. Contact us before ordering if you need help with garment measurements; we do not accept returns for size changes.</p></details>`,
    ],
    privacy: [
      "Privacy",
      "Your corner of the forest.",
      `<h2>Your visit</h2><p>Your bag is stored in this browser so it remains here when you return. This build does not include advertising trackers or third-party analytics.</p><h2>Messages and email signups</h2><p>Information you submit is stored privately for World Champignons to respond or manage your requested signup. We use Netlify Forms to process email notifications to info@worldchampignons.com. An unavailable form reports an error rather than claiming to have sent your message.</p><h2>Orders and payments</h2><p>We use your name, email address, delivery address, and order details to calculate shipping and tax, process your order, and provide support. Stripe processes card payments and PayPal processes PayPal payments on their secure checkout pages. We share your order total and the contact or delivery details needed by your selected payment provider; our storefront does not store your full card number or PayPal password. We share the details needed to produce and deliver your order with Printful. Our website and order records are hosted on SiteGround.</p><h2>Contact and privacy requests</h2><p>For questions about your information or to request access, correction, deletion, or removal from our email list, contact info@worldchampignons.com. Some order records may need to be retained for accounting, tax, fraud prevention, or resolving an order issue.</p>`,
    ],
    terms: [
      "Terms",
      "Before you step inside.",
      `<p>World Champignons is operated by effitt LLC. Prices are in US dollars. Comfort Colors 1717 shirts cost $39 in every offered size, with automatic mix-and-match bundles of 2 for $72 and 3 for $99. Larger bags combine groups of three with a pair or single for the remainder. These shirts include standard shipping to supported US addresses. Applicable tax and the final total are shown before payment.</p><p>Adding an item to your bag does not place an order or reserve stock. Available options and delivery eligibility are checked at checkout. Shirts are made to order through Printful; product mockups illustrate the design and colors may vary between screens and printed garments.</p><p>We replace or refund items that arrive damaged or incorrect. We do not accept returns for size changes or change of mind. Contact info@worldchampignons.com for order help. Review our <a href="/support">shipping and returns information</a> and <a href="/privacy">privacy information</a> before ordering.</p>`,
    ],
  }[type];
  return layout({
    title: info[0],
    path: "/" + type,
    body: `<section class="page-intro wrap"><p class="eyebrow">${info[0]}</p><h1>${info[1]}</h1></section><section class="wrap narrow section prose">${info[2]}<p>${link("/contact", "Contact World Champignons")}</p></section>`,
  });
}
export function notFound() {
  return layout({
    title: "Page Not Found",
    path: "/404",
    body: `<section class="wrap section narrow"><p class="eyebrow">404 / Off the forest path</p><h1>Something hidden.<br>A little too hidden.</h1><p>This page isn’t here. Let’s find our way back.</p>${link("/", "Back to the clearing", "button")}</section>`,
  });
}
