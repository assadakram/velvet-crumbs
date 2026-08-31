# Velvet Crumbs | Next-Gen Pre-Order App

Welcome to the **Velvet Crumbs** Pre-Order Web Application. This repository hosts the next-generation web application designed for customers to explore, build, and place pre-orders for premium, hand-baked gourmet cookies, while providing bakery administration tools to manage pre-order availability.

---

## 🍪 What is Velvet Crumbs?

Velvet Crumbs is a dedicated home bakery located in **Turku, Raisio, and Kaarina, Finland**, founded by Sara, a food science expert. The bakery specializes in soft-baked gourmet cookies with gooey fillings and precise flavor chemistry (e.g., Lotus Biscoff, Nutella, Red Velvet, spiced cream cheese). Because cookies are baked fresh to order, the business operates on a **100% pre-order request model**.

---

## 🎯 Purpose of This Repository

This repository hosts a high-conversion, highly-polished **bilingual (English & Finnish)** pre-order web application.

Instead of forcing users through a rigid checkout/payment gateway system, the app utilizes an **interactive box-builder flow** embedded directly on the landing page (`/#order`) that compiles the order, sends an HTML email confirmation, and seamlessly redirects the customer to the bakery's **WhatsApp number (+358 41 317 0359)** for personal confirmation, delivery scheduling, and dietary coordination.

Additionally, the application includes a secure **Admin Management Panel (`/admin`)** allowing the bakery owner to pause or resume pre-orders, schedule reopening dates/times, and set custom bilingual pause notices in real-time.

---

## ✨ Key Features

### 🛒 Customer Pre-Order Flow
1. **Embedded Single-Page Experience**: The complete ordering stepper is embedded on the main landing page (`/#order`). Direct visits to `/order` gracefully redirect to `/#order`.
2. **Bilingual Support (FI / EN)**: Dynamic localized translation toggling. All product listings, form steps, validation notices, and checkout receipts adjust instantly.
3. **Interactive Stepper Box-Builder**: A dynamic selection grid (`CookieSelection`, `DateTimeSelection`, `DeliveryMethod`, `ContactDetails`, `SpecialRequests`, `CheckoutCTA`) where customers select cookies and view a live, itemized receipt breakdown.
4. **Automated Promotions**:
   * 🚚 **Free Delivery**: Automatically unlocks free local home delivery for orders of **6 or more cookies** (otherwise, local delivery is €5,00).
   * 🎁 **Bonus Surprise Cookie**: Automatically adds 1 free *Funfetti Surprise* cookie to the order receipt for every **batch of 8 cookies** selected.
5. **Dual Notification & WhatsApp Redirection**:
   * Submits form data to `POST /api/order`.
   * Delivers a formatted HTML order receipt to the bakery (`RECEIVER_EMAIL`) via Nodemailer with optional customer BCC.
   * Redirects to WhatsApp after submission to confirm final details with Sara directly.
6. **Allergen Notice Banner**: Sticky alert banner highlighting allergen information and custom dietary request support.

---

