# Repo Audit & Refactor Plan

## 1) Executive recommendation

Mục tiêu: không bắt đầu từ các repo fork hoặc landing page. Vùng thực sự cần tái kiến trúc là `wikiRust` / EVM core stack, với `wikialisalabs` là repo brand/docs, còn các repo còn lại là tích hợp, thử nghiệm, hoặc fork từ bên thứ ba.

Nền tảng đúng để refactor:
- `wikiRust` — monorepo chính của EVM stack
- `alloy` — meta-crate / public façade
- `core` — low-level primitives
- `evm` + `trie` — runtime/data structures
- `eips` / `op-alloy` / `svm-rs` — extension layer

Không nên refactor đồng thời toàn bộ org. Nên chọn baseline chuẩn và refactor từng lớp theo thứ tự:
1. `core`
2. `trie`
3. `evm`
4. `alloy`
5. `eips` / `op-alloy` / `svm-rs`
6. external integrations/forks

---

## A) Phân loại repo: Canonical / Fork / Experimental / Dead-or-low-signal

### A.1 Canonical / primary repositories

| Category | Repo | Notes |
|---|---|---|
| Canonical | `wikialisalabs/wikiRust` | Main monorepo, explicit architecture, roadmap, layered stack |
| Canonical | `wikialisalabs/alloy` | Public entry point / umbrella crate |
| Canonical | `wikialisalabs/core` | Low-level primitives, foundational layer |
| Canonical | `wikialisalabs/evm` | EVM runtime |
| Canonical | `wikialisalabs/evm2` | Experimental runtime / parallel EVM |
| Canonical | `wikialisalabs/trie` | Data structures / Merkle Patricia trie |
| Canonical | `wikialisalabs/eips` | Hardfork/activation logic |
| Canonical | `wikialisalabs/op-alloy` | OP Stack types |
| Canonical | `wikialisalabs/svm-rs` | Solc manager / scanner |

### A.2 Brand / docs / non-core system

| Category | Repo | Notes |
|---|---|---|
| Brand/docs | `wikialisalabs/wikialisalabs` | Community design system + AXIOLEDGER ecosystem landing/docs |
| Brand/docs | `wikialisalabs/evsolar` | May be product-specific or separate prototype |

### A.3 Forks / third-party integrations

| Category | Repo | Notes |
|---|---|---|
| Fork | `wikialisalabs/data-proxy-server` | Proxy server integration |
| Fork | `wikialisalabs/Grants-Program` | External program repo |
| Fork | `wikialisalabs/instant_wallet_appclip` | Wallet appclip prototype |
| Fork | `wikialisalabs/js-sdk` | JS SDK fork |
| Fork | `wikialisalabs/linkdrop-contract` | Smart contract fork |
| Fork | `wikialisalabs/locales` | Locales repo |
| Fork | `wikialisalabs/near-swift-sdk` | Swift SDK fork |
| Fork | `wikialisalabs/near-zmq-indexer` | Indexer fork |
| Fork | `wikialisalabs/phone-access-contract` | Access contract |
| Fork | `wikialisalabs/phone.herewallet.app` | Front-end app |
| Fork | `wikialisalabs/promotion-sdk` | Promotion SDK |
| Fork | `wikialisalabs/santa-token` | Token related repo |
| Fork | `wikialisalabs/subscriptions-service` | Microservice |

### A.4 Dead or low-signal candidates (to be confirmed)

> Chú ý: không có dữ liệu hoạt động/commit mới ở đây, nên phân loại này chỉ là “low signal / likely stale” dựa trên repo name + không rõ mục tiêu. Cần confirm bằng commit activity / issues / last push trước khi dùng làm baseline.

| Candidate | Why it is low-signal |
|---|---|
| `evsolar` | unclear purpose, not part of the monorepo architecture docs |
| `locales` | likely utility translation repo |
| `Grants-Program` | program repo, not core product code |
| some forked SDK/service repos | integration-only, not a system core |

