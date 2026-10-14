# Comfort Colors 1717 pricing

Merchant instruction, October 14, 2026: every Comfort Colors 1717 shirt is $39 in every offered size, with free standard shipping to supported US destinations. Mix-and-match bundles apply automatically: 2 for $72 and 3 for $99, before tax.

Larger quantities repeat triples, followed by a pair or single: 4 = $138, 5 = $171, 6 = $198. No coupon required. Designs, colors and sizes may be combined.

`src/pricing.js` is the shared pricing authority. New catalog entries should set `garmentModel: "comfort-colors-1717"`; explicit Comfort Colors 1717 text in the product type/name/description is also recognized. Build output and the live catalog apply the $39/free-shipping rule; checkout independently enforces it. Other garment models retain their own pricing and shipping.

Bundle prices are allocated to order lines before tax and payment calculations. Split variants are merged back into selections for payment-time availability and price verification. Printful receives the paid retail amounts; its fulfillment costs are unchanged.

Validation: 24 automated checks pass, including single/pair/triple/repeated bundles, mixed eligible and ineligible products, shipping, future-product defaults and payment revalidation. Browser bag checks show $72 with $6 savings and $99 with $18 savings.

Live release verified October 14, 2026: SiteGround reported Deployed. Public product/shop copy and shared pricing module are live. Live quotes returned subtotals 3900/7200/9900/13800 cents for 1/2/3/4 shirts, all with zero shipping. A mixed-design four-shirt quote returned 13800 cents and Stripe checkout session creation succeeded. No payment or fulfillment order was submitted. Screenshot: bundle-pricing-live-20261014.png. Original browser bag quantity restored after verification.
