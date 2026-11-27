import { siteUrl } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Buy Apple iPhones in Sri Lanka | Theekzu Mobile",
  },
  description:
    "Buy iPhones in Sri Lanka at Theekzu Mobile. Compare new and quality-tested used iPhones, storage options and current prices with islandwide delivery.",
  keywords: [
    "iPhone Sri Lanka",
    "Buy iPhone Sri Lanka",
    "iPhone 16 Pro Max price Sri Lanka",
    "Used iPhones Sri Lanka",
    "Apple iPhone warranty Sri Lanka",
  ],
  alternates: {
    canonical: siteUrl("/iphones"),
  },
  openGraph: {
    title: "Buy Apple iPhones in Sri Lanka | Theekzu Mobile",
    description:
      "Buy iPhones in Sri Lanka at Theekzu Mobile. Compare new and quality-tested used iPhones, storage options and current prices with islandwide delivery.",
    url: siteUrl("/iphones"),
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 1024,
        height: 1024,
        alt: "Apple iPhones in Sri Lanka - Theekzu Mobile",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Apple iPhones in Sri Lanka | Theekzu Mobile",
    description:
      "Explore new and used iPhones in Sri Lanka at Theekzu Mobile. Compare models, prices and storage options.",
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
      name: "iPhones",
      item: siteUrl("/iphones"),
    },
  ],
};

export default function IPhonesLayout({
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
