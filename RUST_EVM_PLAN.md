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

*Wikialisalabs Foundation · RUST_EVM_PLAN v1.1 · 2026-10-31 · root@wikialisalabs.axvn.vn*
