import React from "react";
import { HomeExperience } from "@/components/HomeExperience";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { TradeInBanner } from "@/components/TradeInBanner";
import { CustomerReviews } from "@/components/CustomerReviews";
import { FinalCTA } from "@/components/FinalCTA";
import { FAQSection } from "@/components/FAQSection";
import { DeliveryInfo } from "@/components/DeliveryInfo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Theekzu Mobile | iPhone Store Sri Lanka",
  },
  description:
    "Welcome to Theekzu Mobile, your premier iPhone Store Sri Lanka. Buy 100% genuine brand new and certified pre-owned Apple devices and iPhones with official warranty, islandwide delivery, and instant WhatsApp support in Sri Lanka.",
  alternates: {
    canonical: "https://theekzu.vercel.app/",
  },
  openGraph: {
    title: "Theekzu Mobile | iPhone Store Sri Lanka",
    description:
      "Welcome to Theekzu Mobile, your premier iPhone Store Sri Lanka. Buy 100% genuine brand new and certified pre-owned Apple devices and iPhones with official warranty, islandwide delivery, and instant WhatsApp support in Sri Lanka.",
    url: "https://theekzu.vercel.app/",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Theekzu Mobile - iPhone Store Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theekzu Mobile | iPhone Store Sri Lanka",
    description:
      "Welcome to Theekzu Mobile, your premier iPhone Store Sri Lanka. Buy 100% genuine brand new and certified pre-owned Apple devices and iPhones with official warranty in Sri Lanka.",
    images: ["/logo.png"],
    creator: "@theekzumobile",
  },
};

export default function HomePage() {
 return <div className="studio-home">
  <Hero />
  <FeaturedProducts />
  <HomeExperience />
  <div className="studio-trade-section"><TradeInBanner /></div>
  <div className="studio-review-section"><CustomerReviews /></div>
  <div id="faqs" className="studio-faq-section"><FAQSection /></div>
  <div id="delivery" className="studio-delivery-section"><DeliveryInfo /></div>
  <FinalCTA />
 </div>;
}
