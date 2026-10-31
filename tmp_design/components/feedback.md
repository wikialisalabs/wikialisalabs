# Component Spec — Feedback Components

> Toast · Alert/Banner · Empty State · Skeleton · Progress Bar · Tooltip

---

## 1. Toast / Snackbar

Thông báo tạm thời — tự biến mất sau 3–5 giây.

### Anatomy
```
┌──────────────────────────────────────────┐
│ [Icon]  Message text             [Action]│
└──────────────────────────────────────────┘
```

### Variants
| Variant | Icon | Color |
|---|---|---|
| `Success` | check-circle (bold) | `status/success/default` |
| `Error` | close-circle (bold) | `status/error/default` |
| `Warning` | warning (bold) | `status/warning/default` |
| `Info` | info-circle (bold) | `status/info/default` |
| `Default` | — | `text/primary` |

### Specs
| Property | Giá trị |
|---|---|
| Min width | 280px |
| Max width | 480px |
| Height | 52px (single line) |
| Border radius | 12px |
| Padding | 12px 16px |
| Position | Bottom center (mobile) / Top right (desktop) |
| Margin bottom | 24px (khoảng cách từ bottom nav) |
| Animation | Slide up + fade in 200ms · auto-dismiss fade out 300ms |
| Duration | 3000ms (success/info) · 5000ms (error) |

### Component Properties
```
Variant:      Success | Error | Warning | Info | Default
Message:      String
Action Label: String (optional)
Show Icon:    Boolean (default true)
```

---

## 2. Alert / Banner

Thông báo cố định — hiển thị trên trang cho đến khi user đóng.

### Variants
Giống Toast nhưng thêm `title` và hiển thị inline trong layout.

```
┌──────────────────────────────────────────┐
│ [Icon]  Title                        [×] │
│         Description text                 │
└──────────────────────────────────────────┘
```

### Specs
| Property | Giá trị |
|---|---|
| Border radius | 12px |
| Border left | 4px solid (màu theo variant) |
| Background | `status/{variant}/subtle` |
| Padding | 16px |
| Icon size | 20px |

---

## 3. Empty State

Hiển thị khi danh sách / trang không có dữ liệu.

### Anatomy
```
          [Illustration / Icon]
              Title text
           Description text
          [Optional CTA Button]
```

### Variants
| Variant | Dùng cho |
|---|---|
| `No transactions` | Lịch sử giao dịch trống |
| `No results` | Tìm kiếm không có kết quả |
| `No notifications` | Thông báo trống |
| `No connection` | Mất mạng |
| `Error state` | Lỗi tải dữ liệu + nút Retry |
| `Empty wallet` | Ví chưa có tài sản |
| `Generic` | Dạng chung, dùng icon placeholder |

### Specs
| Property | Giá trị |
|---|---|
| Illustration size | 120×120px |
| Title | Headline/H6/Semibold, `text/primary` |
| Description | Body/B2/Regular, `text/secondary`, max 2 dòng |
| CTA | Button Medium, Outlined |
| Padding | 48px top/bottom |

---

## 4. Skeleton / Loading Placeholder

Hiển thị trong thời gian chờ API response — thay thế nội dung thật.

### Variants cần có
| Component | Skeleton shape |
|---|---|
| List item (transaction) | 1 circle 40px + 2 line (100%, 60%) |
| Crypto asset card | Rectangle 160×80px |
| Profile header | Circle 64px + 2 line |
| Text block | 3–4 lines ngẫu nhiên |
| Image/Chart | Rectangle với aspect ratio giữ nguyên |

### Specs
| Property | Giá trị |
|---|---|
| Base color | `#E5E7EB` (light) / `#30363D` (dark) |
| Shimmer color | `#FFFFFF/60%` (light) / `#484F58/60%` (dark) |
| Border radius | Khớp với component gốc |
| Animation | Shimmer sweep left→right, 1.5s infinite |

---

## 5. Progress Bar & Step Indicator

### Linear Progress Bar
```
┌────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░  │  60%
└────────────────────────────────────────┘
```
- Height: 4px (thin) / 8px (default)
- Filled color: `status/info/default`
- Track color: `border/default`
- Border radius: 99px (pill)
- Animated: fill từ 0% → value

### Step Indicator (Onboarding / KYC)
```
●────────●────────●────────○────────○
1        2        3        4        5
Done    Done    Active   Pending  Pending
```
| State | Style |
|---|---|
| `Done` | Filled circle `status/success/default`, icon check |
| `Active` | Filled circle `status/info/default`, số |
| `Pending` | Outline circle `border/default`, số mờ |

---

## 6. Tooltip

```
         ┌──────────────────┐
         │  Tooltip text     │
         └────────┬─────────┘
                  ▼
              [Trigger]
```

### Specs
| Property | Giá trị |
|---|---|
| Max width | 200px |
| Padding | 8px 12px |
| Border radius | 8px |
| Background | `#1E2A59` (luôn dark) |
| Text | Body/Caption/Regular, `#FFFFFF` |
| Arrow size | 6px |
| Position | top / bottom / left / right (auto-flip) |
| Show on | hover (desktop) / long-press (mobile) |
| Delay | 300ms |
