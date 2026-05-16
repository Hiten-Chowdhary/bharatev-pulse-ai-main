import { useState } from "react";
import { Sparkles, X, Send, Bot, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { franchises, insights, alerts as mockAlerts, aiCosts, automationByWorkflow } from "@/lib/mock/data";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Show highest operational risk regions",
  "Summarize onboarding bottlenecks",
  "Which cities are underperforming?",
  "Where should staffing be increased?",
  "What operational risks exist this week?",
];

function roleAwareOpening(roleWelcome: string, profileName: string) {
  return `${roleWelcome} — Hi ${profileName}, I'm your BharatEV Ops Copilot. Ask about city health, staffing, AI savings, or expansion.`;
}

export function AiAssistant() {
  const { profile, welcomeLine, roleKey } = useDashboardRole();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: roleAwareOpening(welcomeLine, profile.name) },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);

    // simple rule-based responder using mock data
    const q = text.toLowerCase();

    let reply = "Analyzing operational signals across franchises… please wait a moment.";

    // city-specific
    const city = franchises.find((f) => q.includes(f.city.toLowerCase()));
    if (city) {
      const roleNote = roleKey === "cto" ? "Check AI fallback for onboarding models." : roleKey === "ops_head" ? "Prioritise dispatch and spare parts." : "Assess expansion readiness and P&L impact.";
      reply = `${city.city}: status ${city.status}. Health ${city.health || "—"}. ${city.alert ?? "No critical alerts."} Recommended actions: ${city.status === 'Onboarding' ? 'Expedite charging infra procurement and add 2 field engineers.' : 'Review staffing and routing; consider AI-assisted L1 for ticket deflection.'} ${roleNote}`;
    } else if (q.includes("onboarding")) {
      // aggregate onboarding insight
      reply = roleKey === "cto" ?
        "Onboarding pipeline: AI validation failing in 3% of cases — engineering to review model thresholds. Key blockers: vision KYC pipeline." :
        "Onboarding TAT has dropped ~57% where AI automation was applied. Key blockers remain: charging infra readiness and KYC doc verification. Recommend concentrated field pods and prioritized infra checklist for delayed cities (Jaipur, Kochi).";
    } else if (q.includes("risk") || q.includes("underperform")) {
      // highest risk
      const danger = mockAlerts.filter((a) => a.level === "danger" || a.level === "warning").map((a) => a.text).slice(0, 3).join("; ");
      reply = roleKey === "ceo" ?
        `Top operational signals: ${danger}. Suggested immediate actions: assign leadership owners and evaluate strategic funding for recovery.` :
        `Top operational signals: ${danger}. Suggested immediate actions: assign regional ops lead to Jaipur recovery plan, add 6 FEs in west cluster, and allocate temporary AI triage capacity to Pune.`;
    } else if (q.includes("staff")) {
      reply = roleKey === "regional_ops" ?
        "Region staffing gaps: Pune and Jaipur need immediate hires; consider short-term contractors for 8 weeks." :
        "Staffing hotspots: Delhi NCR, Mumbai, Bengaluru. Suggest rebalancing 8 field engineers from low-utilization Tier-2 pilots and launching short-term hiring in Mumbai to reduce cost-per-ticket.";
    } else if (q.includes("expansion")) {
      reply = "Expansion-ready cities: Coimbatore, Indore, Lucknow. Recommend Q1 activation with shared regional ops pod and conditional funding tied to infra readiness milestones.";
    } else if (q.includes("ai") || q.includes("savings") || q.includes("workflow")) {
      reply = roleKey === "cto" ?
        "AI workflows: 88% L1 deflection and 92% billing automation. Fallback rate 4.2% — recommend model retraining and infra scaling before wider rollout." :
        "AI workflows have delivered ~₹3.8 Cr annualized savings: 88% L1 deflection, 92% billing automation, and onboarding TAT down from 21 → 9 days. Monitor model fallback rates and escalate engineering fixes for onboarding pipelines.";
    } else {
      // generic fallback: synthesize top insights
      const top = insights.slice(0, 2).map((i) => `${i.tag}: ${i.title}`).join("; ");
      reply = `I looked across the network and surfaced: ${top}. For actionable steps, ask for staffing, onboarding, or city-specific summaries.`;
    }

    setMsgs((m) => [...m, { role: "ai", text: reply }]);
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
        <div className="fixed bottom-6 right-6 z-40 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-teal/10">
            <div className="h-8 w-8 rounded-lg bg-primary/20 grid place-items-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">BharatEV Ops Copilot</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · Operational reasoning
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
            {suggestions.map((s) => (
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
