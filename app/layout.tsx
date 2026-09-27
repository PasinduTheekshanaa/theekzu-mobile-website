import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { BrandedLoader } from "@/components/BrandedLoader";
import { storeConfig } from "@/config/store";
import { getServerCatalog } from "@/lib/serverCatalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#040711" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://theekzu.vercel.app"),
  title: {
    default: "Theekzu Mobile | iPhone Store Sri Lanka",
    template: "%s | Theekzu Mobile",
  },
  description:
    "Welcome to Theekzu Mobile, your premier iPhone Store Sri Lanka. Buy 100% genuine brand new and certified pre-owned Apple devices and iPhones with official warranty, islandwide delivery, and instant WhatsApp support in Sri Lanka.",
  keywords: [
    "Theekzu Mobile",
    "Theekzu",
    "Theekzu Mobile Sri Lanka",
    "Theekzu iPhone Sri Lanka",
    "iPhone Store Sri Lanka",
    "iPhone Sri Lanka",
    "iPhone price Sri Lanka",
    "Buy iPhone Sri Lanka",
    "Apple iPhone Sri Lanka",
    "Apple devices Sri Lanka",
    "iPhone 16 Pro Max Sri Lanka",
    "Used iPhones Colombo",
    "Apple accessories Sri Lanka",
    "iPhone warranty Sri Lanka",
  ],
  authors: [{ name: "Theekzu Mobile", url: "https://theekzu.vercel.app/" }],
  creator: "Theekzu Mobile",
  publisher: "Theekzu Mobile",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://theekzu.vercel.app/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Theekzu Mobile | iPhone Store Sri Lanka",
    description:
      "Welcome to Theekzu Mobile, your premier iPhone Store Sri Lanka. Buy 100% genuine brand new and certified pre-owned Apple devices and iPhones with official warranty, islandwide delivery, and instant WhatsApp support in Sri Lanka.",
    url: "https://theekzu.vercel.app/",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Theekzu Mobile Official Brand Logo",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theekzu Mobile | iPhone Store Sri Lanka",
    description:
      "Welcome to Theekzu Mobile, your premier iPhone Store Sri Lanka. Buy 100% genuine brand new and certified pre-owned Apple devices and iPhones with official warranty, islandwide delivery, and instant WhatsApp ordering.",
    images: ["/logo.png"],
    creator: "@theekzumobile",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Theekzu Mobile",
  alternateName: "Theekzu",
  url: "https://theekzu.vercel.app/",
  logo: "https://theekzu.vercel.app/logo.png",
  image: "https://theekzu.vercel.app/logo.png",
  description:
    "Theekzu Mobile is Sri Lanka's trusted online iPhone store offering 100% genuine brand new sealed and certified pre-owned Apple devices and iPhones with official warranty, islandwide delivery, and fast customer support.",
  telephone: "+94740245749",
  email: "pasindutheekshana21@gmail.com",
  priceRange: "LKR 50,000 - LKR 700,000",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "20:00",
  },
  sameAs: [
    "https://www.facebook.com/share/1EF6rMFmEN/?mibextid=wwXIfr",
    "https://www.instagram.com/theekzu_mobile?igsi=MThtZGd1OTM3dmJiMg==",
    "https://www.tiktok.com/@theekzu?_r=1&_t=ZS-99Tf73AGf1l",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Theekzu Mobile",
  alternateName: "Theekzu",
  url: "https://theekzu.vercel.app/",

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { products: initialProducts, imagesMap: initialImagesMap, error: initialError } = await getServerCatalog();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theekzu_theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#f8fafc] text-slate-900 dark:bg-[#040711] dark:text-slate-100 antialiased selection:bg-cyan-500 selection:text-white flex flex-col min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <ProductProvider initialProducts={initialProducts} initialImagesMap={initialImagesMap} initialError={initialError}>
            <CartProvider>
              <WishlistProvider>

                <NavbarWrapper />
                <main className="flex-1 animate-in fade-in duration-300">{children}</main>
                <Footer />
                <CartDrawer />
                <WishlistDrawer />
                <FloatingWhatsApp />
                <BackToTop />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}