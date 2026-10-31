import React, { forwardRef } from 'react';
import styles from './Navbar.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  /** Unique key for this nav item */
  key:       string;
  /** Visible label */
  label:     string;
  /** Icon element (20×20px recommended) */
  icon:      React.ReactNode;
  /** Icon shown when item is active (falls back to icon) */
  iconActive?: React.ReactNode;
  /** Badge count — shown as a red dot/number when > 0 */
  badge?:    number;
  /** Disable this nav item */
  disabled?: boolean;
}

export interface NavbarProps {
  /** Navigation items (3–5 recommended) */
  items:      NavItem[];
  /** Currently active item key */
  activeKey:  string;
  /** Called when a nav item is tapped */
  onChange:   (key: string) => void;
  /** Extra className on the nav bar root */
  className?: string;
  /** aria-label for the nav landmark. Default: 'Bottom navigation' */
  ariaLabel?: string;
}

// ─── Badge node ───────────────────────────────────────────────────────────────

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className={styles.badge} aria-label={`${count} thông báo chưa đọc`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Navbar = forwardRef<HTMLElement, NavbarProps>(({
  items,
  activeKey,
  onChange,
  className,
  ariaLabel = 'Bottom navigation',
}, ref) => (
  <nav
    ref={ref}
    className={[styles.navbar, className].filter(Boolean).join(' ')}
    aria-label={ariaLabel}
  >
    {items.map((item) => {
      const isActive = item.key === activeKey;
      return (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-disabled={item.disabled}
          disabled={item.disabled}
          className={styles.item}
          data-active={isActive ? 'true' : undefined}
          onClick={() => !item.disabled && onChange(item.key)}
        >
          <span className={styles.iconWrap} aria-hidden="true">
            {isActive && item.iconActive ? item.iconActive : item.icon}
            {item.badge !== undefined && <NavBadge count={item.badge} />}
          </span>
          <span className={styles.label}>{item.label}</span>
        </button>
      );
    })}
  </nav>
));

Navbar.displayName = 'Navbar';
