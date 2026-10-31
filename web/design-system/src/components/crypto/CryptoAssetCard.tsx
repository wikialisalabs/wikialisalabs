import React, { forwardRef } from 'react';
import styles from './CryptoAssetCard.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CryptoAssetVariant  = 'full' | 'compact' | 'minimal';
export type CryptoChangeType    = 'positive' | 'negative' | 'neutral';

export interface CryptoAssetCardProps {
  variant?:        CryptoAssetVariant;
  coinName:        string;
  ticker:          string;
  price:           string;
  change:          string;
  changeType?:     CryptoChangeType;
  balance?:        string;
  /** 7-point sparkline data (relative values, displayed as SVG polyline) */
  sparkline?:      number[];
  /** Logo element (img/svg). Falls back to ticker initials */
  logo?:           React.ReactNode;
  onClick?:        () => void;
  className?:      string;
}

// ─── Micro sparkline SVG ──────────────────────────────────────────────────────

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data.length) return null;
  const w = 80; const h = 32;
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const color = positive ? 'var(--color-status-success-default)' : 'var(--color-status-error-default)';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true" className={styles.sparkline}>
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CryptoAssetCard = forwardRef<HTMLDivElement, CryptoAssetCardProps>(({
  variant    = 'compact',
  coinName,
  ticker,
  price,
  change,
  changeType = 'neutral',
  balance,
  sparkline,
  logo,
  onClick,
  className,
}, ref) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  const logoFallback = (
    <span className={styles.logoFallback} aria-hidden="true">
      {ticker.slice(0, 2).toUpperCase()}
    </span>
  );

  return (
    <div
      ref={ref}
      className={[styles.card, className].filter(Boolean).join(' ')}
      data-variant={variant}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      aria-label={onClick ? `${coinName} ${price}` : undefined}
    >
      {/* Logo */}
      <div className={styles.logoWrap}>
        {logo ?? logoFallback}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.coinName}>{coinName}</span>
          {variant !== 'minimal' && <span className={styles.ticker}>{ticker}</span>}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{price}</span>
          <span
            className={styles.change}
            data-direction={isPositive ? 'up' : isNegative ? 'down' : 'neutral'}
          >
            {isPositive && '▲ '}{isNegative && '▼ '}{change}
          </span>
        </div>
      </div>

      {/* Full variant extras */}
      {variant === 'full' && (
        <div className={styles.fullExtra}>
          {sparkline && (
            <Sparkline data={sparkline} positive={isPositive} />
          )}
          {balance && (
            <div className={styles.balance}>
              <span className={styles.balanceLabel}>Balance</span>
              <span className={styles.balanceValue}>{balance}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

CryptoAssetCard.displayName = 'CryptoAssetCard';
