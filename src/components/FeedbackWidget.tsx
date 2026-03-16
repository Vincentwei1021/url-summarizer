"use client";
import { useState } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), email: email.trim() || undefined, url: window.location.href, timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => { setOpen(false); setStatus("idle"); setMessage(""); setEmail(""); }, 2000);
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)} aria-label="Send feedback"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-transform hover:scale-110 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        style={{ fontSize: 20 }}>
        {open ? "✕" : "💬"}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 animate-[fadeIn_0.2s_ease-out] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          {status === "success" ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-semibold text-gray-900 dark:text-white">Thanks!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">We&apos;ll review your feedback.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Send Feedback</h3>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What's on your mind?" rows={3} required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 resize-none" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional, for replies)"
                className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500" />
              {status === "error" && <p className="mt-2 text-xs text-red-500">Something went wrong. Try again.</p>}
              <button type="submit" disabled={status === "loading" || !message.trim()}
                className="mt-3 w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500">
                {status === "loading" ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
