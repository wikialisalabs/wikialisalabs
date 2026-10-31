import React, { forwardRef } from 'react';
import styles from './Alert.module.css';
import { TLP_MAP } from '../../types/tlp';
import type { TLPLevel } from '../../types/tlp';

// ─── Alert ────────────────────────────────────────────────────────────────────

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  variant?:    AlertVariant;
  title?:      string;
  children?:   React.ReactNode;
  /** Show dismiss (×) button */
  dismissible?: boolean;
  onDismiss?:  () => void;
  className?:  string;
}

const ALERT_ICONS: Record<AlertVariant, JSX.Element> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  variant    = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}, ref) => (
  <div
    ref={ref}
    role="alert"
    aria-live="assertive"
    className={[styles.alert, className].filter(Boolean).join(' ')}
    data-variant={variant}
  >
    <span className={styles.alertIcon}>{ALERT_ICONS[variant]}</span>
    <div className={styles.alertBody}>
      {title && <strong className={styles.alertTitle}>{title}</strong>}
      {children && <div className={styles.alertText}>{children}</div>}
    </div>
    {dismissible && (
      <button
        type="button"
        className={styles.alertClose}
        onClick={onDismiss}
        aria-label="Đóng thông báo"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    )}
  </div>
));

Alert.displayName = 'Alert';

// ─── SecurityAlert ────────────────────────────────────────────────────────────

export interface SecurityAlertProps {
  /** TLP level — when 'blocked' the sign button is always disabled */
  level:       TLPLevel;
  /** Namespace or address being evaluated */
  name:        string;
  /** Human-readable reason for the alert */
  reason?:     string;
  /** Called when user dismisses the alert (only for non-blocked) */
  onDismiss?:  () => void;
  /**
   * Primary action (e.g. Sign / Send).
   * HARD RULE: disabled when level === 'blocked'. Consumer cannot override.
   */
  onSign?:     () => void;
  /** Label for the sign button. Default: 'Sign Transaction' */
  signLabel?:  string;
  className?:  string;
}

export const SecurityAlert = forwardRef<HTMLDivElement, SecurityAlertProps>(({
  level,
  name,
  reason,
  onDismiss,
  onSign,
  signLabel = 'Sign Transaction',
  className,
}, ref) => {
  const tlp = TLP_MAP[level];
  // HARD RULE — blocked can NEVER allow signing
  const signDisabled = level === 'blocked';

  const defaultReason: Record<TLPLevel, string> = {
    safe:    `${name} is a verified namespace. Proceed with care.`,
    caution: `${name} is a DeFi namespace. Review all details before signing.`,
    blocked: `${name} cannot be verified. Signing is disabled for your safety.`,
    system:  `${name} is a system-level namespace. Only sign if you initiated this.`,
  };

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className={[styles.secAlert, className].filter(Boolean).join(' ')}
      data-tlp={level}
    >
      {/* Header row */}
      <div className={styles.secAlertHeader}>
        {/* TLP dot indicator */}
        <span className={styles.tlpDot} aria-hidden="true" />
        <span className={styles.secAlertLevel}>{tlp.label}</span>
        <span className={styles.secAlertName}>{name}</span>
        {onDismiss && level !== 'blocked' && (
          <button
            type="button"
            className={styles.secAlertClose}
            onClick={onDismiss}
            aria-label="Đóng cảnh báo"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Reason */}
      <p className={styles.secAlertReason}>{reason ?? defaultReason[level]}</p>

      {/* Actions */}
      {onSign && (
        <div className={styles.secAlertActions}>
          <button
            type="button"
            className={styles.signBtn}
            onClick={signDisabled ? undefined : onSign}
            disabled={signDisabled}
            aria-disabled={signDisabled}
            data-blocked={signDisabled ? 'true' : undefined}
          >
            {signDisabled ? '🔒 ' : ''}{signLabel}
          </button>
        </div>
      )}
    </div>
  );
});

SecurityAlert.displayName = 'SecurityAlert';
