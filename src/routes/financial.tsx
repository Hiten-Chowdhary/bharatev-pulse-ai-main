import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { revenueTrend, humanCosts, aiCosts, costBreakdown, franchises, financialIntelligence } from "@/lib/mock/data";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { financialSectionVisible } from "@/lib/roleConfig";
import { Banknote, IndianRupee, PiggyBank, Receipt, TrendingUp, Wallet, AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/financial")({ component: Financial });

const tooltipStyle = { background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 20%)", borderRadius: 8, fontSize: 12 };
const totalHuman = humanCosts.reduce((s, r) => s + r.monthly, 0);
const totalAi = aiCosts.reduce((s, r) => s + r.monthly, 0);

function Financial() {
  const { roleKey } = useDashboardRole();
  const vis = (s: Parameters<typeof financialSectionVisible>[1]) => financialSectionVisible(roleKey, s);

  return (
    <>
      <TopBar title="Financial Intelligence" subtitle="PnL · ROI · costs tied to how sites actually run (mock data)" />
      <div className="p-6 space-y-6">
        {vis("investor_kpis") && (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <KpiCard label="Revenue (TTM)" value="₹96.2 Cr" delta={9.4} icon={IndianRupee} accent="primary" />
            <KpiCard label="Gross Margin" value="54.2%" delta={-1.2} deltaLabel="mix + infra noise" icon={TrendingUp} accent="warning" />
            <KpiCard label="EBITDA" value="₹34.8 Cr" delta={6.2} icon={Wallet} accent="teal" />
            <KpiCard label="Net Profit" value="₹19.4 Cr" delta={4.1} icon={PiggyBank} accent="primary" />
            <KpiCard label="Payback (Franchise)" value="16.4 mo" delta={1.2} deltaLabel="slipped vs plan" icon={Banknote} accent="warning" />
            <KpiCard label="Total OpEx / mo" value={`₹${(totalHuman + totalAi).toFixed(1)}L`} delta={-3.6} deltaLabel="escalations + vendor" icon={Receipt} accent="warning" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            label="Operational cost leakage"
            value={`₹${financialIntelligence.costLeakageLakh}L`}
            deltaLabel="60d · esc. + pass-through"
            icon={AlertTriangle}
            accent="warning"
          />
          <KpiCard
            label="Infra maintenance spike"
            value={`₹${financialIntelligence.infraMaintenanceSpikeLakh}L`}
            deltaLabel="quarter · vendor surge"
            icon={AlertTriangle}
            accent="warning"
          />
          <KpiCard label="AI tooling ROI (YTD)" value={`${financialIntelligence.aiToolingRoiMultiple}×`} deltaLabel="after fallback labor" icon={TrendingUp} accent="teal" />
          <KpiCard
            label="Staffing utilization"
            value={`${financialIntelligence.staffingUtilizationPct}%`}
            deltaLabel="west cluster >100% FE"
            icon={Wallet}
            accent="warning"
          />
        </div>

        {vis("pl_chart") && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Panel title="Monthly PnL projection" subtitle="₹ Cr · revenue vs EBITDA vs plan · volatile" className="xl:col-span-2">
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} dot={false} name="Revenue" />
                    <Line dataKey="ebitda" stroke="var(--chart-2)" strokeWidth={2} dot={false} name="EBITDA" />
                    <Line dataKey="target" stroke="var(--chart-4)" strokeDasharray="4 4" dot={false} name="Plan" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Cost Breakdown" subtitle="OpEx mix · % · human-heavy under load">
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
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
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {vis("staffing_detail") && (
            <Panel title="Human Staffing Costs" subtitle={`₹${totalHuman.toFixed(1)} L / month · ${humanCosts.reduce((s, r) => s + r.count, 0)} FTEs`}>
              <div className="space-y-2">
                {humanCosts.map((r) => (
                  <div key={r.role} className="flex items-center justify-between border border-border/60 rounded-lg px-3 py-2 bg-background/40">
                    <div>
                      <div className="text-sm font-medium">{r.role}</div>
                      <div className="text-[11px] text-muted-foreground">{r.count} headcount</div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">₹{r.monthly} L</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel
            title="AI Subscriptions & Tooling"
            subtitle={`₹${totalAi.toFixed(1)} L / month · 6 systems`}
            className={vis("staffing_detail") ? "" : "xl:col-span-2"}
          >
            <div className="space-y-2">
              {aiCosts.map((r) => (
                <div key={r.tool} className="flex items-center justify-between border border-border/60 rounded-lg px-3 py-2 bg-background/40">
                  <div>
                    <div className="text-sm font-medium">{r.tool}</div>
                    <div className="text-[11px] text-muted-foreground">{r.coverage}</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums">₹{r.monthly} L</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="AI vs Human · Operating Cost" subtitle="Annualized · ₹ Cr · stacked" className="xl:col-span-2">
            <div className="h-60">
              <ResponsiveContainer>
                <BarChart
                  data={[
                    { c: "Q1", Human: 2.5, AI: 0.72 },
                    { c: "Q2", Human: 2.68, AI: 0.88 },
                    { c: "Q3", Human: 2.82, AI: 1.05 },
                    { c: "Q4", Human: 2.9, AI: 1.22 },
                  ]}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Human" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="AI" stackId="a" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Operational savings vs drag" subtitle="Linked to execution · mock">
            <div className="space-y-3 mt-1">
              <div className="rounded-lg border border-teal/25 bg-teal/5 p-3 text-sm">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI operational savings (YTD)</div>
                <div className="text-xl font-bold text-teal mt-1">₹{financialIntelligence.aiOperationalSavingsCr} Cr</div>
                <div className="text-[11px] text-muted-foreground mt-1">{financialIntelligence.aiVsManpowerDeltaNote}</div>
              </div>
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Escalation cost impact (est.)</div>
                <div className="text-xl font-bold text-destructive/90 mt-1">₹{financialIntelligence.escalationCostImpactLakh} L</div>
                <div className="text-[11px] text-muted-foreground mt-1">L2 + FE overtime + vendor surge</div>
              </div>
              <div className="text-[11px] text-muted-foreground border-t border-border pt-3 space-y-1">
                <div>
                  Franchise margin volatility: <span className="text-foreground font-medium">{financialIntelligence.franchiseMarginVolatilityNote}</span>
                </div>
                <div>
                  High-burn operational zones: <span className="text-foreground font-medium">{financialIntelligence.highBurnZones}</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {vis("franchise_table") && (
          <Panel title="Franchise profitability & volatility" subtitle="Active locations · TTM revenue · execution-linked risk">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">City</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Revenue (TTM)</th>
                  <th className="text-right py-2 font-medium">Risk</th>
                  <th className="text-right py-2 font-medium">Health</th>
                  <th className="text-left py-2 font-medium">Margin vol.</th>
                  <th className="text-right py-2 font-medium">Human fallback</th>
                </tr>
              </thead>
              <tbody>
                {franchises
                  .filter((f) => f.status === "Active")
                  .map((f) => (
                    <tr key={f.city} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-2.5 font-medium">
                        {f.city} <span className="text-muted-foreground text-xs">· {f.state}</span>
                      </td>
                      <td>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-success/15 text-success">{f.status}</span>
                      </td>
                      <td className="text-right tabular-nums">₹{f.revenue} Cr</td>
                      <td className={cn("text-right tabular-nums", f.riskScore >= 60 ? "text-warning font-medium" : "")}>{f.riskScore}</td>
                      <td className="text-right tabular-nums">{f.health}</td>
                      <td className="text-left capitalize text-xs text-muted-foreground">{f.marginVolatility}</td>
                      <td className="text-right tabular-nums">{f.humanFallbackPct}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
        )}
      </div>
    </>
  );
}
