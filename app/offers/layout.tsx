import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "iPhone Deals & Special Offers Sri Lanka | Theekzu Mobile",
  },
  description:
    "Get exclusive flash deals, discount prices, and weekend promotions on brand new and certified pre-owned Apple iPhones in Sri Lanka. Limited stock.",
  keywords: [
    "iPhone deals Sri Lanka",
    "iPhone discount Sri Lanka",
    "iPhone offers Colombo",
    "cheap iPhone price Sri Lanka",
    "Theekzu Mobile offers",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/offers",
  },
  openGraph: {
    title: "iPhone Deals & Special Offers Sri Lanka | Theekzu Mobile",
    description:
      "Get exclusive flash deals, discount prices, and weekend promotions on brand new and certified pre-owned Apple iPhones in Sri Lanka. Limited stock.",
    url: "https://theekzu.vercel.app/offers",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "iPhone Deals & Special Offers - Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone Deals & Special Offers Sri Lanka | Theekzu Mobile",
    description:
      "Exclusive flash deals and special discounts on Apple iPhones in Sri Lanka. Instant WhatsApp confirmation.",
    images: ["/logo.png"],
  },
};

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
