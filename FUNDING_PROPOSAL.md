# 📄 Funding Proposal — Community Design System & AXIOLEDGER Ecosystem

> **Phiên bản:** 1.0.0 · **Ngày:** 2026-10-31 · **Trạng thái:** Open for Sponsorship / Grant

---

## 1. Tóm tắt điều hành (Executive Summary)

**Vấn đề:** Các nhà phát triển và doanh nghiệp muốn xây dựng sản phẩm tài chính số (ví, DeFi, thanh toán SWIFT/Fiat/Token/Blockchain) đang mất hàng tháng để xây dựng từng mảnh UI riêng lẻ, thiếu một bộ công cụ thống nhất, miễn phí và sẵn sàng cho thương mại.

**Giải pháp:** Bộ công cụ mã nguồn mở **Community Design System** + **AXIOLEDGER Ecosystem** — cung cấp đầy đủ UI Kit, Design Tokens (3 lớp), 5130+ Icon, 126+ trang preview, dashboard crypto/payment, ví Web2-Web3, và kiến trúc tài chính AXIOLEDGER (Hub & 4 Pillars) dưới giấy phép MIT.

**Đối tượng hưởng lợi:** Lập trình viên độc lập, startup fintech, doanh nghiệp xây dựng mạng lưới thanh toán, nhà phát triển blockchain DeFi/RWA.

**Khoản tài trợ yêu cầu:** $48,000 USD (Soft cap: $24,000) · **Thời gian:** 12 tháng

---

## 2. Bối cảnh & Động lực (Background & Motivation)

Hệ sinh thái tài chính kỹ thuật số đang bùng nổ — từ SWIFT truyền thống, stablecoin Fiat, đến mạng lưới token và blockchain Layer-2. Tuy nhiên, không có một bộ công cụ UI/UX mã nguồn mở nào được thiết kế riêng cho **lớp ứng dụng tài chính đa chuỗi** này.

Dự án này được xây dựng từ kinh nghiệm thực tế nghiên cứu hạ tầng Ethereum, Solana, Arbitrum, Optimism và MetaMask — đúc kết các bài học về UX, bảo mật, và kiến trúc phân tầng để tạo ra bộ công cụ **không tồn tại trên thị trường**.

**Proof of Concept hiện có:**
- `preview/` — 126 trang Astro preview hoàn chỉnh (dashboard, crypto, payment, wallet, sign-in…)
- `docs/` — Trang tài liệu chính thức (Token Explorer, Icon Search 5130+, Component Preview)
- `page/` — Landing page marketing đầy đủ
- Thiết kế kiến trúc AXIOLEDGER: Hub ($AXQ) + 4 Pillars (VPX, SQX, KPX, VRQ)

---

## 3. Mô tả dự án (Project Description)

### 3.1 Mục tiêu (Goals)

- [x] **Hoàn thiện Community Design System** — Design Tokens 3 lớp, 5130+ Icon, 201 Component
- [x] **Bộ trang Preview** — 126+ trang UI sẵn dùng (crypto dashboard, payment, wallet, auth)
- [ ] **Tài liệu hóa đầy đủ** — API docs, hướng dẫn tích hợp cho React/Vue/vanilla JS
- [ ] **Bộ package npm công khai** — `@wikialisalabs/core`, `@wikialisalabs/tokens`, `@wikialisalabs/icons`
- [ ] **Tích hợp AXIOLEDGER Smart Contract mẫu** — Rust/Anchor cho KPX RWA Vault
- [ ] **Ví AXIO Vault mã nguồn mở** — Web2/Web3 hybrid wallet (Native AA, Gasless, ZK-DID)

### 3.2 Ngoài phạm vi (Non-Goals)

> Những gì **không** thuộc phạm vi đợt tài trợ này:

- Phát hành token $AXQ / $VPX / $SQX / $KPX / $VRQ lên mainnet
- Vận hành node validator hoặc sequencer
- Kiểm toán bảo mật (audit) smart contract cấp production
- Xây dựng ứng dụng di động native (iOS/Android)

