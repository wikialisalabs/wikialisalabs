import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

/**
 * Vite library build configuration.
 *
 * Outputs:
 *   dist/index.js    — ES module (tree-shakeable)
 *   dist/index.cjs   — CommonJS (Next.js SSR / Jest)
 *   dist/styles.css  — All component CSS (merged, no runtime)
 *
 * Peer dependencies (react, react-dom) are externalized — not bundled.
 */
export default defineConfig({
  plugins: [
    react(),
    dts({
      project: './tsconfig.lib.json',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],

  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AxioDesignSystem',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },

    rollupOptions: {
      // Do not bundle peer deps
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        // Tree-shaking: preserve modules lets consumers import only what they use
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'styles.css';
          return assetInfo.name ?? 'asset';
        },
      },
    },

    // Inline CSS into a single styles.css (no CSS code split)
    cssCodeSplit: false,

    // Target modern browsers — aligns with Next.js 15 default
    target: 'es2020',

    // Source maps for debugging in consuming apps
    sourcemap: true,

    // Fail on bundle > 500KB (pre-gzip) as a safety guard
    chunkSizeWarningLimit: 500,
  },
});
