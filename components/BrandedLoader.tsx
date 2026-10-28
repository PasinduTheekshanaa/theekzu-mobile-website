"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export const BrandedLoader: React.FC = () => {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show briefly on initial app load for a snappy, premium feel
    const hasLoaded = sessionStorage.getItem("theekzu_intro_shown");
    if (hasLoaded) {
      setShow(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setFading(true);
    }, 600);

    const timer2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("theekzu_intro_shown", "true");
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas text-ink transition-opacity duration-300 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Pulsing Aura */}
        <div className="absolute w-36 h-36 rounded-full bg-canvas blur-2xl animate-ping opacity-60" />
        <div className="absolute w-48 h-48 rounded-full bg-canvas blur-3xl animate-pulse" />

        {/* Brand Logo Container */}
        <div className="relative w-20 h-20 rounded-3xl p-[2px] bg-canvas    shadow-[0_0_40px_rgba(147,147,147,0.6)] animate-in zoom-in-75 duration-300">
          <div className="w-full h-full bg-canvas rounded-[22px] p-2 flex items-center justify-center overflow-hidden">
            <Image
              src="/brand-logo.png"
              alt="Theekzu Mobile"
              width={72}
              height={72}
              className="w-full h-full object-cover rounded-xl"
              priority
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="mt-5 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl font-black tracking-widest text-ink">THEEKZU</span>
            <span className="text-xl font-black tracking-widest text-brand">MOBILE</span>
          </div>
          <p className="text-[10px] text-ink font-semibold tracking-widest uppercase mt-1">
            Premium iPhones • Trusted Service
          </p>
        </div>
      </div>
    </div>
  );
};
