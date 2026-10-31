# @axioledger/axio-design-system

**Phiên bản:** `6.0.0` — Unified v6 (Single Source of Truth)  
**Giấy phép:** MIT  
**Registry:** `https://registry.npmjs.org` (`@axioledger/*`, public)

---

## Tổng quan

AXIO Design System là thư viện UI/UX duy nhất phục vụ toàn bộ hệ sinh thái Axioledger:

| App / Package | Trạng thái |
|---|---|
| `apps/axiopass-wallet` | ✅ Sử dụng v6 |
| `apps/axq-governance-ui` | ✅ Sử dụng v6 |
| `packages/axq-sdk` | ✅ Không phụ thuộc CSS |
| `packages/axio-design-system` | ❌ **Đã xóa** — thay bằng `design-system/` |
| `/root/design-system` (veraciphers) | ❌ **Đã xóa** — thay bằng `design-system/` |

> **Quy tắc bất biến:** Mọi thành phần UI trong monorepo CHỈ được import từ `@axioledger/axio-design-system`.  
> Mọi giá trị màu sắc trong component source phải dùng CSS variable — không được hardcode hex.

---

## Cài đặt

```bash
# Trong monorepo (workspace:*)
pnpm add @axioledger/axio-design-system

# Public NPM
npm install @axioledger/axio-design-system
```

### Thiết lập trong Next.js App Router

```tsx
// app/layout.tsx
import '@axioledger/axio-design-system/styles';  // component CSS
import '@axioledger/axio-design-system/tokens';  // 3-layer token CSS variables

import { AxioProvider } from '@axioledger/axio-design-system';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AxioProvider theme="system" ansResolverUrl="https://ans.axqprotocol.axq">
          {children}
        </AxioProvider>
      </body>
    </html>
  );
}
```

### Thiết lập Tailwind CSS

```js
// tailwind.config.ts
import axioTokens from '@axioledger/axio-design-system/tokens/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: axioTokens,   // bơm toàn bộ AXQ token system vào Tailwind
  },
};
```

---

## Kiến trúc Token 3 Lớp

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1 — PRIMITIVE (tokens/primitive.css)                  │
│  Giá trị thô, tuyệt đối. Không alias. Không context.         │
│  --axq-p-grey-900, --axq-p-space-16, --axq-p-radius-2xl      │
└────────────────────┬─────────────────────────────────────────┘
                     │ alias ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 2 — SEMANTIC (tokens/semantic.css)                    │
│  Ánh xạ theo mục đích. Hỗ trợ Light + Dark mode.            │
│  --axq-color-text-primary, --axq-radius-button               │
│  --axq-tlp-safe, --axq-tlp-blocked ← TLP compliance tokens  │
│  --axq-shadow-sm … --axq-shadow-xl  ← Elevation              │
└────────────────────┬─────────────────────────────────────────┘
                     │ alias ↓
┌──────────────────────────────────────────────────────────────┐
│  Layer 3 — COMPONENT (tokens/component.css)                  │
│  Scoped theo từng component. Chỉ alias từ Layer 2.           │
│  --axq-c-btn-*, --axq-c-input-*, --axq-c-tlp-*              │
│  --axq-c-table-*, --axq-c-toast-*, --axq-c-drawer-*         │
└──────────────────────────────────────────────────────────────┘
```

### Import granular (tiêu thụ từng lớp riêng)

```css
@import '@axioledger/axio-design-system/tokens/primitive';
@import '@axioledger/axio-design-system/tokens/semantic';
@import '@axioledger/axio-design-system/tokens/component';
```

### Import TypeScript constants

```ts
import {
  PRIMITIVE_TOKENS, SEMANTIC_TOKENS, COMPONENT_TOKENS,
  TLP_TOKENS, TLP_CSS_VARS, resolveTLP,
  TABLE_TOKENS, TOAST_TOKENS, DRAWER_TOKENS, SHADOW,
} from '@axioledger/axio-design-system/tokens/js';
```

---

## TLP — Traffic Light Protocol (Bảo vệ pháp lý & anti-phishing)

TLP là **tuyến phòng thủ pháp lý** trên giao diện người dùng. Nó phân loại rủi ro của mọi địa chỉ / tên miền ANS mà người dùng tương tác.

### Bảng phân loại

| Level | CSS Token | TLD | Màu | Hành vi UI bắt buộc |
|---|---|---|---|---|
| **SAFE** | `--axq-tlp-safe` | `.axq` `.vrq` | `#00D68F` ✅ | Cho phép giao dịch |
| **CAUTION** | `--axq-tlp-caution` | `.kpx` | `#FFAA00` ⚠️ | Hiện disclaimer DeFi, yêu cầu xác nhận |
| **BLOCKED** | `--axq-tlp-blocked` | `0x…`, TLD lạ | `#FF3D71` 🚫 | **Disable nút Sign**, hiển thị SecurityAlert |
| **SYSTEM** | `--axq-tlp-system` | `.sqx` `.vpx` | `#2E3A59` ⚙️ | Ẩn khỏi UI người dùng cuối |

