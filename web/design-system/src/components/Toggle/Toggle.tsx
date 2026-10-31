import { useId, useState } from 'react';
import styles from './Toggle.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToggleSize = 'small' | 'medium';

export interface ToggleProps {
  checked?:        boolean;
  defaultChecked?: boolean;
  onChange?:       (checked: boolean) => void;
  disabled?:       boolean;
  /** Visible label text */
  label?:          string;
  /** Label position. Default: 'right' */
  labelPosition?:  'left' | 'right';
  /** Required when no visible label — a11y */
  'aria-label'?:   string;
  size?:           ToggleSize;
  id?:             string;
  name?:           string;
  className?:      string;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

/**
 * Toggle — Binary switch control.
 *
 * Implemented as `<button role="switch" aria-checked>` — NOT <input type="checkbox">
 * so we have full visual control without fighting browser defaults.
 *
 * Token mapping:
 *   active:   var(--color-status-success-default) = #00D68F
 *   inactive: var(--color-surface-raised)
 *   thumb:    #FFFFFF with drop shadow
 *   disabled: var(--color-border-default)
 *   focus:    var(--color-border-focus) 2px offset
 *
 * Sizes:
 *   medium — track 44×24px, thumb 18px
 *   small  — track 36×20px, thumb 14px
 *
 * A11y:
 *   - role="switch" with aria-checked communicates state to AT
 *   - Space toggles (per switch semantics); Enter does NOT toggle
 *   - Visual label linked via aria-labelledby when present
 *   - aria-label required when no visible label
 */
export function Toggle({
  checked:        checkedProp,
  defaultChecked = false,
  onChange,
  disabled       = false,
  label,
  labelPosition  = 'right',
  'aria-label':  ariaLabel,
  size           = 'medium',
  id:            idProp,
  name,
  className,
}: ToggleProps): React.JSX.Element {
  const generatedId = useId();
  const switchId    = idProp ?? `toggle-${generatedId}`;
  const labelId     = `${switchId}-label`;

  // Controlled vs uncontrolled
  const isControlled = checkedProp !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = isControlled ? checkedProp : internal;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Switch role: Space toggles, Enter does NOT (per ARIA spec)
    if (e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
    // Enter key is intentionally ignored for role="switch"
  };

  const trackClasses = [
    styles.track,
    styles[`size-${size}`],
    isChecked  && styles.checked,
    disabled   && styles.disabled,
    className,
  ].filter(Boolean).join(' ');

  const button = (
    <button
      type="button"
      id={switchId}
      role="switch"
      aria-checked={isChecked}
      aria-disabled={disabled || undefined}
      aria-label={!label ? ariaLabel : undefined}
      aria-labelledby={label ? labelId : undefined}
      name={name}
      disabled={disabled}
      className={trackClasses}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  );

  if (!label) return button;

  return (
    <div className={[styles.wrapper, labelPosition === 'left' && styles.labelLeft].filter(Boolean).join(' ')}>
      {labelPosition === 'left' && (
        <label id={labelId} htmlFor={switchId} className={`${styles.label} ${disabled ? styles.labelDisabled : ''}`}>
          {label}
        </label>
      )}
      {button}
      {labelPosition === 'right' && (
        <label id={labelId} htmlFor={switchId} className={`${styles.label} ${disabled ? styles.labelDisabled : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
}
