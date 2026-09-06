import React from "react";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle, Sparkles, ExternalLink } from "lucide-react";
import { storeConfig } from "@/config/store";

export const SocialSection: React.FC = () => {
  const socialCards = [
    {
      name: "Instagram",
      handle: "@theekzu_mobile",
      href: storeConfig.social.instagram,
      icon: Instagram,
      color: "hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500/50",
      iconBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      description: "Daily drops, unboxing stories, and customer delivery reels.",
    },
    {
      name: "Facebook",
      handle: "Theekzu Mobile",
      href: storeConfig.social.facebook,
      icon: Facebook,
      color: "hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description: "Official community announcements, reviews, and price updates.",
    },
    {
      name: "TikTok",
      handle: "@theekzu",
      href: storeConfig.social.tiktok,
      icon: null,
      color: "hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50",
      iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      description: "Device comparisons, camera tests, and tips & tricks.",
    },
    {
      name: "WhatsApp Store",
      handle: "+94 74 024 5749",
      href: storeConfig.social.whatsapp,
      icon: MessageCircle,
      color: "hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description: "Direct instant chat, order support, and priority stock alerts.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase shadow-xs">
            <Sparkles className="w-3 h-3" /> Official Channels
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            Follow Theekzu Mobile
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1">
            Stay connected for new arrivals, unboxings, offers and community drops.
          </p>
        </div>
      </div>

      {/* Social Links Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {socialCards.map((sc) => {
          const Icon = sc.icon;
          return (
            <a
              key={sc.name}
              href={sc.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card p-6 rounded-[2rem] border border-slate-200 dark:border-cyan-500/20 transition-all duration-300 block group hover:-translate-y-1 shadow-sm hover:shadow-xl ${sc.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-all ${sc.iconBg}`}>
                  {Icon ? (
                    <Icon className="w-6 h-6" />
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{sc.name}</h4>
              <p className="text-xs font-semibold text-blue-600 dark:text-cyan-300 mb-2">{sc.handle}</p>
              <p className="text-xs text-slate-600 dark:text-zinc-400">{sc.description}</p>
            </a>
          );
        })}
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl overflow-hidden aspect-square relative group border border-slate-200 dark:border-cyan-500/20 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
            alt="iPhone unboxing customer"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-[11px] font-bold text-white">Genuine Delivery</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden aspect-square relative group border border-slate-200 dark:border-cyan-500/20 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80"
            alt="AirPods Pro genuine"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-[11px] font-bold text-white">AirPods Pro 2</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden aspect-square relative group border border-slate-200 dark:border-cyan-500/20 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
            alt="Apple Watch display"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-[11px] font-bold text-white">Apple Watch Series</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden aspect-square relative group border border-slate-200 dark:border-cyan-500/20 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
            alt="iPhone express delivery"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-[11px] font-bold text-white">Islandwide Courier</span>
          </div>
        </div>
      </div>
    </section>
  );
};
