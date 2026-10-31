import React, { forwardRef, useId, useRef, useState, useCallback, useEffect } from 'react';
import styles from './Dropdown.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  value:     string;
  label:     string;
  disabled?: boolean;
}

export interface DropdownProps {
  /** Dropdown options */
  options:      DropdownOption[];
  /** Controlled single value */
  value?:       string;
  /** Controlled multi values */
  values?:      string[];
  /** Allow multiple selection */
  multiple?:    boolean;
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Field label */
  label?:       string;
  /** Disabled state */
  disabled?:    boolean;
  /** Error state */
  error?:       boolean;
  /** Error / helper text */
  helperText?:  string;
  /** Called on single-select change */
  onChange?:    (value: string) => void;
  /** Called on multi-select change */
  onChangeMulti?: (values: string[]) => void;
  /** Extra className */
  className?:   string;
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      className={[styles.chevron, open ? styles.chevronOpen : ''].join(' ')}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({
  options,
  value,
  values       = [],
  multiple     = false,
  placeholder  = 'Select…',
  label,
  disabled     = false,
  error        = false,
  helperText,
  onChange,
  onChangeMulti,
  className,
}, ref) => {
  const [open, setOpen]   = useState(false);
  const wrapRef           = useRef<HTMLDivElement>(null);
  const listRef           = useRef<HTMLUListElement>(null);
  const triggerId         = useId();
  const listId            = `${triggerId}-list`;
  const helpId            = `${triggerId}-help`;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const toggle = useCallback(() => {
    if (!disabled) setOpen((v) => !v);
  }, [disabled]);

  const selectOption = useCallback((opt: DropdownOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const next = values.includes(opt.value)
        ? values.filter((v) => v !== opt.value)
        : [...values, opt.value];
      onChangeMulti?.(next);
    } else {
      onChange?.(opt.value);
      setOpen(false);
    }
  }, [multiple, values, onChange, onChangeMulti]);

  // Display text
  const displayLabel = multiple
    ? values.length === 0
      ? placeholder
      : values.length === 1
        ? options.find((o) => o.value === values[0])?.label ?? values[0]
        : `${values.length} selected`
    : options.find((o) => o.value === value)?.label ?? placeholder;

  const hasValue = multiple ? values.length > 0 : !!value;

  return (
    <div
      ref={(node) => {
        (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-open={open ? 'true' : undefined}
      data-error={error ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
    >
      {label && <label htmlFor={triggerId} className={styles.label}>{label}</label>}

      {/* Trigger */}
      <button
        type="button"
        id={triggerId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-describedby={helperText ? helpId : undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
        className={styles.trigger}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
          if (e.key === 'ArrowDown' && !open) setOpen(true);
        }}
      >
        <span className={[styles.triggerText, !hasValue ? styles.placeholder : ''].join(' ')}>
          {displayLabel}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable={multiple}
          aria-label={label ?? placeholder}
          className={styles.list}
        >
          {options.map((opt) => {
            const isSelected = multiple ? values.includes(opt.value) : opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                className={styles.item}
                data-selected={isSelected ? 'true' : undefined}
                data-disabled={opt.disabled ? 'true' : undefined}
                onClick={() => selectOption(opt)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(opt); } }}
                tabIndex={opt.disabled ? -1 : 0}
              >
                {multiple && (
                  <span className={styles.checkIcon} aria-hidden="true">
                    {isSelected && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                )}
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}

      {helperText && (
        <span id={helpId} className={[styles.helper, error ? styles.helperError : ''].join(' ')}>
          {helperText}
        </span>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
