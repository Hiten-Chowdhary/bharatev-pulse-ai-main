import { createFileRoute } from "@tanstack/react-router";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCard, Panel } from "@/components/dashboard/Kpi";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import { buildCommandCenterView, formatChartValue } from "@/lib/commandCenterView";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/")({ component: CommandCenter });

const alertClasses = {
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
  warning: "border-warning/40 bg-warning/10 text-warning",
  info: "border-primary/30 bg-primary/10 text-primary",
} as const;

const insightClasses = {
  danger: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
  success: "bg-success/15 text-success",
  info: "bg-primary/15 text-primary",
} as const;

const recommendationClasses = {
  primary: "border-primary/30 bg-primary/5 text-primary",
  teal: "border-teal/30 bg-teal/5 text-teal",
  success: "border-success/30 bg-success/5 text-success",
  warning: "border-warning/30 bg-warning/5 text-warning",
  danger: "border-destructive/30 bg-destructive/5 text-destructive",
} as const;

type CommandCenterView = ReturnType<typeof buildCommandCenterView>;

function renderAreaChart(chart: CommandCenterView["performanceChart"], prefix: string) {
  const areaSeries = chart.series.filter((series) => series.kind !== "line");

  return (
    <ResponsiveContainer>
      <AreaChart data={chart.data}>
        <defs>
          {areaSeries.map((series, index) => (
            <linearGradient
              key={series.key}
              id={`${prefix}-area-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={series.color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={series.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="m"
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(value) => formatChartValue(value, chart.unit)} />}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
        {chart.series.map((series) => {
          if (series.kind === "line") {
            return (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                strokeDasharray={series.dash}
                strokeWidth={2}
                dot={false}
              />
            );
          }

          const gradientIndex = areaSeries.findIndex((candidate) => candidate.key === series.key);
          return (
            <Area
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.name}
              stroke={series.color}
              strokeWidth={2}
              fill={`url(#${prefix}-area-${gradientIndex})`}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function renderPriorityChart(chart: CommandCenterView["priorityChart"]) {
  return (
    <ResponsiveContainer>
      <ComposedChart data={chart.data}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="m"
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(value) => formatChartValue(value, chart.unit)} />}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
        {chart.series.map((series) => {
          if (series.kind === "line") {
            return (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                strokeDasharray={series.dash}
                strokeWidth={2}
                dot={false}
              />
            );
          }

          return (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.name}
              fill={series.color}
              radius={[6, 6, 0, 0]}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function renderMixChart(chart: CommandCenterView["mixChart"]) {
  const total = chart.data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chart.data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
        >
          {chart.data.map((item) => (
            <Cell key={item.name} fill={item.color} />
          ))}
        </Pie>
        <Tooltip
          content={
            <ChartTooltip
              total={total}
              showPercent={false}
              valueFormatter={(value) => formatChartValue(value, chart.unit)}
            />
          }
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

function CommandCenter() {
  const { roleKey, searchQuery } = useDashboardRole();
  const view = buildCommandCenterView(roleKey, searchQuery);
  const q = searchQuery.toLowerCase().trim();

  return (
    <>
      <TopBar title="Command Center" subtitle={view.summary} />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          {view.alerts.map((alert, index) => (
            <div
              key={`${alert.text}-${index}`}
              className={cn(
                "flex-1 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
                alertClasses[alert.level],
              )}
            >
              <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-current shrink-0" />
              <span className="text-foreground/90">{alert.text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {view.kpis.map((kpi, index) => {
            const highlight = q && `${kpi.label} ${kpi.value}`.toLowerCase().includes(q);
            return (
              <div
                key={`${kpi.label}-${index}`}
                className={highlight ? "ring-1 ring-primary/40 rounded-xl" : ""}
              >
                <KpiCard
                  label={kpi.label}
                  value={kpi.value}
                  delta={kpi.delta}
                  deltaLabel={kpi.deltaLabel}
                  icon={kpi.icon}
                  accent={kpi.accent}
                  hint={kpi.hint}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel
            title={view.performanceChart.title}
            subtitle={view.performanceChart.subtitle}
            className="xl:col-span-2"
            action={<div className="text-[10px] text-muted-foreground">Live role view</div>}
          >
            <div className="h-72">{renderAreaChart(view.performanceChart, "performance")}</div>
          </Panel>

          <Panel title={view.mixChart.title} subtitle={view.mixChart.subtitle}>
            <div className="h-72">{renderMixChart(view.mixChart)}</div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title={view.priorityChart.title} subtitle={view.priorityChart.subtitle}>
            <div className="h-56">{renderPriorityChart(view.priorityChart)}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {view.priorityNotes.map((note) => (
                <span
                  key={note}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-background/40 text-muted-foreground"
                >
                  {note}
                </span>
              ))}
            </div>
          </Panel>

          <Panel
            title="AI Insights & Recommendations"
            subtitle="Role-specific guidance and next actions"
            className="xl:col-span-2"
          >
            <div className="space-y-2">
              {view.insights.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/70 hover:border-primary/40 bg-background/40 transition"
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-md grid place-items-center shrink-0",
                      insightClasses[item.severity],
                    )}
                  >
                    <span className="text-[10px] font-semibold">AI</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.tag}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border/60 pt-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Recommendations
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {view.recommendations.map((item) => (
                  <div
                    key={item.title}
                    className={cn("rounded-xl border p-4", recommendationClasses[item.tone])}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {item.body}
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-border/60 bg-background/60 whitespace-nowrap">
                        {item.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
