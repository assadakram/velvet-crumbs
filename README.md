# Velvet Crumbs | Next-Gen Pre-Order App

Welcome to the **Velvet Crumbs** Pre-Order Web Application. This repository hosts the next-generation single-page application (SPA) designed to let customers customize, build, and place pre-orders for premium, hand-baked gourmet cookies.

---

## 🍪 What is Velvet Crumbs?

Velvet Crumbs is a dedicated home bakery located in **Turku, Raisio, and Kaarina, Finland**, founded by Sara, a food science expert. The bakery specializes in soft-baked gourmet cookies with gooey fillings and precise flavor chemistry (e.g., Lotus Biscoff, Nutella, Red Velvet, spiced cream cheese). Because cookies are baked fresh to order, the business operates on a **100% pre-order request model**.

---

## 🎯 Purpose of This Repository

This repository hosts a high-conversion, highly-polished **bilingual (English & Finnish)** pre-order builder. 

Instead of forcing users through a rigid checkout/payment gateway system, the app utilizes an **interactive box-builder flow** that compiles the order and outputs it directly to the bakery's **WhatsApp number (+358 41 317 0359)**. This allows for quick personal confirmation, delivery scheduling, and dietary coordination directly between the customer and the baker.

---

## ✨ Key Features

1. **Bilingual Support (FI / EN)**: The website supports instant localized translation toggling. All product listings, form steps, validation notices, and checkout receipts adjust dynamically.
2. **Interactive Stepper Box-Builder**: A dynamic selection grid where customers can add or remove cookies (Chocolate Indulgence, Lotus Gold, Ruby Velvet Bliss, etc.) and see a real-time invoice/receipt.
3. **Automated Order Promotions**:
   * 🚚 **Free Delivery**: Automatically unlocks free local home delivery for orders of **6 or more cookies** (otherwise, local delivery is €5,00).
   * 🎁 **Bonus Surprise Cookie**: Automatically adds 1 free *Funfetti Surprise* cookie to the order receipt for every **batch of 8 cookies** selected.
4. **Structured Pre-Order Flow**:
   * **Step 1: Contact Details** (Name, Phone/WhatsApp, optional Address)
   * **Step 2: Box Builder** (Cookie quantities + live receipt)
   * **Step 3: Delivery Details** (Date selector with today's date as min limit, preferred time windows)
   * **Step 4: Dietary & Special Requests** (Allergen options, gift cards)
   * **Step 5: Fulfillment Method** (Direct Home Delivery vs. Self-pickup from Kunnallissairaalantie 52A, Turku)
5. **Checkout Dispatching**:
   * Fires a background API request (`POST /api/order`) to log the inquiry details.
   * Compiles the selections into a beautifully formatted text payload and redirects the user to WhatsApp Web or the WhatsApp mobile app to submit the request.
6. **Graceful Assets Handling**:
   * Automatically falls back to high-resolution placeholder images or styled initials if local asset paths (`Logo_2.jpg`) are missing.

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router)
* **Library**: React 19 (Client Components, Hooks: `useState`, `useEffect`, `useMemo`)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom warm color palette (`#FFF9F5` background, `#F48B7D` accents)
* **Icons**: [Lucide React](https://lucide.dev/) (with custom SVG overrides for social brand icons like `Instagram` and `Facebook` to ensure robust rendering across environments)
* **Language Support**: Custom key-value translation dictionaries for `en` and `fi`

---

## 📂 Project Structure

```text
velvet_crumbs_next_gen_pre_order_app/
├── src/
│   └── app/
│       ├── layout.tsx     # Global HTML/Body layout, Google Font integrations, and SEO metadata
│       ├── page.tsx       # Core pre-order builder page (includes products, translations, form logic & styling)
│       └── globals.css    # Tailwind CSS imports and global base styles
├── public/                # Public assets (logos, images, etc.)
├── package.json           # Application dependencies and build scripts
└── tsconfig.json          # TypeScript compiler configuration (configured with strict: false for maximum runtime flexibility)
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
First, install the necessary node modules:
```bash
npm install
```

### 2. Run the Development Server
Run the local dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Verify & Type-check
Check for any TypeScript compilation warnings:
```bash
npx tsc --noEmit
```

### 4. Build for Production
To build the static application bundle:
```bash
npm run build
```
