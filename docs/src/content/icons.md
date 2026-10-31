---
title: Icons
route: /icons
description: 6000+ outline SVG icons — search, preview, copy
---

# Icon Library

> 6000+ outline SVG icons optimized for crypto, Web3, and general UI. Search by name, preview at multiple sizes, and copy ready-to-use snippets.

---

## Specifications

| Spec | Value |
| --- | --- |
| Total icons | 6000+ |
| Variants | Outline, Filled |
| Grid | 24×24px |
| Stroke width | 2px (outline), filled |
| Format | Optimized SVG |
| Export formats | SVG, React JSX, Vue SFC, `<img>`, CSS `url()` |

---

## Categories

| Category | Count | Examples |
| --- | --- | --- |
| General UI | 400+ | home, search, settings, menu, close |
| Arrows & Chevrons | 80+ | arrow-up, chevron-left, move, rotate |
| Brand | 120+ | github, twitter, ethereum, bitcoin |
| Crypto & Web3 | 200+ | wallet, key, lock, shield, chain |
| Finance | 150+ | bank, credit-card, chart, coin, dollar |
| Communication | 100+ | mail, chat, bell, phone, send |
| Media | 80+ | play, pause, volume, camera, video |
| Maps & Navigation | 60+ | map, pin, compass, route |
| Files & Documents | 70+ | file, folder, upload, download |
| Users & Identity | 80+ | user, avatar, team, badge, DID |
| Calendar & Time | 50+ | calendar, clock, schedule, timer |
| E-commerce | 90+ | cart, bag, tag, gift, coupon |
| Health & Science | 60+ | heart, pulse, dna, flask |
| Weather | 40+ | sun, moon, cloud, rain, wind |
| Nature | 40+ | leaf, tree, flower, water |
| Food & Drink | 50+ | coffee, pizza, drink, chef |
| Transport | 60+ | car, truck, plane, ship, bike |
| Sports & Fitness | 40+ | dumbbell, ball, run, trophy |
| Tools & Tech | 80+ | code, terminal, cpu, database |
| Emoji-style | 200+ | face expressions, gestures, objects |

---

## Usage

### HTML `<img>`

```html
<img
  src="@wikialisalabs/icons/icons/outline/home.svg"
  width="24"
  height="24"
  alt="Home"
/>
```

### Inline SVG (recommended for color control)

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12l-2 0l9-9l9 9l-2 0"/>
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
</svg>
```

### React / JSX

```jsx
import HomeIcon from '@wikialisalabs/icons/react/outline/Home';

export function Nav() {
  return (
    <button>
      <HomeIcon size={20} color="currentColor" />
      Home
    </button>
  );
}
```

### Vue SFC

```vue
<script setup>
import HomeIcon from '@wikialisalabs/icons/vue/outline/Home.vue';
</script>

<template>
  <button>
    <HomeIcon :size="20" />
    Home
  </button>
</template>
```

### CSS `url()`

```css
.icon-home {
  background-image: url('@wikialisalabs/icons/icons/outline/home.svg');
  background-size: 24px 24px;
  width: 24px;
  height: 24px;
}
```

---

## Sizing Guidelines

| Size | px | Use case |
| --- | --- | --- |
| xs | 12px | Badges, chips, dense UI |
| sm | 16px | Inline text icons, buttons |
| md | 20px | Default — toolbar, nav |
| lg | 24px | Feature icons, cards |
| xl | 32px | Hero icons, empty states |
| 2xl | 48px | Illustrations, splash screens |

---

## Accessibility

- Always pair icons with accessible text (visible label or `aria-label`)
- For decorative icons, use `aria-hidden="true"`
- Inline SVG with `stroke="currentColor"` inherits text color — honors forced-colors/high-contrast mode

```html
<!-- Accessible button with icon -->
<button aria-label="Send transaction">
  <svg aria-hidden="true" ...>...</svg>
</button>

<!-- Decorative icon + visible label -->
<span>
  <svg aria-hidden="true" ...>...</svg>
  Send
</span>
```

---

## Customization

```css
/* Override stroke width for thicker icons */
.icon-thick {
  stroke-width: 2.5;
}

/* Teal accent icon */
.icon-accent {
  color: var(--primitive-teal-400); /* icons use currentColor */
}

/* Filled variant for active state */
.icon-active {
  fill: currentColor;
  stroke: none;
}
```
