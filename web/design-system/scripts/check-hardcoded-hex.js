#!/usr/bin/env node
/**
 * scripts/check-hardcoded-hex.js
 * @axioledger/axio-design-system v6.0.0
 *
 * axio-ds-validate CI step: scan component source files for hardcoded colour
 * values (#RRGGBB, #RGB, rgb(), rgba()) that are NOT inside token definition
 * files or comment blocks.
 *
 * Exits 1 if violations are found — fails the PR.
 *
 * Allowed files (token definitions — hardcoded values are EXPECTED here):
 *   design-system/tokens/*.css
 *   design-system/tokens/*.json
 *   design-system/src/tokens.ts
 *   design-system/tokens/tailwind-tokens.js
 *
 * Scanned files (component source — must use CSS variables only):
 *   design-system/src/components/**/*.tsx
 *   design-system/src/components/**/*.css
 *   apps/axiopass-wallet/src/**/*.tsx
 *   apps/axq-governance-ui/src/**/*.tsx
 *
 * Usage:
 *   node scripts/check-hardcoded-hex.js [--paths <glob1> <glob2>...]
 */

const fs   = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const MONOREPO_ROOT = path.resolve(__dirname, '../..');
const DS_ROOT       = path.resolve(__dirname, '..');

/** Files / directories that are ALLOWED to contain hex values */
const ALLOW_LIST_PREFIXES = [
  path.join(DS_ROOT, 'tokens'),
  path.join(DS_ROOT, 'src', 'tokens.ts'),
  path.join(DS_ROOT, 'src', 'components', 'Icon'),  // auto-generated types
];

/** Directories to scan */
const SCAN_DIRS = [
  path.join(DS_ROOT, 'src', 'components'),
  path.join(MONOREPO_ROOT, 'apps', 'axiopass-wallet', 'src'),
  path.join(MONOREPO_ROOT, 'apps', 'axq-governance-ui', 'src'),
];

/** File extensions to scan */
const EXTENSIONS = ['.tsx', '.ts', '.css', '.module.css'];

/**
 * Patterns that indicate a hardcoded colour.
 * We match:
 *   #ABC or #AABBCC or #AABBCCDD  (hex shorthand / longhand / with alpha)
 *   rgb(...)  / rgba(...)          (functional notation)
 *   hsl(...)  / hsla(...)
 */
const HEX_RE       = /#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
const FUNC_COLOR_RE = /\b(?:rgba?|hsla?)\s*\(/g;

// ─── Scanner ─────────────────────────────────────────────────────────────────

function getAllFiles(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(full, exts));
    } else if (exts.some(e => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function isAllowListed(filePath) {
  return ALLOW_LIST_PREFIXES.some(prefix => filePath.startsWith(prefix));
}

/**
 * Removes block comments and line comments from source so we don't flag
 * colour values that appear only in documentation or comments.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')   // /* block */
    .replace(/\/\/[^\n]*/g, '')          // // line
    .replace(/<!--[\s\S]*?-->/g, '');    // <!-- html -->
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const files = SCAN_DIRS.flatMap(d => getAllFiles(d, EXTENSIONS))
  .filter(f => !isAllowListed(f));

const violations = [];

for (const file of files) {
  const raw    = fs.readFileSync(file, 'utf8');
  const source = stripComments(raw);
  const lines  = source.split('\n');

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;

    // Match hex colours
    const hexMatches = [...line.matchAll(HEX_RE)];
    for (const m of hexMatches) {
      // Allow single-char hex that could be IDs or non-colour refs (#root, etc.)
      if (m[0].length < 4) continue;
      violations.push({
        file:    path.relative(MONOREPO_ROOT, file),
        line:    lineNo,
        match:   m[0],
        context: line.trim(),
        type:    'hex',
      });
    }

    // Match functional colour notation
    if (FUNC_COLOR_RE.test(line)) {
      // Reset lastIndex after test()
      FUNC_COLOR_RE.lastIndex = 0;
      // Allow rgba in CSS token *value* definitions at layer boundaries
      // (we already filter token files via allow-list, but some component CSS
      // may define animation overlays — flag those for review)
      violations.push({
        file:    path.relative(MONOREPO_ROOT, file),
        line:    lineNo,
        match:   line.match(FUNC_COLOR_RE)?.[0] ?? 'rgba?/hsla?',
        context: line.trim(),
        type:    'functional',
      });
    }
  });
}

// ─── Report ───────────────────────────────────────────────────────────────────

if (violations.length === 0) {
  console.log('✅ axio-ds-validate: No hardcoded colour values found in component sources.');
  process.exit(0);
}

console.error(`\n🚫 axio-ds-validate FAILED — ${violations.length} hardcoded colour violation(s):\n`);

const byFile = {};
for (const v of violations) {
  (byFile[v.file] ??= []).push(v);
}

for (const [file, vs] of Object.entries(byFile)) {
  console.error(`  📄 ${file}`);
  for (const v of vs) {
    console.error(`     Line ${v.line}: ${v.match}`);
    console.error(`       → ${v.context.slice(0, 120)}`);
  }
  console.error('');
}

console.error('Fix: Replace hardcoded values with CSS variables from tokens/semantic.css or tokens/component.css.');
console.error('     Examples:');
console.error('       ✗  color: #00D68F;');
console.error('       ✓  color: var(--axq-color-status-success);');
console.error('       ✗  background: rgba(0,149,255,0.1);');
console.error('       ✓  background: var(--axq-color-status-info-subtle);');

process.exit(1);
