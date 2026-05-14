import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { IndiaOpsMap } from "@/components/dashboard/IndiaOpsMap";
import { franchises, franchiseOpsCounts } from "@/lib/mock/data";
import { AlertTriangle, Building2, MapPin, Plug, TrendingUp, Server, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/operations")({
  validateSearch: (raw: Record<string, unknown>) => ({
    highlight: typeof raw.highlight === "string" ? raw.highlight : "",
  }),
  component: Operations,
});

function statusClass(s: string, slip: number) {
  if (s === "Active") return "bg-success/15 text-success border-success/30";
  if (s === "Onboarding") {
    if (slip >= 10) return "bg-destructive/10 text-destructive border-destructive/35";
    return "bg-warning/15 text-warning border-warning/30";
  }
  return "bg-muted text-muted-foreground border-border";
}

function statusLabel(s: string, slip: number) {
  if (s === "Onboarding" && slip >= 10) return "Onboarding · delayed";
  return s;
}

function depClass(d: string) {
  if (d === "stable") return "text-success bg-success/10 border-success/25";
  if (d === "fragile") return "text-warning bg-warning/10 border-warning/25";
  return "text-destructive bg-destructive/10 border-destructive/30";
}

function satClass(m: string) {
  if (m === "normal") return "text-muted-foreground border-border";
  if (m === "elevated") return "text-warning border-warning/30";
  return "text-destructive border-destructive/25";
}

