# Guideline — Dark Mode

> Hướng dẫn triển khai Dark Mode cho toàn bộ Design System.  
> Tiền đề: **Color Tokens** đã được thiết lập với 2 mode Light/Dark.

---

## 1. Nguyên tắc

1. **Không đảo ngược cứng nhắc:** Dark mode không phải là "đảo màu" — không lấy màu light rồi invert. Background tối nhưng không phải `#000000` thuần.
2. **Elevation qua màu sáng hơn:** Trong dark mode, surface cao hơn (modal, dropdown) dùng màu sáng hơn một chút (không dùng shadow).
3. **Giảm saturation nhẹ:** Màu accent/brand trong dark mode bão hòa thấp hơn ~10% để tránh chói mắt.
4. **Tất cả màu phải qua Token** — không hard-code hex trong bất kỳ component nào.

---

## 2. Bảng màu nền theo tầng

| Tầng | Light | Dark | Mô tả |
|---|---|---|---|
| App background | `#FFFFFF` | `#0D1117` | Nền toàn trang |
| Page background | `#F5F6FA` | `#161B22` | Nền section |
| Card / Surface | `#FFFFFF` | `#1C2128` | Card, list item |
| Raised surface | `#F5F6FA` | `#22272E` | Input, badge |
| Overlay / Modal | `#FFFFFF` | `#2D333B` | Modal, bottom sheet, dropdown |

---

## 3. Components cần Dark variant

| Component | Ưu tiên | Ghi chú |
|---|---|---|
| Bottom Navigation | ✅ Đã có | Kiểm tra lại icon color token |
| Tab Bar | ✅ Đã có | Kiểm tra lại active state |
| Button (tất cả) | 🔴 Cao | White variant đã có, còn lại chưa |
| Text Input | 🔴 Cao | Background, border, placeholder |
| List items | 🔴 Cao | Background, divider |
| Cards (Crypto, Payment) | 🔴 Cao | Surface token |
| Modal / Bottom Sheet | 🔴 Cao | Xây mới kèm dark ngay |
| Toast / Alert | 🔴 Cao | Xây mới kèm dark ngay |
| Skeleton | 🟡 Trung bình | Màu shimmer khác |
| Badge / Chip | 🟡 Trung bình | Subtle background token |

---

## 4. Checklist trước khi bàn giao

- [ ] Tất cả màu dùng CSS variable từ [`variables.css`](../tokens/variables.css) — không hard-code hex
- [ ] Tất cả `color:`, `background:`, `border-color:` dùng `var(--color-*)`
- [ ] Bật `data-theme="dark"` trên `<html>` → không component nào bị màu cứng
- [ ] Kiểm tra contrast ratio trên nền tối (tối thiểu 4.5:1 cho text ≤18px)
- [ ] Status bar (iOS/Android) đổi style dark
- [ ] Icon color dùng `var(--color-icon-primary)` token

---

## 5. Quy trình trên máy chủ

1. **Tất cả màu** phải dùng CSS variable từ [`variables.css`](../tokens/variables.css) — không hard-code hex.
2. **Kích hoạt dark mode** bằng attribute hoặc class:
   ```js
   // Toggle
   document.documentElement.setAttribute('data-theme', 'dark');
   document.documentElement.removeAttribute('data-theme'); // về light
   ```
3. **Kiểm tra** bằng DevTools → chỉnh `prefers-color-scheme: dark` trong Emulate.
4. **Thêm token dark mới:** Sửa block `[data-theme="dark"]` trong [`variables.css`](../tokens/variables.css).
5. Chạy visual regression test (nếu có) để phát hiện component bị vỡ layout.
