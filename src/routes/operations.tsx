import { createFileRoute } from "@tanstack/react-router";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { IndiaOpsMap } from "@/components/dashboard/IndiaOpsMap";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { franchises } from "@/lib/mock/data";
import { AlertTriangle, Building2, MapPin, Plug, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/operations")({ component: Operations });

function statusClass(status: string) {
  if (status === "Active") return "bg-success/15 text-success border-success/30";
  if (status === "Onboarding") return "bg-sky-400/15 text-sky-200 border-sky-400/30";
  return "bg-muted/30 text-muted-foreground border-border";
}

function bar(value: number, color: string) {
  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Operations() {
  const { searchQuery } = useDashboardRole();
  const highlightCity = searchQuery.trim() || undefined;

  const totalHealth = franchises.reduce((sum, city) => sum + city.health, 0);
  const averageHealth = Math.round(totalHealth / franchises.length);
  const activeCount = franchises.filter((f) => f.status === "Active").length;
  const onboardingCount = franchises.filter((f) => f.status === "Onboarding").length;
  const pipelineCount = franchises.filter((f) => f.status === "Pipeline").length;
  const alertCount = franchises.filter((f) => Boolean(f.alert)).length;

  return (
    <>
      <TopBar
        title="Franchise Operations Grid"
        subtitle="Map-led rollout intelligence, city readiness, and launch risk"
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
          <KpiCard
            label="Active Franchises"
            value={String(activeCount)}
            delta={12.5}
            deltaLabel="vs last quarter"
            icon={Building2}
            accent="primary"
          />
          <KpiCard
            label="Onboarding"
            value={String(onboardingCount)}
            deltaLabel="cities in activation"
            icon={MapPin}
            accent="teal"
          />
          <KpiCard
            label="Pipeline Cities"
            value={String(pipelineCount)}
            deltaLabel="scored & ranked"
            icon={TrendingUp}
            accent="success"
          />
          <KpiCard
            label="Avg Health"
            value={`${averageHealth} / 100`}
            delta={6.2}
            icon={TrendingUp}
            accent="teal"
          />
          <KpiCard
            label="Open Bottlenecks"
            value={String(alertCount)}
            deltaLabel="city alerts live"
            icon={AlertTriangle}
            accent="warning"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel
            title="India Franchise Operations Map"
            subtitle="Hover any city node for revenue, EBITDA, staffing, and AI coverage"
            className="xl:col-span-2"
          >
            <div className="h-[640px]">
              <IndiaOpsMap franchises={franchises} highlightCity={highlightCity} />
            </div>
          </Panel>

          <Panel title="Regional Signals" subtitle="Live exceptions and activation cues">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Active
                  </div>
                  <div className="mt-1 text-lg font-semibold">{activeCount}</div>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Onboarding
                  </div>
                  <div className="mt-1 text-lg font-semibold">{onboardingCount}</div>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Pipeline
                  </div>
                  <div className="mt-1 text-lg font-semibold">{pipelineCount}</div>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Alerts
                  </div>
                  <div className="mt-1 text-lg font-semibold">{alertCount}</div>
                </div>
              </div>

              {franchises
                .filter((f) => f.alert)
                .map((f) => (
                  <div
                    key={f.city}
                    className="rounded-xl border border-warning/30 bg-warning/5 p-3"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                      <span className="font-semibold">{f.city}</span>
                      <span className="text-muted-foreground">- {f.state}</span>
                    </div>
                    <div className="mt-1 text-xs text-foreground/90">{f.alert}</div>
                  </div>
                ))}

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-xs">
                  <Plug className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">Coimbatore activation</span>
                </div>
                <div className="mt-1 text-xs text-foreground/90">
                  Charging infra readiness is crossing threshold. Treat this as a controlled launch
                  candidate.
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          title="Network Readiness Matrix"
          subtitle="City-level operational intelligence without collapsing the map into cards"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium">City</th>
                  <th className="py-2 text-left font-medium">Status</th>
                  <th className="py-2 text-right font-medium">Revenue</th>
                  <th className="py-2 text-right font-medium">Health</th>
                  <th className="py-2 text-right font-medium">Adoption</th>
                  <th className="py-2 text-right font-medium">Infra</th>
                  <th className="py-2 text-left font-medium">Alert</th>
                </tr>
              </thead>
              <tbody>
                {franchises.map((city) => (
                  <tr
                    key={city.city}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-2.5 font-medium">
                      {city.city}{" "}
                      <span className="text-muted-foreground text-xs">- {city.state}</span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-md border",
                          statusClass(city.status),
                        )}
                      >
                        {city.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">Rs.{city.revenue} Cr</td>
                    <td className="py-2.5 text-right tabular-nums">{city.health}</td>
                    <td className="py-2.5 text-right tabular-nums">{city.adoption}</td>
                    <td className="py-2.5 text-right tabular-nums">{city.infra}</td>
                    <td className="py-2.5 text-left text-xs text-muted-foreground">
                      {city.alert ?? "Tracking to plan"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
