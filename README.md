# Community Design System + AXIOLEDGER Ecosystem

> **Bộ công cụ mã nguồn mở miễn phí** cho các nhà phát triển và doanh nghiệp xây dựng sản phẩm tài chính kỹ thuật số — từ ví Web2/Web3, dashboard crypto, hệ thống thanh toán SWIFT/Fiat/Token, đến hạ tầng blockchain thương mại.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Preview Pages](https://img.shields.io/badge/Preview-126%20pages-green.svg)](./preview/)
[![Icons](https://img.shields.io/badge/Icons-5130%2B-orange.svg)](./docs/)
[![Astro](https://img.shields.io/badge/Built%20with-Astro%207-purple.svg)](https://astro.build)

---

## Tổng quan

Dự án này bao gồm hai lớp bổ sung cho nhau:

| Lớp | Tên | Mô tả |
|-----|-----|-------|
| **UI Layer** | Community Design System | Design Tokens, Icons, Components, Preview Pages |
| **Protocol Layer** | AXIOLEDGER Ecosystem | Kiến trúc Hub & 4 Pillars, Smart Contracts, Wallet |

---

## Cấu trúc Workspace

```
/
├── docs/               ← Tài liệu Design System (Token Explorer, Icon Search, Component Preview)
├── docs2/              ← Phiên bản tài liệu thay thế / thử nghiệm
├── preview/            ← 126 trang Astro preview (Astro 7.x, SSG)
│   └── pages/          ← dashboard-crypto, pay, sign-in, wallet, invoice, tracking…
├── page/               ← Landing page marketing Community UI Kit
├── LICENSE             ← MIT License
├── README.md           ← File này
├── FUNDING_PROPOSAL.md ← Đề án gọi vốn chi tiết
└── .github/
    └── FUNDING.yml     ← Nút Sponsor trên GitHub
```

---

## Community Design System

Bộ thiết kế hoàn chỉnh cho sản phẩm tài chính:

- **Design Tokens (3 lớp):** Primitive → Semantic → Component, xuất CSS Custom Properties
- **5130+ Icon SVG:** outline style, copy snippet React/Vue/HTML ngay lập tức
- **201 Component:** Button, Badge, Input, Toggle, Card, Navbar, Avatar, Chart…
- **126 trang Preview:** Dashboard, Crypto, Payment, Wallet, Auth, Invoice, Tracking, Maps…
- **7 Brand Colors:** Teal `#49DBC8`, Green `#BEFF6C`, Orange `#FC7339`, Pink `#FD9FDD`, Purple `#AF96FB`, Yellow `#FFF172`, Grey `#EFEFEF`

### Chạy Preview App

```bash
cd preview
pnpm install
pnpm dev
# → http://localhost:4321
```

### Chạy Docs App (không cần server)

```bash
cd docs
npm install
npm run dev
# → http://localhost:3000
# Hoặc chỉ mở docs/index.html trong trình duyệt
```

---

## AXIOLEDGER Ecosystem

Kiến trúc tài chính thế hệ mới được thiết kế để giải quyết các điểm nghẽn của Ethereum, Solana, Arbitrum, Optimism và MetaMask:

```
                    ┌──────────────────────────────┐
                    │       AXIOLEDGER ($AXQ)       │
                    │  [Core Settlement / Hub]       │
                    │  Sổ cái bất biến · DAO · Ngân quỹ│
                    └──────────────┬───────────────┘
                                   │
         ┌─────────────┬───────────┴──────────┬─────────────┐
         ▼             ▼                      ▼             ▼
  ┌──────────┐  ┌──────────┐          ┌──────────┐  ┌──────────┐
  │VALIPRE-  │  │SEQUENTI- │          │KINETO-   │  │VERA-     │
  │CISION    │  │CHAIN     │          │PROTOCOL  │  │CIPHERS   │
  │($VPX)    │  │($SQX)    │          │($KPX)    │  │($VRQ)    │
  ├──────────┤  ├──────────┤          ├──────────┤  ├──────────┤
  │Consensus │  │L2 Exec   │          │DeFi/RWA  │  │ZK/DID    │
  │Multi-    │  │AF_XDP    │          │AMM Pool  │  │ZK-Proof  │
  │client    │  │600K+ TPS │          │Bridge    │  │Supply    │
  │RAMDISK   │  │ZK-Rollup │          │POS Engine│  │Scanner   │
  └──────────┘  └──────────┘          └──────────┘  └──────────┘
```

### Cơ chế Đồng thuận ZK-OBFT

Trọng số bỏ phiếu dựa trên cả stake lẫn uy tín nút:

```
VP_i(t) = S_i(t) × R_i(t)
R_i(t)  = α·U_i(t) + β·ln(1 + γ·B_i(t))
```

- `S_i` — Lượng $VPX đã stake
- `U_i` — Uptime (tỷ lệ trực tuyến)
- `B_i` — Băng thông đóng góp thực tế

### AXIO Vault — Ví Web2/Web3

```
[Email/Google/FaceID] ──► [Smart Contract Wallet]
       │
       ├── Gasless (trả phí bằng USDT qua Paymaster)
       ├── ZK-DID (KYC ẩn danh qua VRQ)
       ├── Cross-chain Bridge (KPX)
       └── Supply Chain Scanner (VRQ — chặn DApp độc hại)
```

---

## Stack kỹ thuật

| Thành phần | Công nghệ |
|------------|-----------|
| Preview app | Astro 7.x, TypeScript, SCSS |
| Design tokens | CSS Custom Properties, Style Dictionary |
| Smart contracts | Rust, Anchor (SVM-compatible) |
| Wallet | TypeScript, MetaMask SDK, EIP-4337 |
| Package manager | pnpm workspaces |
| Deploy | Vercel |

---

## Gọi vốn & Tài trợ

Dự án này cần sự hỗ trợ của cộng đồng để phát hành các gói npm công khai, viết tài liệu đầy đủ và xây dựng AXIO Vault wallet.

👉 Xem chi tiết: [FUNDING_PROPOSAL.md](./FUNDING_PROPOSAL.md)

**Kênh tài trợ:**

<!-- GitHub Sponsors button tự động từ .github/FUNDING.yml -->

| Kênh | Link |
|------|------|
| GitHub Sponsors | https://github.com/sponsors/wikialisalabs |
| Open Collective | https://opencollective.com/wikialisalabs |
| Polar.sh Bounty | https://polar.sh/wikialisalabs |

---

## Đóng góp

Mọi đóng góp đều được hoan nghênh — bug report, tính năng mới, tài liệu, bản dịch.

1. Fork repo
2. Tạo branch: `git checkout -b feat/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả thay đổi"`
4. Push & mở Pull Request

Xem [CONTRIBUTING.md](./CONTRIBUTING.md) để biết thêm chi tiết *(sẽ tạo tại Milestone 1)*.

---

## Giấy phép

[MIT](./LICENSE) — Tự do sử dụng cho mục đích cá nhân lẫn thương mại.

---

*Được xây dựng với ❤️ bởi đội ngũ AXQ · [root@wikialisalabs.axvn.vn](mailto:root@wikialisalabs.axvn.vn)*
