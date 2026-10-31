# Wikialisalabs — Lịch sử Hội thoại Kiến trúc & Nghiên cứu

> Tài liệu tổng hợp toàn bộ quá trình nghiên cứu hạ tầng blockchain, thiết kế kiến trúc AXIOLEDGER/Wikialisalabs và phát triển hệ sinh thái.
>
> **Repo:** github.com/wikialisalabs · **Liên hệ:** root@wikialisalabs.axvn.vn

---

## Cấu trúc Workspace

```
/root/workspace/
├── index.md                    ← Trang điều hướng này
├── README.md                   ← Tổng quan hệ sinh thái
├── WHITEPAPER.md               ← Kiến trúc kỹ thuật 18 chương
├── DESIGN_SYSTEM.md            ← Blueprint Atomic Design System
├── FUNDING_PROPOSAL.md         ← Đề án gọi vốn
├── LICENSE                     ← MIT License
├── .github/FUNDING.yml         ← GitHub Sponsors / Gitcoin
│
├── site/                       ← Docs SPA hợp nhất (docs + docs2 + page)
│   ├── index.html              ← Shell: sidebar + topbar + router
│   ├── landing.html            ← Marketing showcase (từ page/)
│   ├── netlify.toml            ← Deploy config Netlify
│   ├── vercel.json             ← Deploy config Vercel
│   ├── README.md               ← Hướng dẫn site/
│   └── src/
│       ├── content/            ← Markdown nguồn (chỉnh sửa tại đây)
│       │   ├── overview.md     ← Trang Overview
│       │   ├── tokens.md       ← Token reference
│       │   ├── icons.md        ← Icon library docs
│       │   ├── components.md   ← Component reference
│       │   ├── zones.md        ← App zones
│       │   └── contribute.md   ← Hướng dẫn đóng góp cộng đồng
│       ├── lib/
│       │   ├── md.js           ← Zero-dep Markdown → HTML renderer
│       │   └── contrib.js      ← Community contribution components
│       ├── pages/              ← Route modules (router-driven)
│       │   ├── overview.js     ← Route #/
│       │   ├── tokens.js       ← Route #/tokens
│       │   ├── icons.js        ← Route #/icons
│       │   ├── components.js   ← Route #/components
│       │   ├── zones.js        ← Route #/zones
│       │   └── contribute.js   ← Route #/contribute (pending)
│       ├── router/index.js     ← Hash router
│       ├── data/               ← Token data, icon index
│       └── style/              ← shell.css, pages.css
│
└── preview/                    ← Astro component preview (100+ pages)
    ├── pages/                  ← .astro pages (buttons, cards, charts…)
    └── scss/                   ← Demo styles
```

---

## Mục lục nghiên cứu

### Phần 1 — Báo cáo Rà quét Hạ tầng Blockchain

| Mạng lưới | Nội dung nghiên cứu |
|-----------|---------------------|
| **Ethereum** | Validators (903.358+), ENS (2.8M+ domain), GitHub (25.439 commits), npm (ethers, viem, @openzeppelin) |
| **Solana** | SNS (.sol — 464K+ domain), 3.704–4.514 nodes, 102K repos GitHub, @solana/web3.js (194 packages) |
| **Arbitrum** | Optimistic Rollup L2, Nitro nodes, .arb domain (SPACE ID), @arbitrum/sdk, Stylus (Rust/C++ → WASM) |
| **Optimism** | OP Stack / Superchain, ENS integration, @eth-optimism/sdk, RetroPGF, Base (Coinbase) |
| **MetaMask** | Extension/Mobile, 250+ GitHub repos, @metamask/detect-provider, MetaMask Snaps, eth-phishing-detect |

### Phần 2 — Thiết kế Kiến trúc Wikialisalabs