### Sử dụng trong component

```tsx
import { resolveTLP, TLP_TOKENS, NamespaceBadge, SecurityAlert } from '@axioledger/axio-design-system';

const level = resolveTLP(recipientAddress); // → 'safe' | 'caution' | 'blocked' | 'system'

// Badge hiển thị cấp độ
<NamespaceBadge name={recipientAddress} level={level} />

// Chặn giao dịch nếu BLOCKED
{level === 'blocked' && (
  <SecurityAlert level="blocked" name={recipientAddress} reason="Unknown namespace" />
)}

// CSS variable trong component styles (không hardcode hex)
// ✓ background: var(--axq-c-tlp-safe-bg);
// ✗ background: #F0FFF5;  ← BỊ CI CHẶN
```

### CSS Variables TLP

```css
/* Layer 2 — Semantic (alias → Status primitive) */
--axq-tlp-safe:          #00D68F   /* → success/500  */
--axq-tlp-safe-bg:       #F0FFF5   /* → success-bg   */
--axq-tlp-safe-text:     #00997A   /* → success-text */

--axq-tlp-caution:       #FFAA00   /* → warning/500  */
--axq-tlp-blocked:       #FF3D71   /* → error/500    */
--axq-tlp-blocked-border:#FF3D71   /* dùng cho Input border */
--axq-tlp-system:        #2E3A59   /* → grey/400     */

/* Layer 3 — Component */
--axq-c-tlp-safe-bg:     var(--axq-tlp-safe-bg)
--axq-c-tlp-blocked-border: var(--axq-tlp-blocked-border)
--axq-c-input-border-blocked: var(--axq-tlp-blocked-border)
```

---

## Component Tokens mới (v6)

### Table

```css
--axq-c-table-bg             /* surface/default   */
--axq-c-table-header-bg      /* surface/sunken    — tạo chiều sâu header */
--axq-c-table-border         /* border/subtle     */
--axq-c-table-row-hover      /* bg/secondary      */
--axq-c-table-row-selected   /* status/info-subtle */
```

### Toast / Notification

```css
--axq-c-toast-bg             /* surface/raised    — nổi lên trên content */
--axq-c-toast-radius         /* 8px               */
--axq-c-toast-shadow         /* var(--axq-shadow-lg) */
--axq-c-toast-z-index        /* 9000              */
--axq-c-toast-success-border /* status/success    */
--axq-c-toast-error-border   /* status/error      */
```

### Drawer / Bottom Sheet (Mobile Wallet)

```css
--axq-c-drawer-bg            /* surface/default   */
--axq-c-drawer-overlay       /* rgba(0,0,0,0.50)  — scrim */
--axq-c-drawer-radius-top    /* 32px (top corners only) */
--axq-c-drawer-shadow        /* var(--axq-shadow-xl) */
--axq-c-drawer-z-index       /* 8000              */
--axq-c-drawer-padding-bottom/* 40px (safe-area)  */
```

### Elevation / Shadow

```css
--axq-shadow-sm   /* subtle — cards, inputs   */
--axq-shadow-md   /* medium — dropdowns       */
--axq-shadow-lg   /* strong — toasts, modals  */
--axq-shadow-xl   /* deepest — drawers        */
```

---

## DevOps — Token Pipeline

### Figma → JSON → CSS/TS/Tailwind

```
Figma (Design Tokens plugin)
        ↓  export
design-system/tokens/color-tokens.json
design-system/tokens/typography-tokens.json
        ↓  pnpm build:tokens
tokens/variables.css      ← CSS Custom Properties (light + dark)
tokens/tokens.gen.ts      ← TypeScript constants (review trước khi merge)
tokens/tailwind.gen.js    ← Tailwind extension (review trước khi merge)
```

```bash
# Tái tạo tokens từ JSON source
pnpm build:tokens

# Kiểm tra tokens.css có up-to-date với JSON không (dùng trong CI)
pnpm build:tokens:check

# Kiểm tra hardcoded hex trong component source
pnpm check:hex

# Tái tạo SVG sprite từ /root/asset/icon
pnpm prep:icons
```

### CI/CD Pipeline (GitHub Actions)

`axio-ds-validate` job trong `.github/workflows/ci.yml` kiểm tra:

