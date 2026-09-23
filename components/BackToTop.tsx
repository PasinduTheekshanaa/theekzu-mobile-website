"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-[calc(90px+env(safe-area-inset-bottom,0px))] right-[calc(16px+env(safe-area-inset-right,0px))] z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-300 shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] active:scale-95 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
