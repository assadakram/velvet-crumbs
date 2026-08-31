import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FFF9F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Velvet Crumbs | Handmade Gourmet Cookies Pre-Order",
  description: "Delightful handmade cookies baked fresh and delivered in Turku, Raisio, & Kaarina. Explore chocolate, red velvet, lotus, and peanut cookies today!",
  keywords: ["cookies", "keksit", "Turku", "Raisio", "Kaarina", "bakery", "leipomo", "pre-order", "gourmet", "handmade", "tilaus"],
  authors: [{ name: "Velvet Crumbs" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/images/Logo.jpg",
  },
  alternates: {
    canonical: "https://velvetcrumbs.eu",
    languages: {
      "en": "https://velvetcrumbs.eu/?lang=en",
      "fi": "https://velvetcrumbs.eu/?lang=fi",
    },
  },
  openGraph: {
    title: "Velvet Crumbs | Handmade Gourmet Cookies Pre-Order",
    description: "Delightful handmade cookies baked fresh and delivered in Turku, Raisio, & Kaarina. Explore chocolate, red velvet, lotus, and peanut cookies today!",
    url: "https://velvetcrumbs.eu",
    siteName: "Velvet Crumbs",
    locale: "en_US",
    alternateLocale: ["fi_FI"],
    type: "website",
    images: [
      {
        url: "/images/Logo.jpg",
        width: 800,
        height: 800,
        alt: "Velvet Crumbs Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velvet Crumbs | Handmade Gourmet Cookies Pre-Order",
    description: "Delightful handmade cookies baked fresh and delivered in Turku, Raisio, & Kaarina.",
    images: ["/images/Logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Velvet Crumbs",
    "image": "https://velvetcrumbs.eu/images/Logo.jpg",
    "@id": "https://velvetcrumbs.eu/#bakery",
    "url": "https://velvetcrumbs.eu",
    "telephone": "+358 41 317 0359",
    "priceRange": "3,99 € - 4,50 €",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kunnallissairaalantie 52A 48",
      "addressLocality": "Turku",
      "postalCode": "20810",
      "addressCountry": "FI"
    },
    "sameAs": [
      "https://www.instagram.com/velvet_crumbs_/"
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Turku"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Raisio"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Kaarina"
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="bakery-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
        {children}
      </body>
    </html>
  );
}
