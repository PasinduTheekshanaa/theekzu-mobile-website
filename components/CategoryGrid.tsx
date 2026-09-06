import React from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, ShieldCheck, Headphones, Watch, Zap, Shield, Sparkles } from "lucide-react";

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      name: "Latest iPhones",
      count: "iPhone 15 & 16 Series",
      href: "/iphones?type=new",
      icon: Smartphone,
      description: "Brand new factory-sealed Apple smartphones with official warranty.",
      glow: "from-blue-600/15 via-cyan-500/10 to-transparent",
      borderColor: "border-slate-200 dark:border-cyan-500/30 hover:border-blue-500 dark:hover:border-cyan-400",
      iconColor: "text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/15 border-blue-500/20 dark:border-cyan-500/30",
      badgeColor: "text-blue-600 dark:text-cyan-300",
    },
    {
      name: "Used iPhones",
      count: "Certified Pre-Owned",
      href: "/iphones?type=used",
      icon: ShieldCheck,
      description: "32-point hardware tested, Grade A+ condition with verified battery health 90%+.",
      glow: "from-purple-600/15 via-indigo-500/10 to-transparent",
      borderColor: "border-slate-200 dark:border-purple-500/30 hover:border-purple-500 dark:hover:border-purple-400",
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/20 dark:border-purple-500/30",
      badgeColor: "text-purple-600 dark:text-purple-300",
    },
    {
      name: "AirPods",
      count: "Pro & Gen 3 / 4",
      href: "/accessories?sub=airpods",
      icon: Headphones,
      description: "Active Noise Cancellation, Transparency mode and crystal clear Spatial Audio.",
      glow: "from-sky-500/15 via-teal-500/10 to-transparent",
      borderColor: "border-slate-200 dark:border-sky-500/30 hover:border-sky-500 dark:hover:border-sky-400",
      iconColor: "text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/20 dark:border-sky-500/30",
      badgeColor: "text-sky-600 dark:text-sky-300",
    },
    {
      name: "Apple Watch",
      count: "Ultra 2 & Series 9/10",
      href: "/accessories?sub=apple-watch",
      icon: Watch,
      description: "Precision health sensors, fitness telemetry, ECG, and all-day sapphire display.",
      glow: "from-emerald-500/15 via-teal-500/10 to-transparent",
      borderColor: "border-slate-200 dark:border-emerald-500/30 hover:border-emerald-500 dark:hover:border-emerald-400",
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 dark:border-emerald-500/30",
      badgeColor: "text-emerald-600 dark:text-emerald-300",
    },
    {
      name: "Chargers & Cables",
      count: "Fast 20W & MagSafe",
      href: "/accessories?sub=chargers-cables",
      icon: Zap,
      description: "Original Apple 20W USB-C adapters, braided cables, and magnetic puck chargers.",
      glow: "from-amber-500/15 via-yellow-500/10 to-transparent",
      borderColor: "border-slate-200 dark:border-amber-500/30 hover:border-amber-500 dark:hover:border-amber-400",
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20 dark:border-amber-500/30",
      badgeColor: "text-amber-600 dark:text-amber-300",
    },
    {
      name: "Cases & Accessories",
      count: "MagSafe & 9H Glass",
      href: "/accessories?sub=cases-accessories",
      icon: Shield,
      description: "Shockproof MagSafe silicone/clear cases and 28° privacy tempered glass protectors.",
      glow: "from-rose-500/15 via-pink-500/10 to-transparent",
      borderColor: "border-slate-200 dark:border-rose-500/30 hover:border-rose-500 dark:hover:border-rose-400",
      iconColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20 dark:border-rose-500/30",
      badgeColor: "text-rose-600 dark:text-rose-300",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase shadow-xs">
          <Sparkles className="w-3 h-3" /> Explore Ecosystem
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
          Shop By Category
        </h2>
        <p className="text-slate-600 dark:text-zinc-400 text-sm mt-2">
          Find your ideal iPhone or original Apple accessory with guaranteed authenticity and Sri Lanka warranty.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className={`glass-card group p-7 rounded-[2rem] transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${cat.borderColor} shadow-sm hover:shadow-xl`}
            >
              {/* Background ambient lighting */}
              <div className={`absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-gradient-to-br ${cat.glow} blur-2xl group-hover:scale-150 transition-transform duration-500`} />

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${cat.iconColor}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <p className={`text-xs font-bold mb-3 uppercase tracking-wider ${cat.badgeColor}`}>
                  {cat.count}
                </p>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors relative z-10">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform text-blue-600 dark:text-cyan-400" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
