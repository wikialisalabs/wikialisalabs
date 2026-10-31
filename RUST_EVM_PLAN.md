# RUST_EVM_PLAN — Wikialisalabs

> **Kế hoạch Nghiên cứu & Xây dựng Repositories Rust/EVM Mã nguồn Mở**
>
> **Tác giả:** Chief Architect · Wikialisalabs Foundation
> **Phiên bản:** v1.0 · Cập nhật: 2026-10-31
> **Phạm vi:** 8 repositories Rust hiệu năng cao — Hạ tầng, Công cụ & Thư viện cho Ethereum/EVM
> **Ngôn ngữ:** Rust (stable + nightly toolchain)
> **Liên hệ:** root@wikialisalabs.axvn.vn · github.com/wikialisalabs

---

## Mục Lục

1. [Tổng quan Chiến lược](#1-tổng-quan-chiến-lược)
2. [Kiến trúc Phân tầng Phụ thuộc](#2-kiến-trúc-phân-tầng-phụ-thuộc)
3. [Repository: alloy](#3-repository-alloy)
4. [Repository: core](#4-repository-core)
5. [Repository: evm](#5-repository-evm)
6. [Repository: evm2](#6-repository-evm2)
7. [Repository: trie](#7-repository-trie)
8. [Repository: op-alloy](#8-repository-op-alloy)
9. [Repository: svm-rs](#9-repository-svm-rs)
10. [Repository: eips & hardforks](#10-repository-eips--hardforks)
11. [Repository: docs & examples](#11-repository-docs--examples)
12. [Lĩnh vực Nghiên cứu Kỹ thuật](#12-lĩnh-vực-nghiên-cứu-kỹ-thuật)
13. [Lộ trình Xây dựng theo Pha](#13-lộ-trình-xây-dựng-theo-pha)
14. [Toolchain & CI/CD](#14-toolchain--cicd)
15. [Third-party Crates Quan trọng](#15-third-party-crates-quan-trọng)
16. [Ma trận KPI Toàn hệ thống](#16-ma-trận-kpi-toàn-hệ-thống)
17. [Tiêu chuẩn Mã nguồn & Đóng góp](#17-tiêu-chuẩn-mã-nguồn--đóng-góp)
18. [Tích hợp với AXIOLEDGER Ecosystem](#18-tích-hợp-với-axioledger-ecosystem)
19. [Giai đoạn 1 Chi tiết: Thiết kế API & Cargo Workspace](#19-giai-đoạn-1-chi-tiết-thiết-kế-api--cargo-workspace-core--trie)

---

## 1. Tổng quan Chiến lược

Wikialisalabs xây dựng **một bộ thư viện Rust mã nguồn mở** tập trung hoàn toàn vào hạ tầng Ethereum và EVM, phục vụ trực tiếp cho:

- **SEQUENTICHAIN ($SQX)** — L2 execution engine cần EVM interpreter tốc độ cao (`evm`, `evm2`)
- **AXIOLEDGER Hub ($AXQ)** — State management cần MPT tốc độ cao (`trie`)
- **AXIO Vault** — Wallet cần ABI encoding, signing, provider (`alloy`, `core`)
- **KINETOPROTOCOL ($KPX)** — RWA/DeFi cần OP Stack interop (`op-alloy`)
- **Cộng đồng developer** — Toàn bộ ecosystem cần tooling (`svm-rs`, `docs`)

### Triết lý thiết kế

```
1. Phi trạng thái ở tầng primitive  — core + trie không giữ global state
2. no_std-first                     — tương thích ZK circuits, embedded, WASM
3. Zero unsafe mặc định             — chỉ unsafe khi bắt buộc, documented rõ
4. Composable, không monolithic     — mỗi crate dùng được độc lập
5. Benchmark-driven development     — mọi thay đổi hiệu năng phải có số liệu
```

### Quan hệ với hệ sinh thái mã nguồn mở hiện có

| Thư viện tham chiếu | Repo tương ứng | Điểm khác biệt của Wikialisalabs |
|---------------------|---------------|----------------------------------|
| `alloy-rs/alloy`    | `alloy`       | Tích hợp AXIO Vault native AA    |
| `bluealloy/revm`    | `evm`, `evm2` | Block-STM parallel + ZK-IR output|
| `alloy-rs/alloy-core` | `core`      | Thêm post-quantum address types  |
| `ethereum/patricia-trie` | `trie`  | Rayon parallel + RAMDISK backend |
| `nicoulaj/alloy-eips` | `eips`      | Prague + Wikialisalabs custom EIPs|
| `ethereum-optimism/op-alloy` | `op-alloy` | OP Stack + SQX L2 types |
| `roynalnaruto/svm-rs` | `svm-rs`   | Tích hợp VRQ Supply Chain Scanner|

---

## 2. Kiến trúc Phân tầng Phụ thuộc

```
┌─────────────────────────────────────────────────────────────────┐
│  TẦNG 4 — Developer Experience                                  │
│  docs · examples                                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ sử dụng
┌──────────────────────────▼──────────────────────────────────────┐
│  TẦNG 0 — Meta-crate (Entry Point cho Developer)                │
│  alloy  (re-export + compose toàn bộ)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ depends on
┌──────────────────────────▼──────────────────────────────────────┐
│  TẦNG 3 — Ecosystem Extensions                                  │
│  op-alloy · svm-rs · eips · hardforks                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ depends on
┌──────────────────────────▼──────────────────────────────────────┐
│  TẦNG 2 — EVM Runtime & Data Structures                         │
│  evm · evm2 · trie                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ depends on
┌──────────────────────────▼──────────────────────────────────────┐
│  TẦNG 1 — Core Primitives (zero external deps)                  │
│  core  (alloy-primitives · alloy-rlp · alloy-sol-types)         │
└─────────────────────────────────────────────────────────────────┘
```

### Quy tắc phụ thuộc bắt buộc

- **Tầng N** chỉ được import từ **Tầng ≤ N−1**
- **Circular dependency = bị chặn tự động** bởi `cargo deny`
- `core` không được phụ thuộc bất kỳ crate nội bộ nào khác
- `alloy` là crate duy nhất được phép re-export tất cả

---

## 3. Repository: alloy

### Mục tiêu

Cổng vào duy nhất cho developer muốn làm việc với Ethereum từ Rust. Developer chỉ cần thêm một dòng:

```toml
[dependencies]
alloy = { version = "0.1", features = ["full"] }
```

### Cấu trúc Workspace

```
alloy/
├── Cargo.toml              # workspace root
├── crates/
│   ├── alloy/              # meta-crate: re-export all
│   ├── alloy-provider/     # Provider trait + transports
│   ├── alloy-contract/     # ABI binding, call/send/deploy
│   ├── alloy-signer/       # LocalSigner, Ledger, AWS KMS
│   ├── alloy-signer-local/ # k256 / ecdsa local key
│   ├── alloy-network/      # Network trait abstraction
│   ├── alloy-transport/    # Tower-based async transport
│   ├── alloy-transport-http/
│   ├── alloy-transport-ws/
│   ├── alloy-transport-ipc/
│   ├── alloy-pubsub/       # eth_subscribe (newHeads, logs…)
│   ├── alloy-rpc-client/   # JSON-RPC 2.0 batch client
│   └── alloy-node-bindings/# Anvil / Geth process bindings
├── examples/
└── tests/                  # integration tests vs Anvil
```

### API Examples

```rust
use alloy::providers::ProviderBuilder;
use alloy::network::Ethereum;

// Kết nối HTTP provider
let provider = ProviderBuilder::new()
    .with_recommended_fillers()
    .on_http("https://eth-mainnet.example.com".parse()?);

// Query block number
let block_number = provider.get_block_number().await?;

// Deploy contract (ABI-generated bởi sol! macro)
sol! {
    #[sol(rpc)]
    contract Counter {
        uint256 public count;
        function increment() external;
    }
}
let counter = Counter::deploy(&provider).await?;
counter.increment().send().await?.watch().await?;
```

### Feature Flags

| Feature | Mô tả | Default |
|---------|-------|---------|
| `full` | Bật tất cả providers, signers, contract | ✗ |
| `providers` | HTTP + WS + IPC providers | ✗ |
| `signers` | Local, Ledger, Trezor, AWS KMS | ✗ |
| `contract` | ABI binding và contract deploy | ✗ |
| `pubsub` | WebSocket subscriptions | ✗ |
| `node-bindings` | Anvil / Geth bindings (test only) | ✗ |

---

## 4. Repository: core

### Mục tiêu

Crate **nền tảng zero-dependency** chứa tất cả kiểu dữ liệu Ethereum cơ bản. Phải build được trong môi trường `no_std + alloc` để tương thích ZK circuits và embedded.

### Cấu trúc Workspace

```
core/
├── Cargo.toml
├── crates/
│   ├── alloy-primitives/   # Address, B256, U256, Bytes, Bloom
│   ├── alloy-rlp/          # RLP encode / decode (no-alloc mode)
│   ├── alloy-sol-types/    # Solidity ABI types, sol! macro
│   ├── alloy-dyn-abi/      # Dynamic ABI runtime (alloc required)
│   └── alloy-json-abi/     # JSON ABI parsing (serde)
└── fuzz/                   # libFuzzer targets
```

### Kiểu dữ liệu cốt lõi

```rust
// alloy-primitives
pub type Address = FixedBytes<20>;   // 20-byte Ethereum address
pub type B256    = FixedBytes<32>;   // 32-byte hash
pub type B512    = FixedBytes<64>;   // 64-byte signature
pub type Bloom   = FixedBytes<256>;  // 256-byte log bloom filter
pub type U256    = ruint::Uint<256, 4>; // 256-bit unsigned integer
pub type I256    = alloy_primitives::I256;

// Checksum address
let addr: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    .parse()?;
println!("{}", addr.to_checksum(None)); // EIP-55 checksum

// Keccak256
use alloy_primitives::keccak256;
let hash: B256 = keccak256(b"hello world");
```

### RLP Encoding (EIP-2718)

```rust
use alloy_rlp::{RlpEncodable, RlpDecodable, encode, decode};

#[derive(RlpEncodable, RlpDecodable)]
struct LegacyTransaction {
    nonce:     u64,
    gas_price: U256,
    gas_limit: u64,
    to:        Address,
    value:     U256,
    data:      Bytes,
}

let tx = LegacyTransaction { /* ... */ };
let encoded: Vec<u8> = encode(&tx);
let decoded: LegacyTransaction = decode(&mut encoded.as_slice())?;
```

### sol! Macro — ABI Binding

```rust
use alloy_sol_types::sol;

sol! {
    // Từ inline Solidity
    interface IERC20 {
        function transfer(address to, uint256 amount) external returns (bool);
        event Transfer(address indexed from, address indexed to, uint256 value);
    }
}

// Encode calldata
let calldata = IERC20::transferCall {
    to:     "0xABCD...".parse()?,
    amount: U256::from(1_000_000u64),
}.abi_encode();

// Decode event log
let log: IERC20::Transfer = IERC20::Transfer::decode_log(&raw_log, true)?;
```

### Ràng buộc kỹ thuật bắt buộc

- `#![no_std]` trong `alloy-primitives` và `alloy-rlp`
- `#![forbid(unsafe_code)]` trong tất cả crates trừ SIMD opt-in
- Không phụ thuộc `std::collections` — dùng `hashbrown` khi cần
- MSRV (Minimum Supported Rust Version): **1.76.0**

---

## 5. Repository: evm

### Mục tiêu

EVM interpreter đầy đủ, modular, hỗ trợ mọi hardfork từ Frontier đến Cancun. Thiết kế cho việc tích hợp dễ dàng: Foundry, op-reth, Sequentichain đều mount được.

### Cấu trúc Workspace

```
evm/
├── crates/
│   ├── revm-core/          # Stack, Memory, PC, opcode dispatch
│   ├── revm-gas/           # Gas schedule per hardfork
│   ├── revm-precompiles/   # SHA3, ECRECOVER, BN128, BLAKE2, KZG
│   ├── revm-database/      # Database trait + in-memory impl
│   ├── revm-inspector/     # Inspector trait (tracer, debugger hooks)
│   ├── revm-context/       # Context: Env, TxEnv, BlockEnv
│   └── revm/               # Meta-crate: re-export all
├── bins/
│   └── revm-test/          # CLI để chạy ethereum/tests JSON
└── benches/
    └── criterion/
```

### Database Trait

```rust
pub trait Database {
    type Error: Debug;

    /// Lấy thông tin account (nonce, balance, code hash)
    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error>;

    /// Lấy code từ code hash
    fn code_by_hash(&mut self, hash: B256) -> Result<Bytecode, Self::Error>;

    /// Lấy storage slot
    fn storage(&mut self, address: Address, index: U256) -> Result<U256, Self::Error>;

    /// Lấy block hash theo số block
    fn block_hash(&mut self, number: U256) -> Result<B256, Self::Error>;
}
```

### Inspector Hook — cho Foundry / Debugger

```rust
pub trait Inspector<DB: Database> {
    /// Gọi trước mỗi opcode
    fn step(&mut self, interp: &mut Interpreter, data: &mut EVMData<'_, DB>) {}

    /// Gọi sau khi CALL/CREATE kết thúc
    fn call_end(&mut self, data: &mut EVMData<'_, DB>, inputs: &CallInputs,
                outcome: &mut CallOutcome) {}

    /// Gọi khi có LOG0..LOG4
    fn log(&mut self, interp: &mut Interpreter, data: &mut EVMData<'_, DB>,
           log: &Log) {}
}
```

### Ví dụ sử dụng

```rust
use revm::{Evm, InMemoryDB, primitives::{TxEnv, U256, address}};

let mut db = InMemoryDB::default();
// Nạp tiền vào account
db.insert_account_info(
    address!("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
    AccountInfo { balance: U256::from(1e18 as u64), ..Default::default() }
);

let result = Evm::builder()
    .with_db(&mut db)
    .modify_tx_env(|tx| {
        tx.caller = address!("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        tx.transact_to = TxKind::Call(address!("0xRecipient..."));
        tx.value = U256::from(1000u64);
    })
    .build()
    .transact_commit()?;
```

### Mục tiêu Hiệu năng

| Benchmark | Mục tiêu | Đo lường |
|-----------|---------|---------|
| PUSH1 opcode | < 5 ns | Criterion |
| SLOAD (cold) | < 50 ns | Criterion |
| ERC-20 transfer | < 50 µs | Criterion |
| Deploy Uniswap V2 | < 2 ms | Criterion |
| ethereum/tests pass rate | ≥ 95% | CI |

---

## 6. Repository: evm2

### Mục tiêu

Thế hệ tiếp theo của EVM interpreter — không phá vỡ API của `evm` nhưng cải tiến radically về throughput thông qua parallel execution và ZK-friendly IR.

### Điểm khác biệt so với `evm`

| Tính năng | `evm` | `evm2` |
|-----------|-------|--------|
| Execution model | Serial, single-threaded | Block-STM parallel |
| ZK compatibility | Không | ZK-IR output cho Halo2/Plonky2 |
| EOF support | Không | Đầy đủ (EIP-3540, EIP-3670, EIP-4200) |
| JIT compilation | Không | Cranelift JIT (optional feature) |
| Trạng thái | Stable | Experimental (semver 0.x) |

### Block-STM Parallel Execution

```
Block N: [Tx0, Tx1, Tx2, Tx3, Tx4, Tx5, Tx6, Tx7]
             │
             ▼ Optimistic parallel execution (Rayon thread pool)
    ┌─────────────────────────────────────┐
    │ Thread 0: Tx0, Tx4                  │
    │ Thread 1: Tx1, Tx5                  │
    │ Thread 2: Tx2, Tx6                  │
    │ Thread 3: Tx3, Tx7                  │
    └─────────────────────────────────────┘
             │
             ▼ Conflict detection (read/write set)
    ┌─────────────────────────────────────┐
    │ Conflict? → Re-execute serially     │
    │ No conflict? → Merge state changes  │
    └─────────────────────────────────────┘
```

### ZK-IR Output

```rust
// evm2 có thể xuất intermediate representation ZK-friendly
let (result, zk_trace) = evm2::execute_with_trace(&tx, &mut db)?;

// ZK trace có thể feed vào Halo2 circuit builder
let circuit = halo2_bridge::build_circuit_from_trace(zk_trace)?;
let proof = circuit.prove()?;
```

### EOF — EVM Object Format

```rust
// Parse và validate EOF container
use evm2_eof::{EofContainer, validate_eof};

let bytecode = hex!("EF000101000402000100010400000000800001600000");
let container = EofContainer::decode(&bytecode)?;
validate_eof(&container)?; // Kiểm tra tất cả invariants

println!("Code sections: {}", container.code_sections.len());
println!("Data section:  {} bytes", container.data_section.len());
```

---

## 7. Repository: trie

### Mục tiêu

Triển khai **Merkle-Patricia Trie (MPT)** hiệu năng cao — dùng để tính `stateRoot`, `storageRoot`, `transactionsRoot`, `receiptsRoot` trong block header Ethereum.

### Cấu trúc Workspace

```
trie/
├── crates/
│   ├── alloy-trie/         # MPT core: node types, encoding
│   ├── alloy-trie-hash/    # Hash builder (incremental state root)
│   ├── alloy-trie-proof/   # Generate & verify Merkle proofs
│   └── alloy-trie-parallel/ # Rayon-accelerated parallel hashing
└── benches/
```

### Node Types

```rust
/// MPT node — đây là kiểu trung tâm
pub enum TrieNode {
    /// Leaf: (nibble_path, value)
    Leaf(Nibbles, Vec<u8>),

    /// Extension: (shared_nibbles, child_ref)
    Extension(Nibbles, TrieNodeRef),

    /// Branch: 16 children + optional value
    Branch([Option<TrieNodeRef>; 16], Option<Vec<u8>>),
}

/// Compact-encoded nibble path (theo Yellow Paper)
pub struct Nibbles(Vec<u8>);
```

### Hash Builder — Tính State Root Incremental

```rust
use alloy_trie::HashBuilder;

// Sorted key-value pairs (bắt buộc sorted theo key)
let mut builder = HashBuilder::default();

builder.add_leaf(
    Nibbles::unpack(keccak256(address.as_slice())),
    &rlp_encode_account(&account_info),
);
// ... thêm nhiều accounts ...

let state_root: B256 = builder.root();
```

### Proof Generation & Verification

```rust
use alloy_trie_proof::{generate_proof, verify_proof};

// Tạo proof cho một account
let proof: Vec<Bytes> = generate_proof(&trie, &keccak256(address))?;

// Xác minh proof (stateless client, ZK light client)
let is_valid = verify_proof(
    state_root,
    &keccak256(address),
    &rlp_encoded_account,
    &proof,
)?;
assert!(is_valid);
```

### Parallel State Root (Rayon)

```rust
use alloy_trie_parallel::ParallelHashBuilder;

// Chia accounts thành N shards, hash song song
let roots: Vec<B256> = accounts
    .par_chunks(SHARD_SIZE)           // rayon parallel iterator
    .map(|shard| {
        let mut builder = HashBuilder::default();
        for (key, value) in shard { builder.add_leaf(key, value); }
        builder.root()
    })
    .collect();

// Merge roots lại thành final state root
let state_root = merge_subtrie_roots(roots);
```

---

## 8. Repository: op-alloy

### Mục tiêu

Mở rộng `alloy` cho **OP Stack ecosystem** (Optimism, Base, Mode, Zora, Wikialisalabs L2). Thêm các types, providers và utilities đặc thù L2 mà `alloy` chuẩn không có.

### Cấu trúc Workspace

```
op-alloy/
├── crates/
│   ├── op-alloy-consensus/     # OpTxEnvelope, deposit tx, system tx
│   ├── op-alloy-network/       # Optimism impl Network trait
│   ├── op-alloy-provider/      # L2 RPC extensions (output roots, proofs)
│   ├── op-alloy-rpc-types/     # L2-specific JSON types
│   ├── op-alloy-rpc-types-engine/ # op_engine API types
│   ├── op-alloy-genesis/       # Genesis + SystemConfig parsing
│   └── op-alloy-protocol/      # Channel, BatchV1/V2, frame types
└── tests/
    └── integration/            # vs OP Sepolia RPC
```

### OP Stack Transaction Types

```rust
use op_alloy_consensus::{OpTxEnvelope, TxDeposit};

// Deposit transaction (L1 → L2)
let deposit = TxDeposit {
    source_hash:           B256::ZERO,
    from:                  address!("0xL1Sender..."),
    to:                    TxKind::Call(address!("0xL2Recipient...")),
    mint:                  Some(U256::from(1e18 as u64)), // ETH mint on L2
    value:                 U256::ZERO,
    gas_limit:             100_000,
    is_system_transaction: false,
    input:                 Bytes::new(),
};

let tx = OpTxEnvelope::Deposit(Signed::new_unchecked(deposit, (), B256::ZERO));
```

### L1BlockInfo — Thông tin L1 trong L2 Block

```rust
use op_alloy_consensus::L1BlockInfo;

// Parse từ calldata của first tx trong L2 block
let l1_block: L1BlockInfo = L1BlockInfo::decode_calldata(&calldata)?;

println!("L1 block number:    {}", l1_block.number);
println!("L1 base fee scalar: {}", l1_block.base_fee_scalar);
println!("L1 blob base fee:   {}", l1_block.blob_base_fee);
```

### SystemConfig — Cấu hình L2 từ L1

```rust
use op_alloy_genesis::SystemConfig;

let config = SystemConfig {
    batcher_address:    address!("0xBatcher..."),
    overhead:           U256::from(188u64),
    scalar:             U256::from(684000u64),
    gas_limit:          30_000_000u64,
    base_fee_scalar:    1368u32,
    blob_base_fee_scalar: 810949u32,
};
```

### Tích hợp với SEQUENTICHAIN ($SQX)

`op-alloy` là bridge trực tiếp giữa `alloy` (Ethereum types) và SEQUENTICHAIN L2 execution engine. SQX sử dụng:
- `op-alloy-consensus` cho transaction serialization
- `op-alloy-protocol` cho batch decoding từ L1 DA
- `op-alloy-genesis` cho chain initialization

---

## 9. Repository: svm-rs

### Mục tiêu

**Solidity Compiler Version Manager** viết bằng Rust — download, cache, switch và verify nhiều phiên bản `solc`. Hoạt động như thư viện (cho Foundry, hardhat-rs) và CLI tool.

### Cấu trúc Workspace

```
svm-rs/
├── crates/
│   ├── svm-rs/             # Core library
│   └── svm-rs-builds/      # Build script helper (build.rs usage)
├── src/
│   └── main.rs             # CLI entrypoint
└── tests/
    └── integration/        # Download + verify test (CI cache)
```

### CLI Usage

```bash
# Liệt kê tất cả phiên bản available
svm list

# Cài đặt phiên bản cụ thể
svm install 0.8.26

# Switch phiên bản active
svm use 0.8.26

# Xác minh checksum SHA-256
svm verify 0.8.26

# Xóa phiên bản đã cài
svm remove 0.8.20

# Chạy solc với phiên bản cụ thể
svm exec 0.8.26 -- --version
```

### Library API

```rust
use svm_rs::{SvmManager, Version};

let svm = SvmManager::new()?; // mặc định ~/.svm/

// Lấy danh sách phiên bản có thể cài
let versions: Vec<Version> = svm.list_available().await?;

// Cài đặt + verify SHA-256
svm.install(&"0.8.26".parse()?).await?;

// Lấy path của solc binary
let solc_path = svm.get_path(&"0.8.26".parse()?)?;

// Dùng trong build.rs
println!("cargo:rustc-env=SOLC_PATH={}", solc_path.display());
```

### Platform Matrix

| OS | Architecture | Download source |
|----|-------------|----------------|
| Linux | x86_64 | `binaries.soliditylang.org/linux-amd64/` |
| Linux | aarch64 | `binaries.soliditylang.org/linux-aarch64/` |
| macOS | x86_64 | `binaries.soliditylang.org/macosx-amd64/` |
| macOS | aarch64 | `binaries.soliditylang.org/macosx-amd64/` (Rosetta) |
| Windows | x86_64 | `binaries.soliditylang.org/windows-amd64/` |

### Tích hợp VRQ Supply Chain Scanner

Mỗi binary được download qua `svm-rs` sẽ được **VRQ Supply Chain Scanner** kiểm tra:
1. Verify SHA-256 so với `list.json` chính thức từ `binaries.soliditylang.org`
2. Scan binary header cho known malicious patterns
3. Audit log lưu on-chain (optional, khi VRQ mainnet live)

---

## 10. Repository: eips & hardforks

### Mục tiêu

Triển khai mã nguồn đầy đủ cho **Ethereum Improvement Proposals (EIPs)** và **hardfork activation logic**. Đây là nguồn sự thật duy nhất cho toàn bộ ecosystem về spec Ethereum.

### Cấu trúc Workspace

```
eips/
├── crates/
│   ├── alloy-eips/         # EIP types, constants, helpers
│   └── alloy-hardforks/    # Hardfork enum, ChainSpec, fork activation
└── data/
    └── chainspecs/         # JSON: mainnet, sepolia, holesky, wikialisalabs-l1
```

### EIPs đã triển khai

#### EIP-1559 — Fee Market

```rust
use alloy_eips::eip1559::{BaseFeeParams, calc_next_block_base_fee};

// Tính base fee cho block tiếp theo
let next_base_fee = calc_next_block_base_fee(
    current_base_fee: U256::from(30_000_000_000u64), // 30 Gwei
    gas_used:         15_000_000u64,                  // 50% full
    gas_limit:        30_000_000u64,
    base_fee_params:  BaseFeeParams::ethereum(),       // elasticity=2, max_change=12.5%
);
// → 30 Gwei (không đổi khi gas_used = gas_limit/2)
```

#### EIP-2718 — Typed Transaction Envelope

```rust
use alloy_eips::eip2718::Encodable2718;

// Mọi transaction type đều implement trait này
pub trait Encodable2718 {
    fn type_flag(&self) -> Option<u8>;
    fn encode_2718_len(&self) -> usize;
    fn encode_2718(&self, out: &mut dyn BufMut);
}
// Type 0: Legacy (0x00 prefix, omitted)
// Type 1: EIP-2930 Access List (0x01)
// Type 2: EIP-1559 Dynamic Fee (0x02)
// Type 3: EIP-4844 Blob (0x03)
```

#### EIP-4844 — Blob Transactions

```rust
use alloy_eips::eip4844::{
    BlobTransactionSidecar, Blob, Bytes48,
    calc_blob_gasprice, BlobGasParams,
};

// Tính blob gas price
let blob_gasprice = calc_blob_gasprice(excess_blob_gas);

// Sidecar chứa blobs + KZG commitments + proofs
let sidecar = BlobTransactionSidecar {
    blobs:       vec![Blob::default()],
    commitments: vec![Bytes48::default()], // KZG commitment
    proofs:      vec![Bytes48::default()], // KZG proof
};
```

### Hardfork Activation

```rust
use alloy_hardforks::{EthereumHardfork, ChainSpec, ForkCondition};

// Xây dựng ChainSpec cho Wikialisalabs L1
let chainspec = ChainSpec::builder()
    .chain(Chain::from_id(999999))
    .genesis(genesis_block)
    .with_fork(EthereumHardfork::Frontier,    ForkCondition::Block(0))
    .with_fork(EthereumHardfork::Homestead,   ForkCondition::Block(0))
    .with_fork(EthereumHardfork::Istanbul,    ForkCondition::Block(0))
    .with_fork(EthereumHardfork::Berlin,      ForkCondition::Block(0))
    .with_fork(EthereumHardfork::London,      ForkCondition::Block(0))
    .with_fork(EthereumHardfork::Paris,       ForkCondition::TTD(U256::ZERO)) // PoS từ genesis
    .with_fork(EthereumHardfork::Shanghai,    ForkCondition::Timestamp(1700000000))
    .with_fork(EthereumHardfork::Cancun,      ForkCondition::Timestamp(1710000000))
    .with_fork(EthereumHardfork::Prague,      ForkCondition::Timestamp(1740000000))
    .build();

// Query: EIP-1559 có active ở block X không?
assert!(chainspec.is_fork_active_at_block(EthereumHardfork::London, 100));
```

---

## 11. Repository: docs & examples

### Mục tiêu

Tài liệu hướng dẫn sử dụng đầy đủ và code examples có thể compile + chạy được. Là mặt tiền của toàn bộ ecosystem với developer bên ngoài.

### Cấu trúc

```
docs/
├── book/                   # mdBook source
│   ├── book.toml
│   └── src/
│       ├── SUMMARY.md
│       ├── getting-started/
│       │   ├── installation.md
│       │   ├── first-transaction.md
│       │   └── connect-to-network.md
│       ├── core/
│       │   ├── primitives.md
│       │   ├── rlp.md
│       │   └── sol-types.md
│       ├── evm/
│       │   ├── overview.md
│       │   ├── database.md
│       │   └── inspector.md
│       ├── trie/
│       │   ├── overview.md
│       │   └── proofs.md
│       ├── alloy/
│       │   ├── providers.md
│       │   ├── contracts.md
│       │   └── signers.md
│       ├── op-alloy/
│       └── contributing.md
└── examples/
    ├── Cargo.toml          # workspace cho examples
    ├── connect-provider/
    ├── send-transaction/
    ├── deploy-contract/
    ├── subscribe-logs/
    ├── run-evm/
    ├── compute-state-root/
    ├── generate-merkle-proof/
    ├── op-stack-deposit/
    └── install-solc/
```

### Ví dụ: Send Transaction (end-to-end)

```rust
// examples/send-transaction/src/main.rs
use alloy::{
    network::EthereumWallet,
    primitives::U256,
    providers::ProviderBuilder,
    signers::local::PrivateKeySigner,
};

#[tokio::main]
async fn main() -> eyre::Result<()> {
    // 1. Tạo signer từ private key
    let signer: PrivateKeySigner = std::env::var("PRIVATE_KEY")?.parse()?;
    let wallet = EthereumWallet::from(signer);

    // 2. Tạo provider với wallet
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http(std::env::var("RPC_URL")?.parse()?);

    // 3. Build và gửi transaction
    let tx = alloy::rpc::types::TransactionRequest::default()
        .to("0xRecipient...".parse()?)
        .value(U256::from(1_000_000_000u64)); // 1 Gwei

    let receipt = provider.send_transaction(tx)
        .await?
        .get_receipt()
        .await?;

    println!("Transaction hash:  {:?}", receipt.transaction_hash);
    println!("Block number:      {:?}", receipt.block_number);
    println!("Gas used:          {}", receipt.gas_used);

    Ok(())
}
```

---

## 12. Lĩnh vực Nghiên cứu Kỹ thuật

### 12.1 Rust Idioms cho Blockchain

| Chủ đề | Chi tiết nghiên cứu |
|--------|---------------------|
| Zero-cost abstractions | Trait objects vs generics, dyn dispatch overhead |
| `no_std + alloc` | Thiết kế API cho ZK circuits và embedded |
| Const generics | `FixedBytes<N>`, `Uint<BITS, LIMBS>` |
| Proc-macros | `sol!()` ABI binding, `#[derive(RlpEncodable)]` |
| SIMD acceleration | keccak256, SHA256 với AVX2/AVX-512 |
| Error handling | `thiserror` + `eyre` + custom error enums |

### 12.2 Merkle-Patricia Trie

| Chủ đề | Chi tiết nghiên cứu |
|--------|---------------------|
| Nibble encoding | Compact encoding theo Yellow Paper §Appendix D |
| Hash builder | Incremental update — chỉ re-hash node bị thay đổi |
| Proof structure | Inclusion proof: list of RLP-encoded nodes |
| Non-inclusion proof | Proove key không tồn tại |
| Parallel hashing | Rayon work-stealing trên subtrie shards |
| Memory layout | Arena allocator cho nodes — giảm heap fragmentation |

### 12.3 EVM Internals

| Chủ đề | Chi tiết nghiên cứu |
|--------|---------------------|
| Opcode dispatch | `match` vs jump table — đo lường pipeline prediction |
| Stack machine | 1024-element limit, underflow/overflow handling |
| Memory expansion | Gas cost O(n²) khi size > 724 bytes |
| Storage warm/cold | EIP-2929 access list, SLOAD 100/2100 gas |
| Transient storage | EIP-1153 `TLOAD`/`TSTORE` — reset sau mỗi tx |
| EOF validation | Type section, code section, no JUMP allowed |

### 12.4 Cryptography

| Chủ đề | Chi tiết nghiên cứu |
|--------|---------------------|
| secp256k1 | ECDSA sign/recover, compressed vs uncompressed pubkey |
| BLS12-381 | Aggregated signatures (EIP-2537), pairing operations |
| KZG commitments | Polynomial commitments cho EIP-4844 blobs |
| Keccak-256 | Permutation implementation, SIMD optimization |
| CRYSTALS-Dilithium | Post-quantum signing cho future address types |
| Halo2/Plonky2 | ZK circuit design cho EVM execution proof |

### 12.5 Performance Engineering

| Kỹ thuật | Ứng dụng trong |
|----------|----------------|
| Block-STM (Aptos STM) | `evm2` parallel execution |
| AF_XDP zero-copy | `alloy-transport` networking layer |
| RAMDISK state DB | `evm` + `trie` backend option |
| `sccache` + `mold` linker | Build time giảm 60-70% |
| `cargo-criterion` CI | Detect performance regressions |
| Flamegraph profiling | `perf record` + `cargo-flamegraph` |

---

## 13. Lộ trình Xây dựng theo Pha

### Pha 1 — Nền móng (Tháng 1–3)

**Mục tiêu:** Xây dựng `core` và `eips` — viên gạch đầu tiên, không được sai.

**Tuần 1–4: `core` v0.1**
- [ ] Setup cargo workspace, CI (GitHub Actions), `cargo-deny`
- [ ] `alloy-primitives`: Address, B256, U256, Bloom, Bytes, FixedBytes
- [ ] `alloy-rlp`: encode/decode, `no_std` mode, `#[derive(RlpEncodable)]`
- [ ] `alloy-sol-types`: sol! macro MVP (struct, function, event)
- [ ] 100% unit test coverage, rustdoc cho mọi public API
- [ ] Fuzz targets: RLP decode, ABI decode

**Tuần 5–8: `eips` v0.1**
- [ ] EIP-1559: BaseFeeParams, `calc_next_block_base_fee`
- [ ] EIP-2718: `Encodable2718` / `Decodable2718` traits
- [ ] EIP-2930: Access list types
- [ ] EIP-4844: Blob types, `calc_blob_gasprice`, KZG sidecar

**Tuần 9–12: `trie` v0.1**
- [ ] TrieNode enum: Leaf, Branch, Extension
- [ ] Nibble encoding (compact)
- [ ] HashBuilder: incremental state root
- [ ] Verify state root khớp với geth trên 1M accounts

**KPI Pha 1:**
- `core` build trong `no_std` ✓
- Zero `unsafe` blocks trong `core` ✓
- `trie` state root = geth trên ethereum/tests ✓
- Docs coverage 100% ✓

---

### Pha 2 — Runtime (Tháng 3–6)

**Mục tiêu:** `evm` full opcode + `svm-rs` tooling.

**Tháng 3–5: `evm` v0.1**
- [ ] Tất cả opcodes Cancun (188 opcodes)
- [ ] Gas schedule: Frontier → Cancun
- [ ] Precompiles: ECRECOVER, SHA256, RIPEMD160, Identity, BN128, BLAKE2, KZG
- [ ] Database trait + `InMemoryDB`
- [ ] Inspector trait (hooks cho tracer)
- [ ] Pass ethereum/tests ≥ 95%
- [ ] Criterion benchmarks: push1, sload, ERC-20 transfer

**Tháng 5–6: `svm-rs` v1.0**
- [ ] Download binaries từ `binaries.soliditylang.org`
- [ ] SHA-256 verify theo `list.json`
- [ ] Platform detection: Linux/macOS/Windows × x86_64/aarch64
- [ ] CLI: install/use/list/remove/exec
- [ ] Library API: `SvmManager`
- [ ] `svm-rs-builds` cho `build.rs` integration
- [ ] CI integration test (download + verify + compile test contract)

**KPI Pha 2:**
- `evm` pass ≥ 95% ethereum/tests ✓
- PUSH1 < 5ns, SLOAD cold < 50ns ✓
- `svm-rs install` < 3s trên CI (cached) ✓

---

### Pha 3 — Meta-crate & Hardforks (Tháng 6–9)

**Mục tiêu:** `alloy` + `hardforks` — lúc này developer bên ngoài mới dùng được.

**Tháng 6–8: `alloy` v0.1**
- [ ] `alloy-network`: Network + TxBuilder traits
- [ ] `alloy-transport`: Tower middleware, HTTP transport
- [ ] `alloy-transport-ws`: WebSocket + reconnect logic
- [ ] `alloy-rpc-client`: JSON-RPC 2.0, batch requests
- [ ] `alloy-provider`: `Provider` trait, `ProviderBuilder`
- [ ] `alloy-signer-local`: PrivateKeySigner (k256)
- [ ] `alloy-contract`: sol!() → deploy/call/send
- [ ] `alloy-pubsub`: eth_subscribe streams
- [ ] Integration tests vs Anvil (local) + Sepolia (CI skip)

**Tháng 7–8: `hardforks` v0.1**
- [ ] `EthereumHardfork` enum: Frontier → Prague
- [ ] `ChainSpec` builder
- [ ] `ForkCondition`: Block / Timestamp / TTD
- [ ] Mainnet, Sepolia, Holesky configs
- [ ] Wikialisalabs L1 custom config (PoS từ genesis, Cancun từ block 0)

**KPI Pha 3:**
- `alloy` provider: 10K req/s over HTTP ✓
- WS subscription stable sau 24h ✓
- `ChainSpec` compatible với Geth genesis JSON ✓

---

### Pha 4 — Extensions & Ecosystem (Tháng 8–12)

**Mục tiêu:** `op-alloy`, `evm2` và `docs` — hoàn thiện ecosystem.

**Tháng 8–10: `op-alloy` v0.1**
- [ ] `op-alloy-consensus`: OpTxEnvelope, TxDeposit, L1BlockInfo
- [ ] `op-alloy-network`: Optimism Network impl
- [ ] `op-alloy-genesis`: SystemConfig, genesis parsing
- [ ] `op-alloy-protocol`: ChannelOut, BatchV1, frame encoding
- [ ] Integration test vs OP Sepolia RPC
- [ ] Tích hợp với SEQUENTICHAIN ($SQX) codebase

**Tháng 9–10: `evm2` v0.1 (experimental)**
- [ ] Block-STM executor: Rayon-based parallel execution
- [ ] Conflict detection: read/write set tracking
- [ ] EOF parser + validator (EIP-3540, 3670, 4200, 4750, 5450)
- [ ] ZK-IR output struct (feed vào Halo2)
- [ ] Benchmark: evm2 vs evm trên 1000-tx block

**Tháng 10–12: `docs` + `examples`**
- [ ] mdBook setup + deploy GitHub Pages
- [ ] 20+ runnable examples (compile trong CI)
- [ ] Getting started guide (từ zero đến gửi transaction đầu tiên)
- [ ] API reference hoàn chỉnh (rustdoc)
- [ ] CONTRIBUTING.md và PR templates

**KPI Pha 4:**
- `op-alloy`: sync OP Sepolia live ✓
- `evm2`: ≥ 5× speedup vs `evm` trên parallel workload ✓
- Docs: 100% public API documented ✓
- 20+ examples compile trên CI ✓

---

## 14. Toolchain & CI/CD

### Cargo Workspace Root

```toml
# Cargo.toml (workspace root)
[workspace]
resolver = "2"
members = [
    "crates/alloy",
    "crates/core",
    "crates/evm",
    "crates/evm2",
    "crates/trie",
    "crates/op-alloy",
    "crates/svm-rs",
    "crates/eips",
    "docs/examples/*",
]

[workspace.dependencies]
# Pin versions cho consistency
ruint       = { version = "1.12", default-features = false }
k256        = { version = "0.13", default-features = false }
tokio       = { version = "1",    features = ["full"] }
serde       = { version = "1",    features = ["derive"] }
serde_json  = { version = "1" }
rayon       = { version = "1.10" }
hashbrown   = { version = "0.14" }
thiserror   = { version = "1" }
eyre        = { version = "0.6" }
criterion   = { version = "0.5", features = ["html_reports"] }

[workspace.lints.rust]
missing_docs       = "warn"
unreachable_pub    = "warn"

[workspace.lints.clippy]
all     = "warn"
nursery = "warn"
```

### GitHub Actions CI Matrix

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        toolchain: [stable, nightly]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@master
        with: { toolchain: "${{ matrix.toolchain }}", components: "clippy, rustfmt" }
      - uses: Swatinem/rust-cache@v2
        with: { shared-key: "ci-${{ matrix.os }}" }
      - name: Clippy
        run: cargo clippy --all-targets --all-features -- -D warnings
      - name: Test (nextest)
        run: cargo nextest run --all-features
      - name: Docs
        run: cargo doc --no-deps --all-features

  no-std:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with: { targets: "thumbv7em-none-eabihf" }
      - name: Check no_std
        run: cargo check -p alloy-primitives -p alloy-rlp
             --target thumbv7em-none-eabihf --no-default-features

  fuzz:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@nightly
      - run: cargo install cargo-fuzz
      - run: cargo fuzz run fuzz_rlp_decode -- -max_total_time=60

  bench:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo bench --all-features 2>&1 | tee bench_output.txt
      - uses: benchmark-action/github-action-benchmark@v1
        with: { tool: "cargo", output-file-path: bench_output.txt }
```

### cargo-deny Configuration

```toml
# deny.toml
[licenses]
allow = ["MIT", "Apache-2.0", "Apache-2.0 WITH LLVM-exception", "ISC", "BSD-2-Clause", "BSD-3-Clause"]
deny  = ["GPL-2.0", "GPL-3.0", "AGPL-3.0"]

[advisories]
db-urls = ["https://github.com/rustsec/advisory-db"]
vulnerability = "deny"
unmaintained  = "warn"

[bans]
multiple-versions = "warn"
deny = [
    { name = "openssl" },     # dùng rustls thay thế
]
```

---

## 15. Third-party Crates Quan trọng

| Crate | Version | Dùng trong | Lý do |
|-------|---------|------------|-------|
| `ruint` | 1.12 | `core` | U256/U512 const generics, no_std, zero-copy |
| `k256` | 0.13 | `core`, `alloy-signer` | ECDSA secp256k1, WebAuthn compatible |
| `sha2` | 0.10 | `core`, `svm-rs` | SHA-256 cho checksum verify |
| `sha3` | 0.10 | `core` | Keccak-256 (không phải SHA3 chuẩn) |
| `c-kzg` | 1.0 | `eips` | KZG polynomial commitments (EIP-4844) |
| `blst` | 0.3 | `eips` | BLS12-381 nhanh nhất hiện tại |
| `tokio` | 1 | `alloy` | Async runtime cho provider |
| `tower` | 0.4 | `alloy-transport` | Middleware: retry, timeout, rate-limit |
| `reqwest` | 0.12 | `alloy-transport-http`, `svm-rs` | HTTP client |
| `tokio-tungstenite` | 0.21 | `alloy-transport-ws` | WebSocket transport |
| `serde` | 1 | `alloy` (RPC layer) | JSON serialization, feature-gated |
| `serde_json` | 1 | `alloy` (RPC layer) | JSON value parsing |
| `rayon` | 1.10 | `trie`, `evm2` | Data-parallel computation |
| `hashbrown` | 0.14 | `evm`, `trie` | Robin Hood HashMap, no_std |
| `thiserror` | 1 | Tất cả | Ergonomic error enum |
| `eyre` | 0.6 | `examples` | Error reporting cho examples/CLI |
| `criterion` | 0.5 | `benches/` | Statistical benchmarking |
| `proptest` | 1 | `fuzz/` | Property-based testing |
| `anvil` | (Foundry) | `tests/integration/` | Local Ethereum node cho integration tests |

---

## 16. Ma trận KPI Toàn hệ thống

### KPI Hiệu năng

| Metric | Target | Đo lường bằng | Repository |
|--------|--------|--------------|------------|
| keccak256 throughput | > 500 MB/s | Criterion | `core` |
| RLP encode 1KB struct | < 200 ns | Criterion | `core` |
| PUSH1 opcode | < 5 ns | Criterion | `evm` |
| SLOAD cold | < 50 ns | Criterion | `evm` |
| ERC-20 transfer | < 50 µs | Criterion | `evm` |
| State root (1M accounts) | < 5 s serial / < 1 s parallel | Criterion | `trie` |
| Merkle proof verify | < 10 µs | Criterion | `trie` |
| HTTP RPC req/s | > 10.000 | wrk | `alloy` |
| Block-STM speedup | ≥ 5× | Criterion | `evm2` |
| solc install time | < 5 s | CI timing | `svm-rs` |

### KPI Chất lượng

| Metric | Target | Công cụ |
|--------|--------|---------|
| Test coverage | ≥ 90% | `cargo-llvm-cov` |
| ethereum/tests pass | ≥ 95% | `revm-test` binary |
| Clippy warnings | 0 | CI fail on warn |
| Unsafe blocks in `core` | 0 | `#![forbid(unsafe_code)]` |
| `no_std` compat (`core`, `trie`) | ✓ | CI thumbv7em target |
| Docs coverage (public API) | 100% | `cargo doc` CI |
| Supply chain audit (cargo-deny) | 0 vulnerabilities | CI |
| MSRV | Rust 1.76 | CI matrix |

---

## 17. Tiêu chuẩn Mã nguồn & Đóng góp

### Commit Convention

```
feat(core):     thêm B2048 type cho verkle trie
fix(evm):       sửa gas tính sai cho SELFDESTRUCT sau EIP-6780
perf(trie):     parallel hashing tăng 3× trên 16-core
docs(alloy):    thêm ví dụ deploy ERC-20
chore(ci):      nâng cargo-nextest lên 0.9.72
```

### Pull Request Checklist

- [ ] Mọi public API đều có `///` doc comment
- [ ] Có test case bao phủ happy path + error path
- [ ] Có benchmark nếu thay đổi code path hiệu năng
- [ ] `cargo clippy -- -D warnings` pass
- [ ] `cargo test --all-features` pass
- [ ] `cargo doc --no-deps` không có broken links
- [ ] CHANGELOG.md được cập nhật

### Cấu trúc Module bắt buộc

```rust
// Mỗi module public phải có structure:

//! # Module Name
//!
//! Mô tả ngắn gọn mục đích.
//!
//! ## Examples
//!
//! ```rust
//! // ví dụ runnable
//! ```

mod error;      // Error types (thiserror)
mod types;      // Core types
mod traits;     // Traits / abstractions
mod impls;      // Implementations

pub use error::*;
pub use types::*;
pub use traits::*;
```

---

## 18. Tích hợp với AXIOLEDGER Ecosystem

### Sơ đồ sử dụng

```
AXIOLEDGER ($AXQ) Hub
    └─► alloy-provider  (giao tiếp với L1 RPC)
    └─► alloy-signer    (ký giao dịch settlement)
    └─► trie            (tính state root settlement)

SEQUENTICHAIN ($SQX) L2 Sequencer
    └─► evm / evm2      (execute L2 transactions)
    └─► op-alloy        (OP Stack compatibility)
    └─► eips            (hardfork rules)
    └─► trie            (L2 state root)

KINETOPROTOCOL ($KPX) DeFi / RWA
    └─► alloy-contract  (interact với AMM smart contracts)
    └─► op-alloy        (L2 bridge messages)
    └─► alloy-signer    (ký RWA vault transactions)

VERACIPHERS ($VRQ) ZK / DID
    └─► evm2-ir         (ZK-IR từ EVM execution)
    └─► core (no_std)   (primitives trong ZK circuits)
    └─► svm-rs          (verify solc binary hashes)

AXIO Vault (Wallet)
    └─► alloy           (full stack: provider + signer + contract)
    └─► alloy-signer    (Passkey / WebAuthn signer)
    └─► eips            (EIP-4337 Account Abstraction)
```

### Wikialisalabs Custom EIPs (planned)

| EIP | Tên | Mô tả |
|-----|-----|-------|
| WIP-1 | `ZKPROVE` opcode | Native ZK proof verification in EVM |
| WIP-2 | Stateless Account | Account type không lưu state on-chain |
| WIP-3 | Reputation Precompile | Tính VP_i = S_i × R_i on-chain |
| WIP-4 | Lattice Address | Post-quantum address format (CRYSTALS) |

---

## Phụ lục A: Bảng tra cứu nhanh

| Muốn làm gì? | Dùng crate nào? |
|--------------|----------------|
| Parse địa chỉ Ethereum | `alloy-primitives` |
| Encode/decode RLP | `alloy-rlp` |
| Tạo ABI calldata từ Rust | `alloy-sol-types` (sol! macro) |
| Kết nối JSON-RPC | `alloy-provider` |
| Ký giao dịch | `alloy-signer-local` |
| Deploy smart contract | `alloy-contract` |
| Subscribe events | `alloy-pubsub` |
| Chạy EVM locally | `revm` (qua `evm`) |
| Tính state root | `alloy-trie` + `alloy-trie-hash` |
| Tạo Merkle proof | `alloy-trie-proof` |
| EIP-1559 base fee calc | `alloy-eips::eip1559` |
| EIP-4844 blob gas | `alloy-eips::eip4844` |
| Hardfork activation | `alloy-hardforks` |
| OP Stack tx types | `op-alloy-consensus` |
| Download solc | `svm-rs` |

---

## Phụ lục B: Tài liệu tham khảo

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) — Đặc tả chính thức EVM
- [Ethereum Execution Specs](https://github.com/ethereum/execution-specs) — Python reference implementation
- [ethereum/tests](https://github.com/ethereum/tests) — Bộ test chuẩn EVM
- [alloy-rs/alloy](https://github.com/alloy-rs/alloy) — Reference implementation
- [bluealloy/revm](https://github.com/bluealloy/revm) — Reference EVM implementation
- [paradigmxyz/reth](https://github.com/paradigmxyz/reth) — Rust Ethereum full node
- [ethereum-optimism/op-alloy](https://github.com/ethereum-optimism/op-alloy) — OP Stack Rust types
- [Aptos Block-STM paper](https://arxiv.org/abs/2203.06871) — Parallel execution algorithm
- [EIP-4844 spec](https://eips.ethereum.org/EIPS/eip-4844) — Blob transactions
- [EOF spec](https://notes.ethereum.org/@ipsilon/evm-object-format-overview) — EVM Object Format

---

## 19. Giai đoạn 1 Chi tiết: Thiết kế API & Cargo Workspace (core + trie)

> **Mục tiêu section này:** Thiết kế cấp độ file/module cho `core` và `trie` — đủ chi tiết để bắt đầu code ngay mà không cần quyết định thêm gì.

---

### 19.1 Cấu trúc thư mục đầy đủ

```
wikialisalabs-evm/                     ← workspace root
├── Cargo.toml                         ← workspace manifest
├── Cargo.lock
├── rust-toolchain.toml
├── deny.toml                          ← cargo-deny: license + advisory
├── .cargo/
│   └── config.toml                    ← linker (mold), sccache, target aliases
├── .github/
│   └── workflows/
│       ├── ci.yml                     ← test + clippy + docs (stable + nightly)
│       ├── no-std.yml                 ← kiểm tra no_std trên thumbv7em target
│       ├── fuzz.yml                   ← cargo-fuzz chạy 60s mỗi PR
│       └── bench.yml                 ← benchmark + bencher.dev (chỉ main branch)
│
├── crates/
│   ├── alloy-primitives/              ← core::primitives
│   │   ├── Cargo.toml
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── address.rs             ← Address = FixedBytes<20>
│   │   │   ├── fixed_bytes.rs         ← FixedBytes<N> generic
│   │   │   ├── uint.rs                ← U256, I256 (ruint wrapper)
│   │   │   ├── bytes.rs               ← Bytes (growable)
│   │   │   ├── bloom.rs               ← Bloom = FixedBytes<256>
│   │   │   ├── log.rs                 ← Log { address, topics, data }
│   │   │   ├── aliases.rs             ← B64, B128, B256, B512 type aliases
│   │   │   └── utils/
│   │   │       ├── keccak.rs          ← keccak256(), keccak512()
│   │   │       └── checksum.rs        ← EIP-55 checksum address
│   │   └── fuzz/
│   │       └── fuzz_targets/
│   │           └── fuzz_address.rs
│   │
│   ├── alloy-rlp/                     ← core::rlp
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── encode.rs              ← encode(), encode_list(), BufMut trait
│   │       ├── decode.rs              ← decode(), Buf trait, Header
│   │       ├── types.rs               ← RlpEncodable / RlpDecodable traits
│   │       └── derive/                ← proc-macro crate (feature-gated)
│   │           └── lib.rs             ← #[derive(RlpEncodable, RlpDecodable)]
│   │
│   ├── alloy-sol-types/               ← core::sol_types
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── types/
│   │       │   ├── primitive.rs       ← SolUint, SolInt, SolBool, SolAddress...
│   │       │   ├── array.rs           ← SolArray<T, N>, SolBytes
│   │       │   ├── tuple.rs           ← SolTuple (variadic)
│   │       │   └── function.rs        ← SolCall, SolEvent, SolError traits
│   │       ├── abi/
│   │       │   ├── encode.rs          ← abi_encode(), abi_encode_packed()
│   │       │   └── decode.rs          ← abi_decode(), validation
│   │       └── macros/
│   │           └── sol.rs             ← sol!() proc-macro (feature = "sol-macro")
│   │
│   ├── alloy-trie/                    ← trie
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── nodes/
│   │       │   ├── mod.rs
│   │       │   ├── leaf.rs
│   │       │   ├── branch.rs
│   │       │   └── extension.rs
│   │       ├── nibbles.rs             ← Nibbles, compact encoding
│   │       ├── hash_builder.rs        ← HashBuilder (incremental state root)
│   │       ├── proof.rs               ← generate_proof(), verify_proof()
│   │       ├── mask.rs                ← TrieMask (16-bit branch child bitmap)
│   │       └── parallel.rs            ← ParallelHashBuilder (Rayon, feature-gated)
│   │
│   └── alloy-trie-bench/              ← Criterion benchmarks (bin crate)
│       ├── Cargo.toml
│       └── benches/
│           ├── state_root.rs
│           └── proof_verify.rs
│
├── fuzz/
│   ├── Cargo.toml
│   └── fuzz_targets/
│       ├── fuzz_rlp_roundtrip.rs
│       ├── fuzz_abi_decode.rs
│       └── fuzz_trie_insert.rs
│
└── examples/
    ├── Cargo.toml
    ├── primitives_basic.rs
    ├── rlp_transaction.rs
    ├── sol_macro_erc20.rs
    └── trie_state_root.rs
```

---

### 19.2 `Cargo.toml` — Workspace Root

```toml
# wikialisalabs-evm/Cargo.toml

[workspace]
resolver = "2"
members  = [
    # Giai đoạn 1 — Nền móng
    "crates/alloy-primitives",
    "crates/alloy-rlp",
    "crates/alloy-sol-types",
    "crates/alloy-trie",
    "crates/alloy-trie-bench",
    "fuzz",
    "examples",
    # Giai đoạn 2+ (placeholder — sẽ thêm khi đến pha)
    # "crates/alloy-eips",
    # "crates/alloy-hardforks",
    # "crates/revm-core",
    # "crates/alloy-provider",
    # "crates/op-alloy-consensus",
    # "crates/svm-rs",
]

# Toàn bộ crates trong workspace dùng chung bảng này
[workspace.dependencies]

# --- Core no_std ---
ruint       = { version = "1.12", default-features = false, features = ["num-traits"] }
tiny-keccak = { version = "2.0",  default-features = false, features = ["keccak"] }
hex-literal = { version = "0.4",  default-features = false }
const-hex   = { version = "1.11", default-features = false }

# --- Serialization (chỉ khi feature "serde" bật) ---
serde       = { version = "1",    default-features = false, features = ["derive"] }
serde_json  = { version = "1",    default-features = false, features = ["alloc"] }

# --- Crypto ---
k256        = { version = "0.13", default-features = false, features = ["ecdsa"] }
sha2        = { version = "0.10", default-features = false }

# --- Parallel (Tầng 2+, không dùng trong core) ---
rayon       = { version = "1.10" }

# --- Collections ---
hashbrown   = { version = "0.14", default-features = false }

# --- Error handling ---
thiserror   = { version = "1" }

# --- Testing & Benchmarks ---
criterion   = { version = "0.5", features = ["html_reports"] }
proptest    = { version = "1" }
eyre        = { version = "0.6" }
hex         = { version = "0.4" }

[workspace.lints.rust]
missing_docs        = "warn"       # Public API phải có doc
unreachable_pub     = "warn"       # Tránh export thừa
unused_imports      = "deny"
dead_code           = "warn"

[workspace.lints.clippy]
all                 = "warn"
nursery             = "warn"
pedantic            = "warn"
# Cho phép một số exception hợp lý
module_name_repetitions = "allow"  # e.g. address::Address
missing_errors_doc      = "allow"  # Bỏ qua trong phase 1
```

---

### 19.3 `Cargo.toml` — crate `alloy-primitives`

```toml
# crates/alloy-primitives/Cargo.toml

[package]
name        = "alloy-primitives"
version     = "0.1.0"
edition     = "2021"
rust-version = "1.76"
description  = "Ethereum primitive types: Address, B256, U256, Bloom, Bytes"
license      = "MIT OR Apache-2.0"
repository   = "https://github.com/wikialisalabs/alloy"
keywords     = ["ethereum", "evm", "primitives", "no-std"]
categories   = ["cryptography::cryptocurrencies", "no-std"]

[dependencies]
ruint       = { workspace = true }
tiny-keccak = { workspace = true }
const-hex   = { workspace = true }
hashbrown   = { workspace = true }

# Feature-gated
serde       = { workspace = true, optional = true }
k256        = { workspace = true, optional = true }

[dev-dependencies]
hex         = { workspace = true }
eyre        = { workspace = true }
serde_json  = { workspace = true }
proptest    = { workspace = true }

[features]
default   = []
std       = []                      # Bật std (Error trait, I/O)
serde     = ["dep:serde", "ruint/serde"]
k256      = ["dep:k256"]            # Signing helpers
arbitrary = []                      # proptest Arbitrary impl

# QUAN TRỌNG: no_std là mặc định
# Chỉ bật `std` khi cần dùng std::error::Error
```

---

### 19.4 `Cargo.toml` — crate `alloy-trie`

```toml
# crates/alloy-trie/Cargo.toml

[package]
name        = "alloy-trie"
version     = "0.1.0"
edition     = "2021"
rust-version = "1.76"
description  = "Merkle-Patricia Trie: state root computation and proof generation"
license      = "MIT OR Apache-2.0"
repository   = "https://github.com/wikialisalabs/trie"
keywords     = ["ethereum", "merkle", "trie", "state-root", "proof"]
categories   = ["cryptography::cryptocurrencies", "data-structures"]

[dependencies]
alloy-primitives = { path = "../alloy-primitives", version = "0.1" }
alloy-rlp        = { path = "../alloy-rlp",        version = "0.1" }
hashbrown        = { workspace = true }
smallvec         = { version = "1.13", default-features = false, features = ["union"] }
nybbles          = { version = "0.2",  default-features = false }

# Feature-gated
rayon   = { workspace = true, optional = true }
serde   = { workspace = true, optional = true }

[dev-dependencies]
criterion  = { workspace = true }
eyre       = { workspace = true }
hex        = { workspace = true }
proptest   = { workspace = true }

[features]
default  = []
std      = ["alloy-primitives/std", "alloy-rlp/std"]
serde    = ["dep:serde", "alloy-primitives/serde"]
parallel = ["dep:rayon", "std"]     # Rayon yêu cầu std

[[bench]]
name    = "state_root"
harness = false

[[bench]]
name    = "proof_verify"
harness = false
```

---

### 19.5 `rust-toolchain.toml`

```toml
# wikialisalabs-evm/rust-toolchain.toml
[toolchain]
channel    = "1.76.0"          # MSRV — stable, pinned
components = ["rustfmt", "clippy", "rust-src"]
targets    = [
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
    "thumbv7em-none-eabihf",   # no_std target kiểm tra
    "wasm32-unknown-unknown",  # WASM target kiểm tra
]
```

---

### 19.6 `.cargo/config.toml`

```toml
# wikialisalabs-evm/.cargo/config.toml

[build]
rustc-wrapper = "sccache"      # Cache compiler output — build lần 2 nhanh hơn 70%

[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]  # mold linker — link 10× nhanh hơn ld

[target.aarch64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]

[alias]
# Shorthand commands hay dùng
nt   = "nextest run"
nta  = "nextest run --all-features"
lf   = "clippy --all-targets --all-features -- -D warnings"
doc  = "doc --no-deps --all-features --open"
ck   = "check --all-targets --all-features"
```

---

### 19.7 Thiết kế API chi tiết — `alloy-primitives`

#### `FixedBytes<N>` — kiểu nền tảng

```rust
// crates/alloy-primitives/src/fixed_bytes.rs

/// Mảng byte kích thước cố định N — kiểu nền tảng cho Address, B256, Bloom.
///
/// # Type Parameters
/// - `N`: số byte (const generic)
///
/// # Examples
/// ```
/// use alloy_primitives::FixedBytes;
/// let b: FixedBytes<32> = FixedBytes::ZERO;
/// let b2 = FixedBytes::from([0xAB; 32]);
/// assert_eq!(b2[0], 0xAB);
/// ```
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct FixedBytes<const N: usize>(pub [u8; N]);

impl<const N: usize> FixedBytes<N> {
    /// Giá trị zero (tất cả bytes bằng 0x00).
    pub const ZERO: Self = Self([0u8; N]);

    /// Giá trị max (tất cả bytes bằng 0xFF).
    pub const MAX: Self = Self([0xFF; N]);

    /// Tạo từ slice — trả lỗi nếu độ dài không khớp.
    #[inline]
    pub fn try_from_slice(slice: &[u8]) -> Result<Self, core::array::TryFromSliceError> {
        <[u8; N]>::try_from(slice).map(Self)
    }

    /// Trả về slice tham chiếu đến bytes bên trong.
    #[inline]
    pub const fn as_slice(&self) -> &[u8] { &self.0 }

    /// Kiểm tra tất cả bytes có bằng 0 không.
    #[inline]
    pub fn is_zero(&self) -> bool { self.0.iter().all(|&b| b == 0) }

    /// XOR với FixedBytes khác.
    #[inline]
    pub fn bitxor(&self, rhs: &Self) -> Self {
        let mut out = Self::ZERO;
        for i in 0..N { out.0[i] = self.0[i] ^ rhs.0[i]; }
        out
    }
}

// Type aliases chính
pub type B64  = FixedBytes<8>;
pub type B128 = FixedBytes<16>;
pub type B256 = FixedBytes<32>;
pub type B512 = FixedBytes<64>;
pub type Bloom = FixedBytes<256>;
```

#### `Address` — Địa chỉ 20 byte

```rust
// crates/alloy-primitives/src/address.rs

use crate::FixedBytes;

/// Địa chỉ Ethereum 20 byte với các helper method.
///
/// # Examples
/// ```
/// use alloy_primitives::{address, Address};
///
/// // Từ literal (compile-time)
/// let a = address!("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
///
/// // Parse từ string (runtime)
/// let b: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".parse().unwrap();
/// assert_eq!(a, b);
/// ```
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
#[repr(transparent)]
pub struct Address(pub FixedBytes<20>);

impl Address {
    /// Zero address: 0x0000...0000
    pub const ZERO: Self = Self(FixedBytes::ZERO);

    /// Tạo từ raw bytes.
    #[inline]
    pub const fn new(bytes: [u8; 20]) -> Self { Self(FixedBytes(bytes)) }

    /// Bytes nội tại.
    #[inline]
    pub const fn as_slice(&self) -> &[u8] { self.0.as_slice() }

    /// Tính EIP-55 checksum address.
    ///
    /// # Arguments
    /// - `chain_id`: `Some(1)` cho mainnet checksum (EIP-1191),
    ///               `None` cho EIP-55 chuẩn.
    pub fn to_checksum(&self, chain_id: Option<u64>) -> String {
        use crate::utils::keccak256;
        let hex_addr = const_hex::encode(self.as_slice());
        let hash = match chain_id {
            Some(id) => keccak256(format!("{id}{hex_addr}").as_bytes()),
            None     => keccak256(hex_addr.as_bytes()),
        };
        let mut checksum = String::with_capacity(42);
        checksum.push_str("0x");
        for (i, ch) in hex_addr.chars().enumerate() {
            if ch.is_ascii_digit() {
                checksum.push(ch);
            } else {
                // Bit thứ i*4 của hash quyết định uppercase/lowercase
                let nibble = (hash[i / 2] >> (if i % 2 == 0 { 4 } else { 0 })) & 0xF;
                if nibble >= 8 { checksum.push(ch.to_ascii_uppercase()); }
                else           { checksum.push(ch.to_ascii_lowercase()); }
            }
        }
        checksum
    }
}

/// Macro tạo Address tại compile time.
///
/// ```
/// use alloy_primitives::address;
/// const VITALIK: alloy_primitives::Address =
///     address!("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
/// ```
#[macro_export]
macro_rules! address {
    ($s:literal) => {{
        const BYTES: [u8; 20] = $crate::_parse_hex_20($s);
        $crate::Address::new(BYTES)
    }};
}
```

#### `keccak256` — Hash utility

```rust
// crates/alloy-primitives/src/utils/keccak.rs

use tiny_keccak::{Hasher, Keccak};
use crate::B256;

/// Tính Keccak-256 của một slice dữ liệu.
///
/// # Examples
/// ```
/// use alloy_primitives::keccak256;
/// let hash = keccak256(b"hello");
/// assert_eq!(hash[0], 0x1c); // khớp với geth
/// ```
#[inline]
pub fn keccak256(data: &[u8]) -> B256 {
    let mut hasher = Keccak::v256();
    hasher.update(data);
    let mut output = B256::ZERO;
    hasher.finalize(output.0.as_mut());
    output
}

/// Tính Keccak-256 của hai slices nối tiếp (tối ưu, tránh alloc).
#[inline]
pub fn keccak256_concat(a: &[u8], b: &[u8]) -> B256 {
    let mut hasher = Keccak::v256();
    hasher.update(a);
    hasher.update(b);
    let mut output = B256::ZERO;
    hasher.finalize(output.0.as_mut());
    output
}
```

---

### 19.8 Thiết kế API chi tiết — `alloy-trie`

#### `Nibbles` — Đường dẫn trong trie

```rust
// crates/alloy-trie/src/nibbles.rs

/// Chuỗi nibble (4-bit) dùng làm key trong Merkle-Patricia Trie.
///
/// Mỗi byte được tách thành 2 nibble: `high = byte >> 4`, `low = byte & 0xF`.
///
/// # Examples
/// ```
/// use alloy_trie::Nibbles;
///
/// // Unpack từ bytes (dùng cho keccak256(address))
/// let nibbles = Nibbles::unpack(&[0xAB, 0xCD]);
/// assert_eq!(nibbles.len(), 4);
/// assert_eq!(nibbles[0], 0xA);
/// assert_eq!(nibbles[1], 0xB);
///
/// // Pack ngược lại thành bytes (compact encoding)
/// let packed = nibbles.pack();
/// assert_eq!(packed, [0xAB, 0xCD]);
/// ```
#[derive(Clone, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Nibbles(smallvec::SmallVec<[u8; 64]>); // 64 nibble = 32 byte inline (không alloc)

impl Nibbles {
    /// Unpack bytes thành nibbles.
    pub fn unpack(bytes: &[u8]) -> Self {
        let mut nibbles = smallvec::SmallVec::with_capacity(bytes.len() * 2);
        for &byte in bytes {
            nibbles.push(byte >> 4);
            nibbles.push(byte & 0xF);
        }
        Self(nibbles)
    }

    /// Pack nibbles thành bytes (cần số nibble chẵn).
    pub fn pack(&self) -> Vec<u8> {
        self.0.chunks(2)
            .map(|c| (c[0] << 4) | c.get(1).copied().unwrap_or(0))
            .collect()
    }

    /// Độ dài (số nibble).
    #[inline] pub fn len(&self) -> usize { self.0.len() }

    /// Lấy nibble theo index.
    #[inline] pub fn get(&self, idx: usize) -> Option<u8> { self.0.get(idx).copied() }

    /// Kiểm tra prefix chung, trả về độ dài prefix.
    pub fn common_prefix_length(&self, other: &Self) -> usize {
        self.0.iter().zip(other.0.iter()).take_while(|(a, b)| a == b).count()
    }

    /// Slice từ vị trí `from`.
    pub fn slice(&self, from: usize) -> Self {
        Self(self.0[from..].iter().copied().collect())
    }
}
```

#### `HashBuilder` — Tính State Root Incremental

```rust
// crates/alloy-trie/src/hash_builder.rs

use alloy_primitives::B256;
use crate::{Nibbles, TrieNode};

/// Tính Ethereum state root theo cách incremental từ các key-value pairs đã được sort.
///
/// **Yêu cầu:** các cặp (key, value) PHẢI được thêm theo thứ tự tăng dần của key.
///
/// # Algorithm
/// Sử dụng stack để xây dựng trie từ bottom-up, tránh lưu toàn bộ cây vào RAM.
/// Phù hợp với streaming: đọc accounts từ database theo thứ tự rồi feed vào.
///
/// # Examples
/// ```
/// use alloy_trie::HashBuilder;
/// use alloy_primitives::{keccak256, B256};
///
/// let mut builder = HashBuilder::default();
///
/// // Thêm accounts đã được sort theo keccak256(address)
/// builder.add_leaf(
///     alloy_trie::Nibbles::unpack(keccak256(b"account_a").as_slice()),
///     &[0x01, 0x80],  // RLP-encoded empty account
/// );
/// builder.add_leaf(
///     alloy_trie::Nibbles::unpack(keccak256(b"account_b").as_slice()),
///     &[0x01, 0x80],
/// );
///
/// let root: B256 = builder.root();
/// ```
#[derive(Default)]
pub struct HashBuilder {
    key:    Nibbles,
    stack:  Vec<HashBuilderValue>,
    groups: Vec<TrieMask>,
}

/// Giá trị trong stack — có thể là hash hoặc inline node.
enum HashBuilderValue {
    Hash(B256),
    Bytes(smallvec::SmallVec<[u8; 64]>),
}

impl HashBuilder {
    /// Thêm một leaf node (phải gọi theo thứ tự key tăng dần).
    pub fn add_leaf(&mut self, key: Nibbles, value: &[u8]) {
        self.update(&key);
        self.key = key;
        self.stack.push(HashBuilderValue::Bytes(
            value.iter().copied().collect()
        ));
    }

    /// Kết thúc và trả về root hash.
    /// Gọi sau khi đã thêm tất cả leaves.
    pub fn root(mut self) -> B256 {
        self.finalize();
        match self.stack.pop() {
            Some(HashBuilderValue::Hash(h)) => h,
            Some(HashBuilderValue::Bytes(b)) => {
                alloy_primitives::keccak256(&b)
            },
            None => EMPTY_ROOT_HASH,
        }
    }

    fn update(&mut self, next_key: &Nibbles) { /* ... */ }
    fn finalize(&mut self) { /* ... */ }
}

/// Root hash của trie rỗng: keccak256(RLP(""))
pub const EMPTY_ROOT_HASH: B256 = B256([
    0x56, 0xe8, 0x1f, 0x17, 0x1b, 0xcc, 0x55, 0xa6,
    0xff, 0x83, 0x45, 0xe6, 0x92, 0xc0, 0xf8, 0x6e,
    0x5b, 0x48, 0xe0, 0x1b, 0x99, 0x6c, 0xad, 0xc0,
    0x01, 0x62, 0x2f, 0xb5, 0xe3, 0x63, 0xb4, 0x21,
]);
```

#### `proof.rs` — Merkle Proof

```rust
// crates/alloy-trie/src/proof.rs

use alloy_primitives::B256;
use crate::Nibbles;

/// Bằng chứng Merkle-Patricia (danh sách các node RLP-encoded trên đường từ root đến leaf).
pub type MerkleProof = Vec<alloy_primitives::Bytes>;

/// Xác minh Merkle proof cho một key-value pair.
///
/// # Arguments
/// - `root`: State root cần kiểm tra
/// - `key`:  Nibble path (thường là `keccak256(rlp_encode(key))`)
/// - `value`: Giá trị mong đợi (RLP-encoded), `None` nếu kiểm tra non-inclusion
/// - `proof`: Danh sách node RLP từ `generate_proof()`
///
/// # Returns
/// `Ok(true)` nếu proof hợp lệ, `Ok(false)` nếu key không tồn tại (non-inclusion),
/// `Err(_)` nếu proof bị lỗi cấu trúc.
///
/// # Examples
/// ```
/// use alloy_trie::proof::{generate_proof, verify_proof};
/// use alloy_primitives::keccak256;
///
/// // Tạo proof
/// let proof = generate_proof(&trie, keccak256(address.as_slice()))?;
///
/// // Xác minh (dùng ở phía stateless client / ZK verifier)
/// let ok = verify_proof(
///     state_root,
///     keccak256(address.as_slice()),
///     Some(&rlp_account),
///     &proof,
/// )?;
/// assert!(ok);
/// ```
pub fn verify_proof(
    root:  B256,
    key:   B256,
    value: Option<&[u8]>,
    proof: &MerkleProof,
) -> Result<bool, ProofError> {
    let mut expected_hash = root;
    let mut key_nibbles   = Nibbles::unpack(key.as_slice());
    let mut depth         = 0usize;

    for node_bytes in proof {
        // 1. Hash node, so sánh với expected
        let node_hash = alloy_primitives::keccak256(node_bytes);
        if node_hash != expected_hash {
            return Err(ProofError::HashMismatch { depth, expected: expected_hash, got: node_hash });
        }

        // 2. Decode RLP node
        let decoded = decode_node(node_bytes)?;

        // 3. Traverse theo nibble path
        match decoded {
            DecodedNode::Leaf { path, value: leaf_value } => {
                // Đây là node cuối
                if key_nibbles.slice(depth) != path {
                    return Ok(false); // Non-inclusion
                }
                return match value {
                    Some(expected_value) => Ok(leaf_value == expected_value),
                    None                 => Ok(false), // Key tồn tại nhưng caller nói không có
                };
            }
            DecodedNode::Branch { children } => {
                let nibble = key_nibbles.get(depth).ok_or(ProofError::KeyTooShort)? as usize;
                expected_hash = children[nibble].ok_or(ProofError::MissingBranchChild { nibble })?;
                depth += 1;
            }
            DecodedNode::Extension { path, child } => {
                let skip = path.len();
                if key_nibbles.slice(depth).0[..skip] != path.0[..] {
                    return Ok(false);
                }
                expected_hash = child;
                depth += skip;
            }
        }
    }

    Ok(value.is_none()) // Proof cạn mà chưa tìm thấy leaf → non-inclusion
}

/// Lỗi khi xác minh proof.
#[derive(Debug, thiserror::Error)]
pub enum ProofError {
    #[error("hash mismatch at depth {depth}: expected {expected}, got {got}")]
    HashMismatch { depth: usize, expected: B256, got: B256 },
    #[error("RLP decode failed: {0}")]
    RlpDecode(#[from] alloy_rlp::DecodeError),
    #[error("key too short for branch traversal")]
    KeyTooShort,
    #[error("missing branch child at nibble {nibble}")]
    MissingBranchChild { nibble: usize },
}
```

---

### 19.9 `deny.toml` — License & Security Audit

```toml
# wikialisalabs-evm/deny.toml

[licenses]
allow = [
    "MIT",
    "Apache-2.0",
    "Apache-2.0 WITH LLVM-exception",
    "ISC",
    "Unicode-DFS-2016",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "CC0-1.0",
    "Zlib",
]
deny = ["GPL-2.0", "GPL-3.0", "AGPL-1.0", "AGPL-3.0", "LGPL-2.0", "LGPL-3.0"]

[advisories]
db-urls       = ["https://github.com/rustsec/advisory-db"]
vulnerability = "deny"   # Bất kỳ CVE nào → CI fail ngay
unmaintained  = "warn"   # Crate không maintain → cảnh báo
yanked        = "deny"   # Crate bị yank → CI fail

[bans]
multiple-versions = "warn"
deny = [
    { name = "openssl" },          # Dùng rustls thay thế — tránh C dependency
    { name = "openssl-sys" },
    { name = "cmake" },            # Tránh build dependency phức tạp
]
skip = [
    # Cho phép 2 version của một số crates phổ biến trong ecosystem
    { name = "syn", version = "1" },
]

[sources]
unknown-registry = "deny"          # Chỉ dùng crates.io
unknown-git      = "deny"          # Không được dùng git dependency trong production
allow-git        = [
    "https://github.com/wikialisalabs",  # Internal repos được phép
]
```

---

### 19.10 GitHub Actions — `no-std.yml`

```yaml
# .github/workflows/no-std.yml
name: no-std check

on:
  push:
    paths: ["crates/alloy-primitives/**", "crates/alloy-rlp/**", "crates/alloy-trie/**"]
  pull_request:

jobs:
  no-std:
    name: Check no_std — ${{ matrix.target }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        target:
          - thumbv7em-none-eabihf   # ARM Cortex-M4 (embedded)
          - wasm32-unknown-unknown  # WASM
          - riscv32i-unknown-none-elf # RISC-V (ZK prover environment)
    steps:
      - uses: actions/checkout@v4

      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - uses: Swatinem/rust-cache@v2
        with: { shared-key: "no-std-${{ matrix.target }}" }

      - name: Check alloy-primitives (no_std)
        run: |
          cargo check \
            -p alloy-primitives \
            --target ${{ matrix.target }} \
            --no-default-features

      - name: Check alloy-rlp (no_std)
        run: |
          cargo check \
            -p alloy-rlp \
            --target ${{ matrix.target }} \
            --no-default-features

      - name: Check alloy-trie (no_std, không có parallel feature)
        run: |
          cargo check \
            -p alloy-trie \
            --target ${{ matrix.target }} \
            --no-default-features
```

---

### 19.11 Ví dụ hoàn chỉnh — Tính State Root từ danh sách accounts

```rust
// examples/trie_state_root.rs
//! Ví dụ: tính Ethereum state root từ danh sách accounts.
//!
//! Chạy: cargo run --example trie_state_root

use alloy_primitives::{address, keccak256, U256};
use alloy_rlp::encode;
use alloy_trie::{HashBuilder, Nibbles};

/// RLP encoding của một account đơn giản
fn rlp_account(nonce: u64, balance: U256) -> Vec<u8> {
    // Account = RLP([nonce, balance, storageRoot, codeHash])
    encode(&(
        nonce,
        balance,
        alloy_trie::EMPTY_ROOT_HASH,    // storageRoot rỗng
        alloy_primitives::keccak256(&[]), // codeHash của account không có code
    ))
}

fn main() -> eyre::Result<()> {
    // Danh sách accounts (address → nonce, balance)
    let mut accounts = vec![
        (address!("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"), 0u64, U256::from(1_000_000_000_000_000_000u64)),
        (address!("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"), 1u64, U256::from(500_000_000_000_000_000u64)),
        (address!("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"), 0u64, U256::from(2_000_000_000_000_000_000u64)),
    ];

    // BƯỚC 1: Sort theo keccak256(address) — BẮT BUỘC cho HashBuilder
    accounts.sort_by_key(|(addr, _, _)| keccak256(addr.as_slice()));

    // BƯỚC 2: Tạo HashBuilder và feed từng account
    let mut builder = HashBuilder::default();
    for (addr, nonce, balance) in &accounts {
        let hashed_key = keccak256(addr.as_slice());
        let rlp        = rlp_account(*nonce, *balance);
        builder.add_leaf(Nibbles::unpack(hashed_key.as_slice()), &rlp);
    }

    // BƯỚC 3: Lấy state root
    let state_root = builder.root();
    println!("State root: {state_root}");

    Ok(())
}
```

---

## 20. Giai đoạn 2 Chi tiết: Thiết kế API & Triển khai `evm`

> **Mục tiêu:** EVM interpreter đầy đủ Cancun, modular, pass ≥ 95% `ethereum/tests`, Inspector hook API sẵn sàng cho Foundry/Debugger.

---

### 20.1 Cấu trúc Workspace `evm`

```
wikialisalabs-evm/crates/
├── revm-primitives/          ← Env, TxEnv, BlockEnv, ResultAndState
├── revm-interpreter/         ← Stack, Memory, Bytecode, opcode dispatch
├── revm-precompiles/         ← SHA256, ECRECOVER, BN128, KZG, BLAKE2
├── revm-context/             ← EVMContext<DB> — gom DB + Env + Journal
├── revm-context-interface/   ← Trait ContextTr, DatabaseGetter (no impl)
├── revm-inspector/           ← Inspector trait + NoOpInspector, TracerEip3155
├── revm-handler/             ← ExecutionHandler — glue tất cả lại
├── revm-database/            ← Database trait + InMemoryDB, EmptyDB
├── revm-database-interface/  ← Trait Database, DatabaseRef (no impl)
└── revm/                     ← Meta-crate: re-export + builder API
```

**Nguyên tắc tách crate:**
- `*-interface` crates chỉ chứa traits, không có logic — cho phép downstream impl mà không kéo dep nặng
- `revm-interpreter` **không** phụ thuộc async, không phụ thuộc `revm-context` — chạy được standalone
- `revm-precompiles` có thể swap toàn bộ bằng custom impl (cần cho ZK-EVM)

---

### 20.2 `Cargo.toml` — crate `revm`

```toml
# crates/revm/Cargo.toml
[package]
name         = "revm"
version      = "0.1.0"
edition      = "2021"
rust-version = "1.76"
description  = "Ethereum Virtual Machine — modular, no_std-compatible"
license      = "MIT OR Apache-2.0"
repository   = "https://github.com/wikialisalabs/evm"
keywords     = ["ethereum", "evm", "revm", "blockchain"]
categories   = ["cryptography::cryptocurrencies"]

[dependencies]
revm-interpreter         = { path = "../revm-interpreter",         version = "0.1" }
revm-precompiles         = { path = "../revm-precompiles",         version = "0.1" }
revm-context             = { path = "../revm-context",             version = "0.1" }
revm-context-interface   = { path = "../revm-context-interface",   version = "0.1" }
revm-handler             = { path = "../revm-handler",             version = "0.1" }
revm-database            = { path = "../revm-database",            version = "0.1" }
revm-database-interface  = { path = "../revm-database-interface",  version = "0.1" }
alloy-primitives         = { workspace = true }
alloy-eips               = { workspace = true }

[features]
default       = ["std"]
std           = [
    "revm-interpreter/std",
    "revm-precompiles/std",
    "revm-context/std",
]
serde         = ["revm-primitives/serde"]
optional-gas-refund = []    # EIP-3529: giảm gas refund limit
c-kzg         = ["revm-precompiles/c-kzg"]  # KZG precompile (EIP-4844)
```

---

### 20.3 `revm-primitives` — Môi trường thực thi

```rust
// crates/revm-primitives/src/env.rs

use alloy_primitives::{Address, B256, U256, Bytes};

/// Toàn bộ thông tin cần thiết cho một lần thực thi EVM.
/// Gom BlockEnv + TxEnv để truyền qua các lớp mà không clone riêng lẻ.
#[derive(Clone, Debug, Default)]
pub struct Env {
    pub block: BlockEnv,
    pub tx:    TxEnv,
    pub cfg:   CfgEnv,
}

/// Thông tin block — bất biến trong suốt một block.
#[derive(Clone, Debug)]
pub struct BlockEnv {
    /// Số block hiện tại
    pub number:       U256,
    /// Địa chỉ coinbase (fee recipient)
    pub coinbase:     Address,
    /// Unix timestamp của block
    pub timestamp:    U256,
    /// Gas limit của block
    pub gas_limit:    U256,
    /// Base fee (EIP-1559) — None nếu pre-London
    pub basefee:      U256,
    /// Difficulty (pre-Merge) hoặc prevrandao (post-Merge)
    pub difficulty:   U256,
    /// PREVRANDAO (EIP-4399) — Some sau Paris hardfork
    pub prevrandao:   Option<B256>,
    /// Blob base fee (EIP-4844) — None nếu pre-Cancun
    pub blob_excess_gas_and_price: Option<BlobExcessGasAndPrice>,
}

/// Thông tin transaction.
#[derive(Clone, Debug, Default)]
pub struct TxEnv {
    /// Người gửi
    pub caller:           Address,
    /// Gas limit của tx
    pub gas_limit:        u64,
    /// Gas price (legacy) hoặc max_fee_per_gas (EIP-1559)
    pub gas_price:        U256,
    /// Đích: Call(address) hoặc Create
    pub transact_to:      TxKind,
    /// ETH value gửi kèm
    pub value:            U256,
    /// Calldata
    pub data:             Bytes,
    /// Nonce (None = skip nonce check)
    pub nonce:            Option<u64>,
    /// Chain ID (None = legacy pre-EIP-155)
    pub chain_id:         Option<u64>,
    /// Access list (EIP-2930)
    pub access_list:      Vec<(Address, Vec<U256>)>,
    /// Max priority fee (EIP-1559)
    pub gas_priority_fee: Option<U256>,
    /// Blob hashes (EIP-4844)
    pub blob_hashes:      Vec<B256>,
    /// Max fee per blob gas (EIP-4844)
    pub max_fee_per_blob_gas: Option<U256>,
}

/// Loại giao dịch.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub enum TxKind {
    #[default]
    Create,
    Call(Address),
}

/// Cấu hình EVM — hardfork và các flag toàn cục.
#[derive(Clone, Debug)]
pub struct CfgEnv {
    /// Chain ID — kiểm tra EIP-155
    pub chain_id:       u64,
    /// Hardfork đang hoạt động
    pub spec_id:        SpecId,
    /// Bỏ qua nonce check (dùng trong static call / simulation)
    pub disable_nonce_check: bool,
    /// Bỏ qua balance check (dùng trong eth_call)
    pub disable_balance_check: bool,
    /// Giới hạn chiều sâu call stack (default: 1024)
    pub limit_contract_code_size: Option<usize>,
}

/// Hardfork spec identifier.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
#[repr(u8)]
pub enum SpecId {
    FRONTIER        = 0,
    HOMESTEAD       = 1,
    TANGERINE       = 2,
    SPURIOUS_DRAGON = 3,
    BYZANTIUM       = 4,
    CONSTANTINOPLE  = 5,
    PETERSBURG      = 6,
    ISTANBUL        = 7,
    MUIR_GLACIER    = 8,
    BERLIN          = 9,
    LONDON          = 10,
    ARROW_GLACIER   = 11,
    GRAY_GLACIER    = 12,
    MERGE           = 13,  // Paris
    SHANGHAI        = 14,
    CANCUN          = 15,
    PRAGUE          = 16,
    LATEST          = u8::MAX,
}
```

---

### 20.4 `Database` trait — Giao diện State

```rust
// crates/revm-database-interface/src/lib.rs

use alloy_primitives::{Address, B256, U256};

/// Thông tin account — nonce, balance, code hash.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct AccountInfo {
    /// Số dư ETH
    pub balance:   U256,
    /// Nonce
    pub nonce:     u64,
    /// Keccak256 của bytecode (B256::ZERO nếu EOA)
    pub code_hash: B256,
    /// Bytecode (lazy-loaded, None nếu chưa cần)
    pub code:      Option<Bytecode>,
}

/// Trait truy cập state — implement cho bất kỳ backend nào.
///
/// # Implementation Note
/// - Các method nhận `&mut self` để hỗ trợ lazy loading từ database
/// - Phải deterministic: cùng input → cùng output
///
/// # Examples
/// ```rust
/// use revm::{InMemoryDB, Database};
///
/// let mut db = InMemoryDB::default();
/// let info = db.basic(Address::ZERO)?;
/// ```
pub trait Database {
    /// Kiểu lỗi của backend (RocksDB error, network error…)
    type Error: core::fmt::Debug;

    /// Lấy thông tin account.
    /// Trả về `Ok(None)` nếu account không tồn tại (EOA mới).
    fn basic(&mut self, address: Address)
        -> Result<Option<AccountInfo>, Self::Error>;

    /// Lấy bytecode theo code hash.
    /// Tách khỏi `basic()` vì phần lớn calls không cần bytecode.
    fn code_by_hash(&mut self, code_hash: B256)
        -> Result<Bytecode, Self::Error>;

    /// Lấy giá trị storage slot.
    fn storage(&mut self, address: Address, index: U256)
        -> Result<U256, Self::Error>;

    /// Lấy block hash theo block number.
    /// EVM cần để hỗ trợ opcode BLOCKHASH.
    fn block_hash(&mut self, number: u64)
        -> Result<B256, Self::Error>;
}

/// Phiên bản read-only của Database (không cần &mut).
/// Dùng khi cần share DB qua nhiều threads.
pub trait DatabaseRef {
    type Error: core::fmt::Debug;
    fn basic_ref(&self, address: Address)
        -> Result<Option<AccountInfo>, Self::Error>;
    fn code_by_hash_ref(&self, code_hash: B256)
        -> Result<Bytecode, Self::Error>;
    fn storage_ref(&self, address: Address, index: U256)
        -> Result<U256, Self::Error>;
    fn block_hash_ref(&self, number: u64)
        -> Result<B256, Self::Error>;
}

/// Adapter: DatabaseRef → Database (wrap bằng RefCell)
pub struct DatabaseRefWrapper<T: DatabaseRef>(core::cell::RefCell<T>);
```

---

### 20.5 `InMemoryDB` — Backend cho Testing

```rust
// crates/revm-database/src/in_memory.rs

use alloy_primitives::{Address, B256, U256};
use hashbrown::HashMap;
use revm_database_interface::{AccountInfo, Database};

/// Database in-memory — dùng cho unit tests, simulations, Foundry cheatcodes.
///
/// # Examples
/// ```rust
/// use revm::InMemoryDB;
/// use alloy_primitives::{address, U256};
///
/// let mut db = InMemoryDB::default();
///
/// // Nạp ETH vào account
/// db.insert_account_info(
///     address!("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
///     AccountInfo {
///         balance: U256::from(10_u128.pow(18)), // 1 ETH
///         nonce:   0,
///         ..Default::default()
///     },
/// );
///
/// // Set storage slot
/// db.insert_account_storage(
///     address!("0xContract..."),
///     U256::from(0u64),   // slot 0
///     U256::from(42u64),  // value
/// )?;
/// ```
#[derive(Clone, Debug, Default)]
pub struct InMemoryDB {
    accounts: HashMap<Address, DbAccount>,
    block_hashes: HashMap<u64, B256>,
    contracts: HashMap<B256, Bytecode>,
}

#[derive(Clone, Debug, Default)]
struct DbAccount {
    info:    AccountInfo,
    storage: HashMap<U256, U256>,
    /// Trạng thái: Normal | SelfDestructed | LoadedAsEmpty
    status:  AccountStatus,
}

#[derive(Clone, Debug, Default, PartialEq, Eq)]
enum AccountStatus {
    #[default] Normal,
    SelfDestructed,
    LoadedAsEmpty,
}

impl InMemoryDB {
    /// Thêm/ghi đè thông tin account.
    pub fn insert_account_info(&mut self, address: Address, info: AccountInfo) {
        self.accounts.entry(address).or_default().info = info;
    }

    /// Thêm/ghi đè storage slot.
    pub fn insert_account_storage(
        &mut self,
        address: Address,
        slot: U256,
        value: U256,
    ) -> Result<(), core::convert::Infallible> {
        self.accounts.entry(address).or_default().storage.insert(slot, value);
        Ok(())
    }

    /// Lấy tất cả storage của một account (dùng để compute storageRoot).
    pub fn storage_iter(&self, address: &Address)
        -> impl Iterator<Item = (&U256, &U256)>
    {
        self.accounts.get(address)
            .map(|a| a.storage.iter())
            .into_iter()
            .flatten()
    }
}

impl Database for InMemoryDB {
    type Error = core::convert::Infallible;

    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error> {
        Ok(self.accounts.get(&address).map(|a| a.info.clone()))
    }

    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode, Self::Error> {
        Ok(self.contracts.get(&code_hash).cloned().unwrap_or_default())
    }

    fn storage(&mut self, address: Address, index: U256) -> Result<U256, Self::Error> {
        Ok(self.accounts.get(&address)
            .and_then(|a| a.storage.get(&index))
            .copied()
            .unwrap_or(U256::ZERO))
    }

    fn block_hash(&mut self, number: u64) -> Result<B256, Self::Error> {
        // Nếu không có trong cache: tính keccak256(block_number.to_be_bytes())
        Ok(self.block_hashes.get(&number).copied().unwrap_or_else(|| {
            alloy_primitives::keccak256(number.to_be_bytes())
        }))
    }
}
```

---

### 20.6 `Inspector` trait — Hook cho Tracer & Debugger

```rust
// crates/revm-inspector/src/lib.rs

use alloy_primitives::{Address, B256, U256, Log};
use revm_interpreter::{Interpreter, CallOutcome, CreateOutcome};
use revm_context_interface::ContextTr;

/// Inspector cho phép quan sát từng bước thực thi EVM.
///
/// Implement trait này để xây dựng:
/// - **Tracer** (ghi lại mọi opcode)
/// - **Debugger** (breakpoint, watch variables)
/// - **Gas profiler** (phân tích gas hog)
/// - **Coverage tool** (line coverage cho Solidity)
/// - **Fuzzing feedback** (guided fuzzing)
///
/// # Performance
/// `NoOpInspector` (default impl) được tối ưu bằng monomorphization —
/// khi dùng `NoOpInspector`, compiler inlines tất cả → zero overhead.
pub trait Inspector<CTX: ContextTr> {
    /// Gọi trước khi interpreter bắt đầu thực thi một call frame.
    #[inline]
    fn initialize_interp(&mut self, _interp: &mut Interpreter, _ctx: &mut CTX) {}

    /// Gọi trước mỗi opcode.
    ///
    /// Trả về `InstructionResult::Continue` để tiếp tục,
    /// hoặc kết quả khác để dừng/skip opcode.
    #[inline]
    fn step(&mut self, _interp: &mut Interpreter, _ctx: &mut CTX) {}

    /// Gọi sau mỗi opcode (sau khi đã thực thi).
    #[inline]
    fn step_end(&mut self, _interp: &mut Interpreter, _ctx: &mut CTX) {}

    /// Gọi khi có LOG0..LOG4.
    #[inline]
    fn log(&mut self, _interp: &mut Interpreter, _ctx: &mut CTX, _log: &Log) {}

    /// Gọi trước khi thực hiện CALL/CALLCODE/DELEGATECALL/STATICCALL.
    /// Trả về `None` để tiếp tục bình thường, `Some(outcome)` để override kết quả.
    #[inline]
    fn call(&mut self, _ctx: &mut CTX, _inputs: &mut CallInputs) -> Option<CallOutcome> {
        None
    }

    /// Gọi sau khi CALL kết thúc.
    #[inline]
    fn call_end(&mut self, _ctx: &mut CTX, _inputs: &CallInputs, _outcome: &mut CallOutcome) {}

    /// Gọi trước CREATE/CREATE2.
    #[inline]
    fn create(&mut self, _ctx: &mut CTX, _inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        None
    }

    /// Gọi sau CREATE kết thúc.
    #[inline]
    fn create_end(&mut self, _ctx: &mut CTX, _inputs: &CreateInputs, _outcome: &mut CreateOutcome) {}

    /// Gọi khi SELFDESTRUCT.
    #[inline]
    fn selfdestruct(&mut self, _contract: Address, _target: Address, _value: U256) {}
}

/// Inspector không làm gì — zero overhead khi không cần debug.
pub struct NoOpInspector;
impl<CTX: ContextTr> Inspector<CTX> for NoOpInspector {}

/// EIP-3155 standard tracer — xuất JSON trace tương thích geth.
pub struct TracerEip3155 {
    output:     Vec<u8>,    // Buffer output (tránh alloc mỗi dòng)
    gas_limit:  u64,
    print_summary: bool,
}

impl TracerEip3155 {
    pub fn new(gas_limit: u64) -> Self {
        Self { output: Vec::new(), gas_limit, print_summary: true }
    }

    /// Xuất toàn bộ trace dưới dạng NDJSON (một JSON object mỗi dòng).
    pub fn into_output(self) -> Vec<u8> { self.output }
}
```

---

### 20.7 Gas Schedule — EIP-driven Constants

```rust
// crates/revm-interpreter/src/gas/constants.rs

//! Gas cost constants theo Ethereum Yellow Paper và các EIPs.
//! Mỗi hằng số có comment trỏ tới EIP/spec nguồn gốc.

// --- Bộ nhớ ---
pub const MEMORY_GAS_PER_WORD: u64 = 3;       // Yellow Paper §9.1

// --- Stack operations ---
pub const GAS_VERY_LOW:  u64 = 3;             // ADD, SUB, NOT, LT...
pub const GAS_LOW:       u64 = 5;             // MUL, DIV, SDIV...
pub const GAS_MID:       u64 = 8;             // ADDMOD, MULMOD, JUMP
pub const GAS_HIGH:      u64 = 10;            // JUMPI
pub const GAS_EXP_BYTE:  u64 = 50;            // EIP-160: EXP per byte in exponent

// --- Storage ---
pub const SLOAD_COLD:         u64 = 2100;     // EIP-2929
pub const SLOAD_WARM:         u64 = 100;      // EIP-2929
pub const SSTORE_SET:         u64 = 20000;    // Yellow Paper
pub const SSTORE_RESET:       u64 = 2900;     // EIP-2929 adjusted
pub const SSTORE_CLEARS_SCHEDULE: u64 = 4800; // EIP-3529 refund cap
pub const SSTORE_INIT_REFUND:     u64 = 19900;// EIP-3529

// --- Account access (EIP-2929) ---
pub const COLD_ACCOUNT_ACCESS: u64 = 2600;    // EIP-2929
pub const WARM_ACCOUNT_ACCESS: u64 = 100;     // EIP-2929

// --- Call opcodes ---
pub const CALL_STIPEND:  u64 = 2300;          // ETH transfer minimum
pub const CALL_NEW_ACCOUNT: u64 = 25000;      // Tạo account mới trong CALL

// --- Precompiles ---
pub const ECRECOVER_GAS:   u64 = 3000;
pub const SHA256_BASE:     u64 = 60;
pub const SHA256_PER_WORD: u64 = 12;
pub const RIPEMD160_BASE:  u64 = 600;
pub const IDENTITY_BASE:   u64 = 15;
pub const IDENTITY_WORD:   u64 = 3;

// --- EIP-4844 Blob ---
pub const POINT_EVALUATION_PRECOMPILE_GAS: u64 = 50000; // EIP-4844

// --- Transient storage (EIP-1153) ---
pub const TLOAD_GAS:  u64 = 100;              // EIP-1153 — warm SLOAD equivalent
pub const TSTORE_GAS: u64 = 100;              // EIP-1153 — warm SSTORE equivalent

/// Tính gas cho memory expansion.
///
/// Formula: `memory_gas = words * 3 + words^2 / 512`
/// Chi phí tăng quadratically để ngăn memory bomb attacks.
#[inline]
pub fn memory_gas(word_count: u64) -> u64 {
    let words = word_count;
    words.saturating_mul(MEMORY_GAS_PER_WORD)
        .saturating_add(words.saturating_mul(words) / 512)
}

/// Tính gas cho EXP opcode.
///
/// EIP-160: 10 + 50 * byte_length_of_exponent
#[inline]
pub fn exp_gas(exponent: &alloy_primitives::U256) -> u64 {
    if exponent.is_zero() { return 10; }
    let byte_len = (exponent.bit_len() as u64 + 7) / 8;
    10_u64.saturating_add(GAS_EXP_BYTE.saturating_mul(byte_len))
}
```

---

### 20.8 Opcode Dispatch — Bảng nhảy hiệu năng cao

```rust
// crates/revm-interpreter/src/instructions/table.rs

//! Jump table cho opcode dispatch — nhanh hơn match arm vì branch predictor
//! có thể cache bảng địa chỉ hàm (indirect call prediction).

use crate::{Interpreter, InstructionResult};
use revm_context_interface::ContextTr;

/// Kiểu con trỏ hàm thực thi một opcode.
pub type Instruction<CTX> = fn(&mut Interpreter, &mut CTX);

/// Bảng 256 instruction pointers — một entry cho mỗi opcode (0x00..=0xFF).
pub struct InstructionTable<CTX>([Instruction<CTX>; 256]);

impl<CTX: ContextTr> InstructionTable<CTX> {
    /// Xây dựng bảng cho một SpecId cụ thể.
    /// Các opcode không hợp lệ ở spec đó trỏ tới `instruction_not_found`.
    pub fn new(spec_id: SpecId) -> Self {
        let mut table = [instruction_not_found as Instruction<CTX>; 256];

        // --- Stop & Arithmetic (0x00..=0x0B) ---
        table[0x00] = instruction::stop;
        table[0x01] = instruction::add;
        table[0x02] = instruction::mul;
        table[0x03] = instruction::sub;
        table[0x04] = instruction::div;
        table[0x05] = instruction::sdiv;
        table[0x06] = instruction::modulo;
        table[0x07] = instruction::smod;
        table[0x08] = instruction::addmod;
        table[0x09] = instruction::mulmod;
        table[0x0A] = instruction::exp;
        table[0x0B] = instruction::signextend;

        // --- Comparison & Bitwise (0x10..=0x1D) ---
        table[0x10] = instruction::lt;
        table[0x11] = instruction::gt;
        // ... (tất cả 188 opcodes)

        // --- EIP-1153: Transient Storage (chỉ từ Cancun) ---
        if spec_id >= SpecId::CANCUN {
            table[0x5C] = instruction::tload;
            table[0x5D] = instruction::tstore;
        }

        // --- EIP-4844: BLOBHASH (chỉ từ Cancun) ---
        if spec_id >= SpecId::CANCUN {
            table[0x49] = instruction::blobhash;
        }

        Self(table)
    }

    /// Thực thi opcode.
    #[inline(always)]
    pub fn execute(&self, opcode: u8, interp: &mut Interpreter, ctx: &mut CTX) {
        (self.0[opcode as usize])(interp, ctx);
    }
}

/// Opcode không hợp lệ — trả về INVALID kết quả.
fn instruction_not_found<CTX>(interp: &mut Interpreter, _ctx: &mut CTX) {
    interp.instruction_result = InstructionResult::InvalidFEOpcode;
}
```

---

### 20.9 Builder API — `Evm::builder()`

```rust
// crates/revm/src/builder.rs

use revm_context::EvmContext;
use revm_database_interface::Database;
use revm_inspector::{Inspector, NoOpInspector};

/// Builder pattern để tạo EVM instance.
///
/// # Examples
///
/// **Execution cơ bản (không inspector):**
/// ```rust
/// use revm::{Evm, InMemoryDB};
/// use revm_primitives::{TxKind, U256, address};
///
/// let mut db = InMemoryDB::default();
/// let result = Evm::builder()
///     .with_db(&mut db)
///     .modify_block_env(|b| { b.number = U256::from(20_000_000u64); })
///     .modify_tx_env(|tx| {
///         tx.caller      = address!("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
///         tx.transact_to = TxKind::Call(address!("0xRecipient..."));
///         tx.value       = U256::from(1_000u64);
///         tx.gas_limit   = 21_000;
///     })
///     .build()
///     .transact_commit()?;
///
/// assert!(result.is_success());
/// ```
///
/// **Với Inspector (EIP-3155 tracer):**
/// ```rust
/// use revm::{Evm, InMemoryDB};
/// use revm_inspector::TracerEip3155;
///
/// let mut db = InMemoryDB::default();
/// let mut tracer = TracerEip3155::new(1_000_000);
///
/// let result = Evm::builder()
///     .with_db(&mut db)
///     .with_inspector(&mut tracer)
///     .modify_tx_env(|tx| { /* ... */ })
///     .build()
///     .transact()?;
///
/// let trace_json = tracer.into_output();
/// ```
pub struct EvmBuilder<DB, INSP = NoOpInspector> {
    db:       DB,
    env:      Box<Env>,
    inspector: INSP,
    spec_id:  SpecId,
}

impl<DB: Database> EvmBuilder<DB, NoOpInspector> {
    pub fn new(db: DB) -> Self {
        Self {
            db,
            env:      Box::default(),
            inspector: NoOpInspector,
            spec_id:  SpecId::CANCUN,
        }
    }
}

impl<DB: Database, INSP: Inspector<EvmContext<DB>>> EvmBuilder<DB, INSP> {
    /// Đặt inspector (thay đổi generic type).
    pub fn with_inspector<I: Inspector<EvmContext<DB>>>(
        self,
        inspector: I,
    ) -> EvmBuilder<DB, I> {
        EvmBuilder { db: self.db, env: self.env, inspector, spec_id: self.spec_id }
    }

    pub fn modify_block_env(mut self, f: impl FnOnce(&mut BlockEnv)) -> Self {
        f(&mut self.env.block); self
    }

    pub fn modify_tx_env(mut self, f: impl FnOnce(&mut TxEnv)) -> Self {
        f(&mut self.env.tx); self
    }

    pub fn with_spec_id(mut self, spec_id: SpecId) -> Self {
        self.spec_id = spec_id; self
    }

    /// Build thành `Evm` ready-to-use.
    pub fn build(self) -> Evm<DB, INSP> {
        Evm::new(self.db, *self.env, self.inspector, self.spec_id)
    }
}

/// EVM instance — main execution engine.
pub struct Evm<DB: Database, INSP = NoOpInspector> {
    context:   EvmContext<DB>,
    inspector: INSP,
}

impl<DB: Database, INSP: Inspector<EvmContext<DB>>> Evm<DB, INSP> {
    /// Thực thi transaction, trả về ResultAndState (không commit state).
    pub fn transact(&mut self) -> Result<ResultAndState, EVMError<DB::Error>> {
        // 1. Validate tx (nonce, balance, gas)
        // 2. Deduct upfront cost
        // 3. Execute bytecode với Inspector hooks
        // 4. Refund gas
        // 5. Pay coinbase
        todo!()
    }

    /// Thực thi và commit state changes vào DB.
    pub fn transact_commit(&mut self) -> Result<ExecutionResult, EVMError<DB::Error>> {
        let ResultAndState { result, state } = self.transact()?;
        self.context.db.commit(state);
        Ok(result)
    }
}

/// Kết quả và state changes sau khi execute.
pub struct ResultAndState {
    pub result: ExecutionResult,
    pub state:  State, // HashMap<Address, Account>
}

/// Kết quả execution.
#[derive(Debug)]
pub enum ExecutionResult {
    Success {
        reason:      SuccessReason,
        gas_used:    u64,
        gas_refunded: u64,
        logs:        Vec<Log>,
        output:      Output,
    },
    Revert {
        gas_used: u64,
        output:   Bytes,
    },
    Halt {
        reason:   HaltReason,
        gas_used: u64,
    },
}

impl ExecutionResult {
    pub fn is_success(&self) -> bool { matches!(self, Self::Success { .. }) }
    pub fn gas_used(&self) -> u64 {
        match self {
            Self::Success { gas_used, .. } => *gas_used,
            Self::Revert  { gas_used, .. } => *gas_used,
            Self::Halt    { gas_used, .. } => *gas_used,
        }
    }
}
```

---

### 20.10 Fuzz Targets cho `evm`

```rust
// fuzz/fuzz_targets/fuzz_evm_bytecode.rs
//! Fuzz EVM với bytecode ngẫu nhiên — tìm panic, infinite loop, OOB access.

#![no_main]
use libfuzzer_sys::fuzz_target;
use revm::{Evm, InMemoryDB};
use revm_primitives::{TxEnv, TxKind, U256, address, Bytes};

fuzz_target!(|data: &[u8]| {
    // Treat `data` như là bytecode của một contract
    let contract_addr = address!("0x1111111111111111111111111111111111111111");
    let caller        = address!("0x2222222222222222222222222222222222222222");

    let mut db = InMemoryDB::default();
    // Deploy bytecode ngẫu nhiên
    db.insert_account_info(contract_addr, revm_database_interface::AccountInfo {
        balance:   U256::ZERO,
        nonce:     0,
        code_hash: alloy_primitives::keccak256(data),
        code:      Some(Bytecode::new_raw(Bytes::copy_from_slice(data))),
    });
    db.insert_account_info(caller, revm_database_interface::AccountInfo {
        balance: U256::MAX, // Đủ ETH cho mọi thứ
        ..Default::default()
    });

    // Chạy với gas limit nhỏ để tránh timeout
    let _ = Evm::builder()
        .with_db(&mut db)
        .with_spec_id(SpecId::CANCUN)
        .modify_tx_env(|tx| {
            tx.caller      = caller;
            tx.transact_to = TxKind::Call(contract_addr);
            tx.gas_limit   = 100_000;  // Giới hạn để fuzz nhanh
            tx.data        = Bytes::new();
        })
        .build()
        .transact(); // Không panic = pass

    // Không assert kết quả — chỉ cần không crash
});
```

```rust
// fuzz/fuzz_targets/fuzz_evm_calldata.rs
//! Fuzz calldata gửi đến một contract cố định (ERC-20).

#![no_main]
use libfuzzer_sys::fuzz_target;
use revm::{Evm, InMemoryDB};
use alloy_primitives::Bytes;

// Bytecode ERC-20 chuẩn (pre-compiled artifact)
const ERC20_BYTECODE: &[u8] = include_bytes!("../artifacts/erc20.bin");

fuzz_target!(|calldata: &[u8]| {
    let mut db = setup_erc20_db(ERC20_BYTECODE);
    let _ = Evm::builder()
        .with_db(&mut db)
        .modify_tx_env(|tx| {
            tx.transact_to = TxKind::Call(ERC20_ADDR);
            tx.data        = Bytes::copy_from_slice(calldata);
            tx.gas_limit   = 500_000;
        })
        .build()
        .transact();
});
```

---

### 20.11 CI Workflow — `bench.yml` (Benchmark Regression Guard)

```yaml
# .github/workflows/bench.yml
name: Benchmark Regression

on:
  push:
    branches: [main]

permissions:
  contents: write      # Để bencher.dev push badge vào repo

jobs:
  bench:
    name: Criterion benchmarks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: dtolnay/rust-toolchain@stable

      - uses: Swatinem/rust-cache@v2
        with: { shared-key: "bench" }

      # Cài sccache để tránh recompile
      - name: Install sccache
        run: cargo install sccache --locked

      - name: Run benchmarks
        run: |
          cargo bench --all-features --workspace 2>&1 | tee bench_output.txt

      # Upload kết quả lên bencher.dev để tracking theo commit
      - uses: bencherdev/bencher@main
        with:
          project: wikialisalabs-evm
          token:   ${{ secrets.BENCHER_API_TOKEN }}
          testbed: ubuntu-latest
          adapter:  rust_criterion
          file:    bench_output.txt

      # Fail PR nếu regression > 10%
      - name: Check regressions
        run: |
          python3 scripts/check_bench_regression.py bench_output.txt 10.0
```

```yaml
# .github/workflows/ethereum-tests.yml
name: ethereum/tests compatibility

on:
  push:
    paths: ["crates/revm**/**"]
  schedule:
    - cron: "0 2 * * 1"  # Thứ 2 hàng tuần

jobs:
  ethereum-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Checkout ethereum/tests
        uses: actions/checkout@v4
        with:
          repository: ethereum/tests
          path: ethereum-tests
          sparse-checkout: |
            GeneralStateTests
            BlockchainTests

      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2

      - name: Build test runner
        run: cargo build --release -p revm-test

      - name: Run GeneralStateTests
        run: |
          ./target/release/revm-test \
            --path ethereum-tests/GeneralStateTests \
            --spec Cancun \
            --report tests_report.json

      - name: Assert pass rate ≥ 95%
        run: |
          PASS_RATE=$(jq '.pass_rate' tests_report.json)
          echo "Pass rate: $PASS_RATE%"
          python3 -c "import sys; sys.exit(0 if float('$PASS_RATE') >= 95.0 else 1)"
```

---

## 21. Giai đoạn 2 Chi tiết: `svm-rs` — Download Engine & CLI

> **Mục tiêu:** Trình quản lý phiên bản `solc` viết bằng Rust thuần — an toàn, cross-platform, dùng được cả như CLI lẫn thư viện trong `build.rs`.

---

### 21.1 Cấu trúc Workspace `svm-rs`

```
wikialisalabs-evm/crates/
├── svm-rs/               ← Core library
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── manager.rs    ← SvmManager — entry point
│       ├── version.rs    ← Version newtype (semver wrapper)
│       ├── platform.rs   ← Platform detection (OS + arch)
│       ├── releases.rs   ← Fetch + parse list.json từ binaries.soliditylang.org
│       ├── install.rs    ← Download + verify + install pipeline
│       ├── verify.rs     ← SHA-256 checksum verification
│       ├── error.rs      ← SvmError enum
│       └── paths.rs      ← ~/.svm/ directory layout
│
├── svm-rs-builds/        ← build.rs helper
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs        ← SolcVersion::new().require("0.8.26").get_path()
│
└── svm-rs-cli/           ← Binary
    ├── Cargo.toml
    └── src/
        └── main.rs       ← clap CLI
```

---

### 21.2 `Cargo.toml` — `svm-rs` core

```toml
# crates/svm-rs/Cargo.toml
[package]
name         = "svm-rs"
version      = "1.0.0"
edition      = "2021"
rust-version = "1.76"
description  = "Solidity compiler version manager"
license      = "MIT OR Apache-2.0"
repository   = "https://github.com/wikialisalabs/svm-rs"
keywords     = ["solidity", "solc", "compiler", "version-manager", "ethereum"]

[dependencies]
# HTTP client (async)
reqwest     = { version = "0.12", features = ["json", "stream"], default-features = false }
tokio       = { workspace = true, features = ["rt-multi-thread", "macros", "fs", "io-util"] }

# SHA-256 verify
sha2        = { workspace = true }
hex         = { workspace = true }

# Semver parsing
semver      = { version = "1.0", features = ["serde"] }

# JSON parsing (list.json)
serde       = { workspace = true }
serde_json  = { workspace = true }

# Error handling
thiserror   = { workspace = true }

# Filesystem + paths
dirs        = { version = "5" }        # ~/.svm/ platform-agnostic

# Compression (.tar.gz trên Linux)
flate2      = { version = "1",  optional = true }
tar         = { version = "0.4", optional = true }

# Progress bar (CLI only)
indicatif   = { version = "0.17", optional = true }

[features]
default   = ["rustls-tls"]
rustls-tls = ["reqwest/rustls-tls"]    # TLS thuần Rust, không cần OpenSSL
native-tls = ["reqwest/native-tls"]    # Fallback nếu cần platform TLS
archive   = ["dep:flate2", "dep:tar"]  # Giải nén .tar.gz (Linux binary)
progress  = ["dep:indicatif"]          # Progress bar cho CLI
```

---

### 21.3 `platform.rs` — Phát hiện nền tảng

```rust
// crates/svm-rs/src/platform.rs

/// Nền tảng mục tiêu — map tới đường dẫn download trên binaries.soliditylang.org.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Platform {
    LinuxAmd64,
    LinuxAarch64,
    MacOsAmd64,
    MacOsAarch64,   // Rosetta 2 fallback → MacOsAmd64
    WindowsAmd64,
}

impl Platform {
    /// Phát hiện platform hiện tại tại compile time.
    pub const fn current() -> Self {
        #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
        return Platform::LinuxAmd64;
        #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
        return Platform::LinuxAarch64;
        #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
        return Platform::MacOsAmd64;
        #[cfg(all(target_os = "macos", target_arch = "aarch64"))]
        return Platform::MacOsAarch64;
        #[cfg(all(target_os = "windows", target_arch = "x86_64"))]
        return Platform::WindowsAmd64;
        // Fallback cho CI unknown platforms
        #[allow(unreachable_code)]
        Platform::LinuxAmd64
    }

    /// Tiền tố URL trong binaries.soliditylang.org.
    pub const fn url_prefix(self) -> &'static str {
        match self {
            Platform::LinuxAmd64   => "linux-amd64",
            Platform::LinuxAarch64 => "linux-aarch64",
            // macOS aarch64 dùng amd64 binary qua Rosetta 2
            Platform::MacOsAmd64 | Platform::MacOsAarch64 => "macosx-amd64",
            Platform::WindowsAmd64 => "windows-amd64",
        }
    }

    /// Extension file binary.
    pub const fn binary_extension(self) -> &'static str {
        match self {
            Platform::WindowsAmd64 => ".exe",
            _ => "",
        }
    }
}
```

---

### 21.4 `releases.rs` — Fetch List.json

```rust
// crates/svm-rs/src/releases.rs

use semver::Version;
use serde::{Deserialize, Serialize};
use crate::Platform;

const LIST_JSON_BASE: &str = "https://binaries.soliditylang.org";

/// Một bản release solc.
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Release {
    /// Tên file binary (e.g. "solc-linux-amd64-v0.8.26+commit.8a97fa7a")
    pub path:    String,
    /// SHA-256 checksum của binary
    pub sha256:  String,
    /// URL download đầy đủ
    #[serde(skip)]
    pub url:     String,
}

/// Toàn bộ list.json từ binaries.soliditylang.org.
#[derive(Debug, Deserialize)]
pub struct ReleaseList {
    pub builds:   Vec<BuildEntry>,
    pub releases: std::collections::HashMap<String, String>,
}

#[derive(Debug, Deserialize)]
pub struct BuildEntry {
    pub version:   String,
    pub path:      String,
    pub sha256:    String,
    #[serde(rename = "longVersion")]
    pub long_version: String,
}

impl ReleaseList {
    /// Tải list.json từ remote.
    pub async fn fetch(platform: Platform) -> Result<Self, crate::SvmError> {
        let url = format!("{}/{}/list.json", LIST_JSON_BASE, platform.url_prefix());
        let resp = reqwest::get(&url).await?.error_for_status()?;
        let list: Self = resp.json().await?;
        Ok(list)
    }

    /// Lấy Release cho một version cụ thể.
    pub fn get_release(&self, version: &Version, platform: Platform) -> Option<Release> {
        let version_str = version.to_string();
        self.builds.iter()
            .find(|b| b.version == version_str)
            .map(|b| Release {
                path:   b.path.clone(),
                sha256: b.sha256.clone(),
                url:    format!(
                    "{}/{}/{}",
                    LIST_JSON_BASE,
                    platform.url_prefix(),
                    b.path
                ),
            })
    }

    /// Danh sách tất cả versions available (sorted giảm dần).
    pub fn available_versions(&self) -> Vec<Version> {
        let mut versions: Vec<Version> = self.builds.iter()
            .filter_map(|b| Version::parse(&b.version).ok())
            .collect();
        versions.sort_unstable_by(|a, b| b.cmp(a));
        versions
    }
}
```

---

### 21.5 `install.rs` — Download + Verify Pipeline

```rust
// crates/svm-rs/src/install.rs

use std::path::{Path, PathBuf};
use sha2::{Sha256, Digest};
use semver::Version;
use crate::{Platform, Release, SvmError, paths};

/// Tải về và cài đặt solc binary.
///
/// Pipeline:
/// 1. Fetch list.json → tìm SHA-256 expected
/// 2. Download binary → stream vào temp file
/// 3. Verify SHA-256: hash(downloaded) == expected
/// 4. Set executable permission (Unix)
/// 5. Atomic move: temp → final path
pub async fn install(
    version:  &Version,
    platform: Platform,
    svm_home: &Path,
) -> Result<PathBuf, SvmError> {
    // 1. Fetch release metadata
    let list    = crate::releases::ReleaseList::fetch(platform).await?;
    let release = list.get_release(version, platform)
        .ok_or_else(|| SvmError::VersionNotFound(version.clone()))?;

    // 2. Download với progress tracking
    let temp_path = svm_home.join(format!(".tmp-solc-{}", version));
    download_to_file(&release.url, &temp_path).await?;

    // 3. Verify SHA-256
    verify_sha256(&temp_path, &release.sha256)?;

    // 4. Set executable (Unix only)
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = std::fs::metadata(&temp_path)?.permissions();
        perms.set_mode(0o755);
        std::fs::set_permissions(&temp_path, perms)?;
    }

    // 5. Atomic rename
    let final_path = paths::solc_path(svm_home, version);
    std::fs::create_dir_all(final_path.parent().unwrap())?;
    std::fs::rename(&temp_path, &final_path)?;

    Ok(final_path)
}

/// Download file theo stream — tránh load toàn bộ vào RAM.
async fn download_to_file(url: &str, dest: &Path) -> Result<(), SvmError> {
    use tokio::io::AsyncWriteExt;
    use futures_util::StreamExt;

    let response = reqwest::get(url).await?.error_for_status()?;
    let mut file  = tokio::fs::File::create(dest).await?;
    let mut stream = response.bytes_stream();

    while let Some(chunk) = stream.next().await {
        file.write_all(&chunk?).await?;
    }
    file.flush().await?;
    Ok(())
}

/// Verify SHA-256 của file đã download.
///
/// # Errors
/// `SvmError::ChecksumMismatch` nếu hash không khớp.
pub fn verify_sha256(path: &Path, expected_hex: &str) -> Result<(), SvmError> {
    // Đọc file và tính hash theo chunk (tránh OOM với file lớn)
    let mut file   = std::fs::File::open(path)?;
    let mut hasher = Sha256::new();
    std::io::copy(&mut file, &mut hasher)?;
    let hash   = hasher.finalize();
    let actual = hex::encode(hash);

    // So sánh constant-time (tránh timing attack)
    if !constant_time_eq(actual.as_bytes(), expected_hex.as_bytes()) {
        return Err(SvmError::ChecksumMismatch {
            expected: expected_hex.to_string(),
            actual,
        });
    }
    Ok(())
}

/// So sánh hai byte slices trong constant time.
fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() { return false; }
    a.iter().zip(b.iter()).fold(0u8, |acc, (x, y)| acc | (x ^ y)) == 0
}
```

---

### 21.6 `error.rs` — SvmError

```rust
// crates/svm-rs/src/error.rs

use semver::Version;

/// Tất cả lỗi có thể xảy ra trong svm-rs.
#[derive(Debug, thiserror::Error)]
pub enum SvmError {
    #[error("solc version {0} not found in release list")]
    VersionNotFound(Version),

    #[error("checksum mismatch: expected {expected}, got {actual}")]
    ChecksumMismatch { expected: String, actual: String },

    #[error("network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("io error: {0}")]
    Io(#[from] std::io::Error),

    #[error("json parse error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("semver parse error: {0}")]
    Semver(#[from] semver::Error),

    #[error("solc not installed: {0} — run `svm install {0}`")]
    NotInstalled(Version),

    #[error("unsupported platform: {os}/{arch}")]
    UnsupportedPlatform { os: String, arch: String },
}
```

---

### 21.7 `SvmManager` — Public API

```rust
// crates/svm-rs/src/manager.rs

use semver::Version;
use std::path::{Path, PathBuf};
use crate::{Platform, SvmError, paths, releases, install};

/// Entry point chính của svm-rs.
///
/// # Examples
/// ```rust,no_run
/// use svm_rs::SvmManager;
///
/// #[tokio::main]
/// async fn main() -> Result<(), svm_rs::SvmError> {
///     let svm = SvmManager::new()?;
///
///     // Liệt kê phiên bản có thể cài
///     let versions = svm.list_available().await?;
///     println!("Latest: {}", versions[0]);
///
///     // Cài đặt (nếu chưa có)
///     svm.install(&"0.8.26".parse()?).await?;
///
///     // Lấy path để gọi trực tiếp
///     let path = svm.get_path(&"0.8.26".parse()?)?;
///     println!("solc path: {}", path.display());
///
///     Ok(())
/// }
/// ```
pub struct SvmManager {
    home:     PathBuf,
    platform: Platform,
}

impl SvmManager {
    /// Tạo manager với home directory mặc định (`~/.svm`).
    pub fn new() -> Result<Self, SvmError> {
        let home = dirs::home_dir()
            .ok_or_else(|| SvmError::Io(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "cannot find home directory",
            )))?
            .join(".svm");
        std::fs::create_dir_all(&home)?;
        Ok(Self { home, platform: Platform::current() })
    }

    /// Tạo manager với home directory tùy chỉnh (dùng trong tests).
    pub fn with_home(home: impl Into<PathBuf>) -> Result<Self, SvmError> {
        let home = home.into();
        std::fs::create_dir_all(&home)?;
        Ok(Self { home, platform: Platform::current() })
    }

    /// Liệt kê tất cả versions có thể cài (từ binaries.soliditylang.org).
    pub async fn list_available(&self) -> Result<Vec<Version>, SvmError> {
        let list = releases::ReleaseList::fetch(self.platform).await?;
        Ok(list.available_versions())
    }

    /// Liệt kê các versions đã cài trên máy.
    pub fn list_installed(&self) -> Result<Vec<Version>, SvmError> {
        let mut versions = Vec::new();
        for entry in std::fs::read_dir(&self.home)? {
            let entry = entry?;
            let name  = entry.file_name();
            let s     = name.to_string_lossy();
            // Folder structure: ~/.svm/0.8.26/solc-0.8.26
            if let Ok(v) = Version::parse(s.trim_start_matches('v')) {
                if entry.path().is_dir() {
                    versions.push(v);
                }
            }
        }
        versions.sort_unstable_by(|a, b| b.cmp(a));
        Ok(versions)
    }

    /// Cài đặt một phiên bản (download + verify + install).
    /// Idempotent: không làm gì nếu đã cài.
    pub async fn install(&self, version: &Version) -> Result<PathBuf, SvmError> {
        let path = paths::solc_path(&self.home, version);
        if path.exists() {
            return Ok(path); // Đã có rồi
        }
        install::install(version, self.platform, &self.home).await
    }

    /// Lấy path của solc binary.
    /// Trả lỗi nếu chưa cài.
    pub fn get_path(&self, version: &Version) -> Result<PathBuf, SvmError> {
        let path = paths::solc_path(&self.home, version);
        if path.exists() {
            Ok(path)
        } else {
            Err(SvmError::NotInstalled(version.clone()))
        }
    }

    /// Xóa một phiên bản đã cài.
    pub fn remove(&self, version: &Version) -> Result<(), SvmError> {
        let dir = self.home.join(version.to_string());
        if dir.exists() {
            std::fs::remove_dir_all(dir)?;
        }
        Ok(())
    }
}
```

---

### 21.8 `svm-rs-builds` — Dùng trong `build.rs`

```rust
// crates/svm-rs-builds/src/lib.rs

//! Helper cho `build.rs` — tự động download đúng phiên bản solc khi build.
//!
//! # Usage trong `build.rs`
//! ```rust,no_run
//! // build.rs của một project cần compile Solidity
//! fn main() {
//!     // Đảm bảo solc 0.8.26 có mặt; nếu chưa có thì download + verify
//!     let solc_path = svm_rs_builds::prepare_solc("0.8.26")
//!         .expect("failed to prepare solc");
//!
//!     // In ra biến môi trường để main code dùng
//!     println!("cargo:rustc-env=SOLC_PATH={}", solc_path.display());
//!     println!("cargo:rerun-if-changed=contracts/");
//! }
//! ```

use std::path::PathBuf;

/// Đảm bảo solc version được cài sẵn và trả về path.
///
/// Chạy bất đồng bộ nhưng block trong build.rs context.
pub fn prepare_solc(version: &str) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let svm = svm_rs::SvmManager::new()?;
        let v   = version.parse()?;
        svm.install(&v).await
    })
}

/// Giống `prepare_solc` nhưng dùng SVM_HOME từ biến môi trường (CI-friendly).
pub fn prepare_solc_env(version: &str) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let home = std::env::var("SVM_HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|_| dirs::home_dir().unwrap().join(".svm"));

    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let svm = svm_rs::SvmManager::with_home(home)?;
        let v   = version.parse()?;
        svm.install(&v).await
    })
}
```

---

### 21.9 CLI (`svm-rs-cli`) — clap v4

```rust
// crates/svm-rs-cli/src/main.rs

use clap::{Parser, Subcommand};
use semver::Version;
use svm_rs::SvmManager;

#[derive(Parser)]
#[command(
    name    = "svm",
    version = env!("CARGO_PKG_VERSION"),
    about   = "Solidity Compiler Version Manager — wikialisalabs",
    long_about = "Download, verify, and manage multiple Solidity compiler versions."
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Liệt kê các phiên bản có thể cài
    #[command(alias = "ls-remote")]
    List,

    /// Liệt kê các phiên bản đã cài
    #[command(alias = "ls")]
    Installed,

    /// Cài đặt một phiên bản
    Install {
        /// Phiên bản cần cài (e.g. 0.8.26)
        version: String,
    },

    /// Xóa một phiên bản
    Remove {
        version: String,
    },

    /// Xác minh checksum của phiên bản đã cài
    Verify {
        version: String,
    },

    /// Chạy solc với phiên bản cụ thể
    Exec {
        /// Phiên bản cần dùng
        version: String,
        /// Tất cả arguments sau `--` truyền thẳng vào solc
        #[arg(last = true)]
        args: Vec<String>,
    },
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let cli = Cli::parse();
    let svm = SvmManager::new()?;

    match cli.command {
        Commands::List => {
            let versions = svm.list_available().await?;
            for v in versions.iter().take(20) {
                println!("{v}");
            }
            if versions.len() > 20 {
                println!("... và {} phiên bản khác", versions.len() - 20);
            }
        }

        Commands::Installed => {
            let versions = svm.list_installed()?;
            if versions.is_empty() {
                println!("Chưa cài phiên bản nào. Dùng `svm install <version>`");
            } else {
                for v in &versions { println!("{v}"); }
            }
        }

        Commands::Install { version } => {
            let v: Version = version.parse()?;
            let path = svm.install(&v).await?;
            println!("✅ Đã cài solc {v} tại {}", path.display());
        }

        Commands::Remove { version } => {
            let v: Version = version.parse()?;
            svm.remove(&v)?;
            println!("🗑️  Đã xóa solc {v}");
        }

        Commands::Verify { version } => {
            let v = version.parse::<Version>()?;
            let path = svm.get_path(&v)?;
            // Re-download list.json và verify checksum
            let list = svm_rs::releases::ReleaseList::fetch(
                svm_rs::Platform::current()
            ).await?;
            let release = list.get_release(&v, svm_rs::Platform::current())
                .ok_or_else(|| eyre::eyre!("version not found in release list"))?;
            svm_rs::install::verify_sha256(&path, &release.sha256)?;
            println!("✅ SHA-256 hợp lệ cho solc {v}");
        }

        Commands::Exec { version, args } => {
            let v    = version.parse::<Version>()?;
            let path = svm.get_path(&v)?;
            let status = std::process::Command::new(path)
                .args(&args)
                .status()?;
            std::process::exit(status.code().unwrap_or(1));
        }
    }

    Ok(())
}
```

---

## 22. Giai đoạn 3 Chi tiết: `alloy` — Provider, Transport & Contract Binding

> **Mục tiêu:** Meta-crate entry point duy nhất cho developer — Provider trait với Tower middleware, WebSocket subscriptions, và Contract ABI binding thông qua `sol!()` macro.

---

### 22.1 Cấu trúc Workspace `alloy`

```
wikialisalabs-evm/crates/
├── alloy-network/            ← Network trait + Ethereum impl
├── alloy-transport/          ← Tower service + BoxTransport
├── alloy-transport-http/     ← HTTP transport (reqwest)
├── alloy-transport-ws/       ← WebSocket transport (tokio-tungstenite)
├── alloy-transport-ipc/      ← IPC transport (Unix domain socket)
├── alloy-rpc-types/          ← JSON-RPC request/response types
├── alloy-rpc-client/         ← Low-level JSON-RPC 2.0 client (batch support)
├── alloy-provider/           ← Provider trait + ProviderBuilder + fillers
├── alloy-pubsub/             ← eth_subscribe streams (newHeads, logs, pendingTx)
├── alloy-signer/             ← Signer trait + EthereumWallet
├── alloy-signer-local/       ← PrivateKeySigner (k256)
├── alloy-contract/           ← Contract deploy/call/send (ABI binding)
├── alloy-node-bindings/      ← Anvil/Geth process spawn (test helpers)
└── alloy/                    ← Meta-crate: re-export all + unified feature flags
```

---

### 22.2 `alloy-network` — Abstraction Layer cho Multi-chain

```rust
// crates/alloy-network/src/lib.rs

use alloy_primitives::{Address, B256, Bytes, U256};

/// Network trait — định nghĩa kiểu transaction và receipt cho một blockchain.
///
/// Implement trait này để thêm support cho bất kỳ EVM-compatible chain nào.
///
/// # Implemented networks
/// - `Ethereum` — mainnet, testnets
/// - `Optimism` — OP Stack chains (qua `op-alloy`)
/// - `Wikialisalabs` — custom L1 (future)
pub trait Network: Sized + Send + Sync + 'static {
    /// Kiểu transaction request (chưa ký).
    type TransactionRequest: TransactionBuilder<Self> + Default + Clone + Send + Sync;

    /// Kiểu transaction đã ký và serialized (dùng để broadcast).
    type TransactionEnvelope: TransactionEnvelope + Send + Sync;

    /// Kiểu transaction trong block (response từ RPC).
    type TransactionResponse: TransactionResponse + Send + Sync;

    /// Kiểu receipt.
    type ReceiptResponse: ReceiptResponse + Send + Sync;

    /// Kiểu header block.
    type HeaderResponse: HeaderResponse + Send + Sync;

    /// Kiểu block đầy đủ.
    type BlockResponse: BlockResponse<Self> + Send + Sync;
}

/// Transaction builder — populate các fields cần thiết trước khi ký.
pub trait TransactionBuilder<N: Network>: Default + Sized {
    fn set_from(&mut self, from: Address);
    fn set_to(&mut self, to: Address);
    fn set_value(&mut self, value: U256);
    fn set_input(&mut self, input: Bytes);
    fn set_nonce(&mut self, nonce: u64);
    fn set_gas_limit(&mut self, gas_limit: u64);
    fn set_max_fee_per_gas(&mut self, max_fee: u128);
    fn set_max_priority_fee_per_gas(&mut self, priority_fee: u128);
    fn set_chain_id(&mut self, chain_id: u64);
    fn set_access_list(&mut self, list: alloy_eips::eip2930::AccessList);
}

/// Ethereum network implementation.
pub struct Ethereum;

impl Network for Ethereum {
    type TransactionRequest  = alloy_rpc_types::TransactionRequest;
    type TransactionEnvelope = alloy_consensus::TxEnvelope;
    type TransactionResponse = alloy_rpc_types::Transaction;
    type ReceiptResponse     = alloy_rpc_types::TransactionReceipt;
    type HeaderResponse      = alloy_rpc_types::Header;
    type BlockResponse       = alloy_rpc_types::Block;
}
```

---

### 22.3 `alloy-transport` — Tower Middleware Stack

```rust
// crates/alloy-transport/src/lib.rs

use std::future::Future;
use tower::Service;

/// Transport — một Tower Service gửi JSON-RPC requests.
///
/// Được clone và wrap bởi các middleware layers.
pub trait Transport:
    Clone
    + Send
    + Sync
    + Service<
        alloy_json_rpc::RequestPacket,
        Response = alloy_json_rpc::ResponsePacket,
        Error    = TransportError,
        Future   = TransportFut,
    >
    + 'static
{}

pub type TransportFut = std::pin::Pin<
    Box<dyn Future<Output = Result<alloy_json_rpc::ResponsePacket, TransportError>> + Send>
>;

/// Boxed transport — type-erased cho dynamic dispatch.
pub type BoxTransport = tower::util::BoxCloneService<
    alloy_json_rpc::RequestPacket,
    alloy_json_rpc::ResponsePacket,
    TransportError,
>;

/// Lỗi transport.
#[derive(Debug, thiserror::Error)]
pub enum TransportError {
    #[error("HTTP error {status}: {body}")]
    Http { status: u16, body: String },

    #[error("WebSocket error: {0}")]
    WebSocket(String),

    #[error("JSON serialization error: {0}")]
    Ser(#[from] serde_json::Error),

    #[error("connection closed")]
    Closed,

    #[error("request timed out after {secs}s")]
    Timeout { secs: u64 },
}
```

#### Tower Middleware Stack — Retry + Rate Limit + Timeout

```rust
// crates/alloy-transport/src/layers.rs

use tower::{ServiceBuilder, timeout::TimeoutLayer, retry::RetryLayer};
use std::time::Duration;

/// Xây dựng transport với đầy đủ middleware.
///
/// # Stack (từ ngoài vào trong):
/// ```text
/// Request
///   → Timeout (10s mặc định)
///   → RetryLayer (3 lần, exponential backoff)
///   → RateLimit (1000 req/s)
///   → Inner Transport (HTTP/WS/IPC)
/// ```
pub fn build_transport_stack<T: Transport>(
    inner: T,
    config: TransportConfig,
) -> impl Transport {
    ServiceBuilder::new()
        .layer(TimeoutLayer::new(config.request_timeout))
        .layer(RetryLayer::new(RetryPolicy {
            max_retries: config.max_retries,
            backoff:     ExponentialBackoff::new(Duration::from_millis(100)),
        }))
        .layer(tower::limit::RateLimitLayer::new(
            config.rate_limit_rps,
            Duration::from_secs(1),
        ))
        .service(inner)
}

/// Cấu hình cho transport stack.
pub struct TransportConfig {
    /// Timeout cho mỗi request (default: 10s)
    pub request_timeout: Duration,
    /// Số lần retry khi gặp lỗi tạm thời (default: 3)
    pub max_retries:     u32,
    /// Rate limit requests/second (default: 1000)
    pub rate_limit_rps:  u64,
}

impl Default for TransportConfig {
    fn default() -> Self {
        Self {
            request_timeout: Duration::from_secs(10),
            max_retries:     3,
            rate_limit_rps:  1000,
        }
    }
}

/// Retry policy — retry khi gặp lỗi network tạm thời.
struct RetryPolicy { max_retries: u32, backoff: ExponentialBackoff }

impl<B: Clone> tower::retry::Policy<alloy_json_rpc::RequestPacket, B, TransportError>
    for RetryPolicy
{
    type Future = std::future::Ready<Self>;

    fn retry(&self, _req: &alloy_json_rpc::RequestPacket, result: Result<&B, &TransportError>)
        -> Option<Self::Future>
    {
        match result {
            Err(TransportError::Http { status, .. }) if *status == 429 || *status >= 500 => {
                // Retry 429 Too Many Requests và 5xx Server Errors
                Some(std::future::ready(Self {
                    max_retries: self.max_retries - 1,
                    backoff: self.backoff.clone(),
                }))
            }
            Err(TransportError::Closed) => {
                Some(std::future::ready(self.clone()))
            }
            _ => None,
        }
    }

    fn clone_request(&self, req: &alloy_json_rpc::RequestPacket) -> Option<alloy_json_rpc::RequestPacket> {
        Some(req.clone())
    }
}
```

---

### 22.4 `alloy-provider` — Provider Trait & ProviderBuilder

```rust
// crates/alloy-provider/src/provider.rs

use alloy_network::Network;
use alloy_primitives::{Address, B256, Bytes, U256};
use alloy_rpc_types::{Block, BlockId, BlockNumberOrTag, FeeHistory, Filter, Log, SyncStatus};
use alloy_transport::Transport;

/// Provider trait — giao diện tương tác với Ethereum node.
///
/// Blanket implementation cho bất kỳ `T: ProviderCall<N>`.
/// Developer không implement trait này trực tiếp — dùng `ProviderBuilder`.
#[async_trait::async_trait]
pub trait Provider<N: Network = Ethereum>: Send + Sync + 'static {
    // --- Block ---
    async fn get_block_number(&self) -> ProviderResult<u64>;
    async fn get_block(&self, id: BlockId, full: bool) -> ProviderResult<Option<N::BlockResponse>>;
    async fn get_block_by_hash(&self, hash: B256, full: bool) -> ProviderResult<Option<N::BlockResponse>>;

    // --- Account ---
    async fn get_balance(&self, address: Address) -> ProviderResult<U256>;
    async fn get_transaction_count(&self, address: Address) -> ProviderResult<u64>;
    async fn get_code(&self, address: Address) -> ProviderResult<Bytes>;
    async fn get_storage_at(&self, address: Address, slot: B256) -> ProviderResult<B256>;

    // --- Transaction ---
    async fn send_raw_transaction(&self, tx: &[u8]) -> ProviderResult<PendingTransactionBuilder<N>>;
    async fn get_transaction_by_hash(&self, hash: B256) -> ProviderResult<Option<N::TransactionResponse>>;
    async fn get_transaction_receipt(&self, hash: B256) -> ProviderResult<Option<N::ReceiptResponse>>;

    // --- Gas ---
    async fn estimate_gas(&self, tx: &N::TransactionRequest) -> ProviderResult<u64>;
    async fn get_gas_price(&self) -> ProviderResult<u128>;
    async fn get_max_priority_fee_per_gas(&self) -> ProviderResult<u128>;
    async fn get_fee_history(&self, block_count: u64, newest: BlockNumberOrTag, reward_percentiles: &[f64]) -> ProviderResult<FeeHistory>;

    // --- Logs ---
    async fn get_logs(&self, filter: &Filter) -> ProviderResult<Vec<Log>>;

    // --- Call (simulation) ---
    async fn call(&self, tx: &N::TransactionRequest) -> ProviderResult<Bytes>;
    async fn call_at(&self, tx: &N::TransactionRequest, block: BlockId) -> ProviderResult<Bytes>;

    // --- Chain ---
    async fn get_chain_id(&self) -> ProviderResult<u64>;
    async fn syncing(&self) -> ProviderResult<SyncStatus>;
}

pub type ProviderResult<T> = Result<T, ProviderError>;

#[derive(Debug, thiserror::Error)]
pub enum ProviderError {
    #[error("transport error: {0}")]
    Transport(#[from] alloy_transport::TransportError),
    #[error("JSON-RPC error {code}: {message}")]
    JsonRpc { code: i64, message: String },
    #[error("nonce too low: expected {expected}, got {actual}")]
    NonceTooLow { expected: u64, actual: u64 },
}
```

#### `ProviderBuilder` — Fluent Configuration

```rust
// crates/alloy-provider/src/builder.rs

use alloy_network::{Ethereum, Network};
use alloy_transport::{BoxTransport, Transport};
use alloy_signer::EthereumWallet;
use url::Url;

/// Builder fluent để tạo Provider với middleware chain.
///
/// # Fillers
/// "Fillers" tự động điền các fields còn thiếu trong TransactionRequest:
/// - `NonceFiller`    — tự fetch + tăng nonce
/// - `GasFiller`      — tự estimate gas + set EIP-1559 fees
/// - `ChainIdFiller`  — tự fetch chain ID
///
/// # Examples
///
/// **HTTP Provider cơ bản:**
/// ```rust
/// let provider = ProviderBuilder::new()
///     .on_http("https://eth-mainnet.example.com".parse()?);
/// ```
///
/// **Với Wallet (ký + gửi transaction):**
/// ```rust
/// let signer = PrivateKeySigner::from_bytes(&private_key_bytes)?;
/// let wallet = EthereumWallet::from(signer);
///
/// let provider = ProviderBuilder::new()
///     .with_recommended_fillers()  // NonceFiller + GasFiller + ChainIdFiller
///     .wallet(wallet)
///     .on_http(rpc_url);
/// ```
///
/// **WebSocket:**
/// ```rust
/// let provider = ProviderBuilder::new()
///     .with_recommended_fillers()
///     .on_ws(WsConnect::new("wss://eth-mainnet.example.com")).await?;
/// ```
pub struct ProviderBuilder<L = Identity, N = Ethereum> {
    layer:   L,
    network: PhantomData<N>,
}

impl ProviderBuilder {
    pub fn new() -> Self {
        Self { layer: Identity, network: PhantomData }
    }
}

impl<L, N: Network> ProviderBuilder<L, N> {
    /// Thêm tất cả fillers được khuyến nghị (Nonce + Gas + ChainId).
    pub fn with_recommended_fillers(self) -> ProviderBuilder<
        stack!(NonceFiller, GasFiller, ChainIdFiller, L), N
    > {
        self.layer(ChainIdFiller::default())
            .layer(GasFiller::default())
            .layer(NonceFiller::default())
    }

    /// Thêm wallet để ký tự động.
    pub fn wallet(self, wallet: EthereumWallet)
        -> ProviderBuilder<stack!(WalletFiller, L), N>
    {
        self.layer(WalletFiller::new(wallet))
    }

    /// Build với HTTP transport.
    pub fn on_http(self, url: Url) -> impl Provider<N> {
        let transport = alloy_transport_http::Http::new(url);
        self.build_with_transport(transport)
    }

    /// Build với WebSocket transport (async).
    pub async fn on_ws(self, conn: alloy_transport_ws::WsConnect)
        -> Result<impl Provider<N>, alloy_transport::TransportError>
    {
        let transport = alloy_transport_ws::WsConnect::connect(conn).await?;
        Ok(self.build_with_transport(transport))
    }

    /// Build với IPC transport (Linux/macOS).
    pub async fn on_ipc(self, path: impl AsRef<std::path::Path>)
        -> Result<impl Provider<N>, alloy_transport::TransportError>
    {
        let transport = alloy_transport_ipc::IpcConnect::connect(path).await?;
        Ok(self.build_with_transport(transport))
    }
}
```

---

### 22.5 `alloy-pubsub` — WebSocket Subscriptions

```rust
// crates/alloy-pubsub/src/lib.rs

use alloy_primitives::{B256, Log};
use alloy_rpc_types::{Header, Transaction};
use futures_core::Stream;

/// Subscription stream cho các events real-time từ Ethereum node.
pub trait PubSubProvider: Provider {
    /// Subscribe vào stream block headers mới.
    ///
    /// # Examples
    /// ```rust
    /// use futures_util::StreamExt;
    ///
    /// let mut stream = provider.subscribe_blocks().await?;
    /// while let Some(header) = stream.next().await {
    ///     println!("New block #{}: {}", header.number, header.hash);
    /// }
    /// ```
    async fn subscribe_blocks(&self)
        -> ProviderResult<impl Stream<Item = Header> + Send>;

    /// Subscribe vào stream logs theo filter.
    ///
    /// # Examples
    /// ```rust
    /// use alloy_rpc_types::Filter;
    /// use alloy_primitives::address;
    ///
    /// let filter = Filter::new()
    ///     .address(address!("0xUniswapV2..."))
    ///     .event("Swap(address,uint256,uint256,uint256,uint256,address)");
    ///
    /// let mut stream = provider.subscribe_logs(&filter).await?;
    /// while let Some(log) = stream.next().await {
    ///     println!("Swap event at tx {}", log.transaction_hash.unwrap());
    /// }
    /// ```
    async fn subscribe_logs(&self, filter: &Filter)
        -> ProviderResult<impl Stream<Item = Log> + Send>;

    /// Subscribe vào stream pending transactions.
    async fn subscribe_pending_transactions(&self)
        -> ProviderResult<impl Stream<Item = B256> + Send>;

    /// Unsubscribe (hủy subscription).
    async fn unsubscribe(&self, id: alloy_primitives::U256) -> ProviderResult<bool>;
}
```

---

### 22.6 `alloy-signer` — Trait & EthereumWallet

```rust
// crates/alloy-signer/src/lib.rs

use alloy_primitives::{Address, B256, Bytes};

/// Trait ký transaction và message.
///
/// Implement cho: local key, hardware wallet (Ledger, Trezor), AWS KMS,
/// WebAuthn/Passkey (AXIO Vault), multi-sig.
#[async_trait::async_trait]
pub trait Signer: Send + Sync {
    /// Ký một raw message hash (32 bytes).
    async fn sign_hash(&self, hash: &B256) -> SignerResult<Signature>;

    /// Ký một typed data (EIP-712).
    async fn sign_typed_data<T: alloy_sol_types::SolStruct + Send + Sync>(
        &self,
        payload: &T,
        domain: &alloy_sol_types::Eip712Domain,
    ) -> SignerResult<Signature> {
        let hash = payload.eip712_signing_hash(domain);
        self.sign_hash(&hash).await
    }

    /// Địa chỉ Ethereum tương ứng với key.
    fn address(&self) -> Address;

    /// Chain ID mà signer này gắn với (None = không giới hạn).
    fn chain_id(&self) -> Option<u64>;
}

/// Chữ ký ECDSA secp256k1 — 65 bytes (r, s, v).
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Signature {
    pub r: alloy_primitives::B256,
    pub s: alloy_primitives::B256,
    pub v: bool,  // recovery bit
}

impl Signature {
    /// Recover địa chỉ từ signature và message hash.
    pub fn recover_address(&self, hash: &B256) -> SignerResult<Address> {
        use k256::ecdsa::{RecoveryId, VerifyingKey};
        let rec_id = RecoveryId::from_byte(self.v as u8)
            .ok_or(SignerError::InvalidRecoveryId)?;
        let sig = k256::ecdsa::Signature::from_scalars(
            k256::FieldBytes::from(self.r.0),
            k256::FieldBytes::from(self.s.0),
        )?;
        let key = VerifyingKey::recover_from_prehash(hash.as_slice(), &sig, rec_id)?;
        let point = key.to_encoded_point(false);
        let hash  = alloy_primitives::keccak256(&point.as_bytes()[1..]);
        Ok(Address::from_slice(&hash[12..]))
    }
}

pub type SignerResult<T> = Result<T, SignerError>;

#[derive(Debug, thiserror::Error)]
pub enum SignerError {
    #[error("ECDSA error: {0}")]
    Ecdsa(String),
    #[error("invalid recovery ID")]
    InvalidRecoveryId,
    #[error("hardware wallet error: {0}")]
    HardwareWallet(String),
    #[error("user rejected request")]
    UserRejected,
}
```

#### `PrivateKeySigner` — Local Key

```rust
// crates/alloy-signer-local/src/lib.rs

use alloy_primitives::{Address, B256};
use alloy_signer::{Signer, SignerError, Signature};
use k256::ecdsa::SigningKey;

/// Signer sử dụng private key lưu trong RAM.
///
/// # Security Note
/// Key được giữ unencrypted trong RAM. Cho production, dùng
/// hardware wallet hoặc AWS KMS thay thế.
///
/// # Examples
/// ```rust
/// use alloy_signer_local::PrivateKeySigner;
///
/// // Từ hex string
/// let signer: PrivateKeySigner =
///     "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80".parse()?;
///
/// // Random key (cho testing)
/// let signer = PrivateKeySigner::random();
///
/// println!("Address: {}", signer.address());
/// ```
pub struct PrivateKeySigner {
    key:      SigningKey,
    address:  Address,
    chain_id: Option<u64>,
}

impl PrivateKeySigner {
    /// Tạo signer từ raw bytes private key.
    pub fn from_bytes(bytes: &[u8; 32]) -> Result<Self, SignerError> {
        let key     = SigningKey::from_bytes(bytes.into())
            .map_err(|e| SignerError::Ecdsa(e.to_string()))?;
        let address = Self::key_to_address(&key);
        Ok(Self { key, address, chain_id: None })
    }

    /// Tạo signer ngẫu nhiên (chỉ dùng cho test).
    pub fn random() -> Self {
        let key     = SigningKey::random(&mut rand::thread_rng());
        let address = Self::key_to_address(&key);
        Self { key, address, chain_id: None }
    }

    /// Đặt chain ID (EIP-155 replay protection).
    pub fn with_chain_id(mut self, chain_id: u64) -> Self {
        self.chain_id = Some(chain_id); self
    }

    fn key_to_address(key: &SigningKey) -> Address {
        let point = key.verifying_key().to_encoded_point(false);
        let hash  = alloy_primitives::keccak256(&point.as_bytes()[1..]);
        Address::from_slice(&hash[12..])
    }
}

#[async_trait::async_trait]
impl Signer for PrivateKeySigner {
    async fn sign_hash(&self, hash: &B256) -> alloy_signer::SignerResult<Signature> {
        use k256::ecdsa::signature::hazmat::PrehashSigner;
        let (sig, rec_id) = self.key
            .sign_prehash(hash.as_slice())
            .map_err(|e| SignerError::Ecdsa(e.to_string()))?;
        Ok(Signature {
            r: B256::from_slice(&sig.r().to_bytes()),
            s: B256::from_slice(&sig.s().to_bytes()),
            v: rec_id.to_byte() != 0,
        })
    }

    fn address(&self)   -> Address    { self.address }
    fn chain_id(&self)  -> Option<u64> { self.chain_id }
}
```

---

### 22.7 `alloy-contract` — ABI-generated Contract Binding

```rust
// crates/alloy-contract/src/lib.rs

use alloy_primitives::{Address, Bytes};
use alloy_provider::Provider;
use alloy_sol_types::SolCall;

/// ContractInstance — handle để tương tác với một deployed contract.
pub struct ContractInstance<T, P: Provider<N>, N: Network = Ethereum> {
    address:  Address,
    provider: P,
    _pd: PhantomData<(T, N)>,
}

impl<T, P: Provider<N>, N: Network> ContractInstance<T, P, N> {
    pub fn new(address: Address, provider: P) -> Self {
        Self { address, provider, _pd: PhantomData }
    }

    pub fn address(&self) -> Address { self.address }
}

/// Macro tạo contract binding từ ABI inline.
///
/// # Examples
///
/// **ERC-20 Transfer:**
/// ```rust
/// use alloy::sol;
///
/// sol! {
///     #[sol(rpc)]
///     interface IERC20 {
///         function transfer(address to, uint256 amount) external returns (bool);
///         function balanceOf(address owner) external view returns (uint256);
///         event Transfer(address indexed from, address indexed to, uint256 value);
///     }
/// }
///
/// // Deploy (nếu có bytecode)
/// // let contract = IERC20::deploy(&provider).await?;
///
/// // Attach tới địa chỉ đã deploy
/// let contract = IERC20::new(
///     "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".parse()?,
///     &provider,
/// );
///
/// // Call (read-only, không tốn gas)
/// let balance = contract.balanceOf(my_address).call().await?._0;
/// println!("Balance: {} USDC", balance);
///
/// // Send (write, cần wallet)
/// let receipt = contract
///     .transfer(recipient, U256::from(1_000_000u64))
///     .send()
///     .await?
///     .get_receipt()
///     .await?;
/// println!("Tx: {}", receipt.transaction_hash);
/// ```
```

#### `PendingTransactionBuilder` — Await Transaction Confirmation

```rust
// crates/alloy-provider/src/pending_transaction.rs

use alloy_primitives::B256;

/// Handle cho một transaction đã broadcast — chờ confirmation.
pub struct PendingTransactionBuilder<N: Network> {
    provider:   Arc<dyn Provider<N>>,
    tx_hash:    B256,
    confirmations: u64,
    timeout:    Option<std::time::Duration>,
}

impl<N: Network> PendingTransactionBuilder<N> {
    /// Số block confirmations cần đợi (default: 1).
    pub fn with_required_confirmations(mut self, n: u64) -> Self {
        self.confirmations = n; self
    }

    /// Timeout tổng (default: 60s).
    pub fn with_timeout(mut self, d: std::time::Duration) -> Self {
        self.timeout = Some(d); self
    }

    /// Đợi transaction được include vào block.
    pub async fn watch(self) -> ProviderResult<B256> {
        self.get_receipt().await.map(|r| r.transaction_hash())
    }

    /// Đợi và trả về receipt đầy đủ.
    pub async fn get_receipt(self) -> ProviderResult<N::ReceiptResponse> {
        let deadline = self.timeout.map(|d| tokio::time::Instant::now() + d);
        loop {
            if let Some(d) = deadline {
                if tokio::time::Instant::now() > d {
                    return Err(ProviderError::Timeout(self.tx_hash));
                }
            }
            match self.provider.get_transaction_receipt(self.tx_hash).await? {
                Some(receipt) => return Ok(receipt),
                None => tokio::time::sleep(std::time::Duration::from_secs(1)).await,
            }
        }
    }

    pub fn tx_hash(&self) -> B256 { self.tx_hash }
}
```

---

### 22.8 Integration Test — End-to-End với Anvil

```rust
// tests/integration/send_transaction.rs
//! Integration test: gửi ETH và đợi receipt — chạy vs Anvil local node.

use alloy::{
    network::EthereumWallet,
    providers::ProviderBuilder,
    signers::local::PrivateKeySigner,
    primitives::{address, U256},
    node_bindings::Anvil,
};

#[tokio::test]
async fn test_send_eth_and_get_receipt() -> eyre::Result<()> {
    // 1. Khởi động Anvil local node
    let anvil    = Anvil::new().block_time(1).spawn();
    let rpc_url  = anvil.endpoint_url();

    // 2. Lấy account đầu tiên của Anvil (pre-funded với 10000 ETH)
    let signer: PrivateKeySigner = anvil.keys()[0].clone().into();
    let wallet   = EthereumWallet::from(signer);
    let sender   = wallet.default_signer().address();

    // 3. Build provider với wallet
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http(rpc_url);

    // 4. Build và gửi transaction
    let recipient = address!("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    let tx = alloy::rpc::types::TransactionRequest::default()
        .from(sender)
        .to(recipient)
        .value(U256::from(1_000_000_000u64)); // 1 Gwei

    let receipt = provider
        .send_transaction(tx)
        .await?
        .with_required_confirmations(1)
        .get_receipt()
        .await?;

    // 5. Assert
    assert!(receipt.status(), "Transaction should succeed");
    assert_eq!(receipt.from, sender);
    assert_eq!(
        provider.get_balance(recipient).await?,
        U256::from(1_000_000_000u64) // Kiểm tra số dư tăng đúng
    );

    Ok(())
}

#[tokio::test]
async fn test_subscribe_blocks() -> eyre::Result<()> {
    use futures_util::StreamExt;

    let anvil   = Anvil::new().block_time(1).spawn();
    let ws_url  = anvil.ws_endpoint_url();

    let provider = ProviderBuilder::new()
        .on_ws(alloy::transports::ws::WsConnect::new(ws_url))
        .await?;

    let mut stream = provider.subscribe_blocks().await?;

    // Đợi 3 blocks
    let mut count = 0;
    while let Some(header) = stream.next().await {
        count += 1;
        println!("Block #{}: {}", header.number, header.hash);
        if count >= 3 { break; }
    }
    assert_eq!(count, 3);

    Ok(())
}
```

---

### 22.9 `alloy-node-bindings` — Anvil/Geth Process Management

```rust
// crates/alloy-node-bindings/src/anvil.rs

use std::process::{Child, Command};
use url::Url;

/// Anvil local Ethereum node — dùng cho integration tests.
///
/// # Examples
/// ```rust,no_run
/// use alloy::node_bindings::Anvil;
///
/// let anvil = Anvil::new()
///     .port(8545)
///     .chain_id(31337)
///     .block_time(1)           // Mine 1 block/giây
///     .fork("https://eth-mainnet.example.com")  // Fork mainnet
///     .spawn();
///
/// println!("Anvil RPC: {}", anvil.endpoint());
/// println!("Accounts: {:?}", anvil.addresses());
/// ```
pub struct AnvilInstance {
    child:     Child,
    port:      u16,
    addresses: Vec<alloy_primitives::Address>,
    keys:      Vec<k256::SecretKey>,
    chain_id:  u64,
}

impl AnvilInstance {
    pub fn endpoint(&self) -> String {
        format!("http://localhost:{}", self.port)
    }

    pub fn endpoint_url(&self) -> Url {
        self.endpoint().parse().unwrap()
    }

    pub fn ws_endpoint(&self) -> String {
        format!("ws://localhost:{}", self.port)
    }

    pub fn ws_endpoint_url(&self) -> Url {
        self.ws_endpoint().parse().unwrap()
    }

    pub fn addresses(&self) -> &[alloy_primitives::Address] { &self.addresses }
    pub fn keys(&self)      -> &[k256::SecretKey]          { &self.keys }
    pub fn chain_id(&self)  -> u64                          { self.chain_id }
}

impl Drop for AnvilInstance {
    /// Tự động kill process khi instance bị drop.
    fn drop(&mut self) { let _ = self.child.kill(); }
}

pub struct Anvil {
    port:       Option<u16>,
    chain_id:   Option<u64>,
    block_time: Option<u64>,
    fork_url:   Option<String>,
}

impl Anvil {
    pub fn new() -> Self { Self::default() }
    pub fn port(mut self, port: u16)              -> Self { self.port = Some(port); self }
    pub fn chain_id(mut self, id: u64)            -> Self { self.chain_id = Some(id); self }
    pub fn block_time(mut self, secs: u64)        -> Self { self.block_time = Some(secs); self }
    pub fn fork(mut self, url: impl Into<String>) -> Self { self.fork_url = Some(url.into()); self }

    /// Spawn Anvil process — panic nếu `anvil` binary không có trong PATH.
    pub fn spawn(self) -> AnvilInstance {
        let port = self.port.unwrap_or(8545);
        let mut cmd = Command::new("anvil");
        cmd.arg("--port").arg(port.to_string());
        if let Some(id)   = self.chain_id  { cmd.arg("--chain-id").arg(id.to_string()); }
        if let Some(secs) = self.block_time { cmd.arg("--block-time").arg(secs.to_string()); }
        if let Some(url)  = &self.fork_url  { cmd.arg("--fork-url").arg(url); }

        let child = cmd.spawn().expect("anvil not found in PATH — install Foundry");
        // Đợi node ready
        std::thread::sleep(std::time::Duration::from_millis(500));

        AnvilInstance {
            child,
            port,
            addresses: vec![], // populate từ stdout parse
            keys:      vec![],
            chain_id:  self.chain_id.unwrap_or(31337),
        }
    }
}
```

---

## 23. Giai đoạn 4 Chi tiết: `evm2` Block-STM & `op-alloy` SQX Integration

> **Mục tiêu:** `evm2` — parallel execution engine thế hệ mới với Block-STM và ZK-IR output; `op-alloy` — bridge layer giữa Ethereum types và SEQUENTICHAIN L2 execution.

---

### 23.1 Block-STM — Parallel Execution Architecture

#### Nguyên lý hoạt động

```
Block N: [Tx0, Tx1, Tx2, Tx3, Tx4, Tx5, Tx6, Tx7]
          │
          ▼ BƯỚC 1: Optimistic Execution (song song, Rayon)
          ┌────────────────────────────────────────────┐
          │ Thread 0 │ Thread 1 │ Thread 2 │ Thread 3 │
          │ Tx0, Tx4 │ Tx1, Tx5 │ Tx2, Tx6 │ Tx3, Tx7 │
          │ (record read/write sets)                   │
          └────────────────────────────────────────────┘
          │
          ▼ BƯỚC 2: Conflict Detection
          ┌────────────────────────────────────────────┐
          │ Tx_i conflicts Tx_j iff:                   │
          │   write_set(Tx_i) ∩ read_set(Tx_j) ≠ ∅   │
          │   where i < j (earlier tx writes,          │
          │                later tx reads)             │
          └────────────────────────────────────────────┘
          │
          ▼ BƯỚC 3: Validation & Re-execution
          ┌────────────────────────────────────────────┐
          │ Conflicted txs → re-execute serially       │
          │ Non-conflicted → merge state changes ✓     │
          └────────────────────────────────────────────┘
```

#### Core Data Structures

```rust
// crates/evm2-parallel/src/stm.rs

use std::sync::{Arc, RwLock};
use hashbrown::HashMap;
use alloy_primitives::{Address, B256, U256};

/// Multi-Version Data Structure — lưu nhiều phiên bản của mỗi storage slot.
/// Key insight: mỗi version được gắn với index của tx đã write nó.
#[derive(Default)]
pub struct MultiVersionData {
    /// storage[address][slot] = Vec<(tx_index, value)> sorted by tx_index
    storage: HashMap<Address, HashMap<U256, Vec<(usize, MVValue)>>>,
}

/// Giá trị trong MVCC.
enum MVValue {
    /// Tx đã commit giá trị này
    Value(U256),
    /// Tx đã SELFDESTRUCT account
    Deleted,
    /// Tx chưa finish (đang estimate, placeholder)
    Estimate,
}

impl MultiVersionData {
    /// Đọc giá trị storage từ góc nhìn của tx_index.
    /// Trả về giá trị của tx có index lớn nhất < tx_index.
    pub fn read(&self, address: Address, slot: U256, tx_index: usize)
        -> ReadResult
    {
        let versions = match self.storage.get(&address).and_then(|m| m.get(&slot)) {
            Some(v) => v,
            None => return ReadResult::NotFound,
        };

        // Tìm version mới nhất có index < tx_index
        let pos = versions.partition_point(|(idx, _)| *idx < tx_index);
        if pos == 0 { return ReadResult::NotFound; }

        match &versions[pos - 1].1 {
            MVValue::Value(v)  => ReadResult::Value(*v, versions[pos - 1].0),
            MVValue::Estimate  => ReadResult::Blocked(versions[pos - 1].0),
            MVValue::Deleted   => ReadResult::Deleted,
        }
    }

    /// Ghi giá trị storage cho tx_index.
    pub fn write(&mut self, address: Address, slot: U256, tx_index: usize, value: U256) {
        self.storage
            .entry(address).or_default()
            .entry(slot).or_default()
            .push((tx_index, MVValue::Value(value)));
    }
}

/// Kết quả khi đọc từ MVCC.
pub enum ReadResult {
    Value(U256, usize),  // (value, written_by_tx_index)
    Blocked(usize),      // Tx đang ghi (estimate) — cần đợi
    NotFound,            // Không có version nào
    Deleted,             // Account đã bị SELFDESTRUCT
}

/// Scheduler cho Block-STM — quản lý trạng thái thực thi của từng tx.
pub struct Scheduler {
    num_txs:        usize,
    tx_status:      Vec<RwLock<TxStatus>>,
    execution_idx:  std::sync::atomic::AtomicUsize,
    validation_idx: std::sync::atomic::AtomicUsize,
}

#[derive(Clone, Debug, PartialEq, Eq)]
enum TxStatus {
    ReadyToExecute,
    Executing,
    Executed,
    Aborting,           // Cần re-execute
    ExecutedAndValidated,
}

impl Scheduler {
    pub fn new(num_txs: usize) -> Self {
        Self {
            num_txs,
            tx_status: (0..num_txs).map(|_| RwLock::new(TxStatus::ReadyToExecute)).collect(),
            execution_idx:  std::sync::atomic::AtomicUsize::new(0),
            validation_idx: std::sync::atomic::AtomicUsize::new(0),
        }
    }

    /// Lấy tx tiếp theo cần execute.
    pub fn next_task(&self) -> Option<Task> {
        let exec_idx = self.execution_idx.load(std::sync::atomic::Ordering::Acquire);
        if exec_idx < self.num_txs {
            Some(Task::Execute(exec_idx))
        } else {
            let val_idx = self.validation_idx.load(std::sync::atomic::Ordering::Acquire);
            if val_idx < self.num_txs {
                Some(Task::Validate(val_idx))
            } else {
                None // Tất cả done
            }
        }
    }
}

/// Task cho một worker thread.
pub enum Task {
    Execute(usize),   // Execute tx tại index này
    Validate(usize),  // Validate tx tại index này
}
```

---

### 23.2 ZK-IR — Intermediate Representation cho ZK Circuits

```rust
// crates/evm2-ir/src/lib.rs

use alloy_primitives::{Address, B256, U256, Bytes};

/// ZK-friendly Intermediate Representation của một EVM execution.
///
/// Dùng để feed vào Halo2 / Plonky2 circuit builder trong VERACIPHERS ($VRQ).
/// Thiết kế để minimize số lượng constraints trong ZK circuit.
#[derive(Debug, Clone)]
pub struct ExecutionTrace {
    /// Danh sách các bước thực thi (mỗi opcode = 1 step)
    pub steps:        Vec<ExecutionStep>,
    /// Memory access log (read + write)
    pub memory_ops:   Vec<MemoryOp>,
    /// Storage access log
    pub storage_ops:  Vec<StorageOp>,
    /// Stack operations
    pub stack_ops:    Vec<StackOp>,
    /// Call frames
    pub call_frames:  Vec<CallFrame>,
    /// Kết quả cuối
    pub result:       ExecutionResult,
}

/// Một bước thực thi đơn (một opcode).
#[derive(Debug, Clone)]
pub struct ExecutionStep {
    /// Program counter
    pub pc:           u64,
    /// Opcode
    pub opcode:       u8,
    /// Gas còn lại trước khi execute
    pub gas_left:     u64,
    /// Gas tốn cho opcode này
    pub gas_cost:     u64,
    /// Keccak256 hash của memory state tại bước này
    pub memory_root:  B256,
    /// Hash của stack state
    pub stack_depth:  u16,
    /// Stack top 8 elements (cho verification)
    pub stack_top:    [U256; 8],
}

/// Storage operation log.
#[derive(Debug, Clone)]
pub struct StorageOp {
    pub address:   Address,
    pub slot:      U256,
    pub op_type:   StorageOpType,
    pub value:     U256,
    pub prev_value: U256,
}

#[derive(Debug, Clone, Copy)]
pub enum StorageOpType { SLoad, SStore, TLoad, TStore }

/// Builder để tạo ExecutionTrace từ EVM execution.
pub struct TraceBuilder {
    steps:      Vec<ExecutionStep>,
    memory_ops: Vec<MemoryOp>,
    storage_ops: Vec<StorageOp>,
    stack_ops:  Vec<StackOp>,
}

impl TraceBuilder {
    pub fn new() -> Self { Self::default() }

    pub fn record_step(&mut self, step: ExecutionStep) {
        self.steps.push(step);
    }

    pub fn record_storage_read(&mut self, address: Address, slot: U256, value: U256) {
        self.storage_ops.push(StorageOp {
            address, slot, value, prev_value: value,
            op_type: StorageOpType::SLoad,
        });
    }

    pub fn record_storage_write(&mut self, address: Address, slot: U256, new: U256, old: U256) {
        self.storage_ops.push(StorageOp {
            address, slot, value: new, prev_value: old,
            op_type: StorageOpType::SStore,
        });
    }

    /// Finalize trace — tính toán hash cho verification.
    pub fn build(self, result: ExecutionResult) -> ExecutionTrace {
        ExecutionTrace {
            steps:       self.steps,
            memory_ops:  self.memory_ops,
            storage_ops: self.storage_ops,
            stack_ops:   self.stack_ops,
            call_frames: vec![],
            result,
        }
    }
}
```

---

### 23.3 `op-alloy` — OP Stack Bridge với SEQUENTICHAIN

```rust
// crates/op-alloy-consensus/src/transaction/deposit.rs

use alloy_primitives::{Address, B256, Bytes, TxKind, U256};

/// Deposit transaction — tạo ra trên L2 để phản ánh sự kiện từ L1.
///
/// Khi một sự kiện được emit từ `OptimismPortal` trên L1,
/// SEQUENTICHAIN tạo ra TxDeposit tương ứng trên L2.
///
/// # Source Hash
/// `source_hash = keccak256(deposit_source_domain ++ user_deposit_hash)`
/// đảm bảo mỗi deposit chỉ được include một lần.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TxDeposit {
    /// Hash định danh nguồn gốc deposit (ngăn replay)
    pub source_hash:           B256,
    /// Địa chỉ gửi deposit trên L1
    pub from:                  Address,
    /// Địa chỉ nhận trên L2
    pub to:                    TxKind,
    /// ETH được mint trên L2 (từ ETH lock trên L1)
    pub mint:                  Option<u128>,
    /// ETH value trong L2 transaction
    pub value:                 U256,
    /// Gas limit
    pub gas_limit:             u64,
    /// True nếu đây là system transaction (ví dụ: L1BlockInfo)
    pub is_system_transaction: bool,
    /// Calldata
    pub input:                 Bytes,
}

impl TxDeposit {
    /// Tính source hash cho user deposit (domain = 0).
    pub fn user_source_hash(l1_block_hash: B256, l1_log_index: u64) -> B256 {
        let mut buf = [0u8; 64];
        buf[..32].copy_from_slice(l1_block_hash.as_slice());
        buf[32..].copy_from_slice(&l1_log_index.to_be_bytes().repeat(4)[..32]);
        alloy_primitives::keccak256(&buf)
    }
}

/// OP Stack Transaction Envelope — bao gồm tất cả L2 tx types.
#[derive(Clone, Debug)]
pub enum OpTxEnvelope {
    /// Legacy transaction (type 0)
    Legacy(Signed<TxLegacy>),
    /// EIP-2930 access list (type 1)
    Eip2930(Signed<TxEip2930>),
    /// EIP-1559 dynamic fee (type 2)
    Eip1559(Signed<TxEip1559>),
    /// EIP-4844 blob (type 3)
    Eip4844(Signed<TxEip4844Variant>),
    /// OP Deposit (type 0x7E) — không có signature
    Deposit(TxDeposit),
}

impl OpTxEnvelope {
    pub fn tx_type(&self) -> u8 {
        match self {
            Self::Legacy(_)  => 0x00,
            Self::Eip2930(_) => 0x01,
            Self::Eip1559(_) => 0x02,
            Self::Eip4844(_) => 0x03,
            Self::Deposit(_) => 0x7E,
        }
    }

    pub fn is_deposit(&self) -> bool {
        matches!(self, Self::Deposit(_))
    }
}
```

#### `L1BlockInfo` — Thông tin L1 được inject vào mỗi L2 Block

```rust
// crates/op-alloy-consensus/src/l1_block_info.rs

use alloy_primitives::{Address, B256, U256};

/// Thông tin L1 được gắn vào transaction đầu tiên của mỗi L2 block.
///
/// SEQUENTICHAIN inject L1BlockInfo để L2 contracts có thể:
/// - Xác minh trạng thái L1
/// - Tính L1 data fee cho transactions
/// - Triển khai cross-chain messaging
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct L1BlockInfo {
    /// Block number của L1
    pub number:             u64,
    /// Timestamp của L1 block
    pub time:               u64,
    /// Base fee của L1 block
    pub base_fee:           u64,
    /// Hash của L1 block
    pub block_hash:         B256,
    /// Sequence number trong L2 epoch
    pub sequence_number:    u64,
    /// Batcher address (địa chỉ submit batches lên L1)
    pub batcher_address:    Address,
    /// L1 fee overhead
    pub l1_fee_overhead:    U256,
    /// L1 fee scalar
    pub l1_fee_scalar:      U256,
    /// Blob base fee (Ecotone upgrade)
    pub blob_base_fee:      Option<u128>,
    /// Base fee scalar (Ecotone)
    pub base_fee_scalar:    Option<u32>,
    /// Blob base fee scalar (Ecotone)
    pub blob_base_fee_scalar: Option<u32>,
}

impl L1BlockInfo {
    /// Function selector của `setL1BlockValues()` — 0x015d8eb9
    pub const SELECTOR_PRE_ECOTONE: [u8; 4] = [0x01, 0x5d, 0x8e, 0xb9];
    /// Function selector của `setL1BlockValuesEcotone()` — 0x440a5e20
    pub const SELECTOR_ECOTONE: [u8; 4]    = [0x44, 0x0a, 0x5e, 0x20];

    /// Decode từ calldata của L1 attributes transaction.
    pub fn decode_calldata(calldata: &[u8]) -> Result<Self, DecodeError> {
        if calldata.len() < 4 { return Err(DecodeError::TooShort); }

        match calldata[..4].try_into().unwrap() {
            Self::SELECTOR_PRE_ECOTONE => Self::decode_pre_ecotone(&calldata[4..]),
            Self::SELECTOR_ECOTONE     => Self::decode_ecotone(&calldata[4..]),
            sel => Err(DecodeError::UnknownSelector(sel)),
        }
    }

    fn decode_pre_ecotone(data: &[u8]) -> Result<Self, DecodeError> {
        // ABI decode: (uint64, uint64, uint256, bytes32, uint64, bytes32, uint256, uint256)
        if data.len() < 8 * 32 { return Err(DecodeError::TooShort); }
        Ok(Self {
            number:           u64::from_be_bytes(data[24..32].try_into()?),
            time:             u64::from_be_bytes(data[56..64].try_into()?),
            base_fee:         U256::from_be_slice(&data[64..96]).try_into()
                                .map_err(|_| DecodeError::Overflow)?,
            block_hash:       B256::from_slice(&data[96..128]),
            sequence_number:  u64::from_be_bytes(data[152..160].try_into()?),
            batcher_address:  Address::from_slice(&data[172..192]),
            l1_fee_overhead:  U256::from_be_slice(&data[192..224]),
            l1_fee_scalar:    U256::from_be_slice(&data[224..256]),
            blob_base_fee:    None,
            base_fee_scalar:  None,
            blob_base_fee_scalar: None,
        })
    }

    fn decode_ecotone(_data: &[u8]) -> Result<Self, DecodeError> {
        todo!("Ecotone format decode")
    }
}
```

---

### 23.4 `op-alloy-protocol` — Batch & Channel Encoding

```rust
// crates/op-alloy-protocol/src/batch.rs

use alloy_primitives::Bytes;
use alloy_eips::BlockNumHash;

/// Batch type — phân biệt hai định dạng batch của OP Stack.
#[derive(Debug, Clone)]
pub enum Batch {
    /// Span Batch — nhiều L2 blocks trong một batch (Ecotone+)
    Span(SpanBatch),
    /// Single Batch — một L2 block (trước Ecotone)
    Single(SingleBatch),
}

/// Single batch chứa thông tin của một L2 block.
#[derive(Debug, Clone)]
pub struct SingleBatch {
    /// Hash của L1 block parent
    pub parent_hash:    alloy_primitives::B256,
    /// Epoch number (L1 block number)
    pub epoch_num:      u64,
    /// Hash của L1 epoch block
    pub epoch_hash:     alloy_primitives::B256,
    /// Timestamp của L2 block
    pub timestamp:      u64,
    /// Danh sách transactions trong L2 block (RLP-encoded)
    pub transactions:   Vec<Bytes>,
}

/// Channel — container chứa nhiều batches nén lại, gửi qua L1 calldata hoặc blobs.
///
/// SEQUENTICHAIN đọc channels từ L1 DA layer, decode thành batches, rồi execute.
#[derive(Debug)]
pub struct Channel {
    /// Channel ID (8 bytes ngẫu nhiên)
    pub id:          ChannelId,
    /// L1 origin block
    pub origin:      BlockNumHash,
    /// Dữ liệu compressed (zlib hoặc brotli)
    pub data:        Vec<u8>,
    /// Có closed chưa (đã nhận đủ frames)
    pub is_closed:   bool,
    /// Số frame đã nhận
    pub frame_count: u16,
}

pub type ChannelId = [u8; 16];

/// Frame — đơn vị nhỏ nhất gửi trên L1 calldata.
/// Nhiều frames ghép lại thành một Channel.
#[derive(Debug, Clone)]
pub struct Frame {
    pub channel_id:   ChannelId,
    pub frame_number: u16,
    pub data:         Bytes,
    pub is_last:      bool,
}

impl Frame {
    /// Encode frame thành bytes để gửi lên L1.
    pub fn encode(&self) -> Bytes {
        let mut buf = Vec::with_capacity(16 + 2 + 4 + self.data.len() + 1);
        buf.extend_from_slice(&self.channel_id);
        buf.extend_from_slice(&self.frame_number.to_be_bytes());
        buf.extend_from_slice(&(self.data.len() as u32).to_be_bytes());
        buf.extend_from_slice(&self.data);
        buf.push(self.is_last as u8);
        Bytes::from(buf)
    }

    /// Decode frame từ bytes.
    pub fn decode(input: &[u8]) -> Result<(Self, &[u8]), FrameDecodeError> {
        if input.len() < 16 + 2 + 4 + 1 {
            return Err(FrameDecodeError::TooShort);
        }
        let channel_id: ChannelId = input[..16].try_into().unwrap();
        let frame_number = u16::from_be_bytes(input[16..18].try_into().unwrap());
        let data_len     = u32::from_be_bytes(input[18..22].try_into().unwrap()) as usize;
        if input.len() < 22 + data_len + 1 {
            return Err(FrameDecodeError::DataTruncated);
        }
        let data    = Bytes::copy_from_slice(&input[22..22 + data_len]);
        let is_last = input[22 + data_len] != 0;

        Ok((Self { channel_id, frame_number, data, is_last }, &input[23 + data_len..]))
    }
}
```

---

### 23.5 Integration Test — op-alloy vs OP Sepolia

```rust
// tests/integration/op_sepolia.rs
//! Integration test: kết nối OP Sepolia và verify L1BlockInfo.
//! Skip trên CI nếu không có biến môi trường OP_SEPOLIA_RPC_URL.

use op_alloy::{
    network::Optimism,
    provider::OpProviderExt,
    consensus::L1BlockInfo,
};
use alloy::providers::ProviderBuilder;

#[tokio::test]
#[ignore = "requires OP_SEPOLIA_RPC_URL env var"]
async fn test_decode_l1_block_info() -> eyre::Result<()> {
    let rpc_url = std::env::var("OP_SEPOLIA_RPC_URL")?;

    let provider = ProviderBuilder::<_, _, Optimism>::default()
        .on_http(rpc_url.parse()?);

    // Lấy một block gần đây
    let block = provider
        .get_block_by_number(alloy::rpc::types::BlockNumberOrTag::Latest, true)
        .await?
        .expect("block not found");

    // Tx đầu tiên luôn là L1 attributes transaction
    let first_tx = block.transactions.as_transactions().unwrap()[0];
    let calldata = first_tx.input.as_ref();

    // Decode L1BlockInfo từ calldata
    let l1_info = L1BlockInfo::decode_calldata(calldata)?;

    assert!(l1_info.number > 0, "L1 block number should be positive");
    assert!(l1_info.time > 0,   "L1 timestamp should be positive");
    assert!(!l1_info.block_hash.is_zero(), "L1 block hash should not be zero");

    println!("L1 block #{} at ts {}", l1_info.number, l1_info.time);
    println!("Base fee: {} wei", l1_info.base_fee);

    Ok(())
}
```

---

### 23.6 Tổng kết 4 Giai đoạn — Trạng thái Workspace

Sau khi hoàn thành cả 4 giai đoạn, workspace có cấu trúc cuối cùng:

```
wikialisalabs-evm/
├── Cargo.toml                          # workspace (4 giai đoạn)
│
├── crates/
│   │
│   │   ── TẦNG 1: Core Primitives ──
│   ├── alloy-primitives/               ✅ Giai đoạn 1
│   ├── alloy-rlp/                      ✅ Giai đoạn 1
│   ├── alloy-sol-types/                ✅ Giai đoạn 1
│   │
│   │   ── TẦNG 2: Runtime & Data ──
│   ├── alloy-trie/                     ✅ Giai đoạn 1
│   ├── revm-primitives/                ✅ Giai đoạn 2
│   ├── revm-interpreter/               ✅ Giai đoạn 2
│   ├── revm-precompiles/               ✅ Giai đoạn 2
│   ├── revm-context/                   ✅ Giai đoạn 2
│   ├── revm-database/                  ✅ Giai đoạn 2
│   ├── revm/                           ✅ Giai đoạn 2
│   ├── evm2-parallel/                  ✅ Giai đoạn 4
│   ├── evm2-ir/                        ✅ Giai đoạn 4
│   │
│   │   ── TẦNG 3: Extensions ──
│   ├── alloy-eips/                     ✅ Giai đoạn 1
│   ├── alloy-hardforks/                ✅ Giai đoạn 3
│   ├── svm-rs/                         ✅ Giai đoạn 2
│   ├── svm-rs-builds/                  ✅ Giai đoạn 2
│   ├── op-alloy-consensus/             ✅ Giai đoạn 4
│   ├── op-alloy-network/               ✅ Giai đoạn 4
│   ├── op-alloy-protocol/              ✅ Giai đoạn 4
│   │
│   │   ── TẦNG 0: Meta-crate ──
│   ├── alloy-network/                  ✅ Giai đoạn 3
│   ├── alloy-transport/                ✅ Giai đoạn 3
│   ├── alloy-transport-http/           ✅ Giai đoạn 3
│   ├── alloy-transport-ws/             ✅ Giai đoạn 3
│   ├── alloy-rpc-client/               ✅ Giai đoạn 3
│   ├── alloy-provider/                 ✅ Giai đoạn 3
│   ├── alloy-pubsub/                   ✅ Giai đoạn 3
│   ├── alloy-signer/                   ✅ Giai đoạn 3
│   ├── alloy-signer-local/             ✅ Giai đoạn 3
│   ├── alloy-contract/                 ✅ Giai đoạn 3
│   ├── alloy-node-bindings/            ✅ Giai đoạn 3
│   └── alloy/                          ✅ Giai đoạn 3
│
│   ── TẦNG 4: DevEx ──
├── docs/                               ✅ Giai đoạn 4
├── fuzz/                               ✅ Song hành
├── examples/                           ✅ Song hành
│
└── crates/svm-rs-cli/                  ✅ Giai đoạn 2 (binary)
```

**Tổng số crates:** 35 crates độc lập, tất cả publish được trên `crates.io`.

---

*Wikialisalabs Foundation · RUST_EVM_PLAN v1.3 · 2026-10-31 · root@wikialisalabs.axvn.vn*
