import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold text-blue-600">📝 SummarizeIt</Link>
        <div className="flex items-center gap-6">
          <Link href="/#summarizer" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Summarizer</Link>
          <Link href="/#faq" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">FAQ</Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Blog</Link>
        </div>
      </nav>
    </header>
  );
}
