import catalog from "../data/catalog.json" with { type: "json" };
import mappings from "../data/fulfillment.json" with { type: "json" };
import { printful } from "./providers.mjs";
import { applyProductPricing } from '../src/pricing.js';
export const productEndpoint = () =>
  process.env.PRINTFUL_PRODUCT_ENDPOINT || "/store/products";
export const hasMappings = () =>
  Object.values(mappings).some((id) => Number.isSafeInteger(id) && id > 0);
export function normalizeVariants(d) {
  return (d.sync_variants || [])
    .filter(
      (v) =>
        v.synced &&
        Number(v.retail_price) > 0 &&
        v.currency === "USD" &&
        v.files?.some(
          (f) => ["default", "front", "front_large"].includes(f.type) && f.status === "ok",
        ),
    )
    .map((v) => ({
      syncVariantId: v.id,
      catalogVariantId: v.variant_id,
      color: v.color,
      size: v.size,
      price: Number(v.retail_price),
      currency: v.currency,
      available: v.availability_status === "active",
      image:
        v.files.find((f) => f.type === "preview")?.preview_url ||
        d.sync_product?.thumbnail_url,
    }));
}
export async function loadCatalog() {
  return Promise.all(
    catalog.map(async (raw) => {
      const p = applyProductPricing(raw);
      const id = mappings[p.id];
      if (!Number.isSafeInteger(id) || id <= 0) return { ...p, variants: [] };
      return {
        ...p,
        variants: normalizeVariants(
          await printful(productEndpoint() + "/" + id),
        ).map((variant) => ({ ...variant,
          price: p.priceOverride ?? variant.price,
          image: p.imagesByColor?.[variant.color] || variant.image,
        })).filter((variant) => p.referenceVariants.some((reference) =>
          reference.color === variant.color && reference.size === variant.size &&
          reference.price === variant.price)),
      };
    }),
  );
}
