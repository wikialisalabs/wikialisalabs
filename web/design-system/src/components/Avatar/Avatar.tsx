import React, { forwardRef, useState } from 'react';
import styles from './Avatar.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image URL */
  src?: string;
  /** Alt text for img. Default: name initials */
  alt?: string;
  /** Name used to generate initials fallback */
  name?: string;
  /** Size variant. Default: 'md' */
  size?: AvatarSize;
  /** Show online status indicator dot */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Show brand ring border */
  ring?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// ─── Person Icon ──────────────────────────────────────────────────────────────

function PersonIcon(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ width: '55%', height: '55%' }}
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

/**
 * Avatar — Displays a user image, initials fallback, or person icon fallback.
 *
 * A11y: img includes alt text; initials container has aria-label.
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    size = 'md',
    status,
    ring = false,
    className,
    style,
  },
  ref
) {
  const [imgError, setImgError] = useState(false);

  const showImage = Boolean(src) && !imgError;
  const initials = name ? getInitials(name) : null;

  const classes = [
    styles.avatar,
    styles[`size-${size}`],
    ring && styles.ring,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = alt ?? (name ? `Avatar for ${name}` : 'User avatar');

  return (
    <div ref={ref} className={classes} style={style} aria-label={ariaLabel}>
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? 'avatar'}
          className={styles.img}
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      ) : (
        <span className={styles.fallbackIcon} aria-hidden="true">
          <PersonIcon />
        </span>
      )}

      {status && (
        <span
          className={[styles.statusDot, styles[`status-${status}`]].join(' ')}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
