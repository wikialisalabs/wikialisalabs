# Icon System — Axioledger Design System
## Tài liệu Sử dụng & Tích hợp

> **Nguồn icon:** `asset/icon/linear/` (919 SVG) · `asset/icon/bold/` (979 SVG)
> **Không dùng emoji bên ngoài** — toàn bộ icon từ SVG nội bộ
> **CSS:** [`design-system/tokens/icon-tokens.css`](../tokens/icon-tokens.css)

---

## 1. NGUYÊN TẮC CỐT LÕI

SVG trong `asset/icon/` có stroke hardcode (`stroke="#101426"`). Để icon **tự động đổi màu** theo theme (Light/Dark) và các color token, cần dùng `currentColor`.

**Quy tắc:**
- Wrap SVG trong `<span class="icon">` → CSS override `stroke: currentColor`
- Đặt màu trên element cha → tất cả icon con kế thừa
- **Không** nhúng `fill` hay `stroke` trực tiếp vào thẻ HTML

---

## 2. CÁC BIẾN TOKEN (icon-tokens.css)

### Color Tokens
| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `--icon-primary` | `#1E2A59` | `#E8EBF4` | Icon mặc định |
| `--icon-secondary` | `#57606A` | `#8B95A8` | Icon phụ, muted |
| `--icon-disabled` | `#B0BAC9` | `#3D4558` | Trạng thái vô hiệu |
| `--icon-brand` | `#0095FF` | `#41B3FF` | Icon nhấn mạnh, CTA |
| `--icon-success` | `#22C55E` | `#34D399` | Thành công, confirmed |
| `--icon-warning` | `#F59E0B` | `#FBBF24` | Cảnh báo |
| `--icon-error` | `#EF4444` | `#F87171` | Lỗi, nguy hiểm |
| `--icon-crypto` | `#AF96FB` | `#C4B5FD` | Crypto currency icons |
| `--icon-rwa` | `#F59E0B` | `#FCD34D` | RWA / tài sản thể chế |

### Size Tokens
| Token | Giá trị | Class | Dùng cho |
|---|---|---|---|
| `--icon-size-xs` | 12px | `.icon--xs` | Label inline nhỏ |
| `--icon-size-sm` | 16px | `.icon--sm` | Input prefix/suffix |
| `--icon-size-md` | 20px | `.icon--md` | Navigation item |
| `--icon-size-base` | 24px | `.icon--base` | **Mặc định** |
| `--icon-size-lg` | 32px | `.icon--lg` | Card, Section header |
| `--icon-size-xl` | 40px | `.icon--xl` | Feature highlight |
| `--icon-size-2xl` | 48px | `.icon--2xl` | Hero, Empty state |

---

## 3. CÁCH DÙNG — INLINE SVG (Khuyến nghị)

Đây là cách chính xác nhất. Copy nội dung file `.svg` vào HTML, thêm class `.icon-svg`:

```html
<!-- Linear icon — stroke -->
<span class="icon icon--base icon--brand">
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-svg">
    <!-- nội dung từ asset/icon/linear/activity.svg -->
    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.33 14.49L9.71 11.4..." stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</span>

<!-- Bold icon — fill -->
<span class="icon icon--bold icon--lg icon--success">
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-svg--bold">
    <!-- nội dung từ asset/icon/bold/tick-circle.svg -->
    <path d="..." fill="currentColor"/>
  </svg>
</span>
```

---

## 4. CÁCH DÙNG — IMG TAG (cho môi trường không dùng inline SVG)

```html
<!-- Chỉ dùng khi không thể inline SVG — KHÔNG thay đổi màu được -->
<img src="/asset/icon/linear/wallet.svg" width="24" height="24" alt="wallet"/>
```

> ⚠️ Dùng `<img>` thì **không** áp dụng được color token. Chỉ dùng cho icon decorative không cần thay màu.

---

## 5. CÁCH DÙNG — CSS BACKGROUND (cho pseudo-element)

```css
/* Dùng data URI khi cần icon trong CSS */
.nav-item::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' ...%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}
```

---

## 6. ICON BUTTON & ICON + LABEL

