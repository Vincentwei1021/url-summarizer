import { NextRequest, NextResponse } from "next/server";

const TOOLBOX_URL = process.env.TOOLBOX_API_URL || "http://localhost:3100";
const TOOLBOX_KEY = process.env.TOOLBOX_API_KEY || "test-key-123";

const STOPWORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "is","it","this","that","was","are","be","has","have","had","not","from",
  "as","its","they","their","we","you","he","she","will","can","do","did",
  "been","were","would","could","should","may","might","about","into","than",
  "then","them","these","those","which","what","when","where","who","how","all",
  "each","every","both","few","more","most","other","some","such","no","only",
  "own","same","so","very","just","also","over","after","before","between",
]);

/** Split text into chunks that look like sentences or meaningful segments. */
function splitIntoSegments(text: string): string[] {
  // Normalize whitespace
  const cleaned = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

  // First try splitting on sentence-ending punctuation
  const sentenceSplit = cleaned.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

  // Also split on other boundaries for non-article content (nav text, bullet points)
  if (sentenceSplit.length < 3) {
    // Fallback: split on periods, newlines, semicolons, or long dashes
    const fallbackSplit = cleaned.split(/[.!?;]\s+|\s*[–—]\s*|\s*\|\s*/).map((s) => s.trim()).filter((s) => s.length > 10);
    if (fallbackSplit.length > sentenceSplit.length) return fallbackSplit;
  }

  return sentenceSplit;
}

/** Extractive summarization — robust version that handles sparse/nav content. */
function extractiveSummarize(text: string, maxSentences = 5): string[] {
  const segments = splitIntoSegments(text);

  // Accept segments from 15 to 600 chars (much more lenient than before)
  const candidates = segments.filter((s) => s.length >= 15 && s.length <= 600);

  // If very short content, return it directly
  if (text.trim().length < 200) {
    return [text.trim()];
  }

  // If no candidates pass the filter, fallback: take the first N non-empty chunks
  if (candidates.length === 0) {
    const fallback = text
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10)
      .slice(0, maxSentences);
    return fallback.length > 0 ? fallback : [text.slice(0, 500).trim()];
  }

  if (candidates.length <= maxSentences) return candidates;

  // Score each segment
  const wordFreq: Record<string, number> = {};
  for (const s of candidates) {
    for (const w of s.toLowerCase().split(/\W+/)) {
      if (w.length > 2 && !STOPWORDS.has(w)) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    }
  }

  const scored = candidates.map((s, idx) => {
    const words = s.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
    const freqScore = words.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) / (words.length || 1);
    const positionBoost = 1 / (1 + idx * 0.1);
    const lengthBoost = Math.min(s.length / 200, 1.2);
    return { sentence: s, idx, score: freqScore * positionBoost * lengthBoost };
  });

  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.idx - b.idx);

  return top.map((t) => t.sentence);
}

/** Extract key bullet points — robust version. */
function extractKeyPoints(text: string, max = 5): string[] {
  const segments = splitIntoSegments(text);
  const candidates = segments.filter((s) => s.length >= 15 && s.length <= 400);

  if (candidates.length === 0) {
    // Fallback: split by newlines
    return text
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10)
      .slice(0, max);
  }

  const signalWords = [
    "important", "key", "significant", "major", "critical", "essential",
    "found", "discovered", "revealed", "showed", "demonstrated",
    "according", "research", "study", "data", "evidence",
    "new", "first", "largest", "best", "most",
    "conclusion", "result", "impact", "effect", "change",
    "percent", "%", "million", "billion",
  ];

  const scored = candidates.map((s, idx) => {
    const lower = s.toLowerCase();
    const signalScore = signalWords.filter((w) => lower.includes(w)).length;
    const posBoost = 1 / (1 + idx * 0.05);
    return { sentence: s, idx, score: signalScore * posBoost + posBoost * 0.5 };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .sort((a, b) => a.idx - b.idx)
    .map((t) => t.sentence);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "url is required" }, { status: 400 });
    }

    try { new URL(url); } catch {
      return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 });
    }

    const extractRes = await fetch(`${TOOLBOX_URL}/v1/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOOLBOX_KEY}`,
      },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(30000),
    });

    if (!extractRes.ok) {
      return NextResponse.json({ success: false, error: "Failed to extract content from URL" }, { status: 502 });
    }

    const extractData = await extractRes.json();
    const content: string = extractData.data?.content || "";
    const metadata = extractData.data?.metadata || {};

    if (!content || content.length < 20) {
      return NextResponse.json({ success: false, error: "Could not extract enough content from this URL" }, { status: 422 });
    }

    const truncated = content.slice(0, 3000);

    const summary = extractiveSummarize(truncated, 5);
    const keyPoints = extractKeyPoints(truncated, 5);
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

    return NextResponse.json({
      success: true,
      data: {
        title: metadata.title || null,
        author: metadata.author || null,
        siteName: metadata.siteName || null,
        publishedDate: metadata.publishedDate || null,
        sourceUrl: url,
        summary: summary.join(" "),
        keyPoints,
        wordCount,
        readingTimeMin,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Summarization failed. Please try again." }, { status: 500 });
  }
}
