import { useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { Panel, KpiCard } from "@/components/dashboard/Kpi";
import { expansionCandidates, insights, predictiveRisks, type ExecutiveInsight, type InsightCategory } from "@/lib/mock/data";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { AlertTriangle, Brain, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/insights")({
  validateSearch: (raw: Record<string, unknown>) => ({
    insight: typeof raw.insight === "string" ? raw.insight : "",
  }),
  component: Insights,
});

const GROUP_ORDER: { category: InsightCategory; label: string; hint: string }[] = [
  { category: "operational_risk", label: "Operational risks", hint: "Sites, power, compliance, recovery" },
  { category: "staffing_alerts", label: "Staffing & capacity", hint: "People you need on the ground" },
  { category: "ai_recommendation", label: "AI recommendations", hint: "Human-in-the-loop automation" },
  { category: "expansion", label: "Expansion opportunities", hint: "Next cities — with friction called out" },
  { category: "financial_risk", label: "Financial risks", hint: "Margin and cash tied to execution" },
];

function impactBadge(level: ExecutiveInsight["impactLevel"]) {
  const map: Record<ExecutiveInsight["impactLevel"], string> = {
    critical: "bg-destructive/15 text-destructive border-destructive/35",
    high: "bg-warning/15 text-warning border-warning/35",
    medium: "bg-primary/10 text-primary border-primary/30",
    low: "bg-muted text-muted-foreground border-border",
  };
  return map[level];
}

function escBadge(s: ExecutiveInsight["escalationStatus"]) {
  const labels: Record<ExecutiveInsight["escalationStatus"], string> = {
    open: "Open",
    owned: "Owner assigned",
    watch: "Watching",
    clearing: "Clearing",
  };
  return labels[s];
}

function InsightCard({ it, idx }: { it: ExecutiveInsight; idx: number }) {
  return (
    <div
      data-insight-card={idx}
      className="rounded-xl border border-border/80 bg-card/50 p-4 flex flex-col gap-3 hover:border-primary/35 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.tag}</div>
          <h3 className="text-sm font-semibold leading-snug mt-0.5">{it.title}</h3>
        </div>
        <span className={cn("text-[10px] px-2 py-0.5 rounded-md border shrink-0", impactBadge(it.impactLevel))}>{it.impactLevel}</span>
      </div>

      <p className="text-[13px] text-foreground/90 leading-snug">{it.shortRecommendation}</p>

      <div className="flex flex-wrap gap-2 text-[10px]">
        {it.affectedCities.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {it.affectedCities.join(", ")}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 tabular-nums">
          AI confidence {it.confidence}%
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5">
          Escalation: {escBadge(it.escalationStatus)}
        </span>
      </div>

      <details className="group text-[11px] text-muted-foreground">
        <summary className="cursor-pointer text-primary/90 hover:text-primary list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden">
          <span className="border-b border-dotted border-primary/40">Why we flagged this</span>
        </summary>
        <p className="mt-2 leading-relaxed text-muted-foreground/95">{it.body}</p>
        <ul className="mt-2 space-y-1 list-disc pl-4 text-foreground/85">
          {it.actions.map((a, j) => (
            <li key={j}>{a}</li>
          ))}
        </ul>
      </details>

      <div className="flex gap-2 pt-1">
        <button type="button" className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">
          Assign owner
        </button>
        <button type="button" className="text-[11px] px-2.5 py-1 rounded-md border border-border hover:bg-secondary">
          Snooze 7d
        </button>
      </div>
    </div>
  );
}

function Insights() {
  const { insight: insightParam } = Route.useSearch();
  const { roleKey } = useDashboardRole();

  const sortedInsights = useMemo(() => {
    if (roleKey !== "cto") return insights;
    return [...insights].sort((a, b) => {
      const pri = (x: ExecutiveInsight) => (x.category === "ai_recommendation" ? 0 : x.category === "operational_risk" ? 1 : 2);
      return pri(a) - pri(b);
    });
  }, [roleKey]);

  useEffect(() => {
    if (!insightParam) return;
    const i = Number.parseInt(insightParam, 10);
    if (Number.isNaN(i)) return;
    const el = document.querySelector(`[data-insight-card="${i}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [insightParam]);

  const riskCount = sortedInsights.filter((x) => x.category === "operational_risk").length;
  const expCount = expansionCandidates.length;

  return (
    <>
      <TopBar title="Operational intelligence" subtitle="Grouped for exec review · expand a card only when you need the story" />
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Signals in view" value={String(sortedInsights.length)} deltaLabel="curated from mock data" icon={Brain} accent="primary" />
          <KpiCard label="Operational risks" value={String(riskCount)} deltaLabel="needs owners" icon={AlertTriangle} accent="warning" />
          <KpiCard label="Expansion gates" value={String(expCount)} deltaLabel="cities scored" icon={TrendingUp} accent="teal" />
          <KpiCard label="Avg AI confidence" value="72%" delta={-4.2} deltaLabel="after policy change" icon={Sparkles} accent="warning" />
        </div>

        {GROUP_ORDER.map(({ category, label, hint }) => {
          if ((roleKey === "ops_head" || roleKey === "regional_ops") && category === "financial_risk") return null;
          const items = sortedInsights.filter((it) => it.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 border-b border-border pb-2">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">{items.length} item(s)</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((it) => (
                  <InsightCard key={`${category}-${it.title}`} it={it} idx={insights.indexOf(it)} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Panel title="30–90 day forecasts" subtitle="Heuristic, not a crystal ball">
            <ul className="space-y-2">
              {predictiveRisks.map((t, i) => (
                <li key={i} className="flex gap-3 p-3 rounded-lg border border-border bg-background/40">
                  <span className="h-7 w-7 grid place-items-center rounded-md bg-warning/15 text-warning shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground/90 text-xs leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Next cities (with friction)" subtitle="Same list as search “expansion” — honest gating">
            <div className="space-y-2">
              {expansionCandidates.map((x) => (
                <div key={x.c} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/40">
                  <div className="h-10 w-10 rounded-md grid place-items-center bg-teal/15 text-teal text-sm font-bold tabular-nums">{x.s}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{x.c}</div>
                    <div className="text-[11px] text-muted-foreground leading-snug">{x.why}</div>
                  </div>
                  <button type="button" className="text-[11px] px-2.5 py-1 rounded-md border border-border hover:bg-secondary shrink-0">
                    Gate review
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