| Bước | Kiểm tra | FAIL nếu |
|---|---|---|
| 1 | package.json sanity | `name`, `version`, `license` thiếu hoặc sai |
| 2 | Component catalogue | Bất kỳ file component nào bị xóa |
| 3 | Token layer files | `primitive/semantic/component.css` thiếu |
| 4 | TLP semantic tokens | `--axq-tlp-*` biến thiếu trong `semantic.css` |
| 5 | TLP component tokens | `--axq-c-tlp-*`, `--axq-c-table-*`, v.v. thiếu |
| 6 | Barrel exports | Symbol `TLP_CSS_VARS`, `Icon`, v.v. không export |
| 7 | TLP resolution logic | `resolveTLP()` trả sai kết quả |
| 8 | **Hardcoded colour guard** | Component source chứa `#RRGGBB` hoặc `rgba()` |
| 9 | Token pipeline freshness | `variables.css` không khớp với JSON source |

> **Bước 8 & 9** hiện chạy với `|| true` (warn-only). Sau khi codebase sạch, xóa `|| true` để FAIL cứng PR.

---

## Cấu trúc thư mục

```
design-system/
├── src/
│   ├── index.ts                    # Barrel export (tất cả component + token constants)
│   ├── tokens.ts                   # TypeScript token constants (3 lớp + TLP)
│   ├── components/
│   │   ├── Button/, Input/, Card/, Badge/, Toggle/, Avatar/
│   │   ├── Modal/, Tooltip/, Navbar/, Skeleton/, OTPInput/
│   │   ├── Alert/, EmptyState/, ProgressBar/, SearchBar/
│   │   ├── Toast/, Checkbox/, Dropdown/
│   │   ├── Icon/                   # SVG sprite system (1,897 icons)
│   │   └── crypto/
│   │       ├── NamespaceBadge.tsx  # TLP badge
│   │       ├── AddressDisplay.tsx  # ANS + address resolution
│   │       ├── PasskeyButton.tsx   # WebAuthn / P-256
│   │       ├── SecurityAlert.tsx   # Anti-phishing
│   │       └── ...
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useANSResolver.ts
│   │   └── useToast.ts
│   ├── providers/
│   │   └── AxioProvider.tsx
│   └── types/
├── tokens/
│   ├── primitive.css               # Layer 1 — raw values
│   ├── semantic.css                # Layer 2 — aliases + TLP + shadow
│   ├── component.css               # Layer 3 — component-scoped + table/toast/drawer
│   ├── styles.css                  # Barrel: @import tất cả 3 lớp
│   ├── variables.css               # Legacy (auto-generated từ JSON)
│   ├── tailwind-tokens.js          # Tailwind theme extension
│   ├── color-tokens.json           # DTCG W3C format — source of truth
│   └── typography-tokens.json
├── scripts/
│   ├── build-tokens.js             # Token pipeline (JSON → CSS/TS/Tailwind)
│   ├── generate-sprite.cjs         # SVG sprite generator
│   └── check-hardcoded-hex.js      # CI: FAIL PR nếu có hardcoded hex
├── public/
│   └── sprites/
│       └── icons.svg               # 1,897 symbols (linear + bold)
├── .storybook/
├── package.json                    # @axioledger/axio-design-system v6.0.0
├── vite.lib.config.ts
├── tsconfig.json / tsconfig.lib.json
├── jest.config.ts
└── CHANGELOG.md
```

---

## Export paths

| Import path | Nội dung |
|---|---|
| `@axioledger/axio-design-system` | Tất cả component + hooks + provider + token constants |
| `.../styles` | Component CSS (merged, no runtime) |
| `.../tokens` | `variables.css` (legacy, auto-generated) |
| `.../tokens/primitive` | Layer 1 CSS |
| `.../tokens/semantic` | Layer 2 CSS (bao gồm TLP + shadow) |
| `.../tokens/component` | Layer 3 CSS (bao gồm table/toast/drawer) |
| `.../tokens/tailwind` | Tailwind theme extension |
| `.../tokens/js` | TypeScript token constants (`tokens.ts`) |
| `.../sprites` | SVG sprite sheet (`public/sprites/icons.svg`) |

---

## Scripts

```bash
pnpm build              # Full build: icons → lib → tokens → types
pnpm build:tokens       # Token pipeline: JSON → variables.css + tokens.gen.ts + tailwind.gen.js
pnpm build:tokens:check # CI mode: assert variables.css up to date
pnpm prep:icons         # Tái tạo SVG sprite + icon.types.ts
pnpm check:hex          # Scan component source cho hardcoded hex
pnpm dev                # Storybook dev server (port 6006)
pnpm test               # Jest (coverage thresholds: 70–80%)
pnpm typecheck          # TypeScript strict noEmit
pnpm lint               # ESLint
```

---

*© Axioledger Engineering — MIT License*
