# Theekzu Mobile — Production-Ready Next.js Storefront

> **"Premium iPhones. Trusted Service."**

A production-ready, Apple-inspired modern ecommerce website built for **Theekzu Mobile** (Sri Lanka's premier online destination for brand new & certified pre-owned Apple iPhones, Apple accessories, trade-ins, and direct WhatsApp ordering).

Built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **TypeScript**, and **Lucide React**. Fully optimized and ready for zero-configuration deployment to **Vercel**.

---

## 🌟 Features Overview

1. **Brand Identity & Dual-Theme Luxury Aesthetic:**
   - Apple-inspired dark luxury color palette (`#040711`, `#070c18`, `#0b1428`) with frosted glassmorphism and electric blue/cyan glow accents.
   - Clean, high-contrast light mode with silver-white glass panels, electric blue accents, and deep charcoal typography.
   - Official brand logo configured across navbar, footer, and browser app favicon.
   - Tagline: *“Premium iPhones. Trusted Service.”*
   - Fluid responsive layout adapting smoothly from 320px smartphones to ultrawide displays.

2. **Sticky Transparent Glass Navbar:**
   - Smooth backdrop blur that gently shrinks on scroll.
   - Links: Home, Shop, iPhones, Accessories, Offers, Trade-In, About, Contact.
   - Live Search modal trigger with instantaneous typing filter.
   - Wishlist drawer with live counter badge and localStorage persistence.
   - Cart drawer with live item counter badge and localStorage persistence.
   - Slim "Chat" direct WhatsApp button.
   - Hamburger drawer for mobile & tablet screens.

3. **Homepage (10 Rich Sections + FAQ & Delivery):**
   - **Hero** — Headline *“Upgrade Your World with Theekzu Mobile”*, dual CTA buttons, 3D mouse parallax on desktop, floating iPhone 16 Pro Max flagship mockup with glowing gradients, floating spec pills, and 4 trust badges (*Quality Checked, Best Prices, Trusted Service, Fast Support*).
   - **Featured iPhones** — iPhone 16 Pro Max, iPhone 16 Pro, iPhone 15 Pro Max, iPhone 15, iPhone 14 Pro Max (Used), and iPhone 13 (Used).
   - **Shop by Category** — Latest iPhones, Used iPhones, AirPods, Apple Watch, Chargers & Cables, Cases & Accessories.
   - **Special Offers** — Weekend iPhone Deals, Trade-In Bonus, Accessory Deals, Limited Stock with live countdown timer and subtle card shine animation.
   - **Why Choose Theekzu Mobile** — 6 icon advantage cards covering 32-point inspection, transparent LKR pricing, 1-year warranty, customer care, and islandwide delivery.
   - **Trade-In Center** — Headline *“Trade Your Old iPhone. Upgrade Smarter.”* with interactive form generating pre-filled WhatsApp estimate requests to `94740245749`.
   - **Flagship Showcase** — High-impact showcase for iPhone 16 Pro Max (Titanium, A18 Pro, 48MP Fusion, 33h battery, storage options, starting at Rs. 429,900).
   - **Customer Reviews Carousel** — Animated testimonial slider with auto-play, pause on hover, mobile touch swipe, previous/next arrows, and pagination dots.
   - **Social Media Hub** — Direct verified channels for Facebook, Instagram, TikTok, and WhatsApp.
   - **Final CTA** — *“Ready for Your Next iPhone?”* closing banner.
   - **Delivery Information** — Islandwide delivery notice with direct WhatsApp inquiry.
   - **FAQ Section** — Accordion addressing all 6 key buyer questions.

4. **Centralized Easy Price Update System (`data/products.ts`):**
   - Single central source of truth for all product details and LKR prices.
   - Formatted automatically across the entire site via `lib/formatCurrency.ts`.

---

## 💰 How to Update Product Prices

You can update any product price across the entire website in 5 seconds without touching multiple components:

1. Open `data/products.ts`.
2. Find the product you want to change (e.g., `iphone-16-pro-max`).
3. Change the `price` field (numeric value in Sri Lankan Rupees, e.g. `429900`):
   ```typescript
   {
     id: "iphone-16-pro-max",
     name: "iPhone 16 Pro Max",
     price: 429900, // <--- Change this number!
     oldPrice: 469900, // <--- (Optional) Strikethrough previous price
     stock: "In Stock",
     ...
   }
   ```
4. Save the file.
5. **The whole website updates automatically!** All product cards, shop filters, product detail pages, shopping cart, wishlist, and WhatsApp checkout messages reflect the new price immediately.

---

## 🛠️ Project Structure

```
Theekzu/
├── app/
│   ├── layout.tsx                # Root layout, HTML head, metadata, providers, BrandedLoader
│   ├── page.tsx                  # Home page (All 10 sections + FAQ + Delivery)
│   ├── globals.css               # Tailwind directives & glassmorphism utilities
│   ├── shop/page.tsx             # Filterable ecommerce product grid
│   ├── iphones/page.tsx          # Dedicated iPhones lineup
│   ├── accessories/page.tsx      # Dedicated Apple accessories lineup
│   ├── offers/page.tsx           # Special promotions & weekend deals
│   ├── trade-in/page.tsx         # Trade-in guide & estimation form
│   ├── about/page.tsx            # Story, mission, vision, stats
│   ├── contact/page.tsx          # Contact cards & WhatsApp/mailto form
│   └── product/[slug]/
│       ├── page.tsx              # Static params & SEO metadata
│       └── ProductDetailClient.tsx # Interactive gallery, storage, colors, WhatsApp order
├── components/
│   ├── Navbar.tsx                # Sticky blurred header & mobile drawer
│   ├── NavbarWrapper.tsx         # Handles search modal state cleanly
│   ├── BrandedLoader.tsx         # Quick sleek branded initial loading screen
│   ├── Hero.tsx                  # Hero section with mockup, parallax & trust badges
│   ├── FeaturedProducts.tsx      # 6 Featured iPhones
│   ├── ProductCard.tsx           # Reusable product card with 3D tilt & exact WhatsApp message
│   ├── CategoryGrid.tsx          # Shop by category cards
│   ├── SpecialOffers.tsx         # Promotional cards with countdown & subtle shine
│   ├── WhyChooseUs.tsx           # 6 advantage icon cards
│   ├── TradeInBanner.tsx         # Trade-in estimation form
│   ├── FlagshipShowcase.tsx      # iPhone 16 Pro Max deep dive
│   ├── CustomerReviews.tsx       # Animated customer review carousel (swipe, auto-play)
│   ├── SocialSection.tsx         # Social links & photo gallery
│   ├── FinalCTA.tsx              # Closing call to action
│   ├── FAQSection.tsx            # Accordion FAQs
│   ├── DeliveryInfo.tsx          # Islandwide delivery card
│   ├── CartDrawer.tsx            # Slide-out cart with WhatsApp checkout
│   ├── WishlistDrawer.tsx        # Slide-out saved wishlist
│   ├── SearchModal.tsx           # Instant live product query
│   ├── FloatingWhatsApp.tsx      # Sticky pulsing WhatsApp button
│   └── Footer.tsx                # Footer columns, social links, payment badges
├── config/
│   └── store.ts                  # Centralized business configuration
├── lib/
│   └── formatCurrency.ts         # Central currency formatter (Rs. 429,900)
├── data/
│   ├── products.ts               # Central catalog with LKR pricing & specs
│   ├── reviews.ts                # Customer reviews data
│   └── faqs.ts                   # Frequently asked questions
├── context/
│   ├── CartContext.tsx           # Cart state with localStorage & hydration safety
│   ├── WishlistContext.tsx       # Wishlist state with localStorage & hydration safety
│   └── ThemeContext.tsx          # Dark/Light theme mode state with localStorage
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
└── README.md
```

---

## 💻 How to Install and Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Then open your browser and navigate to:
```
http://localhost:3000
```

### 3. Test Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ How to Customize Your Store

### 1. Changing Store Information & WhatsApp Number
Open `config/store.ts`:
```typescript
export const storeConfig = {
  businessName: "Theekzu Mobile",
  tagline: "Premium iPhones. Trusted Service.",
  phone: "0740245749",
  whatsappNumber: "94740245749", // WhatsApp international format (without '+')
  email: "pasindutheekshana21@gmail.com",
  location: "Online Store – Sri Lanka",
  businessHours: "8.00 AM – 8.00 PM",
  social: {
    facebook: "https://www.facebook.com/share/1EF6rMFmEN/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/theekzu_mobile?igsi=MThtZGd1OTM3dmJiMg==",
    tiktok: "https://www.tiktok.com/@theekzu?_r=1&_t=ZS-99Tf73AGf1l",
    whatsapp: "https://wa.me/94740245749",
  },
};
```
*All phone links, WhatsApp buttons, footer info, and contact cards across the entire website are automatically updated when you edit this one file.*

### 2. Replacing Product Images
You can replace image URLs with any public image URL or local images placed in the `public/images/` folder (e.g., `/images/iphone16.png`). If adding a new remote domain, declare it in `next.config.mjs` under `images.remotePatterns`.

---

## 🚀 How to Deploy on Vercel

The website is 100% configured for Vercel with static site generation and client-side hydration.

### Method 1: Deploy via GitHub (Recommended)
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Theekzu Mobile website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/theekzu-mobile.git
   git push -u origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** -> **"Project"**.
4. Import your `theekzu-mobile` repository.
5. Framework Preset will automatically detect **Next.js**.
6. Click **"Deploy"**. Vercel will automatically build and publish your website with a free SSL certificate!

---

## 🌐 Connecting a Custom Domain (e.g. theekzumobile.lk)
1. On Vercel, go to your project **Dashboard** -> **Settings** -> **Domains**.
2. Enter your domain name (e.g. `theekzumobile.lk` or `www.theekzumobile.lk`).
3. Set the provided `A` record and `CNAME` in your domain DNS management panel (e.g. LK Domain Registry, Cloudflare, Namecheap, GoDaddy).
4. Vercel will automatically issue and renew a free SSL certificate for your domain.

---

## 📄 License
© 2026 Theekzu Mobile. All Rights Reserved.