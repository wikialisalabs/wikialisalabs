# Kế Hoạch Cập Nhật README.md — AXQ Design System

> **Tệp mục tiêu:** `design-system/README.md`
> **Phiên bản hiện tại:** ~~v1.1~~ → **v2.0 ✅ HOÀN THÀNH**
> **Phiên bản mục tiêu:** v2.0
> **Trạng thái:** ✅ Tất cả bước đã thực hiện — `README.md` đã được cập nhật hoàn chỉnh.
> **Lý do cập nhật:** README hiện tại chỉ mô tả lý thuyết token/Figma, chưa phản ánh hệ thống thực tế đang có trong codebase (component specs, guidelines, CSS output, package integration).

---

## 1. Vấn Đề Hiện Tại

| Hạng mục | Trạng thái hiện tại | Cần bổ sung |
|---|---|---|
| Phạm vi tài liệu | Chỉ bao gồm token system & Figma workflow | Cần bao gồm toàn bộ cấu trúc thư mục thực tế |
| Component specs | Không đề cập | `buttons.md`, `inputs.md`, `modals.md`, `feedback.md`, `crypto.md` đã tồn tại |
| Developer integration | Không có | `guidelines/implementation.md` v2.0 đã đầy đủ (cài đặt, AxioProvider, TLP) |
| Token files thực tế | Chỉ có bảng lý thuyết | `color-tokens.json`, `typography-tokens.json`, `variables.css`, `icon-tokens.css` |
| Bảng mục lục | 12 mục, tất cả nội bộ | Thiếu quick-link đến các file trong `components/`, `guidelines/`, `tokens/` |
| TLP (Traffic Light Protocol) | Không đề cập | Tính năng cốt lõi — `SAFE / CAUTION / BLOCKED / SYSTEM` namespace levels |
| Package `@axioledger/axio-design-system` | Không đề cập | Tên package, cách cài, AxioProvider, các component chính |
| Dark mode token conflicts | `color-tokens.md` và `README.md` có giá trị khác nhau | Cần đồng bộ — chọn một nguồn sự thật |
| Accessibility | Không đề cập | `guidelines/accessibility.md` đã có |
| Icon system | Không đề cập | `guidelines/icon-catalog.md`, `icon-usage.md`, `icon-tokens.css` đã có |

---

## 2. Cấu Trúc Mới Đề Xuất

README v2.0 sẽ đóng vai trò **entry point duy nhất** — mô tả tổng quan hệ thống, dẫn link đến từng tài liệu chi tiết, và đủ thông tin để developer onboard nhanh.

```
README.md (v2.0)
├── 0. Quick Start (mới)
├── 1. Kiến Trúc Tổng Quan (cập nhật)
│   ├── 3-Layer Token Model (giữ nguyên, cải thiện sơ đồ)
│   └── Cấu trúc thư mục thực tế (mới)
├── 2. Token System (cập nhật)
│   ├── Primitive Tokens (giữ nguyên bảng)
│   ├── Semantic Tokens — Light & Dark (đồng bộ với color-tokens.md)
│   └── Component Tokens (giữ nguyên, bổ sung link đến files)
├── 3. Component Library (mới hoàn toàn)
│   ├── Button
│   ├── Input & Form Elements
│   ├── Feedback (Toast, Alert, SecurityAlert)
│   ├── Modals & Overlays
│   └── Crypto-specific Components
├── 4. TLP — Namespace Security (mới)
├── 5. Developer Integration (mới)
│   ├── Cài đặt
│   ├── Global Setup (Next.js)
│   └── Theming & Dark mode
├── 6. Guidelines (mới — index dẫn link)
│   ├── Implementation
│   ├── Accessibility
│   ├── Dark Mode
│   └── Icon Usage
├── 7. Figma Workflow (giữ nguyên, thu gọn)
├── 8. CSS Custom Properties (giữ nguyên)
├── 9. Naming Convention (giữ nguyên)
└── 10. Changelog (mới)
```

---

## 3. Danh Sách Thay Đổi Chi Tiết

### 3.1 Header & Subtitle (cập nhật)

**Hiện tại:**
```md
# AXQ Design System — Variable Token Architecture
> Variable / Token Architecture — 3-Layer Model
> Trích xuất trực tiếp từ 14 token files · 6 component scopes · Light & Dark mode · Font: Work Sans
```

**Thay bằng:**
```md
# AXQ Design System

> Package: `@axioledger/axio-design-system` · Version: 2.0  
> Stack: React 18 · Next.js 15 · CSS Custom Properties · TypeScript  
> Token Architecture: 3-Layer (Primitive → Semantic → Component) · Light & Dark · Font: Work Sans
```

---

