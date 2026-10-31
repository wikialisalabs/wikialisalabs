/**
 * @axioledger/axio-design-system — typed design token constants.
 *
 * v2: Exposes the full 3-layer token system as TypeScript types and
 * runtime constants. Mirrors primitive.css / semantic.css / component.css.
 *
 * Layer 1 — PRIMITIVE_TOKENS: raw hex values and scale values.
 * Layer 2 — SEMANTIC_TOKENS:  purpose-mapped aliases (light + dark).
 * Layer 3 — COMPONENT_TOKENS: component-scoped tokens.
 *
 * Import these instead of hardcoding hex values in component styles.
 */

// ── Layer types ───────────────────────────────────────────────────────────────

/** A CSS custom property name, e.g. "--axq-p-grey-900" */
export type CSSVar = `--axq-${string}`;

/** Raw hex or rgba colour string */
export type ColorHex = string;

export type TokenLayer = 'primitive' | 'semantic' | 'component';

// ── Layer 1: Primitive token types ────────────────────────────────────────────

export interface PrimitiveColorScale {
  readonly 900: ColorHex;
  readonly 800: ColorHex;
  readonly 700: ColorHex;
  readonly 600: ColorHex;
  readonly 500: ColorHex;
  readonly 400: ColorHex;
  readonly 300: ColorHex;
  readonly 200: ColorHex;
  readonly 100: ColorHex;
  readonly 50:  ColorHex;
  readonly white: ColorHex;
}

export interface PrimitiveStatusColors {
  readonly blue:   ColorHex;  /* info   #0095FF */
  readonly green:  ColorHex;  /* success #00D68F */
  readonly yellow: ColorHex;  /* warning #FFAA00 */
  readonly red:    ColorHex;  /* error  #FF3D71 */
}

export interface PrimitiveBrandColors {
  readonly teal:   ColorHex;
  readonly green:  ColorHex;
  readonly orange: ColorHex;
  readonly pink:   ColorHex;
  readonly purple: ColorHex;
  readonly yellow: ColorHex;
  readonly grey:   ColorHex;
}

export interface PrimitiveFontSizes {
  readonly 10: number; readonly 12: number; readonly 14: number;
  readonly 16: number; readonly 20: number; readonly 24: number;
  readonly 34: number; readonly 48: number; readonly 60: number;
  readonly 96: number;
}

export interface PrimitiveFontWeights {
  readonly regular:  400;
  readonly medium:   500;
  readonly semibold: 600;
}

export interface PrimitiveRadiusScale {
  readonly none: 0;   readonly xs: 2;  readonly sm: 4;
  readonly md: 8;     readonly lg: 12; readonly xl: 16;
  readonly '2xl': 24; readonly '3xl': 32; readonly full: 9999;
}

/** Runtime primitive token constants */
export const PRIMITIVE_TOKENS = {
  color: {
    grey: {
      900: '#000000', 800: '#101426', 700: '#151A30', 600: '#192038',
      500: '#222B45', 400: '#2E3A59', 300: '#8F9BB3', 200: '#C5CEE0',
      100: '#E4E9F2', 50:  '#EDF1F7', white: '#FFFFFF',
    } as PrimitiveColorScale,
    status: {
      blue: '#0095FF', green: '#00D68F', yellow: '#FFAA00', red: '#FF3D71',
    } as PrimitiveStatusColors,
    brand: {
      teal: '#49DBC8', green: '#BEFF6C', orange: '#FC7339',
      pink: '#FD9FDD', purple: '#AF96FB', yellow: '#FFF172', grey: '#EFEFEF',
    } as PrimitiveBrandColors,
  },
  fontSize: {
    10: 10, 12: 12, 14: 14, 16: 16, 20: 20,
    24: 24, 34: 34, 48: 48, 60: 60, 96: 96,
  } as PrimitiveFontSizes,
  fontWeight: {
    regular: 400, medium: 500, semibold: 600,
  } as PrimitiveFontWeights,
  radius: {
    none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, '3xl': 32, full: 9999,
  } as PrimitiveRadiusScale,
  spacing: {
    0: 0, 2: 2, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 14: 14,
    16: 16, 20: 20, 24: 24, 32: 32, 40: 40, 48: 48, 56: 56,
    64: 64, 77: 77, 80: 80, 96: 96, 128: 128,
  },
} as const;

// ── Layer 2: Semantic token types ─────────────────────────────────────────────

export interface SemanticColorGroup {
  /** Light mode value */
  readonly light: ColorHex;
  /** Dark mode value (if different from light) */
  readonly dark:  ColorHex;
}

export interface SemanticStatusGroup {
  readonly default:  ColorHex;
  readonly bg:       ColorHex;
  readonly text:     ColorHex;
  readonly subtle:   ColorHex;
}

