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
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase shadow-xs">
          <Sparkles className="w-3 h-3" /> Got Questions?
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1">
          Everything you need to know about purchasing, warranty, and delivery.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="glass-card rounded-2xl border border-slate-200 dark:border-cyan-500/20 overflow-hidden transition-colors shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-cyan-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed border-t border-slate-200 dark:border-cyan-500/10">
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
