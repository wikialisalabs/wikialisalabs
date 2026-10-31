#!/usr/bin/env node
/**
 * check-bundle-size.js
 *
 * Verifies that the gzipped JS bundle stays under the 50KB budget.
 * Run after `pnpm build`.
 *
 * Exit code 0 = pass, 1 = fail.
 */

import { createReadStream }  from 'fs';
import { stat }              from 'fs/promises';
import { createGzip }        from 'zlib';
import { join, dirname }     from 'path';
import { fileURLToPath }     from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST      = join(__dirname, '..', 'dist');

/** Budget in bytes (gzipped) */
const BUDGETS = {
  'index.js':  50 * 1024,   // 50 KB
  'index.cjs': 50 * 1024,
  'styles.css': 25 * 1024,   // 25 KB
};

/**
 * Returns the gzipped size of a file in bytes.
 */
async function gzipSize(filePath) {
  return new Promise((resolve, reject) => {
    let size = 0;
    createReadStream(filePath)
      .pipe(createGzip({ level: 9 }))
      .on('data', (chunk) => { size += chunk.length; })
      .on('end',  () => resolve(size))
      .on('error', reject);
  });
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function main() {
  let allPassed = true;

  console.log('\n── Bundle Size Check ──────────────────────────────');

  for (const [file, budget] of Object.entries(BUDGETS)) {
    const filePath = join(DIST, file);

    // If file doesn't exist (e.g. styles.css missing), skip with warning
    try {
      await stat(filePath);
    } catch {
      console.warn(`  ⚠  ${file} — not found (skipping)`);
      continue;
    }

    const gz = await gzipSize(filePath);
    const ok = gz <= budget;
    const icon = ok ? '✅' : '❌';

    console.log(`  ${icon}  ${file.padEnd(12)} ${fmt(gz).padStart(10)}  /  ${fmt(budget)} budget`);

    if (!ok) {
      console.error(`      ↳ EXCEEDED by ${fmt(gz - budget)}`);
      allPassed = false;
    }
  }

  console.log('───────────────────────────────────────────────────\n');

  if (!allPassed) {
    console.error('❌  Bundle size check FAILED — reduce bundle or increase budget.\n');
    process.exit(1);
  }
  console.log('✅  All bundles within budget.\n');
}

main().catch((err) => {
  console.error('Error running bundle size check:', err);
  process.exit(1);
});
