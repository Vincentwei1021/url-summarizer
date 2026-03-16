import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join("/tmp", "feedback.json");

interface FeedbackEntry {
  message: string;
  email?: string;
  url?: string;
  timestamp: string;
}

async function readFeedback(): Promise<FeedbackEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body.message || "").trim();
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Log to stdout (Vercel function logs — permanent)
    console.log(`[FEEDBACK] ${message} | email=${body.email || "n/a"} | url=${body.url || "n/a"} | ${new Date().toISOString()}`);

    // Persist to /tmp (ephemeral per instance)
    try {
      const entries = await readFeedback();
      entries.push({
        message,
        email: (body.email || "").trim() || undefined,
        url: body.url || undefined,
        timestamp: body.timestamp || new Date().toISOString(),
      });
      await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
    } catch { /* /tmp write failed, logged to stdout already */ }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
