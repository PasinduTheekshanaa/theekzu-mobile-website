import React from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, ShieldCheck, Zap, Shield } from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      name: "Latest iPhones",
      count: "iPhone 15 & 16 Series",
      href: "/iphones?type=new",
      icon: Smartphone,
      description: "Brand new factory-sealed Apple smartphones with a 6-month warranty from Theekzu Mobile.",
      glow: "from-neutral-600/15 via-neutral-500/10 to-transparent",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500 dark:hover:border-neutral-400",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
      badgeColor: "text-ink dark:text-ink",
    },
    {
      name: "Used iPhones",
      count: "Certified Pre-Owned",
      href: "/iphones?type=used",
      icon: ShieldCheck,
      description: "32-point hardware tested, Grade A+ condition with verified battery health 90%+.",
      glow: "from-neutral-600/15 via-neutral-500/10 to-transparent",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500 dark:hover:border-neutral-400",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
      badgeColor: "text-ink dark:text-ink",
    },
    {
      name: "Chargers & Cables",
      count: "Fast 20W & MagSafe",
      href: "/accessories?sub=chargers-cables",
      icon: Zap,
      description: "Original Apple 20W USB-C adapters, braided cables, and magnetic puck chargers.",
      glow: "from-neutral-500/15 via-neutral-500/10 to-transparent",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500 dark:hover:border-neutral-400",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
      badgeColor: "text-ink dark:text-ink",
    },
    {
      name: "Cases & Protection",
      count: "MagSafe & 9H Glass",
      href: "/accessories?sub=cases-accessories",
      icon: Shield,
      description: "Shockproof MagSafe silicone/clear cases and 28° privacy tempered glass protectors.",
      glow: "from-neutral-500/15 via-neutral-500/10 to-transparent",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500 dark:hover:border-neutral-400",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
      badgeColor: "text-ink dark:text-ink",
    },
  ];

  return (
    <section className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold tracking-widest text-ink dark:text-ink uppercase shadow-xs">
            Explore The Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink dark:text-ink mt-3">
            Shop By Category
          </h2>
          <p className="text-ink dark:text-ink text-xs sm:text-sm mt-2">
            Find your ideal iPhone or original Apple accessory with guaranteed authenticity and Sri Lanka warranty.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <ScrollReveal key={cat.name} direction="up" delay={idx * 50}>
              <Link
                href={cat.href}
                className={`glass-card group p-5 sm:p-7 rounded-2xl sm:rounded-[2rem] transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${cat.borderColor} shadow-sm hover:shadow-xl w-full hover:-translate-y-1.5`}
              >
                {/* Background ambient lighting */}
                <div className={`absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-canvas ${cat.glow} blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${cat.iconColor}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-ink dark:text-ink mb-1 group-hover:text-ink dark:group-hover:text-ink transition-colors">
                    {cat.name}
                  </h3>
                  <p className={`text-xs font-bold mb-3 uppercase tracking-wider ${cat.badgeColor}`}>
                    {cat.count}
                  </p>
                  <p className="text-sm text-ink dark:text-ink leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-sm font-bold text-ink dark:text-ink group-hover:text-ink dark:group-hover:text-ink transition-colors relative z-10">
                  <span>View Products</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform text-ink dark:text-ink" />
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
