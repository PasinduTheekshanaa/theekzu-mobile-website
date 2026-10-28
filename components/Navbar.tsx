"use client";
import { useScrollLock } from "@/hooks/useScrollLock";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { storeConfig } from "@/config/store";

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const { totalCount: cartCount, setIsCartOpen } = useCart();
  const { totalCount: wishlistCount, setIsWishlistOpen } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
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

  // Keep the drawer mounted long enough for its close animation to finish.
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMobileMenuMounted(false), 220);
    return () => window.clearTimeout(timer);
  }, [mobileMenuOpen]);

  useScrollLock(mobileMenuMounted);

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

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

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
        className={`site-navbar sticky top-0 left-0 right-0 z-40 w-full h-[64px] flex items-center px-[14px] sm:px-6 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
          isScrolled
            ? "bg-neutral-200/95 border-neutral-300 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            : "bg-neutral-100/95 border-neutral-200 shadow-[0_3px_16px_rgba(0,0,0,0.08)]"
        }`}
      >
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between gap-2">
          
          {/* LEFT: Theekzu Mobile Official Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0">
            <div className="relative w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-xl sm:rounded-2xl p-[1px] bg-canvas    shadow-[0_0_15px_rgba(91,91,91,0.2)] dark:shadow-[0_0_20px_rgba(147,147,147,0.35)] group-hover:scale-105 transition-all flex-shrink-0">
              <div className="w-full h-full bg-canvas rounded-[11px] sm:rounded-[15px] p-1 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo-small.webp"
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
                <span className="text-[15px] sm:text-base md:text-lg font-black tracking-wider text-ink dark:text-ink">
                  THEEKZU
                </span>
                <span className="max-[419px]:hidden text-[15px] sm:text-base md:text-lg font-black tracking-wider text-brand">
                  MOBILE
                </span>
              </div>
              <span className="hidden min-[420px]:block text-[9px] sm:text-[10px] text-ink dark:text-ink tracking-widest uppercase font-semibold mt-0.5 whitespace-nowrap">
                {storeConfig.tagline}
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links (Visible >= 1280px) */}
          <nav className="hidden xl:flex items-center justify-center gap-3 xl:gap-5 2xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs xl:text-sm font-medium transition-all duration-200 relative py-1.5 whitespace-nowrap flex items-center gap-1.5 group ${
                  isActive(link.href)
                    ? "text-ink dark:text-ink font-bold"
                    : "text-ink hover:text-ink dark:text-ink dark:hover:text-ink"
                }`}
              >
                <span>{link.name}</span>
                {/* Subtle animated underline with glow */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    isActive(link.href)
                      ? "w-full bg-canvas     shadow-[0_0_8px_rgba(91,91,91,0.4)] dark:shadow-[0_0_8px_rgba(169,169,169,0.6)]"
                      : "w-0 bg-canvas dark:bg-canvas group-hover:w-full group-hover:shadow-[0_0_6px_rgba(91,91,91,0.3)]"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* RIGHT: Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Search available on every screen */}
            <button
              onClick={onOpenSearch}
              className="flex w-11 h-11 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-neutral-500/20 dark:hover:border-neutral-400/60 items-center justify-center text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-colors shadow-xs active:scale-95 btn-press group"
              title="Search Products"
              aria-label="Search Products"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Desktop Wishlist Trigger (Visible >= 1024px) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden lg:flex w-11 h-11 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-neutral-500/20 dark:hover:border-neutral-400/60 items-center justify-center text-ink dark:text-ink hover:text-ink transition-colors relative shadow-xs active:scale-95 btn-press group"
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-canvas   text-ink text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger (Always visible on mobile, tablet, desktop) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-11 h-11 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-neutral-500/20 dark:hover:border-neutral-400/60 flex items-center justify-center text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-colors relative shadow-xs active:scale-95 btn-press group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-canvas     text-ink text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Hamburger Button (< 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-11 h-11 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-neutral-500/30 flex items-center justify-center text-ink dark:text-ink shadow-xs active:scale-95 transition-colors btn-press"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-ink dark:text-ink" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Backdrop & Drawer */}
      {mobileMenuMounted && (
        <div className={`fixed inset-0 z-50 xl:hidden flex transition-opacity duration-200 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {/* Dimmed backdrop - click to close */}
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm sm:backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className={`relative ml-auto w-[min(92vw,360px)] h-[100dvh] bg-canvas dark:bg-canvas border-l border-neutral-200 dark:border-neutral-500/20 shadow-2xl flex flex-col z-10 overflow-hidden transform-gpu will-change-transform transition-transform duration-[220ms] ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-canvas dark:bg-canvas">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl p-[1px] bg-canvas   flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wider text-ink dark:text-ink">
                    THEEKZU <span className="text-brand">MOBILE</span>
                  </span>
                  <span className="text-[9px] text-ink dark:text-ink font-semibold uppercase">
                    Navigation Menu
                  </span>
                </div>
              </div>

              <button data-ui="primary"
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 rounded-xl bg-canvas dark:bg-canvas text-ink dark:text-ink hover:text-ink dark:hover:text-ink flex items-center justify-center transition-colors"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Bar inside Mobile Drawer */}
            <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-white/10 bg-canvas dark:bg-canvas space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-white/10 text-xs font-medium text-ink dark:text-ink shadow-xs hover:border-neutral-500/40 dark:hover:border-neutral-400/40 transition-colors text-left"
              >
                <Search className="w-3.5 h-3.5 text-ink dark:text-ink flex-shrink-0" />
                <span className="truncate">Search iPhones, models, SKUs...</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-white/10 text-xs font-bold text-ink dark:text-ink shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 text-ink fill-neutral-500/20" />
                  <span>Wishlist ({wishlistCount})</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-white/10 text-xs font-bold text-ink dark:text-ink shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-ink dark:text-ink" />
                  <span>Cart ({cartCount})</span>
                </button>
              </div>
            </div>

            {/* Nav Links Scroll Area */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink dark:text-ink px-3 py-1 block">
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
                        ? "bg-canvas dark:bg-canvas text-ink dark:text-ink font-bold border border-neutral-200 dark:border-neutral-500/30"
                        : "text-ink hover:bg-canvas dark:text-ink dark:hover:bg-canvas dark:hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <ArrowRight className={`w-3.5 h-3.5 ${active ? "text-ink dark:text-ink" : "text-ink dark:text-ink"}`} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Contact Details */}
            <div className="shrink-0 p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-neutral-200 dark:border-white/10 bg-canvas dark:bg-canvas space-y-3">
              <div className="flex flex-wrap gap-2 items-center justify-between text-[11px] text-ink dark:text-ink px-1 pt-1">
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
