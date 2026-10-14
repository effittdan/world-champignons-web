// Share browsing reads; checkout continues using the uncached catalog loader.
export function cachedCatalog(loader, { ttl = 300000, now = Date.now } = {}) {
  let value, expires = 0, pending;
  return async () => {
    if (value && now() < expires) return value;
    if (!pending) pending = Promise.resolve().then(loader).then(result => {
      value = result;
      expires = now() + ttl;
      return result;
    }).finally(() => { pending = undefined; });
    return pending;
  };
}
