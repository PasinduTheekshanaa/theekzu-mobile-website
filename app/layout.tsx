import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { BrandedLoader } from "@/components/BrandedLoader";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://theekzumobile.lk"),
  title: "Theekzu Mobile | Premium iPhones & Accessories Sri Lanka",
  description:
    "Shop premium iPhones, used iPhones, accessories and mobile deals from Theekzu Mobile Sri Lanka. Trusted service, Apple warranty, and instant WhatsApp ordering.",
  keywords: [
    "Theekzu Mobile",
    "iPhone Sri Lanka",
    "iPhone 16 Pro Max Sri Lanka",
    "Used iPhones Colombo",
    "Buy Apple iPhone Sri Lanka",
    "AirPods Pro Sri Lanka",
    "Apple Watch Ultra 2 Sri Lanka",
    "iPhone Trade-In Sri Lanka",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Theekzu Mobile | Premium iPhones & Accessories Sri Lanka",
    description:
      "Shop premium iPhones, used iPhones, accessories and mobile deals from Theekzu Mobile Sri Lanka.",
    url: "https://theekzumobile.lk",
    siteName: storeConfig.businessName,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
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
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <BrandedLoader />
                <NavbarWrapper />
                <main className="flex-1 animate-in fade-in duration-300">{children}</main>
                <Footer />
                <CartDrawer />
                <WishlistDrawer />
                <FloatingWhatsApp />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}