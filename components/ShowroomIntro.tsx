"use client";

import React from "react";
import { MessageCircle, ShieldCheck, Cpu, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";
import { getWhatsAppUrl, storeConfig } from "@/config/store";

export const ShowroomIntro: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl(
    "Hello Theekzu Mobile, I would like to inquire about visiting your showroom or checking available iPhone stock."
  );

  return (
    <section className="py-12 sm:py-16 border-y border-neutral-200/70 dark:border-neutral-500/10 bg-canvas dark:bg-canvas relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-canvas dark:bg-canvas rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        
        {/* Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Theekzu Experience</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink dark:text-ink tracking-tight">
            Where Premium Apple Quality Meets Personalized Service
          </h2>

          <p className="text-ink dark:text-ink text-xs sm:text-sm sm:leading-relaxed">
            At Theekzu Mobile, our showroom is designed to give you complete confidence in your next iPhone purchase. We believe in total transparency: examine authentic Apple packaging, test real device displays, inspect battery health, and verify hardware authenticity in person or via live video before making your choice.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-200 dark:border-neutral-500/20 bg-canvas dark:bg-canvas shadow-xs hover:border-neutral-500/50 dark:hover:border-neutral-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-canvas dark:bg-canvas flex items-center justify-center text-ink dark:text-ink mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink dark:text-ink mb-2">
              Authentic Apple Inventory
            </h3>
            <p className="text-xs text-ink dark:text-ink leading-relaxed">
              Every device in our showroom is 100% genuine Apple hardware. From factory-sealed flagships to carefully certified pre-owned units, each phone comes with verified IMEI authenticity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-200 dark:border-neutral-500/20 bg-canvas dark:bg-canvas shadow-xs hover:border-neutral-500/50 dark:hover:border-neutral-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-canvas flex items-center justify-center text-ink dark:text-ink mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink dark:text-ink mb-2">
              Comprehensive Quality Check
            </h3>
            <p className="text-xs text-ink dark:text-ink leading-relaxed">
              We verify battery health status, display performance, True Tone, Face ID, camera clarity, and speaker systems right in front of you so you take home a device in top-tier condition.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-200 dark:border-neutral-500/20 bg-canvas dark:bg-canvas shadow-xs hover:border-neutral-500/50 dark:hover:border-neutral-400/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-canvas flex items-center justify-center text-ink dark:text-ink mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink dark:text-ink mb-2">
              Dedicated Customer Care
            </h3>
            <p className="text-xs text-ink dark:text-ink leading-relaxed">
              Our knowledgeable team is ready to assist you with model selection, storage advice, color finishes, trade-in valuations, and safe islandwide insured delivery anywhere in Sri Lanka.
            </p>
          </div>
        </div>

        {/* WhatsApp Consultation Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-canvas    text-ink border border-neutral-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-canvas animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                Direct WhatsApp Inquiries
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              Planning to Visit or Check Stock?
            </h3>
            <p className="text-xs sm:text-sm text-ink max-w-xl">
              Connect directly with our showroom team on WhatsApp to confirm live device availability, request detailed photos of any specific model, or coordinate your purchase.
            </p>
          </div>

          <a data-ui="whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-6 py-3.5 rounded-2xl bg-canvas hover:bg-canvas active:scale-95 text-ink font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-neutral-500/25 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-neutral-950" />
            <span>Chat on WhatsApp ({storeConfig.whatsappNumber})</span>
          </a>
        </div>

      </div>
    </section>
  );
};