### 3.2 Thêm mục "Quick Start" (mới — đặt lên đầu)

Thêm ngay sau header, trước mục lục. Mục tiêu: developer mới có thể dùng được trong < 5 phút.

```md
## Quick Start

\`\`\`bash
pnpm add @axioledger/axio-design-system
\`\`\`

\`\`\`tsx
// apps/*/src/app/layout.tsx
import '@axioledger/axio-design-system/styles';
import { AxioProvider } from '@axioledger/axio-design-system';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AxioProvider theme="system">
          {children}
        </AxioProvider>
      </body>
    </html>
  );
}
\`\`\`

→ Xem chi tiết: [guidelines/implementation.md](guidelines/implementation.md)
```

---

### 3.3 Thêm sơ đồ cấu trúc thư mục (mới — sau sơ đồ kiến trúc)

```md
## Cấu Trúc Thư Mục

\`\`\`
design-system/
├── README.md                        ← Tài liệu tổng quan (file này)
├── tokens/
│   ├── color-tokens.json            ← Semantic color tokens (JSON)
│   ├── color-tokens.md              ← Bảng mô tả token có light/dark
│   ├── typography-tokens.json       ← Font size, weight, line-height
│   ├── typography-tokens.md
│   ├── icon-tokens.css              ← Icon size CSS variables
│   └── variables.css                ← Output CSS Custom Properties (auto-gen)
├── components/
│   ├── buttons.md                   ← Button: 3 types × 8 colors × 4 sizes × 5 states
│   ├── inputs.md                    ← Text input, OTP, Checkbox, Radio, Dropdown
│   ├── modals.md                    ← Modal, Bottom Sheet, Drawer
│   ├── feedback.md                  ← Toast, Alert, Banner, SecurityAlert
│   └── crypto.md                   ← Crypto-specific: TokenInput, SwapCard, WalletHome
├── guidelines/
│   ├── implementation.md            ← Developer integration guide (v2.0)
│   ├── accessibility.md             ← a11y rules & ARIA usage
│   ├── dark-mode.md                 ← Dark mode override guide
│   ├── icon-catalog.md              ← Danh sách toàn bộ icons
│   └── icon-usage.md                ← Quy tắc dùng icon
└── ui.html                          ← Preview tĩnh toàn bộ component
\`\`\`
```

---

### 3.4 Bổ sung mục "Component Library" (mới hoàn toàn)

Thêm mục mới tóm tắt tất cả component đã có, với link đến spec chi tiết.

Nội dung gồm:

**Button** (từ `components/buttons.md`):
- 3 types: Filled, Outlined, Ghost
- 8 colors: Black, Blue, Green, Yellow, Orange, Error/Pink, Dark Navy, White
- 4 sizes: Giant (56px) / Large (48px) / Medium (40px) / Small (32px)
- 5 states: Default, Hover, Pressed, Disabled, Loading
- 4 icon positions: Label only, Icon left, Icon right, Icon only

**Input & Form Elements** (từ `components/inputs.md`):
- Text Input (6 types, 5 states, 3 sizes)
- Search Bar (pill shape, clear button)
- OTP / PIN Input (4 hoặc 6 digits)
- Checkbox, Radio Button
- Dropdown / Select (single & multi)
- Date Picker

**Crypto-specific Components**:
- `TokenInput` — nhập lượng token với symbol selector
- `SwapCard` — swap từ/đến với rate display
- `WalletHome` — balance overview card
- `NamespaceBadge` — hiển thị TLP level
- `AddressDisplay` — render ANS name thay vì raw address

---

### 3.5 Thêm mục "TLP — Traffic Light Protocol" (mới)

Tính năng bảo mật cốt lõi, hiện không có trong README. Lấy nội dung từ `guidelines/implementation.md` section 3.

```md
## TLP — Namespace Security

| Level | Namespaces | CSS Token | Hành vi |
|---|---|---|---|
| **SAFE** | `.axq` `.vrq` | `--tlp-safe` = `#00D68F` | ✅ Cho phép tất cả actions |
| **CAUTION** | `.kpx` | `--tlp-caution` = `#FFAA00` | ⚠️ Hiện disclaimer DeFi risk |
| **BLOCKED** | unknown / unregistered | `--tlp-blocked` = `#FF3D71` | 🚫 Disable nút Sign |
| **SYSTEM** | `.sqx` `.vpx` | `--tlp-system` = `#57606A` | ⚙️ Ẩn khỏi end-user UI |
```

---

### 3.6 Thêm mục "Developer Integration" (mới — tóm tắt từ implementation.md)

Thêm phần ngắn gọn (không thay thế `guidelines/implementation.md`):
- Installation (`pnpm add`)
- Global setup (import CSS + AxioProvider)
- Theming props
- Link đầy đủ → `guidelines/implementation.md`

---

### 3.7 Thêm mục "Guidelines Index" (mới)

```md
## Guidelines

