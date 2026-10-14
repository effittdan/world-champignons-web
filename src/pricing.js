// Shared by the storefront and authoritative checkout calculation.
export const isComfort1717 = (p) => p?.garmentModel === 'comfort-colors-1717' ||
  /comfort colors\s*1717/i.test([p?.type, p?.fullName, p?.description].join(' '));

export function applyProductPricing(p) {
  if (!isComfort1717(p)) return p;
  return { ...p, garmentModel: 'comfort-colors-1717', price: 39,
    priceOverride: 39, freeShipping: true,
    referenceVariants: p.referenceVariants?.map(v => ({ ...v, price: 39 })) };
}

// Repeat groups of three, then a pair or single for the remainder.
export function bundleLines(lines) {
  const count = lines.filter(l => l.bundleEligible).reduce((n, l) => n + l.quantity, 0);
  let tripleUnits = Math.floor(count / 3) * 3;
  const remainderPrice = count % 3 === 2 ? 3600 : 3900;
  return lines.flatMap(line => {
    if (!line.bundleEligible) return [{ ...line }];
    const tripleQuantity = Math.min(tripleUnits, line.quantity);
    tripleUnits -= tripleQuantity;
    const result = [];
    if (tripleQuantity) result.push({ ...line, quantity: tripleQuantity, unitCents: 3300 });
    if (line.quantity > tripleQuantity) result.push({ ...line,
      quantity: line.quantity - tripleQuantity, unitCents: remainderPrice });
    return result;
  });
}

export function cartSelections(items) {
  const merged = new Map();
  for (const i of items) {
    const key = JSON.stringify([i.id, i.color, i.size]);
    const line = merged.get(key) || { id: i.id, color: i.color, size: i.size, qty: 0 };
    line.qty += i.quantity;
    merged.set(key, line);
  }
  return [...merged.values()];
}
