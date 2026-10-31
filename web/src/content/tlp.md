---
title: TLP Security
route: /tlp
description: Traffic Light Protocol — ANS namespace trust classification and anti-phishing
---

# TLP — Traffic Light Protocol

> TLP is the **legal and UX defence layer** for the AxioPass UI. It classifies every ANS address or domain the user interacts with by trust level, driving real-time colour feedback and hard transaction blocks.

---

## Trust Levels

| Level | CSS Token | Namespaces | Colour | UI Behaviour |
| --- | --- | --- | --- | --- |
| **SAFE** | `--axq-tlp-safe` | `.axq` `.vrq` | `#00D68F` ✅ | Allow all transactions |
| **CAUTION** | `--axq-tlp-caution` | `.kpx` | `#FFAA00` ⚠️ | Show DeFi disclaimer, require confirmation |
| **BLOCKED** | `--axq-tlp-blocked` | `0x…`, unknown TLD | `#FF3D71` 🚫 | **Disable Sign button**, show SecurityAlert |
| **SYSTEM** | `--axq-tlp-system` | `.sqx` `.vpx` | `#2E3A59` ⚙️ | Hidden from end-user UI |

---

## CSS Tokens

```css
/* Layer 2 — Semantic */
--axq-tlp-safe:           #00D68F   /* → success/500  */
--axq-tlp-safe-bg:        #F0FFF5   /* → success-bg   */
--axq-tlp-safe-text:      #00997A

--axq-tlp-caution:        #FFAA00   /* → warning/500  */
--axq-tlp-caution-bg:     #FFFDF2
--axq-tlp-caution-text:   #B86E00

--axq-tlp-blocked:        #FF3D71   /* → error/500    */
--axq-tlp-blocked-border: #FF3D71
--axq-tlp-system:         #2E3A59   /* → grey/400     */

/* Layer 3 — Component */
--axq-c-tlp-safe-bg:           var(--axq-tlp-safe-bg)
--axq-c-tlp-blocked-border:    var(--axq-tlp-blocked-border)
--axq-c-input-border-blocked:  var(--axq-tlp-blocked-border)
```

---

## Usage in Components

```tsx
import { resolveTLP, NamespaceBadge, SecurityAlert } from '@axioledger/axio-design-system';

const level = resolveTLP(recipientAddress);
// → 'safe' | 'caution' | 'blocked' | 'system'

<NamespaceBadge name={recipientAddress} level={level} />

{level === 'blocked' && (
  <SecurityAlert
    level="blocked"
    name={recipientAddress}
    reason="Unknown namespace — potential phishing target"
  />
)}
```

---

## Security Rules

1. **Never display raw 0x addresses** without wrapping in `<AddressDisplay>`.
2. **Never allow Sign/Send** when TLP level is `'blocked'` — `SecurityAlert` enforces this via `disabled` on sibling `Button`.
3. **DeFi interactions** (`.kpx` namespace) must always show risk disclaimer before first transaction per session.
4. `PasskeyButton` is the **sole authentication entry point** — no private key API exposed.