| Tài liệu | Mô tả |
|---|---|
| [implementation.md](guidelines/implementation.md) | Installation, AxioProvider, component API, security rules |
| [accessibility.md](guidelines/accessibility.md) | Keyboard nav, ARIA, focus management |
| [dark-mode.md](guidelines/dark-mode.md) | Token override, data-theme, system preference |
| [icon-catalog.md](guidelines/icon-catalog.md) | Toàn bộ icon set với tên và usage |
| [icon-usage.md](guidelines/icon-usage.md) | Quy tắc size, color, accessibility |
```

---

### 3.8 Đồng bộ Dark Mode Token Values

Hiện tại có **xung đột** giữa README.md và `color-tokens.md`:

| Token | README.md (v1.1) | color-tokens.md | Chọn |
|---|---|---|---|
| `text/primary` dark | `#F4F5F7` | `#E6EDF3` | `color-tokens.md` (nguồn sự thật) |
| `bg/primary` dark | `#121318` | `#0D1117` | `color-tokens.md` |
| `surface/default` dark | `#1A1C23` | `#1C2128` | `color-tokens.md` |
| `border/default` dark | `#2B2E38` | `#30363D` | `color-tokens.md` |

**Hành động:** Cập nhật bảng "Dark Mode Overrides" trong README.md để khớp với `tokens/color-tokens.md`.

---

### 3.9 Thêm mục "Changelog" (mới — cuối file)

```md
## Changelog

| Version | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2025-07 | Thêm Quick Start, Component Library, TLP, Developer Integration, Guidelines Index; đồng bộ dark mode tokens |
| v1.1 | — | Dark mode, status scale 100–900, 3 component mới, CSS output, JSON export, naming rules |
| v1.0 | — | Token system khởi tạo, 3-layer architecture |
```

---

## 4. Các Phần GIỮ NGUYÊN (không thay đổi)

| Mục | Lý do giữ |
|---|---|
| Layer 1 — Primitive Color Palette (đầy đủ bảng) | Đúng và đầy đủ |
| Layer 1 — Spacing, Radius, Font Size | Đúng |
| Layer 2 — Semantic Mapping (Light Mode) | Đúng, chỉ cập nhật dark values |
| Layer 3 — Component Tokens (Button, Input, Card, v.v.) | Đúng |
| Typography — Work Sans bảng đầy đủ | Đúng |
| CSS Custom Properties Output (code block) | Đúng |
| Figma JSON Token Export | Giữ, có thể thu gọn |
| Naming Convention & Do/Don't Rules | Đúng, giữ nguyên |
| Quy Trình Thiết Lập trong Figma (7 bước) | Giữ, chuyển xuống cuối |

---

## 5. Thứ Tự Thực Hiện

- [x] **Bước 1** — Cập nhật header và subtitle (v1.1 → v2.0)
- [x] **Bước 2** — Thêm mục "Quick Start" ngay sau header
- [x] **Bước 3** — Cập nhật Mục Lục (thêm các mục mới, thêm links đến files)
- [x] **Bước 4** — Thêm sơ đồ cấu trúc thư mục thực tế vào mục Kiến Trúc
- [x] **Bước 5** — Thêm mục "Component Library" (tóm tắt + link spec)
- [x] **Bước 6** — Thêm mục "TLP — Traffic Light Protocol"
- [x] **Bước 7** — Thêm mục "Developer Integration" (tóm tắt)
- [x] **Bước 8** — Thêm mục "Guidelines Index"
- [x] **Bước 9** — Đồng bộ dark mode token values với `color-tokens.md`
- [x] **Bước 10** — Thêm mục "Changelog"
- [x] **Bước 11** — Review tổng thể: kiểm tra tất cả links hoạt động (12/12 ✅), không còn thông tin outdated

---

## 6. Tiêu Chí Hoàn Thành

- [x] README v2.0 là **entry point duy nhất** — đọc xong biết làm gì tiếp theo
- [x] Developer mới có thể cài đặt và dùng component trong < 5 phút với Quick Start
- [x] Không còn thông tin mâu thuẫn giữa README và các file token khác
- [x] Tất cả file trong `components/`, `guidelines/`, `tokens/` đều có link từ README
- [x] TLP được document rõ ràng (security feature quan trọng)
- [x] Changelog phản ánh đúng lịch sử version

---

*Tệp kế hoạch này: `design-system/README-UPDATE-PLAN.md`*
*Cập nhật lần cuối: 2025-07 — Hoàn thành toàn bộ · Xem kết quả: [`README.md`](README.md)*
