import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import styles from './Modal.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BottomSheetVariant = 'list' | 'confirm' | 'form' | 'info' | 'otp';

export interface BottomSheetProps {
  /** Sheet variant. Default: 'info' */
  variant?:  BottomSheetVariant;
  /** Whether the sheet is open */
  open:      boolean;
  /** Called when the sheet requests to close */
  onClose:   () => void;
  /** Optional title displayed at the top of the sheet */
  title?:    string;
  /** Allow closing by clicking the overlay. Default: true */
  closeOnOverlay?: boolean;
  /** Content inside the sheet */
  children?: React.ReactNode;
  /** Extra className on the sheet panel */
  className?: string;
}

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

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(({
  variant        = 'info',
  open,
  onClose,
  title,
  closeOnOverlay = true,
  children,
  className,
}, ref) => {
  const sheetRef    = useRef<HTMLDivElement>(null);
  const triggerRef  = useRef<Element | null>(null);
  const titleId     = useRef(`sheet-title-${Math.random().toString(36).slice(2)}`).current;

  // Drag-to-dismiss state
  const dragStartY = useRef<number | null>(null);

  // Save focus origin, restore on close
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      requestAnimationFrame(() => {
        const el = sheetRef.current;
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
    if (e.key === 'Tab' && sheetRef.current) { trapFocus(sheetRef.current, e); }
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

  // Drag handle handlers
  const onDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };
  const onDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY.current === null) return;
    const endY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    if (endY - dragStartY.current > 60) onClose(); // dragged down 60px → dismiss
    dragStartY.current = null;
  };

  if (!open) return null;

  return (
    <div
      className={styles.sheetOverlay}
      onClick={closeOnOverlay ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
      data-variant={variant}
    >
      <div
        ref={(node) => {
          (sheetRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={[styles.sheet, className].filter(Boolean).join(' ')}
      >
        {/* Drag handle */}
        <div
          className={styles.handle}
          aria-hidden="true"
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
        />

        {/* Optional title */}
        {title && (
          <div className={styles.sheetHeader}>
            <h6 id={titleId} className={styles.sheetTitle}>{title}</h6>
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
        )}

        {/* Content */}
        <div className={styles.sheetContent}>
          {children}
        </div>
      </div>
    </div>
  );
});

BottomSheet.displayName = 'BottomSheet';
