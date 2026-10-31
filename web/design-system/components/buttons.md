# Component Spec — Buttons

> Bổ sung **4 sizes** và **5 states** còn thiếu vào Button component hiện có.  
> Hiện trạng: chỉ có 1 size, 1 state (Default).

---

## 1. Variants Matrix

Mỗi Button = tổ hợp: **Type** × **Color** × **Size** × **State** × **Icon position**

### Type (3)
| Type | Mô tả |
|---|---|
| `Filled` | Nền màu đặc, text trắng/tối |
| `Outlined` | Viền màu, nền trong suốt |
| `Ghost` | Không viền, không nền — chỉ text màu |

### Color (8)
`Black` · `Blue` · `Green` · `Yellow` · `Orange` · `Error/Pink` · `Dark Navy` · `White (trên nền tối)`

### Size (4)

| Size | Height | Padding H | Font style | Icon size | Border radius |
|---|---|---|---|---|---|
| `Giant` | 56px | 24px | Button/Giant/Title | 24px | 16px |
| `Large` | 48px | 20px | Button/Large/Title | 20px | 14px |
| `Medium` | 40px | 16px | Button/Medium/Title | 16px | 12px |
| `Small` | 32px | 12px | Button/Small/Title | 14px | 10px |

### State (5)

| State | Filled | Outlined | Ghost |
|---|---|---|---|
| `Default` | Màu nền gốc | Viền + text màu gốc | Text màu gốc |
| `Hover` | Nền tối hơn 10% (shade 700) | Nền màu gốc/8% | Text tối hơn 10% |
| `Pressed` | Nền tối hơn 20% (shade 800) | Nền màu gốc/16% | Text tối hơn 20% |
| `Disabled` | Nền `#EFEFEF`, text `#B0BAC9` | Viền `#B0BAC9`, text `#B0BAC9` | Text `#B0BAC9` |
| `Loading` | Nền gốc + spinner thay text | Giữ viền + spinner | Spinner màu gốc |

### Icon Position (4)

| Position | Mô tả |
|---|---|
| `Label only` | Không có icon |
| `Icon left` | Icon 1 trước label |
| `Icon right` | Label trước, icon sau |
| `Icon only` | Chỉ icon, không label (square/circle) |

---

## 2. Icon-only Button

Dùng cho toolbar, FAB, action bar.

| Size | Dimension | Border radius |
|---|---|---|
| `Giant` | 56×56px | 16px |
| `Large` | 48×48px | 14px |
| `Medium` | 40×40px | 12px |
| `Small` | 32×32px | 10px |

> **FAB (Floating Action Button):** Large size, Filled Black, border-radius 50% (hình tròn), shadow `0 4px 12px rgba(0,0,0,0.15)`.

---

## 3. Full-width / Block Button

- Width: 100% của container cha
- Dùng cho CTA chính ở bottom sheet, form submit
- Áp dụng được tất cả Type / Color / Size / State

---

## 4. Component Properties (HTML/CSS)

```html
<!-- data-attributes điều khiển variant -->
<button
  class="btn"
  data-type="filled"
  data-color="blue"
  data-size="large"
  data-icon-left="true"
>
  Button Label
</button>
```

```css
/* Ví dụ: btn filled blue large */
.btn[data-type="filled"][data-color="blue"][data-size="large"] {
  height: var(--btn-height-large);
  background: var(--color-status-info-default);
  color: var(--color-text-on-accent);
  font-size: var(--font-size-btn-large);
  line-height: var(--line-height-btn-large);
  border-radius: var(--radius-md);
  padding: 0 20px;
}
.btn[data-type="filled"][data-color="blue"][data-size="large"]:hover {
  background: #0077CC; /* info shade-700 */
}
.btn:disabled,
.btn[data-state="disabled"] {
  background: var(--color-surface-raised);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
```

---

## 5. Token Mapping

| Thuộc tính | Token |
|---|---|
| Label color (Filled) | `text/on-accent` |
| Label color (Outlined/Ghost) | theo color variant → `status/info/default` v.v. |
| Disabled text | `text/disabled` |
| Disabled background | `surface/raised` |
| Focus ring | `border/focus` 2px offset 2px |
| Loading spinner color | kế thừa label color |

---

## 6. Naming Convention (CSS class / data-attribute)

```html
<!-- Filled · Black · Large · Icon left -->
<button class="btn" data-type="filled" data-color="black" data-size="large">
  <svg class="btn-icon btn-icon--left">…</svg>
  Label
</button>

<!-- Outlined · Error · Small · Disabled -->
<button class="btn" data-type="outlined" data-color="error" data-size="small" disabled>
  Label
</button>

<!-- Icon only · FAB -->
<button class="btn btn--icon-only" data-type="filled" data-color="black" data-size="large" aria-label="Add">
  <svg>…</svg>
</button>
```

File CSS tham chiếu: [`tokens/variables.css`](../tokens/variables.css)