```html
<!-- Icon Button (clickable) -->
<button class="icon-btn icon-btn--brand" aria-label="Gửi giao dịch">
  <span class="icon icon--md">
    <!-- SVG từ asset/icon/linear/send.svg -->
  </span>
</button>

<!-- Icon + Label (nav item) -->
<a href="/wallet" class="icon-label">
  <span class="icon icon--md"><!-- wallet.svg --></span>
  <span>Ví của tôi</span>
</a>

<!-- Icon + Badge (notification) -->
<div style="position:relative; display:inline-flex;">
  <span class="icon icon-btn icon--base"><!-- notification.svg --></span>
  <span style="position:absolute; top:2px; right:2px;
               width:8px; height:8px; border-radius:50%;
               background:var(--icon-error);"></span>
</div>
```

---

## 7. DARK MODE

```html
<!-- Áp dụng data-theme trên root element -->
<html data-theme="dark">
  <!-- Tất cả icon tự động dùng dark color tokens -->
  <span class="icon icon--brand"><!-- brand icon sẽ là #41B3FF --></span>
</html>
```

```css
/* Hoặc toggle bằng JavaScript */
document.documentElement.dataset.theme = 'dark';
```

---

## 8. ICON TRONG COMPONENT

### Input với icon prefix/suffix
```html
<div style="position:relative;">
  <span class="icon icon--sm icon--secondary"
        style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">
    <!-- asset/icon/linear/search-normal.svg -->
  </span>
  <input type="text" style="padding-left:36px; padding-right:12px;" placeholder="Tìm kiếm..."/>
</div>
```

### Button với icon
```html
<button style="display:inline-flex; align-items:center; gap:8px; ...">
  <span class="icon icon--sm icon--on-accent"><!-- send.svg --></span>
  Gửi AXQ
</button>
```

### Card với icon header
```html
<div class="card">
  <div style="display:flex; align-items:center; gap:12px;">
    <span class="icon icon--lg icon--crypto"><!-- bitcoin-(btc).svg --></span>
    <div>
      <p style="color:var(--icon-primary); font-weight:600;">Bitcoin</p>
      <p style="color:var(--icon-secondary); font-size:13px;">BTC</p>
    </div>
  </div>
</div>
```

---

## 9. MAPPING TÊN FILE → USE CASE AXIOLEDGER

| File name | Variant | Use case |
|---|---|---|
| `wallet.svg` | linear/bold | Ví AXIO Vault |
| `send.svg` | linear/bold | Gửi giao dịch |
| `receive-square.svg` | linear/bold | Nhận giao dịch |
| `activity.svg` | linear/bold | Biểu đồ hoạt động |
| `security.svg` | linear/bold | Bảo mật ZK |
| `shield-tick.svg` | linear/bold | Xác thực ZK-DID |
| `lock.svg` | linear/bold | Khóa / bảo vệ |
| `key.svg` | linear/bold | Compliance Key |
| `scan.svg` | linear/bold | Supply Chain Scanner |
| `finger-scan.svg` | linear/bold | FaceID / Biometric |
| `bitcoin-(btc).svg` | linear/bold | BTC icon |
| `ethereum-(eth).svg` | linear/bold | ETH icon |
| `solana-(sol).svg` | linear/bold | SOL icon |
| `chart-1.svg` | linear/bold | Biểu đồ giá |
| `trend-up.svg` | linear/bold | Tăng giá |
| `trend-down.svg` | linear/bold | Giảm giá |
| `empty-wallet.svg` | linear/bold | Ví trống |
| `money-send.svg` | linear/bold | Chuyển tiền |
| `money-recive.svg` | linear/bold | Nhận tiền |
| `convert.svg` | linear/bold | Hoán đổi (Swap) |
| `global.svg` | linear/bold | Cross-chain |
| `routing.svg` | linear/bold | Route giao dịch |
| `data.svg` | linear/bold | On-chain data |
| `hierarchy.svg` | linear/bold | Mạng lưới phân cấp |
| `percentage-circle.svg` | linear/bold | APY / lãi suất |
| `discount-circle.svg` | linear/bold | Fee / giảm giá |
| `timer.svg` | linear/bold | Finality countdown |
| `flash.svg` | linear/bold | SQX fast execution |
| `cpu.svg` | linear/bold | Validator node |
| `code.svg` | linear/bold | Smart contract |
| `document-code.svg` | linear/bold | Contract code |
| `user.svg` | linear/bold | Người dùng Retail |
| `buildings.svg` | linear/bold | Institutional user |
| `notification.svg` | linear/bold | Alert / notification |
| `setting.svg` | linear/bold | Cài đặt |
| `logout.svg` | linear/bold | Đăng xuất |
