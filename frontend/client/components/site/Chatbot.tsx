import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, Trash2 } from "lucide-react";

type Msg = { id: string; from: "user" | "bot"; text: string; ts: number };
const STORAGE_KEY = "aerovoyage_chat_history_v1";

function tsNow() {
  return Date.now();
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Msg[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = { id: String(Math.random()), from: "user", text: input.trim(), ts: tsNow() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json().catch(() => null);
      const replyText = data?.reply || data?.error || "Sorry, I couldn't respond.";
      const botMsg: Msg = { id: String(Math.random()), from: "bot", text: replyText, ts: tsNow() };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      const botMsg: Msg = {
        id: String(Math.random()),
        from: "bot",
        text: `Request failed: ${err?.message || String(err)}`,
        ts: tsNow(),
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">Chat</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed right-6 bottom-6 z-50 flex h-[72vh] w-[360px] max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md md:right-12 md:bottom-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-tr from-orange-500 to-orange-600 text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">JournoBot</div>
                <div className="text-xs text-gray-500">Your travel assistant</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearConversation}
                title="Clear conversation"
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-orange-100 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close chat"
                className="rounded-md p-1 text-gray-500 hover:bg-orange-100 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">
                Hi! I'm JournoBot — ask me about destinations, pricing, or help with bookings.
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-gradient-to-tr from-orange-500 to-orange-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="mt-1 text-xs text-gray-400 text-right">
                    {new Date(m.ts).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">JournoBot is typing...</div>}
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2">
            <div className="flex items-center gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                className="h-10 max-h-28 flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="flex items-center justify-center rounded-md bg-gradient-to-tr from-orange-500 to-orange-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:scale-105 transition-transform duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
