import React, { forwardRef } from 'react';
import styles from './Card.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardProps {
  /** Clickable card — applies hover/active/cursor state */
  clickable?:   boolean;
  /** Show border (default true). false = shadow elevation */
  bordered?:    boolean;
  /** Compact padding: 16px instead of 24px */
  compact?:     boolean;
  /** Card header title */
  title?:       string;
  /** Subtitle / description */
  description?: string;
  /** Metadata line — smaller muted text */
  metadata?:    string;
  /** Header right-side action (button, badge, etc.) */
  action?:      React.ReactNode;
  /** Main body slot */
  children?:    React.ReactNode;
  /** Footer slot */
  footer?:      React.ReactNode;
  className?:   string;
  style?:       React.CSSProperties;
  onClick?:     React.MouseEventHandler<HTMLDivElement>;
  /** a11y: required when clickable=true without visible text */
  'aria-label'?: string;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

/**
 * Card — Surface container.
 *
 * Token mapping:
 *   bg          → var(--color-surface-default)
 *   bg-hover    → var(--color-surface-raised)
 *   border      → var(--color-border-default)
 *   title       → var(--color-text-primary)
 *   description → var(--color-text-secondary)
 *   metadata    → var(--color-text-secondary) / caption
 *   padding     → 24px (compact: 16px)
 *   gap         → 12px (compact: 8px)
 *   radius      → var(--radius-lg) = 16px
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    clickable  = false,
    bordered   = true,
    compact    = false,
    title,
    description,
    metadata,
    action,
    children,
    footer,
    className,
    style,
    onClick,
    'aria-label': ariaLabel,
  },
  ref
) {
  const hasHeader = title || description || metadata || action;

  const classes = [
    styles.card,
    bordered   && styles.bordered,
    !bordered  && styles.elevated,
    compact    && styles.compact,
    clickable  && styles.clickable,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      style={style}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      } : undefined}
    >
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title       && <h3 className={styles.title}>{title}</h3>}
            {description && <p  className={styles.description}>{description}</p>}
            {metadata    && <p  className={styles.metadata}>{metadata}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}

      {children && (
        <div className={styles.body}>{children}</div>
      )}

      {footer && (
        <div className={styles.footer}>{footer}</div>
      )}
    </div>
  );
});

Card.displayName = 'Card';
