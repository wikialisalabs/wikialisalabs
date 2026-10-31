/**
 * TLP (Traffic Light Protocol) — Namespace Security Types
 *
 * Every address input and recipient display MUST resolve the ANS namespace
 * before render. The TLP level determines which UI actions are permitted.
 *
 * Rule (HARD — cannot be overridden by consumer):
 *   level === 'blocked'  →  Sign / Send button is disabled, no exception.
 */

export type TLPLevel = 'safe' | 'caution' | 'blocked' | 'system';

export interface TLPConfig {
  color:     string;
  subtle:    string;
  border:    string;
  textColor: string;
  label:     string;
}

export const TLP_MAP: Record<TLPLevel, TLPConfig> = {
  safe: {
    color:     'var(--tlp-safe)',
    subtle:    'var(--tlp-safe-subtle)',
    border:    'var(--tlp-safe-border)',
    textColor: 'var(--tlp-safe-text)',
    label:     'Safe',
  },
  caution: {
    color:     'var(--tlp-caution)',
    subtle:    'var(--tlp-caution-subtle)',
    border:    'var(--tlp-caution-border)',
    textColor: 'var(--tlp-caution-text)',
    label:     'Caution',
  },
  blocked: {
    color:     'var(--tlp-blocked)',
    subtle:    'var(--tlp-blocked-subtle)',
    border:    'var(--tlp-blocked-border)',
    textColor: 'var(--tlp-blocked-text)',
    label:     'Blocked',
  },
  system: {
    color:     'var(--tlp-system)',
    subtle:    'var(--tlp-system-subtle)',
    border:    'var(--tlp-system)',
    textColor: 'var(--color-text-secondary)',
    label:     'System',
  },
};

/**
 * Resolve TLP level from an ANS name or raw address.
 *
 * Namespace → Level mapping:
 *   .axq  .vrq          → safe
 *   .kpx               → caution
 *   .sqx  .vpx          → system
 *   unknown / 0x...     → blocked
 */
export function resolveTLPLevel(name: string): TLPLevel {
  const lower = name.trim().toLowerCase();
  if (/\.(axq|vrq)$/.test(lower)) return 'safe';
  if (/\.kpx$/.test(lower))        return 'caution';
  if (/\.(sqx|vpx)$/.test(lower))  return 'system';
  return 'blocked';
}
