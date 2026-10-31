import React, { forwardRef, useRef, useCallback, useId } from 'react';
import styles from './OTPInput.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OTPInputState = 'default' | 'error' | 'success';

export interface OTPInputProps {
  /** Number of digits. Default: 6 */
  digits?:    4 | 6;
  /** Controlled value string (length ≤ digits) */
  value?:     string;
  /** Called whenever any digit changes — receives full value string */
  onChange?:  (value: string) => void;
  /** Called when all digits are filled */
  onComplete?: (value: string) => void;
  /** Visual state. Default: 'default' */
  state?:     OTPInputState;
  /** Disabled all cells */
  disabled?:  boolean;
  /** aria-label for the group */
  label?:     string;
  /** Error/helper text below */
  helperText?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(({
  digits      = 6,
  value       = '',
  onChange,
  onComplete,
  state       = 'default',
  disabled    = false,
  label       = 'One-time password',
  helperText,
}, ref) => {
  const cellRefs  = useRef<Array<HTMLInputElement | null>>([]);
  const groupId   = useId();
  const helperId  = `${groupId}-helper`;

  const vals = Array.from({ length: digits }, (_, i) => value[i] ?? '');

  const focusCell = useCallback((i: number) => {
    cellRefs.current[i]?.focus();
  }, []);

  const handleChange = useCallback((idx: number, raw: string) => {
    // Strip non-numeric, take last char (handle paste into single cell)
    const ch = raw.replace(/\D/g, '').slice(-1);
    const next = vals.map((v, i) => (i === idx ? ch : v)).join('');
    onChange?.(next);
    if (ch && idx < digits - 1) focusCell(idx + 1);
    if (next.length === digits && next.split('').every(Boolean)) onComplete?.(next);
  }, [vals, digits, onChange, onComplete, focusCell]);

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (vals[idx]) {
        const next = vals.map((v, i) => (i === idx ? '' : v)).join('');
        onChange?.(next);
      } else if (idx > 0) {
        focusCell(idx - 1);
      }
    }
    if (e.key === 'ArrowLeft'  && idx > 0)            focusCell(idx - 1);
    if (e.key === 'ArrowRight' && idx < digits - 1)   focusCell(idx + 1);
  }, [vals, digits, onChange, focusCell]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits);
    onChange?.(pasted.padEnd(digits, '').slice(0, digits).replace(/ /g, ''));
    // trim to actual pasted length
    const trimmed = pasted.slice(0, digits);
    onChange?.(trimmed);
    if (trimmed.length === digits) onComplete?.(trimmed);
    focusCell(Math.min(trimmed.length, digits - 1));
  }, [digits, onChange, onComplete, focusCell]);

  return (
    <div ref={ref} className={styles.wrapper} data-state={state}>
      <div
        role="group"
        aria-label={label}
        aria-describedby={helperText ? helperId : undefined}
        className={styles.cells}
        data-digits={digits}
      >
        {vals.map((v, i) => (
          <input
            key={i}
            ref={(el) => { cellRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={v}
            disabled={disabled}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${i + 1} of ${digits}`}
            className={styles.cell}
            data-filled={v ? 'true' : undefined}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {helperText && (
        <span id={helperId} className={styles.helper} role={state === 'error' ? 'alert' : undefined}>
          {helperText}
        </span>
      )}
    </div>
  );
});

OTPInput.displayName = 'OTPInput';