### 3.3 Kiến trúc kỹ thuật (Technical Architecture)

```
┌─────────────────────────────────────────────────────────┐
│              Community Design System (UI Layer)               │
│  docs/ · preview/ (126 pages) · page/ (landing)        │
│  Design Tokens · 5130+ Icons · 201 Components           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│           AXIOLEDGER Ecosystem (Protocol Layer)         │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │VALIPRE-  │  │SEQUENTI- │  │KINETO-   │  │VERA-   │ │
│  │CISION    │  │CHAIN     │  │PROTOCOL  │  │CIPHERS │ │
│  │($VPX)    │  │($SQX)    │  │($KPX)    │  │($VRQ)  │ │
│  │Consensus │  │L2 Exec   │  │DeFi/RWA  │  │ZK/DID  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│                                                         │
│              AXIOLEDGER HUB ($AXQ)                      │
│         [Core Settlement · DAO · Treasury]              │
└─────────────────────────────────────────────────────────┘
```

**Tech stack:**

| Tầng | Công nghệ | Ghi chú |
|------|-----------|---------|
| UI Framework | Astro 7.x, Vanilla JS/TS | Preview app, SSG |
| Styling | SCSS, CSS Custom Properties | 3-layer token system |
| Icons | SVG outline, 5130+ icons | Copy React/Vue/HTML snippet |
| Smart Contract | Rust + Anchor (SVM-compatible) | KPX RWA Vault |
| Wallet | TypeScript, MetaMask SDK | AXIO Vault (Native AA) |
| CI/CD | Vercel, pnpm workspaces | Monorepo |

### 3.4 Proof of Concept / MVP hiện tại

- **Repo:** (sẽ công khai sau khi tổ chức xong monorepo)
- **Preview app:** 126 trang giao diện hoàn chỉnh — dashboard-crypto, pay, sign-in, invoice, tracking, wallet…
- **Docs app:** Token Explorer, Icon Search, Component Preview chạy được không cần server
- **Landing page:** Thiết kế marketing đầy đủ với brand AXQ
- **Kiến trúc AXIOLEDGER:** Whitepaper, ZK-OBFT consensus, RWA Smart Contract mẫu (Rust)

---

## 4. Lộ trình & Cột mốc (Roadmap & Milestones)

### Milestone 1 — Tổ chức & Phát hành OSS · $8,000 · Tuần 1–6

**Deliverables:**
- [ ] Tổ chức monorepo hoàn chỉnh (pnpm workspaces): `packages/`, `apps/`, `docs/`
- [ ] Phát hành `@wikialisalabs/core`, `@wikialisalabs/tokens`, `@wikialisalabs/icons` lên npm (public)
- [ ] Tài liệu Getting Started và API reference cho 3 package
- [ ] README, CONTRIBUTING, CODE_OF_CONDUCT hoàn chỉnh
- [ ] GitHub Discussions + Issue templates

**Acceptance Criteria:**
- `npm install @wikialisalabs/core` hoạt động từ registry public
- Docs app deploy được lên Vercel với URL public
- CI pipeline xanh (lint + build) trên mọi PR

---

### Milestone 2 — Framework Integrations · $10,000 · Tuần 7–14

**Deliverables:**
- [ ] Gói `@wikialisalabs/react` — React component wrappers với TypeScript
- [ ] Gói `@wikialisalabs/vue` — Vue 3 component wrappers
- [ ] Storybook tích hợp: 30+ component có stories
- [ ] Figma token sync (Style Dictionary → Figma Variables)

**Acceptance Criteria:**
- React/Vue example app chạy đầy đủ với 10 component cơ bản
- Storybook deploy lên Chromatic hoặc Netlify
- Zero breaking changes so với M1

---

### Milestone 3 — AXIO Vault Wallet · $14,000 · Tuần 15–26

