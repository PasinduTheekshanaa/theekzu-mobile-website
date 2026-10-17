import React from "react";
import { MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a data-ui="whatsapp"
      href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to inquire about a product.")}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        right: "calc(16px + env(safe-area-inset-right, 0px))",
      }}
      className="fixed z-40 floating-whatsapp-btn w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] rounded-full bg-canvas hover:bg-canvas text-ink flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 group"
      title="Chat with Theekzu Mobile"
      aria-label="Chat with Theekzu Mobile on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
      
      {/* Tooltip on hover (desktop only) */}
      <span className="hidden sm:inline-block absolute right-16 px-3 py-1.5 rounded-xl bg-canvas border border-white/10 text-ink text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        Chat with Theekzu Mobile
      </span>
    </a>
  );
};
