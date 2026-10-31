# Typography Tokens

> Bổ sung **line-height**, **letter-spacing** còn thiếu vào tất cả Text Styles hiện có.  
> Font family: **Work Sans** — Semibold (600) · Medium (500) · Regular (400)

---

## 1. Headlines

| Style name | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| `Headline/H1/Semibold` | 96px | 600 | 112px (116%) | −1.5px |
| `Headline/H1/Medium` | 96px | 500 | 112px | −1.5px |
| `Headline/H1/Regular` | 96px | 400 | 112px | −1.5px |
| `Headline/H2/Semibold` | 60px | 600 | 72px (120%) | −0.5px |
| `Headline/H2/Medium` | 60px | 500 | 72px | −0.5px |
| `Headline/H2/Regular` | 60px | 400 | 72px | −0.5px |
| `Headline/H3/Semibold` | 48px | 600 | 60px (125%) | 0px |
| `Headline/H3/Medium` | 48px | 500 | 60px | 0px |
| `Headline/H3/Regular` | 48px | 400 | 60px | 0px |
| `Headline/H4/Semibold` | 34px | 600 | 44px (129%) | 0.25px |
| `Headline/H4/Medium` | 34px | 500 | 44px | 0.25px |
| `Headline/H4/Regular` | 34px | 400 | 44px | 0.25px |
| `Headline/H5/Semibold` | 24px | 600 | 32px (133%) | 0px |
| `Headline/H5/Medium` | 24px | 500 | 32px | 0px |
| `Headline/H5/Regular` | 24px | 400 | 32px | 0px |
| `Headline/H6/Semibold` | 20px | 600 | 28px (140%) | 0.15px |
| `Headline/H6/Medium` | 20px | 500 | 28px | 0.15px |
| `Headline/H6/Regular` | 20px | 400 | 28px | 0.15px |

## 2. Subtitle

| Style name | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| `Subtitle/S1/Medium` | 16px | 500 | 24px (150%) | 0.15px |
| `Subtitle/S1/Regular` | 16px | 400 | 24px | 0.15px |
| `Subtitle/S2/Medium` | 14px | 500 | 20px (143%) | 0.1px |
| `Subtitle/S2/Regular` | 14px | 400 | 20px | 0.1px |

## 3. Body

| Style name | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| `Body/B1/Medium` | 16px | 500 | 24px (150%) | 0.5px |
| `Body/B2/Regular` | 14px | 400 | 20px (143%) | 0.25px |
| `Body/Caption/Regular` | 12px | 400 | 16px (133%) | 0.4px |
| `Body/Caption/Medium` | 12px | 500 | 16px | 0.4px |
| `Body/Overline/Regular` | 10px | 400 | 16px (160%) | 1.5px |

## 4. Button

| Style name | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| `Button/Giant/AllCaps` | 20px | 600 | 28px | 1.25px |
| `Button/Giant/Title` | 20px | 600 | 28px | 0.15px |
| `Button/Large/AllCaps` | 16px | 600 | 24px | 1.25px |
| `Button/Large/Title` | 16px | 600 | 24px | 0.15px |
| `Button/Medium/AllCaps` | 14px | 600 | 20px | 1.25px |
| `Button/Medium/Title` | 14px | 600 | 20px | 0.15px |
| `Button/Small/AllCaps` | 12px | 600 | 16px | 1.25px |
| `Button/Small/Title` | 12px | 600 | 16px | 0.15px |

## 5. Bổ sung mới — Link & Monospace

| Style name | Size | Weight | Line-height | Letter-spacing | Ghi chú |
|---|---|---|---|---|---|
| `Body/Link/Regular` | 14px | 400 | 20px | 0.25px | Color: `text/link`, underline decoration |
| `Body/Link/Medium` | 14px | 500 | 20px | 0.25px | Color: `text/link` |
| `Numeric/Large` | 24px | 600 | 32px | −0.5px | Dùng cho balance, price (Work Sans số) |
| `Numeric/Medium` | 16px | 600 | 24px | −0.25px | Dùng cho % change, amount |
| `Numeric/Small` | 12px | 500 | 16px | 0px | Dùng cho sub-price, caption số |

## 6. Truncation Rules

| Tình huống | Rule |
|---|---|
| Tiêu đề 1 dòng | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| Mô tả 2 dòng | `-webkit-line-clamp: 2` |
| Tên token dài (crypto) | Truncate giữa, giữ ký tự đầu và cuối: `Ab...xy` |

---

## Cách áp dụng trên máy chủ

1. **Import** [`variables.css`](variables.css) — tất cả typography tokens đã có sẵn dưới dạng CSS custom properties.
2. **Dùng utility class** trực tiếp trong HTML:
   ```html
   <h1 class="text-h1">Tiêu đề</h1>
   <p class="text-b2 color-secondary">Mô tả</p>
   <span class="text-numeric-lg color-success">+14.29%</span>
   ```
3. **Hoặc dùng CSS variable** trong stylesheet:
   ```css
   .price-tag {
     font-size: var(--font-size-num-large);
     line-height: var(--line-height-num-large);
     letter-spacing: var(--letter-spacing-num-large);
     font-weight: var(--font-weight-semibold);
     color: var(--color-text-primary);
   }
   ```
4. **Thêm/sửa token:** Sửa [`typography-tokens.json`](typography-tokens.json) → chạy:
   ```bash
   node design-system/scripts/build-tokens.js
   ```
