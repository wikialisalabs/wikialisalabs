# Component Spec — Crypto-specific Components

> Các component đặc thù cho app tài chính / crypto — chưa có trong UI Kit.

---

## 1. Crypto Asset Card

Hiển thị một tài sản crypto: tên, balance, % thay đổi 24h, mini sparkline.

### Anatomy
```
┌─────────────────────────────────────────┐
│  [Logo]  Bitcoin                    BTC │
│          $2,387.64              +14.29% │
│  ▁▂▃▄▅▆▇█ (sparkline 7 ngày)           │
│  Balance: 0.0483 BTC                    │
└─────────────────────────────────────────┘
```

### Variants
| Variant | Mô tả |
|---|---|
| `Full` | Logo + Name + Ticker + Price + % + Balance + Sparkline |
| `Compact` | Logo + Name + Price + % (dùng trong danh sách) |
| `Minimal` | Logo + Ticker + Price (dùng trong chip/badge) |

### Specs
| Property | Giá trị |
|---|---|
| Full card size | 160×96px (horizontal scroll) / full width |
| Border radius | 16px |
| Background | `surface/default` hoặc gradient `gradient/crypto-card` |
| Logo size | 40×40px (circle) |
| Price font | `Numeric/Large` (24px Semibold) |
| % positive | `status/success/default` |
| % negative | `status/error/default` |
| Sparkline height | 32px, line 1.5px |
| Sparkline color | Xanh nếu +, đỏ nếu − |

### Component Properties
```
Variant:        Full | Compact | Minimal
Coin Name:      String
Ticker:         String
Price:          String
Change:         String (ví dụ: "+14.29%")
Change Type:    Positive | Negative | Neutral
Balance:        String (optional)
Show Sparkline: Boolean
Theme:          Light | Dark | Gradient
```

---

## 2. QR Code Display

Dùng cho: nhận crypto, share địa chỉ ví.

### Anatomy
```
┌─────────────────────────────────────┐
│                                     │
│   ┌───────────────────────────┐     │
│   │  [QR CODE IMAGE 200×200]  │     │
│   └───────────────────────────┘     │
│                                     │
│   Bitcoin (BTC)                     │
│   bc1qxy2kgd...j2kk7pw              │  ← truncated address
│                                     │
│   [Copy Address]  [Share]           │
└─────────────────────────────────────┘
```

### Specs
| Property | Giá trị |
|---|---|
| QR size | 200×200px |
| QR container padding | 16px, background trắng (QR cần nền trắng) |
| QR border radius | 12px |
| Address font | `Body/Caption/Regular`, monospace, truncate giữa |
| Copy button | Button Outlined Medium |
| Share button | Button Ghost Medium |

### Variants
| Variant | Mô tả |
|---|---|
| `Receive` | Full display như trên |
| `Inline` | QR nhỏ 80×80px, dùng trong card |
| `Loading` | Skeleton placeholder khi QR đang gen |

---

## 3. Transaction Item (mở rộng)

Bổ sung thêm states và sub-types cho Transaction List Item hiện có.

### Sub-types
| Type | Icon | Amount style |
|---|---|---|
| `Send` | arrow-up (bold, đỏ) | `−$25.00` màu `error` |
| `Receive` | arrow-down (bold, xanh) | `+$100.00` màu `success` |
| `Swap` | swap (bold, tím) | `BTC → ETH` |
| `Buy` | card-pos (bold, xanh) | `+0.0021 BTC` |
| `Fee` | info-circle | `−$0.50` màu `text/secondary` |

### Status badge
| Status | Màu | Label |
|---|---|---|
| `Completed` | success | Completed |
| `Pending` | warning | Pending |
| `Failed` | error | Failed |
| `Processing` | info | Processing... |

---

## 4. Balance Display

Dùng cho màn hình chính (Home / Wallet).

```
        Total Balance
      $12,847.32
      ≈ 0.3241 BTC

    [Send]  [Receive]  [Buy]  [Swap]
```

### Specs
| Property | Giá trị |
|---|---|
| "Total Balance" label | `Body/Caption/Regular`, `text/secondary` |
| Fiat amount | `Headline/H2/Semibold` hoặc `Numeric/Large` |
| Crypto equiv | `Body/B2/Regular`, `text/secondary` |
| Show/Hide toggle | Eye icon, tap để ẩn số — thay bằng `• • • •` |
| Quick actions | 4 button icon-only, size Medium, equal spacing |

---

## 5. Price Ticker / Rate Badge

Dùng trong list, card, header.

```
  ┌─────────────┐
  │ 12.7%  BTC  │  ← green background
  └─────────────┘
```

| Property | Giá trị |
|---|---|
| Height | 24px |
| Padding | 4px 8px |
| Border radius | 6px |
| Background | `status/success/subtle` (positive) / `status/error/subtle` (negative) |
| Text | `Body/Caption/Medium` |
| Icon | arrow-up / arrow-down 12px |
