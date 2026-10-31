import { useContext } from 'react';
import { ThemeContext } from '../providers/AxioProvider';
import type { ThemeMode } from '../providers/AxioProvider';

/**
 * useTheme — Access and control the current design system theme.
 *
 * @example
 * ```tsx
 * const { resolved, setTheme } = useTheme();
 * // resolved: 'light' | 'dark'  (actual applied theme)
 * // setTheme('dark')             (override manually)
 * ```
 */
export function useTheme(): {
  theme:    ThemeMode;
  resolved: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
} {
  return useContext(ThemeContext);
}
