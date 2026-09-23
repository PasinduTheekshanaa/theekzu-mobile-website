import React from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { ShowroomHero } from "@/components/ShowroomHero";
import { ShowroomIntro } from "@/components/ShowroomIntro";
import { ShowroomGallery } from "@/components/ShowroomGallery";
import { getWhatsAppUrl, storeConfig } from "@/config/store";

export const dynamic = "force-dynamic";

export default function ShowroomPage() {
  const whatsappUrl = getWhatsAppUrl(
    "Hello Theekzu Mobile, I would like to inquire about available iPhones in your showroom or arrange an in-person viewing."
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section with Main Showroom Photo */}
      <ShowroomHero />

      {/* 2. Showroom Experience & Quality Intro */}
      <ShowroomIntro />

      {/* 3. Real Photo Gallery with Lightbox */}
      <ShowroomGallery />

      {/* 4. Bottom Call To Action */}
      <section className="container-custom">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-[#040711] text-white border border-blue-500/30 shadow-2xl relative overflow-hidden text-center sm:text-left">
          {/* Subtle Ambient light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Get Your Next iPhone?</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Discover Available Models in Our Store
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Browse our complete online catalog of brand new sealed and certified pre-owned Apple iPhones with transparent pricing and live stock updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-shrink-0">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse All Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
