import Script from "next/script";
import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading", weight: ["400","500","600","700","800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://summarize.toolboxlite.com";

export const metadata: Metadata = {
  title: "Free Article Summarizer Online — Summarize Any URL | SummarizeIt",
  description: "Paste any URL and get a clean, readable summary in seconds. Extract key points from articles, blogs, and web pages. Free, fast, no sign-up.",
  keywords: ["article summarizer", "url summarizer", "summarize website", "text summarizer", "content summary", "free summarizer"],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: { title: "Free Article Summarizer | SummarizeIt", description: "Summarize any web page in seconds. Free and fast.", url: siteUrl, siteName: "SummarizeIt", type: "website" },
  twitter: { card: "summary_large_image", title: "Free Article Summarizer | SummarizeIt", description: "Paste a URL, get a summary. Free, no sign-up." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5881105388002876" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