export interface SemanticTokenMap {
  text: {
    primary:   SemanticColorGroup;
    secondary: SemanticColorGroup;
    disabled:  SemanticColorGroup;
    inverse:   { light: ColorHex; dark: ColorHex };
    brand:     { light: ColorHex; dark: ColorHex };
  };
  bg: {
    surface:   SemanticColorGroup;
    primary:   SemanticColorGroup;
    secondary: SemanticColorGroup;
    disabled:  SemanticColorGroup;
  };
  border: {
    default:   SemanticColorGroup;
    focus:     SemanticColorGroup;
    error:     { light: ColorHex; dark: ColorHex };
  };
  status: {
    info:     SemanticStatusGroup;
    success:  SemanticStatusGroup;
    warning:  SemanticStatusGroup;
    error:    SemanticStatusGroup;
  };
  radius: {
    button: number; input: number; card: number;
    modal: number;  chip: number;  badge: number;
  };
}

/** Runtime semantic token constants (light mode values) */
export const SEMANTIC_TOKENS = {
  text: {
    primary:   { light: '#222B45', dark: '#E6EDF3' },
    secondary: { light: '#2E3A59', dark: '#8B949E' },
    disabled:  { light: '#8F9BB3', dark: '#484F58' },
    inverse:   { light: '#FFFFFF', dark: '#FFFFFF' },
    brand:     { light: '#000000', dark: '#FFFFFF' },
  },
  bg: {
    surface:   { light: '#FFFFFF', dark: '#1C2128' },
    primary:   { light: '#FFFFFF', dark: '#0D1117' },
    secondary: { light: '#EDF1F7', dark: '#161B22' },
    disabled:  { light: '#E4E9F2', dark: '#484F58' },
  },
  border: {
    default:   { light: '#E4E9F2', dark: '#30363D' },
    focus:     { light: '#0095FF', dark: '#58A6FF' },
    error:     { light: '#FF3D71', dark: '#FF3D71' },
  },
  status: {
    info:    { default: '#0095FF', bg: '#F2F8FF',  text: '#0057C2', subtle: 'rgba(0,149,255,0.12)' },
    success: { default: '#00D68F', bg: '#F0FFF5',  text: '#00997A', subtle: 'rgba(0,214,143,0.12)' },
    warning: { default: '#FFAA00', bg: '#FFFDF2',  text: '#B86E00', subtle: 'rgba(255,170,0,0.12)'  },
    error:   { default: '#FF3D71', bg: '#FFF2F2',  text: '#B81D5B', subtle: 'rgba(255,61,113,0.12)' },
  },
  radius: {
    button: 24, input: 12, card: 16, modal: 24, chip: 9999, badge: 4,
  },
} as const satisfies SemanticTokenMap;

// ── Layer 3: Component token types ────────────────────────────────────────────

export interface ButtonTokens {
  radiusPx:        number;
  paddingYPx:      number;
  paddingXPx:      number;
  iconSizePx:      number;
  filledBg: {
    brand:    ColorHex; dark:    ColorHex; white:   ColorHex;
    disabled: ColorHex; info:    ColorHex; success: ColorHex;
    warning:  ColorHex; error:   ColorHex;
  };
  filledText: {
    default:    ColorHex;
    whiteState: ColorHex;
    disabled:   ColorHex;
  };
  outlinedBorder: {
    brand:   ColorHex; info:    ColorHex; success: ColorHex;
    warning: ColorHex; error:   ColorHex;
  };
  fontSize: { giant: number; large: number; medium: number; small: number };
  height:   { giant: number; large: number; medium: number; small: number };
}

export interface InputTokens {
  radiusPx:    number;
  paddingXPx:  number;
  paddingYPx:  number;
  fontSizePx:  number;
  height:      { lg: number; md: number; sm: number };
}

/** Runtime component token constants */
export const COMPONENT_TOKENS = {
  button: {
    radiusPx:    24,
    paddingYPx:  14,
    paddingXPx:  77,
    iconSizePx:  20,
    filledBg: {
      brand:    '#000000', dark:    '#222B45', white:   '#FFFFFF',
      disabled: '#8F9BB3', info:    '#0095FF', success: '#00D68F',
      warning:  '#FFAA00', error:   '#FF3D71',
    },
    filledText: {
      default:    '#FFFFFF',
      whiteState: '#222B45',
      disabled:   '#8F9BB3',
    },
    outlinedBorder: {
      brand:   '#000000', info:    '#0095FF', success: '#00D68F',
      warning: '#FFAA00', error:   '#FF3D71',
    },
    fontSize: { giant: 20, large: 16, medium: 14, small: 12 },
    height:   { giant: 56, large: 48, medium: 40, small: 32 },
  } as ButtonTokens,
  input: {
    radiusPx:   12,
    paddingXPx: 16,
    paddingYPx:  8,
    fontSizePx: 16,
    height: { lg: 52, md: 44, sm: 36 },
  } as InputTokens,
} as const;

