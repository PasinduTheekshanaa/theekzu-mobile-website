import React from "react";
import { MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to inquire about a product.")}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        right: "max(16px, env(safe-area-inset-right, 16px))",
      }}
      className="fixed z-40 floating-whatsapp-btn w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 group active:scale-95"
      title="Chat with Theekzu Mobile"
      aria-label="Chat with Theekzu Mobile on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
      
      {/* Tooltip on hover (desktop only) */}
      <span className="hidden sm:inline-block absolute right-16 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        Chat with Theekzu Mobile
      </span>
    </a>
  );
};
