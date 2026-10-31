import React, { forwardRef, useId } from 'react';
import styles from './Checkbox.module.css';

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Display label next to the checkbox */
  label?:         string;
  /** Indeterminate state (partially checked) */
  indeterminate?: boolean;
  /** Error state */
  error?:         boolean;
  /** Helper text below */
  helperText?:    string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  indeterminate = false,
  error         = false,
  helperText,
  disabled,
  className,
  id: idProp,
  ...props
}, ref) => {
  const autoId  = useId();
  const inputId = idProp ?? autoId;
  const helpId  = `${inputId}-help`;

  // Apply indeterminate via ref callback
  const setRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = indeterminate;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-disabled={disabled ? 'true' : undefined}>
      <label className={styles.label} htmlFor={inputId}>
        <input
          ref={setRef}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-describedby={helperText ? helpId : undefined}
          aria-invalid={error || undefined}
          className={styles.input}
          {...props}
        />
        <span
          className={styles.box}
          data-indeterminate={indeterminate ? 'true' : undefined}
          data-error={error ? 'true' : undefined}
          aria-hidden="true"
        >
          {indeterminate ? (
            <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" rx="1"/></svg>
          ) : (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </span>
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
      {helperText && (
        <span id={helpId} className={[styles.helper, error ? styles.helperError : ''].join(' ')}>
          {helperText}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// ─── RadioButton ──────────────────────────────────────────────────────────────

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Display label next to the radio */
  label?:      string;
  /** Error state */
  error?:      boolean;
  /** Helper text below */
  helperText?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(({
  label,
  error       = false,
  helperText,
  disabled,
  className,
  id: idProp,
  ...props
}, ref) => {
  const autoId  = useId();
  const inputId = idProp ?? autoId;
  const helpId  = `${inputId}-help`;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-disabled={disabled ? 'true' : undefined}>
      <label className={styles.label} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          disabled={disabled}
          aria-describedby={helperText ? helpId : undefined}
          aria-invalid={error || undefined}
          className={styles.radioInput}
          {...props}
        />
        <span className={styles.radioMark} data-error={error ? 'true' : undefined} aria-hidden="true">
          <span className={styles.radioDot} />
        </span>
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
      {helperText && (
        <span id={helpId} className={[styles.helper, error ? styles.helperError : ''].join(' ')}>
          {helperText}
        </span>
      )}
    </div>
  );
});

RadioButton.displayName = 'RadioButton';
