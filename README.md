# Tip Top — Premium Dry Cleaning Studio

A modern, high-conversion single-page advertisement website for **Tip Top Dry Cleaning Studio**. Designed with agency-level aesthetics, intentional whitespace, refined typography, and smooth micro-interactions — built with pure vanilla web technologies and zero dependencies.

---

## ✨ Features

- **Agency-Grade Visual Design**: Clean, editorial aesthetic inspired by modern award-winning layouts (Awwwards-style). Balanced typography and curated color palette (Deep Navy, Crisp White, Refined Teal).
- **Modular Codebase**: Clean separation of concerns with standalone HTML, organized CSS design system, and lightweight vanilla JavaScript for effortless debugging and maintenance.
- **Bento Grid Services Showcase**: Visual showcase of core services — Dry Cleaning, Steam Ironing, Wash & Fold, Shoe Cleaning, and Curtain & Upholstery care.
- **Four-Step Process Guide**: Clear, easy-to-follow flow showing customers how the pickup, cleaning, and delivery works.
- **Interactive Micro-Interactions**: Scroll-triggered reveal animations powered by native `IntersectionObserver` with zero external library bloat.
- **Conversion-Focused Contact Touchpoints**: Direct call actions, email links, and a persistent WhatsApp Floating Action Button (FAB) for instant booking inquiries.
- **Studio Location & Hours**: Embedded Google Map, detailed physical address, and weekly operating schedule.
- **100% Responsive**: Tailored fluid layouts optimized across mobile, tablet, and desktop viewports, complete with a slide-out mobile drawer menu.
- **Zero Build Step & Lightning Fast**: Pure HTML5, CSS3, and ES6 JavaScript. No Node.js build process, no npm installs, and near-instant load times.

---

## 📁 Project Structure

```
TipTop/
├── site/
│   ├── index.html        # Clean semantic HTML markup and content structure
│   ├── css/
│   │   └── styles.css    # Design tokens, layout, typography, animations, responsive media queries
│   └── js/
│       └── main.js       # Modular vanilla JS (scroll reveals, mobile nav, header states)
└── README.md             # Project documentation and customization guide
```

---

## 🚀 Getting Started

No build tools or package managers required. You can preview the website immediately:

### Option 1: Open Directly in Browser
Double-click `site/index.html` or drag it into any modern web browser.

### Option 2: Local HTTP Server (Recommended)

#### Using Python 3:
```bash
cd site
python3 -m http.server 8080
```
Then visit: [http://localhost:8080](http://localhost:8080)

#### Using Node (`npx`):
```bash
npx serve site
```

#### Using PHP:
```bash
cd site
php -S localhost:8080
```

---

## 🎨 Customization Guide

### 1. Colors & Typography
Design tokens are centralized at the top of [`site/css/styles.css`](site/css/styles.css) in the `:root` pseudo-class:

```css
:root {
  --navy: #0A192F;           /* Primary brand & text color */
  --teal: #0D9488;           /* Accent & CTA highlight color */
  --teal-hover: #0F766E;     /* Button hover state */
  --surface: #F8FAFC;        /* Light background sections */
  --border: #E2E8F0;         /* Card borders and dividers */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
```

### 2. Contact & Booking Details
Update phone numbers, email addresses, and WhatsApp links in [`site/index.html`](site/index.html):
- **WhatsApp links**: Replace `https://wa.me/971501234567` with your business WhatsApp phone number (country code + number, without `+` or spaces).
- **Direct call links**: Update `tel:+971501234567`.
- **Email links**: Update `mailto:hello@tiptopstudio.ae`.

### 3. Studio Location & Google Maps
- Update the store address and opening hours in the `#location` section of `site/index.html`.
- To update the map embed, get your Google Maps embed code via **Google Maps > Share > Embed a map** and replace the `src` attribute of the `<iframe>` in `site/index.html`.

### 4. Images & Photography
- Replace the Unsplash imagery URLs with high-resolution photography of your actual shop, garments, and team.
- Update the logo `<img>` in `<header>` and the hero section visual as needed.

---

## 🌐 Deployment

Because this project uses pure static files, it can be hosted anywhere with zero configuration:

- **GitHub Pages**: Set the publishing source to `/site` or move the files to root.
- **Vercel / Netlify / Cloudflare Pages**: Connect your Git repository and set the publish directory to `site`.
- **Traditional Hosting (Apache / Nginx / cPanel)**: Upload the files inside `site/` to your server's `public_html` or web root directory.

---

## 🛠 Tech Stack

- **HTML5**: Semantic tags, accessible landmarks, and Open Graph / viewport meta tags.
- **CSS3**: CSS Custom Properties, CSS Grid, Flexbox, `clamp()` fluid typography, and transitions.
- **JavaScript**: Vanilla ES6 (`IntersectionObserver`, smooth scrolling, event listeners).
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) & [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts.
- **Icons**: Inline SVG icons (crisp resolution on all screens, zero external icon font libraries).
