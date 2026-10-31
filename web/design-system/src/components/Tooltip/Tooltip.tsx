import React, { forwardRef, useCallback, useId, useRef, useState } from 'react';
import styles from './Tooltip.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip text content */
  content: string;
  /** Trigger element */
  children: React.ReactElement;
  /** Placement preference. Default: 'top' */
  placement?: TooltipPlacement;
  /** Delay before showing in ms. Default: 300 */
  delay?: number;
  /** Disable the tooltip */
  disabled?: boolean;
  className?: string;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

/**
 * Tooltip — Accessible floating label on hover/focus.
 *
 * - Always dark bg (#1E2A59) — intentionally hardcoded, does NOT follow theme.
 * - Uses CSS-only positioning relative to a wrapper `position: relative` div.
 * - Injects `aria-describedby` on the trigger via React.cloneElement.
 * - Show/hide via React state controlled by mouseenter/mouseleave + focus/blur.
 * - `role="tooltip"` on the tooltip node.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    placement = 'top',
    delay = 300,
    disabled = false,
    className,
  },
  ref
) {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (disabled) return;
    timerRef.current = setTimeout(() => setIsVisible(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Inject aria-describedby into the trigger element
  const trigger = React.cloneElement(children, {
    'aria-describedby': disabled ? undefined : tooltipId,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
    },
  });

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {trigger}
      <div
        id={tooltipId}
        role="tooltip"
        className={[
          styles.tooltip,
          styles[`placement-${placement}`],
          isVisible ? styles.visible : styles.hidden,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!isVisible}
      >
        {content}
      </div>
    </div>
  );
});

Tooltip.displayName = 'Tooltip';
