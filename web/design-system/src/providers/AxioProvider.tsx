import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ANSResolverConfig {
  rpcUrl:       string;
  contracts:    { ansRegistry: string };
  cacheTtlMs?:  number;   // default: 50ms
}

export interface AxioProviderProps {
  /** Theme mode. 'system' follows OS prefers-color-scheme. Default: 'system' */
  theme?:             ThemeMode;
  /** ANS resolver endpoint (e.g. https://ans.axqprotocol.axq) */
  ansResolverUrl?:    string;
  /** Override ANS resolver advanced config */
  ansResolverConfig?: ANSResolverConfig;
  children:           ReactNode;
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme:    ThemeMode;
  resolved: 'light' | 'dark';   // actual applied theme after system resolution
  setTheme: (mode: ThemeMode) => void;
}

interface ANSContextValue {
  resolverUrl:    string | undefined;
  resolverConfig: ANSResolverConfig | undefined;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme:    'system',
  resolved: 'light',
  setTheme: () => undefined,
});

export const ANSContext = createContext<ANSContextValue>({
  resolverUrl:    undefined,
  resolverConfig: undefined,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemTheme() : mode;
}

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * AxioProvider — Root context for the AXQ Design System.
 *
 * Responsibilities:
 *   1. Apply data-theme="light|dark" on <html> element.
 *   2. Listen to OS prefers-color-scheme when theme="system".
 *   3. Expose ANS resolver config to all ANS-aware components.
 *
 * Usage:
 * ```tsx
 * <AxioProvider theme="system" ansResolverUrl="https://ans.axqprotocol.axq">
 *   {children}
 * </AxioProvider>
 * ```
 */
export function AxioProvider({
  theme: themeProp = 'system',
  ansResolverUrl,
  ansResolverConfig,
  children,
}: AxioProviderProps): React.JSX.Element {
  const [theme, setThemeState] = useState<ThemeMode>(themeProp);
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolveTheme(themeProp));

  // Sync resolved theme → data-theme attribute on <html>
  useEffect(() => {
    const next = resolveTheme(theme);
    setResolved(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
    }
  }, [theme]);

  // Listen to OS preference changes when theme === 'system'
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? 'dark' : 'light';
      setResolved(next);
      document.documentElement.setAttribute('data-theme', next);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      <ANSContext.Provider value={{ resolverUrl: ansResolverUrl, resolverConfig: ansResolverConfig }}>
        {children}
      </ANSContext.Provider>
    </ThemeContext.Provider>
  );
}

// ─── Internal hook (used by components) ─────────────────────────────────────

/** @internal */
export function useANSContext(): ANSContextValue {
  return useContext(ANSContext);
}
