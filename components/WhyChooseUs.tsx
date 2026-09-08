import React from "react";
import { CheckCircle2, BadgeDollarSign, HeartHandshake, ShieldAlert, Truck, MessageCircle, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: "Quality Checked Devices",
      description: "Every device undergoes strict 32-point hardware, display, and battery testing with transparent health reports before sale.",
      icon: CheckCircle2,
      color: "text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/15 border-blue-500/20 dark:border-cyan-500/30",
      glowBorder: "hover:border-blue-500 dark:hover:border-cyan-400/60",
    },
    {
      title: "Competitive Prices",
      description: "Transparent Sri Lankan Rupee pricing without hidden charges, surprise fees, or middleman markups.",
      icon: BadgeDollarSign,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 dark:border-emerald-500/30",
      glowBorder: "hover:border-emerald-500 dark:hover:border-emerald-400/60",
    },
    {
      title: "Trusted Customer Service",
      description: "Dedicated advice from Apple specialists who value long-term trust, honest guidance, and customer satisfaction.",
      icon: HeartHandshake,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/20 dark:border-purple-500/30",
      glowBorder: "hover:border-purple-500 dark:hover:border-purple-400/60",
    },
    {
      title: "Reliable After-Sales Support",
      description: "Enjoy official Apple warranty and Theekzu Mobile's comprehensive store replacement warranty support.",
      icon: ShieldAlert,
      color: "text-indigo-600 dark:text-blue-400 bg-indigo-500/10 dark:bg-blue-500/15 border-indigo-500/20 dark:border-blue-500/30",
      glowBorder: "hover:border-indigo-500 dark:hover:border-blue-400/60",
    },
    {
      title: "Islandwide Online Service",
      description: "Fast, insured delivery to all 25 districts in Sri Lanka with express dispatch and real-time tracking.",
      icon: Truck,
      color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/20 dark:border-sky-500/30",
      glowBorder: "hover:border-sky-500 dark:hover:border-sky-400/60",
    },
    {
      title: "Fast WhatsApp Support",
      description: "Instant WhatsApp messaging at 0740245749 for product photos, live availability, and order status from 8 AM to 8 PM.",
      icon: MessageCircle,
      color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-500/15 border-teal-500/20 dark:border-teal-500/30",
      glowBorder: "hover:border-teal-500 dark:hover:border-teal-400/60",
    },
  ];

  return (
    <section className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> The Theekzu Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3">
            Why Choose Theekzu Mobile?
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2">
            We combine authentic Apple products with dependable, friendly customer service and transparent pricing across Sri Lanka.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <ScrollReveal key={pt.title} direction="up" delay={idx * 40}>
              <div
                className={`glass-card p-5 sm:p-7 rounded-2xl sm:rounded-[2rem] transition-all duration-300 border border-slate-200 dark:border-cyan-500/20 ${pt.glowBorder} shadow-xs hover:shadow-xl group w-full`}
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${pt.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