function bar(v: number, color: string) {
  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(100, v)}%` }} />
    </div>
  );
}

function Operations() {
  const { highlight } = Route.useSearch();
  const counts = franchiseOpsCounts();
  const backs = franchises.filter((f) => f.status !== "Pipeline").map((f) => f.supportBacklog);
  const maxBacklog = backs.length ? Math.max(...backs) : 0;
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlight) return;
    const el = highlightRef.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlight]);

  return (
    <>
      <TopBar
        title="Franchise operations"
        subtitle={`${counts.active} live cities · ${counts.onboarding} onboarding (${counts.delayedOnboarding} behind SLA) · ${counts.pipeline} pipeline · map = day-to-day control room`}
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
          <KpiCard label="Live franchise cities" value={String(counts.active)} deltaLabel="earning revenue" icon={Building2} accent="primary" />
          <KpiCard label="Onboarding in flight" value={String(counts.onboarding)} deltaLabel={`${counts.delayedOnboarding} behind internal SLA`} icon={MapPin} accent="warning" />
          <KpiCard label="Pipeline cities" value={String(counts.pipeline)} deltaLabel="waiting on deps / capex" icon={TrendingUp} accent="teal" />
          <KpiCard label="Largest support queue" value={`${maxBacklog} tix`} deltaLabel="open >48h SLA" icon={AlertTriangle} accent="warning" />
          <KpiCard label="Open bottlenecks" value="6" deltaLabel="dispatch, OEM, compliance" icon={AlertTriangle} accent="warning" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-2">
            <Panel title="India network map" subtitle="Green = healthy · amber = watch · red = critical · blue = onboarding · grey = pipeline">
              <IndiaOpsMap franchises={franchises} highlightCity={highlight || undefined} />
            </Panel>
          </div>

          <Panel title="Live alerts" subtitle="What needs humans today">
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {franchises
                .filter((f) => f.alert || f.dependencyAlert || f.deployBottleneck)
                .map((f) => (
                  <div
                    key={f.city}
                    className={cn(
                      "rounded-lg border p-3",
                      f.riskScore >= 70 ? "border-destructive/35 bg-destructive/5" : "border-warning/30 bg-warning/5",
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <AlertTriangle className={cn("h-3.5 w-3.5 shrink-0", f.riskScore >= 70 ? "text-destructive" : "text-warning")} />
                      <span className="font-semibold">{f.city}</span>
                      <span className="text-muted-foreground">· {f.state}</span>
                      <span className="text-[10px] ml-auto tabular-nums text-muted-foreground">risk {f.riskScore}</span>
                    </div>
                    {f.alert && <div className="text-xs text-foreground/90 mt-1">{f.alert}</div>}
                    {f.dependencyAlert && (
                      <div className="text-[11px] text-muted-foreground mt-1.5 flex gap-1.5 items-start">
                        <Server className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{f.dependencyAlert}</span>
                      </div>
                    )}
                    {f.deployBottleneck && (
                      <div className="text-[10px] text-warning mt-1.5 font-medium">Deploy bottleneck flagged</div>
                    )}
                  </div>
                ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-xs">
                  <Plug className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">Coimbatore</span>
                </div>
                <div className="text-xs text-foreground/90 mt-1">
                  Good demand signal, but market is crowded — needs a clear fleet anchor before signing.
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="City detail list" subtitle="Same data as map — use for copy/paste and weekly reviews">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {franchises.map((f) => (
              <div
                key={f.city}
                ref={highlight && f.city.toLowerCase() === highlight.toLowerCase() ? highlightRef : undefined}
                className={cn(
                  "rounded-lg border bg-background/40 p-4 transition",
                  highlight && f.city.toLowerCase() === highlight.toLowerCase()
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{f.city}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {f.state} · {f.region}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md border", statusClass(f.status, f.onboardingSlipDays))}>
                      {statusLabel(f.status, f.onboardingSlipDays)}
                    </span>
                    {f.onboardingSlipDays > 0 && (
                      <span className="text-[10px] text-muted-foreground tabular-nums">+{f.onboardingSlipDays}d vs SLA</span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded border", depClass(f.chargingDependency))}>Power: {f.chargingDependency}</span>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded border", satClass(f.marketSaturation))}>Demand heat: {f.marketSaturation}</span>
                  {f.regionalUnderperform && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-warning/40 text-warning">Below network avg</span>
                  )}
                  {f.deployBottleneck && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-destructive/35 text-destructive/90">Deploy blocked</span>
                  )}
                  {f.marginVolatility === "high" && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-warning/35 text-warning">Margin swings</span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <div>Risk</div>
                  <div>Health</div>
                  <div>Adopt</div>
                  <div>Infra</div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-1 text-sm font-semibold tabular-nums">
                  <div className={f.riskScore >= 65 ? "text-warning" : ""}>{f.status === "Pipeline" ? "—" : f.riskScore}</div>
                  <div>{f.status === "Pipeline" ? "—" : f.health}</div>
                  <div>{f.adoption}</div>
                  <div>{f.infra}</div>
                </div>
                <div className="mt-2 space-y-1.5">
                  {f.status !== "Pipeline" && (
                    <>
                      {bar(f.riskScore, "bg-warning")}
                      {bar(f.health, "bg-primary")}
                      {bar(f.adoption, "bg-teal")}
                      {bar(f.infra, f.infra < 50 ? "bg-destructive/70" : "bg-success")}
                    </>
                  )}
                </div>

                {f.status !== "Pipeline" && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">AI unsure</span>
                      <div className="text-foreground font-medium tabular-nums">{f.aiLowConfidencePct}%</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">Human takeover</span>
                      <div className="text-foreground font-medium tabular-nums">{f.humanFallbackPct}%</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">Support queue</span>
                      <div className="text-foreground font-medium tabular-nums">{f.supportBacklog}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">Reg. delay</span>
                      <div className="text-foreground font-medium tabular-nums">{f.regulatoryDelayWeeks ? `${f.regulatoryDelayWeeks}w` : "—"}</div>
                    </div>
                  </div>
                )}

                {f.staffingGap && (
                  <div className="mt-2 text-[11px] text-warning flex items-start gap-1.5">
                    <Users className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{f.staffingGap}</span>
                  </div>
                )}
                {f.alert && (
                  <div className="mt-2 text-[11px] text-warning flex items-start gap-1.5">
                    <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                    {f.alert}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
