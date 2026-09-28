import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoryGrid } from "@/components/CategoryGrid";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { TradeInBanner } from "@/components/TradeInBanner";
import { ShowroomPreview } from "@/components/ShowroomPreview";
import { FlagshipShowcase } from "@/components/FlagshipShowcase";
import { CustomerReviews } from "@/components/CustomerReviews";
import { SocialSection } from "@/components/SocialSection";
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
  return (
    <div className="space-y-10 sm:space-y-14 md:space-y-20 lg:space-y-24 pb-12">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured iPhones Section */}
      <FeaturedProducts />

      {/* 3. Shop by Category */}
      <CategoryGrid />

      {/* 5. Why Choose Theekzu Mobile */}
      <WhyChooseUs />

      {/* 6. Trade-In Banner with Interactive Form */}
      <TradeInBanner />

      {/* 7. Showroom Experience Preview */}
      <ShowroomPreview />

      {/* 8. Flagship Showcase (iPhone 16 Pro Max) */}
      <FlagshipShowcase />

      {/* 8. Customer Reviews */}
      <CustomerReviews />

      {/* Delivery Information Section */}
      <div id="delivery">
        <DeliveryInfo />
      </div>

      {/* FAQs Section */}
      <div id="faqs">
        <FAQSection />
      </div>

      {/* 9. Social Media Hub */}
      <SocialSection />

      {/* 10. Final CTA */}
      <FinalCTA />
    </div>
  );
}
