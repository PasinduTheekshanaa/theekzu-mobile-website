import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Original Apple Accessories Sri Lanka | Theekzu Mobile",
  },
  description:
    "Shop genuine chargers, cables, MagSafe cases, screen protectors and Apple accessories in Sri Lanka.",
  keywords: [
    "Apple accessories Sri Lanka",
    "Apple 20W charger Sri Lanka",
    "MagSafe charger Sri Lanka",
    "iPhone cases Sri Lanka",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/accessories",
  },
  openGraph: {
    title: "Original Apple Accessories Sri Lanka | Theekzu Mobile",
    description:
      "Shop genuine chargers, cables, MagSafe cases, screen protectors and Apple accessories in Sri Lanka.",
    url: "https://theekzu.vercel.app/accessories",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Original Apple Accessories - Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Original Apple Accessories Sri Lanka | Theekzu Mobile",
    description:
      "Shop genuine chargers, cables, MagSafe cases and screen protection in Sri Lanka.",
    images: ["/logo.png"],
  },
};

export default function AccessoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
