"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How does SummarizeIt work?",
    a: "Paste any article URL and we extract the main content, then use extractive summarization to identify the most important sentences. You get a concise summary and key takeaways in seconds — no AI hallucinations, just the actual text distilled down.",
  },
  {
    q: "Is SummarizeIt free?",
    a: "Yes, completely free with no sign-up required. Just paste a URL and get your summary instantly.",
  },
  {
    q: "What types of URLs can I summarize?",
    a: "Any publicly accessible webpage with text content: news articles, blog posts, research papers, documentation, Wikipedia pages, and more. It works best with article-style content that has clear paragraphs.",
  },
  {
    q: "What is extractive summarization?",
    a: "Extractive summarization selects the most important sentences directly from the original text rather than generating new text. This means every sentence in your summary is a real quote from the article — zero hallucinations, 100% faithful to the source.",
  },
  {
    q: "How long does summarization take?",
    a: "Typically 2-5 seconds. The time depends mostly on how long it takes to fetch and parse the original webpage.",
  },
  {
    q: "Is my data stored?",
    a: "No. URLs are processed in real-time and nothing is stored. We don't track which URLs you summarize or keep any content.",
  },
  {
    q: "Can I summarize paywalled articles?",
    a: "No. SummarizeIt can only access publicly available content. If the article requires a login or subscription, we won't be able to extract its content.",
  },
  {
    q: "What languages are supported?",
    a: "The extraction works with any language, but the summarization algorithm is optimized for English. It may still produce reasonable results for other Latin-script languages.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium text-gray-900 sm:text-base">{faq.q}</span>
                <svg className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
