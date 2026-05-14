import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { revenueTrend, humanCosts, aiCosts, costBreakdown, franchises } from "@/lib/mock/data";
import { Banknote, IndianRupee, PiggyBank, Receipt, TrendingUp, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/financial")({ component: Financial });

const tooltipStyle = { background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 20%)", borderRadius: 8, fontSize: 12 };
const totalHuman = humanCosts.reduce((s, r) => s + r.monthly, 0);
const totalAi = aiCosts.reduce((s, r) => s + r.monthly, 0);

function Financial() {
  return (
    <>
      <TopBar title="Financial Intelligence" subtitle="P&L · ROI · Cash Flow · Sensitivity" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <KpiCard label="Revenue (TTM)" value="₹124.8 Cr" delta={18.2} icon={IndianRupee} accent="primary" />
          <KpiCard label="Gross Margin" value="58.6%" delta={3.1} icon={TrendingUp} accent="success" />
          <KpiCard label="EBITDA" value="₹44.1 Cr" delta={12.4} icon={Wallet} accent="teal" />
          <KpiCard label="Net Profit" value="₹28.6 Cr" delta={9.7} icon={PiggyBank} accent="success" />
          <KpiCard label="Payback (Franchise)" value="14.2 mo" delta={-6.8} icon={Banknote} accent="primary" />
          <KpiCard label="Total OpEx / mo" value={`₹${(totalHuman + totalAi).toFixed(1)}L`} delta={-2.4} icon={Receipt} accent="warning" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="Monthly P&L Projection" subtitle="₹ Cr · Revenue vs EBITDA vs Plan" className="xl:col-span-2">
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

          <Panel title="Cost Breakdown" subtitle="OpEx mix · %">
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                    {costBreakdown.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Panel title="Human Staffing Costs" subtitle={`₹${totalHuman.toFixed(1)} L / month · 281 FTEs`}>
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

          <Panel title="AI Subscriptions & Tooling" subtitle={`₹${totalAi.toFixed(1)} L / month · 6 systems`}>
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
          <Panel title="AI vs Human · Operating Cost" subtitle="Annualized · ₹ Cr" className="xl:col-span-2">
            <div className="h-60">
              <ResponsiveContainer>
                <BarChart data={[
                  { c: "Q1", Human: 2.4, AI: 0.7 },
                  { c: "Q2", Human: 2.6, AI: 0.9 },
                  { c: "Q3", Human: 2.7, AI: 1.1 },
                  { c: "Q4", Human: 2.8, AI: 1.4 },
                ]}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Human" stackId="a" fill="var(--chart-1)" radius={[0,0,0,0]} />
                  <Bar dataKey="AI" stackId="a" fill="var(--chart-2)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Operational Savings via AI" subtitle="₹ Cr saved · Annual">
            <div className="space-y-3 mt-1">
              {[
                { k: "Support deflection", v: "₹1.6 Cr" },
                { k: "Onboarding TAT cut", v: "₹0.9 Cr" },
                { k: "Billing automation", v: "₹0.7 Cr" },
                { k: "Field dispatch routing", v: "₹0.6 Cr" },
              ].map((x) => (
                <div key={x.k} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{x.k}</span>
                  <span className="font-semibold text-success">{x.v}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-medium">Total annual savings</span>
                <span className="text-base font-bold text-teal">₹3.8 Cr</span>
              </div>
              <div className="text-[11px] text-muted-foreground">AI ROI multiple: <span className="text-foreground font-medium">4.6×</span></div>
            </div>
          </Panel>
        </div>

        <Panel title="Franchise Profitability" subtitle="Active locations · ₹ Cr revenue (TTM)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">City</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Revenue (TTM)</th>
                  <th className="text-right py-2 font-medium">Health</th>
                  <th className="text-right py-2 font-medium">Adoption</th>
                  <th className="text-right py-2 font-medium">Infra</th>
                </tr>
              </thead>
              <tbody>
                {franchises.filter(f => f.status === "Active").map((f) => (
                  <tr key={f.city} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-2.5 font-medium">{f.city} <span className="text-muted-foreground text-xs">· {f.state}</span></td>
                    <td><span className="text-[10px] px-1.5 py-0.5 rounded-md bg-success/15 text-success">{f.status}</span></td>
                    <td className="text-right tabular-nums">₹{f.revenue} Cr</td>
                    <td className="text-right tabular-nums">{f.health}</td>
                    <td className="text-right tabular-nums">{f.adoption}</td>
                    <td className="text-right tabular-nums">{f.infra}</td>
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
