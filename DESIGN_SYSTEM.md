# 🎨 All-in-One Atomic Design System & UI Kit
## Wikialisalabs · Community Design System v0.0

> Bộ thư viện thiết kế hoàn chỉnh theo triết lý **Atomic Design** — từng nguyên tử (atom) đến phân tử (molecule), cơ quan (organism), bản mẫu (template) đến trang (page). Được xây dựng cho sản phẩm tài chính kỹ thuật số: ví Web3, dashboard crypto, payment gateway, DeFi app.
>
> **Stack:** Astro 7 · TypeScript · SCSS · CSS Custom Properties · Work Sans
> **License:** MIT — Tự do thương mại

---

## Mục lục

1. [🌈 Colors — Hệ thống màu sắc](#1--colors--hệ-thống-màu-sắc)
2. [🆎 Typography — Chữ viết](#2--typography--chữ-viết)
3. [📐 Spacing & Radius — Khoảng cách & Bo góc](#3--spacing--radius--khoảng-cách--bo-góc)
4. [🦋 Icon Set — 5130+ SVG Icons](#4--icon-set--5130-svg-icons)
5. [💊 Controls — Nút bấm & Toggle](#5--controls--nút-bấm--toggle)
6. [🌎 Inputs & Text Fields](#6--inputs--text-fields)
7. [🪻 Tooltips & Toasters](#7--tooltips--toasters)
8. [🧑‍🎤 Avatars & Profile](#8--avatars--profile)
9. [🍄 Menubar & Navbar](#9--menubar--navbar)
10. [📆 Calendar, Date & Time Picker](#10--calendar-date--time-picker)
11. [😍 Emojis](#11--emojis)
12. [🌷 UI Kits — Bộ giao diện theo ngành](#12--ui-kits--bộ-giao-diện-theo-ngành)
13. [🦄 Sections — Khối nội dung trang](#13--sections--khối-nội-dung-trang)
14. [🥝 Full Design System — Figma Collections](#14--full-design-system--figma-collections)
15. [🙈 Cover & Thumbnail](#15--cover--thumbnail)
16. [Hướng dẫn tích hợp](#16-hướng-dẫn-tích-hợp)

---

## 1. 🌈 Colors — Hệ thống màu sắc

### Kiến trúc 3 lớp Token

```
Primitive  →  Semantic  →  Component
(giá trị)     (ý nghĩa)    (linh kiện)
```

### Brand Colors (7 màu đặc trưng)

| Tên | Token | Hex | Dùng cho |
|-----|-------|-----|----------|
| Teal | `brand/teal` | `#49DBC8` | Accent chủ đạo, logo, highlight |
| Green | `brand/green` | `#BEFF6C` | Success, confirm, yield indicator |
| Orange | `brand/orange` | `#FC7339` | Warning, CTA phụ, alert |
| Pink | `brand/pink` | `#FD9FDD` | Secondary accent, badge |
| Purple | `brand/purple` | `#AF96FB` | Governance, DAO, premium |
| Yellow | `brand/yellow` | `#FFF172` | Reward, earning, highlight |
| Grey | `brand/grey` | `#EFEFEF` | Neutral surface, divider |

### Status Colors

| Trạng thái | Token | Hex |
|-----------|-------|-----|
| Success | `status/success` | `#00D68F` |
| Warning | `status/warning` | `#FFAA00` |
| Error | `status/error` | `#FF3D71` |
| Info | `status/info` | `#0095FF` |

### Greyscale (9 bậc)

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `gs/100` | `#EDF1F7` | Background nhạt |
| `gs/200` | `#E4E9F2` | Surface |
| `gs/300` | `#C5CEE0` | Border |
| `gs/400` | `#8F9BB3` | Placeholder, muted |
| `gs/500` | `#2E3A59` | Body text secondary |
| `gs/600` | `#222B45` | Body text primary |
| `gs/700` | `#192038` | Heading |
| `gs/800` | `#151A30` | Dark surface |
| `gs/900` | `#101426` | Dark background |

### Semantic Color Modes (Light / Dark)

```css
/* Light Mode */
--color-text-primary:    #101426;
--color-text-secondary:  #2E3A59;
--color-bg-page:         #F7F8FA;
--color-bg-surface:      #FFFFFF;
--color-border:          #E4E9F2;
--color-accent:          #49DBC8;

/* Dark Mode */
--color-text-primary:    #FFFFFF;
--color-text-secondary:  #8F9BB3;
--color-bg-page:         #101426;
--color-bg-surface:      #151A30;
--color-border:          #222B45;
--color-accent:          #49DBC8;
```

---

## 2. 🆎 Typography — Chữ viết

**Font chính:** Work Sans (Google Fonts)
**Font code:** JetBrains Mono / Fira Code

### Type Scale

| Style | Token | Size | Line Height | Weight | Dùng cho |
|-------|-------|------|-------------|--------|----------|
| Display | `type/display` | 96px | 1.1 | 300–700 | Hero section |
| H1 | `type/h1` | 60px | 1.2 | 400–700 | Page title |
| H2 | `type/h2` | 48px | 1.25 | 400–700 | Section title |
| H3 | `type/h3` | 34px | 1.3 | 400–600 | Card title |
| H4 | `type/h4` | 24px | 1.4 | 400–600 | Subsection |
| H5 | `type/h5` | 20px | 1.4 | 400–600 | Widget title |
| H6 | `type/h6` | 16px | 1.5 | 500–600 | Label |
| Body LG | `type/body-lg` | 18px | 1.6 | 400–500 | Long-form text |
| Body | `type/body` | 16px | 1.6 | 400–500 | Default |
| Body SM | `type/body-sm` | 14px | 1.5 | 400–500 | Caption, meta |
| Caption | `type/caption` | 12px | 1.4 | 400–500 | Helper text |
| Overline | `type/overline` | 10px | 1.4 | 400 | UPPERCASE label |
| Code | `type/code` | 14px | 1.6 | 400 | `inline code` |

---

## 3. 📐 Spacing & Radius — Khoảng cách & Bo góc

### Spacing Scale (4px base)

| Token | Value | Dùng cho |
|-------|-------|----------|
| `space/0` | 0px | Reset |
| `space/1` | 4px | Micro gap |
| `space/2` | 8px | Tight gap |
| `space/3` | 12px | Small gap |
| `space/4` | 16px | Default gap |
| `space/5` | 20px | Medium gap |
| `space/6` | 24px | Large gap |
| `space/8` | 32px | Section gap |
| `space/10` | 40px | Large section |
| `space/12` | 48px | XL section |
| `space/16` | 64px | Hero spacing |
| `space/20` | 80px | Page spacing |
| `space/24` | 96px | Page padding |
| `space/32` | 128px | Hero padding |

### Border Radius Scale

| Token | Value | Dùng cho |
|-------|-------|----------|
| `radius/none` | 0px | Square elements |
| `radius/sm` | 4px | Input, small card |
| `radius/md` | 8px | Card, button |
| `radius/lg` | 12px | Modal, panel |
| `radius/xl` | 16px | Large card |
| `radius/2xl` | 24px | Sheet, drawer |
| `radius/3xl` | 32px | Hero card |
| `radius/full` | 9999px | Pill, avatar |

---

## 4. 🦋 Icon Set — 5130+ SVG Icons

### Thông số

- **Số lượng:** 5130+ icons outline style
- **Kích thước chuẩn:** 24×24px (viewBox)
- **Stroke width:** 1.5px
- **Format:** SVG, copy snippet React/Vue/HTML

### Danh mục Icon

| Danh mục | Số lượng ước tính | Ví dụ |
|----------|-------------------|-------|
| Finance & Crypto | 400+ | wallet, coin, chart, swap, bridge |
| UI Elements | 600+ | arrow, chevron, menu, close, search |
| Communication | 300+ | mail, chat, bell, phone, message |
| Social Media | 200+ | twitter, github, discord, telegram |
| Commerce | 250+ | cart, bag, tag, receipt, coupon |
| Media | 200+ | play, pause, camera, image, video |
| Security | 150+ | lock, shield, key, eye, fingerprint |
| Technology | 400+ | code, database, server, cloud, api |
| Navigation | 150+ | map, compass, location, route |
| People & Identity | 200+ | user, avatar, team, profile, id |
| Data & Analytics | 300+ | bar-chart, pie, trend, analytics |
| Emojis (outline) | 500+ | smile, heart, fire, star, crown |
| Flags | 250+ | Quốc kỳ các nước |
| Miscellaneous | 1130+ | Đa dạng |

### Sử dụng

```html
<!-- HTML -->
<img src="./icons/outline/wallet.svg" width="24" height="24" />

<!-- React (copy snippet) -->
<WalletIcon size={24} color="currentColor" />

<!-- CSS class -->
<span class="icon icon-wallet icon-24"></span>
```

### Icon Search (Docs App)

Truy cập `docs/index.html#/icons` → tìm kiếm real-time, click để copy snippet.

---

## 5. 💊 Controls — Nút bấm & Toggle

### Button Variants

| Variant | Token | Dùng cho |
|---------|-------|----------|
| Primary | `btn/primary` | CTA chính, submit |
| Secondary | `btn/secondary` | Action phụ |
| Ghost | `btn/ghost` | Link-style action |
| Danger | `btn/danger` | Delete, destructive |
| Success | `btn/success` | Confirm, approve |
| Outline | `btn/outline` | Border-only style |

### Button Sizes

| Size | Height | Font | Padding |
|------|--------|------|---------|
| XS | 28px | 12px | 8px 12px |
| SM | 32px | 13px | 8px 16px |
| MD (default) | 40px | 14px | 10px 20px |
| LG | 48px | 16px | 12px 24px |
| XL | 56px | 18px | 16px 32px |

### Button States

```
Default → Hover → Active → Focused → Disabled → Loading
```

### Toggle / Switch

- **Sizes:** SM (32px) / MD (40px) / LG (48px)
- **States:** Off / On / Disabled / Indeterminate
- **With label:** Left / Right position
- **Animated:** Smooth 200ms transition

### Checkbox & Radio

- **Checkbox:** Square, 16px / 20px — checked / unchecked / indeterminate
- **Radio:** Circle, 16px / 20px — selected / unselected
- **States:** Default / Hover / Active / Disabled / Error

### Segmented Control

```
[Option A] [Option B] [Option C]
```

Dùng cho: tab switching, filter, view toggle

---

## 6. 🌎 Inputs & Text Fields

### Input Types

| Type | Dùng cho |
|------|----------|
| Text | Nhập văn bản thông thường |
| Password | Ẩn ký tự, toggle show/hide |
| Number | Nhập số, có stepper +/- |
| Search | Kèm icon tìm kiếm, clear button |
| Email | Validation email |
| Phone | Mask số điện thoại, country code |
| Amount | Nhập số tiền, format tự động |
| OTP | 4-6 ô số riêng biệt có animation |
| PIN | Dot display 6 chấm ẩn |
| Textarea | Multi-line, auto-resize |

### Input States

```
Default → Focus → Filled → Error → Success → Disabled → Read-only
```

### Input Sizes

| Size | Height | Font |
|------|--------|------|
| SM | 36px | 13px |
| MD | 44px | 14px |
| LG | 52px | 16px |

### Input Anatomy

```
[Prefix Icon] [Label] [Input Text] [Suffix Icon/Action] [Clear]
              [Helper text / Error message]
              [Character count]
```

### Special Inputs

**Amount Field (tài chính):**
```
[$] [1,234,567.89] [USDT ▼]
    Available: 5,000.00 USDT [MAX]
```

**OTP Field:**
```
[■] [■] [■] [■] [■] [■]
```

**Search Field:**
```
[🔍] [Search tokens, wallets...     ] [✕]
```

---

## 7. 🪻 Tooltips & Toasters

### Tooltips

| Variant | Dùng cho |
|---------|----------|
| Default | Info ngắn khi hover |
| Rich | Nội dung phức tạp, có title + body |
| Interactive | Có nút action bên trong |

**Positions:** Top / Bottom / Left / Right / Auto

**Trigger:** Hover (300ms delay) / Click / Focus

```
[Element]
    │
    ▼
╔═══════════════╗
║  Tooltip text  ║
╚═══════════════╝
```

### Toast / Notification

| Type | Icon | Color | Auto-dismiss |
|------|------|-------|-------------|
| Success | ✓ | Green `#00D68F` | 3s |
| Error | ✗ | Red `#FF3D71` | 5s |
| Warning | ⚠ | Yellow `#FFAA00` | 4s |
| Info | ℹ | Blue `#0095FF` | 3s |
| Loading | ⟳ | Brand Teal | Manual |

**Positions:** Top-right / Top-center / Bottom-right / Bottom-center

**Variants:**
- Simple (icon + text)
- With action button
- With progress bar
- Stacked (max 3)

**Transaction Toast (Web3-specific):**
```
╔══════════════════════════════════════╗
║ ⏳ Transaction Pending               ║
║ Swap 100 USDT → 0.045 ETH           ║
║ [View on Explorer]                   ║
╚══════════════════════════════════════╝
```

---

## 8. 🧑‍🎤 Avatars & Profile

### Avatar Shapes

| Shape | Dùng cho |
|-------|----------|
| Circle | User profile, member |
| Rounded square | App icon, bot, entity |
| Square | NFT, asset thumbnail |

### Avatar Sizes

| Size | Pixel | Dùng cho |
|------|-------|----------|
| XS | 24px | Comment, list item |
| SM | 32px | Compact list |
| MD | 40px | Default |
| LG | 48px | Card header |
| XL | 64px | Profile page |
| 2XL | 96px | Profile hero |
| 3XL | 128px | Cover photo context |

### Avatar Types

- **Image:** Photo từ URL
- **Initials:** 1–2 chữ cái đầu tên (auto color từ hash)
- **Icon:** SVG icon placeholder
- **NFT:** Hiển thị NFT với verified badge

### Avatar States

```
Default → Online (green dot) → Offline (grey dot) → Busy (yellow) → Away (orange)
```

### Avatar Group

```
[A] [B] [C] +12
```

Chồng lên nhau, hiển thị số dư (+N)

### Profile Card

```
╔══════════════════════════════════╗
║  [Avatar 96px]                   ║
║  Alice.eth                        ║
║  0x1234...5678  [Copy] [QR]       ║
║  ● Online · Verified ✓            ║
║  [Follow] [Send]                  ║
╚══════════════════════════════════╝
```

---

## 9. 🍄 Menubar & Navbar

### Navbar Layouts

| Layout | Dùng cho |
|--------|----------|
| Horizontal top | Web app desktop |
| Vertical sidebar | Dashboard, admin |
| Bottom tabbar | Mobile app |
| Floating | Compact/overlay mode |

### Navbar Anatomy

```
[Logo] [Nav Links...] [Search] [Notifications] [Avatar ▼]
```

### Sidebar States

| State | Mô tả |
|-------|-------|
| Expanded | 240px, text + icon |
| Collapsed | 64px, icon only |
| Hover expand | Mở rộng khi hover |
| Mobile drawer | Slide-in overlay |

### Navbar Variants

- **Light** — Background trắng, text tối
- **Dark** — Background tối, text sáng
- **Transparent** — Overlay trên hero image
- **Sticky** — Fixed top khi scroll
- **Overlap** — Content overlap navbar

### Menu Items

```
[Icon] Label              [Badge] [Chevron]
[Icon] Label — Active ●
[Icon] Label              (Disabled)
───────────────────────   (Divider)
[Icon] Section Header
  [Icon] Sub-item
  [Icon] Sub-item
```

### Breadcrumb

```
Home > Dashboard > Wallet > Settings
```

---

## 10. 📆 Calendar, Date & Time Picker

### Date Picker

**Modes:**
- Single date
- Date range (start → end)
- Multiple dates

**Variants:**
- Inline (embedded in form)
- Popup (dropdown trigger)
- Full-page (mobile-first)

**Month Navigation:**
```
◄  October 2026  ►
Mo Tu We Th Fr Sa Su
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
```

**Quick Selects:**
```
[Today] [Yesterday] [This Week] [Last 7 Days] [Last 30 Days]
[This Month] [Last Month] [This Year] [Custom Range]
```

### Time Picker

**Variants:**
- Scroll wheel (iOS-style)
- Digital input (HH:MM:SS)
- 12h / 24h toggle
- Timezone selector

```
╔══════════════╗
║  02 : 30 PM  ║
║  ────────    ║
║  [AM] [PM]   ║
╚══════════════╝
```

### DateTime Picker

Kết hợp Calendar + Time trong một component, dùng cho:
- Lên lịch giao dịch
- Đặt giờ alarm staking
- Filter theo thời gian

### Relative Time

```
"2 minutes ago" / "in 3 hours" / "yesterday" / "Jan 15, 2026"
```

Auto-update real-time với `@axioledger/time` subscription.

---

## 11. 😍 Emojis

### Emoji Set

- **Nguồn:** Custom outline SVG emoji set (tương thích brand)
- **Số lượng:** 500+ emojis phổ biến nhất
- **Style:** Outline, consistent với icon set
- **Size:** 16px / 20px / 24px / 32px / 48px

### Emoji Categories

| Category | Emojis tiêu biểu |
|----------|-----------------|
| Smileys | 😀 😂 🥹 😍 🤩 😎 🥳 |
| Finance | 💰 💸 💳 🏦 📈 📉 💹 |
| Crypto/Web3 | 🔐 ⛓️ 🪙 💎 🚀 🌕 |
| Status | ✅ ❌ ⚠️ ℹ️ 🔴 🟡 🟢 |
| Actions | 👍 👎 🙌 💪 🤝 ✍️ |
| Nature | 🥝 🦋 🦄 🌷 🍄 🌈 |
| Objects | 🔑 🗝️ 📦 🎯 🏆 🎁 |

### Emoji Picker Component

```
╔════════════════════════════════════╗
║ 🔍 [Search emojis...            ] ║
║ ──────────────────────────────── ║
║ Recent: 😀 💰 🚀 ✅ 🎉          ║
║ ──────────────────────────────── ║
║ [Smileys] [Finance] [Crypto] ... ║
║                                   ║
║ 😀 😃 😄 😁 😆 😅 🤣 😂         ║
║ 🙂 🙃 😉 😊 😇 🥰 😍 🤩         ║
╚════════════════════════════════════╝
```

---

## 12. 🌷 UI Kits — Bộ giao diện theo ngành

### 12.1 Crypto / DeFi Kit

**Components:**
- Token card (price, change, chart sparkline)
- Portfolio overview (pie chart + list)
- Swap interface (from/to token selector)
- Liquidity pool card (APY, TVL, your share)
- Transaction history table
- Gas fee selector (Slow/Average/Fast)
- Network badge (Ethereum/Solana/Arbitrum…)
- Price chart (candlestick, line, area)

```
╔══════════════════════════════════╗
║  ETH/USDT                    ↗  ║
║  $3,245.67     +2.34%           ║
║  ▁▂▃▅▄▆▇█▆▅▄▃                  ║
║  Vol: $1.2B    MC: $389B        ║
╚══════════════════════════════════╝
```

### 12.2 Payment / Fintech Kit

**Components:**
- Virtual card (front/back flip 3D)
- Payment method selector
- Transaction receipt
- QR code display + scan
- Currency amount input (format tự động)
- Bank account card
- Transfer confirmation modal
- Payment status stepper

```
╔══════════════════════════════════╗
║ ████████████████  VISA           ║
║                                  ║
║  ···· ···· ···· 4242             ║
║  Alice Nguyen          09/29     ║
║                        CVV: ···  ║
╚══════════════════════════════════╝
```

### 12.3 Wallet / Web3 Kit

**Components:**
- Wallet connect modal (MetaMask, WalletConnect, Phantom…)
- Address display (truncated + copy + QR)
- NFT card grid
- Token list with balances
- Staking dashboard
- DAO voting card
- ZK-DID badge
- Network switcher dropdown

### 12.4 Dashboard / Analytics Kit

**Components:**
- Metric card (value, change, sparkline)
- Data table (sort, filter, pagination)
- Chart collection (bar, line, pie, area, candlestick)
- KPI overview grid
- Activity feed
- Alert / notification center
- User analytics heatmap

### 12.5 Auth / Onboarding Kit

**Components:**
- Sign in card (email/social/passkey)
- Sign up stepper
- OTP verification
- KYC document upload
- Liveness check frame
- 2FA setup
- Biometric prompt
- Welcome / empty state screens

---

## 13. 🦄 Sections — Khối nội dung trang

### Marketing Sections

| Section | Mô tả |
|---------|-------|
| Hero | Full-width headline + CTA + visual |
| Features | Grid 3–4 feature cards với icon |
| Stats | Counter bar (TPS, TVL, Users…) |
| How it works | Step-by-step numbered flow |
| Testimonials | Quote cards carousel |
| Pricing | Tier comparison table |
| FAQ | Accordion expand/collapse |
| CTA Banner | Full-width colored call-to-action |
| Footer | Multi-column links + social |

### App Sections

| Section | Mô tả |
|---------|-------|
| Page header | Title + breadcrumb + actions |
| Empty state | Icon + message + action button |
| Loading skeleton | Placeholder while fetching |
| Error state | Error icon + retry button |
| Onboarding tour | Overlay spotlight steps |
| Settings group | Label + controls list |
| Data grid | Sortable table with bulk actions |
| Infinite scroll | Load more trigger |

### Preview Pages trong Repo

Tất cả 126 trang có trong [`preview/pages/`](./preview/pages/):

```
Dashboard: index, dashboard-crm, dashboard-crypto, widgets
Auth: sign-in, sign-up, sign-in-cover, sign-in-illustration, auth-lock, forgot-password, 2-step-verification
Finance: pay, invoice, payment-providers, pricing, pricing-table
Users: profile, settings, users, avatars
Content: cards, lists, tables, datatables, datagrid, typography
Charts: charts, charts-advanced
Maps: maps, maps-vector, map-fullsize
Media: gallery, photogrid, lightbox, music, inline-player
Misc: calendar, fullcalendar, chat, email-inbox, tasks, logs
Marketing: marketing/index, marketing/about, marketing/pricing, marketing/hero
Errors: error-404, error-500, error-maintenance, trial-ended
```

---

## 14. 🥝 Full Design System — Figma Collections

### Collections Overview

| Collection | Mode | Scope |
|-----------|------|-------|
| `Primitive / Color` | Value | Greyscale 100–900 · Brand 7 colors · Status |
| `Primitive / Spacing` | Value | space/0 → space/32 |
| `Primitive / Radius` | Value | none → full (9 bậc) |
| `Primitive / Font Size` | Value | 10px → 96px |
| `Primitive / Shadow` | Value | xs → 2xl |
| `Semantic / Color` | **Light / Dark** | text · bg · surface · icon · border · status · accent |
| `Semantic / Spacing` | Default | inset · gap · component spacing |
| `Semantic / Typography` | Default | h1–h6 · body · caption · overline |
| `Component / Button` | Default | variants · sizes · states |
| `Component / Input` | Default | types · sizes · states |
| `Component / Card` | Default | variants · elevation |
| `Component / Badge` | Default | colors · sizes |
| `Component / Toggle` | Default | sizes · states |
| `Component / Avatar` | Default | shapes · sizes · types |
| `Component / Navbar` | Default | layouts · states |
| `Component / Modal` | Default | sizes · variants |
| `Component / Toast` | Default | types · positions |
| `Component / Tooltip` | Default | positions · variants |

### Token Naming Convention

```
{category}/{subcategory}/{variant}/{state}

Ví dụ:
color/text/primary          → #101426
color/bg/surface            → #FFFFFF
color/status/success        → #00D68F
spacing/inset/md            → 16px
radius/component/card       → 12px
shadow/elevation/md         → 0 4px 16px rgba(0,0,0,0.08)
```

---

## 15. 🙈 Cover & Thumbnail

### Cover Types

| Loại | Kích thước | Dùng cho |
|------|-----------|----------|
| Social Preview | 1200×630px | Twitter/OG card |
| GitHub Social | 1280×640px | Repo cover |
| Figma Cover | 1920×960px | Plugin/community thumbnail |
| App Store | 1024×1024px | App icon |
| Banner | 1500×500px | Twitter banner |
| Blog Cover | 1600×900px | Article header |
| Slide Cover | 1920×1080px | Presentation |

### Cover Components

- **Gradient overlays** — Brand teal/purple gradients
- **Pattern backgrounds** — Mesh, dot grid, circuit board
- **Logo lock-up** — Logo + wordmark + tagline
- **Screenshot frames** — Device mockups (iPhone, MacBook, Browser)
- **Data visualizations** — Mini charts, network graphs
- **Badge overlays** — "MIT Open Source", "v0.0", "Community"

### Thumbnail Kit (Preview Screens)

Bộ ảnh chụp màn hình chuẩn cho tất cả 126 trang preview:
- Light & Dark mode
- Mobile (390px) + Desktop (1280px)
- 2× retina resolution
- Automated với `preview/pages/screenshot.astro`

---

## 16. Hướng dẫn tích hợp

### Cài đặt (sau khi publish npm)

```bash
# Design tokens
npm install @wikialisalabs/tokens

# Icon set
npm install @wikialisalabs/icons

# Core components
npm install @wikialisalabs/core

# React wrappers (Milestone 2)
npm install @wikialisalabs/react

# Vue wrappers (Milestone 2)
npm install @wikialisalabs/vue
```

### Import Tokens

```css
/* CSS */
@import '@wikialisalabs/tokens/dist/tokens.css';

.my-button {
  background: var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--spacing-inset-md);
  color: var(--color-text-on-accent);
}
```

```js
// JavaScript / TypeScript
import tokens from '@wikialisalabs/tokens';

const accentColor = tokens.color.brand.teal; // '#49DBC8'
```

### Sử dụng Icon

```html
<!-- Inline SVG -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- paste icon path here -->
</svg>

<!-- React (sau M2) -->
import { WalletIcon } from '@wikialisalabs/icons/react';
<WalletIcon size={24} color="var(--color-accent)" />
```

### Chạy Docs App (Local)

```bash
cd docs
npm install
npm run dev
# → http://localhost:3000
# Routes:
#   #/          Overview
#   #/tokens    Token Explorer
#   #/icons     Icon Search (cần local server)
#   #/components Live Preview
```

### Chạy Preview App (Local)

```bash
cd preview
pnpm install
pnpm dev
# → http://localhost:4321
# Tất cả 126 trang có thể xem tại /[page-name]
```

---

## Roadmap Design System

| Milestone | Nội dung |
|-----------|----------|
| **v0.0** (hiện tại) | Preview app 126 trang · Docs app · Landing page · Tokens · Icons 5130+ |
| **v0.1** | Publish npm `@wikialisalabs/tokens`, `icons`, `core` |
| **v0.2** | `@wikialisalabs/react` + `@wikialisalabs/vue` wrappers |
| **v0.3** | Storybook (30+ component stories) |
| **v0.4** | Figma Variables sync (Style Dictionary) |
| **v1.0** | Stable release · Full API docs · WCAG 2.1 AA audit |

---

*Wikialisalabs Foundation v0.0 · Community Design System · MIT License · root@wikialisalabs.axvn.vn*
