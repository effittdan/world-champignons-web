export const CART_KEY = "wc:moonlit:bag:v1";
export const lineKey = (l) => [l.id, l.color, l.size].join("|");
export function readCart(storage) {
  try {
    const c = JSON.parse(storage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(c) || c.length > 30) return [];
    return c.filter(
      (l) =>
        l &&
        typeof l.id === "string" &&
        typeof l.color === "string" &&
        typeof l.size === "string" &&
        Number.isInteger(l.qty) &&
        l.qty > 0 &&
        l.qty <= 10,
    );
  } catch {
    return [];
  }
}
export function addLine(cart, line) {
  if (!line || !Number.isInteger(line.qty) || line.qty < 1 || line.qty > 10)
    throw Error("Choose a quantity from 1 to 10.");
  const result = cart.map((l) => ({ ...l }));
  const old = result.find((l) => lineKey(l) === lineKey(line));
  if (old) {
    if (old.qty + line.qty > 10)
      throw Error("Choose no more than 10 of each option.");
    old.qty += line.qty;
  } else {
    if (result.length >= 30)
      throw Error("Your bag has reached its item limit.");
    result.push(line);
  }
  if (result.reduce((s, l) => s + l.qty, 0) > 50)
    throw Error("Your bag has reached its item limit.");
  return result;
}
