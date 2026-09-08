import React from "react";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SpecialOffers } from "@/components/SpecialOffers";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { TradeInBanner } from "@/components/TradeInBanner";
import { FlagshipShowcase } from "@/components/FlagshipShowcase";
import { CustomerReviews } from "@/components/CustomerReviews";
import { SocialSection } from "@/components/SocialSection";
import { FinalCTA } from "@/components/FinalCTA";
import { FAQSection } from "@/components/FAQSection";
import { DeliveryInfo } from "@/components/DeliveryInfo";

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-14 md:space-y-20 lg:space-y-24 pb-12">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured iPhones Section */}
      <FeaturedProducts />

      {/* 3. Shop by Category */}
      <CategoryGrid />

      {/* 4. Special Offers with Countdown */}
      <SpecialOffers />

      {/* 5. Why Choose Theekzu Mobile */}
      <WhyChooseUs />

      {/* 6. Trade-In Banner with Interactive Form */}
      <TradeInBanner />

      {/* 7. Flagship Showcase (iPhone 16 Pro Max) */}
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
