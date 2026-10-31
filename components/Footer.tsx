import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Mail, MapPin, Clock, Instagram, Facebook, ShieldCheck } from "lucide-react";
import { storeConfig } from "@/config/store";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-canvas dark:bg-canvas border-t border-neutral-200 dark:border-neutral-500/20 pt-16 pb-12 mt-24 overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-canvas dark:bg-canvas rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-canvas dark:bg-canvas rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <section id="whatsapp-community" aria-label="WhatsApp community" className="mb-10 rounded-3xl border border-neutral-200 p-5 sm:p-7">
          <h2 className="text-xl font-bold">Stay connected with Theekzu</h2>
          <p className="mt-2 text-sm text-neutral-600">Join our WhatsApp group and follow our channel for the latest updates.</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <a href={storeConfig.social.whatsappGroup} target="_blank" rel="noopener noreferrer" data-ui="whatsapp" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"><MessageCircle className="h-5 w-5" aria-hidden="true" />Join WhatsApp Group</a>
            <a href={storeConfig.social.whatsappChannel} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold hover:bg-neutral-100"><MessageCircle className="h-5 w-5" aria-hidden="true" />Follow WhatsApp Channel</a>
          </div>
        </section>
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-neutral-200 dark:border-neutral-500/15">
          
          {/* Brand Summary (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-14 h-14 rounded-2xl p-[1px] bg-canvas    shadow-md dark:shadow-[0_0_25px_rgba(147,147,147,0.4)] group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-canvas rounded-[15px] p-1 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/brand-logo-small.webp"
                    alt="Theekzu Mobile Official Logo"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-wider text-ink dark:text-ink">THEEKZU</span>
                  <span className="text-xl font-black tracking-wider text-brand">MOBILE</span>
                </div>
                <span className="block text-[10px] text-ink dark:text-ink uppercase tracking-widest font-semibold">
                  {storeConfig.tagline}
                </span>
              </div>
            </Link>

            <p className="text-ink dark:text-ink text-xs leading-relaxed max-w-sm">
              Your premier Sri Lankan online destination for genuine Apple iPhones, certified pre-owned devices, original accessories, and trusted warranty service.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-ink dark:text-ink font-semibold">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>100% Genuine Apple Products Guaranteed</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={storeConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 flex items-center justify-center text-ink dark:text-ink hover:text-ink hover:border-neutral-500/60 hover:shadow-md transition-all"
                title="Facebook"
              >
                <Facebook data-brand-color="facebook" className="w-4 h-4" />
              </a>
              <a
                href={storeConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 flex items-center justify-center text-ink dark:text-ink hover:text-ink hover:border-neutral-500/60 hover:shadow-md transition-all"
                title="Instagram"
              >
                <Instagram data-brand-color="instagram" className="w-4 h-4" />
              </a>
              <a
                href={storeConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 flex items-center justify-center text-ink dark:text-ink hover:text-ink hover:border-neutral-500/60 hover:shadow-md transition-all"
                title="TikTok"
              >
                <svg data-brand-color="TikTok" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a data-ui="whatsapp-link"
                href={`https://wa.me/${storeConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 flex items-center justify-center text-ink dark:text-ink hover:text-ink hover:border-neutral-500/60 hover:shadow-md transition-all"
                title="WhatsApp"
              >
                <MessageCircle data-brand-color="#059669" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h4 className="text-xs font-bold text-ink dark:text-ink uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-canvas dark:bg-canvas" />
              Shop Store
            </h4>
            <ul className="space-y-2.5 text-xs text-ink dark:text-ink">
              <li>
                <Link href="/iphones" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Latest Brand New iPhones
                </Link>
              </li>
              <li>
                <Link href="/iphones?type=used" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Certified Used iPhones
                </Link>
              </li>
              <li>
                <Link href="/accessories?sub=chargers-cables" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Chargers & Cables
                </Link>
              </li>
              <li>
                <Link href="/accessories?sub=cases-accessories" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Cases & Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT Column */}
          <div>
            <h4 className="text-xs font-bold text-ink dark:text-ink uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-canvas dark:bg-canvas" />
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-ink dark:text-ink">
              <li>
                <Link href="/contact" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Contact Theekzu Mobile
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-ink dark:hover:text-ink transition-colors">
                  iPhone Trade-In Value
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Islandwide Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ink dark:hover:text-ink transition-colors">
                  About Our Company
                </Link>
              </li>
              <li>
                <Link href="/showroom" className="hover:text-ink dark:hover:text-ink transition-colors">
                  Our Showroom Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT Details Column */}
          <div>
            <h4 className="text-xs font-bold text-ink dark:text-ink uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-canvas dark:bg-canvas" />
              Contact Direct
            </h4>
            <div className="space-y-3 text-xs text-ink dark:text-ink">
              <div className="flex items-center gap-2.5">
                <Phone data-brand-color="#2563eb" className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <a href={`tel:${storeConfig.phoneRaw}`} className="hover:text-ink dark:hover:text-ink transition-colors font-medium">
                  Phone: {storeConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle data-brand-color="#059669" className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <a data-ui="whatsapp-link" href={`https://wa.me/${storeConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-ink dark:hover:text-ink transition-colors font-medium">
                  WhatsApp: {storeConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail data-brand-color="#4f46e5" className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <a href={`mailto:${storeConfig.email}`} className="hover:text-ink dark:hover:text-ink transition-colors truncate font-medium">
                  {storeConfig.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin data-brand-color="#f43f5e" className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <span>{storeConfig.location}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock data-brand-color="#f59e0b" className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                <span>{storeConfig.businessHours} Daily</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-ink dark:text-ink text-center sm:text-left">
            <span>© 2026 Theekzu Mobile. All Rights Reserved. Engineered with precision.</span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-ink dark:text-ink font-semibold">
            <span className="px-3 py-1 rounded-lg bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 shadow-sm">
              Cash on Delivery
            </span>
            <span className="px-3 py-1 rounded-lg bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 text-ink dark:text-ink shadow-sm">
              Bank Transfer (Commercial / Sampath / HNB)
            </span>
            <span className="px-3 py-1 rounded-lg bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 text-ink dark:text-ink shadow-sm">
              Credit / Debit Card
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

