import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Theekzu Mobile | Customer Support Sri Lanka",
  },
  description:
    "Contact Theekzu Mobile for iPhone inquiries, orders, trade-in valuations, and islandwide delivery assistance in Sri Lanka. Call or WhatsApp 0740245749.",
  keywords: [
    "Contact Theekzu Mobile",
    "Theekzu Mobile phone number",
    "Theekzu Mobile WhatsApp",
    "iPhone customer service Sri Lanka",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/contact",
  },
  openGraph: {
    title: "Contact Theekzu Mobile | iPhone Store Customer Support Sri Lanka",
    description:
      "Contact Theekzu Mobile for iPhone inquiries, orders, trade-in valuations, and islandwide delivery assistance in Sri Lanka. Call or WhatsApp 0740245749.",
    url: "https://theekzu.vercel.app/contact",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Contact Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Theekzu Mobile | iPhone Store Customer Support Sri Lanka",
    description:
      "Contact Theekzu Mobile for Apple iPhone orders, customer service, and trade-in valuations in Sri Lanka.",
    images: ["/logo.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
