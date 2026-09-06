import React from "react";
import { Truck, MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

export const DeliveryInfo: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="glass-card rounded-[2.5rem] p-8 border border-slate-200 dark:border-cyan-500/20 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Fast & Secure
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Islandwide Delivery Available
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1 max-w-xl">
                Delivery times and charges may vary depending on location. Contact Theekzu Mobile via WhatsApp for exact delivery information.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to check delivery rates and time to my location.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 dark:shadow-none flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Check Delivery on WhatsApp</span>
          </a>

        </div>
      </div>
    </section>
  );
};
