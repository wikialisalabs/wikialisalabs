import { useCallback, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastOptions {
  /** Duration in ms. Defaults: success/info=3000, error=5000, warning=4000 */
  duration?: number;
  /** Optional inline action button */
  action?: { label: string; onClick: () => void };
}

export interface ToastItem {
  id:       string;
  variant:  ToastVariant;
  message:  string;
  options?: ToastOptions;
}

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 3000,
  info:    3000,
  warning: 4000,
  error:   5000,
  default: 3000,
};

let idCounter = 0;

/**
 * useToast — Programmatic toast notifications.
 *
 * Requires <ToastContainer /> to be mounted (handled by AxioProvider).
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast.success('Transaction confirmed ✓');
 * toast.error('Signature rejected', { duration: 5000 });
 * toast.warning('High slippage — 4.2%');
 * toast.info('Waiting for block confirmation…');
 * ```
 */
export function useToast(): {
  toasts: ToastItem[];
  toast: {
    success: (msg: string, opts?: ToastOptions) => void;
    error:   (msg: string, opts?: ToastOptions) => void;
    warning: (msg: string, opts?: ToastOptions) => void;
    info:    (msg: string, opts?: ToastOptions) => void;
    default: (msg: string, opts?: ToastOptions) => void;
  };
  dismiss: (id: string) => void;
} {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const push = useCallback((variant: ToastVariant, message: string, opts?: ToastOptions) => {
    const id = `toast-${++idCounter}`;
    const duration = opts?.duration ?? DEFAULT_DURATION[variant];

    const item: ToastItem = { id, variant, message };
    if (opts !== undefined) item.options = opts;
    setToasts((prev) => [...prev, item]);

    const timer = setTimeout(() => dismiss(id), duration);
    timers.current.set(id, timer);
  }, [dismiss]);

  return {
    toasts,
    toast: {
      success: (msg, opts) => push('success', msg, opts),
      error:   (msg, opts) => push('error',   msg, opts),
      warning: (msg, opts) => push('warning', msg, opts),
      info:    (msg, opts) => push('info',    msg, opts),
      default: (msg, opts) => push('default', msg, opts),
    },
    dismiss,
  };
}
