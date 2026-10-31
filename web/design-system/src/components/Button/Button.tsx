import React, { forwardRef } from 'react';
import styles from './Button.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'filled' | 'outlined' | 'ghost';
export type ButtonColor   = 'black' | 'blue' | 'green' | 'yellow' | 'orange' | 'error' | 'navy' | 'white';
export type ButtonSize    = 'giant' | 'large' | 'medium' | 'small';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Default: 'filled' */
  variant?:   ButtonVariant;
  /** Color palette. Default: 'blue' */
  color?:     ButtonColor;
  /** Size. Default: 'medium' */
  size?:      ButtonSize;
  /** Show loading spinner, replaces children */
  loading?:   boolean;
  /** Stretch to 100% of parent width */
  fullWidth?: boolean;
  /** Icon placed before label */
  iconLeft?:  React.ReactNode;
  /** Icon placed after label */
  iconRight?: React.ReactNode;
  /**
   * Icon-only mode — renders a square/circle button.
   * aria-label is REQUIRED when iconOnly=true (a11y).
   */
  iconOnly?:  boolean;
  children?:  React.ReactNode;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner(): React.JSX.Element {
  return (
    <svg
      className={styles.spinner}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="10"
      />
    </svg>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

/**
 * Button — Core interactive element.
 *
 * Matrix: 3 variants × 8 colors × 4 sizes × 5 states × 4 icon positions
 *
 * A11y rules:
 *   - iconOnly=true requires aria-label (enforced via prop type comment)
 *   - disabled state uses aria-disabled + CSS pointer-events:none
 *   - loading state uses aria-busy="true" and hides spinner from screen readers
 *   - Focus ring via :focus-visible (not :focus) — respects keyboard-only users
 *
 * Contrast compliance (WCAG 2.1 AA):
 *   - yellow, green, warning buttons use --color-text-primary (dark) NOT white
 *   - All other filled buttons use --color-text-on-accent (white)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant   = 'filled',
    color     = 'blue',
    size      = 'medium',
    loading   = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    iconOnly  = false,
    disabled,
    children,
    className,
    onClick,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  const classes = [
    styles.btn,
    styles[`variant-${variant}`],
    styles[`color-${color}`],
    styles[`size-${size}`],
    fullWidth  && styles.fullWidth,
    iconOnly   && styles.iconOnly,
    loading    && styles.loading,
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {/* Keep original children in DOM for layout stability, hidden from a11y */}
          <span className={styles.loadingText} aria-hidden="true">
            {children}
          </span>
        </>
      ) : (
        <>
          {iconLeft  && <span className={styles.iconLeft}  aria-hidden="true">{iconLeft}</span>}
          {!iconOnly && <span className={styles.label}>{children}</span>}
          {iconOnly  && <span aria-hidden="true">{children}</span>}
          {iconRight && <span className={styles.iconRight} aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
