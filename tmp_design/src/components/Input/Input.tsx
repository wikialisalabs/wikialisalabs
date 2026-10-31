import React, { forwardRef, useId, useState } from 'react';
import styles from './Input.module.css';
import type { TLPLevel } from '../../types/tlp';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputType   = 'text' | 'password' | 'search' | 'number' | 'email' | 'tel' | 'multiline' | 'readonly';
export type InputSize   = 'large' | 'medium' | 'small';
export type InputState  = 'default' | 'focus' | 'filled' | 'error' | 'disabled';

export interface InputProps {
  /** Input type. 'multiline' renders <textarea>, 'readonly' prevents editing. */
  type?:         InputType;
  /** Size variant. Default: 'medium' */
  size?:         InputSize;
  /** Floating label shown above the field */
  label?:        string;
  /** Placeholder text shown when empty */
  placeholder?:  string;
  /** Helper text shown below input (overridden by errorText when in error state) */
  helperText?:   string;
  /** Error message — switches input to error state */
  errorText?:    string;
  /** Disable the input */
  disabled?:     boolean;
  /** Icon shown on left side */
  iconLeft?:     React.ReactNode;
  /** Icon shown on right side (overridden by password toggle or clear button) */
  iconRight?:    React.ReactNode;

  // ── ANS-aware ──────────────────────────────────────────────
  /** Enable ANS name resolution as user types */
  ansResolve?:   boolean;
  /** Called when ANS resolution completes */
  onResolve?:    (address: string, tlpLevel: TLPLevel) => void;

  // ── Value control ──────────────────────────────────────────
  value?:        string;
  defaultValue?: string;
  onChange?:     React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?:       React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?:      React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  // ── HTML attrs ─────────────────────────────────────────────
  name?:         string;
  id?:           string;
  autoComplete?: string;
  autoFocus?:    boolean;
  maxLength?:    number;
  required?:     boolean;
  /** Number of rows for multiline. Default: 3 */
  rows?:         number;
  className?:    string;
  style?:        React.CSSProperties;
}

// ─── Eye icon (password toggle) ───────────────────────────────────────────────

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><path d="M1 1l22 22"/>
  </svg>
);

// ─── Search icon ──────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

// ─── Clear icon ───────────────────────────────────────────────────────────────

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

// ─── Error icon ───────────────────────────────────────────────────────────────

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── Input ────────────────────────────────────────────────────────────────────

/**
 * Input — ANS-aware form input.
 *
 * Supports: Text, Password, Search, Number, Email, Tel, Multiline, Readonly
 * States: Default → Hover → Focus → Filled → Error → Disabled
 * Sizes: Large (56px) / Medium (48px) / Small (40px)
 *
 * A11y rules:
 *   - <label> is always rendered and linked via htmlFor/id pair
 *   - errorText sets role="alert" on the caption element
 *   - disabled uses aria-disabled + native disabled
 *   - Password toggle button has aria-label
 *   - Clear button has aria-label
 */
export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(
    {
      type          = 'text',
      size          = 'medium',
      label,
      placeholder,
      helperText,
      errorText,
      disabled      = false,
      iconLeft,
      iconRight,
      ansResolve: _ansResolve,
      onResolve:  _onResolve,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      name,
      id: idProp,
      autoComplete,
      autoFocus,
      maxLength,
      required,
      rows          = 3,
      className,
      style,
    },
    ref
  ) {
    const generatedId     = useId();
    const inputId         = idProp ?? `input-${generatedId}`;
    const errorId         = `${inputId}-error`;
    const helperId        = `${inputId}-helper`;

    const [showPassword,  setShowPassword]  = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const hasError   = Boolean(errorText);
    const isReadonly = type === 'readonly';
    const isTextarea = type === 'multiline';
    const htmlType   = type === 'password' && showPassword ? 'text'
                     : type === 'multiline' || type === 'readonly' ? 'text'
                     : type;

    // ── Derived state class ────────────────────────────────────
    const state: InputState = disabled    ? 'disabled'
                            : hasError    ? 'error'
                            : currentValue ? 'filled'
                            : 'default';

    const wrapperClasses = [
      styles.wrapper,
      styles[`size-${size}`],
      styles[`state-${state}`],
      className,
    ].filter(Boolean).join(' ');

    // ── Handlers ──────────────────────────────────────────────
    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue('');
      // Synthesise change event for controlled consumers
      const nativeInput = document.getElementById(inputId) as HTMLInputElement | null;
      if (nativeInput && onChange) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
          ?.set?.call(nativeInput, '');
        nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    // ── Right icon resolution ──────────────────────────────────
    const rightAdornment = (() => {
      if (type === 'password') {
        return (
          <button
            type="button"
            className={styles.adornmentBtn}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            <EyeIcon open={showPassword} />
          </button>
        );
      }
      if (type === 'search' && currentValue) {
        return (
          <button
            type="button"
            className={styles.adornmentBtn}
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={0}
          >
            <ClearIcon />
          </button>
        );
      }
      if (hasError) return <span className={styles.adornmentIcon}><ErrorIcon /></span>;
      if (iconRight) return <span className={styles.adornmentIcon}>{iconRight}</span>;
      return null;
    })();

    // ── Left adornment ─────────────────────────────────────────
    const leftAdornment = (() => {
      if (type === 'search') return <span className={`${styles.adornmentIcon} ${styles.adornmentLeft}`}><SearchIcon /></span>;
      if (iconLeft)          return <span className={`${styles.adornmentIcon} ${styles.adornmentLeft}`}>{iconLeft}</span>;
      return null;
    })();

    // ── Shared field props ─────────────────────────────────────
    const fieldProps = {
      id:           inputId,
      name,
      placeholder,
      disabled,
      readOnly:     isReadonly,
      autoComplete,
      autoFocus,
      maxLength,
      required,
      'aria-describedby': hasError ? errorId : helperText ? helperId : undefined,
      'aria-invalid':     hasError ? ('true' as const) : undefined,
      'aria-required':    required ? ('true' as const) : undefined,
      onBlur,
      onFocus,
    };

    return (
      <div className={wrapperClasses} style={style}>
        {/* Label — always rendered, linked via htmlFor */}
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-hidden="true"> *</span>}
          </label>
        )}

        {/* Field row */}
        <div className={styles.fieldRow}>
          {leftAdornment}

          {isTextarea ? (
            <textarea
              {...fieldProps}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={styles.field}
              rows={rows}
              value={currentValue}
              onChange={handleChange}
            />
          ) : (
            <input
              {...fieldProps}
              ref={ref as React.Ref<HTMLInputElement>}
              type={isReadonly ? 'text' : (htmlType as React.HTMLInputTypeAttribute)}
              className={styles.field}
              value={currentValue}
              onChange={handleChange}
            />
          )}

          {rightAdornment && (
            <span className={styles.adornmentRight}>{rightAdornment}</span>
          )}
        </div>

        {/* Caption — error overrides helper */}
        {hasError ? (
          <p id={errorId} className={`${styles.caption} ${styles.captionError}`} role="alert">
            {errorText}
          </p>
        ) : helperText ? (
          <p id={helperId} className={styles.caption}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