**Deliverables:**
- [ ] AXIO Vault web app (TypeScript, MetaMask SDK, EIP-4337 Account Abstraction)
- [ ] Gasless transaction via Paymaster (trả phí bằng USDT)
- [ ] ZK-DID integration demo (mock VRQ layer)
- [ ] Cross-chain Bridge UI (KPX layer — Ethereum ↔ AXIOLEDGER testnet)
- [ ] Smart Contract mẫu KPX RWA Vault (Rust/Anchor) + test suite

**Acceptance Criteria:**
- AXIO Vault kết nối MetaMask, tạo Smart Contract Wallet
- Giao dịch gasless demo chạy trên testnet
- RWA Vault smart contract pass 100% unit tests
- Audit-ready code (documented, no unsafe blocks)

---

### Milestone 4 — Tài liệu & Cộng đồng · $8,000 · Tuần 27–48

**Deliverables:**
- [ ] Whitepaper AXIOLEDGER v1.0 chính thức (PDF + web version)
- [ ] Hướng dẫn tích hợp cho 5 use case: fintech, DeFi, payment gateway, NFT marketplace, corporate wallet
- [ ] Video tutorial series (5 videos)
- [ ] Ambassador program + contributor rewards

**Acceptance Criteria:**
- Whitepaper được publish và indexable
- 500+ GitHub stars trên repo chính
- 50+ contributors đã merged PR

---

## 5. Ngân sách (Budget Breakdown)

| Hạng mục | Chi tiết | Số tiền (USD) |
|----------|----------|---------------|
| Nhân lực chính (Lead Dev) | 400h × $60/h · full-stack + blockchain | $24,000 |
| Smart Contract Dev (Rust) | 120h × $80/h · KPX RWA Vault + ZK-DID mock | $9,600 |
| Technical Writer | 80h × $40/h · docs, whitepaper, tutorials | $3,200 |
| Hạ tầng & Deploy | Vercel Pro, npm registry, CI, domain (12 tháng) | $1,200 |
| Design & Assets | Figma tokens sync, additional icons | $2,400 |
| Community & Outreach | Hackathon sponsorship, ambassador rewards | $3,600 |
| Dự phòng (10%) | Rủi ro kỹ thuật, scope điều chỉnh | $4,000 |
| **Tổng cộng** | | **$48,000** |

**Soft cap (tối thiểu để khởi động M1 + M2):** $24,000

**Hard cap (hoàn thành đầy đủ 4 milestone):** $48,000

---

## 6. Mô hình tài trợ & Tầng ủng hộ (Funding Model & Tiers)

| Tầng | Mức tài trợ | Quyền lợi |
|------|-------------|-----------|
| 🌱 **Dev Supporter** | $5–$25/tháng | Tên trong `CONTRIBUTORS.md`, cập nhật devlog sớm 1 tuần |
| 🏢 **Startup Backer** | $100–$500/tháng | Logo trong README, priority bug report, Figma token file |
| 💎 **Enterprise Sponsor** | $1,000+/tháng | Logo nổi bật, biểu quyết roadmap, 2h/tháng tư vấn kiến trúc |
| 🏛️ **Protocol Grant** | $5,000+ (một lần) | Co-authorship trên Whitepaper, naming rights trên 1 module |

**Kênh nhận tài trợ:**
- GitHub Sponsors: https://github.com/sponsors/wikialisalabs *(cập nhật sau khi tổ chức repo)*
- Open Collective: https://opencollective.com/wikialisalabs *(sẽ thiết lập)*
- Polar.sh: https://polar.sh/wikialisalabs *(Bounty cho từng issue)*

---

## 7. Minh bạch tài chính (Financial Transparency)

- Chi tiêu công khai tại: Open Collective Dashboard (sau khi thiết lập)
- Báo cáo tài chính: đầu mỗi tháng, kèm % tiến độ milestone
- Giải ngân: từng phần sau khi nghiệm thu mỗi milestone
- Nếu không đạt soft cap trong **60 ngày** → hoàn tiền toàn bộ

---

## 8. Đội ngũ (Team)

