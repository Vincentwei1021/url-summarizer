export default function HowTo() {
  const steps = [
    {
      num: "1",
      title: "Paste the Article URL",
      desc: "Copy the URL of any news article, blog post, research paper, or webpage you want to summarize and paste it into the input field above.",
    },
    {
      num: "2",
      title: "Click Summarize",
      desc: "Our AI article summarizer fetches the page, extracts the main content, and uses extractive summarization to distill it into a concise summary with key takeaways.",
    },
    {
      num: "3",
      title: "Read & Share",
      desc: "Review your summary and numbered key takeaways. Copy to clipboard or click through to read the full original article.",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          How to Summarize an Article Online — Free &amp; Instant
        </h2>
        <p className="mb-10 text-center text-gray-500">
          Get a TL;DR of any article in three simple steps with our free URL summarizer.
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                {s.num}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