| Chủ đề | Tóm tắt |
|--------|---------|
| **Hub & 4 Pillars** | AXIOLEDGER ($AXQ) Hub + VALIPRECISION ($VPX) + SEQUENTICHAIN ($SQX) + KINETOPROTOCOL ($KPX) + VERACIPHERS ($VRQ) |
| **ZK-OBFT Consensus** | VP_i(t) = S_i(t) × R_i(t) · Reputation-based voting · ZK-SNARK nén chữ ký · Instant Slashing · DDoS resilience |
| **Tokenomics** | 10T $AXQ · Value-Pegged Emission · RWA Collateral Lock · Buyback & Burn · Proof-of-Lock 4 nhánh |
| **AXIO Vault** | Web2/Web3 hybrid wallet · MetaMask SDK · EIP-4337 AA · Gasless · ZK-DID · Supply Chain Scanner |
| **KPX RWA Smart Contract** | Rust/Anchor · ZK-DID verify → Oracle pricing → $AXQ lock (15%) → Emission trigger |
| **Hội đồng 8 Cố vấn** | 5 mạng lưới (Solis/Aether/Arbi/Opti/Meta) + 3 thế lực (Lexis/Capitalis/Q-Oracle) |
| **Lộ trình 5 Giai đoạn** | Giai đoạn 1–4 (12 tháng) + Giai đoạn 5: Sovereign Debt Tokenization, AXIO-OS, Decentralized AI |

### Phần 3 — Tài liệu Gốc (root)

| File | Nội dung |
|------|----------|
| [`WHITEPAPER.md`](./WHITEPAPER.md) | Toàn văn kiến trúc 18 chương: ZK-OBFT, Tokenomics, RWA Smart Contract Rust, Hội đồng 8 Cố vấn |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Blueprint Atomic Design System: Colors, Typography, 5130+ Icons, 12 UI Kits, 15 danh mục |
| [`FUNDING_PROPOSAL.md`](./FUNDING_PROPOSAL.md) | Đề án gọi vốn: 4 milestone, $48K ngân sách, funding tiers, FAQ |
| [`README.md`](./README.md) | Tổng quan hệ sinh thái, hướng dẫn chạy local, kiến trúc |
| [`LICENSE`](./LICENSE) | MIT — tự do thương mại |
| [`.github/FUNDING.yml`](./.github/FUNDING.yml) | GitHub Sponsors + Open Collective + Polar.sh + Gitcoin |

### Phần 4 — Design System Docs (`site/`)

| File | Nội dung |
|------|----------|
| [`site/index.html`](./site/index.html) | SPA shell — sidebar router, topbar, #app mount |
| [`site/landing.html`](./site/landing.html) | Marketing showcase: hero, phone mockups, color palette, components demo |
| [`site/README.md`](./site/README.md) | Kiến trúc site/, MD content system, hướng dẫn chạy local |
| [`site/src/lib/md.js`](./site/src/lib/md.js) | Zero-dep Markdown renderer: frontmatter, tables, fenced code, `:::preview` islands |
| [`site/src/lib/contrib.js`](./site/src/lib/contrib.js) | Community components: ContribCard, VoteBar, SubmitForm, CommentThread, ContributorBadge, StatusBoard |
| [`site/src/content/overview.md`](./site/src/content/overview.md) | Trang tổng quan Design System |
| [`site/src/content/tokens.md`](./site/src/content/tokens.md) | Tài liệu 3-layer token system |
| [`site/src/content/icons.md`](./site/src/content/icons.md) | Tài liệu icon library 6000+ |
| [`site/src/content/components.md`](./site/src/content/components.md) | Tài liệu 201 component |
| [`site/src/content/zones.md`](./site/src/content/zones.md) | App zones & layout rules |
| [`site/src/content/contribute.md`](./site/src/content/contribute.md) | Hướng dẫn đóng góp cộng đồng |
| [`site/src/router/index.js`](./site/src/router/index.js) | Hash router: #/ #/tokens #/icons #/components #/zones #/contribute |
| [`site/src/pages/overview.js`](./site/src/pages/overview.js) | Page module — pure MD |
| [`site/src/pages/tokens.js`](./site/src/pages/tokens.js) | Page module — hybrid MD + live token explorer |
| [`site/src/pages/icons.js`](./site/src/pages/icons.js) | Page module — hybrid MD + live icon search |
| [`site/src/pages/components.js`](./site/src/pages/components.js) | Page module — hybrid MD + live component preview |
| [`site/src/pages/zones.js`](./site/src/pages/zones.js) | Page module — pure MD |
| [`site/src/data/tokens.js`](./site/src/data/tokens.js) | Token data: PRIMITIVE_COLORS, SEMANTIC_COLORS, COMPONENT_TOKENS |
| [`site/src/data/icons.js`](./site/src/data/icons.js) | Icon index loader + svgPath helper |
| [`site/src/style/shell.css`](./site/src/style/shell.css) | Sidebar, topbar, layout, mobile drawer |
| [`site/src/style/pages.css`](./site/src/style/pages.css) | Shared page utilities, nb-card, tabs, token rows |
| [`site/src/data/icons-index.json`](./site/src/data/icons-index.json) | Icon name index (JSON array) — nguồn cho icon search |
| [`site/package.json`](./site/package.json) | `wikialisalabs-docs` v1.0 — npm scripts |
| [`site/netlify.toml`](./site/netlify.toml) | Netlify deploy: `publish = "."`, cache headers |
| [`site/vercel.json`](./site/vercel.json) | Vercel deploy: cache-control headers |

