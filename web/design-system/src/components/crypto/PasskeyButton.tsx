import { forwardRef, useState, useCallback } from 'react';
import styles from './PasskeyButton.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PasskeyAction = 'register' | 'authenticate';

export interface PasskeyButtonProps {
  /** 'register' = create a new passkey, 'authenticate' = sign with existing */
  action:       PasskeyAction;
  /** Called with the credential on success */
  onSuccess:    (credential: PublicKeyCredential) => void;
  /** Called with error message on failure */
  onError?:     (message: string) => void;
  /** Challenge bytes from server (base64url encoded) */
  challenge:    string;
  /** Relying party ID (e.g. 'axioledger.com') */
  rpId?:        string;
  /** User display name (used during registration) */
  userName?:    string;
  /** User ID bytes (base64url) */
  userId?:      string;
  /** Disable the button */
  disabled?:    boolean;
  /** Custom button label */
  label?:       string;
  className?:   string;
}

// ─── Base64url helpers ────────────────────────────────────────────────────────

function b64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PasskeyButton = forwardRef<HTMLButtonElement, PasskeyButtonProps>(({
  action,
  onSuccess,
  onError,
  challenge,
  rpId       = window.location.hostname,
  userName   = 'user',
  userId     = 'dXNlcg==', // "user" in base64
  disabled   = false,
  label,
  className,
}, ref) => {
  const [loading, setLoading] = useState(false);
  const supported = typeof window !== 'undefined' && !!window.PublicKeyCredential;

  const defaultLabel = action === 'register' ? 'Register Passkey' : 'Sign with Passkey';

  const handleClick = useCallback(async () => {
    if (!supported) {
      onError?.('WebAuthn is not supported in this browser.');
      return;
    }
    setLoading(true);
    try {
      let credential: PublicKeyCredential;
      if (action === 'register') {
        credential = await navigator.credentials.create({
          publicKey: {
            challenge:  b64ToBuffer(challenge),
            rp:         { id: rpId, name: 'Axioledger' },
            user:       { id: b64ToBuffer(userId), name: userName, displayName: userName },
            pubKeyCredParams: [
              { type: 'public-key', alg: -7  },  // ES256
              { type: 'public-key', alg: -257 }, // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification:        'required',
              residentKey:             'preferred',
            },
            timeout: 60000,
          },
        }) as PublicKeyCredential;
      } else {
        credential = await navigator.credentials.get({
          publicKey: {
            challenge:        b64ToBuffer(challenge),
            rpId,
            userVerification: 'required',
            timeout:          60000,
          },
        }) as PublicKeyCredential;
      }
      onSuccess(credential);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Passkey operation failed';
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  }, [action, challenge, rpId, userName, userId, onSuccess, onError, supported]);

  if (!supported) {
    return (
      <div className={[styles.unsupported, className].filter(Boolean).join(' ')} role="alert">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        Passkey not supported in this browser
      </div>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={[styles.btn, className].filter(Boolean).join(' ')}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      data-action={action}
    >
      {loading ? (
        <>
          <svg className={styles.spinner} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10"/>
          </svg>
          Verifying…
        </>
      ) : (
        <>
          {/* Fingerprint / key icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
          </svg>
          {label ?? defaultLabel}
        </>
      )}
    </button>
  );
});

PasskeyButton.displayName = 'PasskeyButton';
