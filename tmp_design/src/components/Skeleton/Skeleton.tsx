import React, { forwardRef } from 'react';
import styles from './Skeleton.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** Shape variant. Default: 'rect' */
  variant?: SkeletonVariant;
  /** Width (CSS value or number=px). Default: '100%' */
  width?: string | number;
  /** Height (CSS value or number=px). Default: '16px' for text, explicit for others */
  height?: string | number;
  /** Border radius override */
  radius?: string | number;
  /** Number of text lines to render (only for variant='text') */
  lines?: number;
  /** Animation. Default: 'shimmer'. 'pulse' = opacity animation. 'none' = static */
  animation?: 'shimmer' | 'pulse' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toCSSValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

/**
 * Skeleton — Loading placeholder component.
 *
 * Extends the `.skeleton` base class from tokens/variables.css
 * with variant-specific styles and animation overrides.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    variant = 'rect',
    width,
    height,
    radius,
    lines = 1,
    animation = 'shimmer',
    className,
    style,
  },
  ref
) {
  const animClass =
    animation === 'pulse'
      ? styles.animPulse
      : animation === 'none'
      ? styles.animNone
      : ''; // shimmer comes from the global .skeleton class

  // ── Text variant: renders multiple line bars ──────────────────────────────
  if (variant === 'text') {
    const lineHeight = height ? toCSSValue(height) : '12px';

    return (
      <div
        ref={ref}
        className={[styles.textBlock, className].filter(Boolean).join(' ')}
        style={{ width: width ? toCSSValue(width) : '100%', ...style }}
        aria-hidden="true"
      >
        {Array.from({ length: lines }).map((_, i) => {
          const isLast = i === lines - 1 && lines > 1;
          return (
            <div
              key={i}
              className={['skeleton', styles.textLine, animClass].filter(Boolean).join(' ')}
              style={{
                height: lineHeight,
                width: isLast ? '70%' : '100%',
                borderRadius: radius ? toCSSValue(radius) : '4px',
              }}
            />
          );
        })}
      </div>
    );
  }

  // ── Circle / Rect ─────────────────────────────────────────────────────────
  const isCircle = variant === 'circle';

  const resolvedWidth  = width  ? toCSSValue(width)  : isCircle ? '40px' : '100%';
  const resolvedHeight = height ? toCSSValue(height) : isCircle ? resolvedWidth : '16px';

  const resolvedRadius = radius
    ? toCSSValue(radius)
    : isCircle
    ? '9999px'
    : 'var(--radius-sm)';

  return (
    <div
      ref={ref}
      className={['skeleton', styles.base, animClass, className].filter(Boolean).join(' ')}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        borderRadius: resolvedRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
});

Skeleton.displayName = 'Skeleton';

// ─── Preset compositions ──────────────────────────────────────────────────────

/** Pre-composed skeleton for a list item: circle avatar + 2 text lines */
export function SkeletonListItem(): React.JSX.Element {
  return (
    <div className={styles.presetListItem} aria-hidden="true">
      <Skeleton variant="circle" width={40} height={40} />
      <div className={styles.presetLines}>
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}

/** Pre-composed skeleton for a card: rect block + 2 text lines */
export function SkeletonCard(): React.JSX.Element {
  return (
    <div className={styles.presetCard} aria-hidden="true">
      <Skeleton variant="rect" width="100%" height={80} />
      <div className={styles.presetLines}>
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}

/** Pre-composed skeleton for a profile: circle + 2 lines centered */
export function SkeletonProfile(): React.JSX.Element {
  return (
    <div className={styles.presetProfile} aria-hidden="true">
      <Skeleton variant="circle" width={64} height={64} />
      <div className={styles.presetLines}>
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}
