import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Buy Apple iPhones in Sri Lanka | Theekzu Mobile",
  },
  description:
    "Explore the complete Apple iPhone lineup in Sri Lanka. From the flagship iPhone 16 Pro Max to certified pre-owned iPhone 13. Genuine warranty & islandwide delivery.",
  keywords: [
    "iPhone Sri Lanka",
    "Buy iPhone Sri Lanka",
    "iPhone 16 Pro Max price Sri Lanka",
    "Used iPhones Colombo",
    "Apple iPhone warranty Sri Lanka",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/iphones",
  },
  openGraph: {
    title: "Buy Apple iPhones in Sri Lanka | Theekzu Mobile",
    description:
      "Explore the complete Apple iPhone lineup in Sri Lanka. From the flagship iPhone 16 Pro Max to certified pre-owned iPhone 13. Genuine warranty & islandwide delivery.",
    url: "https://theekzu.vercel.app/iphones",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
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
      "Explore the complete Apple iPhone lineup in Sri Lanka. Brand new sealed & certified pre-owned with genuine warranty.",
    images: ["/logo.png"],
  },
};

export default function IPhonesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
