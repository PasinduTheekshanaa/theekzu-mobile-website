import { siteUrl } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "iPhone Accessories Sri Lanka | Theekzu Mobile",
  },
  description:
    "Shop iPhone accessories in Sri Lanka at Theekzu Mobile. Browse chargers, cables, cases, screen protectors, earbuds and power banks.",
  keywords: [
    "Apple accessories Sri Lanka",
    "Apple 20W charger Sri Lanka",
    "MagSafe charger Sri Lanka",
    "iPhone cases Sri Lanka",
  ],
  alternates: {
    canonical: siteUrl("/accessories"),
  },
  openGraph: {
    title: "iPhone Accessories Sri Lanka | Theekzu Mobile",
    description:
      "Shop iPhone accessories in Sri Lanka at Theekzu Mobile. Browse chargers, cables, cases, screen protectors, earbuds and power banks.",
    url: siteUrl("/accessories"),
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 1024,
        height: 1024,
        alt: "Original Apple Accessories - Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone Accessories Sri Lanka | Theekzu Mobile",
    description:
      "Browse chargers, cables, cases and screen protection for your iPhone at Theekzu Mobile in Sri Lanka.",
    images: ["/brand-logo.png"],
  },
};

export default function AccessoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
