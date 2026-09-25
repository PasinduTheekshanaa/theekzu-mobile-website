import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Shop iPhones & Apple Accessories | Theekzu Mobile Sri Lanka",
  },
  description:
    "Browse our full catalog of brand new sealed and certified pre-owned Apple iPhones, AirPods, Apple Watches, and fast chargers at the best prices in Sri Lanka.",
  keywords: [
    "Shop iPhones Sri Lanka",
    "iPhone price Sri Lanka",
    "Buy Apple iPhone Colombo",
    "Apple accessories Sri Lanka",
    "Theekzu Mobile shop",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/shop",
  },
  openGraph: {
    title: "Shop iPhones & Apple Accessories | Theekzu Mobile Sri Lanka",
    description:
      "Browse our full catalog of brand new sealed and certified pre-owned Apple iPhones, AirPods, Apple Watches, and fast chargers at the best prices in Sri Lanka.",
    url: "https://theekzu.vercel.app/shop",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Shop iPhones & Apple Accessories - Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop iPhones & Apple Accessories | Theekzu Mobile Sri Lanka",
    description:
      "Browse our full catalog of brand new sealed and certified pre-owned Apple iPhones, AirPods, and accessories with genuine warranty in Sri Lanka.",
    images: ["/logo.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://theekzu.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: "https://theekzu.vercel.app/shop",
    },
  ],
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
