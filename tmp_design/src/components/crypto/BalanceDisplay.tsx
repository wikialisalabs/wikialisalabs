import React, { forwardRef, useState } from 'react';
import styles from './BalanceDisplay.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuickAction {
  label:   string;
  icon:    React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface BalanceDisplayProps {
  fiatAmount:   string;
  cryptoEquiv?: string;
  /** Quick action buttons (send, receive, buy, swap). Max 4. */
  actions?:     QuickAction[];
  /** Label above balance. Default: 'Total Balance' */
  balanceLabel?: string;
  className?:   string;
}

// ─── Eye / Eye-off icons ──────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 3l14 14M8.5 8.5A2.5 2.5 0 0112.5 12M4.5 5.5C3 6.8 2 10 2 10s3 6 8 6c1.5 0 2.9-.4 4.1-1M7 4A10 10 0 0118 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const BalanceDisplay = forwardRef<HTMLDivElement, BalanceDisplayProps>(({
  fiatAmount,
  cryptoEquiv,
  actions     = [],
  balanceLabel = 'Total Balance',
  className,
}, ref) => {
  const [hidden, setHidden] = useState(false);

  return (
    <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {/* Label + toggle */}
      <div className={styles.labelRow}>
        <span className={styles.label}>{balanceLabel}</span>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setHidden((v) => !v)}
          aria-label={hidden ? 'Hiện số dư' : 'Ẩn số dư'}
        >
          {hidden ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {/* Fiat amount */}
      <div className={styles.fiatRow} aria-live="polite" aria-atomic="true">
        <span className={styles.fiatAmount}>
          {hidden ? '• • • •' : fiatAmount}
        </span>
      </div>

      {/* Crypto equiv */}
      {cryptoEquiv && (
        <span className={styles.cryptoEquiv} aria-live="polite">
          {hidden ? '• • • •' : `≈ ${cryptoEquiv}`}
        </span>
      )}

      {/* Quick actions */}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.slice(0, 4).map((a) => (
            <button
              key={a.label}
              type="button"
              className={styles.actionBtn}
              onClick={a.onClick}
              disabled={a.disabled}
              aria-label={a.label}
            >
              <span className={styles.actionIcon} aria-hidden="true">{a.icon}</span>
              <span className={styles.actionLabel}>{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

BalanceDisplay.displayName = 'BalanceDisplay';
