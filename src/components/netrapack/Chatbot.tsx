import { useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { API_BASE, CHAT_FOOTER } from "@/lib/netrapack";

type Msg = { role: "user" | "ai"; text: string };

export function Chatbot({ scanId }: { scanId?: string | undefined }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: `Ask about LMPC Rules, 2011 compliance for this scan.\n\n${CHAT_FOOTER}` },
  ]);

  async function send() {
    const query = input.trim();
    if (!query || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: query }]);
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scan_id: scanId, query }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json().catch(() => ({}));
      const answer = data.answer ?? data.response ?? "No response received.";
      setMessages((m) => [...m, { role: "ai", text: `${answer}\n\n${CHAT_FOOTER}` }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `${e instanceof Error ? e.message : "Request failed."}\n\n${CHAT_FOOTER}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open compliance assistant"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <MessageCircle className="size-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center">
          <div className="flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-xl border border-border bg-card sm:rounded-xl">
            <div className="flex items-center justify-between border-b border-border bg-primary px-3 py-2.5 text-primary-foreground">
              <span className="text-sm font-bold">Compliance Assistant (RAG)</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-surface-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {busy ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : null}
            </div>
            <div className="flex items-center gap-2 border-t border-border p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about a rule or violation…"
                className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={send}
                disabled={busy}
                aria-label="Send"
                className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
