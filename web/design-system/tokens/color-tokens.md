# Color Tokens

> Lớp **Semantic / Alias tokens** — ánh xạ từ raw palette sang vai trò ngữ nghĩa.
> Nguồn thực thi: [`tokens/color-tokens.json`](color-tokens.json) · [`tokens/variables.css`](variables.css)
> Mỗi token có 2 mode: **Light** và **Dark**.

---

## 1. Background

| Token | Light | Dark |
|---|---|---|
| `background/primary` | `#FFFFFF` | `#0D1117` |
| `background/secondary` | `#F5F6FA` | `#161B22` |
| `background/overlay` | `#000000/40%` | `#000000/60%` |

## 2. Surface (Card, Sheet, Modal)

| Token | Light | Dark |
|---|---|---|
| `surface/default` | `#FFFFFF` | `#1C2128` |
| `surface/raised` | `#F5F6FA` | `#22272E` |
| `surface/overlay` | `#FFFFFF` | `#2D333B` |

## 3. Text

| Token | Light | Dark |
|---|---|---|
| `text/primary` | `#1E2A59` | `#E6EDF3` |
| `text/secondary` | `#57606A` | `#8B949E` |
| `text/disabled` | `#B0BAC9` | `#484F58` |
| `text/on-accent` | `#FFFFFF` | `#FFFFFF` |
| `text/link` | `#0095FF` | `#58A6FF` |
| `text/link-visited` | `#AF96FB` | `#AF96FB` |

## 4. Border

| Token | Light | Dark |
|---|---|---|
| `border/default` | `#E5E7EB` | `#30363D` |
| `border/strong` | `#B0BAC9` | `#484F58` |
| `border/focus` | `#0095FF` | `#58A6FF` |
| `border/error` | `#FF3D71` | `#FF3D71` |

## 5. Icon

| Token | Light | Dark |
|---|---|---|
| `icon/primary` | `#1E2A59` | `#E6EDF3` |
| `icon/secondary` | `#57606A` | `#8B949E` |
| `icon/disabled` | `#B0BAC9` | `#484F58` |
| `icon/brand` | `#0095FF` | `#58A6FF` |
| `icon/on-accent` | `#FFFFFF` | `#FFFFFF` |

## 6. Status

| Token | Light | Dark |
|---|---|---|
| `status/success/default` | `#00D68F` | `#00D68F` |
| `status/success/subtle` | `#00D68F/10%` | `#00D68F/15%` |
| `status/warning/default` | `#FFAA00` | `#FFAA00` |
| `status/warning/subtle` | `#FFAA00/10%` | `#FFAA00/15%` |
| `status/error/default` | `#FF3D71` | `#FF3D71` |
| `status/error/subtle` | `#FF3D71/10%` | `#FF3D71/15%` |
| `status/info/default` | `#0095FF` | `#58A6FF` |
| `status/info/subtle` | `#0095FF/10%` | `#58A6FF/15%` |

## 7. Brand (Accent)

| Token | Giá trị | Ghi chú |
|---|---|---|
| `brand/magenta` | `#FD9FDD` | CTA phụ, highlight |
| `brand/orange` | `#FC7339` | Warning nhẹ, badge |
| `brand/greeny` | `#BEFF6C` | Positive indicator |
| `brand/violet` | `#AF96FB` | Tag, badge category |
| `brand/blue` | `#49DBC8` | Crypto accent |
| `brand/yellow` | `#FFF172` | Cashback, reward |

## 8. Opacity Tokens (dùng cho nền badge, chip)

| Token | Giá trị |
|---|---|
| `opacity/info-bg` | `#0095FF` + alpha 10% |
| `opacity/success-bg` | `#00D68F` + alpha 10% |
| `opacity/error-bg` | `#FF3D71` + alpha 10% |
| `opacity/warning-bg` | `#FFAA00` + alpha 10% |

## 9. Gradient Tokens

| Token | Giá trị |
|---|---|
| `gradient/crypto-card` | `linear-gradient(135deg, #1E2A59 0%, #0D1117 100%)` |
| `gradient/brand-accent` | `linear-gradient(90deg, #AF96FB 0%, #49DBC8 100%)` |

---

## Cách áp dụng trên máy chủ

1. **Import CSS variables** vào entry point của project:
   ```css
   @import 'design-system/tokens/variables.css';
   ```
2. **Sử dụng token** thay vì hard-code hex:
   ```css
   /* ✅ Đúng */
   color: var(--color-text-primary);
   background: var(--color-surface-default);

   /* ❌ Sai */
   color: #1E2A59;
   ```
3. **Dark mode** tự động qua `prefers-color-scheme` hoặc set thủ công:
   ```html
   <html data-theme="dark">
   ```
4. **Thêm token mới:** Sửa [`color-tokens.json`](color-tokens.json) → chạy script build để re-generate `variables.css`:
   ```bash
   node design-system/scripts/build-tokens.js
   ```
