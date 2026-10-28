"use client";

import React, { useState } from "react";
import { ArrowRight, Calculator, Check, MessageCircle, RefreshCw } from "lucide-react";
import { storeConfig, getWhatsAppUrl } from "@/config/store";
import { ScrollReveal } from "@/components/ScrollReveal";

export const TradeInBanner: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    model: "",
    storage: "",
    condition: "",
    batteryHealth: "",
    notes: "",
    wantedModel: "",
    wantedStorage: "",
    wantedCondition: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      "Hello Theekzu Mobile,",
      "I would like to get a trade-in estimate for my iPhone.",
      `Name: ${formData.name || "Customer"}`,
      `Phone: ${formData.phone || "Not provided"}`,
      `Current Model: ${formData.model || "Not specified"}`,
      `Storage: ${formData.storage || "Not specified"}`,
      `Condition: ${formData.condition || "Not specified"}`,
      `Battery Health: ${formData.batteryHealth || "Not specified"}`,
      `Notes: ${formData.notes || "None"}`,
      "",
      "Preferred Upgrade:",
      `Model: ${formData.wantedModel || "Not decided yet"}`,
      `Storage: ${formData.wantedStorage || "Any storage"}`,
      `Condition: ${formData.wantedCondition || "Any condition"}`,
      "",
      "Please let me know the estimated trade-in value.",
    ];

    const waUrl = getWhatsAppUrl(lines.join("\n"));
    window.open(waUrl, "_blank");
  };

  return (
    <section className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="glass-card rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 border border-neutral-200 dark:border-neutral-500/30 relative overflow-hidden shadow-lg dark:shadow-[0_0_50px_rgba(91,91,91,0.2)]">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-canvas dark:bg-canvas rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink text-xs font-bold shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 text-ink dark:text-ink" />
              <span>Smart Mobile Upgrades</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink dark:text-ink">
              Trade Your Old iPhone. <br />
              <span className="text-brand">Upgrade Smarter.</span>
            </h2>
            <p className="text-ink dark:text-ink text-xs sm:text-sm leading-relaxed">
              Tell us about your current device and get an instant, fair market valuation toward your brand new or certified pre-owned iPhone.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 space-y-2.5 sm:space-y-3 text-xs text-ink dark:text-ink shadow-sm">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <span>Fair market valuation based on current Sri Lankan exchange rates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <span>Direct price deduction towards any iPhone 15 or 16 model</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <span>Zero hassle with private listings or untrusted third parties</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/30 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-md dark:shadow-[0_0_30px_rgba(91,91,91,0.15)]">
            <h3 className="text-base sm:text-lg font-bold text-ink dark:text-ink mb-5 sm:mb-6 flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-ink dark:text-ink shrink-0" />
              <span>Get Your Instant Trade-In Estimate</span>
            </h3>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <div className="pt-1 border-t border-neutral-200 dark:border-white/10">
                <div className="flex items-center justify-between gap-3 pt-4 mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink">
                    Your Next iPhone
                  </label>
                  <span className="text-[11px] text-ink dark:text-ink">Optional</span>
                </div>
                <p className="text-xs text-ink dark:text-ink mb-3">Tell us what you would like to upgrade to, so we can quote the exact price difference.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-ink mb-1.5">Preferred Model</label>
                    <select
                      value={formData.wantedModel}
                      onChange={(e) => setFormData({ ...formData, wantedModel: e.target.value })}
                      className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-3 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                    >
                      <option value="">Choose a model</option>
                      <option value="iPhone 17 Pro Max">iPhone 17 Pro Max</option>
                      <option value="iPhone 17 Pro">iPhone 17 Pro</option>
                      <option value="iPhone 17">iPhone 17</option>
                      <option value="iPhone 16 Pro Max">iPhone 16 Pro Max</option>
                      <option value="iPhone 16 Pro">iPhone 16 Pro</option>
                      <option value="iPhone 16">iPhone 16</option>
                      <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                      <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                      <option value="iPhone 15">iPhone 15</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-ink mb-1.5">Preferred Storage</label>
                    <select
                      value={formData.wantedStorage}
                      onChange={(e) => setFormData({ ...formData, wantedStorage: e.target.value })}
                      className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-3 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                    >
                      <option value="">Any storage</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                      <option value="2TB">2TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-ink mb-1.5">Preferred Condition</label>
                    <select
                      value={formData.wantedCondition}
                      onChange={(e) => setFormData({ ...formData, wantedCondition: e.target.value })}
                      className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-3 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                    >
                      <option value="">Any condition</option>
                      <option value="Brand New Sealed">Brand New Sealed</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-4 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-4 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Current Model
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-3 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  >
                    <option value=""></option>
                    <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
                    <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone 13 Pro Max">iPhone 13 Pro Max</option>
                    <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="iPhone 12 Pro Max">iPhone 12 Pro Max</option>
                    <option value="iPhone 12">iPhone 12</option>
                    <option value="iPhone 11">iPhone 11</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Storage
                  </label>
                  <select
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-3 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  >
                    <option value=""></option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-3 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  >
                    <option value=""></option>
                    <option value="Excellent">Excellent (No scratches)</option>
                    <option value="Good">Good (Minor micro-scratches)</option>
                    <option value="Fair">Fair (Noticeable marks)</option>
                    <option value="Damaged">Damaged / Cracked Glass</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Battery Health
                  </label>
                  <input
                    type="text"
                    value={formData.batteryHealth}
                    onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-4 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Additional Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-4 py-2.5 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <button data-ui="whatsapp"
                type="submit"
                className="w-full mt-2 min-h-[44px] inline-flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-full bg-canvas     text-ink text-xs sm:text-sm font-bold shadow-md shadow-neutral-500/25 dark:shadow-[0_0_20px_rgba(145,145,145,0.35)] transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Get Trade-In Value on WhatsApp</span>
              </button>
            </form>
          </div>

        </div>
      </div>
      </ScrollReveal>
    </section>
  );
};
