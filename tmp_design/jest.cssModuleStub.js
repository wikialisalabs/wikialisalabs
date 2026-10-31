// CSS Module stub — returns an ES module proxy so any className access returns the key itself.
// This lets components render without errors in jsdom while keeping class names readable.
module.exports = new Proxy(
  {},
  { get: (_, prop) => (typeof prop === 'string' ? prop : undefined) }
);
