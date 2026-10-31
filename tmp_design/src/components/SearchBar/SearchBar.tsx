import React, { forwardRef, useId } from 'react';
import styles from './SearchBar.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Controlled search value */
  value?:       string;
  /** Called on input change */
  onChange?:    React.ChangeEventHandler<HTMLInputElement>;
  /** Called when clear (×) button is clicked */
  onClear?:     () => void;
  /** Placeholder. Default: 'Tìm kiếm…' */
  placeholder?: string;
  /** Accessible label */
  label?:       string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  value,
  onChange,
  onClear,
  placeholder = 'Tìm kiếm…',
  label       = 'Tìm kiếm',
  disabled,
  className,
  id: idProp,
  ...props
}, ref) => {
  const autoId = useId();
  const inputId = idProp ?? autoId;
  const hasValue = (value ?? '').length > 0;

  return (
    <div className={[styles.wrapper, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      {/* Search icon */}
      <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>

      <input
        ref={ref}
        id={inputId}
        type="search"
        role="searchbox"
        aria-label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={styles.input}
        {...props}
      />

      {/* Clear button */}
      {hasValue && !disabled && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={onClear}
          aria-label="Xoá tìm kiếm"
          tabIndex={0}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="var(--color-border-strong)"/>
            <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--color-surface-default)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
