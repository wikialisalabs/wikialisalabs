import React, { forwardRef } from 'react';
import styles from './EmptyState.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EmptyStateVariant =
  | 'no-transactions'
  | 'no-results'
  | 'no-notifications'
  | 'no-connection'
  | 'error'
  | 'empty-wallet'
  | 'generic';

export interface EmptyStateProps {
  variant?:   EmptyStateVariant;
  title?:     string;
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  onAction?:  () => void;
  /** Override the default illustration */
  illustration?: React.ReactNode;
  className?: string;
}

// ─── Default illustrations (SVG) ─────────────────────────────────────────────

const ILLUSTRATIONS: Record<EmptyStateVariant, JSX.Element> = {
  'no-transactions': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="16" y="24" width="48" height="36" rx="6" fill="var(--color-surface-raised)" stroke="var(--color-border-default)" strokeWidth="2"/>
      <path d="M24 38h32M24 46h20" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="56" cy="24" r="10" fill="var(--color-status-info-subtle)" stroke="var(--color-status-info-default)" strokeWidth="2"/>
      <path d="M52 24h8M56 20v8" stroke="var(--color-status-info-default)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'no-results': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="36" cy="36" r="20" fill="var(--color-surface-raised)" stroke="var(--color-border-default)" strokeWidth="2"/>
      <path d="M50 50L64 64" stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M28 36h16M36 28v16" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'no-notifications': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M40 16c-11 0-20 9-20 20v12l-4 8h48l-4-8V36c0-11-9-20-20-20z" fill="var(--color-surface-raised)" stroke="var(--color-border-default)" strokeWidth="2"/>
      <path d="M34 56a6 6 0 0012 0" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 20L60 60" stroke="var(--color-status-error-default)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'no-connection': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M16 40c0-13.3 10.7-24 24-24s24 10.7 24 24" stroke="var(--color-border-default)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 48c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="var(--color-border-default)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="56" r="4" fill="var(--color-border-default)"/>
      <path d="M16 16L64 64" stroke="var(--color-status-error-default)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  error: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="28" fill="var(--color-status-error-subtle)" stroke="var(--color-status-error-default)" strokeWidth="2"/>
      <path d="M40 26v20M40 52v4" stroke="var(--color-status-error-default)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  'empty-wallet': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="12" y="28" width="56" height="36" rx="8" fill="var(--color-surface-raised)" stroke="var(--color-border-default)" strokeWidth="2"/>
      <path d="M12 40h56" stroke="var(--color-border-default)" strokeWidth="2"/>
      <circle cx="52" cy="52" r="6" fill="var(--color-surface-default)" stroke="var(--color-border-strong)" strokeWidth="1.5"/>
      <path d="M12 28V24a8 8 0 018-8h40" stroke="var(--color-border-default)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  generic: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="16" y="16" width="48" height="48" rx="12" fill="var(--color-surface-raised)" stroke="var(--color-border-default)" strokeWidth="2" strokeDasharray="6 3"/>
      <path d="M40 32v16M32 40h16" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const DEFAULT_TITLES: Record<EmptyStateVariant, string> = {
  'no-transactions':  'Chưa có giao dịch',
  'no-results':       'Không tìm thấy kết quả',
  'no-notifications': 'Không có thông báo',
  'no-connection':    'Mất kết nối mạng',
  'error':            'Đã xảy ra lỗi',
  'empty-wallet':     'Ví chưa có tài sản',
  'generic':          'Chưa có dữ liệu',
};

const DEFAULT_DESCS: Record<EmptyStateVariant, string> = {
  'no-transactions':  'Các giao dịch của bạn sẽ xuất hiện tại đây.',
  'no-results':       'Thử từ khoá khác hoặc kiểm tra lại chính tả.',
  'no-notifications': 'Tất cả thông báo đã được xử lý.',
  'no-connection':    'Kiểm tra kết nối Wi-Fi hoặc dữ liệu di động.',
  'error':            'Không thể tải dữ liệu. Vui lòng thử lại.',
  'empty-wallet':     'Nạp tiền để bắt đầu sử dụng ví của bạn.',
  'generic':          '',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(({
  variant      = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
  className,
}, ref) => (
  <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')} role="status">
    <div className={styles.illustration} aria-hidden="true">
      {illustration ?? ILLUSTRATIONS[variant]}
    </div>
    <h6 className={styles.title}>{title ?? DEFAULT_TITLES[variant]}</h6>
    {(description ?? DEFAULT_DESCS[variant]) && (
      <p className={styles.description}>{description ?? DEFAULT_DESCS[variant]}</p>
    )}
    {actionLabel && onAction && (
      <button type="button" className={styles.actionBtn} onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
));

EmptyState.displayName = 'EmptyState';
