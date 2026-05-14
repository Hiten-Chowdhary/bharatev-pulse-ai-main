import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { franchises } from "@/lib/mock/data";
import { AlertTriangle, Building2, MapPin, Plug, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/operations")({ component: Operations });

function statusClass(s: string) {
  if (s === "Active") return "bg-success/15 text-success border-success/30";
  if (s === "Onboarding") return "bg-warning/15 text-warning border-warning/30";
  return "bg-muted text-muted-foreground border-border";
}
function bar(v: number, color: string) {
  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${v}%` }} />
    </div>
  );
}

function Operations() {
  return (
    <>
      <TopBar title="Franchise Operations Grid" subtitle="9 active · 3 onboarding · 12-city expansion pipeline" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
          <KpiCard label="Active Franchises" value="9" delta={12.5} deltaLabel="vs last quarter" icon={Building2} accent="primary" />
          <KpiCard label="Onboarding" value="3" deltaLabel="2 ready by Q1" icon={MapPin} accent="teal" />
          <KpiCard label="Pipeline Cities" value="14" deltaLabel="scored & ranked" icon={TrendingUp} accent="success" />
          <KpiCard label="Avg EV Adoption" value="76 / 100" delta={6.2} icon={TrendingUp} accent="teal" />
          <KpiCard label="Open Bottlenecks" value="4" deltaLabel="2 critical" icon={AlertTriangle} accent="warning" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="India Expansion Map" subtitle="Operational footprint · readiness heat" className="xl:col-span-2">
            <div className="relative h-[420px] rounded-lg border border-border bg-background/40 grid-bg overflow-hidden">
              <svg viewBox="0 0 400 480" className="absolute inset-0 w-full h-full opacity-20">
                <path d="M120 60 L260 50 L320 110 L300 200 L320 300 L240 420 L180 440 L150 380 L80 320 L60 200 L80 120 Z"
                      fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              {franchises.map((f, i) => {
                const pos = [
                  { x: 22, y: 78 }, { x: 30, y: 65 }, { x: 42, y: 70 }, { x: 48, y: 82 },
                  { x: 54, y: 28 }, { x: 22, y: 65 }, { x: 28, y: 50 }, { x: 38, y: 38 },
                  { x: 36, y: 88 }, { x: 50, y: 50 }, { x: 60, y: 38 }, { x: 46, y: 88 },
                ][i % 12];
                const color = f.status === "Active" ? "bg-success" : f.status === "Onboarding" ? "bg-warning" : "bg-muted-foreground";
                const size = f.status === "Active" ? "h-3 w-3" : "h-2.5 w-2.5";
                return (
                  <div key={f.city} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                    <div className={cn("relative -translate-x-1/2 -translate-y-1/2", size, "rounded-full", color)}>
                      {f.status === "Active" && <div className="absolute inset-0 rounded-full bg-success/40 animate-ping" />}
                    </div>
                    <div className="absolute left-3 top-1.5 -translate-y-1/2 text-[10px] text-foreground/80 whitespace-nowrap">
                      {f.city}
                    </div>
                  </div>
                );
              })}
              <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-muted-foreground bg-card/80 backdrop-blur px-3 py-1.5 rounded-md border border-border">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Active</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Onboarding</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Pipeline</span>
              </div>
            </div>
          </Panel>

          <Panel title="Operational Alerts" subtitle="Live across network">
            <div className="space-y-2">
              {franchises.filter(f => f.alert).map((f) => (
                <div key={f.city} className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                    <span className="font-semibold">{f.city}</span>
                    <span className="text-muted-foreground">· {f.state}</span>
                  </div>
                  <div className="text-xs text-foreground/90 mt-1">{f.alert}</div>
                </div>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-xs"><Plug className="h-3.5 w-3.5 text-primary" /><span className="font-semibold">Coimbatore</span></div>
                <div className="text-xs text-foreground/90 mt-1">Charging infra readiness reached activation threshold. Q1 launch recommended.</div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Franchise Performance Grid" subtitle="City-level operational visibility">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {franchises.map((f) => (
              <div key={f.city} className="rounded-lg border border-border bg-background/40 p-4 hover:border-primary/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{f.city}</div>
                    <div className="text-[11px] text-muted-foreground">{f.state}</div>
                  </div>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md border", statusClass(f.status))}>{f.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <div>Health</div><div>Adoption</div><div>Infra</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1 text-sm font-semibold tabular-nums">
                  <div>{f.health || "—"}</div><div>{f.adoption}</div><div>{f.infra}</div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {bar(f.health, "bg-primary")}
                  {bar(f.adoption, "bg-teal")}
                  {bar(f.infra, "bg-success")}
                </div>
                {f.alert && <div className="mt-3 text-[11px] text-warning flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 mt-0.5" />{f.alert}</div>}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
