"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, MessageCircle, Menu, X, Sun, Moon, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { storeConfig } from "@/config/store";

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const { totalCount: cartCount, setIsCartOpen } = useCart();
  const { totalCount: wishlistCount, setIsWishlistOpen } = useWishlist();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Escape key handler to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "iPhones", href: "/iphones" },
    { name: "Showroom", href: "/showroom" },
    { name: "Accessories", href: "/accessories" },
    { name: "Offers", href: "/offers", badge: "HOT" },
    { name: "Trade-In", href: "/trade-in" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 w-full transition-all duration-300 h-[64px] flex items-center px-[14px] sm:px-6 ${
          isScrolled
            ? "glass-nav shadow-md dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            : "bg-white/90 dark:bg-[#040711]/90 backdrop-blur-md border-b border-slate-200/70 dark:border-cyan-500/10"
        }`}
      >
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between gap-2">
          
          {/* LEFT: Theekzu Mobile Official Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0">
            <div className="relative w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(0,102,255,0.2)] dark:shadow-[0_0_20px_rgba(0,180,255,0.35)] group-hover:scale-105 transition-all flex-shrink-0">
              <div className="w-full h-full bg-[#040711] rounded-[11px] sm:rounded-[15px] p-1 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Theekzu Mobile Logo"
                  width={38}
                  height={38}
                  className="w-full h-full object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none whitespace-nowrap">
                <span className="text-[15px] sm:text-base md:text-lg font-black tracking-wider text-slate-900 dark:text-white">
                  THEEKZU
                </span>
                <span className="max-[359px]:hidden text-[15px] sm:text-base md:text-lg font-black tracking-wider text-gradient-neon">
                  MOBILE
                </span>
              </div>
              <span className="hidden min-[420px]:flex text-[9px] sm:text-[10px] text-blue-600 dark:text-cyan-300/80 tracking-widest uppercase font-semibold items-center gap-1 mt-0.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 animate-ping inline-block" />
                {storeConfig.tagline}
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links (Visible >= 1024px) */}
          <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-5 2xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs xl:text-sm font-medium transition-all duration-200 relative py-1.5 whitespace-nowrap flex items-center gap-1.5 group ${
                  isActive(link.href)
                    ? "text-blue-600 dark:text-cyan-400 font-bold drop-shadow-[0_0_12px_rgba(0,102,255,0.2)] dark:drop-shadow-[0_0_12px_rgba(0,210,255,0.5)]"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 text-[8px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-md shadow-xs">
                    {link.badge}
                  </span>
                )}
                {/* Subtle animated underline with glow */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    isActive(link.href)
                      ? "w-full bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-cyan-400 dark:to-blue-600 shadow-[0_0_8px_rgba(0,102,255,0.4)] dark:shadow-[0_0_8px_rgba(0,210,255,0.6)]"
                      : "w-0 bg-blue-500/40 dark:bg-cyan-400/40 group-hover:w-full group-hover:shadow-[0_0_6px_rgba(0,102,255,0.3)]"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* RIGHT: Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Desktop-only Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors shadow-xs active:scale-95 btn-press group"
              title="Search Products"
              aria-label="Search Products"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 flex items-center justify-center text-slate-700 dark:text-cyan-300 transition-all duration-300 relative overflow-hidden group shadow-xs active:scale-95 btn-press"
              title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark and Light Mode"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300 transition-transform group-hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300 transition-transform group-hover:-rotate-12" />
                )
              ) : (
                <span className="w-4 h-4" />
              )}
            </button>

            {/* Desktop Wishlist Trigger (Visible >= 1024px) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden lg:flex w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 items-center justify-center text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors relative shadow-xs active:scale-95 btn-press group"
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger (Always visible on mobile, tablet, desktop) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors relative shadow-xs active:scale-95 btn-press group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-500 dark:to-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop WhatsApp Quick Chat (>= 1024px) */}
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] btn-press group"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Chat</span>
            </a>

            {/* Mobile / Tablet Hamburger Button (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/30 flex items-center justify-center text-slate-800 dark:text-zinc-200 shadow-xs active:scale-95 transition-colors btn-press"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dimmed backdrop - click to close */}
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative ml-auto w-[min(88vw,360px)] h-full bg-white dark:bg-[#070c18] border-l border-slate-200 dark:border-cyan-500/20 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl p-[1px] bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white">
                    THEEKZU <span className="text-gradient-neon">MOBILE</span>
                  </span>
                  <span className="text-[9px] text-blue-600 dark:text-cyan-400 font-semibold uppercase">
                    Navigation Menu
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Bar inside Mobile Drawer */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/40 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-500 dark:text-zinc-400 shadow-xs hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition-colors text-left"
              >
                <Search className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                <span className="truncate">Search iPhones, models, SKUs...</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                  <span>Wishlist ({wishlistCount})</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Cart ({cartCount})</span>
                </button>
              </div>
            </div>

            {/* Nav Links Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-3 py-1 block">
                Explore Store
              </span>
              
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? "bg-blue-50 dark:bg-cyan-500/15 text-blue-700 dark:text-cyan-300 font-bold border border-blue-200 dark:border-cyan-500/30"
                        : "text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-slate-900/60 dark:hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {link.badge && (
                        <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                          {link.badge}
                        </span>
                      )}
                      <ArrowRight className={`w-3.5 h-3.5 ${active ? "text-blue-600 dark:text-cyan-400" : "text-slate-400 dark:text-zinc-600"}`} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 space-y-3">
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to inquire about your available iPhones.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Us on WhatsApp</span>
              </a>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 px-1 pt-1">
                <span>Hotline: {storeConfig.phone}</span>
                <span>Mon - Sun: 9AM - 9PM</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
