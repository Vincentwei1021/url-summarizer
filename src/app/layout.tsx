import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://summarize-it.dev";

export const metadata: Metadata = {
  title: "Free AI Article Summarizer — Summarize Any URL Instantly | SummarizeIt",
  description:
    "Paste any URL and get an instant summary with key takeaways. Free article summarizer — no sign-up, no limits. Summarize news, blogs, and research in seconds.",
  keywords: [
    "article summarizer",
    "url summarizer",
    "summarize article online",
    "free text summarizer",
    "ai summarizer",
    "tldr generator",
    "summarize url",
    "webpage summarizer",
  ],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free AI Article Summarizer | SummarizeIt",
    description: "Paste any URL and get an instant summary with key takeaways — free, no sign-up.",
    url: siteUrl,
    siteName: "SummarizeIt",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Article Summarizer | SummarizeIt",
    description: "Paste any URL and get an instant summary with key takeaways — free, no sign-up.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>{children}</body>
    </html>
  );
}
