// AXQ Docs — Token data loader
// Embeds token data directly (no fetch needed for static serving)

// ── Primitive Colors ──────────────────────────────────────────────────────────
export const PRIMITIVE_COLORS = [
  // Brand
  { group: 'Brand', name: 'brand-teal',   cssVar: '--axq-brand-teal',   hex: '#49DBC8' },
  { group: 'Brand', name: 'brand-green',  cssVar: '--axq-brand-green',  hex: '#BEFF6C' },
  { group: 'Brand', name: 'brand-orange', cssVar: '--axq-brand-orange', hex: '#FC7339' },
  { group: 'Brand', name: 'brand-pink',   cssVar: '--axq-brand-pink',   hex: '#FD9FDD' },
  { group: 'Brand', name: 'brand-purple', cssVar: '--axq-brand-purple', hex: '#AF96FB' },
  { group: 'Brand', name: 'brand-yellow', cssVar: '--axq-brand-yellow', hex: '#FFF172' },
  { group: 'Brand', name: 'brand-grey',   cssVar: '--axq-brand-grey',   hex: '#EFEFEF' },
  { group: 'Base',  name: 'black',        cssVar: '--axq-black',        hex: '#000000' },
  { group: 'Base',  name: 'white',        cssVar: '--axq-white',        hex: '#FFFFFF' },
  // Greyscale
  ...[100,200,300,400,500,600,700,800,900].map((n,i) => ({
    group: 'Greyscale', name: `greyscale-${n}`, cssVar: `--axq-greyscale-${n}`,
    hex: ['#EDF1F7','#E4E9F2','#C5CEE0','#8F9BB3','#2E3A59','#222B45','#192038','#151A30','#101426'][i]
  })),
  // Info
  ...[100,200,300,400,500,600,700,800,900].map((n,i) => ({
    group: 'Info', name: `info-${n}`, cssVar: `--axq-info-${n}`,
    hex: ['#F2F8FF','#C7E2FF','#94CBFF','#42AAFF','#0095FF','#006FD6','#0057C2','#0041A8','#002885'][i]
  })),
  // Success
  ...[100,200,300,400,500,600,700,800,900].map((n,i) => ({
    group: 'Success', name: `success-${n}`, cssVar: `--axq-success-${n}`,
    hex: ['#F0FFF5','#CCFCE3','#8CFAC7','#2CE59B','#00D68F','#00B887','#00997A','#007D6C','#004A45'][i]
  })),
  // Warning
  ...[100,200,300,400,500,600,700,800,900].map((n,i) => ({
    group: 'Warning', name: `warning-${n}`, cssVar: `--axq-warning-${n}`,
    hex: ['#FFFDF2','#FFF1C2','#FFE59E','#FFC94D','#FFAA00','#DB8B00','#B86E00','#945400','#703C00'][i]
  })),
  // Error
  ...[100,200,300,400,500,600,700,800,900].map((n,i) => ({
    group: 'Error', name: `error-${n}`, cssVar: `--axq-error-${n}`,
    hex: ['#FFF2F2','#FFD6D9','#FFA8B4','#FF708D','#FF3D71','#DB2C66','#B81D5B','#94124E','#700940'][i]
  })),
];

// ── Primitive Spacing ─────────────────────────────────────────────────────────
export const PRIMITIVE_SPACING = [0,2,4,6,8,10,12,16,20,24,32,40,48,56,64,80,96,128].map(v => ({
  name: `space-${v}`, cssVar: `--axq-space-${v}`, value: v, unit: 'px'
}));

