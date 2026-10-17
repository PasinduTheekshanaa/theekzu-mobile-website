"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { faqs } from "@/data/faqs";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold tracking-widest text-ink dark:text-ink uppercase shadow-xs">
          <Sparkles className="w-3 h-3" /> Got Questions?
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink dark:text-ink mt-3">
          Frequently Asked Questions
        </h2>
        <p className="text-ink dark:text-ink text-xs sm:text-sm mt-1">
          Everything you need to know about purchasing, warranty, and delivery.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="glass-card rounded-2xl border border-neutral-200 dark:border-neutral-500/20 overflow-hidden transition-colors shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full min-h-[48px] px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 sm:gap-4 font-semibold text-ink dark:text-ink text-xs sm:text-sm hover:text-ink dark:hover:text-ink transition-colors"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <HelpCircle className="w-4 h-4 text-ink dark:text-ink flex-shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-ink dark:text-ink transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-ink dark:text-ink" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-ink dark:text-ink leading-relaxed border-t border-neutral-200 dark:border-neutral-500/10">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
