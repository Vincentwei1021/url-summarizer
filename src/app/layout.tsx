import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://summarize-it.dev";

export const metadata: Metadata = {
  title: "Free Article Summarizer Online | AI URL Summarizer",
  description:
    "Summarize any article online for free. Paste a URL, get key takeaways instantly. AI-powered article summarizer & TL;DR generator — no sign-up required.",
  keywords: [
    "article summarizer",
    "url summarizer",
    "summarize article online",
    "free text summarizer",
    "ai summarizer",
    "tldr generator",
    "webpage summarizer",
    "summarize url free",
    "article summary tool",
    "summarize any article online",
    "online article summarizer",
  ],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free Article Summarizer Online | AI URL Summarizer",
    description:
      "Paste any URL and get an instant summary with key takeaways — free AI-powered article summarizer.",
    url: siteUrl,
    siteName: "SummarizeIt",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SummarizeIt — Free AI Article & URL Summarizer Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Article Summarizer Online | AI URL Summarizer",
    description:
      "Paste any URL and get an instant summary with key takeaways — free AI-powered article summarizer.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>{children}</body>
    </html>
  );
}
