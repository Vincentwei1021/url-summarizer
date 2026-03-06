import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Summarizer from "@/components/Summarizer";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Summarizer />
        <FAQ />
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">About SummarizeIt</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              SummarizeIt is a free article summarization tool that uses extractive summarization
              to distill any webpage into its key points. No AI hallucinations — every sentence
              comes directly from the original article. Built for readers, researchers, and anyone
              who values their time.
            </p>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SummarizeIt",
            url: "https://summarize-it.dev",
            description: "Free online article summarizer. Paste any URL and get an instant summary with key takeaways.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            browserRequirements: "Requires a modern web browser",
          }),
        }}
      />
    </>
  );
}
