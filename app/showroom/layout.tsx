import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Our Showroom Experience | Theekzu Mobile Sri Lanka",
  },
  description:
    "Explore the official Theekzu Mobile showroom gallery in Sri Lanka. View authentic Apple iPhones, live display counters, illuminated Apple brand setup, and verified hardware diagnostics.",
  keywords: [
    "Theekzu Mobile Showroom",
    "iPhone Showroom Sri Lanka",
    "Apple Store Sri Lanka",
    "Theekzu Mobile display",
    "Genuine iPhone showroom",
    "iPhone shop Sri Lanka",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/showroom",
  },
  openGraph: {
    title: "Our Showroom Experience | Theekzu Mobile Sri Lanka",
    description:
      "Explore the official Theekzu Mobile showroom gallery in Sri Lanka. View authentic Apple iPhones, live display counters, illuminated Apple brand setup, and verified hardware diagnostics.",
    url: "https://theekzu.vercel.app/showroom",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/showroom/showroom-main-apple-flag.jpg",
        width: 1179,
        height: 1463,
        alt: "Theekzu Mobile Showroom Desk with Apple Logo, Sri Lankan Flag and iPhones",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Showroom Experience | Theekzu Mobile Sri Lanka",
    description:
      "Explore the official Theekzu Mobile showroom gallery in Sri Lanka. Real iPhone displays, authentic collections, and verified diagnostics.",
    images: ["/showroom/showroom-main-apple-flag.jpg"],
  },
};

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