// ── Primitive Radius ──────────────────────────────────────────────────────────
export const PRIMITIVE_RADIUS = [
  { name: 'radius-none', cssVar: '--axq-radius-none', value: 0,    unit: 'px' },
  { name: 'radius-xs',   cssVar: '--axq-radius-xs',   value: 2,    unit: 'px' },
  { name: 'radius-sm',   cssVar: '--axq-radius-sm',   value: 4,    unit: 'px' },
  { name: 'radius-md',   cssVar: '--axq-radius-md',   value: 8,    unit: 'px' },
  { name: 'radius-lg',   cssVar: '--axq-radius-lg',   value: 12,   unit: 'px' },
  { name: 'radius-xl',   cssVar: '--axq-radius-xl',   value: 16,   unit: 'px' },
  { name: 'radius-2xl',  cssVar: '--axq-radius-2xl',  value: 24,   unit: 'px' },
  { name: 'radius-3xl',  cssVar: '--axq-radius-3xl',  value: 32,   unit: 'px' },
  { name: 'radius-full', cssVar: '--axq-radius-full', value: 9999, unit: 'px' },
];

// ── Semantic Colors (light) ───────────────────────────────────────────────────
export const SEMANTIC_COLORS = [
  // Background
  { group: 'Background', name: 'bg-primary',   cssVar: '--axq-bg-primary',   hex: '#FFFFFF' },
  { group: 'Background', name: 'bg-secondary',  cssVar: '--axq-bg-secondary',  hex: '#EDF1F7' },
  { group: 'Background', name: 'bg-tertiary',   cssVar: '--axq-bg-tertiary',   hex: '#E4E9F2' },
  { group: 'Background', name: 'bg-inverse',    cssVar: '--axq-bg-inverse',    hex: '#101426' },
  { group: 'Background', name: 'bg-brand',      cssVar: '--axq-bg-brand',      hex: '#000000' },
  { group: 'Background', name: 'bg-disabled',   cssVar: '--axq-bg-disabled',   hex: '#E4E9F2' },
  // Text
  { group: 'Text', name: 'text-primary',   cssVar: '--axq-text-primary',   hex: '#101426' },
  { group: 'Text', name: 'text-secondary',  cssVar: '--axq-text-secondary',  hex: '#2E3A59' },
  { group: 'Text', name: 'text-tertiary',   cssVar: '--axq-text-tertiary',   hex: '#8F9BB3' },
  { group: 'Text', name: 'text-inverse',    cssVar: '--axq-text-inverse',    hex: '#FFFFFF' },
  { group: 'Text', name: 'text-disabled',   cssVar: '--axq-text-disabled',   hex: '#C5CEE0' },
  { group: 'Text', name: 'text-on-color',   cssVar: '--axq-text-on-color',   hex: '#FFFFFF' },
  // Border
  { group: 'Border', name: 'border-default', cssVar: '--axq-border-default', hex: '#E4E9F2' },
  { group: 'Border', name: 'border-strong',  cssVar: '--axq-border-strong',  hex: '#C5CEE0' },
  // Status
  { group: 'Status', name: 'status-info-default',    cssVar: '--axq-status-info',    hex: '#0095FF' },
  { group: 'Status', name: 'status-success-default', cssVar: '--axq-status-success', hex: '#00D68F' },
  { group: 'Status', name: 'status-warning-default', cssVar: '--axq-status-warning', hex: '#FFAA00' },
  { group: 'Status', name: 'status-error-default',   cssVar: '--axq-status-error',   hex: '#FF3D71' },
];

