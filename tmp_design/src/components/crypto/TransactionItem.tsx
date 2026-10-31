import { forwardRef } from 'react';
import styles from './TransactionItem.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxType   = 'send' | 'receive' | 'swap' | 'buy' | 'fee';
export type TxStatus = 'completed' | 'pending' | 'failed' | 'processing';

export interface TransactionItemProps {
  type:       TxType;
  amount:     string;
  /** Secondary label e.g. 'BTC → ETH' for swap */
  subLabel?:  string;
  status:     TxStatus;
  /** Formatted timestamp e.g. '2 giờ trước' */
  timestamp:  string;
  /** Counter-party name or address (truncated) */
  counterparty?: string;
  onClick?:   () => void;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const TX_ICONS: Record<TxType, JSX.Element> = {
  send: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 14V6M10 6L6 10M10 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  receive: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 6v8M10 14l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  swap: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13 4l3 3-3 3M7 16l-3-3 3-3M16 7H8M4 13h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  buy: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 10h14M7 14h.01M10 14h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  fee: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

const STATUS_LABELS: Record<TxStatus, string> = {
  completed:  'Hoàn thành',
  pending:    'Đang chờ',
  failed:     'Thất bại',
  processing: 'Đang xử lý',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionItem = forwardRef<HTMLDivElement, TransactionItemProps>(({
  type,
  amount,
  subLabel,
  status,
  timestamp,
  counterparty,
  onClick,
  className,
}, ref) => (
  <div
    ref={ref}
    className={[styles.item, className].filter(Boolean).join(' ')}
    data-type={type}
    data-status={status}
    role={onClick ? 'button' : 'listitem'}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    aria-label={`${type} ${amount} ${STATUS_LABELS[status]}`}
  >
    {/* Type icon */}
    <span className={styles.iconWrap} aria-hidden="true">
      {TX_ICONS[type]}
    </span>

    {/* Middle: label + counterparty */}
    <div className={styles.middle}>
      <span className={styles.typeLabel}>{subLabel ?? amount}</span>
      {counterparty && <span className={styles.counterparty}>{counterparty}</span>}
      <span className={styles.timestamp}>{timestamp}</span>
    </div>

    {/* Right: amount + status */}
    <div className={styles.right}>
      <span className={styles.amount}>{amount}</span>
      <span className={styles.status}>{STATUS_LABELS[status]}</span>
    </div>
  </div>
));

TransactionItem.displayName = 'TransactionItem';