Recommendation:
- Keep all fork repos in a separate audit bucket.
- Do not treat them as source-of-truth for architecture.
- Only use them later for compatibility research or integration adapter design.

---

## B) Repo chính để đọc sâu: `core` (và chain tiếp `trie` → `evm` → `alloy`)

### B.1 Why `core` is the first deep-dive repo

`core` is the lowest layer and the simplest place to detect:
- dependency mismatch
- API breakage
- wrong abstraction boundaries
- missing invariants
- version skew between crates

This repo is the best candidate for the first refactor baseline because it is the foundation for:
- `trie`
- `evm`
- `alloy`
- extension crates

### B.2 Deep-dive order

1. `core`
   - primitives: Address, B256, U256, RLP, ABI
   - check no_std boundary / type compatibility
   - confirm public API stability and test coverage

2. `trie`
   - ensure state representation matches `core`
   - identify where the runtime depends on assumptions that are invalid

3. `evm`
   - detect interpreter invariants, hook APIs, gas semantics, transaction semantics

4. `alloy`
   - verify re-export layer does not hide architectural drift
   - check whether all crates are aligned to a single version and API contract

5. `eips`, `op-alloy`, `svm-rs`
   - evaluate if they are extension modules or semantic drift sources

### B.3 Signs of a bug/version mismatch

Look for these signals during audit:
- same domain type defined in multiple crates with incompatible semantics
- cross-crate re-export mismatches
- hidden `cfg` or feature-gating affecting behaviour
- `core` types not the canonical source of truth
- tests pass in one crate but fail when assembled in workspace
- `alloy` re-export exposes a public surface not truly consistent with runtime behavior

---

## C) Kế hoạch refactor theo từng tầng

### C.1 Layer 1: Core primitives (`core`)

Goals:
- establish canonical types
- remove duplicated definitions
- standardize serialization and ABI handling
- lock stable API conventions

Actions:
- define source-of-truth types for address / hash / uint / bytes
- isolate RLP / ABI codecs behind explicit traits
- ensure no `std` leakage in the core domain
- add strict invariants for values and conversions
- codify compatibility tests for cross-version behavior

Output:
- stable public boundary
- tests at primal layer before any runtime change

### C.2 Layer 2: State & runtime (`trie` + `evm`)

Goals:
- align trie semantics with runtime semantics
- unify state root and execution semantics
- remove implicit assumptions

Actions:
- map runtime state transitions to trie contracts
- define transaction execution boundaries
- centralize gas / opcode semantics
- isolate interpreter hooks from external side effects
- make state data model explicit and testable

Output:
- clear system boundary between state representation and execution semantics

### C.3 Layer 3: Public façade (`alloy`)

Goals:
- avoid meta-crate hiding architecture drift
- provide a stable and minimal public API

Actions:
- reduce re-export sprawl
- ensure `alloy` simply composes stable layer APIs
- expose compatibility shims only where necessary
- move optional logic to extension crates instead of main façade

Output:
- façade layer becomes orchestration, not a hidden implementation hub

### C.4 Layer 4: Extensions (`eips`, `op-alloy`, `svm-rs`)

Goals:
- keep extensions modular and opt-in
- prevent them from becoming hidden dependencies of core runtime

Actions:
- move feature-gated logic behind explicit versions and flags
- treat OP and EIP logic as adaptors, not core runtime assumptions
- keep compiler/scanner-related logic separate from EVM interpreter internals

Output:
- extension layer remains additive and non-invasive

### C.5 Layer 5: Integration / fork repos

Goals:
- avoid polluting canonical architecture with third-party adapters

Actions:
- classify as compatibility adapters or experimental prototypes
- document them as out-of-scope for base refactor until stable
- if needed, create interface adapters instead of modifying core code directly

---

## D) Audit checklist: how to find the version bug before refactor

### D.1 Repository inventory checklist