### 🛡️ Admin & Pre-Order Management Dashboard (`/admin`)
1. **Live Pause & Resume Control**: Easily pause taking new pre-orders during sold-out periods or high-volume baking days.
2. **Scheduled Auto-Resume**: Set a specific resume date (YYYY-MM-DD) and time (HH:mm) in Europe/Helsinki time. Displays a live countdown timer to prospective customers.
3. **Custom Bilingual Notices**: Set custom pause announcements in both English and Finnish to inform customers when pre-orders reopen.
4. **Secure Authentication**: Authenticates via `ADMIN_SECRET` using secure HttpOnly session cookies (`velvet_admin_session`) or header tokens (`x-admin-secret`).
5. **Firebase Cloud Firestore Persistence**: Settings and promotional coupons persist in real-time cloud storage via Firebase Firestore with zero hosting costs.
6. **Server-Time Synchronization**: `GET /api/time` provides UTC server timestamps aligned with `Europe/Helsinki` time to ensure clock accuracy across devices.

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router)
* **UI & Rendering**: React 19 (Client & Server Components)
* **State & Data Storage**: [Firebase Cloud Firestore (`firebase-admin`)](https://firebase.google.com/docs/firestore) for persistent pre-order settings and coupon codes
* **Email System**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP with HTML receipt template & conditional BCC)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom warm color palette (`#FFF9F5` background, `#F48B7D` primary accent)
* **Icons**: [Lucide React](https://lucide.dev/) (with custom SVG overrides for TikTok, Instagram, and Facebook)
* **Language System**: Key-value translation dictionaries supporting English (`en`) and Finnish (`fi`)

---

## 📂 Project Structure

```text
velvet_crumbs_next_gen_pre_order_app/
├── public/                    # Static assets (logos, images, favicon)
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx       # Admin management dashboard (/admin)
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   └── coupons/   # Coupon management API (Firestore)
│   │   │   ├── coupons/
│   │   │   │   └── validate/  # Coupon validation API (Firestore)
│   │   │   ├── order/
│   │   │   │   └── route.ts   # Order processing & Nodemailer email endpoint
│   │   │   ├── preorder-settings/
│   │   │   │   ├── route.ts   # GET/POST pre-order status & Firestore sync
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts # Admin secret authentication endpoint
│   │   │   │   └── logout/
│   │   │   │       └── route.ts # Session termination endpoint
│   │   │   └── time/
│   │   │       └── route.ts   # Server timestamp endpoint (Europe/Helsinki time)
│   │   ├── order/
│   │   │   └── page.tsx       # Order page redirect (redirects to /#order)
│   │   ├── globals.css        # Tailwind CSS imports & base styles
│   │   ├── layout.tsx         # Global body layout, fonts & SEO metadata
│   │   ├── page.tsx           # Home page (Hero, Story, Menu, embedded OrderSection, Footer)
│   │   ├── robots.ts          # Search engine crawler configuration
│   │   └── sitemap.ts         # Dynamic sitemap generator
│   ├── components/
│   │   ├── checkout/          # Modular order form components
│   │   │   ├── CheckoutCTA.tsx
│   │   │   ├── ContactDetails.tsx
│   │   │   ├── CookieSelection.tsx
│   │   │   ├── DateTimeSelection.tsx
│   │   │   ├── DeliveryMethod.tsx
│   │   │   ├── PromoCode.tsx
│   │   │   └── SpecialRequests.tsx
│   │   ├── CookieMenu.tsx      # Signature cookie menu display
│   │   ├── Hero.tsx            # Hero section with primary calls-to-action
│   │   ├── Icons.tsx           # Custom brand SVG icons (Instagram, TikTok, Facebook)
│   │   ├── OrderSection.tsx    # Order section container & pause state handler
│   │   ├── SafeImage.tsx       # Image fallback handler
│   │   └── Story.tsx           # Bakery origin story section
│   ├── constants/
│   │   ├── cookies.ts          # Cookie menu definitions & pricing
│   │   └── translations.ts     # EN / FI translation strings
│   └── lib/
│       ├── firebaseAdmin.ts    # Firebase Admin SDK & Firestore singleton
│       └── preorderQueries.ts  # TypeScript definitions for preorder settings
├── .env.example               # Template environment variables configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript compiler configuration
```

---

## 📡 API Endpoints Reference

| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/api/order` | `POST` | Public | Validates order payload, sends Nodemailer HTML email, and returns order summary for WhatsApp redirect. |
| `/api/preorder-settings` | `GET` | Public / Admin | Returns current pause status, scheduled resume date/time, and custom messages. Accepts `x-admin-validate: true` header to check auth. |
| `/api/preorder-settings` | `POST` | Admin | Updates pause/resume settings in Firestore. Requires admin cookie or `x-admin-secret` header. |
| `/api/admin/coupons` | `GET` / `POST` | Admin | Retrieves, creates, updates, and deletes promo coupon codes. |
| `/api/coupons/validate` | `POST` | Public | Validates customer promo codes at checkout. |
| `/api/preorder-settings/login` | `POST` | Public | Validates `secret` against `ADMIN_SECRET` and sets an HttpOnly `velvet_admin_session` cookie. |
| `/api/preorder-settings/logout` | `POST` | Admin | Clears the `velvet_admin_session` cookie. |
| `/api/time` | `GET` | Public | Returns server ISO time string (`{ serverTime }`) to ensure accurate client countdown timers. |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/assadakram/velvet-crumbs.git
cd velvet_crumbs_next_gen_pre_order_app
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (copied from `.env.example`):
```bash
cp .env.example .env
```

Define the required variables:
```env
# Gmail SMTP Configuration for Nodemailer
GMAIL_USER=example@gmail.com
GMAIL_PASS=your_16_character_app_password

# Order Notification Target Email
RECEIVER_EMAIL=bakery@domain.com

# WhatsApp Phone Number (country code without '+' or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER=358413170359

# Admin Dashboard Secret
ADMIN_SECRET=your_secure_admin_secret_key

# Firebase Admin SDK Configuration (Cloud Firestore)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkq...\n-----END PRIVATE KEY-----\n"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### 4. Code Quality & Type Check
```bash
npx tsc --noEmit
npm run lint
```

### 5. Production Build & Execution
```bash
npm run build
npm start
```
