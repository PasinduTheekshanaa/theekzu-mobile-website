import React from "react";
import Image from "next/image";
import { Target, Eye, ShieldCheck, Users, Smartphone, Zap, Truck, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store";
import { AnimatedCounter } from "@/components/AnimatedCounter";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "About Theekzu Mobile | Trusted iPhone Store Sri Lanka",
  },
  description:
    "Learn about Theekzu Mobile, Sri Lanka's premier online destination for genuine Apple iPhones and original accessories. Tested devices, warranty, and customer-first service.",
  keywords: [
    "About Theekzu Mobile",
    "iPhone seller Sri Lanka",
    "Genuine Apple warranty Sri Lanka",
    "Trusted iPhone shop Colombo",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/about",
  },
  openGraph: {
    title: "About Theekzu Mobile | Trusted iPhone Store Sri Lanka",
    description:
      "Learn about Theekzu Mobile, Sri Lanka's premier online destination for genuine Apple iPhones and original accessories. Tested devices, warranty, and customer-first service.",
    url: "https://theekzu.vercel.app/about",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "About Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Theekzu Mobile | Trusted iPhone Store Sri Lanka",
    description:
      "Sri Lanka's trusted online store for genuine Apple iPhones and accessories.",
    images: ["/logo.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://theekzu.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About Us",
      item: "https://theekzu.vercel.app/about",
    },
  ],
};

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "500+", numeric: 500, suffix: "+", icon: Users, color: "text-ink dark:text-ink" },
    { label: "Devices Sold", value: "700+", numeric: 700, suffix: "+", icon: Smartphone, color: "text-ink dark:text-ink" },
    { label: "Fast Customer Support", value: "8AM - 8PM", icon: Zap, color: "text-ink dark:text-ink" },
    { label: "Islandwide Online Service", value: "25 Districts", numeric: 25, suffix: " Districts", icon: Truck, color: "text-ink dark:text-ink" },
  ];

  return (
    <div className="container-custom py-8 sm:py-12 space-y-12 sm:space-y-16 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Story Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold text-ink dark:text-ink tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-ink dark:text-ink" /> Our Story & Heritage
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-ink dark:text-ink leading-tight">
            About <span className="text-brand">Theekzu</span> <span className="text-brand">Mobile</span>
          </h1>
          <p className="text-ink dark:text-ink text-base leading-relaxed">
            Theekzu Mobile is an online mobile business focused on providing quality smartphones, premium Apple devices, accessories and reliable customer service to customers across Sri Lanka.
          </p>
          <p className="text-ink dark:text-ink text-sm leading-relaxed">
            Founded to establish genuine trust and transparency in Sri Lanka's smartphone market, we eliminate the uncertainty often associated with buying high-end technology. Every brand new device is factory-sealed, and every certified pre-owned phone is rigorously inspected with verified battery health and diagnostic reports.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="glass-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-500/20 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink flex items-center justify-center mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink dark:text-ink mb-1">Our Mission</h3>
              <p className="text-xs text-ink dark:text-ink leading-relaxed">
                To make premium mobile technology more accessible by providing quality products, trusted service and a convenient online buying experience.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-500/20 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas text-ink dark:text-ink flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink dark:text-ink mb-1">Our Vision</h3>
              <p className="text-xs text-ink dark:text-ink leading-relaxed">
                To become a trusted online destination in Sri Lanka for iPhones and premium mobile products.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-500/20 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas text-ink dark:text-ink flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink dark:text-ink mb-1">Our Commitment</h3>
              <p className="text-xs text-ink dark:text-ink leading-relaxed">
                Quality products, transparent communication and reliable customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Official Brand Logo Presentation */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-[3rem] border border-neutral-200 dark:border-neutral-500/30 text-center relative overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(91,91,91,0.25)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-canvas dark:bg-canvas rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-44 h-44 sm:w-60 sm:h-60 mx-auto rounded-3xl p-1 bg-canvas    shadow-md dark:shadow-[0_0_35px_rgba(169,169,169,0.5)] mb-6">
              <div className="w-full h-full bg-canvas rounded-[22px] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Theekzu Mobile Official Brand"
                  width={240}
                  height={240}
                  className="w-full h-full object-cover rounded-xl"
                  priority
                />
              </div>
            </div>

            <h3 className="text-xl font-black text-ink dark:text-ink">THEEKZU MOBILE</h3>
            <p className="text-xs text-ink dark:text-ink font-semibold tracking-widest uppercase mt-1">
              {storeConfig.tagline}
            </p>
            <p className="text-xs text-ink dark:text-ink mt-3 max-w-xs mx-auto">
              Engineered with excellence for Sri Lanka's mobile community.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Counters */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-neutral-200 dark:border-neutral-500/20 shadow-md dark:shadow-[0_0_30px_rgba(91,91,91,0.15)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.label} className="space-y-1.5 sm:space-y-2">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${st.color} mb-1.5 sm:mb-2`} />
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink dark:text-ink">
                  {st.numeric ? (
                    <AnimatedCounter target={st.numeric} suffix={st.suffix} />
                  ) : (
                    st.value
                  )}
                </div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-ink dark:text-ink font-bold">
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
