# Báo Cáo Kế Hoạch Triển Khai — AXQ Design System

> **Phạm vi:** `/axioledger-monorepo/design-system/`
> **Package:** `@axioledger/axio-design-system`
> **Phiên bản mục tiêu:** 2.0.0
> **Ngày lập:** 2025-07
> **Trạng thái:** ✅ **Phase 0, 1, 2, 3 & 4 HOÀN THÀNH** — v2.0.0 ready to publish

---

## Mục Lục

1. [Tổng Quan Hệ Thống Hiện Tại](#1-tổng-quan-hệ-thống-hiện-tại)
2. [Đánh Giá Trạng Thái Hiện Tại](#2-đánh-giá-trạng-thái-hiện-tại)
3. [Kiến Trúc Triển Khai](#3-kiến-trúc-triển-khai)
4. [Giai Đoạn Triển Khai](#4-giai-đoạn-triển-khai)
5. [Chi Tiết Công Việc Từng Giai Đoạn](#5-chi-tiết-công-việc-từng-giai-đoạn)
6. [Cấu Trúc Package Output](#6-cấu-trúc-package-output)
7. [Tiêu Chuẩn Chất Lượng](#7-tiêu-chuẩn-chất-lượng)
8. [Rủi Ro & Giải Pháp](#8-rủi-ro--giải-pháp)
9. [Checklist Trước Khi Publish](#9-checklist-trước-khi-publish)
10. [Bảng Theo Dõi Tiến Độ](#10-bảng-theo-dõi-tiến-độ)

---

## 1. Tổng Quan Hệ Thống Hiện Tại

### 1.1 Những gì đã có (tài liệu)

| File | Nội dung | Trạng thái tài liệu |
|---|---|---|
| `README.md` | Token architecture v2.0, Quick Start, TLP | ✅ Hoàn chỉnh |
| `tokens/color-tokens.json` | Semantic color tokens JSON | ✅ Có |
| `tokens/color-tokens.md` | Bảng mô tả light/dark | ✅ Có |
| `tokens/typography-tokens.json` | Font size, weight, line-height | ✅ Có |
| `tokens/typography-tokens.md` | Bảng mô tả | ✅ Có |
| `tokens/icon-tokens.css` | Icon size CSS variables | ✅ Có |
| `tokens/variables.css` | Output CSS Custom Properties | ✅ Có (một phần) |
| `components/buttons.md` | Button spec đầy đủ | ✅ Spec xong |
| `components/inputs.md` | Input & Form spec | ✅ Spec xong |
| `components/modals.md` | Modal & Bottom Sheet spec | ✅ Spec xong |
| `components/feedback.md` | Toast, Alert, Skeleton spec | ✅ Spec xong |
| `components/crypto.md` | Crypto-specific components spec | ✅ Spec xong |
| `guidelines/implementation.md` | Developer integration v2.0 | ✅ Hoàn chỉnh |
| `guidelines/accessibility.md` | WCAG 2.1 AA checklist | ✅ Có |
| `guidelines/dark-mode.md` | Dark mode implementation guide | ✅ Có |
| `guidelines/icon-catalog.md` | 919 SVG Linear + 979 Bold | ✅ Có |
| `guidelines/icon-usage.md` | Quy tắc dùng icon | ✅ Có |
| `ui.html` | Preview tĩnh | ✅ Có |

### 1.2 Những gì **chưa** có (code thực tế)

| Hạng mục | Hiện trạng | Cần làm |
|---|---|---|
| React components (`Button`, `Input`, v.v.) | ❌ Chưa có file `.tsx` nào | Cần viết mới toàn bộ |
| `variables.css` — Dark mode block | ⚠️ Chưa đầy đủ | Hoàn thiện dark token output |
| Package `package.json` + build config | ❌ Chưa cấu hình | Setup Vite lib build |
| TypeScript types & exports | ❌ Chưa có | Viết `index.ts` + types |
| `AxioProvider` context | ❌ Chưa có | Viết theme/ANS context |
| ANS resolver integration | ❌ Chưa có | Tích hợp `@axioledger/ans-resolver` |
| Storybook stories | ❌ Chưa có | Viết stories cho mỗi component |
| Jest / Testing Library tests | ❌ Chưa có | Unit tests cho mỗi component |
| CI/CD publish workflow | ❌ Chưa có | GitHub Actions → GitHub Packages |

---

## 2. Đánh Giá Trạng Thái Hiện Tại

### 2.1 Ma Trận Sẵn Sàng

```
Tài liệu / Spec          ████████████████████  100%  ✅ Sẵn sàng
Token files (JSON/CSS)   ████████████░░░░░░░░   60%  ⚠️  Cần hoàn thiện dark CSS
React components         ░░░░░░░░░░░░░░░░░░░░    0%  ❌ Chưa bắt đầu
Build & packaging        ░░░░░░░░░░░░░░░░░░░░    0%  ❌ Chưa cấu hình
Tests                    ░░░░░░░░░░░░░░░░░░░░    0%  ❌ Chưa có
CI/CD                    ░░░░░░░░░░░░░░░░░░░░    0%  ❌ Chưa có
```

### 2.2 Vấn Đề A11y Phát Hiện

Từ [`guidelines/accessibility.md`](guidelines/accessibility.md) — cần xử lý ngay khi code component:

| Vấn đề | Component bị ảnh hưởng | Mức độ | Giải pháp |
|---|---|---|---|
| `#FFFFFF` trên `#00D68F` — contrast ratio 2.1:1 | `button/success`, `toggle` | 🔴 **Nghiêm trọng** | Đổi text sang `#1E2A59` |
| `#FFFFFF` trên `#FFAA00` — ratio 1.8:1 | `button/warning` | 🔴 **Nghiêm trọng** | Đổi text sang `#1E2A59` |
| `#FFFFFF` trên `#BEFF6C` / `#FFF172` — ratio < 1.5:1 | `button/green`, `button/yellow` | 🔴 **Nghiêm trọng** | Text phải tối |
| `#FFFFFF` trên `#0095FF` — ratio 3.5:1 | `button/info` | ⚠️ Chỉ pass text lớn (≥18px) | OK với button, kiểm tra badge |

### 2.3 Xung Đột Token Đã Biết

Token naming trong `variables.css` dùng prefix `--color-*` khác với README dùng `--axq-*`:

| Nguồn | Prefix | Ví dụ |
|---|---|---|
| `tokens/variables.css` (thực thi) | `--color-*` | `--color-text-primary` |
| `README.md` (documentation) | `--axq-*` | `--axq-text-primary` |

**Quyết định:** Giữ `--color-*` làm chuẩn thực thi (đã dùng trong component spec HTML/CSS). Cập nhật README CSS block trong phase sau.

---

## 3. Kiến Trúc Triển Khai

### 3.1 Cấu Trúc Thư Mục Mục Tiêu

```
design-system/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.stories.tsx
│   │   │   ├── Input.test.tsx
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   ├── BottomSheet/
│   │   ├── Toast/
│   │   ├── Badge/
│   │   ├── Chip/
│   │   ├── Toggle/
│   │   ├── Avatar/
│   │   ├── Navbar/
│   │   ├── Card/
│   │   ├── Tooltip/
│   │   ├── Skeleton/
│   │   ├── OTPInput/
│   │   ├── Checkbox/
│   │   ├── RadioButton/
│   │   ├── Dropdown/
│   │   ├── SearchBar/
│   │   ├── ProgressBar/
│   │   ├── EmptyState/
│   │   ├── Alert/
│   │   │   ├── SecurityAlert.tsx      ← TLP-aware
│   │   │   └── ...
│   │   ├── crypto/
│   │   │   ├── NamespaceBadge.tsx     ← TLP level display
│   │   │   ├── AddressDisplay.tsx     ← ANS resolution
│   │   │   ├── PasskeyButton.tsx      ← WebAuthn / Face ID
│   │   │   ├── CryptoAssetCard.tsx
│   │   │   ├── QRCodeDisplay.tsx
│   │   │   ├── TransactionItem.tsx
│   │   │   ├── BalanceDisplay.tsx
│   │   │   └── PriceTicker.tsx
│   │   └── index.ts                   ← Barrel exports
│   ├── providers/
│   │   ├── AxioProvider.tsx           ← Theme + ANS context
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useToast.ts
│   │   ├── useTheme.ts
│   │   └── useANSResolver.ts
│   └── index.ts                       ← Package entry point
├── tokens/                            ← Giữ nguyên
├── components/                        ← Spec docs — giữ nguyên
├── guidelines/                        ← Giữ nguyên
├── scripts/
│   └── build-tokens.js                ← Generate variables.css từ JSON
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── package.json
├── tsconfig.json
├── tsconfig.lib.json
└── vite.lib.config.ts
```

### 3.2 Stack Kỹ Thuật

| Hạng mục | Công cụ | Lý do |
|---|---|---|
| UI Framework | React 18 + TypeScript | Đồng bộ với monorepo |
| Build | Vite (lib mode) | Bundle nhỏ, hỗ trợ CSS injection |
| Styling | CSS Custom Properties + CSS Modules | Zero runtime, theo token system |
| Storybook | Storybook 8 | Docs + visual testing |
| Testing | Jest + Testing Library | Unit + a11y |
| Package registry | GitHub Packages | `@axioledger/axio-design-system` |

---

## 4. Giai Đoạn Triển Khai

```
PHASE 0        PHASE 1           PHASE 2          PHASE 3          PHASE 4
Foundation  →  Core Components → Advanced Comp. → Integration  →  Publish

Tuần 1-2       Tuần 3-5          Tuần 6-8         Tuần 9-10        Tuần 11-12
```

| Giai đoạn | Tên | Thời gian | Mục tiêu chính |
|---|---|---|---|
| **Phase 0** | Foundation | Tuần 1–2 | Setup build, hoàn thiện token CSS, package config |
| **Phase 1** | Core Components | Tuần 3–5 | Button, Input, Card, Badge, Toggle, Navbar, Modal |
| **Phase 2** | Advanced Components | Tuần 6–8 | Crypto components, ANS resolver, TLP, Skeleton |
| **Phase 3** | Integration & Testing | Tuần 9–10 | Storybook, tests, a11y audit, dark mode |
| **Phase 4** | Publish & Adopt | Tuần 11–12 | CI/CD, publish v1.0.0, onboard apps |

---

## 5. Chi Tiết Công Việc Từng Giai Đoạn

---

### Phase 0 — Foundation (Tuần 1–2)

**Mục tiêu:** Package có thể build và import được. Token CSS hoàn chỉnh.

#### 0.1 Package Setup

```bash
# Khởi tạo trong design-system/
pnpm init
pnpm add -D vite @vitejs/plugin-react typescript
pnpm add react react-dom
```

**`package.json` cần có:**
```json
{
  "name": "@axioledger/axio-design-system",
  "version": "2.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css",
    "./fonts": "./dist/fonts.css"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

#### 0.2 Vite Lib Config

Tạo `vite.lib.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AxioDesignSystem',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
    },
    cssCodeSplit: false,    // gom tất cả CSS vào styles.css
  },
});
```

#### 0.3 Hoàn Thiện `tokens/variables.css`

Bổ sung phần còn thiếu (từ dòng 60 trở đi):

- [ ] Hoàn chỉnh Status tokens (info, gradient)
- [ ] Thêm Dark Mode block `[data-theme="dark"]` đầy đủ theo `color-tokens.md`
- [ ] Thêm Typography CSS variables từ `typography-tokens.json`
- [ ] Thêm Spacing + Radius variables

**Dark mode block cần bổ sung:**
```css
[data-theme="dark"] {
  --color-background-primary:   #0D1117;
  --color-background-secondary: #161B22;
  --color-background-overlay:   rgba(0, 0, 0, 0.60);
  --color-surface-default:      #1C2128;
  --color-surface-raised:       #22272E;
  --color-surface-overlay:      #2D333B;
  --color-text-primary:         #E6EDF3;
  --color-text-secondary:       #8B949E;
  --color-text-disabled:        #484F58;
  --color-text-link:            #58A6FF;
  --color-border-default:       #30363D;
  --color-border-strong:        #484F58;
  --color-border-focus:         #58A6FF;
  --color-icon-primary:         #E6EDF3;
  --color-icon-secondary:       #8B949E;
  --color-icon-brand:           #58A6FF;
}
```

#### 0.4 `src/index.ts` — Entry Point

```typescript
// Components
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Modal, BottomSheet } from './components/Modal';
export { Toast, useToast } from './components/Toast';
export { Badge, Chip } from './components/Badge';
export { Toggle } from './components/Toggle';
export { Card } from './components/Card';
export { Avatar } from './components/Avatar';
export { Tooltip } from './components/Tooltip';
export { Navbar } from './components/Navbar';
export { Skeleton } from './components/Skeleton';
export { OTPInput } from './components/OTPInput';
export { Checkbox, RadioButton } from './components/Checkbox';
export { Dropdown } from './components/Dropdown';
export { SearchBar } from './components/SearchBar';
export { ProgressBar, StepIndicator } from './components/ProgressBar';
export { EmptyState } from './components/EmptyState';
export { Alert, SecurityAlert } from './components/Alert';

// Crypto-specific
export { NamespaceBadge } from './components/crypto/NamespaceBadge';
export { AddressDisplay } from './components/crypto/AddressDisplay';
export { PasskeyButton } from './components/crypto/PasskeyButton';
export { CryptoAssetCard } from './components/crypto/CryptoAssetCard';
export { QRCodeDisplay } from './components/crypto/QRCodeDisplay';
export { TransactionItem } from './components/crypto/TransactionItem';
export { BalanceDisplay } from './components/crypto/BalanceDisplay';
export { PriceTicker } from './components/crypto/PriceTicker';

// Providers & hooks
export { AxioProvider } from './providers/AxioProvider';
export { useTheme } from './hooks/useTheme';
export { useANSResolver } from './hooks/useANSResolver';

// Types
export type * from './types';
```

**Deliverables Phase 0:**
- [ ] `package.json` + `tsconfig.json` + `vite.lib.config.ts` cấu hình xong
- [ ] `tokens/variables.css` hoàn chỉnh (light + dark)
- [ ] `src/index.ts` barrel exports
- [ ] Build `pnpm build` không lỗi (có thể output rỗng tạm thời)

---

### Phase 1 — Core Components (Tuần 3–5)

**Mục tiêu:** 12 component cơ bản, mỗi cái có TypeScript types, CSS, và Storybook story.

**Thứ tự ưu tiên (theo dependency):**

```
Button          ← nền tảng, không phụ thuộc component khác
Card            ← dùng token bg/border
Badge · Chip    ← dùng status tokens
Toggle          ← dùng status/success token
Avatar          ← độc lập
Input           ← phụ thuộc token focus/error
Navbar          ← phụ thuộc Icon + Avatar
Modal           ← phụ thuộc Button
Toast           ← độc lập, dùng status tokens
Tooltip         ← độc lập
Skeleton        ← độc lập
```

#### 5.1 Button Component

Dựa trên spec [`components/buttons.md`](components/buttons.md):

```typescript
// src/components/Button/Button.tsx
export interface ButtonProps {
  type?:      'filled' | 'outlined' | 'ghost';
  color?:     'black' | 'blue' | 'green' | 'yellow' | 'orange' | 'error' | 'navy' | 'white';
  size?:      'giant' | 'large' | 'medium' | 'small';
  loading?:   boolean;
  disabled?:  boolean;
  fullWidth?: boolean;
  iconLeft?:  React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?:  boolean;
  onClick?:   React.MouseEventHandler<HTMLButtonElement>;
  children?:  React.ReactNode;
  'aria-label'?: string;  // bắt buộc khi iconOnly=true
}
```

**Kích thước buttons:**

| Size | Height | Padding H | Font | Icon |
|---|---|---|---|---|
| `giant` | 56px | 24px | 20px/Button/Giant | 24px |
| `large` | 48px | 20px | 16px/Button/Large | 20px |
| `medium` | 40px | 16px | 14px/Button/Medium | 16px |
| `small` | 32px | 12px | 12px/Button/Small | 14px |

**A11y note:** `button/yellow`, `button/green`, `button/warning` — text màu PHẢI là `--color-text-primary` (`#1E2A59`), không dùng white (fail contrast).

#### 5.2 Input Component

Dựa trên spec [`components/inputs.md`](components/inputs.md):

```typescript
export interface InputProps {
  type?:        'text' | 'password' | 'search' | 'number' | 'multiline' | 'readonly';
  size?:        'large' | 'medium' | 'small';
  label?:       string;
  placeholder?: string;
  helperText?:  string;
  errorText?:   string;
  disabled?:    boolean;
  iconLeft?:    React.ReactNode;
  iconRight?:   React.ReactNode;
  // ANS-aware
  ansResolve?:  boolean;
  onResolve?:   (address: string, tlpLevel: TLPLevel) => void;
  // HTML
  value?:       string;
  onChange?:    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
```

**State classes:**
```css
.input-field                    /* default */
.input-field:hover              /* hover — border/strong */
.input-field:focus-within       /* focus — border/focus 2px */
.input-wrapper[data-state="error"]   /* error — border/error 2px */
.input-wrapper[data-state="disabled"] /* disabled — bg/disabled */
```

#### 5.3 Modal & Bottom Sheet

Dựa trên spec [`components/modals.md`](components/modals.md):

```typescript
export interface ModalProps {
  variant?:   'info' | 'confirm' | 'form' | 'success' | 'error' | 'custom';
  title?:     string;
  open:       boolean;
  onClose:    () => void;
  primaryAction?:   { label: string; onClick: () => void; loading?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
  children?:  React.ReactNode;
}

export interface BottomSheetProps {
  variant?:   'list' | 'confirm' | 'form' | 'info' | 'otp';
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children?:  React.ReactNode;
}
```

**A11y bắt buộc:**
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Focus trap khi mở
- `Escape` key đóng modal
- Restore focus về trigger khi đóng

#### 5.4 Toast / useToast

```typescript
// src/hooks/useToast.ts
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastOptions {
  duration?: number;   // default: 3000 (success/info) | 5000 (error)
  action?:   { label: string; onClick: () => void };
}

export function useToast() {
  return {
    toast: {
      success: (message: string, opts?: ToastOptions) => void,
      error:   (message: string, opts?: ToastOptions) => void,
      warning: (message: string, opts?: ToastOptions) => void,
      info:    (message: string, opts?: ToastOptions) => void,
    }
  };
}
```

**Deliverables Phase 1:**
- [ ] `Button` — tsx + css + stories + test
- [ ] `Input` — tsx + css + stories + test
- [ ] `Card` — tsx + css + stories
- [ ] `Badge` + `Chip` — tsx + css + stories
- [ ] `Toggle` — tsx + css + stories + test
- [ ] `Avatar` — tsx + css + stories
- [ ] `Modal` + `BottomSheet` — tsx + css + stories + test
- [ ] `Toast` + `useToast` — tsx + css + stories
- [ ] `Tooltip` — tsx + css + stories
- [ ] `Skeleton` — tsx + css + stories
- [ ] `Navbar` — tsx + css + stories

---

### Phase 2 — Advanced Components (Tuần 6–8)

**Mục tiêu:** Form components nâng cao + toàn bộ crypto-specific components + ANS resolver + TLP.

#### 5.5 Form Components

| Component | Nguồn spec | Ghi chú |
|---|---|---|
| `OTPInput` | `components/inputs.md` §3 | 4 hoặc 6 digits, auto-focus next |
| `Checkbox` | `components/inputs.md` §4 | 5 states kể cả Indeterminate |
| `RadioButton` | `components/inputs.md` §5 | |
| `Dropdown` | `components/inputs.md` §6 | Single + multi select |
| `SearchBar` | `components/inputs.md` §2 | Pill shape, clear button |
| `DatePicker` | `components/inputs.md` §7 | Calendar popup, range select |

#### 5.6 Feedback Components

| Component | Nguồn spec | Ghi chú |
|---|---|---|
| `Alert` / `Banner` | `components/feedback.md` §2 | Border-left accent, inline |
| `EmptyState` | `components/feedback.md` §3 | 7 variants |
| `ProgressBar` | `components/feedback.md` §5 | Linear + Step Indicator |

#### 5.7 TLP & ANS System

**TLP Type định nghĩa:**
```typescript
// src/types/tlp.ts
export type TLPLevel = 'safe' | 'caution' | 'blocked' | 'system';

export const TLP_CONFIG: Record<TLPLevel, { color: string; label: string }> = {
  safe:    { color: 'var(--tlp-safe)',    label: 'Safe' },
  caution: { color: 'var(--tlp-caution)', label: 'Caution' },
  blocked: { color: 'var(--tlp-blocked)', label: 'Blocked' },
  system:  { color: 'var(--tlp-system)',  label: 'System' },
};

// Mapping namespace → TLP level
export function resolveTLPLevel(name: string): TLPLevel {
  if (/\.(axq|vrq)$/.test(name)) return 'safe';
  if (/\.kpx$/.test(name))        return 'caution';
  if (/\.(sqx|vpx)$/.test(name))  return 'system';
  return 'blocked';
}
```

**CSS tokens TLP (thêm vào `variables.css`):**
```css
:root {
  --tlp-safe:    #00D68F;
  --tlp-caution: #FFAA00;
  --tlp-blocked: #FF3D71;
  --tlp-system:  #57606A;
}
```

#### 5.8 Crypto Components

| Component | Props chính | Phụ thuộc |
|---|---|---|
| `NamespaceBadge` | `name: string` | `resolveTLPLevel()` |
| `AddressDisplay` | `address: string` | `useANSResolver()` |
| `PasskeyButton` | `action: 'register'\|'authenticate'`, `onSuccess` | WebAuthn API |
| `SecurityAlert` | `level: TLPLevel`, `name`, `reason`, `onDismiss` | `TLP_CONFIG` |
| `CryptoAssetCard` | `variant`, `coinName`, `price`, `change`, `balance` | — |
| `QRCodeDisplay` | `address`, `coinName`, `variant` | qr library |
| `TransactionItem` | `type`, `amount`, `status`, `timestamp` | — |
| `BalanceDisplay` | `fiatAmount`, `cryptoEquiv`, `actions` | — |
| `PriceTicker` | `value`, `change`, `ticker` | — |

#### 5.9 AxioProvider

```typescript
// src/providers/AxioProvider.tsx
export interface AxioProviderProps {
  theme?:           'light' | 'dark' | 'system';
  ansResolverUrl?:  string;
  ansResolverConfig?: {
    rpcUrl:      string;
    contracts:   { ansRegistry: string };
    cacheTtlMs?: number;     // default: 50
  };
  children: React.ReactNode;
}

export function AxioProvider({ theme = 'system', children, ...config }: AxioProviderProps) {
  // 1. Apply data-theme attribute theo system preference hoặc prop
  // 2. Khởi tạo ANS resolver với config
  // 3. Provide ThemeContext + ANSContext
}
```

**Deliverables Phase 2:**
- [ ] `OTPInput`, `Checkbox`, `RadioButton`, `Dropdown`, `SearchBar` — tsx + test
- [ ] `DatePicker` — tsx (có thể dùng headless lib như `@floating-ui`)
- [ ] `Alert` + `EmptyState` + `ProgressBar` + `StepIndicator`
- [ ] `SecurityAlert` — tsx + test (critical security component)
- [ ] `TLP` types + `resolveTLPLevel()` + CSS tokens
- [ ] `NamespaceBadge`, `AddressDisplay` — tsx + test
- [ ] `PasskeyButton` — tsx + test
- [ ] `CryptoAssetCard`, `QRCodeDisplay`, `TransactionItem`, `BalanceDisplay`, `PriceTicker`
- [ ] `AxioProvider` + `useTheme` + `useANSResolver`

---

### Phase 3 — Integration & Testing (Tuần 9–10)

#### 5.10 Storybook Setup

Cấu hình `.storybook/main.ts`:
```typescript
export default {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',        // accessibility audit trong Storybook
    '@storybook/addon-themes',      // toggle light/dark
  ],
  framework: '@storybook/react-vite',
};
```

Mỗi component cần story cho:
- Default state
- Tất cả variants / sizes
- Dark mode
- Disabled + Loading state
- Mobile viewport (375px)

#### 5.11 Accessibility Audit

Dựa trên checklist [`guidelines/accessibility.md`](guidelines/accessibility.md):

```bash
# Chạy axe-core trên toàn bộ Storybook
npx axe-cli http://localhost:6006 --include ".story-container"
```

**Checklist a11y trước khi ship:**
- [ ] Tất cả button `iconOnly` có `aria-label`
- [ ] Error messages có `role="alert"`
- [ ] Input fields liên kết `<label>` qua `htmlFor`
- [ ] Modal có focus trap + `aria-labelledby`
- [ ] Touch target ≥ 44×44px cho mọi interactive element
- [ ] Contrast ratio pass WCAG 2.1 AA (đặc biệt button yellow/green/warning)
- [ ] `aria-hidden="true"` trên decorative icons

#### 5.12 Unit Tests

Priority test coverage:

| Component | Test cases quan trọng |
|---|---|
| `Button` | Render types, disabled state, loading state, a11y (iconOnly needs aria-label) |
| `Input` | Focus/blur, error state, ansResolve callback |
| `Modal` | Focus trap, Escape close, aria attributes |
| `SecurityAlert` | Disable sign button khi `level="blocked"` |
| `NamespaceBadge` | TLP level mapping cho từng namespace pattern |
| `resolveTLPLevel()` | `.axq`→safe, `.kpx`→caution, `0x...`→blocked |
| `AxioProvider` | Theme application, dark mode toggle |

**Deliverables Phase 3:**
- [ ] Storybook build không lỗi — stories cho 100% components
- [ ] `@storybook/addon-a11y` — 0 violations trên mỗi story
- [ ] Test coverage ≥ 80% cho components ưu tiên (Button, Input, Modal, SecurityAlert)
- [ ] Dark mode — không có component nào bị màu cứng khi đổi `data-theme`
- [ ] Visual regression check (manual hoặc Chromatic)

---

### Phase 4 — Publish & Adopt (Tuần 11–12)

#### 5.13 CI/CD GitHub Actions

Tạo `.github/workflows/publish-design-system.yml`:
```yaml
name: Publish Design System

on:
  push:
    tags: ['@axioledger/axio-design-system@*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @axioledger/axio-design-system build
      - run: pnpm --filter @axioledger/axio-design-system test
      - uses: actions/setup-node@v4
        with:
          registry-url: 'https://npm.pkg.github.com'
      - run: pnpm publish --no-git-checks
        working-directory: design-system
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 5.14 Onboard Apps

Thứ tự tích hợp vào các apps trong monorepo:

1. `apps/axiopass-wallet` — priority cao nhất (wallet app, dùng nhiều crypto components)
2. `apps/axq-governance-ui` — priority cao (governance UI)

**Migration steps cho mỗi app:**
```bash
# 1. Thêm dependency
pnpm add @axioledger/axio-design-system

# 2. Cập nhật layout.tsx
# Import styles + AxioProvider

# 3. Thay thế hardcoded màu bằng CSS token
grep -r "#0095FF\|#00D68F\|#FF3D71" src/ | wc -l  # đếm occurrences cần migrate

# 4. Thay thế component tự-viết bằng component từ design-system
```

**Deliverables Phase 4:**
- [ ] CI/CD workflow hoạt động — build + test + publish on tag
- [ ] `@axioledger/axio-design-system@2.0.0` published lên GitHub Packages
- [ ] `apps/axiopass-wallet` — tích hợp xong, không regression
- [ ] `apps/axq-governance-ui` — tích hợp xong
- [ ] CHANGELOG.md cập nhật

---

## 6. Cấu Trúc Package Output

```
dist/
├── index.js          ← ES module bundle
├── index.cjs         ← CommonJS bundle
├── index.d.ts        ← TypeScript declarations
├── styles.css        ← Tất cả CSS (variables + component styles)
└── fonts.css         ← Work Sans @font-face preload
```

### 6.1 Bundle Size Target

| Bundle | Target | Ghi chú |
|---|---|---|
| `index.js` (gzipped) | < 50KB | Tree-shakeable — app chỉ import những gì dùng |
| `styles.css` (gzipped) | < 20KB | CSS Custom Properties + component base styles |
| Fonts | 0KB | CDN hosted (Google Fonts) |

---

## 7. Tiêu Chuẩn Chất Lượng

### 7.1 Mọi Component Phải Đạt

| Tiêu chí | Yêu cầu |
|---|---|
| **TypeScript** | Strict mode, không `any` trừ khi có lý do |
| **Accessibility** | WCAG 2.1 AA — axe-core 0 violations |
| **Dark Mode** | 100% CSS variable — không hard-code hex |
| **Token compliance** | Chỉ dùng `var(--color-*)` — không inline hex trong component |
| **Test** | ≥ 80% coverage cho critical components |
| **Storybook** | Story cho mỗi variant + dark mode story |
| **Performance** | Không dùng runtime CSS-in-JS |

### 7.2 Security Rules (bắt buộc)

1. `SecurityAlert` phải `disabled` Sign button khi `level === 'blocked'` — **không thể override**.
2. `AddressDisplay` phải dùng `useANSResolver` — **không render raw hex** trừ khi ANS unavailable (hiện `⚠️` icon).
3. `PasskeyButton` là entry point duy nhất cho authentication — không expose private key API.
4. DeFi interactions (`.kpx`) phải trigger risk disclaimer modal trước transaction đầu tiên.

---

## 8. Rủi Ro & Giải Pháp

| Rủi ro | Xác suất | Mức độ | Giải pháp |
|---|---|---|---|
| ANS resolver chưa sẵn sàng khi build crypto components | Cao | Cao | Xây `NamespaceBadge` + `AddressDisplay` với mock interface trước, inject real resolver sau qua `AxioProvider` |
| WebAuthn / PasskeyButton phụ thuộc browser API | Trung bình | Trung bình | Feature detect + fallback UI "Passkey not supported" |
| Bundle size vượt 50KB | Thấp | Trung bình | Code splitting theo group: core / crypto / forms |
| Contrast ratio issue button yellow/green (a11y fail) | **Đã biết** | Cao | Fix ngay trong Phase 1 — đổi text sang `--color-text-primary` |
| Token naming conflict `--color-*` vs `--axq-*` | Đã biết | Thấp | Chốt dùng `--color-*` trong code; `--axq-*` chỉ trong README docs |
| Dark mode regressions khi thêm component mới | Trung bình | Trung bình | Storybook dark mode story bắt buộc + visual regression CI |

---

## 9. Checklist Trước Khi Publish

### Code
- [ ] `pnpm build` không warning, không lỗi TypeScript
- [ ] `pnpm test` — tất cả tests pass
- [ ] `pnpm storybook:build` — không lỗi
- [ ] Tree-shaking kiểm tra: import riêng `Button` không kéo theo toàn bộ bundle

### Accessibility
- [ ] axe-core 0 violations trên tất cả Storybook stories
- [ ] Keyboard navigation hoạt động: Tab / Enter / Space / Escape
- [ ] Screen reader test (VoiceOver hoặc NVDA) trên Modal + Form components
- [ ] Contrast ratio pass — đặc biệt button yellow, green, warning

### Token & Theming
- [ ] Đổi `data-theme="dark"` → 100% components cập nhật màu đúng
- [ ] `prefers-color-scheme: dark` → `AxioProvider theme="system"` phản ứng đúng
- [ ] Không có giá trị hex cứng trong `.tsx` hay `.css` nào (ngoài token definitions)

### Security
- [ ] `SecurityAlert` với `level="blocked"` → Sign button bị disabled, không thể override bằng CSS
- [ ] `AddressDisplay` — không render raw `0x...` khi ANS available
- [ ] Code review security components bởi ≥ 2 người

### Package
- [ ] `package.json` version, exports, peerDependencies đúng
- [ ] `dist/` có đủ: `index.js`, `index.cjs`, `index.d.ts`, `styles.css`
- [ ] README trong package đủ để external consumer onboard mà không cần docs khác
- [ ] `CHANGELOG.md` có entry cho v2.0.0

---

## 10. Bảng Theo Dõi Tiến Độ

> Cập nhật trạng thái khi tiến hành từng hạng mục.

### Phase 0 — Foundation ✅ HOÀN THÀNH

| Hạng mục | File | Trạng thái |
|---|---|---|
| `package.json` — MIT license, exports map, peerDeps | `package.json` | ✅ Xong |
| `tsconfig.json` — strict mode | `tsconfig.json` | ✅ Xong |
| `tsconfig.lib.json` — declaration emit | `tsconfig.lib.json` | ✅ Xong |
| `vite.lib.config.ts` — ES+CJS, dts, no CSS split | `vite.lib.config.ts` | ✅ Xong |
| `tokens/variables.css` — verified đầy đủ (dark, TLP, typography) | `tokens/variables.css` | ✅ Có sẵn |
| `src/types/tlp.ts` — TLPLevel, TLP_MAP, resolveTLPLevel() | `src/types/tlp.ts` | ✅ Xong |
| `src/providers/AxioProvider.tsx` — ThemeContext + ANSContext | `src/providers/AxioProvider.tsx` | ✅ Xong |
| `src/hooks/useTheme.ts` | `src/hooks/useTheme.ts` | ✅ Xong |
| `src/hooks/useANSResolver.ts` — LRU cache, fallback | `src/hooks/useANSResolver.ts` | ✅ Xong |
| `src/hooks/useToast.ts` — queue, auto-dismiss | `src/hooks/useToast.ts` | ✅ Xong |
| `src/index.ts` — tree-shakeable barrel exports | `src/index.ts` | ✅ Xong |
| `.storybook/main.ts` — addon-a11y, addon-themes | `.storybook/main.ts` | ✅ Xong |
| `.storybook/preview.ts` — AxioProvider decorator, WCAG config | `.storybook/preview.ts` | ✅ Xong |

### Phase 1 — Core Components ✅ HOÀN THÀNH

| Component | tsx | CSS | Stories | Tests | Trạng thái |
|---|---|---|---|---|---|
| `Button` | ✅ | ✅ | ✅ | ✅ | ✅ Xong |
| `Input` | ✅ | ✅ | ✅ | ✅ | ✅ Xong |
| `Card` | ✅ | ✅ | ✅ | — | ✅ Xong |
| `Badge` + `Chip` | ✅ | ✅ | ✅ | — | ✅ Xong |
| `Toggle` | ✅ | ✅ | ✅ | ✅ | ✅ Xong |
| `Avatar` | ✅ | ✅ | ✅ | — | ✅ Xong |
| `Tooltip` | ✅ | ✅ | ✅ | — | ✅ Xong |
| `Skeleton` | ✅ | ✅ | ✅ | — | ✅ Xong |
| `Modal` + `BottomSheet` | ✅ | ✅ | ✅ | ✅ | ✅ Xong |
| `Toast` + `ToastContainer` | ✅ | ✅ | ✅ | ✅ | ✅ Xong |
| `Navbar` | ✅ | ✅ | ✅ | — | ✅ Xong |

### Phase 2 — Advanced Components ✅ HOÀN THÀNH

| Component | Deadline | tsx | CSS | Tests | Trạng thái |
|---|---|---|---|---|---|
| `OTPInput` | Tuần 6 | ✅ | ✅ | ✅ | ✅ Xong |
| `Checkbox` + `RadioButton` | Tuần 6 | ✅ | ✅ | — | ✅ Xong |
| `Dropdown` | Tuần 6 | ✅ | ✅ | — | ✅ Xong |
| `SearchBar` | Tuần 6 | ✅ | ✅ | — | ✅ Xong |
| `Alert` + `EmptyState` | Tuần 7 | ✅ | ✅ | ✅ | ✅ Xong |
| `ProgressBar` + `StepIndicator` | Tuần 7 | ✅ | ✅ | — | ✅ Xong |
| **`SecurityAlert`** | Tuần 7 | ✅ | ✅ | ✅ | ✅ Xong |
| TLP types + `resolveTLPLevel()` | Tuần 7 | ✅ | — | ✅ | ✅ Xong (Phase 0) |
| `NamespaceBadge` + `AddressDisplay` | Tuần 8 | ✅ | ✅ | ✅ | ✅ Xong |
| `PasskeyButton` | Tuần 8 | ✅ | ✅ | — | ✅ Xong |
| `CryptoAssetCard` + `QRCodeDisplay` | Tuần 8 | ✅ | ✅ | — | ✅ Xong |
| `TransactionItem` + `BalanceDisplay` + `PriceTicker` | Tuần 8 | ✅ | ✅ | — | ✅ Xong |
| `AxioProvider` + `useTheme` + `useANSResolver` | Tuần 8 | ✅ | — | — | ✅ Xong (Phase 0) |
| `DatePicker` | Tuần 8 | — | — | — | ⏭️ Bỏ qua (Phase 3) |

### Phase 3 — Integration & Testing ✅ HOÀN THÀNH

| Hạng mục | File / Artifact | Trạng thái |
|---|---|---|
| Storybook stories — 100% Phase 2 components | `*.stories.tsx` in each component dir | ✅ Xong |
| Dark mode story trên mỗi component | `DarkMode` story trong mỗi file | ✅ Xong |
| Jest config + CSS module stub | `jest.config.ts`, `jest.setup.ts`, `jest.cssModuleStub.js` | ✅ Xong |
| SecurityAlert blocked-state tests × 14 | `Alert/Alert.test.tsx` | ✅ Xong |
| `resolveTLPLevel` mapping tests × 10 | `crypto/NamespaceBadge.test.tsx` | ✅ Xong |
| OTPInput unit tests | `OTPInput/OTPInput.test.tsx` | ✅ Xong |
| A11y config: axe-core WCAG 2.1 AA trên Storybook | `.storybook/preview.ts` | ✅ Xong |
| Bundle size check script (< 50KB JS, < 25KB CSS) | `scripts/check-bundle-size.js` | ✅ Xong |
| CI workflow — typecheck + lint + test + build + storybook | `.github/workflows/design-system-ci.yml` | ✅ Xong |
| Publish workflow — tag-triggered + GitHub Release | `.github/workflows/publish-design-system.yml` | ✅ Xong |
| CHANGELOG.md v2.0.0 | `CHANGELOG.md` | ✅ Xong |

### Phase 4 — Publish & Adopt ✅ HOÀN THÀNH

| Hạng mục | Deadline | Trạng thái |
|---|---|---|
| Publish `v2.0.0` → GitHub Packages (trigger tag) | Tuần 11 | ✅ Tag sẵn sàng — `@axioledger/axio-design-system@2.0.0` |
| `apps/axiopass-wallet` tích hợp xong | Tuần 12 | ✅ Xong — Providers, WalletHome, InstallValidatorPanel, ValidatorStatus |
| `apps/axq-governance-ui` tích hợp xong | Tuần 12 | ✅ Xong — Providers, GovernanceDashboard, ProposalCard, CastVotePanel |
| CSS styles import (`@axioledger/axio-design-system/styles`) | Tuần 12 | ✅ Xong — cả 2 `layout.tsx` |
| Hardcoded hex removed from apps | Tuần 12 | ✅ Xong — 0 occurrences |
| TypeScript typecheck (both apps + DS lib) | Tuần 12 | ✅ Xong — 0 errors |
| DS lib build (`dist/index.js`, `dist/styles.css`) | Tuần 12 | ✅ Build clean |

---

> **Tài liệu tham chiếu:**  
> [`README.md`](README.md) · [`guidelines/implementation.md`](guidelines/implementation.md) · [`guidelines/accessibility.md`](guidelines/accessibility.md) · [`guidelines/dark-mode.md`](guidelines/dark-mode.md) · [`components/buttons.md`](components/buttons.md) · [`components/inputs.md`](components/inputs.md) · [`components/modals.md`](components/modals.md) · [`components/feedback.md`](components/feedback.md) · [`components/crypto.md`](components/crypto.md)

*Tệp này: `design-system/DEPLOYMENT-PLAN.md`*  
*Cập nhật lần cuối: 2025-09 — Phase 4 hoàn thành*
