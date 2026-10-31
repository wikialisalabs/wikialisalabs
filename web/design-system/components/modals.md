# Component Spec — Modal & Bottom Sheet

> 2 component block luồng UX quan trọng nhất — chưa có trong UI Kit hiện tại.

---

## 1. Modal (Dialog)

### Anatomy
```
┌─────────────────────────────────┐
│  ╳  Title                        │  ← Header: H6/Semibold, close icon
├─────────────────────────────────┤
│                                  │
│  Body content / Message          │  ← Body/B2/Regular, padding 24px
│                                  │
├─────────────────────────────────┤
│  [Secondary Action] [Primary]    │  ← Footer: 2 button, gap 12px
└─────────────────────────────────┘
```

### Variants
| Variant | Mô tả | Use case |
|---|---|---|
| `Info` | Icon info + message | Thông báo đơn giản |
| `Confirm` | Icon warning + 2 CTA | Xác nhận xóa, logout |
| `Form` | Có input field bên trong | Nhập số tiền, ghi chú |
| `Success` | Icon check + message | Giao dịch thành công |
| `Error` | Icon error + message | Lỗi hệ thống |
| `Custom` | Slot tự do | Onboarding, feature intro |

### Specs
| Property | Giá trị |
|---|---|
| Width | 320px (max 480px) |
| Border radius | 20px |
| Background | `surface/overlay` |
| Overlay | `background/overlay` (blur 4px optional) |
| Padding | 24px |
| Header height | 56px |
| Footer gap | 12px |
| Animation | Fade in + scale 95%→100%, 200ms ease-out |

### Component HTML

```html
<!-- Modal — Confirm variant -->
<div class="modal-overlay" data-variant="confirm">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-header">
      <h6 id="modal-title" class="text-h6">Xác nhận giao dịch</h6>
      <button class="modal-close" aria-label="Đóng">✕</button>
    </div>
    <div class="modal-body text-b2">
      Bạn có chắc muốn gửi 0.05 BTC không?
    </div>
    <div class="modal-footer">
      <button class="btn" data-type="outlined" data-color="black" data-size="medium">Huỷ</button>
      <button class="btn" data-type="filled"   data-color="blue"  data-size="medium">Xác nhận</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed; inset: 0;
  background: var(--color-background-overlay);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal {
  background: var(--color-surface-overlay);
  border-radius: var(--radius-xl);
  padding: 24px;
  width: 320px; max-width: 480px;
}
```
---

## 2. Bottom Sheet

### Anatomy
```
         ┌────────────────────────┐
         │      ▔▔▔▔▔▔            │  ← Drag handle, 4×32px, `border/strong`
         │                        │
         │  Title (optional)      │
         │                        │
         │  Content slot          │
         │                        │
         │  [CTA Button]          │
         └────────────────────────┘
```

### Variants
| Variant | Content |
|---|---|
| `List` | Danh sách lựa chọn (share, filter...) |
| `Confirm` | Message + 2 button (Confirm/Cancel) |
| `Form` | Input fields (gửi tiền, nhập địa chỉ) |
| `Info` | Text dài, scroll nội dung |
| `OTP` | PIN input + keypad |

### Specs
| Property | Giá trị |
|---|---|
| Border radius top | 24px |
| Background | `surface/overlay` |
| Drag handle top margin | 12px |
| Padding | 20px horizontal, 16px vertical |
| Max height | 80vh (scroll bên trong nếu content dài hơn) |
| Animation | Slide up từ bottom, 300ms ease-out |
| Dismiss | Kéo xuống (drag) hoặc tap overlay |

### Component HTML

```html
<!-- Bottom Sheet -->
<div class="sheet-overlay">
  <div class="sheet" role="dialog" data-variant="confirm">
    <div class="sheet-handle" aria-hidden="true"></div>
    <div class="sheet-content">
      <h6 class="text-h6">Tiêu đề</h6>
      <p class="text-b2 color-secondary">Nội dung mô tả...</p>
      <button class="btn" data-type="filled" data-color="blue" data-size="large" style="width:100%">
        Xác nhận
      </button>
    </div>
  </div>
</div>
```

```css
.sheet {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--color-surface-overlay);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 16px 20px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 300ms ease-out;
}
.sheet-handle {
  width: 32px; height: 4px;
  background: var(--color-border-strong);
  border-radius: var(--radius-pill);
  margin: 0 auto 16px;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
```
---

## 3. Overlay / Backdrop

- Color: `#000000` + 40% alpha (light) / 60% alpha (dark)
- Blur: optional 4px backdrop-filter
- Tap to dismiss: enabled cho Bottom Sheet, configurable cho Modal
