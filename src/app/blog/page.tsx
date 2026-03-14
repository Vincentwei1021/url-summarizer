import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | SummarizeIt",
  description: "Guides on AI summarization, reading productivity, and how to use URL summarizers effectively.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    slug: "how-ai-summarization-works",
    title: "How AI Summarization Works: A Plain-Language Guide",
    excerpt: "Understand the difference between extractive and abstractive summarization, how LLMs process content, and when to trust AI summaries.",
    date: "2026-03-10",
  },
  {
    slug: "url-summarizer-productivity",
    title: "5 Ways a URL Summarizer Saves You Hours Every Week",
    excerpt: "From research triage to competitive monitoring — five concrete workflows where an AI URL summarizer cuts through information overload.",
    date: "2026-03-08",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog</h1>
          <p className="mt-2 text-gray-600">Guides on AI summarization, speed reading, and productivity.</p>
          <div className="mt-10 space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <time className="text-xs font-medium text-gray-400">{post.date}</time>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">{post.title}</Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">Read more →</Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