### Phần 5 — Component Preview (`preview/`)

| Mục | Nội dung |
|-----|----------|
| [`preview/pages/`](./preview/pages/) | 100+ trang `.astro` preview: buttons, cards, charts, dashboard, auth, DeFi… |
| [`preview/pages/dashboard-crypto.astro`](./preview/pages/dashboard-crypto.astro) | Crypto dashboard layout |
| [`preview/pages/sign-in.astro`](./preview/pages/sign-in.astro) | Auth / sign-in flow |
| [`preview/pages/onboarding.astro`](./preview/pages/onboarding.astro) | Onboarding wizard |
| [`preview/pages/pay.astro`](./preview/pages/pay.astro) | Payment flow |
| [`preview/pages/charts-advanced.astro`](./preview/pages/charts-advanced.astro) | Advanced chart components |
| [`preview/astro.config.mjs`](./preview/astro.config.mjs) | Astro build config |
| [`preview/package.json`](./preview/package.json) | `@wikialisalabs/preview` v1.4.0 |

---

## Kiến trúc nhanh — Wikialisalabs Master Roadmap v0.0

- **13 chương** từ Tổng quan → Monorepo → Layer Stack → Tokenomics → Design System → Axiopass Wallet → Lộ trình 4 giai đoạn → KPIs → Quản trị DAO → Bảo mật → DevOps
- **Monorepo structure:** `axioledger-workspace/` với 5 scope: `@axioledger/*`, `@valiprecision/*`, `@sequentichain/*`, `@kinetoprotocol/*`, `@veraciphers/*`
- **axioledger VDOM engine** (1 kB): `h()`, `text()`, `app()`, `memo()` — UI engine cho toàn bộ DApp frontend
- **StatelessTransaction:** `TransactionPayload` + `ZkAuthProof (P-256 WebAuthn)` + `MerkleWitness`
- **ZK-EVM Bridge:** `EVM_Vault.sol` (Ethereum) ↔ `Kpx_Bridge.rs` (Axioledger L1/L2)
- **Axiopass Wallet:** 65+ màn hình · 8 zones · 4 design phases · iOS-first (390×844)

---

## Nguyên tắc Thiết kế Cốt lõi

1. **Phi trạng thái ở tầng xác thực** — Validators chỉ cần State Root + Merkle Witness
2. **Zero Seed Phrase** — Passkey WebAuthn thay thế hoàn toàn
3. **ZK làm tầng tin cậy** — Mọi KPI, giải ngân, bridge, identity đều qua ZK Proof
4. **Component không trỏ thẳng Primitive** — Token chain: Primitive → Semantic → Component
5. **axioledger là UI engine tối giản** — 1 kB VDOM, Actions pure functions, no side effects in view

---

*Wikialisalabs Monorepo · Copyright © 2026 Wikialisalabs Foundation v0.0 · root@wikialisalabs.axvn.vn*
