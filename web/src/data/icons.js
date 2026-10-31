// AXQ Docs — Icons data helper
// Loads the pre-built index of all 5130 icon names

let _cache = null;

export async function loadIconIndex() {
  if (_cache) return _cache;
  // Resolve relative to this file's location at runtime
  const base = new URL('.', import.meta.url).href;
  const res = await fetch(base + 'icons-index.json');
  _cache = await res.json();
  return _cache;
}

// Build path to an SVG icon relative to the docs root
export function svgPath(name, variant = 'outline') {
  // From community-docs/index.html, icons are at ../../../../icons/icons/outline/
  return `../../../../icons/icons/${variant}/${name}.svg`;
}
