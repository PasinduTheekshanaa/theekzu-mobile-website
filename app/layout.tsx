import { siteUrl } from "@/config/site";
import { HOME_SEO_TITLE, HOME_SEO_DESCRIPTION } from "@/config/seo";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { StoreOverlays } from "@/components/StoreOverlays";

import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { SiteScrollReveal } from "@/components/SiteScrollReveal";
import { storeConfig } from "@/config/store";
import { getServerCatalog } from "@/lib/serverCatalog";

export const revalidate = 30;

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl("/")),
  title: {
    default: HOME_SEO_TITLE,
    template: "%s | Theekzu Mobile",
  },
  description:
    HOME_SEO_DESCRIPTION,
  keywords: ["Theekzu", "Theekzu Mobile", "Theekzu Mobile Sri Lanka", "iPhones Sri Lanka", "Buy iPhones in Sri Lanka", "Used iPhones Sri Lanka", "iPhone accessories Sri Lanka"],
  authors: [{ name: "Theekzu Mobile", url: siteUrl("/") }],
  creator: "Theekzu Mobile",
  publisher: "Theekzu Mobile",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl("/"),
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
    title: HOME_SEO_TITLE,
    description:
      HOME_SEO_DESCRIPTION,
    url: siteUrl("/"),
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 1024,
        height: 1024,
        alt: "Theekzu Mobile Official Brand Logo",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO_TITLE,
    description:
      HOME_SEO_DESCRIPTION,
    images: ["/brand-logo.png"],
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
  "@id": siteUrl("/#organization"),
  name: "Theekzu Mobile",
  alternateName: "Theekzu",
  url: siteUrl("/"),
  logo: siteUrl("/brand-logo.png"),
  image: siteUrl("/brand-logo.png"),
  description:
    HOME_SEO_DESCRIPTION,
  telephone: "+94740245749",
  email: "pasindutheekshana21@gmail.com",
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
  "@id": siteUrl("/#website"),
  publisher: { "@id": siteUrl("/#organization") },
  name: "Theekzu Mobile",
  alternateName: "Theekzu",
  url: siteUrl("/"),

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { products: initialProducts, imagesMap: initialImagesMap, error: initialError } = await getServerCatalog();

  return (
    <html lang="en" className="scroll-smooth light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && <>
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        </>}
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
                  localStorage.setItem('theekzu_theme', 'light');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-canvas text-ink antialiased flex flex-col min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <ProductProvider initialProducts={initialProducts} initialImagesMap={initialImagesMap} initialError={initialError}>
            <CartProvider>
              <WishlistProvider>

                <NavbarWrapper />
                <main data-site-content className="flex-1 animate-in fade-in duration-300">{children}<SiteScrollReveal /></main>
                <Footer />
                <StoreOverlays />
                
                <BackToTop />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
