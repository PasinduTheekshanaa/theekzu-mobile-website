import React from "react";
import Image from "next/image";
import { Target, Eye, ShieldCheck, Users, Smartphone, Zap, Truck, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store";

export const metadata = {
  title: "About Us | Theekzu Mobile Sri Lanka",
  description: "Learn more about Theekzu Mobile, our mission, vision, and dedication to authentic Apple products in Sri Lanka.",
};

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "500+", icon: Users, color: "text-blue-600 dark:text-cyan-400" },
    { label: "Devices Sold", value: "700+", icon: Smartphone, color: "text-indigo-600 dark:text-blue-400" },
    { label: "Fast Customer Support", value: "8AM - 8PM", icon: Zap, color: "text-amber-500 dark:text-amber-400" },
    { label: "Islandwide Online Service", value: "25 Districts", icon: Truck, color: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 transition-colors duration-300">
      
      {/* Story Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold text-blue-700 dark:text-cyan-400 tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Our Story & Heritage
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            About <span className="text-gradient-chrome">Theekzu</span> <span className="text-gradient-neon">Mobile</span>
          </h1>
          <p className="text-slate-700 dark:text-zinc-200 text-base leading-relaxed">
            Theekzu Mobile is an online mobile business focused on providing quality smartphones, premium Apple devices, accessories and reliable customer service to customers across Sri Lanka.
          </p>
          <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">
            Founded to establish genuine trust and transparency in Sri Lanka's smartphone market, we eliminate the uncertainty often associated with buying high-end technology. Every brand new device is factory-sealed, and every certified pre-owned phone is rigorously inspected with verified battery health and diagnostic reports.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-cyan-500/20 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Our Mission</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                To make premium mobile technology more accessible by providing quality products, trusted service and a convenient online buying experience.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-indigo-500/20 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Our Vision</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                To become a trusted online destination in Sri Lanka for iPhones and premium mobile products.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Our Commitment</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Quality products, transparent communication and reliable customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Official Brand Logo Presentation */}
        <div className="lg:col-span-5">
          <div className="glass-card-glow p-8 rounded-[3rem] border border-slate-200 dark:border-cyan-500/30 text-center relative overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(0,102,255,0.25)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-64 h-64 mx-auto rounded-3xl p-1 bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 shadow-md dark:shadow-[0_0_35px_rgba(0,210,255,0.5)] mb-6">
              <div className="w-full h-full bg-[#040711] rounded-[22px] p-2 flex items-center justify-center overflow-hidden">
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

            <h3 className="text-xl font-black text-slate-900 dark:text-white">THEEKZU MOBILE</h3>
            <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold tracking-widest uppercase mt-1">
              {storeConfig.tagline}
            </p>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-3 max-w-xs mx-auto">
              Engineered with excellence for Sri Lanka's mobile community.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Counters */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-cyan-500/20 shadow-md dark:shadow-[0_0_30px_rgba(0,102,255,0.15)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.label} className="space-y-2">
                <Icon className={`w-6 h-6 mx-auto ${st.color} mb-2`} />
                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{st.value}</div>
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
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
