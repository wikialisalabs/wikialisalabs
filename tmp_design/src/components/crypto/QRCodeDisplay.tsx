import { forwardRef, useState } from 'react';
import styles from './QRCodeDisplay.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type QRVariant = 'receive' | 'inline' | 'loading';

export interface QRCodeDisplayProps {
  address:    string;
  coinName?:  string;
  variant?:   QRVariant;
  className?: string;
}

// ─── Placeholder QR (real lib would be injected) ──────────────────────────────
// Uses a deterministic SVG grid from address bytes to simulate QR appearance.

function QRPlaceholder({ size, address }: { size: number; address: string }) {
  const cells = 12;
  const cell  = size / cells;
  // Deterministic fill from char codes
  const filled = Array.from({ length: cells * cells }, (_, i) => {
    const c = address.charCodeAt(i % address.length);
    return ((c + i * 7) % 3 !== 0);
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ background: '#fff', display: 'block', borderRadius: 4 }}>
      {filled.map((f, i) => {
        if (!f) return null;
        const x = (i % cells) * cell;
        const y = Math.floor(i / cells) * cell;
        return <rect key={i} x={x} y={y} width={cell - 1} height={cell - 1} fill="#1E2A59" rx="1"/>;
      })}
      {/* Corner finders */}
      {[[0,0],[0,cells-3],[cells-3,0]].map(([cx,cy],i) => (
        <rect key={`f${i}`} x={cx*cell} y={cy*cell} width={cell*3} height={cell*3} fill="none" stroke="#1E2A59" strokeWidth="2" rx="2"/>
      ))}
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QRCodeDisplay = forwardRef<HTMLDivElement, QRCodeDisplayProps>(({
  address,
  coinName,
  variant   = 'receive',
  className,
}, ref) => {
  const [copied, setCopied] = useState(false);
  const truncated = `${address.slice(0, 8)}…${address.slice(-6)}`;
  const qrSize    = variant === 'inline' ? 80 : 200;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (variant === 'loading') {
    return (
      <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')} data-variant="loading">
        <div className={styles.qrSkeleton} style={{ width: 200, height: 200 }} aria-busy="true" aria-label="Đang tạo QR code…" />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')} data-variant="inline">
        <div className={styles.qrContainer}>
          <QRPlaceholder size={qrSize} address={address} />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')} data-variant="receive">
      <div className={styles.qrContainer} aria-label={`QR code cho địa chỉ ${coinName ?? ''} ${address}`}>
        <QRPlaceholder size={qrSize} address={address} />
      </div>
      {coinName && <p className={styles.coinName}>{coinName}</p>}
      <p className={styles.address} title={address}>{truncated}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.copyBtn} onClick={handleCopy}>
          {copied ? '✓ Đã sao chép' : 'Copy Address'}
        </button>
        <button type="button" className={styles.shareBtn} onClick={() => navigator.share?.({ text: address })}>
          Share
        </button>
      </div>
    </div>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';
