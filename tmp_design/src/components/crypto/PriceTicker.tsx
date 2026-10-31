import { forwardRef } from 'react';
import styles from './PriceTicker.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PriceDirection = 'up' | 'down' | 'neutral';

export interface PriceTickerProps {
  /** Formatted value e.g. '+12.7%' or '$42,000' */
  value:       string;
  direction?:  PriceDirection;
  /** Ticker symbol e.g. 'BTC' */
  ticker?:     string;
  className?:  string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PriceTicker = forwardRef<HTMLSpanElement, PriceTickerProps>(({
  value,
  direction = 'neutral',
  ticker,
  className,
}, ref) => (
  <span
    ref={ref}
    className={[styles.ticker, className].filter(Boolean).join(' ')}
    data-direction={direction}
    aria-label={`${ticker ? ticker + ' ' : ''}${value}`}
  >
    {direction === 'up'   && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 2L9 8H1L5 2z" fill="currentColor"/></svg>}
    {direction === 'down' && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 8L1 2h8L5 8z" fill="currentColor"/></svg>}
    <span className={styles.value}>{value}</span>
    {ticker && <span className={styles.tickerLabel}>{ticker}</span>}
  </span>
));

PriceTicker.displayName = 'PriceTicker';
