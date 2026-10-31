# AXIO-DS — Developer Integration Guide

> **Version:** 2.0  
> **Package:** `@axioledger/axio-design-system`  
> **Stack:** React 18 + Next.js 15 (App Router) · CSS Custom Properties · TypeScript  

---

## 1. Installation

```bash
# From the monorepo (workspace reference)
pnpm add @axioledger/axio-design-system

# External consumers (GitHub Packages)
echo "//npm.pkg.github.com/:_authToken=YOUR_READ_PAT" >> ~/.npmrc
pnpm add @axioledger/axio-design-system
```

---

## 2. Global Setup (Next.js App Router)

### 2a. Import CSS tokens in root layout

```tsx
// apps/*/src/app/layout.tsx
import '@axioledger/axio-design-system/styles';  // variables.css + component base CSS
import '@axioledger/axio-design-system/fonts';   // Work Sans Google Font preload
```

### 2b. Wrap with `AxioProvider` (theme + namespace context)

```tsx
import { AxioProvider } from '@axioledger/axio-design-system';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AxioProvider theme="dark" ansResolverUrl="https://ans.axqprotocol.axq">
          {children}
        </AxioProvider>
      </body>
    </html>
  );
}
```

---

## 3. Traffic Light Protocol (TLP) — Namespace Security

The AXIO-DS color system is **directly bound to the ANS namespace**.  
Every address input and recipient display **must** resolve the namespace before rendering.

### TLP Level Map

| Level | Namespaces | CSS Token | UX Behavior |
|---|---|---|---|
| **SAFE** | `.axq` `.vrq` | `--tlp-safe` = `#00D68F` | ✅ Green badge — allow all actions |
| **CAUTION** | `.kpx` | `--tlp-caution` = `#FFAA00` | ⚠️ Yellow — show DeFi risk disclaimer |
| **BLOCKED** | `unknown.*` / unregistered | `--tlp-blocked` = `#FF3D71` | 🚫 Red — disable Sign button |
| **SYSTEM** | `.sqx` `.vpx` | `--tlp-system` = `#57606A` | ⚙️ Hidden from end-user UI |

### Usage

```tsx
import { NamespaceBadge, SecurityAlert, AddressDisplay } from '@axioledger/axio-design-system';

// Automatically resolves TLP level from the ANS tld
<NamespaceBadge name="alice.axq" />       // → green SAFE badge
<NamespaceBadge name="pool-123.kpx" />    // → yellow CAUTION badge
<NamespaceBadge name="0x71C...3A9" />     // → red BLOCKED badge (raw hex = suspicious)

// Security alert blocks the Sign button when level === 'blocked'
<SecurityAlert level="blocked" onDismiss={() => {}} />

// Address display with ANS resolution (< 50ms cached)
<AddressDisplay address="0x71C..." />     // renders "alice.axq" if registered
```

---

## 4. Component Catalogue

### Button

```tsx
import { Button } from '@axioledger/axio-design-system';

<Button type="filled"   color="blue"  size="large"  loading>Send</Button>
<Button type="outlined" color="error" size="medium" disabled>Cancel</Button>
<Button type="ghost"    color="black" size="small"  iconLeft={<ArrowIcon />}>Back</Button>
<Button type="filled"   color="black" size="large"  iconOnly aria-label="Add" />
```

**Props:**

| Prop | Type | Default |
|---|---|---|
| `type` | `'filled' \| 'outlined' \| 'ghost'` | `'filled'` |
| `color` | `'black' \| 'blue' \| 'green' \| 'yellow' \| 'orange' \| 'error' \| 'navy' \| 'white'` | `'blue'` |
| `size` | `'giant' \| 'large' \| 'medium' \| 'small'` | `'medium'` |
| `loading` | `boolean` | `false` |
| `iconLeft` | `ReactNode` | — |
| `iconRight` | `ReactNode` | — |
| `iconOnly` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |

### Input (ANS-aware)

```tsx
import { Input } from '@axioledger/axio-design-system';

// Resolves ANS names as the user types — shows NamespaceBadge inline
<Input
  type="text"
  label="Recipient"
  placeholder="alice.axq or 0x…"
  ansResolve          // enable ANS resolution
  onResolve={(addr, tlpLevel) => setRecipient(addr)}
/>

// Standard form input
<Input type="password" label="PIN" size="large" error="Incorrect PIN" />
```

### PasskeyButton

```tsx
import { PasskeyButton } from '@axioledger/axio-design-system';

// Login / Register flow — hides all Web3 complexity
<PasskeyButton action="register" onSuccess={(pubKeyX, pubKeyY) => installModule(pubKeyX, pubKeyY)}>
  Sign up with Face ID
</PasskeyButton>

<PasskeyButton action="authenticate" onSuccess={(sig) => submitUserOp(sig)}>
  Confirm with Touch ID
</PasskeyButton>
```

### Toast

```tsx
import { useToast } from '@axioledger/axio-design-system';

const { toast } = useToast();

toast.success('Transaction confirmed ✓');
toast.error('Signature rejected', { duration: 5000 });
toast.warning('High slippage detected — 4.2%');
toast.info('Waiting for block confirmation…');
```

### SecurityAlert (Anti-Phishing)

```tsx
import { SecurityAlert } from '@axioledger/axio-design-system';

// Shown automatically by Input[ansResolve] when TLP = 'blocked'
// Can also be used manually:
<SecurityAlert
  level="blocked"
  name="0xdeadbeef..."
  reason="Address not registered in ANS — potential phishing target"
  onDismiss={() => clearRecipient()}
  onProceed={() => allowOverride()}  // optional — for power users
/>
```

---

## 5. Theming

### CSS Custom Properties override

```css
/* Per-app theme override (add to your global CSS) */
:root {
  /* Accent — KPX DEX uses orange, Governance uses navy */
  --color-accent-primary: #FC7339;
}
```

### Dark mode

Handled automatically via `data-theme="dark"` on `<html>` (set by `AxioProvider`).  
Respect user system preference by default.

```tsx
<AxioProvider theme="system">  {/* auto | light | dark */}
```

---

## 6. ANS Resolver Caching

The `@axioledger/ans-resolver` package is used internally by `AddressDisplay` and `Input[ansResolve]`.

**Cache TTL:** 50ms (in-memory LRU, max 500 entries)  
**Fallback:** If RPC is unavailable, shows truncated hex with a `⚠️` icon.

```tsx
// Override resolver config globally
<AxioProvider
  ansResolverConfig={{
    rpcUrl:  'https://eth-sepolia.g.alchemy.com/v2/MY_KEY',
    contracts: { ansRegistry: '0x…' },
    cacheTtlMs: 50,
  }}
>
```

---

## 7. Accessibility (a11y)

- All interactive components support **keyboard navigation** (Tab, Enter, Space, Esc).
- Focus rings use `--color-border-focus` (2px offset 2px).
- `aria-label` is **required** on `iconOnly` Buttons.
- SecurityAlert uses `role="alertdialog"` and traps focus while open.
- Skeleton placeholders use `aria-busy="true"` and `aria-label="Loading…"`.

---

## 8. Security Rules (Frontend Engineering)

1. **Never display raw 0x addresses** to end users — always wrap in `<AddressDisplay>`.
2. **Never allow Sign/Send** when TLP level is `'blocked'` — the `SecurityAlert` component enforces this via `disabled` prop on any sibling `Button`.
3. **Seed phrases must never appear** in any UI component — the `PasskeyButton` is the only authentication entry point.
4. **DeFi interactions** (`.kpx` namespace) must always show the risk disclaimer modal before the first transaction per session.
5. The `ViewKeys` (audit export) must only be accessible from `Settings > Advanced > Compliance Export` — never on any primary screen.
