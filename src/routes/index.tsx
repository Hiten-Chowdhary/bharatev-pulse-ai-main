import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { revenueTrend, alerts, insights, costBreakdown, burnRunway } from "@/lib/mock/data";
import { Activity, Banknote, Bot, Building2, Flame, Gauge, IndianRupee, ShieldAlert, Sparkles, TrendingUp, Wallet, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/")({ component: CommandCenter });

const tooltipStyle = { background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 20%)", borderRadius: 8, fontSize: 12 };

function CommandCenter() {
  return (
    <>
      <TopBar title="Command Center" subtitle="Operational Intelligence for EV Expansion · FY26 Q3" />
      <div className="p-6 space-y-6">
        {/* Alerts */}
        <div className="flex flex-col md:flex-row gap-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex-1 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
              a.level === "danger" ? "border-destructive/40 bg-destructive/10 text-destructive" :
              a.level === "warning" ? "border-warning/40 bg-warning/10 text-warning" :
              "border-primary/30 bg-primary/10 text-primary"}`}>
              <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="text-foreground/90">{a.text}</span>
            </div>
          ))}
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <KpiCard label="Total Revenue (TTM)" value="₹124.8 Cr" delta={18.2} deltaLabel="vs last year" icon={IndianRupee} accent="primary" />
          <KpiCard label="EBITDA" value="₹44.1 Cr" delta={12.4} deltaLabel="margin 35.3%" icon={TrendingUp} accent="success" />
          <KpiCard label="Net Profit" value="₹28.6 Cr" delta={9.7} deltaLabel="margin 22.9%" icon={Wallet} accent="teal" />
          <KpiCard label="Monthly Burn" value="₹3.9 Cr" delta={-4.1} deltaLabel="optimization on" icon={Flame} accent="warning" />
          <KpiCard label="Payback Period" value="14.2 mo" delta={-6.8} deltaLabel="faster than plan" icon={Banknote} accent="primary" />
          <KpiCard label="Active Franchises" value="9 / 12" delta={12.5} deltaLabel="3 onboarding" icon={Building2} accent="primary" />
          <KpiCard label="AI Automation" value="76%" delta={8.9} deltaLabel="workflow coverage" icon={Bot} accent="teal" />
          <KpiCard label="Operational Efficiency" value="91 / 100" delta={4.2} deltaLabel="exec score" icon={Gauge} accent="success" />
          <KpiCard label="Franchise Health" value="83 / 100" delta={2.6} deltaLabel="network avg" icon={Activity} accent="success" />
          <KpiCard label="Avg Onboarding TAT" value="9 days" delta={-57} deltaLabel="AI assisted" icon={Zap} accent="teal" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="Revenue & EBITDA Trajectory" subtitle="Monthly · ₹ Cr" className="xl:col-span-2"
            action={<div className="text-[10px] text-muted-foreground">FY26 · Live</div>}>
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

          <Panel title="Cost Composition" subtitle="Operational expense mix · %">
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {costBreakdown.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="Burn vs Runway" subtitle="₹ Cr · months">
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={burnRunway}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="burn" fill="var(--chart-5)" radius={[6,6,0,0]} />
                  <Bar dataKey="runway" fill="var(--chart-2)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="AI-Generated Executive Insights" subtitle="Last refreshed 2 min ago" className="xl:col-span-2">
            <div className="space-y-2">
              {insights.slice(0, 4).map((it, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/70 hover:border-primary/40 bg-background/40 transition">
                  <div className={`h-7 w-7 rounded-md grid place-items-center shrink-0 ${
                    it.severity === "danger" ? "bg-destructive/15 text-destructive" :
                    it.severity === "warning" ? "bg-warning/15 text-warning" :
                    it.severity === "success" ? "bg-success/15 text-success" :
                    "bg-primary/15 text-primary"}`}>
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.tag}</span>
                      <span className="font-medium">{it.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{it.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
