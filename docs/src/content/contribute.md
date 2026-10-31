---
title: Contribute
route: /contribute
description: How to contribute components, icons, tokens, and docs to Wikialisalabs Design System
---

# Contribute to Wikialisalabs

> The design system grows through community contributions. Whether you're a developer, designer, researcher, or user — there's a place for your voice here.

---

## What You Can Contribute

| Type | Examples | Difficulty |
| --- | --- | --- |
| **Component** | CryptoAddressInput, ZK-Badge, DeFi Chart, OTP Cell | Medium |
| **Icon** | New SVG icon for a protocol, exchange, or DID provider | Easy |
| **Token** | New semantic color, spacing value, or component token | Easy |
| **Documentation** | Usage guide, code example, translation | Easy |
| **Bug Fix** | Accessibility fix, broken state, token mismatch | Varies |
| **UI Kit** | New vertical kit (e.g. NFT Gallery, DAO Governance) | Hard |

---

## Contribution Workflow

1. **Propose** — Open an issue or fill the Submit form below describing what you want to build
2. **Discuss** — Maintainers and community leave feedback, vote, and refine the spec
3. **Build** — Fork the repo, implement the component following the token rules
4. **PR Review** — Submit a PR; automated checks run; maintainer review within 3–5 days
5. **Merge** — Merged into `main`, published in next minor release

---

## Component Checklist

Before submitting a component PR, verify:

- [ ] Uses only semantic tokens (never raw hex or px values)
- [ ] Works in both light and dark mode (`data-theme="dark"`)
- [ ] Keyboard navigable (Tab, Enter, Escape, arrow keys where applicable)
- [ ] Has `aria-*` attributes for screen readers
- [ ] Includes a `.md` usage doc in `src/content/`
- [ ] Tested at 320px, 768px, and 1280px viewports
- [ ] No external dependencies (zero-dep, vanilla JS or minimal)
- [ ] Follows the Neubrutal style: `2px solid #000` borders, `4px 4px 0 #000` shadow

---

## Code Style

```js
// ✅ Good — uses semantic tokens
.my-component {
  background: var(--axq-bg-primary);
  border: 2px solid var(--axq-border-strong);
  border-radius: var(--axq-radius-lg);
  color: var(--axq-text-primary);
}

// ❌ Bad — raw values bypass the token system
.my-component {
  background: #FFFFFF;
  border: 2px solid #000000;
  border-radius: 12px;
  color: #101426;
}
```

---

## Contributor Levels

Progress through levels as your contributions grow:

| Level | Min Contributions | Perks |
| --- | --- | --- |
| **Newcomer** | 0 | Can propose and vote |
| **Member** | 3 | Can review PRs, comment on all issues |
| **Contributor** | 10 | Gets credited in release notes |
| **Maintainer** | 25 | Can merge PRs, manage roadmap |

---

## Community Standards

- Be kind and constructive — critique the code, not the person
- Contributions that improve accessibility or security are prioritized
- All contributions are MIT licensed unless explicitly noted
- The maintainer team reserves the right to decline contributions that conflict with design principles

---

## Links

- **GitHub Repository:** [github.com/Wikialisalabslabs](https://github.com/Wikialisalabslabs)
- **Open Issues:** [github.com/Wikialisalabslabs/issues](https://github.com/Wikialisalabslabs/issues)
- **Design Tokens Reference:** [#/tokens](#/tokens)
- **Security Policy:** [SECURITY.md](../SECURITY.md)
- **Contact:** security@axvn.vn · contact@wikialisalabs.axvn.vn
