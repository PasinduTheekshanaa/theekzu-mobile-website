import { siteUrl } from "@/config/site";
import { HOME_SEO_TITLE, HOME_SEO_DESCRIPTION } from "@/config/seo";
import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoryGrid } from "@/components/CategoryGrid";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { FlagshipShowcase } from "@/components/FlagshipShowcase";

import { SocialSection } from "@/components/SocialSection";

import { FAQSection } from "@/components/FAQSection";

export const revalidate = 30;

export const metadata: Metadata = {
  title: {
    absolute: HOME_SEO_TITLE,
  },
  description:
    HOME_SEO_DESCRIPTION,
  alternates: {
    canonical: siteUrl("/"),
  },
  openGraph: {
    title: HOME_SEO_TITLE,
    description:
      HOME_SEO_DESCRIPTION,
    url: siteUrl("/"),
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 1024,
        height: 1024,
        alt: "Theekzu Mobile - iPhone Store Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO_TITLE,
    description:
      HOME_SEO_DESCRIPTION,
    images: ["/brand-logo.png"],
  },
};

export default function HomePage() {
  return (
    <div className="homepage-sections">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured iPhones Section */}
      <FeaturedProducts />

      {/* 3. Shop by Category */}
      <CategoryGrid />

      {/* 5. Why Choose Theekzu Mobile */}
      <WhyChooseUs />

      {/* Flagship Showcase */}
      <FlagshipShowcase />

      {/* FAQs Section */}
      <div id="faqs">
        <FAQSection />
      </div>

      {/* 9. Social Media Hub */}
      <SocialSection />
    </div>
  );
}
