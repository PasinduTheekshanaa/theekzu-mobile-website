import React from "react";
import { Truck, MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

export const DeliveryInfo: React.FC = () => {
  return (
    <section className="container-custom transition-colors duration-300">
      <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-neutral-200 dark:border-neutral-500/20 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 sm:w-7 h-6 sm:h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-ink dark:text-ink text-xs font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-canvas animate-pulse" />
                Fast & Secure
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-ink dark:text-ink">
                Islandwide Delivery Available
              </h3>
              <p className="text-ink dark:text-ink text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Delivery times and charges may vary depending on location. Contact Theekzu Mobile via WhatsApp for exact delivery information.
              </p>
            </div>
          </div>

          <a data-ui="whatsapp"
            href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to check delivery rates and time to my location.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-canvas     text-ink text-xs font-bold transition-all shadow-md shadow-neutral-500/20 dark:shadow-none flex-shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Check Delivery on WhatsApp</span>
          </a>

        </div>
      </div>
    </section>
  );
};
