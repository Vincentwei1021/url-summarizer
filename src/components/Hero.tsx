export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/30 px-4 pb-10 pt-20 text-center sm:px-6 sm:pb-16 sm:pt-28">
      <div className="pointer-events-none absolute left-[12%] top-24 text-4xl opacity-20 animate-float" style={{animationDelay:'0s'}}>📄</div>
      <div className="pointer-events-none absolute right-[18%] top-28 text-3xl opacity-15 animate-float" style={{animationDelay:'1.2s'}}>⚡</div>
      <div className="pointer-events-none absolute left-[65%] top-16 text-2xl opacity-10 animate-float" style={{animationDelay:'0.6s'}}>🔍</div>
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Free &middot; No Sign-up &middot; Any URL
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Summarize Any{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Article</span>{" "}
          in Seconds
        </h1>
        <p className="mt-6 text-lg text-gray-600 sm:text-xl leading-relaxed">
          Paste a URL and get a clean, readable summary — extract key points, metadata, and structured content from any web page instantly.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> Key Points</span>
          <span className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> Markdown Export</span>
          <span className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> Metadata Extract</span>
        </div>
      </div>
    </section>
  );
}
