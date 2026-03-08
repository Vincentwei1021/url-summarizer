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

/** Strip markdown syntax to get plain text for sentence splitting. */
function stripMarkdown(text: string): string {
  return text
    // Remove images ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // Replace links [text](url) with just text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Remove bold/italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    // Remove HTML tags
    .replace(/<[^>]+>/g, "")
    // Normalize whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Split text into sentence-like segments, handling various content types. */
function splitIntoSegments(rawText: string): string[] {
  const text = stripMarkdown(rawText);
  const cleaned = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned) return [];

  // Split on sentence-ending punctuation followed by space/uppercase
  let segments = cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z"'\u201c(])|(?<=[.!?])\s{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  // If that didn't produce enough segments, try simpler split
  if (segments.length < 3) {
    segments = cleaned
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // If still too few, split on newlines from original text
  if (segments.length < 3) {
    const nlSegments = text
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);
    if (nlSegments.length > segments.length) {
      segments = nlSegments;
    }
  }

  // Break any oversized segments (>600 chars) into smaller chunks
  const result: string[] = [];
  for (const seg of segments) {
    if (seg.length <= 600) {
      result.push(seg);
    } else {
      // Try to split on sentence boundaries within the segment
      const subParts = seg.split(/(?<=[.!?])\s+/).filter(Boolean);
      if (subParts.length > 1) {
        result.push(...subParts);
      } else {
        // Split on commas or semicolons as last resort
        const commaParts = seg.split(/[,;]\s+/).filter((s) => s.length > 15);
        if (commaParts.length > 1) {
          result.push(...commaParts);
        } else {
          // Just truncate
          result.push(seg.slice(0, 600));
        }
      }
    }
  }

  return result;
}

/** Extractive summarization. */
function extractiveSummarize(text: string, maxSentences = 5): string[] {
  // Very short content: return as-is
  if (text.trim().length < 200) {
    return [stripMarkdown(text.trim())];
  }

  const segments = splitIntoSegments(text);
  const candidates = segments.filter((s) => s.length >= 15 && s.length <= 600);

  // No candidates after all splitting: hard fallback
  if (candidates.length === 0) {
    const plain = stripMarkdown(text);
    const lines = plain.split(/\n+/).map((s) => s.trim()).filter((s) => s.length > 15);
    if (lines.length > 0) return lines.slice(0, maxSentences);
    return [plain.slice(0, 500).trim()];
  }

  if (candidates.length <= maxSentences) return candidates;

  // Score each segment by word frequency
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

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.idx - b.idx)
    .map((t) => t.sentence);
}

/** Extract key bullet points. */
function extractKeyPoints(text: string, max = 5): string[] {
  const segments = splitIntoSegments(text);
  const candidates = segments.filter((s) => s.length >= 15 && s.length <= 400);

  if (candidates.length === 0) {
    const plain = stripMarkdown(text);
    return plain.split(/\n+/).map((s) => s.trim()).filter((s) => s.length > 15).slice(0, max);
  }

  const signalWords = [
    "important","key","significant","major","critical","essential",
    "found","discovered","revealed","showed","demonstrated",
    "according","research","study","data","evidence",
    "new","first","largest","best","most",
    "conclusion","result","impact","effect","change",
    "percent","%","million","billion",
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
