import { useState } from "react";
import { Sparkles, X, Send, Bot, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Which franchise is underperforming?",
  "Show operational savings from AI workflows",
  "Recommend expansion cities",
  "Why is Pune franchise profitability declining?",
  "Show highest staffing cost locations",
];

const replies: Record<string, string> = {
  "Which franchise is underperforming?":
    "Jaipur is the lowest performer — 3 consecutive loss-making months, infra readiness 41%, and support TAT 2.3× network avg. Recommend staffing optimization (-2 ops), localized WhatsApp campaigns, and AI takeover of L1 support.",
  "Show operational savings from AI workflows":
    "AI workflows saved ₹3.8 Cr over the last 12 months — 57% TAT reduction in onboarding, 88% L1 support deflection, and 92% billing automation. Net AI ROI: 4.6×.",
  "Recommend expansion cities":
    "Top 3 expansion candidates: Coimbatore (adoption 68 / infra 52), Indore (64 / 49), Lucknow (59 / 44). Coimbatore is activation-ready this quarter using a shared south-zone ops pod.",
  "Why is Pune franchise profitability declining?":
    "Pune margin dropped 4.1pp this quarter. Primary driver: support escalations +14% MoM with field engineer dispatch bottleneck. Adoption remains strong (84). Add 6 FEs in west zone and route L2 tickets through AI triage.",
  "Show highest staffing cost locations":
    "Top staffing cost centers: Delhi NCR (₹38L/mo), Mumbai (₹34L/mo), Bengaluru (₹31L/mo). Mumbai shows highest cost-per-ticket — opportunity for AI-assisted L1 reduction worth ~₹6L/mo.",
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi Arjun — I'm your BharatEV operations copilot. Ask about franchise performance, staffing, AI savings, or expansion." },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    const reply = replies[text] ??
      "Analyzing operational signals across 9 active franchises… Based on current trends, I'd recommend reviewing the AI Insights tab for a structured breakdown.";
    setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: reply }]);
    setInput("");
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg glow-primary hover:scale-[1.02] transition">
          <div className="relative">
            <Sparkles className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
          </div>
          <span className="text-sm font-medium">Ask Ops AI</span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-teal/10">
            <div className="h-8 w-8 rounded-lg bg-primary/20 grid place-items-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">BharatEV Ops Copilot</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · GPT-class reasoning
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                <div className={cn("h-7 w-7 shrink-0 rounded-md grid place-items-center",
                  m.role === "ai" ? "bg-primary/15 text-primary" : "bg-secondary text-foreground")}>
                  {m.role === "ai" ? <Bot className="h-3.5 w-3.5" /> : <User2 className="h-3.5 w-3.5" />}
                </div>
                <div className={cn("max-w-[80%] text-sm leading-relaxed rounded-lg px-3 py-2",
                  m.role === "ai" ? "bg-secondary/60 border border-border" : "bg-primary text-primary-foreground")}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {suggestions.slice(0, 3).map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-[11px] px-2 py-1 rounded-full border border-border bg-card hover:border-primary/40 hover:text-primary transition">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 flex items-center gap-2 bg-background/40">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about franchises, AI savings, expansion…"
              className="flex-1 bg-secondary/40 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary/50" />
            <button type="submit" className="h-9 w-9 grid place-items-center rounded-md bg-primary text-primary-foreground hover:opacity-90">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
