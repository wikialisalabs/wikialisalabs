/**
 * @axioledger/axio-design-system v6.0.0 — Tailwind CSS Token Bridge
 *
 * Maps the AXQ Design System 3-layer token system to Tailwind's theme config.
 * Consumes CSS Custom Properties so Tailwind utilities inherit token values.
 *
 * Usage in tailwind.config.ts:
 *   import axioTokens from '@axioledger/axio-design-system/tokens/tailwind';
 *   export default { theme: { extend: axioTokens } };
 *
 * Then in your app root:
 *   import '@axioledger/axio-design-system/tokens';
 */

/** @type {import('tailwindcss').Config['theme']} */
const axioTokens = {
  colors: {
    // ── Primitive greyscale ────────────────────────────────────────
    'axq-grey-900':  'var(--axq-p-grey-900)',
    'axq-grey-800':  'var(--axq-p-grey-800)',
    'axq-grey-700':  'var(--axq-p-grey-700)',
    'axq-grey-600':  'var(--axq-p-grey-600)',
    'axq-grey-500':  'var(--axq-p-grey-500)',
    'axq-grey-400':  'var(--axq-p-grey-400)',
    'axq-grey-300':  'var(--axq-p-grey-300)',
    'axq-grey-200':  'var(--axq-p-grey-200)',
    'axq-grey-100':  'var(--axq-p-grey-100)',
    'axq-grey-50':   'var(--axq-p-grey-50)',
    'axq-white':     'var(--axq-p-white)',

    // ── Brand accent palette ───────────────────────────────────────
    'axq-brand-teal':   'var(--axq-p-brand-teal)',
    'axq-brand-green':  'var(--axq-p-brand-green)',
    'axq-brand-orange': 'var(--axq-p-brand-orange)',
    'axq-brand-pink':   'var(--axq-p-brand-pink)',
    'axq-brand-purple': 'var(--axq-p-brand-purple)',
    'axq-brand-yellow': 'var(--axq-p-brand-yellow)',
    'axq-brand-grey':   'var(--axq-p-brand-grey)',

    // ── Status primitives ──────────────────────────────────────────
    'axq-info':    'var(--axq-p-blue-500)',
    'axq-success': 'var(--axq-p-green-500)',
    'axq-warning': 'var(--axq-p-yellow-500)',
    'axq-error':   'var(--axq-p-red-500)',

    // ── Semantic: text ─────────────────────────────────────────────
    'axq-text-primary':   'var(--axq-color-text-primary)',
    'axq-text-secondary': 'var(--axq-color-text-secondary)',
    'axq-text-disabled':  'var(--axq-color-text-disabled)',
    'axq-text-inverse':   'var(--axq-color-text-inverse)',
    'axq-text-brand':     'var(--axq-color-text-brand)',
    'axq-text-link':      'var(--axq-color-text-link)',

    // ── Semantic: background ───────────────────────────────────────
    'axq-bg-surface':   'var(--axq-color-bg-surface)',
    'axq-bg-primary':   'var(--axq-color-bg-primary)',
    'axq-bg-secondary': 'var(--axq-color-bg-secondary)',
    'axq-bg-disabled':  'var(--axq-color-bg-disabled)',
    'axq-bg-brand':     'var(--axq-color-bg-brand)',

    // ── Semantic: border ───────────────────────────────────────────
    'axq-border-default':  'var(--axq-color-border-default)',
    'axq-border-strong':   'var(--axq-color-border-strong)',
    'axq-border-subtle':   'var(--axq-color-border-subtle)',
    'axq-border-focus':    'var(--axq-color-border-focus)',
    'axq-border-error':    'var(--axq-color-border-error)',
    'axq-border-disabled': 'var(--axq-color-border-disabled)',

    // ── Status semantic ────────────────────────────────────────────
    'axq-status-info':            'var(--axq-color-status-info)',
    'axq-status-info-bg':         'var(--axq-color-status-info-bg)',
    'axq-status-info-text':       'var(--axq-color-status-info-text)',
    'axq-status-success':         'var(--axq-color-status-success)',
    'axq-status-success-bg':      'var(--axq-color-status-success-bg)',
    'axq-status-success-text':    'var(--axq-color-status-success-text)',
    'axq-status-warning':         'var(--axq-color-status-warning)',
    'axq-status-warning-bg':      'var(--axq-color-status-warning-bg)',
    'axq-status-warning-text':    'var(--axq-color-status-warning-text)',
    'axq-status-error':           'var(--axq-color-status-error)',
    'axq-status-error-bg':        'var(--axq-color-status-error-bg)',
    'axq-status-error-text':      'var(--axq-color-status-error-text)',

    // ── TLP security levels (compliance-class — do not remap) ─────
    'axq-tlp-safe':         'var(--axq-tlp-safe)',
    'axq-tlp-safe-bg':      'var(--axq-tlp-safe-bg)',
    'axq-tlp-safe-text':    'var(--axq-tlp-safe-text)',
    'axq-tlp-caution':      'var(--axq-tlp-caution)',
    'axq-tlp-caution-bg':   'var(--axq-tlp-caution-bg)',
    'axq-tlp-caution-text': 'var(--axq-tlp-caution-text)',
    'axq-tlp-blocked':      'var(--axq-tlp-blocked)',
    'axq-tlp-blocked-bg':   'var(--axq-tlp-blocked-bg)',
    'axq-tlp-blocked-text': 'var(--axq-tlp-blocked-text)',
    'axq-tlp-system':       'var(--axq-tlp-system)',
    'axq-tlp-system-bg':    'var(--axq-tlp-system-bg)',
    'axq-tlp-system-text':  'var(--axq-tlp-system-text)',
  },

  fontFamily: {
    axq:         ['Work Sans', 'sans-serif'],
    'axq-mono':  ['Work Sans', 'monospace'],
  },

  fontSize: {
    'axq-overline': ['var(--axq-type-overline)', { lineHeight: '1.4' }],
    'axq-caption':  ['var(--axq-type-caption)',  { lineHeight: '1.5' }],
    'axq-body-sm':  ['var(--axq-type-body-sm)',  { lineHeight: '1.6' }],
    'axq-body':     ['var(--axq-type-body)',      { lineHeight: '1.6' }],
    'axq-h6':       ['var(--axq-type-h6)',        { lineHeight: '1.4' }],
    'axq-h5':       ['var(--axq-type-h5)',        { lineHeight: '1.3' }],
    'axq-h4':       ['var(--axq-type-h4)',        { lineHeight: '1.25' }],
    'axq-h3':       ['var(--axq-type-h3)',        { lineHeight: '1.2' }],
    'axq-h2':       ['var(--axq-type-h2)',        { lineHeight: '1.15' }],
    'axq-h1':       ['var(--axq-type-h1)',        { lineHeight: '1.1' }],
  },

  borderRadius: {
    'axq-button':  'var(--axq-radius-button)',   /* 24px */
    'axq-input':   'var(--axq-radius-input)',    /* 12px */
    'axq-card':    'var(--axq-radius-card)',     /* 16px */
    'axq-modal':   'var(--axq-radius-modal)',    /* 24px */
    'axq-chip':    'var(--axq-radius-chip)',     /* 9999px */
    'axq-badge':   'var(--axq-radius-badge)',    /* 4px */
    'axq-tooltip': 'var(--axq-radius-tooltip)',  /* 8px */
    'axq-avatar':  'var(--axq-radius-avatar)',   /* 9999px */
  },

  boxShadow: {
    'axq-sm':    'var(--axq-shadow-sm)',
    'axq-md':    'var(--axq-shadow-md)',
    'axq-lg':    'var(--axq-shadow-lg)',
    'axq-xl':    'var(--axq-shadow-xl)',
    'axq-toast': 'var(--axq-shadow-toast)',
  },

  spacing: {
    'axq-0':   'var(--axq-p-space-0)',
    'axq-2':   'var(--axq-p-space-2)',
    'axq-4':   'var(--axq-p-space-4)',
    'axq-6':   'var(--axq-p-space-6)',
    'axq-8':   'var(--axq-p-space-8)',
    'axq-10':  'var(--axq-p-space-10)',
    'axq-12':  'var(--axq-p-space-12)',
    'axq-16':  'var(--axq-p-space-16)',
    'axq-20':  'var(--axq-p-space-20)',
    'axq-24':  'var(--axq-p-space-24)',
    'axq-32':  'var(--axq-p-space-32)',
    'axq-40':  'var(--axq-p-space-40)',
    'axq-48':  'var(--axq-p-space-48)',
    'axq-64':  'var(--axq-p-space-64)',
    'axq-80':  'var(--axq-p-space-80)',
    'axq-96':  'var(--axq-p-space-96)',
    'axq-128': 'var(--axq-p-space-128)',
  },
};

module.exports = axioTokens;
