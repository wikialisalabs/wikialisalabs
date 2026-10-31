import React from 'react';
import styles from './Badge.module.css';

// ─── Badge ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'info' | 'success' | 'warning' | 'error' | 'default';

export interface BadgeProps {
  /** Color variant. Default: 'default' */
  variant?:   BadgeVariant;
  /** Dot-only mode — no text, just a colored indicator dot */
  dot?:       boolean;
  children?:  React.ReactNode;
  className?: string;
}

/**
 * Badge — Status label for contextual information.
 *
 * Contrast compliance: all text colors are shade-700 on subtle bg — WCAG AA ✓
 */
export function Badge({
  variant   = 'default',
  dot       = false,
  children,
  className,
}: BadgeProps): React.JSX.Element {
  if (dot) {
    return (
      <span
        className={[styles.dot, styles[`dot-${variant}`], className].filter(Boolean).join(' ')}
        role="status"
        aria-label={`${variant} indicator`}
      />
    );
  }

  return (
    <span className={[styles.badge, styles[`badge-${variant}`], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

export interface ChipProps {
  /** Active / selected state */
  active?:    boolean;
  /** Show remove (×) button */
  removable?: boolean;
  onRemove?:  () => void;
  onClick?:   React.MouseEventHandler<HTMLButtonElement>;
  disabled?:  boolean;
  children:   React.ReactNode;
  className?: string;
}

/**
 * Chip — Selectable filter tag.
 *
 * Renders as <button> for full keyboard + click support.
 * Active state: black bg / white text (inverted in dark mode).
 */
export function Chip({
  active    = false,
  removable = false,
  onRemove,
  onClick,
  disabled  = false,
  children,
  className,
}: ChipProps): React.JSX.Element {
  const classes = [
    styles.chip,
    active    && styles.chipActive,
    disabled  && styles.chipDisabled,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-disabled={disabled}
    >
      <span className={styles.chipLabel}>{children}</span>
      {removable && (
        <span
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={styles.chipRemove}
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove?.();
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }
          }}
        >
          ×
        </span>
      )}
    </button>
  );
}
