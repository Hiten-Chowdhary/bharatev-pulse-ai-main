import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { Panel, KpiCard } from "@/components/dashboard/Kpi";
import { insights } from "@/lib/mock/data";
import { AlertTriangle, Brain, CheckCircle2, Lightbulb, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/insights")({ component: Insights });

const sevMap = {
  danger: { ring: "border-destructive/40 bg-destructive/10", icon: AlertTriangle, color: "text-destructive" },
  warning: { ring: "border-warning/40 bg-warning/10", icon: AlertTriangle, color: "text-warning" },
  success: { ring: "border-success/40 bg-success/10", icon: CheckCircle2, color: "text-success" },
  info: { ring: "border-primary/40 bg-primary/10", icon: Lightbulb, color: "text-primary" },
} as const;

function Insights() {
  return (
    <>
      <TopBar title="AI Operational Insights" subtitle="Predictive intelligence layer · refreshed continuously" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Active Insights" value="27" deltaLabel="across 5 categories" icon={Brain} accent="primary" />
          <KpiCard label="Risk Alerts" value="4" deltaLabel="2 critical" icon={AlertTriangle} accent="danger" />
          <KpiCard label="Expansion Opportunities" value="6" delta={20} icon={TrendingUp} accent="teal" />
          <KpiCard label="AI Confidence (avg)" value="91%" delta={3.4} icon={Sparkles} accent="success" />
        </div>

        <Panel title="Executive Recommendations" subtitle="Actionable, ranked by financial impact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((it, i) => {
              const s = sevMap[it.severity as keyof typeof sevMap];
              const Icon = s.icon;
              return (
                <div key={i} className={cn("rounded-xl border p-4", s.ring)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-7 w-7 rounded-md grid place-items-center bg-card", s.color)}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.tag}</div>
                        <div className="text-sm font-semibold">{it.title}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-border text-muted-foreground">AI · {85 + i * 2}%</span>
                  </div>
                  <p className="text-xs text-foreground/85 mt-3 leading-relaxed">{it.body}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Take action</button>
                    <button className="text-[11px] px-2.5 py-1 rounded-md border border-border hover:bg-secondary">Snooze</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Panel title="Predictive Operational Risks" subtitle="Next 30–90 days">
            <ul className="space-y-3 text-sm">
              {[
                "Pune support escalations projected to grow 9% next month — preemptive FE allocation suggested.",
                "Jaipur cash-flow risk: 72% probability of 4th consecutive loss month without intervention.",
                "Mumbai L1 ticket volume expected to spike with monsoon — increase AI triage capacity.",
                "Hyderabad nearing peak charging utilization — expansion of 2 hubs recommended.",
              ].map((t, i) => (
                <li key={i} className="flex gap-3 p-3 rounded-lg border border-border bg-background/40">
                  <span className="h-6 w-6 grid place-items-center rounded-md bg-warning/15 text-warning shrink-0"><AlertTriangle className="h-3 w-3" /></span>
                  <span className="text-foreground/90 text-xs leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Expansion Opportunity Engine" subtitle="AI-ranked next markets">
            <div className="space-y-2">
              {[
                { c: "Coimbatore", s: 87, why: "High EV adoption, strong infra, southern ops pod synergy" },
                { c: "Indore", s: 81, why: "Tier-2 margin advantage, low ops cost base" },
                { c: "Lucknow", s: 74, why: "Untapped demand, requires charging infra co-investment" },
                { c: "Surat", s: 71, why: "Strong commercial fleet adoption signals" },
              ].map((x) => (
                <div key={x.c} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/40">
                  <div className="h-10 w-10 rounded-md grid place-items-center bg-teal/15 text-teal text-sm font-bold">{x.s}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{x.c}</div>
                    <div className="text-[11px] text-muted-foreground">{x.why}</div>
                  </div>
                  <button className="text-[11px] px-2.5 py-1 rounded-md border border-border hover:bg-secondary">Plan</button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
