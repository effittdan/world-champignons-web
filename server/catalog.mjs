const STORE = "https://shop.worldchampignons.com";
export async function catalog(url, fetcher = fetch, checkoutReady = false) {
  const params = new URL(url).searchParams;
  const page = Number(params.get("page") || 1),
    parent = params.get("parent");
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    page > 1000 ||
    (parent && !/^[1-9]\d{0,9}$/.test(parent))
  )
    return { status: 400, body: { error: "Invalid catalog request" } };
  const query = new URLSearchParams({
    per_page: "24",
    page: String(page),
    orderby: "date",
    order: "desc",
  });
  if (parent) {
    query.set("type", "variation");
    query.set("parent", parent);
    query.set("per_page", "100");
  }
  try {
    const response = await fetcher(
      `${STORE}/wp-json/wc/store/v1/products?${query}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!response.ok)
      return { status: 502, body: { error: "Catalog unavailable" } };
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error("Invalid catalog response");
    // Fetch every variation page so sizes are never silently omitted.
    const pages = Number(response.headers.get("x-wp-totalpages") || 1);
    if (parent && pages > 1) {
      if (pages > 20) throw new Error("Variation limit exceeded");
      for (let p = 2; p <= pages; p++) {
        query.set("page", String(p));
        const next = await fetcher(
          `${STORE}/wp-json/wc/store/v1/products?${query}`,
          {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(12000),
          },
        );
        if (!next.ok) throw new Error("Incomplete variations");
        const rows = await next.json();
        if (!Array.isArray(rows)) throw new Error("Invalid variations");
        products.push(...rows);
      }
    }
    return {
      status: 200,
      body: {
        products,
        pages: Number.isInteger(pages) ? pages : 1,
        checkoutReady,
      },
    };
  } catch {
    return { status: 502, body: { error: "Catalog unavailable" } };
  }
}
