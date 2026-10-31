import { useCallback, useContext, useRef } from 'react';
import { ANSContext } from '../providers/AxioProvider';
import { resolveTLPLevel } from '../types/tlp';
import type { TLPLevel } from '../types/tlp';

export interface ANSResolution {
  name:     string | null;   // resolved ANS name (e.g. "alice.axq"), null if not found
  address:  string;          // canonical 0x address
  tlpLevel: TLPLevel;
  loading:  boolean;
  error:    string | null;
}

type CacheEntry = { name: string | null; tlpLevel: TLPLevel; ts: number };

/**
 * useANSResolver — Resolve an 0x address or ANS name to its canonical form.
 *
 * Implements an in-memory LRU-style cache with configurable TTL (default 50ms).
 * On RPC failure, falls back to truncated hex display and sets error message.
 *
 * @example
 * ```tsx
 * const { resolve } = useANSResolver();
 *
 * const result = await resolve('0x71C...3A9');
 * // result.name     → 'alice.axq'  (or null)
 * // result.tlpLevel → 'safe'
 * ```
 */
export function useANSResolver(): {
  resolve: (addressOrName: string) => Promise<ANSResolution>;
} {
  const { resolverUrl, resolverConfig } = useContext(ANSContext);
  const cacheTtl  = resolverConfig?.cacheTtlMs ?? 50;
  const cacheRef  = useRef<Map<string, CacheEntry>>(new Map());

  const resolve = useCallback(async (input: string): Promise<ANSResolution> => {
    const key = input.trim().toLowerCase();

    // Cache hit
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.ts < cacheTtl) {
      return {
        name:     cached.name,
        address:  input,
        tlpLevel: cached.tlpLevel,
        loading:  false,
        error:    null,
      };
    }

    // If no resolver configured — determine TLP from name pattern only
    if (!resolverUrl && !resolverConfig) {
      const tlpLevel = resolveTLPLevel(input);
      return { name: null, address: input, tlpLevel, loading: false, error: null };
    }

    try {
      const endpoint = resolverUrl ?? resolverConfig?.rpcUrl ?? '';
      const res = await fetch(`${endpoint}/resolve?name=${encodeURIComponent(input)}`, {
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) throw new Error(`ANS resolver HTTP ${res.status}`);

      const data = (await res.json()) as { name?: string; address?: string };
      const resolvedName = data.name ?? null;
      const address      = data.address ?? input;
      const tlpLevel     = resolveTLPLevel(resolvedName ?? input);

      cacheRef.current.set(key, { name: resolvedName, tlpLevel, ts: Date.now() });

      return { name: resolvedName, address, tlpLevel, loading: false, error: null };

    } catch (err) {
      // RPC unavailable — fall back gracefully, mark as blocked for safety
      const tlpLevel = resolveTLPLevel(input);
      return {
        name:     null,
        address:  input,
        tlpLevel: tlpLevel === 'safe' ? 'blocked' : tlpLevel,
        loading:  false,
        error:    err instanceof Error ? err.message : 'ANS resolver unavailable',
      };
    }
  }, [resolverUrl, resolverConfig, cacheTtl]);

  return { resolve };
}
