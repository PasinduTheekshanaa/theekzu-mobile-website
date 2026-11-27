import { siteUrl } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Shop iPhones & Apple Accessories | Theekzu Mobile Sri Lanka",
  },
  description:
    "Buy new and used iPhones in Sri Lanka at Theekzu Mobile. Browse available models, chargers, cables, cases and screen protectors, with islandwide delivery and WhatsApp ordering.",
  keywords: [
    "Shop iPhones Sri Lanka",
    "iPhone price Sri Lanka",
    "Buy iPhones in Sri Lanka",
    "Apple accessories Sri Lanka",
    "Theekzu Mobile shop",
  ],
  alternates: {
    canonical: siteUrl("/shop"),
  },
  openGraph: {
    title: "Shop iPhones & Apple Accessories | Theekzu Mobile Sri Lanka",
    description:
      "Buy new and used iPhones in Sri Lanka at Theekzu Mobile. Browse available models, chargers, cables, cases and screen protectors, with islandwide delivery and WhatsApp ordering.",
    url: siteUrl("/shop"),
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 1024,
        height: 1024,
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
      "Browse new and used iPhones, chargers, cables and phone accessories at Theekzu Mobile in Sri Lanka.",
    images: ["/brand-logo.png"],
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
      item: siteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: siteUrl("/shop"),
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