// ── Component Tokens ──────────────────────────────────────────────────────────
export const COMPONENT_TOKENS = [
  // Button
  { component: 'Button', name: 'button-primary-bg',     cssVar: '--axq-button-primary-bg',     type: 'color',  hex: '#000000' },
  { component: 'Button', name: 'button-primary-text',   cssVar: '--axq-button-primary-text',   type: 'color',  hex: '#FFFFFF' },
  { component: 'Button', name: 'button-primary-border', cssVar: '--axq-button-primary-border', type: 'color',  hex: '#000000' },
  { component: 'Button', name: 'button-info-bg',        cssVar: '--axq-button-info-bg',        type: 'color',  hex: '#0095FF' },
  { component: 'Button', name: 'button-success-bg',     cssVar: '--axq-button-success-bg',     type: 'color',  hex: '#00D68F' },
  { component: 'Button', name: 'button-warning-bg',     cssVar: '--axq-button-warning-bg',     type: 'color',  hex: '#FFAA00' },
  { component: 'Button', name: 'button-danger-bg',      cssVar: '--axq-button-danger-bg',      type: 'color',  hex: '#FF3D71' },
  { component: 'Button', name: 'button-disabled-bg',    cssVar: '--axq-button-disabled-bg',    type: 'color',  hex: '#E4E9F2' },
  { component: 'Button', name: 'button-ghost-bg',       cssVar: '--axq-button-ghost-bg',       type: 'color',  hex: '#FFFFFF' },
  { component: 'Button', name: 'button-ghost-border',   cssVar: '--axq-button-ghost-border',   type: 'color',  hex: '#E4E9F2' },
  { component: 'Button', name: 'button-padding-x',      cssVar: '--axq-button-padding-x',      type: 'number', value: '16px' },
  { component: 'Button', name: 'button-padding-y',      cssVar: '--axq-button-padding-y',      type: 'number', value: '8px' },
  { component: 'Button', name: 'button-radius',         cssVar: '--axq-button-radius',         type: 'number', value: '24px' },
  { component: 'Button', name: 'button-font-size',      cssVar: '--axq-button-font-size',      type: 'number', value: '16px' },
  // Badge
  { component: 'Badge', name: 'badge-default-bg',   cssVar: '--axq-badge-default-bg',   type: 'color',  hex: '#EDF1F7' },
  { component: 'Badge', name: 'badge-default-text', cssVar: '--axq-badge-default-text', type: 'color',  hex: '#2E3A59' },
  { component: 'Badge', name: 'badge-radius',       cssVar: '--axq-badge-radius',       type: 'number', value: '9999px' },
  // Input
  { component: 'Input', name: 'input-bg',           cssVar: '--axq-input-bg',           type: 'color',  hex: '#FFFFFF' },
  { component: 'Input', name: 'input-border',       cssVar: '--axq-input-border',       type: 'color',  hex: '#E4E9F2' },
  { component: 'Input', name: 'input-text',         cssVar: '--axq-input-text',         type: 'color',  hex: '#101426' },
  { component: 'Input', name: 'input-placeholder',  cssVar: '--axq-input-placeholder',  type: 'color',  hex: '#8F9BB3' },
  { component: 'Input', name: 'input-radius',       cssVar: '--axq-input-radius',       type: 'number', value: '8px' },
  // Card
  { component: 'Card', name: 'card-bg',     cssVar: '--axq-card-bg',     type: 'color',  hex: '#FFFFFF' },
  { component: 'Card', name: 'card-border', cssVar: '--axq-card-border', type: 'color',  hex: '#E4E9F2' },
  { component: 'Card', name: 'card-radius', cssVar: '--axq-card-radius', type: 'number', value: '16px' },
  // Toggle
  { component: 'Toggle', name: 'toggle-on-bg',    cssVar: '--axq-toggle-on-bg',    type: 'color', hex: '#000000' },
  { component: 'Toggle', name: 'toggle-off-bg',   cssVar: '--axq-toggle-off-bg',   type: 'color', hex: '#C5CEE0' },
  { component: 'Toggle', name: 'toggle-thumb-bg', cssVar: '--axq-toggle-thumb-bg', type: 'color', hex: '#FFFFFF' },
  // Navbar
  { component: 'Navbar', name: 'navbar-bg',     cssVar: '--axq-navbar-bg',     type: 'color',  hex: '#FFFFFF' },
  { component: 'Navbar', name: 'navbar-border', cssVar: '--axq-navbar-border', type: 'color',  hex: '#E4E9F2' },
  { component: 'Navbar', name: 'navbar-text',   cssVar: '--axq-navbar-text',   type: 'color',  hex: '#101426' },
  { component: 'Navbar', name: 'navbar-height', cssVar: '--axq-navbar-height', type: 'number', value: '56px' },
];
