import React from "react";
import type { Metadata } from "next";
import { TradeInBanner } from "@/components/TradeInBanner";
import { ShieldCheck, ArrowRight, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "iPhone Trade-In Sri Lanka | Theekzu Mobile",
  },
  description:
    "Upgrade your old smartphone to a newer Apple iPhone in Sri Lanka. Get an instant, high-value trade-in estimate on WhatsApp and pay only the difference with Theekzu Mobile.",
  keywords: [
    "iPhone trade in Sri Lanka",
    "Exchange iPhone Colombo",
    "Used phone trade in Sri Lanka",
    "Upgrade to iPhone 16 Sri Lanka",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/trade-in",
  },
  openGraph: {
    title: "iPhone Trade-In Sri Lanka | Exchange & Upgrade | Theekzu Mobile",
    description:
      "Upgrade your old smartphone to a newer Apple iPhone in Sri Lanka. Get an instant, high-value trade-in estimate on WhatsApp and pay only the difference with Theekzu Mobile.",
    url: "https://theekzu.vercel.app/trade-in",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 800,
        height: 800,
        alt: "iPhone Trade-In Sri Lanka - Theekzu Mobile",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone Trade-In Sri Lanka | Exchange & Upgrade | Theekzu Mobile",
    description:
      "Trade in your phone and upgrade to a brand new or certified pre-owned Apple iPhone in Sri Lanka.",
    images: ["/brand-logo.png"],
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
      name: "Trade-In",
      item: "https://theekzu.vercel.app/trade-in",
    },
  ],
};

export default function TradeInPage() {
  const steps = [
    {
      step: "01",
      title: "Tell Us About Your Phone",
      desc: "Fill in your model, storage capacity, physical condition, and battery health in the calculator below.",
      icon: Smartphone,
    },
    {
      step: "02",
      title: "Get Valuation on WhatsApp",
      desc: "Our team will review your specs and send you an honest, high-value trade-in estimate in minutes.",
      icon: RefreshCw,
    },
    {
      step: "03",
      title: "Upgrade & Save Instantly",
      desc: "Hand over your old device and pay only the difference towards your next brand new or used iPhone.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="container-custom py-8 sm:py-12 space-y-12 sm:space-y-16 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Page Header */}
      <div className="rounded-2xl sm:rounded-[2.5rem] bg-canvas      p-5 sm:p-8 md:p-12 border border-neutral-200 dark:border-neutral-500/20 relative overflow-hidden shadow-sm dark:shadow-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold text-ink dark:text-ink tracking-widest uppercase mb-2">
          Official Trade-In Program
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-ink dark:text-ink mt-1">
          Trade In Your iPhone in Sri Lanka
        </h1>
        <p className="text-ink dark:text-ink text-sm mt-2 max-w-2xl">
          Upgrade your old phone to a newer iPhone 15 or 16 series smoothly without the hassle of private online listings. Guaranteed best market trade-in values.
        </p>
      </div>

      {/* 3 Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.step} className="glass-card p-6 rounded-3xl relative overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm">
              <span className="text-4xl font-black text-ink dark:text-ink absolute top-4 right-4">
                {st.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/20 text-ink dark:text-ink flex items-center justify-center mb-5">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink dark:text-ink mb-2">{st.title}</h3>
              <p className="text-xs text-ink dark:text-ink leading-relaxed">{st.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Trade In Calculator Form */}
      <TradeInBanner />

    </div>
  );
}