// ── Traffic Light Protocol (TLP) — Namespace Security ────────────────────────

export type TLPLevel = 'safe' | 'caution' | 'blocked' | 'system';

/**
 * Maps each ANS TLD to its TLP security level.
 * Raw hex addresses (0x…) with no ANS registration map to 'blocked'.
 */
export const TLD_TLP_MAP: Record<string, TLPLevel> = {
  axq:  'safe',
  vrq:  'safe',
  kpx:  'caution',
  sqx:  'system',
  vpx:  'system',
} as const;

/**
 * Resolve a name string to a TLP level.
 * - `alice.axq`  → 'safe'
 * - `pool.kpx`   → 'caution'
 * - `node.sqx`   → 'system'
 * - `0x71C...`   → 'blocked'  (raw hex = unverified)
 * - unknown TLD  → 'blocked'
 */
export function resolveTLP(nameOrAddress: string): TLPLevel {
  if (!nameOrAddress) return 'blocked';
  if (nameOrAddress.startsWith('0x')) return 'blocked';
  const parts = nameOrAddress.split('.');
  if (parts.length < 2) return 'blocked';
  const tld = parts[parts.length - 1].toLowerCase();
  return TLD_TLP_MAP[tld] ?? 'blocked';
}

/**
 * TLP_TOKENS — runtime constants mirroring the CSS token layer.
 *
 * These map to the CSS variables defined in:
 *   tokens/semantic.css  (--axq-tlp-*)
 *   tokens/component.css (--axq-c-tlp-*)
 *
 * LEGAL NOTE: Values here are compliance-class signals.
 * The bg/text pairs satisfy WCAG 2.1 AA contrast.
 * Do NOT remap these to arbitrary UI decoration.
 */
export const TLP_TOKENS = {
  safe: {
    /** CSS: --axq-tlp-safe */
    default: '#00D68F',
    /** CSS: --axq-tlp-safe-bg / --axq-c-tlp-safe-bg */
    bg:      '#F0FFF5',
    /** CSS: --axq-tlp-safe-text / --axq-c-tlp-safe-text */
    text:    '#00997A',
    /** CSS: --axq-tlp-safe-border */
    border:  '#00D68F',
    subtle:  'rgba(0, 214, 143, 0.12)',
    label:   'Safe',
    icon:    '✅',
    /** ANS TLDs that resolve to this level */
    tlds:    ['axq', 'vrq'] as const,
  },
  caution: {
    /** CSS: --axq-tlp-caution */
    default: '#FFAA00',
    /** CSS: --axq-tlp-caution-bg */
    bg:      '#FFFDF2',
    /** CSS: --axq-tlp-caution-text */
    text:    '#B86E00',
    border:  '#FFAA00',
    subtle:  'rgba(255, 170, 0, 0.12)',
    label:   'DeFi — Caution',
    icon:    '⚠️',
    tlds:    ['kpx'] as const,
  },
  blocked: {
    /** CSS: --axq-tlp-blocked */
    default: '#FF3D71',
    /** CSS: --axq-tlp-blocked-bg */
    bg:      '#FFF2F2',
    /** CSS: --axq-tlp-blocked-text */
    text:    '#B81D5B',
    /** CSS: --axq-c-input-border-blocked */
    border:  '#FF3D71',
    subtle:  'rgba(255, 61, 113, 0.12)',
    /** Scrim applied over blocked destinations */
    overlay: 'rgba(255, 61, 113, 0.08)',
    label:   'Blocked — Suspicious',
    icon:    '🚫',
    tlds:    [] as const,
  },
  system: {
    /** CSS: --axq-tlp-system */
    default: '#2E3A59',
    /** CSS: --axq-tlp-system-bg */
    bg:      '#EDF1F7',
    /** CSS: --axq-tlp-system-text */
    text:    '#8F9BB3',
    border:  '#C5CEE0',
    subtle:  'rgba(87, 96, 106, 0.10)',
    label:   'System',
    icon:    '⚙️',
    tlds:    ['sqx', 'vpx'] as const,
  },
} as const;

