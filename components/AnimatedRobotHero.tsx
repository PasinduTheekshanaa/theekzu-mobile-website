"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Check, 
  MessageCircle,
  Cpu,
  Radio,
  Eye
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";
import { useProducts } from "@/context/ProductContext";

interface AnimatedRobotHeroProps {
  className?: string;
}

export const AnimatedRobotHero: React.FC<AnimatedRobotHeroProps> = ({ className = "" }) => {
  const { products } = useProducts();
  const flagship = products.find((p) => p.slug === "iphone-16-pro-max") || products[0];

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth normalized cursor coordinates: range from -1 to 1
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Subtle blinking simulation state
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Periodic subtle robotic eye blink
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 4200);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Track cursor movement on window / container for realistic responsive tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    
    // Only apply head turning on desktop (screens >= 1024px)
    if (window.innerWidth < 1024) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalizing from -1 to +1 relative to robot center
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.75)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.75)));

    setCursor({ x: normX, y: normY });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Gracefully settle back to center
    setCursor({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Subtle transforms: Head rotates smoothly max +/- 12deg horizontally, +/- 8deg vertically
  const headRotateY = reducedMotion ? 0 : cursor.x * 12;
  const headRotateX = reducedMotion ? 0 : -cursor.y * 8;
  const headTranslateX = reducedMotion ? 0 : cursor.x * 6;
  const headTranslateY = reducedMotion ? 0 : cursor.y * 5;

  // Eye visor pupil shift inside helmet
  const eyeShiftX = reducedMotion ? 0 : cursor.x * 8;
  const eyeShiftY = reducedMotion ? 0 : cursor.y * 5;

  // Whole robot body 3D gentle tilt
  const bodyTiltY = reducedMotion ? 0 : cursor.x * 4;
  const bodyTiltX = reducedMotion ? 0 : -cursor.y * 3;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center select-none w-full max-w-lg mx-auto ${className}`}
    >
      {/* 1. Futuristic Holographic Multi-Layer Rings in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        {/* Deep ambient pulsing neon aura */}
        <div className="absolute w-80 sm:w-[28rem] h-80 sm:h-[28rem] rounded-full bg-gradient-to-tr from-cyan-500/25 via-blue-600/20 to-purple-600/25 blur-3xl animate-pulse-glow" />
        
        {/* Outer Tech Orbit Ring */}
        <div 
          className="absolute w-[22rem] sm:w-[27rem] h-[22rem] sm:h-[27rem] rounded-full border border-cyan-500/20 dark:border-cyan-400/25 border-dashed animate-spin"
          style={{ animationDuration: "35s" }}
        />
        
        {/* Secondary Inner Cyan Ring */}
        <div 
          className="absolute w-[17rem] sm:w-[21rem] h-[17rem] sm:h-[21rem] rounded-full border border-blue-500/20 dark:border-blue-400/30 animate-spin"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        />

        {/* Diagonal Tech Scan Line */}
        <div className="absolute w-72 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 dark:via-cyan-300/70 to-transparent rotate-45 animate-pulse" />
      </div>

      {/* 2. Floating Futuristic HUD Cards & Floating Pills */}
      {/* Top Left: AI Mascot Status */}
      <div 
        className="absolute top-1 left-1 sm:-top-3 sm:-left-4 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-cyan-500/30 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-cyan-300 shadow-lg shadow-cyan-500/10 animate-float max-w-[55%]"
        style={{ animationDuration: "5s" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <Cpu className="w-3.5 h-3.5 text-cyan-500" />
        <span>Theekzu AI Concierge</span>
      </div>

      {/* Top Right: Live Showroom Stock */}
      <div 
        className="absolute top-1 right-1 sm:top-8 sm:-right-4 z-20 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-slate-800 dark:text-emerald-400 shadow-md animate-float"
        style={{ animationDuration: "6s", animationDelay: "1.5s" }}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Flagship In Stock</span>
      </div>

      {/* Middle Right: Spec Floating Badge */}
      <div 
        className="absolute bottom-28 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-blue-500/30 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xl animate-float"
        style={{ animationDuration: "5.5s", animationDelay: "0.8s" }}
      >
        <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400">
          <Zap className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Apple Chip</p>
          <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">A18 Pro Max</p>
        </div>
      </div>

      {/* 3. Central Robot Stage */}
      <div 
        className="relative w-full aspect-[3/4] max-w-[320px] sm:max-w-[380px] lg:max-w-[400px] flex items-center justify-center mx-auto"
        style={{
          transform: `perspective(1000px) rotateY(${bodyTiltY}deg) rotateX(${bodyTiltX}deg)`,
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Robot Main Container with Ambient Float Motion */}
        <div className="relative w-full h-full animate-float flex items-center justify-center">
          
          {/* Main Robot Body Asset with glowing cyber lighting & Phone presented */}
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-slate-200/80 dark:border-cyan-500/30 shadow-2xl dark:shadow-[0_0_50px_rgba(0,102,255,0.35)] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black">
            
            {/* Top Cyan Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20" />
            
            {/* Base Robot Full Body & Hand Image */}
            <Image
              src="/theekzu-robot.jpg"
              alt="Theekzu Mobile Futuristic AI Robot Assistant holding iPhone"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover object-center transform transition-transform duration-700 hover:scale-[1.02]"
            />

            {/* Dynamic Interactive Head & Visor Overlay (Turns with Cursor on Desktop) */}
            {isMounted && (
              <div
                className="absolute top-[3%] left-[34%] w-[33%] h-[30%] pointer-events-none transition-transform ease-out z-10 hidden sm:block"
                style={{
                  transform: `translate3d(${headTranslateX}px, ${headTranslateY}px, 0px) rotateY(${headRotateY}deg) rotateX(${headRotateX}deg)`,
                  transitionDuration: "0.15s",
                }}
              >
                {/* Robot Helmet Digital Visor & Pupil Follower */}
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Visor Cyan Digital HUD Scanning Reticle */}
                  <div 
                    className="absolute top-[33%] w-[68%] h-[24%] rounded-full overflow-hidden flex items-center justify-center transition-all duration-100"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(0,210,255,0.3) 0%, rgba(0,102,255,0.1) 70%, transparent 100%)",
                      boxShadow: "0 0 15px rgba(0,210,255,0.6)",
                    }}
                  >
                    {/* Glowing Cyan Digital Eyes that track the cursor */}
                    <div 
                      className={`flex items-center justify-between w-full px-2 transition-transform duration-75 ${isBlinking ? "scale-y-0 opacity-20" : "scale-y-100 opacity-100"}`}
                      style={{
                        transform: `translate3d(${eyeShiftX}px, ${eyeShiftY}px, 0px)`,
                      }}
                    >
                      {/* Left Eye */}
                      <span className="w-3 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f0ff] animate-pulse" />
                      {/* Center Scanner Beam */}
                      <span className="w-1.5 h-1 rounded-full bg-blue-400/80 shadow-[0_0_6px_#0066ff]" />
                      {/* Right Eye */}
                      <span className="w-3 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f0ff] animate-pulse" />
                    </div>
                  </div>

                  {/* Subtle Visor Glass Reflection */}
                  <div className="absolute top-[28%] left-[18%] w-[35%] h-[12%] bg-white/20 rounded-full blur-[1px] rotate-[-15deg] pointer-events-none" />
                </div>
              </div>
            )}

            {/* Glowing Chest Core Pulse Highlight Overlay */}
            <div className="absolute top-[43%] left-[43%] w-14 h-14 rounded-full bg-cyan-400/20 blur-md pointer-events-none animate-pulse-glow" />

            {/* Phone Screen Glow Shimmer on the iPhone held in hand */}
            <div className="absolute top-[40%] right-[22%] w-24 h-40 rounded-2xl bg-cyan-400/10 blur-xl pointer-events-none animate-pulse" />

            {/* Futuristic Tech Corner Accents */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-cyan-500/20 text-[10px] text-cyan-300 font-mono">
              <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
              <span>THEEKZU-BOT // READY</span>
            </div>
            
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-black/60 px-2 py-0.5 rounded-lg border border-slate-800">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>EYE-TRACK ON</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Showcase Card: Instant WhatsApp & Details Bar */}
      <div className="absolute -bottom-6 sm:-bottom-8 left-2 right-2 sm:left-4 sm:right-4 z-20">
        <div className="glass-card-glow p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-cyan-500/30 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/30 shrink-0">
                <span className="text-xs">16</span>
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {flagship.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400">
                  {flagship.storage} • {flagship.condition}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-cyan-300 dark:to-blue-400 font-mono">
                {formatCurrency(flagship.price)}
              </div>
              <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                Islandwide Stock
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-slate-200 dark:border-cyan-500/20">
            <Link
              href={`/product/${flagship.slug}`}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white text-center transition flex items-center justify-center gap-1"
            >
              <span>View Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(
                `Hello Theekzu Mobile,

I saw your AI showroom assistant presenting the ${flagship.name} (${formatCurrency(flagship.price)}).

Can you please confirm current stock and delivery details?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs font-bold text-white text-center transition flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnimatedRobotHero;
