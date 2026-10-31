# WHITEPAPER — WIKIALISALABS ($AXQ)

> **Mạng lưới Blockchain Thế hệ Mới — Lời Giải Cho "Bộ Ba Bất Khả Thi" và Tương Lai Tài Chính Định Chế**
>
> **Tác giả:** Chief Architect · Wikialisalabs Foundation
> **Phiên bản:** v0.0 · Cập nhật: 2026-10-31
> **Phạm vi:** Toàn hệ sinh thái — Hạ tầng cốt lõi · Protocol Layer · UI/UX System · Tokenomics · Governance
> **Token chính:** $AXQ · Nhánh: $VPX · $SQX · $KPX · $VRQ
> **Liên hệ:** root@wikialisalabs.axvn.vn · github.com/wikialisalabs

---

## Mục Lục

1. [Tóm tắt Điều hành](#1-tóm-tắt-điều-hành)
2. [Bối cảnh & Động lực](#2-bối-cảnh--động-lực)
3. [Kiến trúc Hệ sinh thái — Hub & 4 Pillars](#3-kiến-trúc-hệ-sinh-thái--hub--4-pillars)
4. [Cấu trúc Monorepo](#4-cấu-trúc-monorepo)
5. [Layer Stack — 5 Tầng Kỹ thuật](#5-layer-stack--5-tầng-kỹ-thuật)
6. [Cơ chế Đồng thuận ZK-OBFT](#6-cơ-chế-đồng-thuận-zk-obft)
7. [Luồng Dữ liệu & StatelessTransaction](#7-luồng-dữ-liệu--statelesstransaction)
8. [Tokenomics & Mô hình Kinh tế 5-Token](#8-tokenomics--mô-hình-kinh-tế-5-token)
9. [AXIO Vault — Ví Web2/Web3](#9-axio-vault--ví-web2web3)
10. [Design System — Community UI Foundation](#10-design-system--community-ui-foundation)
11. [Lộ trình Kỹ thuật 5 Giai đoạn](#11-lộ-trình-kỹ-thuật-5-giai-đoạn)
12. [Ma trận KPIs & Deliverables](#12-ma-trận-kpis--deliverables)
13. [Kiến trúc Quản trị — Axio-DAO & Tribunal](#13-kiến-trúc-quản-trị--axio-dao--tribunal)
14. [Bảo mật & Kháng Lượng tử](#14-bảo-mật--kháng-lượng-tử)
15. [Hạ tầng DevOps & Toolchain](#15-hạ-tầng-devops--toolchain)
16. [Smart Contract — KPX RWA Vault (Rust)](#16-smart-contract--kpx-rwa-vault-rust)
17. [Hội đồng 8 Cố vấn — Lộ trình từ 5 Mạng lưới](#17-hội-đồng-8-cố-vấn--lộ-trình-từ-5-mạng-lưới)
18. [Điều khoản & Tuyên bố Pháp lý](#18-điều-khoản--tuyên-bố-pháp-lý)

---

## 1. Tóm tắt Điều hành

**Wikialisalabs ($AXQ)** là hệ sinh thái blockchain được kiến trúc để giải quyết triệt để "Bộ ba bất khả thi" (Trilemma) thông qua cấu trúc phân rã chức năng và tối ưu hóa hạ tầng máy chủ.

**Vấn đề:** Các nhà phát triển và doanh nghiệp muốn xây dựng sản phẩm tài chính số thiếu một bộ công cụ thống nhất, miễn phí và sẵn sàng cho thương mại — trong khi các mạng lưới hiện tại (Ethereum, Solana, Arbitrum, Optimism, MetaMask) đều có điểm nghẽn cố hữu về hiệu năng, phi tập trung, và trải nghiệm người dùng.

**Giải pháp:** Bộ công cụ mã nguồn mở **Community Design System** + **AXIOLEDGER Protocol** cung cấp:
- UI Kit đầy đủ (5130+ icon, 201 component, 126 trang preview)
- Kiến trúc blockchain 5 lớp với throughput 600K+ TPS
- Ví Web2/Web3 hybrid (Zero Seed Phrase, Gasless, ZK-DID)
- Smart Contract chuẩn cho RWA (Real World Assets)

**Nguồn cung token:** 10.000.000.000.000 $AXQ (10 nghìn tỷ)

---

## 2. Bối cảnh & Động lực

### Điểm nghẽn của các mạng lưới hiện tại

| Mạng lưới | Điểm nghẽn cốt lõi | Giải pháp Wikialisalabs |
|-----------|---------------------|-------------------------|
| **Solana** | Phí validator 1.1 SOL/ngày đẩy node nhỏ ra rìa; phụ thuộc 1 client | RAMDISK I/O + VPX Subsidy + Multi-client Rust/C++ |
| **Ethereum** | State Bloat; phí gas; L1 quá tải | Stateless SVM + ZK-Rollup Settlement |
| **Arbitrum** | Sequencer tập trung; 7 ngày Finality | AF_XDP Zero-Copy + ZK-Rollup (< 3 phút) |
| **Optimism** | Fraud Proof 7 ngày; Sequencer độc quyền | SVM Rollup + Volition DA lai ghép |
| **MetaMask** | Seed Phrase rủi ro; Typosquatting npm | Native AA + ZK-DID + Supply Chain Scanner |

### Cảm hứng từ Nghiên cứu Hạ tầng Toàn cầu

Dựa trên rà quét sâu (deep scan) hạ tầng Web3:
- Ethereum: 903.358 validators, 42.5M ETH staked, 5.000+ dev/tháng
- Solana: 17.708 dev hoạt động, 102K repos, 464K+ domain .sol
- Arbitrum: 10.000 repos, 3.000 smart contracts mainnet
- Optimism: 1.200+ dev/tháng, 5.000 repos liên quan
- MetaMask: 250+ repos, @metamask scope hàng chục gói npm

---

## 3. Kiến trúc Hệ sinh thái — Hub & 4 Pillars

```
                    ┌──────────────────────────────────────────────┐
                    │           WIKIALISALABS ($AXQ)               │
                    │       [Tổ chức Quản trị Lõi / Hub]           │
                    │  • Định vị: Sổ cái bất biến, DAO & Tài chính │
                    │  • Quản lý quy chuẩn, bảo chứng và ngân quỹ  │
                    └──────────────────┬───────────────────────────┘
                                       │
         ┌─────────────────┬───────────┴───────────┬─────────────────┐
         ▼                 ▼                       ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  VALIPRECISION  │ │  SEQUENTICHAIN  │ │ KINETOPROTOCOL  │ │  VERACIPHERS    │
│     ($VPX)      │ │     ($SQX)      │ │     ($KPX)      │ │     ($VRQ)      │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ Consensus &     │ │ High-Speed L2   │ │ DeFi Engine &   │ │ ZK-Security &   │
│ Validation      │ │ Execution       │ │ Liquidity       │ │ Cryptography    │
│                 │ │                 │ │                 │ │                 │
│ • Multi-client  │ │ • SVM Rollup    │ │ • AMM Pool      │ │ • ZK-Proof      │
│   Rust + C++    │ │ • AF_XDP NIC    │ │ • Cross-chain   │ │ • DID/KYC       │
│ • RAMDISK I/O   │ │   Bypass        │ │   Bridge        │ │ • Supply Chain  │
│ • NVMe split    │ │ • 600K+ TPS     │ │ • RWA Treasury  │ │   Scanner       │
│ • VPX Subsidy   │ │ • ZK-Rollup     │ │ • POS Engine    │ │ • Confidential  │
│ • Slashing      │ │   Settlement    │ │ • LP Market     │ │   Transfer      │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Vai trò từng Pillar

| Pillar | Token | Chức năng | Công nghệ nền |
|--------|-------|-----------|---------------|
| **Hub** | `$AXQ` | Layer-1 Settlement, DAO, Treasury | Stateless SVM, ANS (.axq), ZK-EVM Bridge |
| **Valiprecision** | `$VPX` | Validator Network, Reputation Engine, Slashing | RAMDISK, NVMe split, Multi-client |
| **Sequentichain** | `$SQX` | L2 Sequencer, ZK Batch Prover, 600K TPS | AF_XDP Socket, ZK-SNARK Aggregator |
| **Kinetoprotocol** | `$KPX` | AMM, Cross-chain Bridge, RWA Treasury, POS | Concentrated Liquidity, Smart Order Router |
| **Veraciphers** | `$VRQ` | ZK Cryptography, DID, MACI, Supply Chain | Halo2/PlonKy2, ZK-DID, Soulbound |

---

## 4. Cấu trúc Monorepo

```
wikialisalabs-workspace/
│
├── .github/workflows/
│   ├── ci-test.yml
│   ├── publish-npm-scopes.yml
│   └── publish-docker.yml
│
├── apps/
│   ├── wallet-web/          ← AXIO Vault Wallet
│   ├── exchange-web/        ← DEX Interface
│   ├── craft-portal/        ← Compute Grid Marketplace
│   ├── pay-gateway/         ← Payment Gateway Widget
│   ├── docs-site/           ← Technical Docs
│   └── dao-dashboard/       ← DAO Governance Portal
│
├── packages/
│   ├── axioledger/          ← @axioledger/* (CLI, create-app, ANS SDK, ui-kit)
│   ├── valiprecision/       ← @valiprecision/* (worker-pool, core-daemon, reputation-engine)
│   ├── sequentichain/       ← @sequentichain/* (docker-runtime, gpu-executor, network-stack)
│   ├── kinetoprotocol/      ← @kinetoprotocol/* (market-registry, bridge-relayer, intents-engine)
│   └── veraciphers/         ← @veraciphers/* (zk-prover-runtime, did-identity-verifier)
│
├── toolchain/
│   ├── eslint-config/
│   ├── tsconfig/
│   └── build-scripts/
│
├── docs/                    ← Community Design System Docs
├── preview/                 ← 126-page Astro Preview App
├── page/                    ← Marketing Landing Page
├── pnpm-workspace.yaml
├── package.json
├── README.md
├── WHITEPAPER.md            ← File này
├── FUNDING_PROPOSAL.md
└── LICENSE (MIT)
```

---

## 5. Layer Stack — 5 Tầng Kỹ thuật

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 5 — APPLICATION LAYER                                         │
│  AXIO Vault · Exchange DEX · Craft Portal · Pay Gateway · DAO        │
│  Stack: Next.js 14 · React 18 · TypeScript · axioledger 1kB VDOM     │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 4 — PROTOCOL & INTENT LAYER                                   │
│  @axioledger/wallet-connector → @hot-labs/near-connect + kit         │
│  @kinetoprotocol/intents-engine → @hot-labs/omni-sdk (NEAR Intents)  │
│  @kinetoprotocol/bridge-relayer → Cross-chain Message                │
│  ANS SDK (.axq domain resolution < 10ms)                             │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 3 — EXECUTION & SEQUENCER LAYER                               │
│  @sequentichain/async-task-runner  (600K TPS, AF_XDP Zero-Copy)      │
│  @sequentichain/gpu-executor  (GPU-accelerated ZK Prover)            │
│  ZK-SNARK Batch Aggregator → State Root Commitment to L1             │
│  Stateless SVM Engine  (Sealevel Parallel, no full-state storage)    │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 2 — VALIDATION & CRYPTOGRAPHY LAYER                           │
│  @valiprecision/reputation-engine  (Slashing, Uptime, Reputation)    │
│  @valiprecision/core-daemon  (P2P Node Daemon)                       │
│  @veraciphers/zk-prover-runtime  (Halo2/PlonKy2, mobile < 100ms)    │
│  @veraciphers/did-identity-verifier  (ZK-DID, Soulbound, MACI)      │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — NETWORK & STORAGE LAYER                                   │
│  @sequentichain/network-stack  (smoltcp Rust, zero-copy AF_XDP)      │
│  @sequentichain/docker-runtime  (Isolated Container Execution)       │
│  @valiprecision/worker-pool  (Golem Distributed Compute Grid)        │
│  L1 State Root Contract · EVM_Vault.sol · Kpx_Bridge.rs             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Cơ chế Đồng thuận ZK-OBFT

### Voting Power Reputation-Based

Trọng số bỏ phiếu của Validator *i* tại epoch *t*:

```
VP_i(t) = S_i(t) × R_i(t)

R_i(t) = α · U_i(t) + β · ln(1 + γ · B_i(t))
```

- `S_i(t)` — $VPX đã stake
- `U_i(t)` — Uptime ratio [0, 1] (giảm theo hàm mũ khi offline)
- `B_i(t)` — Băng thông đóng góp (hàm ln ngăn độc quyền phần cứng)
- `α, β, γ` — Hằng số do Treasury DAO quản trị

### ZK-SNARK Chữ ký Nén

Thay vì O(N²) tin nhắn Gossip:

1. Leader thu thập hàng ngàn chữ ký BLS từ Validators
2. Đưa vào mạch ZK-SNARK (Groth16 / PlonK)
3. Điều kiện: `Σ VP_voters > (2/3) × Σ VP_total`
4. Xuất bằng chứng π (~284 bytes)
5. Gossip chỉ truyền π — xác minh O(1)

### Instant Slashing

```
if Verify(Sig_1, PK_i) AND Verify(Sig_2, PK_i):
    if H_1 != H_2 AND h_1 == h_2:          # Double-signing
        State.VPX_Locked[PK_i]  -= 100%    # Tịch thu ngay
        State.Reputation[PK_i]   = 0       # Loại khỏi Active Set
        Transfer(Reward, Msg.Sender)        # Thưởng người phát hiện
```

### Khả năng chống DDoS (33% Validators bị tấn công)

Khi 33% nodes bị DDoS:
- `U_i` lao dốc → `VP_i = S_i × R_i` bốc hơi theo hàm mũ
- Micro-epoch tự động tái tính tổng VP
- 67% nodes còn lại chiếm tỷ trọng tuyệt đối (> 2/3 VP mới)
- Mạng lưới tự chữa lành, tiếp tục sản xuất khối

---

## 7. Luồng Dữ liệu & StatelessTransaction

### Cấu trúc gói dữ liệu

```
StatelessTransaction {
    TransactionPayload     ← Dữ liệu giao dịch thực tế
    ZkAuthProof            ← P-256 WebAuthn (AXIO Vault Secure Enclave)
    MerkleWitness          ← State proof (bơm bởi $SQX Sequencer)
}
```

### Luồng Cross-Chain Swap / Bridge / Payment

```
User Input
    │
    ▼ (1) axioledger View Layer — SwapIntentAction dispatched
    │
    ▼ (2) @axioledger/wallet-connector
         @hot-labs/near-connect + @hot-labs/kit
         → Multi-chain session (EVM / NEAR / Solana)
    │
    ▼ (3) @kinetoprotocol/intents-engine
         @hot-labs/omni-sdk → NEAR Intents
         → Route discovery → Cross-chain settlement
    │
    ▼ (4) @valiprecision + @sequentichain
         Stateless Verifier → ZK-Batch Aggregator → State Root
    │
    ▼ (5) L1 Settlement
         EVM_Vault.sol / Kpx_Bridge.rs → Finality
    │
    ▼ (6) axioledger re-render — cập nhật UI
```

---

## 8. Tokenomics & Mô hình Kinh tế 5-Token

### Phân bổ 10.000.000.000.000 $AXQ

| Phân bổ | Tỷ lệ | Cơ chế Vesting |
|---------|-------|----------------|
| Cộng đồng & Mạng lưới (VPX Subsidy) | 35% | Hàm suy giảm logarit 50 năm |
| Thanh khoản Thể chế (RWA Treasury) | 25% | Mở khóa nhỏ giọt theo TVL |
| Đội ngũ Phát triển Cốt lõi | 15% | Cliff 4 năm, tuyến tính 6 năm |
| Quỹ Quản trị (Hub DAO) & Pháp lý | 15% | Bỏ phiếu on-chain |
| Phân phối Công chúng (TGE) | 10% | AMM Pool ban đầu |

### Phương trình Lạm phát Động (Value-Pegged Emission)

```
Emission(t) = κ · ln(1 + ΔTVL_RWA) + μ · Transaction_Volume(t) − Burn(t)
```

- Không có RWA mới → `ln(1) = 0` → lạm phát dừng
- `Burn(t)` = phí ZK-Proofs + phí Cross-chain + Slashing penalties

### Vòng lặp Buyback & Burn

```
Doanh thu giao dịch
    → Trích % → Mua $AXQ trên thị trường
    → Đốt $AXQ → Giảm tổng cung
    → Tăng giá trị/đơn vị → Thu hút stakers
    → Tăng bảo mật mạng → Vòng lặp dương tính
```

### Proof-of-Lock Model

```
Stake $AXQ → Nhận quyền khai thác:
    ├── $VPX (chạy Validator Node)
    ├── $SQX (chạy Sequencer Node)
    ├── $KPX (cung cấp thanh khoản AMM)
    └── $VRQ (vận hành ZK Prover Node)
```

---

## 9. AXIO Vault — Ví Web2/Web3

### Stack Kỹ thuật

```
Frontend : Next.js 14 · React 18 · TypeScript
UI       : Community Design System (axioledger VDOM 1kB)
Auth     : WebAuthn Passkey · Face ID · Touch ID
Crypto   : @hot-labs/near-connect · @hot-labs/kit
Network  : @sequentichain/network-stack (smoltcp)
Platform : iOS-first (390×844) · Web PWA
```

### Luồng trải nghiệm

```
[BẮT ĐẦU DAPP]
      ▼
[KẾT NỐI AXIO VAULT]
      ├─► (New User) → Google/FaceID → Smart Contract Wallet (tự động)
      └─► (Pro User) → Seed Phrase / Hardware Wallet (Ledger)
      ▼
[BỘ QUÉT VRQ — SUPPLY CHAIN SCANNER]
      ├─► Mã độc/Typosquatting → [BLOCK & CẢNH BÁO ĐỎ]
      └─► Hợp đồng an toàn → Tiếp tục
      ▼
[YÊU CẦU GIAO DỊCH]
      ├─► CÁ NHÂN: Phí 0.01 USDC (Gasless) → FaceID confirm
      └─► TỔ CHỨC: ZK-DID → Multi-sig 2/3 → Confidential Transfer
      ▼
[SEQUENTICHAIN $SQX — AF_XDP Bypass — 600K TPS]
      ▼
[HUB $AXQ — ZK-Rollup Settlement]
      ▼
[THÀNH CÔNG → Cập nhật số dư real-time]
```

### 5 Tính năng đột phá (Native Account Abstraction)

1. **Gasless** — Trả phí bằng USDT/USDC qua Paymaster
2. **Social Recovery** — Khôi phục qua FaceID / 3 người bảo lãnh
3. **Transaction Batching** — Approve + Swap = 1 lần ký
4. **Session Keys** — Gaming/DeFi không cần pop-up ví
5. **ZK-DID** — KYC một lần, xác thực vô hạn không lộ thông tin

---

## 10. Design System — Community UI Foundation

### 3-Layer Token Architecture

```
Primitive (Giá trị gốc)
    → Semantic (Ý nghĩa UI — Light/Dark Mode)
        → Component (Token linh kiện cụ thể)
```

### Brand Colors

| Token | Hex | Vai trò |
|-------|-----|---------|
| `brand/teal` | `#49DBC8` | Accent chủ đạo |
| `brand/green` | `#BEFF6C` | Success accent |
| `brand/orange` | `#FC7339` | Warning / CTA phụ |
| `brand/purple` | `#AF96FB` | Governance / DAO |
| `brand/yellow` | `#FFF172` | Reward / Yield |
| `brand/pink` | `#FD9FDD` | Secondary accent |
| `brand/grey` | `#EFEFEF` | Neutral surface |
| `black` | `#000000` | Primary background |
| `white` | `#FFFFFF` | Surface |

### Typography Scale (Work Sans)

| Style | Size | Weight |
|-------|------|--------|
| H1 | 96px | 400–700 |
| H2 | 60px | 400–700 |
| H3 | 48px | 400–700 |
| Body | 16px | 400–500 |
| Body SM | 14px | 400–500 |
| Caption | 12px | 400–500 |
| Overline | 10px | 400 UPPERCASE |

### Preview App — 126 trang

Bao gồm đầy đủ: Dashboard · Crypto · Payment · Wallet · Auth · Invoice · Tracking · Maps · Settings · Profile · Onboarding · Error States · Marketing Pages…

---

## 11. Lộ trình Kỹ thuật 5 Giai đoạn

### Giai đoạn 1 — Chuẩn hóa & Hạ tầng (Tháng 1–3)

- [ ] Tổ chức monorepo `wikialisalabs-workspace/`
- [ ] `@axioledger/ans-sdk` v1.0 — domain resolve < 10ms
- [ ] Đặc tả `StatelessTransaction`
- [ ] ZK-EVM Bridge spec (`EVM_Vault.sol` + `Kpx_Bridge.rs`)
- [ ] Mô hình kinh tế 5-Token + Monte Carlo simulation
- **KPI:** ANS < 10ms · hot-labs deps pinned · Fork `axioledger_program` ✓

### Giai đoạn 2 — Module Lõi (Tháng 4–6)

- [ ] Axio-Stateless SVM Core (Sealevel Parallel)
- [ ] AXIO Vault Phase 1&2 (24 screens, Passkey zero seed-phrase)
- [ ] Sequentichain Alpha (AF_XDP + ZK-SNARK Aggregator)
- [ ] Kinetoprotocol AMM (Concentrated Liquidity + SOR)
- **KPI:** TPS Testnet > 500.000 · ZK-Auth mobile < 1s · Zero seed-phrase ✓

### Giai đoạn 3 — Mạng lưới & Testnet (Tháng 7–9)

- [ ] Valiprecision Validator Network (4C/8GB node)
- [ ] ZK-Metrics Coprocessor Oracle (giải ngân tự động 100%)
- [ ] Axio-DAO & Tribunal (Lưỡng viện + ZK Jury VRF)
- [ ] Public Testnet + Bug Bounty Program
- **KPI:** VPX Node 4C/8GB ✓ · Oracle auto-release 100% · Audit pass ✓

### Giai đoạn 4 — Mainnet Launch (Tháng 10–12)

- [ ] Genesis Block Wikialisalabs L1
- [ ] TGE: kích hoạt khóa $AXQ → nhận $VPX/$SQX/$KPX/$VRQ
- [ ] ZK-EVM Bridge Mainnet (Ethereum ↔ Wikialisalabs L1/L2)
- [ ] RWA Vault Mainnet (Trái phiếu, chứng khoán)
- [ ] Ecosystem Grants (DEX, Lending, NFT, GameFi)
- **KPI:** TVL > $100M · Zero Critical Bugs · 5+ dApps live ✓

### Giai đoạn 5 — Đồng hóa Vĩ mô (Năm 4–5)

- [ ] Sovereign Debt Tokenization (Trái phiếu chính phủ on-chain)
- [ ] AXIO-OS (ví Web3 tích hợp hệ điều hành điện thoại)
- [ ] Decentralized AI governance (Supply Chain Scanner AI)
- **KPI:** 100% dòng tiền thương mại toàn cầu · Chi phí < $0.0001/tx ✓

---

## 12. Ma trận KPIs & Deliverables

| Giai đoạn | Thời gian | Core Deliverables | KPIs Nghiệm thu |
|-----------|-----------|-------------------|-----------------|
| **1** | Tháng 1–3 | ANS SDK · StatelessTx Spec · ZK-Bridge Spec | Domain < **10ms** · hot-labs pinned |
| **2** | Tháng 4–6 | Stateless SVM · AXIO Vault Phase 1&2 · SQX Alpha | TPS > **500K** · ZK-Auth < **1s** |
| **3** | Tháng 7–9 | Public Testnet · Axio-DAO · ZK-Metrics Oracle | Oracle 100% auto · Bug Bounty pass |
| **4** | Tháng 10–12 | Mainnet Genesis · ZK-EVM Bridge · RWA Vault | TVL > **$100M** · Zero critical bugs |
| **5** | Năm 4–5 | AXIO-OS · Sovereign Debt · AI Governance | 100M+ wallets · tx < **$0.0001** |

---

## 13. Kiến trúc Quản trị — Axio-DAO & Tribunal

### Mô hình Lưỡng viện

```
┌─────────────────────────────────────────────────────┐
│                  WIKIALISALABS GOVERNANCE            │
├─────────────────────────┬───────────────────────────┤
│      HẠ VIỆN            │      THƯỢNG VIỆN          │
│  $AXQ Stakers           │  $VPX Operators           │
│  (Community Governance) │  (Infrastructure Senate)  │
│                         │                           │
│  Voting weight decay:   │  Veto power on:           │
│  D(t) = e^(-λ∫(1-A)dτ) │  Protocol upgrades        │
│  Caps: 1% / 3% / 5%    │  Critical security fixes  │
└─────────────────────────┴───────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │    AXIO-TRIBUNAL      │
              │  ZK Jury (VRF random) │
              │  Tranh chấp protocol  │
              │  Hard Fork resolution │
              └───────────────────────┘
```

### Hàm Quản trị Suy biến

```
D(t) = e^(−λ ∫₀ᵗ (1 − A(τ)) dτ)
```

- `D(t)` — Hệ số suy biến quyền biểu quyết (Whale thụ động bị phạt)
- `A(τ)` — Chỉ số hoạt động tại thời điểm τ
- `λ` — Hằng số suy biến (điều chỉnh qua DAO vote)

---

## 14. Bảo mật & Kháng Lượng tử

| Lớp | Cơ chế | Công nghệ |
|-----|--------|-----------|
| **Identity** | Passkey WebAuthn P-256 + ZK-DID Soulbound | Secure Enclave |
| **Transaction** | ZK-Auth Proof mọi giao dịch | Halo2 / PlonKy2 |
| **Network** | Checksum NPM + Supply Chain Security | `.npmrc` NTM |
| **Validator** | Slashing tự động + Reputation Score | VPX Reputation Engine |
| **Bridge** | ZK Storage Proof (không Multi-sig) | ZK-Light Client |
| **Governance** | MACI Anti-Collusion + ZK Jury | VRQ ZK Runtime |
| **Post-Quantum** | Lattice-based cryptography (NIST) | CRYSTALS-Dilithium |
| **Mobile App** | Screenshot blocker · Jailbreak detection | WebAuthn + Biometric |

### Regulator Gateway (ZK Compliance)

Cổng pháp lý tích hợp vào VRQ: khi có lệnh tòa án quốc tế, hội đồng **5/7 chữ ký** của cơ quan kiểm toán độc lập mới có quyền giải mã danh tính *riêng kẻ phạm tội* — 99.9% người dùng còn lại ẩn danh tuyệt đối.

---

## 15. Hạ tầng DevOps & Toolchain

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/axioledger/*'
  - 'packages/valiprecision/*'
  - 'packages/sequentichain/*'
  - 'packages/kinetoprotocol/*'
  - 'packages/veraciphers/*'
  - 'toolchain/*'
```

### Root Scripts

```json
{
  "build":     "pnpm --recursive run build",
  "test":      "pnpm --recursive run test",
  "lint":      "pnpm --recursive run lint",
  "dev":       "pnpm --parallel --filter \"./apps/*\" dev",
  "release":   "pnpm build && changeset publish"
}
```

### CI/CD Pipelines

| Workflow | Trigger | Hành động |
|----------|---------|-----------|
| `ci-test.yml` | Push / PR | Tests, typecheck, lint toàn workspace |
| `publish-npm-scopes.yml` | Tag release | Publish 5 npm scopes |
| `publish-docker.yml` | Tag release | Build Docker images (Sequencer, Validator, ZK Prover) |

### Node Requirements

```
packageManager : pnpm@9.0.0
node           : >=20.0.0
typescript     : ^5.3.0
```

---

## 16. Smart Contract — KPX RWA Vault (Rust)

```rust
use anchor_lang::prelude::*;

declare_id!("KpxRwaVault11111111111111111111111111111111");

#[account]
pub struct RwaInstitutionVault {
    pub institution_pubkey: Pubkey,
    pub total_rwa_value_usd: u64,  // Định giá qua Oracle
    pub locked_axq_amount:   u64,  // $AXQ khóa làm bảo chứng 15%
    pub zk_did_hash:        [u8; 32], // ZK-KYC từ VRQ
    pub is_active:           bool,
}

#[program]
pub mod kpx_rwa_protocol {
    use super::*;

    pub fn deposit_rwa_and_lock_axq(
        ctx: Context<DepositRwa>,
        rwa_value_usd: u64,
        zk_proof: Vec<u8>,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.institution_vault;

        // BƯỚC 1: Xác thực ZK-DID (cross-program → VRQ)
        require!(
            vrq_interface::verify_zk_did(&zk_proof, vault.zk_did_hash),
            KpxError::InvalidComplianceProof
        );

        // BƯỚC 2: Tính $AXQ cần khóa (15% giá trị RWA)
        let axq_price = oracle::get_axq_price(&ctx.accounts.oracle_feed)?;
        let required_axq = (rwa_value_usd * 15 / 100) / axq_price;

        // BƯỚC 3: Chuyển $AXQ vào vault
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(
                &ctx.accounts.institution_wallet.key(),
                &ctx.accounts.vault_axq_reserve.key(),
                required_axq,
            ),
            &[
                ctx.accounts.institution_wallet.to_account_info(),
                ctx.accounts.vault_axq_reserve.to_account_info(),
            ],
        )?;

        // BƯỚC 4: Cập nhật sổ cái
        vault.total_rwa_value_usd = vault.total_rwa_value_usd
            .checked_add(rwa_value_usd).unwrap();
        vault.locked_axq_amount = vault.locked_axq_amount
            .checked_add(required_axq).unwrap();

        // BƯỚC 5: Kích hoạt lạm phát động (→ AXQ Hub)
        axq_hub_interface::trigger_emission_for_rwa_growth(rwa_value_usd)?;

        Ok(())
    }
}

#[error_code]
pub enum KpxError {
    #[msg("ZK-DID không hợp lệ hoặc đã bị thu hồi.")]
    InvalidComplianceProof,
    #[msg("Số dư AXQ không đủ bảo chứng 15%.")]
    InsufficientCollateral,
}
```

---

## 17. Hội đồng 8 Cố vấn — Lộ trình từ 5 Mạng lưới

### 5 Cố vấn Blockchain

| # | Danh hiệu | Đại diện | Bí mật trao cho |
|---|-----------|----------|-----------------|
| 1 | **Solis** | Solana | RAMDISK State DB + NVMe Ledger + Multi-client → $VPX & $SQX |
| 2 | **Aether** | Ethereum | Immutable Settlement tách biệt khỏi Execution → $AXQ Hub |
| 3 | **Arbi** | Arbitrum | AF_XDP NIC Bypass ngay từ đầu + ZK-Rollup → $SQX |
| 4 | **Opti** | Optimism | RWA Treasury + ZK Settlement 3 phút → $KPX |
| 5 | **Meta** | MetaMask | Native AA + ZK-DID + Supply Chain Scanner → $VRQ |

### 3 Quyền lực Ngoại vi

| # | Danh hiệu | Đại diện | Yêu cầu |
|---|-----------|----------|---------|
| 6 | **Lexis** | SEC/MiCA/FATF | Read-only Compliance Key (5/7 multisig) — cấp phép toàn cầu |
| 7 | **Capitalis** | Wall Street / TradFi | Dark Pool ẩn lệnh lớn (MPC) — mở cổng $100T tài sản |
| 8 | **Q-Oracle** | Quantum AI | Lattice-based cryptography + AI Scanner — bất tử trước lượng tử |

---

## 18. Điều khoản & Tuyên bố Pháp lý

- Toàn bộ mã nguồn phát hành dưới giấy phép **MIT** — tự do sử dụng thương mại.
- Whitepaper này là **tài liệu kỹ thuật và học thuật**, không phải lời chào mời đầu tư tài chính.
- Ký hiệu `$AXQ`, `$VPX`, `$SQX`, `$KPX`, `$VRQ` trong tài liệu này là **nhãn kiến trúc**, không phải chứng khoán hay công cụ tài chính được phát hành công khai.
- Không có ICO, không có token sale công khai trong phiên bản v0.0 này.
- Mọi con số KPI (TPS, TVL, validators…) là **mục tiêu kỹ thuật** được đặt ra để định hướng phát triển, không phải cam kết tài chính.

---

## Nguyên tắc Thiết kế Cốt lõi

1. **Phi trạng thái ở tầng xác thực** — Validators chỉ cần State Root + Merkle Witness
2. **Zero Seed Phrase** — Passkey WebAuthn thay thế hoàn toàn
3. **ZK làm tầng tin cậy** — Mọi KPI, giải ngân, bridge, identity đều qua ZK Proof
4. **Component không trỏ thẳng Primitive** — Token chain: Primitive → Semantic → Component
5. **axioledger là UI engine tối giản** — 1 kB VDOM, pure functions, no side effects in view

---

*Wikialisalabs Foundation v0.0 · Copyright © 2026 · root@wikialisalabs.axvn.vn · github.com/wikialisalabs*