| Thành viên | Vai trò | Kinh nghiệm |
|------------|---------|-------------|
| Kiến trúc sư trưởng | Lead Dev + System Architect | Design system, blockchain infra, Rust/TS |
| (Tuyển thêm) | Smart Contract Dev | Anchor/Solana, ZK-proofs |
| (Tuyển thêm) | Technical Writer | Web3 docs, whitepaper |

**Kinh nghiệm liên quan:**
- Đã xây dựng Community Design System với 126 trang preview, 5130+ icons, design token 3 lớp
- Nghiên cứu chuyên sâu kiến trúc hạ tầng Ethereum, Solana, Arbitrum, Optimism, MetaMask
- Thiết kế kiến trúc ZK-OBFT consensus và RWA Smart Contract (Rust)

---

## 9. Rủi ro & Phương án dự phòng (Risks & Mitigations)

| Rủi ro | Xác suất | Mức độ | Phương án |
|--------|----------|--------|-----------|
| Framework Astro breaking changes | Trung bình | Thấp | Pin version, tách preview layer |
| Không đủ Rust dev cho M3 | Trung bình | Cao | Bounty Polar.sh cho từng module |
| npm package naming conflict | Thấp | Trung bình | Đặt tên `@wikialisalabs/` scope sớm |
| Pháp lý token/smart contract | Thấp | Cao | Scope rõ ràng: chỉ mã nguồn, không phát token |
| Không đạt soft cap | Trung bình | Cao | Hoàn tiền + thu hẹp scope về M1 only |

---

## 10. Điều khoản & Cam kết (Terms & Commitments)

- Toàn bộ mã nguồn phát hành dưới giấy phép **MIT** — tự do dùng cho mục đích thương mại.
- Không phát hành token, không ICO, không kêu gọi đầu tư tài chính.
- Milestone review công khai, mọi thay đổi scope thông báo trước 14 ngày.
- Whitepaper AXIOLEDGER là tài liệu kỹ thuật / học thuật, không phải lời chào mời đầu tư.

---

## 11. Câu hỏi thường gặp (FAQ)

**Q: Tôi có thể dùng Community Design System cho sản phẩm thương mại không?**
A: Có. Giấy phép MIT cho phép sử dụng tự do, bao gồm sản phẩm thương mại, miễn ghi attribution.

**Q: AXIOLEDGER ($AXQ) có phải một token sẽ bán không?**
A: Không. Trong phạm vi dự án này, $AXQ chỉ là ký hiệu kiến trúc trong whitepaper/smart contract mẫu. Không có kế hoạch phát hành token công khai trong đợt tài trợ này.

**Q: Bộ preview 126 trang tương thích với framework nào?**
A: Preview được build bằng Astro (SSG), output HTML/CSS/JS thuần — có thể tích hợp vào React, Vue, hoặc bất kỳ stack nào. Các gói `@wikialisalabs/react` và `@wikialisalabs/vue` sẽ được phát hành ở M2.

**Q: Smart contract RWA Vault có audit chưa?**
A: Chưa. Đây là mã nguồn tham khảo (reference implementation). Audit cấp production nằm ngoài phạm vi tài trợ này.

---

## 12. Tài liệu tham chiếu (References)

- [AXQ Preview App — 126 pages](./preview/) — Nguồn mã nguồn đã có
- [AXQ Docs App — Token Explorer + Icon Search](./docs/) — Nguồn mã nguồn đã có
- [AXIOLEDGER Architecture Whitepaper](./AXIOLEDGER_WHITEPAPER.md) — Sẽ tạo tại M4
- [Ethereum Foundation Grants](https://ethereum.org/en/community/grants/)
- [NLnet Foundation](https://nlnet.nl/apply/)
- [Gitcoin Grants](https://grants.gitcoin.co/)

---

*Liên hệ: root@wikialisalabs.axvn.vn · GitHub: github.com/wikialisalabs · Cập nhật lần cuối: 2026-10-31*
