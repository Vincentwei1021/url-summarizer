"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {items.map((faq, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium text-gray-900 sm:text-base">{faq.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="border-t border-gray-100 px-5 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