/** TLP CSS variable names for each level (for dynamic style injection) */
export const TLP_CSS_VARS = {
  safe:    { bg: '--axq-c-tlp-safe-bg',    text: '--axq-c-tlp-safe-text',    border: '--axq-c-tlp-safe-border'    },
  caution: { bg: '--axq-c-tlp-caution-bg', text: '--axq-c-tlp-caution-text', border: '--axq-c-tlp-caution-border' },
  blocked: { bg: '--axq-c-tlp-blocked-bg', text: '--axq-c-tlp-blocked-text', border: '--axq-c-tlp-blocked-border' },
  system:  { bg: '--axq-c-tlp-system-bg',  text: '--axq-c-tlp-system-text',  border: '--axq-c-tlp-system-border'  },
} as const satisfies Record<TLPLevel, { bg: string; text: string; border: string }>;

// ── Brand & Status Colors ─────────────────────────────────────────────────────

export const COLOR = {
  // Background
  bgPrimary:   '#FFFFFF',
  bgSecondary: '#F5F6FA',

  // Surface
  surfaceDefault:  '#FFFFFF',
  surfaceRaised:   '#F5F6FA',
  surfaceOverlay:  '#FFFFFF',

  // Text
  textPrimary:   '#1E2A59',
  textSecondary: '#57606A',
  textDisabled:  '#B0BAC9',
  textOnAccent:  '#FFFFFF',
  textLink:      '#0095FF',

  // Border
  borderDefault: '#E5E7EB',
  borderStrong:  '#B0BAC9',
  borderFocus:   '#0095FF',
  borderError:   '#FF3D71',

  // Status
  success:        '#00D68F',
  successSubtle:  'rgba(0, 214, 143, 0.10)',
  warning:        '#FFAA00',
  warningSubtle:  'rgba(255, 170, 0, 0.10)',
  error:          '#FF3D71',
  errorSubtle:    'rgba(255, 61, 113, 0.10)',
  info:           '#0095FF',
  infoSubtle:     'rgba(0, 149, 255, 0.10)',

  // Brand
  brandViolet:  '#AF96FB',
  brandBlue:    '#49DBC8',
  brandMagenta: '#FD9FDD',
  brandOrange:  '#FC7339',
  brandGreeny:  '#BEFF6C',
  brandYellow:  '#FFF172',

  // Dark mode overrides (apply under [data-theme="dark"])
  dark: {
    bgPrimary:   '#0D1117',
    bgSecondary: '#161B22',
    surfaceDefault:  '#1C2128',
    surfaceRaised:   '#22272E',
    surfaceOverlay:  '#2D333B',
    textPrimary:  '#E6EDF3',
    textSecondary:'#8B949E',
    textDisabled: '#484F58',
    borderDefault:'#30363D',
    borderStrong: '#484F58',
    borderFocus:  '#58A6FF',
    info:         '#58A6FF',
  },
} as const;

// ── Typography ────────────────────────────────────────────────────────────────

export const FONT = {
  familyBase:    "'Work Sans', sans-serif",
  familyNumeric: "'Work Sans', monospace",
  weightRegular:  400,
  weightMedium:   500,
  weightSemibold: 600,
} as const;

// ── Spacing / Radius ──────────────────────────────────────────────────────────

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  pill: 999,
} as const;

export const BTN_HEIGHT = {
  giant:  56,
  large:  48,
  medium: 40,
  small:  32,
} as const;

// ── Gradient ──────────────────────────────────────────────────────────────────

export const GRADIENT = {
  cryptoCard:  'linear-gradient(135deg, #1E2A59 0%, #0D1117 100%)',
  brandAccent: 'linear-gradient(90deg, #AF96FB 0%, #49DBC8 100%)',
} as const;

// ── Elevation / Shadow ────────────────────────────────────────────────────────

export const SHADOW = {
  sm:    '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10)',
  md:    '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  lg:    '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
  xl:    '0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)',
  toast: '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)', /* = lg */
} as const;

// ── Component Token Constants ─────────────────────────────────────────────────
// Mirrors component.css Layer 3 additions for Table, Toast, Drawer.

export const TABLE_TOKENS = {
  radius:          16,   /* px — --axq-c-table-radius */
  cellPaddingX:    16,   /* px */
  cellPaddingY:     8,   /* px */
  headerFontSize:  12,   /* px */
  cellFontSize:    14,   /* px */
} as const;

export const TOAST_TOKENS = {
  radius:    8,          /* px — --axq-c-toast-radius */
  paddingX:  16,         /* px */
  paddingY:   8,         /* px */
  maxWidth:  400,        /* px */
  zIndex:    9000,
} as const;

export const DRAWER_TOKENS = {
  radiusTop:      32,    /* px — --axq-c-drawer-radius-top (top corners only) */
  paddingX:       16,    /* px */
  paddingTop:      8,    /* px */
  paddingBottom:  40,    /* px — safe-area offset */
  zIndex:         8000,
} as const;
