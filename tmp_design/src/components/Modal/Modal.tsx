import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import styles from './Modal.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalVariant = 'info' | 'confirm' | 'form' | 'success' | 'error' | 'custom';

export interface ModalAction {
  label:     string;
  onClick:   () => void;
  loading?:  boolean;
  disabled?: boolean;
}

export interface ModalProps {
  /** Dialog variant. Default: 'info' */
  variant?:         ModalVariant;
  /** Dialog title — also used for aria-labelledby */
  title?:           string;
  /** Whether the modal is open */
  open:             boolean;
  /** Called when the modal requests to close (close btn, overlay click, Escape) */
  onClose:          () => void;
  /** Primary CTA (right-aligned in footer) */
  primaryAction?:   ModalAction;
  /** Secondary CTA (left of primary) */
  secondaryAction?: ModalAction;
  /** Allow closing by clicking the overlay. Default: true */
  closeOnOverlay?:  boolean;
  /** Content inside the modal body */
  children?:        React.ReactNode;
  /** Extra className on the modal panel */
  className?:       string;
}

// ─── Variant icon map ─────────────────────────────────────────────────────────

const VARIANT_ICONS: Record<Exclude<ModalVariant, 'custom' | 'form'>, JSX.Element> = {
  info: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--color-status-info)" strokeWidth="2"/>
      <path d="M12 8v4m0 4h.01" stroke="var(--color-status-info)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  confirm: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 20h20L12 2z" stroke="var(--color-status-warning)" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 9v4m0 4h.01" stroke="var(--color-status-warning)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  success: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--color-status-success)" strokeWidth="2"/>
      <path d="M7 12l3.5 3.5L17 8" stroke="var(--color-status-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--color-status-error)" strokeWidth="2"/>
      <path d="M8 8l8 8M16 8l-8 8" stroke="var(--color-status-error)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Focus trap util ──────────────────────────────────────────────────────────

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function trapFocus(el: HTMLElement, event: KeyboardEvent) {
  const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (event.shiftKey) {
    if (document.activeElement === first) { event.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { event.preventDefault(); first.focus(); }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  variant         = 'info',
  title,
  open,
  onClose,
  primaryAction,
  secondaryAction,
  closeOnOverlay  = true,
  children,
  className,
}, ref) => {
  const dialogRef   = useRef<HTMLDivElement>(null);
  const triggerRef  = useRef<Element | null>(null);
  const titleId     = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;

  // Save focus origin, restore on close
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      // Move focus into the dialog after paint
      requestAnimationFrame(() => {
        const el = dialogRef.current;
        if (!el) return;
        const firstFocusable = el.querySelector<HTMLElement>(FOCUSABLE);
        firstFocusable ? firstFocusable.focus() : el.focus();
      });
    } else {
      (triggerRef.current as HTMLElement | null)?.focus();
    }
  }, [open]);

  // Escape key + focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    if (e.key === 'Tab' && dialogRef.current) { trapFocus(dialogRef.current, e); }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const icon = variant !== 'custom' && variant !== 'form' ? VARIANT_ICONS[variant] : null;

  return (
    <div
      className={styles.overlay}
      data-variant={variant}
      onClick={closeOnOverlay ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
      aria-hidden={!open}
    >
      <div
        ref={(node) => {
          (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={[styles.modal, className].filter(Boolean).join(' ')}
      >
        {/* Header */}
        <div className={styles.header}>
          {icon && <span className={styles.variantIcon}>{icon}</span>}
          {title && <h6 id={titleId} className={styles.title}>{title}</h6>}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Đóng"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {(primaryAction || secondaryAction) && (
          <div className={styles.footer}>
            {secondaryAction && (
              <button
                type="button"
                className={[styles.footerBtn, styles.footerBtnSecondary].join(' ')}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                type="button"
                className={[styles.footerBtn, styles.footerBtnPrimary].join(' ')}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled || primaryAction.loading}
                aria-busy={primaryAction.loading}
              >
                {primaryAction.loading ? (
                  <svg className={styles.spinner} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
                  </svg>
                ) : primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
