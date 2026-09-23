"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Sparkles, MessageCircle, ShieldCheck } from "lucide-react";
import { getWhatsAppUrl } from "@/config/store";
import { ScrollReveal } from "@/components/ScrollReveal";

export const ShowroomPreview: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl(
    "Hello Theekzu Mobile, I saw your showroom photos on the website and would like to inquire about visiting or checking available stock."
  );

  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <div className="container-custom">
        <ScrollReveal>
          <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-cyan-500/25 bg-gradient-to-br from-white/90 via-slate-50/70 to-blue-50/40 dark:from-[#060c1c]/90 dark:via-[#040814]/80 dark:to-[#09152e]/70 shadow-xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Information & CTAs */}
              <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-400 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Theekzu Mobile Experience</span>
                  <span className="w-1 h-1 rounded-full bg-blue-400 dark:bg-cyan-400" />
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Sri Lanka</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Step Inside Our Showroom
                </h2>

                <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm sm:leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Take a look inside our real showroom space in Sri Lanka. From our signature illuminated Apple wall and display counter setups to transparent device health diagnostics, experience the authentic quality behind every iPhone we offer.
                </p>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-700 dark:text-zinc-200 pt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Real Showroom Space</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>100% Genuine Devices</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
                  <Link
                    href="/showroom"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all group"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Explore Our Showroom</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Photo Collage */}
              <div className="lg:col-span-6">
                <Link href="/showroom" className="block group">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Primary Showroom Photo (Main Desk with Apple Logo & Flag) */}
                    <div className="col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-cyan-500/20 bg-slate-900">
                      <Image
                        src="/showroom/showroom-main-apple-flag.jpg"
                        alt="Theekzu Mobile showroom desk featuring illuminated Apple logo, Sri Lankan flag, and iPhone display"
                        fill
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                          Main Showroom Interior
                        </span>
                        <p className="text-xs sm:text-sm font-bold truncate">
                          Illuminated Apple Brand Wall &amp; Retail Desk
                        </p>
                      </div>
                    </div>

                    {/* Secondary Photo 1 (Display Screens) */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-cyan-500/20 bg-slate-900">
                      <Image
                        src="/showroom/showroom-display-screens.jpg"
                        alt="Five iPhones powered on with display screens alongside packaging on showroom counter"
                        fill
                        sizes="(max-width: 1024px) 50vw, 300px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <p className="text-[11px] font-bold truncate">Display Counter</p>
                      </div>
                    </div>

                    {/* Secondary Photo 2 (Device Inspection Diagnostics) */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-cyan-500/20 bg-slate-900">
                      <Image
                        src="/showroom/showroom-device-inspection.jpg"
                        alt="Quality verification showing genuine Apple battery health and hardware diagnostics"
                        fill
                        sizes="(max-width: 1024px) 50vw, 300px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <p className="text-[11px] font-bold truncate">Diagnostics &amp; Testing</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
