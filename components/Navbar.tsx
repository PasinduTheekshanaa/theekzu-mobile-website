"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, MessageCircle, Menu, X, Sun, Moon } from "lucide-react";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "iPhones", href: "/iphones" },
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
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "glass-nav py-2.5 shadow-md dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          : "bg-white/80 dark:bg-[#040711]/80 backdrop-blur-md py-4 border-b border-slate-200/70 dark:border-cyan-500/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LEFT: Theekzu Mobile Official Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-10 sm:w-11 h-10 sm:h-11 rounded-2xl p-[1px] bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(0,102,255,0.2)] dark:shadow-[0_0_20px_rgba(0,180,255,0.35)] group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#040711] rounded-[15px] p-1 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Theekzu Mobile Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover rounded-lg"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base sm:text-lg font-black tracking-wider text-slate-900 dark:text-white">
                THEEKZU
              </span>
              <span className="text-base sm:text-lg font-black tracking-wider text-gradient-neon">
                MOBILE
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-blue-600 dark:text-cyan-300/80 tracking-widest uppercase font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 animate-ping inline-block" />
              {storeConfig.tagline}
            </span>
          </div>
        </Link>

        {/* CENTER: Desktop Navigation Links (Centered, single-line Trade-In) */}
        <nav className="hidden xl:flex items-center justify-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-all duration-200 relative py-1.5 whitespace-nowrap flex items-center gap-1.5 group ${
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
              {/* Subtle animated underline */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                  isActive(link.href)
                    ? "w-full bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-cyan-400 dark:to-blue-600"
                    : "w-0 bg-blue-500/40 dark:bg-cyan-400/40 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* RIGHT: Action Icons Grouped & WhatsApp Quick Chat */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 flex items-center justify-center text-slate-700 dark:text-cyan-300 transition-all duration-300 relative overflow-hidden group shadow-xs"
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

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors shadow-xs"
            title="Search Products"
            aria-label="Search Products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors relative shadow-xs"
            title="Saved Wishlist"
            aria-label="Saved Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyan-500/20 dark:hover:border-cyan-400/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors relative shadow-xs"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-500 dark:to-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Slim WhatsApp Button */}
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-xs"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-modal border-t border-slate-200 dark:border-cyan-500/20 px-6 py-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            
            {/* Mobile Theme Toggle Banner */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-cyan-500/15">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Theme Appearance
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-cyan-500/30 text-xs font-bold text-slate-800 dark:text-white"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-1.5 flex items-center justify-between transition-colors ${
                  isActive(link.href)
                    ? "text-blue-600 dark:text-cyan-400 font-bold"
                    : "text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-xs bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-cyan-500/15">
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat With Us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
