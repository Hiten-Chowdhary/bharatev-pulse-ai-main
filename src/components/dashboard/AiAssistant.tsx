import { useEffect, useState } from "react";
import { Sparkles, X, Send, Bot, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardRole } from "@/context/DashboardRoleContext";

type Msg = { role: "user" | "ai"; text: string };

/** Predefined prompts — Ops Copilot prototype (no backend) */
const suggestions = [
  "Show highest operational risk clusters",
  "Predict staffing overload next quarter",
  "Compare AI tooling ROI vs manpower cost",
  "Identify underperforming franchises",
  "Show AI fallback-heavy workflows",
  "Which city has highest onboarding delay risk?",
];

const exactReplies: Record<string, string> = {
  "Show highest operational risk clusters":
    "Highest operational risk clusters: (1) Jaipur — charging dependency blocked, risk score 88, 23d onboarding slip, 52% human fallback on onboarding. (2) Pune West + Ahmedabad corridor — dispatch bottleneck, support backlog 186 in Pune, CRM/onboarding dependency conflict in Ahmedabad. Recommend: war-room triage for west, temporary regional support redistribution, and do not parallelize Indore rollout until Jaipur OEM path clears.",
  "Predict staffing overload next quarter":
    "Forecast (mock signals): Pune field engineering utilization is already ~112% with 1.9× escalation rate — without 4–6 net-new FEs by week 6 of next quarter, overload probability ~38% and SLA breach on L2 within 45d. Mumbai support is stable but cost-heavy; shift 1 compliance FTE from Delhi to Pune pod on 90d rotation to buffer.",
  "Compare AI tooling ROI vs manpower cost":
    "Snapshot: AI tooling spend annualized ~₹1.42 Cr vs est. operational savings ₹2.9 Cr YTD — effective multiple ~2.9× after partial human fallback cost (~₹1.1 Cr est.). Manpower remains the dominant OpEx bucket (~41% of mix). Action: freeze net-new AI vendors until onboarding low-confidence rate drops below 24%; reallocate savings to FE bench in west cluster.",
  "Identify underperforming franchises":
    "Underperformers vs network baseline: Jaipur (onboarding, infra blocked, margin volatility high), Pune (margin drag from escalations + dispatch), Ahmedabad (AI low-confidence + manual override spike). Bengaluru and Hyderabad are relative anchors. Recommend franchise recovery playbook for Jaipur first, then west-cluster dispatch fix.",
  "Show AI fallback-heavy workflows":
    "Fallback-heavy today: Onboarding (39% human), Field dispatch (64% human), Compliance (42% human). Jaipur and Ahmedabad drive most onboarding overrides after policy edge-case change. Action: cap auto-approval on onboarding, add 3-person verification bench, and publish FE dispatch SLA with spare-parts buffer SKUs for Pune.",
  "Which city has highest onboarding delay risk?":
    "Jaipur shows the highest onboarding delay risk — 23d behind SLA, charging infra downtime, regulatory delay 6w on feeder, and 52% human fallback on the onboarding workflow. Kochi is secondary (14d slip, policy clarification). Executive move: hybrid verification + dedicated regulatory DRI + pause Indore charger allocation conflict until Jaipur path is green.",
};

type Rule = { keys: string[]; reply: string };

