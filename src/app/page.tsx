import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Summarizer from "@/components/Summarizer";
import HowTo from "@/components/HowTo";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

/* ── FAQ data (shared between component + JSON-LD) ── */
const faqItems = [
  {
    q: "How does the article summarizer work?",
    a: "Paste any article URL and SummarizeIt extracts the main content, then uses extractive summarization to identify the most important sentences. You get a concise summary and key takeaways in seconds \u2014 no AI hallucinations, just the actual text distilled down.",
  },
  {
    q: "Is SummarizeIt free?",
    a: "Yes, completely free with no sign-up required. Just paste a URL and get your summary instantly. There are no hidden limits or paywalls.",
  },
  {
    q: "What types of URLs can I summarize?",
    a: "Any publicly accessible webpage with text content: news articles, blog posts, research papers, documentation, Wikipedia pages, and more. Our URL summarizer works best with article-style content that has clear paragraphs.",
  },
  {
    q: "What is extractive summarization?",
    a: "Extractive summarization selects the most important sentences directly from the original text rather than generating new text. This means every sentence in your summary is a real quote from the article \u2014 zero hallucinations, 100% faithful to the source.",
  },
  {
    q: "How long does summarization take?",
    a: "Typically 2\u20135 seconds. The time depends mostly on how long it takes to fetch and parse the original webpage.",
  },
  {
    q: "Is my data stored?",
    a: "No. URLs are processed in real-time and nothing is stored. We don\u0027t track which URLs you summarize or keep any content.",
  },
  {
    q: "Can I summarize paywalled articles?",
    a: "No. SummarizeIt can only access publicly available content. If the article requires a login or subscription, we won\u0027t be able to extract its content.",
  },
  {
    q: "What languages are supported?",
    a: "The extraction works with any language, but the summarization algorithm is optimized for English. It may still produce reasonable results for other Latin-script languages.",
  },
];

/* ── JSON-LD: WebApplication ── */
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SummarizeIt",
  url: "https://summarize-it.dev",
  description:
    "Free online article summarizer and URL summary tool. Paste any URL and get an instant summary with key takeaways powered by AI.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  browserRequirements: "Requires a modern web browser",
};

/* ── JSON-LD: FAQPage ── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

/* ── JSON-LD: HowTo ── */
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Summarize Any Article Online for Free",
  description:
    "Follow these simple steps to summarize any article or URL instantly using SummarizeIt \u2014 a free AI-powered article summarizer.",
  step: [
    {
      "@type": "HowToStep",
      name: "Paste the article URL",
      text: "Copy the URL of the article, blog post, or webpage you want to summarize and paste it into the input field.",
    },
    {
      "@type": "HowToStep",
      name: "Click Summarize",
      text: "Hit the Summarize button. SummarizeIt fetches the page, extracts the main content, and uses AI-powered extractive summarization to generate a concise summary with key takeaways.",
    },
    {
      "@type": "HowToStep",
      name: "Read & share your summary",
      text: "Review the summary, key takeaways, and article metadata. Copy the summary to your clipboard or click through to read the original article.",
    },
  ],
  tool: { "@type": "HowToTool", name: "SummarizeIt \u2014 Free AI Article Summarizer" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Summarizer />
        <HowTo />

        {/* Features section */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
              Why Use Our AI Article Summarizer?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: "\uD83D\uDD17",
                  title: "Any URL, Instantly",
                  desc: "Paste any article URL \u2014 news, blogs, research papers, documentation \u2014 and get a summary in seconds. Our URL summarizer handles any publicly accessible webpage.",
                },
                {
                  icon: "\uD83C\uDFAF",
                  title: "Key Takeaways",
                  desc: "Don\u0027t just get a summary \u2014 get a numbered list of the most important points, perfect for quick reference or sharing with your team.",
                },
                {
                  icon: "\uD83D\uDEE1\uFE0F",
                  title: "No Hallucinations",
                  desc: "Extractive summarization pulls real sentences from the original text. Every word in your summary comes directly from the source \u2014 100% faithful, zero fabrication.",
                },
                {
                  icon: "\uD83D\uDD12",
                  title: "Private & Free",
                  desc: "No sign-up, no data storage, no tracking. Summarize as many articles as you want \u2014 completely free with no limits or hidden fees.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="mb-3 text-3xl">{f.icon}</div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ items={faqItems} />

        {/* About — keyword-rich */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              About SummarizeIt
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed text-left sm:text-center">
              <p>
                <strong>SummarizeIt</strong> is a <strong>free article summarizer</strong> that
                lets you <strong>summarize any article online</strong> in seconds. Paste a URL
                from any news site, blog, or research journal and our AI-powered{" "}
                <strong>URL summarizer</strong> extracts the essential information into a concise
                summary with numbered key takeaways.
              </p>
              <p>
                Unlike generative AI tools that paraphrase and risk hallucinations, SummarizeIt
                uses <strong>extractive summarization</strong> \u2014 every sentence in the output
                comes directly from the original article. This makes it the perfect{" "}
                <strong>TL;DR generator</strong> for readers who want accuracy over brevity tricks.
              </p>
              <p>
                Whether you\u0027re a student researching papers, a professional skimming industry
                news, or anyone drowning in open tabs \u2014 our{" "}
                <strong>webpage summarizer</strong> saves you time without sacrificing accuracy.
                No sign-ups, no tracking, no fees. Just fast, reliable{" "}
                <strong>article summaries</strong> whenever you need them.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
}