- [ ] Confirm which repos are canonical vs fork vs prototype
- [ ] Identify the source-of-truth crate in each stack layer
- [ ] Map cross-crate dependencies and version pinning
- [ ] Check for duplicate domain types across crates
- [ ] Check for re-exported APIs that obscure real implementation boundaries

### D.2 Build and workspace checklist

- [ ] Run workspace build for `wikiRust`
- [ ] Run tests for `core` first
- [ ] Run tests for `trie` and `evm` with workspace features enabled
- [ ] Run `alloy` integration tests
- [ ] Validate all extension crates compile under the same dependency graph
- [ ] Note any feature combinations that fail only in workspace context

### D.3 Structural mismatch checklist

- [ ] Are `Address` / `B256` / `U256` types duplicated or semantically drifted?
- [ ] Are RLP/ABI types defined in more than one place?
- [ ] Are state root computations inconsistent across trie and runtime?
- [ ] Are gas semantics enforced consistently in interpreter and tests?
- [ ] Are EIP hooks and OP-specific logic injected too early in the stack?

### D.4 API discipline checklist

- [ ] No public API added without tests
- [ ] No hidden module dependencies from `alloy` to runtime internals
- [ ] No extension crate required for basic execution
- [ ] No semantic assumptions outside canonical domain model
- [ ] No feature flags silently changing serialization or execution behavior

### D.5 Version / compatibility checklist

- [ ] Compare crate versions and dependency versions across workspace
- [ ] Track breaking changes introduced by each layer
- [ ] Identify where compatibility wrappers are needed instead of broad refactors
- [ ] Document “must preserve” external behavior before changing architecture

### D.6 Refactor gate checklist

Only proceed to architecture refactor when these gates pass:

- [ ] `core` is canonical and stable
- [ ] `trie` and `evm` share the same state semantics
- [ ] `alloy` is a façade only
- [ ] extension crates are optional and sidecar
- [ ] workspace tests define the real contract

---

## Recommended next action

Step 1: deep-dive into `wikialisalabs/core`
Step 2: verify whether `core` is the true source-of-truth
Step 3: map all types and dependencies in the `wikiRust` workspace
Step 4: produce a dependency graph and identify the exact version drift point
Step 5: begin refactor in layers starting from `core`

This is the lowest-risk path because it keeps the architecture stable while isolating the actual root-cause drift before changing interfaces.

---

## Relevant repo list used in this assessment

- `https://github.com/wikialisalabs/wikiRust`
- `https://github.com/wikialisalabs/alloy`
- `https://github.com/wikialisalabs/core`
- `https://github.com/wikialisalabs/evm`
- `https://github.com/wikialisalabs/evm2`
- `https://github.com/wikialisalabs/trie`
- `https://github.com/wikialisalabs/eips`
- `https://github.com/wikialisalabs/op-alloy`
- `https://github.com/wikialisalabs/svm-rs`
- `https://github.com/wikialisalabs/wikialisalabs`
- `https://github.com/wikialisalabs/evsolar`
- `https://github.com/wikialisalabs/data-proxy-server`
- `https://github.com/wikialisalabs/Grants-Program`
- `https://github.com/wikialisalabs/instant_wallet_appclip`
- `https://github.com/wikialisalabs/js-sdk`
- `https://github.com/wikialisalabs/linkdrop-contract`
- `https://github.com/wikialisalabs/locales`
- `https://github.com/wikialisalabs/near-swift-sdk`
- `https://github.com/wikialisalabs/near-zmq-indexer`
- `https://github.com/wikialisalabs/phone-access-contract`
- `https://github.com/wikialisalabs/phone.herewallet.app`
- `https://github.com/wikialisalabs/promotion-sdk`
- `https://github.com/wikialisalabs/santa-token`
- `https://github.com/wikialisalabs/subscriptions-service`

---

This document should be treated as the working repo audit baseline for the re-architecture effort.
