import { forwardRef, useEffect, useState, useCallback } from 'react';
import styles from './AddressDisplay.module.css';
import { useANSResolver } from '../../hooks/useANSResolver';
import { resolveTLPLevel } from '../../types/tlp';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddressDisplayProps {
  /** Raw 0x address or ANS name */
  address:     string;
  /** Characters to show at start/end of truncated hex. Default: 6 */
  truncate?:   number;
  /** Show copy-to-clipboard button. Default: true */
  showCopy?:   boolean;
  /** Show TLP badge next to name. Default: true */
  showBadge?:  boolean;
  className?:  string;
}

// ─── Truncate helper ──────────────────────────────────────────────────────────

function truncateHex(addr: string, n: number): string {
  if (addr.length <= n * 2 + 4) return addr;
  return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddressDisplay = forwardRef<HTMLDivElement, AddressDisplayProps>(({
  address,
  truncate   = 6,
  showCopy   = true,
  showBadge  = true,
  className,
}, ref) => {
  const { resolve }       = useANSResolver();
  const [name, setName]   = useState<string | null>(null);
  const [tlp, setTlp]     = useState(() => resolveTLPLevel(address));
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolve(address).then((result) => {
      if (!cancelled) {
        setName(result.name);
        setTlp(result.tlpLevel);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [address, resolve]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [address]);

  const displayText = loading
    ? truncateHex(address, truncate)
    : (name ?? truncateHex(address, truncate));

  return (
    <div
      ref={ref}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-tlp={tlp}
    >
      {/* ⚠ Warning icon when no ANS name (raw hex) */}
      {!loading && !name && (
        <span className={styles.warningIcon} aria-label="Địa chỉ thô — chưa xác minh ANS" title="Raw address">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L1 13h12L7 1z" stroke="var(--color-status-warning-default)" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M7 6v3M7 10.5v.5" stroke="var(--color-status-warning-default)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>
      )}

      <span className={styles.address} title={address}>
        {displayText}
      </span>

      {/* TLP badge */}
      {showBadge && !loading && (
        <span className={styles.tlpBadge} data-tlp={tlp} aria-label={`TLP: ${tlp}`}>
          {tlp}
        </span>
      )}

      {/* Copy button */}
      {showCopy && (
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopy}
          aria-label={copied ? 'Đã sao chép' : 'Sao chép địa chỉ'}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3" stroke="var(--color-status-success-default)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M4 4V3a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

AddressDisplay.displayName = 'AddressDisplay';
