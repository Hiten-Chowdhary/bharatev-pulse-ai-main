import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import {
  revenueTrend,
  alerts,
  insights,
  costBreakdown,
  burnRunway,
  failureSignals,
  financialIntelligence,
  franchiseOpsCounts,
} from "@/lib/mock/data";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { commandSectionVisible } from "@/lib/roleConfig";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Bot,
  Building2,
  Flame,
  Gauge,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/")({ component: CommandCenter });

const tooltipStyle = { background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 20%)", borderRadius: 8, fontSize: 12 };

function CommandCenter() {
  const { roleKey } = useDashboardRole();
  const vis = (s: Parameters<typeof commandSectionVisible>[1]) => commandSectionVisible(roleKey, s);
  const counts = franchiseOpsCounts();
  const showRev = vis("charts_revenue");
  const showCost = vis("cost_mix");
  const chartSpan = showRev && showCost ? "xl:col-span-2" : "xl:col-span-3";

  return (
    <>
      <TopBar title="Command Center" subtitle="One place for revenue, risk, and what humans must own this week" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex-1 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                a.level === "danger"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : a.level === "warning"
                    ? "border-warning/40 bg-warning/10 text-warning"
                    : "border-primary/30 bg-primary/10 text-primary"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="text-foreground/90">{a.text}</span>
            </div>
          ))}
        </div>

        {vis("kpis_all") && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <KpiCard label="Total Revenue (TTM)" value="₹96.2 Cr" delta={9.4} deltaLabel="vs last year" icon={IndianRupee} accent="primary" />
            <KpiCard label="EBITDA" value="₹34.8 Cr" delta={6.2} deltaLabel="margin 36.2%" icon={TrendingUp} accent="teal" />
            <KpiCard label="Net Profit" value="₹19.4 Cr" delta={4.1} deltaLabel="margin 20.2%" icon={Wallet} accent="primary" />
            <KpiCard label="Monthly Burn" value="₹4.2 Cr" delta={-2.8} deltaLabel="vs glide plan (adverse)" icon={Flame} accent="warning" />
            <KpiCard label="Payback Period" value="16.4 mo" delta={-1.2} deltaLabel="slip vs plan (months)" icon={Banknote} accent="warning" />
            <KpiCard
              label="Active Franchises"
              value={`${counts.active} / 12`}
              deltaLabel={`${counts.onboarding} onboarding · ${counts.pipeline} pipeline`}
              icon={Building2}
              accent="primary"
            />
            <KpiCard label="AI / Assisted Volume" value="58%" delta={-3.2} deltaLabel="human fallback rising" icon={Bot} accent="warning" />
            <KpiCard label="Operational Efficiency" value="74 / 100" delta={-1.4} deltaLabel="execution drag" icon={Gauge} accent="warning" />
            <KpiCard label="Franchise Health (avg)" value="68 / 100" deltaLabel="blended · west cluster drags" icon={Activity} accent="warning" />
            <KpiCard label="Avg Onboarding TAT" value="16 days" deltaLabel="+4d vs 12d internal target" icon={Zap} accent="warning" />
          </div>
        )}

        {vis("kpis_exec") && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
            <KpiCard label="Revenue (TTM)" value="₹96.2 Cr" delta={9.4} deltaLabel="vs last year" icon={IndianRupee} accent="primary" />
            <KpiCard label="EBITDA" value="₹34.8 Cr" delta={6.2} deltaLabel="margin 36.2%" icon={TrendingUp} accent="teal" />
            <KpiCard label="Active cities" value={`${counts.active}`} deltaLabel="live revenue sites" icon={Building2} accent="primary" />
            <KpiCard label="Onboarding pipeline" value={`${counts.onboarding}`} deltaLabel={`${counts.delayedOnboarding} behind SLA`} icon={Zap} accent="warning" />
            <KpiCard label="Pipeline cities" value={`${counts.pipeline}`} deltaLabel="expansion funnel" icon={TrendingUp} accent="teal" />
            <KpiCard label="Network health (avg)" value="68 / 100" deltaLabel="weighted across live sites" icon={Activity} accent="warning" />
            <KpiCard label="AI assisted volume" value="58%" delta={-3.2} deltaLabel="more human checks in west" icon={Bot} accent="warning" />
            <KpiCard label="Open bottlenecks" value="6" deltaLabel="dispatch · OEM · compliance" icon={Flame} accent="warning" />
          </div>
        )}

        {vis("kpis_ops") && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
            <KpiCard label="Live revenue cities" value={`${counts.active}`} deltaLabel="sites billing" icon={Building2} accent="primary" />
            <KpiCard label="Onboarding late" value={`${counts.delayedOnboarding}`} deltaLabel=">10d vs internal SLA" icon={Zap} accent="warning" />
            <KpiCard label="Open tickets (>48h)" value="312" deltaLabel="network unresolved est." icon={Activity} accent="warning" />
            <KpiCard label="Dispatch delay (west)" value="4.2 d" deltaLabel="avg FE arrival vs SLA" icon={Gauge} accent="warning" />
            <KpiCard label="Jaipur risk score" value="88" deltaLabel="charging + staffing" icon={Flame} accent="danger" />
            <KpiCard label="Deploy bottlenecks" value="6" deltaLabel="parts · OEM · software" icon={AlertTriangle} accent="warning" />
          </div>
        )}

        {vis("kpis_cto") && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
            <KpiCard label="AI / assisted volume" value="58%" delta={-3.2} deltaLabel="rolling resolved volume" icon={Bot} accent="warning" />
            <KpiCard label="Manual override" value="18%" deltaLabel="onboarding + KYC" icon={Gauge} accent="warning" />
            <KpiCard label="Low-confidence flows" value="21%" deltaLabel="30d rolling" icon={Sparkles} accent="warning" />
            <KpiCard label="AI escalation L1→L2" value="12.4%" deltaLabel="needs model + policy fix" icon={TrendingUp} accent="warning" />
            <KpiCard label="Deploy rollbacks (90d)" value="4" deltaLabel="onboarding stack" icon={Flame} accent="warning" />
            <KpiCard label="Unresolved support" value="312" deltaLabel="breaching 48h SLA" icon={Activity} accent="danger" />
          </div>
        )}

        {(showRev || showCost) && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {showRev && (
              <Panel
                title="Revenue & EBITDA"
                subtitle="₹ Cr / month · May dip = real-world infra + dispatch noise"
                className={chartSpan}
                action={<div className="text-[10px] text-muted-foreground">FY26 · Mock</div>}
              >
                <div className="h-72">
                  <ResponsiveContainer>
                    <AreaChart data={revenueTrend}>
                      <defs>
                        <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ebG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#revG)" name="Revenue" />
                      <Area type="monotone" dataKey="ebitda" stroke="var(--chart-2)" strokeWidth={2} fill="url(#ebG)" name="EBITDA" />
                      <Line type="monotone" dataKey="target" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            )}
            {showCost && (
              <Panel title="Where the money goes" subtitle="OpEx mix · % (human-heavy when things break)">
                <div className="h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                        {costBreakdown.map((c, i) => (
                          <Cell key={i} fill={c.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            )}
          </div>
        )}

        {(vis("burn_runway") || vis("financial_linkage")) && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {vis("burn_runway") && (
              <Panel title="Cash burn vs runway" subtitle="₹ Cr / month · uneven quarter">
                <div className="h-56">
                  <ResponsiveContainer>
                    <BarChart data={burnRunway}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="burn" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="runway" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            )}
            {vis("financial_linkage") && (
              <Panel
                title="Money linked to operations"
                subtitle="Leakage, infra spikes, AI savings — not just accounting"
                className={vis("burn_runway") ? "xl:col-span-2" : "xl:col-span-3"}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cost leakage (60d)</div>
                    <div className="text-lg font-semibold mt-1 text-warning">₹{financialIntelligence.costLeakageLakh}L</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{financialIntelligence.costLeakageNote}</div>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Infra maintenance spike</div>
                    <div className="text-lg font-semibold mt-1">₹{financialIntelligence.infraMaintenanceSpikeLakh}L</div>
                    <div className="text-[11px] text-muted-foreground mt-1">vendor pass-through · Mumbai/Pune</div>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI tooling ROI (YTD)</div>
                    <div className="text-lg font-semibold mt-1 text-teal">{financialIntelligence.aiToolingRoiMultiple}×</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{financialIntelligence.aiVsManpowerDeltaNote}</div>
                  </div>
                  <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Escalation cost impact</div>
                    <div className="text-lg font-semibold mt-1 text-destructive/90">₹{financialIntelligence.escalationCostImpactLakh}L</div>
                    <div className="text-[11px] text-muted-foreground mt-1">L2 labor + FE overtime est.</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground border-t border-border pt-3">
                  <span>
                    Staffing utilization: <span className="text-foreground font-medium">{financialIntelligence.staffingUtilizationPct}%</span>
                  </span>
                  <span>
                    Margin volatility: <span className="text-foreground font-medium">{financialIntelligence.franchiseMarginVolatilityNote}</span>
                  </span>
                  <span>
                    High-burn zones: <span className="text-foreground font-medium">{financialIntelligence.highBurnZones}</span>
                  </span>
                </div>
              </Panel>
            )}
          </div>
        )}

        {vis("failure_signals") && (
          <Panel title="What is breaking (signals)" subtitle="Plain numbers your team can challenge — prototype feed">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {failureSignals.map((f) => (
                <div key={f.label} className="rounded-lg border border-border/80 bg-background/40 px-2.5 py-2">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">{f.label}</div>
                  <div className="text-base font-semibold tabular-nums mt-1">
                    {f.value}
                    {f.suffix && <span className="text-xs font-normal text-muted-foreground">{f.suffix}</span>}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{f.detail}</div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {vis("insights_feed") && (
          <Panel title="What leadership should do next" subtitle="Short list · full detail lives under Operational intelligence">
            <div className="space-y-2">
              {insights.slice(0, 4).map((it, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-lg border border-border/70 hover:border-primary/40 bg-background/40 transition"
                >
                  <div
                    className={`h-7 w-7 rounded-md grid place-items-center shrink-0 ${
                      it.severity === "danger"
                        ? "bg-destructive/15 text-destructive"
                        : it.severity === "warning"
                          ? "bg-warning/15 text-warning"
                          : it.severity === "success"
                            ? "bg-success/15 text-success"
                            : "bg-primary/15 text-primary"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.tag}</span>
                      <span className="font-medium">{it.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">AI confidence {it.confidence}%</span>
                    </div>
                    <p className="text-xs text-foreground/90 mt-1 leading-snug">{it.shortRecommendation}</p>
                    <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground list-disc pl-4">
                      {it.actions.slice(0, 2).map((ac, j) => (
                        <li key={j} className="leading-snug">
                          {ac}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}
