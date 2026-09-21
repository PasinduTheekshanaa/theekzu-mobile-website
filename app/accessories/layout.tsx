import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Original Apple Accessories Sri Lanka | Theekzu Mobile",
  },
  description:
    "Shop 100% genuine Apple accessories in Sri Lanka. AirPods Pro 2, Apple Watch Ultra, official 20W USB-C fast chargers, MagSafe cases and cables.",
  keywords: [
    "Apple accessories Sri Lanka",
    "AirPods Pro Sri Lanka",
    "Apple 20W charger Sri Lanka",
    "Apple Watch Ultra Colombo",
    "MagSafe charger Sri Lanka",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/accessories",
  },
  openGraph: {
    title: "Original Apple Accessories Sri Lanka | Theekzu Mobile",
    description:
      "Shop 100% genuine Apple accessories in Sri Lanka. AirPods Pro 2, Apple Watch Ultra, official 20W fast chargers, MagSafe cases and cables.",
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
      "Shop 100% genuine Apple accessories in Sri Lanka. AirPods Pro 2, Apple Watch Ultra, official 20W chargers and MagSafe accessories.",
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
