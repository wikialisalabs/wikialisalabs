# Guideline — Accessibility (A11y)

> Tiêu chuẩn tối thiểu: **WCAG 2.1 Level AA**

---

## 1. Contrast Ratio

| Loại text | Tỉ lệ tối thiểu | Tỉ lệ lý tưởng |
|---|---|---|
| Body text (≥18px hoặc 14px Bold) | 3:1 | 4.5:1 |
| Body text thông thường (<18px) | 4.5:1 | 7:1 |
| Icon (decorative) | Không yêu cầu | — |
| Icon (chức năng, không có label) | 3:1 | 4.5:1 |
| UI component border (input, button) | 3:1 | — |

### Kết quả kiểm tra sơ bộ (cần verify)

| Cặp màu | Tỉ lệ ước tính | Trạng thái |
|---|---|---|
| `#1E2A59` trên `#FFFFFF` | ~12:1 | ✅ Pass |
| `#57606A` trên `#FFFFFF` | ~5.9:1 | ✅ Pass |
| `#FFFFFF` trên `#0095FF` | ~3.5:1 | ⚠️ Chỉ pass cho text lớn |
| `#FFFFFF` trên `#00D68F` | ~2.1:1 | ❌ Fail — cần đổi text sang tối |
| `#FFFFFF` trên `#FFAA00` | ~1.8:1 | ❌ Fail — text nên là `#1E2A59` |
| `#FFFFFF` trên `#BEFF6C` | ~1.4:1 | ❌ Fail — text phải là tối |
| `#FFFFFF` trên `#FFF172` | ~1.2:1 | ❌ Fail — text phải là tối |

> **Hành động ngay:** Button Yellow và Greeny không được dùng text trắng.  
> Đổi sang `text/primary` (`#1E2A59`) cho Filled button màu sáng.

---

## 2. Touch Target Size

- Tối thiểu: **44×44px** (Apple HIG) / **48×48px** (Material)
- Icon-only button nhỏ hơn 44px cần thêm invisible hit area
- Toggle switch, radio, checkbox: vùng tap ≥ 44×44px dù visual nhỏ hơn

---

## 3. Focus Indicator

- Tất cả interactive element phải có visible focus state
- Focus ring: 2px solid `border/focus` (`#0095FF`), offset 2px
- Không dùng `outline: none` mà không có thay thế

---

## 4. Typography

- Không có text nào nhỏ hơn **10px** (Overline là giới hạn)
- Line-height ≥ 1.5× font size cho body text
- Không dùng chỉ màu để truyền đạt thông tin (luôn kèm icon hoặc text label)

---

## 5. Icon Accessibility

- Icon có chức năng (không có text kèm): cần `aria-label` / `title`
- Icon trang trí: `aria-hidden="true"`
- % change: không chỉ dùng màu xanh/đỏ — luôn kèm ký hiệu `+` / `−`

---

## 6. Checklist trên máy chủ

- [ ] Tất cả button states có visible focus ring (`:focus-visible` trong CSS)
- [ ] Input fields có `<label>` thực sự liên kết qua `for`/`id` — không chỉ dùng `placeholder`
- [ ] Error messages có `role="alert"` và kèm icon + text — không chỉ đổi viền đỏ
- [ ] Button Yellow/Greeny dùng `--color-text-primary` (#1E2A59) thay vì text trắng
- [ ] Touch targets ≥ 44×44px — dùng `min-height: 44px; min-width: 44px` hoặc `padding` bổ sung
- [ ] Icon-only button có `aria-label` hoặc `<title>` bên trong SVG

---

## 7. Tools đề xuất

| Tool | Dùng cho |
|---|---|
| [axe DevTools (browser ext)](https://www.deque.com/axe/devtools/) | Audit accessibility tự động trên trang web |
| [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) | Verify cặp màu cụ thể |
| `npx axe-cli http://localhost:3000` | Chạy audit từ terminal trên máy chủ |
| Chrome DevTools → Rendering → Emulate | Giả lập dark mode, color blindness |
