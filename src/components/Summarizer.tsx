"use client";

import { useState } from "react";

interface SummaryResult {
  title: string | null;
  author: string | null;
  siteName: string | null;
  publishedDate: string | null;
  sourceUrl: string;
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTimeMin: number;
}

export default function Summarizer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Please enter a URL"); return; }
    try { new URL(trimmed); } catch { setError("Please enter a valid URL (e.g. https://example.com/article)"); return; }

    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to summarize");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = [
      result.title && `# ${result.title}`,
      result.siteName && `Source: ${result.siteName}`,
      "",
      "## Summary",
      result.summary,
      "",
      "## Key Takeaways",
      ...result.keyPoints.map((p, i) => `${i + 1}. ${p}`),
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <section id="summarizer" className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Input */}
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && summarize()}
            placeholder="https://example.com/article"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={summarize}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Summarizing…
              </span>
            ) : "Summarize"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {loading && (
          <div className="mt-8 space-y-4 animate-pulse">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div>
              {result.title && (
                <h2 className="text-xl font-bold text-gray-900">{result.title}</h2>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                {result.siteName && (
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
                    {result.siteName}
                  </span>
                )}
                {result.author && <span>by {result.author}</span>}
                {result.publishedDate && <span>{result.publishedDate}</span>}
                <span>{result.wordCount.toLocaleString()} words</span>
                <span>~{result.readingTimeMin} min read</span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Summary</h3>
              <p className="leading-relaxed text-gray-700">{result.summary}</p>
            </div>

            {/* Key Takeaways */}
            {result.keyPoints.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">Key Takeaways</h3>
                <ul className="space-y-2">
                  {result.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
              <button onClick={copyToClipboard} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                Copy Summary
              </button>
              <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Read Original
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
