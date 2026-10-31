import { forwardRef } from 'react';
import styles from './NamespaceBadge.module.css';
import { resolveTLPLevel, TLP_MAP } from '../../types/tlp';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NamespaceBadgeProps {
  /** ANS name or raw 0x address */
  name:       string;
  /** Show the namespace label next to the TLP dot. Default: true */
  showLabel?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NamespaceBadge = forwardRef<HTMLSpanElement, NamespaceBadgeProps>(({
  name,
  showLabel = true,
  className,
}, ref) => {
  const level = resolveTLPLevel(name);
  const tlp   = TLP_MAP[level];

  return (
    <span
      ref={ref}
      className={[styles.badge, className].filter(Boolean).join(' ')}
      data-tlp={level}
      aria-label={`${name} — TLP ${tlp.label}`}
      title={`TLP: ${tlp.label}`}
    >
      <span className={styles.dot} aria-hidden="true" />
      {showLabel && <span className={styles.name}>{name}</span>}
      <span className={styles.level}>{tlp.label}</span>
    </span>
  );
});

NamespaceBadge.displayName = 'NamespaceBadge';
