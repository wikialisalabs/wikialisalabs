import React, { forwardRef } from 'react';
import styles from './Toast.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastItemProps {
  id:       string;
  variant:  ToastVariant;
  message:  string;
  action?:  { label: string; onClick: () => void };
  onDismiss: (id: string) => void;
}

export interface ToastContainerProps {
  /** Array of active toast items — managed by useToast hook */
  toasts: ToastItemProps[];
  /** Stacking position. Default: 'bottom-center' */
  position?: 'bottom-center' | 'top-right' | 'top-center';
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === 'default') return null;

  const paths: Record<Exclude<ToastVariant, 'default'>, React.ReactNode> = {
    success: (
      <g>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    error: (
      <g>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </g>
    ),
    warning: (
      <g>
        <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </g>
    ),
    info: (
      <g>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </g>
    ),
  };

  return (
    <svg
      className={styles.icon}
      data-variant={variant}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {paths[variant as Exclude<ToastVariant, 'default'>]}
    </svg>
  );
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

export const Toast = forwardRef<HTMLDivElement, ToastItemProps>(({
  id,
  variant = 'default',
  message,
  action,
  onDismiss,
}, ref) => (
  <div
    ref={ref}
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className={styles.toast}
    data-variant={variant}
  >
    <ToastIcon variant={variant} />

    <span className={styles.message}>{message}</span>

    {action && (
      <button
        type="button"
        className={styles.actionBtn}
        onClick={action.onClick}
      >
        {action.label}
      </button>
    )}

    <button
      type="button"
      className={styles.dismissBtn}
      onClick={() => onDismiss(id)}
      aria-label="Đóng thông báo"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
));

Toast.displayName = 'Toast';

// ─── Toast Container ──────────────────────────────────────────────────────────

export const ToastContainer = forwardRef<HTMLDivElement, ToastContainerProps>(({
  toasts,
  position = 'bottom-center',
}, ref) => {
  if (!toasts.length) return null;

  return (
    <div
      ref={ref}
      className={styles.container}
      data-position={position}
      aria-label="Thông báo"
      role="region"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';
