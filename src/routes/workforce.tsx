import { createFileRoute } from "@tanstack/react-router";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import { aiVsHuman, automationByWorkflow, humanCosts, aiCosts } from "@/lib/mock/data";
import { Bot, Users, Workflow, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/workforce")({ component: Workforce });

const totalHuman = humanCosts.reduce((s, r) => s + r.monthly, 0);
const totalAi = aiCosts.reduce((s, r) => s + r.monthly, 0);
const totalHeadcount = humanCosts.reduce((s, r) => s + r.count, 0);

function formatPercent(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function formatLakh(value: number) {
  return `₹${Number.isInteger(value) ? value : value.toFixed(1)} L`;
}

function Workforce() {
  return (
    <>
      <TopBar
        title="Workforce & AI Operations"
        subtitle="Human + machine balance across the operations stack"
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="AI Workflow Coverage" value="76%" delta={8.9} icon={Bot} accent="teal" />
          <KpiCard
            label="Total Headcount"
            value={totalHeadcount.toLocaleString("en-IN")}
            delta={4.6}
            icon={Users}
            accent="primary"
          />
          <KpiCard
            label="AI Cost / mo"
            value={formatLakh(totalAi)}
            delta={22.1}
            deltaLabel="scaling up"
            icon={Zap}
            accent="teal"
          />
          <KpiCard
            label="Human Cost / mo"
            value={formatLakh(totalHuman)}
            delta={-3.2}
            deltaLabel="optimization"
            icon={Workflow}
            accent="success"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="AI vs Human Operational Split" subtitle="Workflow execution share">
            <div className="h-72 relative">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={aiVsHuman}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    <Cell fill="var(--chart-2)" />
                    <Cell fill="var(--chart-1)" />
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip
                        contextLabel="Automation split"
                        valueFormatter={(value) => formatPercent(Number(value))}
                      />
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none -mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal">76%</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    AI Automated
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Automation Coverage by Workflow"
            subtitle="AI vs Human · % of volume"
            className="xl:col-span-2"
          >
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={automationByWorkflow} layout="vertical">
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="workflow"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    width={100}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        contextLabel="Workflow coverage"
                        valueFormatter={(value) => formatPercent(Number(value))}
                      />
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="ai" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="human" stackId="a" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Panel
            title="Staffing Hierarchy & Cost"
            subtitle={`281 FTEs · ${formatLakh(totalHuman)} / month`}
          >
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={humanCosts}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="role"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        contextLabel="Monthly cost"
                        valueFormatter={(value) => formatLakh(Number(value))}
                      />
                    }
                  />
                  <Bar dataKey="monthly" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel
            title="AI Subscription Spend"
            subtitle={`6 active systems · ${formatLakh(totalAi)} / month`}
          >
            <div className="space-y-2">
              {aiCosts.map((r) => {
                const pct = (r.monthly / totalAi) * 100;
                return (
                  <div key={r.tool} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{r.tool}</span>
                      <span className="text-muted-foreground">
                        {formatLakh(r.monthly)} · {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 rounded bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal to-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-muted-foreground">{r.coverage}</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        <Panel title="Manpower Optimization Insights" subtitle="AI-suggested reallocations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                t: "L1 Support",
                body:
                  "AI deflection at 88% — reallocate 6 support FTEs to L2 specialization. Net cost saving: ₹4.2 L/mo.",
              },
              {
                t: "Field Engineering",
                body: "West zone undercapacity. Add 6 FEs in Pune/Ahmedabad to clear L2 dispatch backlog.",
              },
              {
                t: "Onboarding Pod",
                body: "AI-assisted KYC reduced TAT 57%. Consolidate 3 onboarding execs into a shared regional pod.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-lg border border-border p-4 bg-background/40">
                <div className="text-[10px] uppercase tracking-wider text-primary">
                  Recommendation
                </div>
                <div className="text-sm font-semibold mt-1">{c.t}</div>
                <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{c.body}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