const partialRules: Rule[] = [
  {
    keys: ["jaipur", "rj"],
    reply: "Jaipur franchise has shown declining operational efficiency for 3 consecutive months due to charging infra instability and support staffing shortage. Recommend temporary regional support redistribution, hybrid onboarding verification, and sequencing Indore expansion after Jaipur's DISCOM + transformer path is owned by one DRI.",
  },
  {
    keys: ["pune", "west"],
    reply: "Pune West is your highest-execution-risk active cluster: support backlog is elevated, FE dispatch is the bottleneck, and infra dependency is fragile. Deploy 2 additional field engineers in Pune West, run twice-daily human war-room triage on top-decile L2 tickets, and shift part of MH-GJ onboarding workload to the shared regional ops pod.",
  },
  {
    keys: ["risk", "cluster", "operational risk"],
    reply: "Risk-weighted view (prototype): Jaipur > Pune/Ahmedabad corridor > Delhi regulatory queue. Charging dependency, staffing gaps, and deployment bottlenecks dominate — not demand. Use the Command Center failure signals panel for the quant layer; I can narrate recovery sequencing if you name a city.",
  },
  {
    keys: ["staff", "overload", "hiring", "fe "],
    reply: "Staffing outlook: west zone FEs are past sustainable utilization; support in Pune is underwater on L2. Next-quarter overload is likely without contract hires and a pod rotation. Compare against your Workforce tab — human cost is still the lever; AI deflection helps but does not replace transformer lead times.",
  },
  {
    keys: ["roi", "ai", "manpower", "human cost"],
    reply: "AI vs manpower: tooling ROI is positive but not 'magic' — savings are partially eaten by human fallback and escalation labor. Keep AI spend flat until onboarding confidence recovers; invest marginal rupees into FE bench and regulatory liaison where payback is weeks, not quarters.",
  },
  {
    keys: ["fallback", "low confidence", "confidence"],
    reply: "Fallback-heavy flows map to onboarding, field dispatch, and compliance. Jaipur and Ahmedabad are pulling manual override rate up. Operationally: tighten auto-pass thresholds, route edge cases to a verification bench, and schedule model retrain after policy exceptions stabilize.",
  },
  {
    keys: ["delay", "onboarding", "tat", "slip"],
    reply: "Onboarding delay risk is concentrated in Jaipur (23d slip, blocked charging dependency) and Kochi (14d slip, regulatory/policy clarification). Treat as execution programs, not analytics tickets — assign DRIs, weekly DISCOM cadence, and temporary hybrid KYC.",
  },
  {
    keys: ["underperform", "weak", "bad"],
    reply: "Worst relative operational outcomes: Jaipur, then Pune and Ahmedabad on margin + execution drag. Anchor cities (Bengaluru, Hyderabad) are funding recovery. Recommend recovery OKRs per city with explicit dependency owners (DISCOM, landlord, OEM).",
  },
  {
    keys: ["hello", "hi ", "hey"],
    reply: "Hi — I'm Ops Copilot (prototype). I synthesize the same mock operational signals as your dashboard: friction, failures, staffing, and financial linkage. Try a suggested prompt or name a city / workflow.",
  },
];

const defaultReply =
  "I'm a prototype operational layer — no live model or API. From your current dashboard snapshot: the network is still revenue-positive but execution volatility is real (May revenue dip, west dispatch, Jaipur onboarding). Try a suggested prompt, or mention a city (e.g. Jaipur, Pune), risk, staffing, ROI, fallback, or delays for a grounded briefing.";

function copilotReply(userText: string): string {
  const t = userText.trim();
  if (!t) return defaultReply;
  if (exactReplies[t]) return exactReplies[t];
  const lower = t.toLowerCase();
  for (const rule of partialRules) {
    if (rule.keys.some((k) => lower.includes(k))) return rule.reply;
  }
  return defaultReply;
}

export function AiAssistant() {
  const { profile } = useDashboardRole();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: `Ops Copilot (prototype) for ${profile.name} — I read the same mock data as the UI (no backend). Ask about cities, risks, staffing, or AI fallbacks.`,
    },
  ]);

  useEffect(() => {
    setMsgs([
      {
        role: "ai",
        text: `Ops Copilot (prototype) for ${profile.name} — I read the same mock data as the UI (no backend). Ask about cities, risks, staffing, or AI fallbacks.`,
      },
    ]);
    setInput("");
  }, [profile.id, profile.name]);

  function send(text: string) {
    if (!text.trim()) return;
    const reply = copilotReply(text);
    setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: reply }]);
    setInput("");
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg glow-primary hover:scale-[1.02] transition"
        >
          <div className="relative">
            <Sparkles className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
          </div>
          <span className="text-sm font-medium">Ops Copilot</span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-teal/10">
            <div className="h-8 w-8 rounded-lg bg-primary/20 grid place-items-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">Ops Copilot</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                <span>Prototype · dashboard-aware mock responses</span>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-secondary shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "h-7 w-7 shrink-0 rounded-md grid place-items-center",
                    m.role === "ai" ? "bg-primary/15 text-primary" : "bg-secondary text-foreground",
                  )}
                >
                  {m.role === "ai" ? <Bot className="h-3.5 w-3.5" /> : <User2 className="h-3.5 w-3.5" />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] text-sm leading-relaxed rounded-lg px-3 py-2",
                    m.role === "ai" ? "bg-secondary/60 border border-border" : "bg-primary text-primary-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="text-[10px] leading-snug px-2 py-1 rounded-md border border-border bg-card hover:border-primary/40 hover:text-primary transition text-left max-w-full"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3 flex items-center gap-2 bg-background/40"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ops Copilot (prototype)…"
              className="flex-1 bg-secondary/40 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary/50 min-w-0"
            />
            <button type="submit" className="h-9 w-9 shrink-0 grid place-items-center rounded-md bg-primary text-primary-foreground hover:opacity-90">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
