# Tip Top — Dry Clean Studio (Marakkadamukku, Varkala)

A modern, high-converting single-page advertisement website for **Tip Top Dry Clean Studio**, located at **Marakkadamukku, Varkala, Kerala** (മരക്കടമുക്ക്, വർക്കല). Designed with agency-grade aesthetics, intentional whitespace, refined typography, and smooth micro-interactions — built with pure vanilla web technologies and zero dependencies.

---

## ✨ Brand Identity & Features

- **Authentic Signboard Branding**:
  - **Business Name**: Tip Top Dry Clean Studio
  - **Tagline**: Quality Dry-Cleaners • Color Quality Assurance
  - **Official Colors**: Royal Blue (`#0047BA`), Studio Magenta (`#E6007E`), Mascot Yellow (`#FFC700`), Deep Navy (`#0A192F`), and Clean White (`#FFFFFF`).
  - **Location**: Marakkadamukku, Varkala (മരക്കടമുക്ക്, വർക്കല), Kerala, India
  - **Direct Contact / WhatsApp**: `+91 95679 46202` (or `9567946202`)
- **Core Services (Direct from Signboard)**:
  1. **Dry Cleaning** — Quality dry-cleaning with color quality assurance for suits, silk sarees, delicate fabrics, and wedding wear.
  2. **Steam Iron** — Commercial steam pressing for crisp, wrinkle-free shirts, trousers, and traditional dhotis (mundu).
  3. **Laundry** — Hygienic daily wash & fold service for everyday clothes and household linens.
  4. **Curtain Cleaning** — Deep cleaning and dust extraction for heavy drapes, window curtains, and sofa cushion fabrics.
  5. **Shoe Cleaning** — Sneakers, canvas, sports, and leather footwear cleaning and restoration.
- **Storefront Proof**: Showcases the authentic shop board image in the studio section to build immediate trust with local customers.
- **Conversion Touchpoints**:
  - Persistent WhatsApp Floating Action Button (FAB) linked directly to `https://wa.me/919567946202`.
  - Direct one-tap phone call buttons (`tel:+919567946202`).
  - Google Maps location embed for Marakkadamukku, Varkala.
- **100% Mobile & Phone Optimized**: Tailored viewports (down to 360px), accessible 44×44px hamburger menu, full slide-out mobile drawer with direct CTAs, and iOS safe area padding.
- **Zero Build Step**: Pure HTML5, CSS3, and ES6 JavaScript. No Node.js build process, no npm installs, and near-instant load times.

---

## 📁 Project Structure

```
TipTop/
├── site/
│   ├── index.html        # Clean semantic HTML markup with shop info & location
│   ├── css/
│   │   └── styles.css    # Design tokens, brand colors (Royal Blue & Magenta), responsive media queries
│   ├── js/
│   │   └── main.js       # Modular vanilla JS (scroll reveals, mobile drawer, smooth scroll)
│   └── images/
│       ├── logo.png          # Mascot logo extracted from the official signboard
│       ├── shop-banner.jpg   # Storefront board photo
│       └── shop-board.jpg    # Full horizontal signboard banner
└── README.md             # Project documentation
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

## 🎨 Design Tokens & Customization

### 1. Colors & Typography
Design tokens are centralized at the top of [`site/css/styles.css`](site/css/styles.css):

```css
:root {
  --navy: #0A192F;           /* Primary text & deep sections */
  --blue-brand: #0047BA;     /* Tip Top royal blue */
  --magenta: #E6007E;        /* Dry Clean Studio pink */
  --yellow-brand: #FFC700;   /* Quality Dry-Cleaners emblem yellow */
  --surface: #F8FAFC;        /* Light card backgrounds */
  --border: #E2E8F0;         /* Dividers & subtle borders */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-malayalam: 'Noto Sans Malayalam', sans-serif;
}
```

### 2. Contact & WhatsApp Details
Update phone numbers and WhatsApp links in [`site/index.html`](site/index.html):
- **WhatsApp links**: `https://wa.me/919567946202`
- **Call links**: `tel:+919567946202`

### 3. Studio Location
- **Address**: Marakkadamukku, Varkala, Thiruvananthapuram District, Kerala — 695141
- **Google Maps query**: `Marakkadamukku, Varkala, Kerala`

---

## 🌐 Deployment

Because this project uses pure static files, it can be hosted anywhere with zero configuration:
- **GitHub Pages**: Set the publishing source to `/site` or move files to root.
- **Vercel / Netlify / Cloudflare Pages**: Set the publish directory to `site`.
- **Traditional Hosting (cPanel / Apache / Nginx)**: Upload the files inside `site/` to your server's `public_html` directory.
