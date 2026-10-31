# Component Spec — Inputs & Form Elements

> Tách Input ra thành component spec độc lập với đầy đủ type, state và form elements.

---

## 1. Text Input

### States (5)
| State | Viền | Label | Caption |
|---|---|---|---|
| `Default` | `border/default` | `text/secondary` | — |
| `Focus` | `border/focus` 2px | `text/link` (shrink lên) | — |
| `Filled` | `border/default` | `text/secondary` (shrink) | — |
| `Error` | `border/error` 2px | `status/error/default` | Error message — `text/error` |
| `Disabled` | `border/default` dashed | `text/disabled` | — |

### Types (6)
| Type | Đặc điểm |
|---|---|
| `Text` | Input thông thường |
| `Password` | Toggle show/hide icon bên phải |
| `Search` | Icon kính lúp bên trái, nút clear (×) bên phải |
| `Number` | Bàn phím số, căn phải |
| `Multiline / Textarea` | Min 3 dòng, resize handle dưới phải |
| `Read-only` | Không thể edit, style mờ hơn |

### Anatomy
```
┌─────────────────────────────┐
│ Label                        │  ← text/secondary, 12px khi focus (float)
│ [Icon left]  Placeholder  [Icon right] │  ← height 48px
└─────────────────────────────┘
  Caption / Helper / Error text   ← 12px, margin-top 4px
```

### Kích thước
| Size | Height | Font | Padding H | Border radius |
|---|---|---|---|---|
| `Large` | 56px | Body/B1/Medium | 16px | 12px |
| `Medium` | 48px | Body/B2/Regular | 14px | 10px |
| `Small` | 40px | Body/Caption/Regular | 12px | 8px |

---

## 2. Search Bar

```
┌──────────────────────────────────────┐
│ 🔍  Search...                    [×] │
└──────────────────────────────────────┘
```
- Height: 44px, border-radius: 22px (pill)
- Icon: `search` linear, size 20px, color `icon/secondary`
- Clear button (×): hiện khi có text
- State: Default · Focus · Filled · Disabled

---

## 3. OTP / PIN Input

Dùng cho: đăng nhập, xác nhận giao dịch, KYC.

```
┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
│  1 │  │  2 │  │  3 │  │  · │  │    │  │    │
└────┘  └────┘  └────┘  └────┘  └────┘  └────┘
  ↑ Filled     ↑ Active/Focus              ↑ Empty
```

| Property | Giá trị |
|---|---|
| Cell size | 48×56px |
| Gap | 8px |
| Digits | 4 hoặc 6 (Component Property) |
| Font | Numeric/Large (24px Semibold) |
| States | `Empty` · `Active` · `Filled` · `Error` · `Success` |
| Border radius | 12px |
| Active border | `border/focus` 2px |
| Error border | `border/error` 2px |
| Success fill | `status/success/subtle` |

---

## 4. Checkbox

| State | Mô tả |
|---|---|
| `Unchecked` | Viền `border/default`, nền trắng |
| `Checked` | Nền `status/info/default`, icon check trắng |
| `Indeterminate` | Nền `status/info/default`, icon gạch ngang |
| `Disabled Unchecked` | Viền `border/default` mờ |
| `Disabled Checked` | Nền `text/disabled` |

- Size: 20×20px, border-radius: 4px
- Kèm label text (optional): `Body/B2/Regular`, spacing 8px

---

## 5. Radio Button

| State | Mô tả |
|---|---|
| `Unselected` | Viền `border/default` |
| `Selected` | Viền + dot `status/info/default` |
| `Disabled` | Mờ `text/disabled` |

- Size: 20×20px, hình tròn
- Dot size: 8×8px

---

## 6. Dropdown / Select

```
┌─────────────────────────────┐
│ Label                        │
│ Selected option          [▼] │
└─────────────────────────────┘
```

- Height: 48px, border-radius: 10px
- Dropdown list: `surface/overlay`, shadow `0 8px 24px rgba(0,0,0,0.12)`
- List item height: 44px, hover: `surface/raised`
- Hỗ trợ: Single select · Multi select (checkbox trong list)
- States: `Default` · `Open` · `Selected` · `Disabled` · `Error`

---

## 7. Date Picker

- Trigger: Input style, icon calendar bên phải
- Calendar popup: 7 cột (T2–CN), header tháng/năm có nút prev/next
- Selected date: `status/info/default` nền tròn
- Range select: highlight gradient giữa 2 ngày
- States ngày: `Default` · `Today` (underline) · `Selected` · `In-range` · `Disabled` (past/future)

---

## 8. Component HTML/CSS — Text Input

```html
<!-- Text input — Medium — Error state -->
<div class="input-wrapper" data-size="medium" data-state="error">
  <label class="input-label">Email</label>
  <div class="input-field">
    <input type="text" placeholder="Nhập email..." />
    <svg class="input-icon input-icon--right"><!-- error icon --></svg>
  </div>
  <span class="input-caption input-caption--error">Email không hợp lệ</span>
</div>

<!-- OTP — 6 digits -->
<div class="otp-wrapper" data-digits="6" data-state="default">
  <input class="otp-cell" maxlength="1" inputmode="numeric" />
  <input class="otp-cell" maxlength="1" inputmode="numeric" />
  <input class="otp-cell" maxlength="1" inputmode="numeric" />
  <input class="otp-cell" maxlength="1" inputmode="numeric" />
  <input class="otp-cell" maxlength="1" inputmode="numeric" />
  <input class="otp-cell" maxlength="1" inputmode="numeric" />
</div>
```

```css
.input-wrapper[data-state="error"] .input-field {
  border: 2px solid var(--color-border-error);
}
.input-wrapper[data-state="focus"] .input-field {
  border: 2px solid var(--color-border-focus);
}
.input-caption--error {
  color: var(--color-status-error-default);
  font-size: var(--font-size-caption);
}
.otp-cell {
  width: 48px; height: 56px;
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--font-size-num-large);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}
.otp-cell:focus {
  border-color: var(--color-border-focus);
  outline: none;
}
```
