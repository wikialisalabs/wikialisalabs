/**
 * Icon.tsx — @axioledger/axio-design-system v6.0.0
 *
 * Renders a single SVG symbol from the compiled sprite sheet
 * at /sprites/icons.svg (served as a static asset by your app).
 *
 * Usage:
 *   <Icon name="linear-wallet" size={24} />
 *   <Icon name="bold-bitcoin" size={32} color="var(--axq-p-brand-teal)" />
 *   <Icon name="linear-swap" aria-label="Swap tokens" />
 *
 * Note: Run `pnpm prep:icons` to regenerate the sprite and update icon.types.ts
 * whenever new icons are added to /root/asset/icon.
 */

import React from 'react';
import type { IconName } from './icon.types';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon identifier — format: "linear-{name}" or "bold-{name}" */
  name: IconName;
  /**
   * Width and height in pixels (number) or any CSS length string ("1.5rem", "100%").
   * Defaults to 24.
   */
  size?: number | string;
  /** CSS color value. Falls back to currentColor (inherits from parent). */
  color?: string;
  /** Accessible label. Omit for decorative icons (adds aria-hidden="true"). */
  'aria-label'?: string;
  /**
   * Path to the compiled sprite sheet.
   * Override only for non-standard static-asset setups.
   * Default: '/sprites/icons.svg'
   */
  spriteUrl?: string;
}

/**
 * Renders an inline SVG <use> reference to the shared sprite sheet.
 * Zero JS bundle cost — no SVG content is inlined into component JS.
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  className,
  style,
  'aria-label': ariaLabel,
  spriteUrl = '/sprites/icons.svg',
  ...rest
}) => {
  const isDecorative = !ariaLabel;
  const px = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      width={px}
      height={px}
      focusable="false"
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={isDecorative ? undefined : ariaLabel}
      role={isDecorative ? undefined : 'img'}
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        color: color ?? 'currentColor',
        fill: 'currentColor',
        stroke: 'currentColor',
        ...style,
      }}
      {...rest}
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  );
};

export default Icon;
