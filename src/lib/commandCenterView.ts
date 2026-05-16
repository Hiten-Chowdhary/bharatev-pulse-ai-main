import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Bot,
  Building2,
  Gauge,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";
import {
  automationByWorkflow,
  costBreakdown,
  franchises,
  insights as allInsights,
  revenueTrend,
  alerts as allAlerts,
} from "@/lib/mock/data";
import type { RoleKey } from "@/lib/roleConfig";

export type KpiDef = {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  accent?: "primary" | "teal" | "success" | "warning" | "danger";
  hint?: string;
};

export type AlertDef = {
  level: "danger" | "warning" | "info";
  text: string;
};

export type InsightDef = {
  tag: string;
  title: string;
  body: string;
  severity: "danger" | "warning" | "success" | "info";
};

export type RecommendationDef = {
  title: string;
  body: string;
  impact: string;
  tone: "primary" | "teal" | "success" | "warning" | "danger";
};

export type ChartUnit = "currency" | "percent" | "score" | "count" | "days";

export type ChartSeries = {
  key: string;
  name: string;
  color: string;
  kind: "area" | "line" | "bar";
  dash?: string;
};

export type ChartDef = {
  title: string;
  subtitle: string;
  unit: ChartUnit;
  data: Array<Record<string, string | number>>;
  series: ChartSeries[];
};

export type PieDef = {
  title: string;
  subtitle: string;
  unit: ChartUnit;
  data: Array<{ name: string; value: number; color: string }>;
};

export type CommandCenterView = {
  summary: string;
  alerts: AlertDef[];
  kpis: KpiDef[];
  performanceChart: ChartDef;
  mixChart: PieDef;
  priorityChart: ChartDef;
  insights: InsightDef[];
  recommendations: RecommendationDef[];
  priorityNotes: string[];
};

const chartPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const performanceMonths = revenueTrend.map((row) => row.m);
const priorityMonths = revenueTrend.slice(0, 10).map((row) => row.m);
const typedAlerts = allAlerts as AlertDef[];
const typedInsights = allInsights as InsightDef[];

function formatNumber(value: number) {
  return Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(1))}`;
}

export function formatChartValue(value: number, unit: ChartUnit) {
  switch (unit) {
    case "currency":
      return `Rs.${formatNumber(value)} Cr`;
    case "percent":
      return `${formatNumber(value)}%`;
    case "score":
      return `${formatNumber(value)} / 100`;
    case "count":
      return formatNumber(value);
    case "days":
      return `${formatNumber(value)} days`;
    default:
      return `${value}`;
  }
}

function buildTrend(
  months: string[],
  leftKey: string,
  leftValues: number[],
  rightKey: string,
  rightValues: number[],
  targetKey: string,
  targetValues: number[],
) {
  return months.map((month, index) => ({
    m: month,
    [leftKey]: leftValues[index],
    [rightKey]: rightValues[index],
    [targetKey]: targetValues[index],
  }));
}

function buildPieData(items: Array<{ name: string; value: number }>) {
  return items.map((item, index) => ({
    ...item,
    color: chartPalette[index % chartPalette.length],
  }));
}

function takeUnique<T>(items: T[], limit: number, key: (item: T) => string) {
  const out: T[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
    if (out.length === limit) break;
  }

  return out;
}

function pickInsights(tags: string[]) {
  const matching = typedInsights.filter((item) => tags.includes(item.tag));
  return takeUnique([...matching, ...typedInsights], 4, (item) => item.title);
}

function formatCr(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function roleFocus(roleKey: RoleKey) {
  const map: Record<RoleKey, string> = {
    ceo: "owner-level recovery and expansion gating",
    cofounder: "strategic recovery and rollout quality",
    business_head: "growth conversion and margin discipline",
    regional_ops: "local rollout and partner readiness",
    ops_head: "dispatch capacity and staffing coverage",
    cto: "AI validation and fallback control",
  };

  return map[roleKey];
}

function buildCitySummary(city: (typeof franchises)[number], roleKey: RoleKey) {
  return `City spotlight: ${city.city} is ${city.status.toLowerCase()} with ${city.health}/100 health, ${city.adoption}% adoption, and ${city.infra}% infra readiness. Focus on ${roleFocus(roleKey)}.`;
}

function buildCityKpis(city: (typeof franchises)[number]) {
  return [
    {
      label: `${city.city} Health`,
      value: `${city.health} / 100`,
      delta: city.health - 75,
      icon: Activity,
      accent: "success",
    },
    {
      label: `${city.city} Revenue (TTM)`,
      value: `Rs.${formatCr(city.revenue)} Cr`,
      delta: city.revenue - 8,
      icon: IndianRupee,
      accent: "primary",
    },
    {
      label: `${city.city} Adoption`,
      value: `${city.adoption}%`,
      delta: city.adoption - 75,
      icon: TrendingUp,
      accent: "teal",
    },
    {
      label: `${city.city} Infra Readiness`,
      value: `${city.infra}%`,
      delta: city.infra - 70,
      icon: Building2,
      accent: "primary",
    },
    {
      label: "Operational State",
      value: city.status,
      deltaLabel: city.alert ?? "No critical alert",
      icon: ShieldAlert,
      accent: city.status === "Active" ? "success" : "warning",
    },
  ] satisfies KpiDef[];
}

function buildCityAlerts(city: (typeof franchises)[number], roleKey: RoleKey) {
  const roleNote: Record<RoleKey, string> = {
    ceo: "Keep executive ownership on recovery and launch gating.",
    cofounder: "Track strategy and recovery cadence before new sign-offs.",
    business_head: "Hold new growth until the city is ops-ready.",
    regional_ops: "Stand up a local recovery pod and unblock infra.",
    ops_head: "Assign dispatch and spares ownership immediately.",
    cto: "Review model thresholds before widening automation.",
  };
  const firstLevel: AlertDef["level"] = city.alert
    ? "warning"
    : city.status === "Active"
      ? "info"
      : "warning";
  const thirdLevel: AlertDef["level"] = city.status === "Pipeline" ? "warning" : "info";

  return [
    {
      level: firstLevel,
      text: city.alert
        ? `${city.city}: ${city.alert}`
        : `${city.city}: no critical alert, but rollout cadence should stay under watch.`,
    },
    {
      level: "info",
      text: `${city.city}: health ${city.health}/100, adoption ${city.adoption}%, infra ${city.infra}%.`,
    },
    {
      level: thirdLevel,
      text: roleNote[roleKey],
    },
  ] satisfies AlertDef[];
}

function buildCityInsight(city: (typeof franchises)[number], roleKey: RoleKey): InsightDef {
  const severity: InsightDef["severity"] = city.alert
    ? "warning"
    : city.status === "Active"
      ? "info"
      : "success";
  return {
    tag:
      city.status === "Pipeline"
        ? "Expansion"
        : city.status === "Onboarding"
          ? "Onboarding"
          : "Recovery",
    title: `${city.city} watchpoint`,
    body: `${city.city} is operating at ${city.health}/100 health with ${city.adoption}% adoption and ${city.infra}% infra readiness. ${city.alert ?? "No critical alert."} Focus on ${roleFocus(roleKey)}.`,
    severity: severity as InsightDef["severity"],
  };
}

function buildCityRecommendation(
  city: (typeof franchises)[number],
  roleKey: RoleKey,
): RecommendationDef {
  const cityAction: Record<RoleKey, string> = {
    ceo: "Escalate a named owner for the recovery plan and check the launch gate weekly.",
    cofounder: "Use the city as a rollout quality checkpoint before approving the next market.",
    business_head: "Hold growth commitments until operations and margin are both stable.",
    regional_ops: "Stand up the local pod, close infra gaps, and recheck readiness in seven days.",
    ops_head: "Rebalance staffing, prioritize dispatch, and shorten the blocker queue.",
    cto: "Keep automation constrained to stable workflows until fallback risk is lower.",
  };

  return {
    title: `${city.city} next step`,
    body: `${city.status === "Onboarding" ? "Clear infra blockers and staffing gaps first." : city.status === "Pipeline" ? "Keep this as a controlled launch candidate." : "Protect current momentum while you close the remaining operational gap."} ${cityAction[roleKey]}`,
    impact:
      city.status === "Onboarding"
        ? "Impact: faster activation"
        : city.status === "Pipeline"
          ? "Impact: lower launch risk"
          : "Impact: stable execution",
    tone: city.alert ? "warning" : "primary",
  };
}

function cityOverlay(city: (typeof franchises)[number], roleKey: RoleKey) {
  const cityAlerts = buildCityAlerts(city, roleKey);
  const cityInsights = [buildCityInsight(city, roleKey)];
  const cityRecommendations = [buildCityRecommendation(city, roleKey)];

  return {
    summary: buildCitySummary(city, roleKey),
    alerts: cityAlerts,
    kpis: buildCityKpis(city),
    insights: cityInsights,
    recommendations: cityRecommendations,
  };
}

const roleViews: Record<
  RoleKey,
  Omit<CommandCenterView, "summary" | "alerts" | "kpis" | "insights" | "recommendations"> & {
    summary: string;
    alerts: AlertDef[];
    kpis: KpiDef[];
    insightTags: string[];
    recommendations: RecommendationDef[];
    priorityNotes: string[];
  }
> = {
  ceo: {
    summary:
      "Leadership view: EBITDA is ahead of plan, but Jaipur recovery, west dispatch, and expansion gating still need owner-level attention.",
    alerts: [
      {
        level: "danger",
        text: "Jaipur franchise: 3rd consecutive loss-making month - recovery plan required",
      },
      { level: "warning", text: "Pune support tickets +14% - staffing review recommended" },
      { level: "info", text: "AI onboarding workflow saved 12 days TAT in October" },
    ],
    kpis: [
      {
        label: "Total Revenue (TTM)",
        value: "Rs.124.8 Cr",
        delta: 18.2,
        icon: IndianRupee,
        accent: "primary",
      },
      { label: "EBITDA", value: "Rs.44.1 Cr", delta: 12.4, icon: TrendingUp, accent: "success" },
      {
        label: "Strategic Profitability",
        value: "35.4%",
        delta: 4.8,
        icon: Target,
        accent: "teal",
      },
      {
        label: "Expansion Readiness",
        value: "6 cities",
        delta: 2.1,
        icon: Sparkles,
        accent: "primary",
      },
      {
        label: "Active Franchises",
        value: "9 / 12",
        delta: 12.5,
        icon: Building2,
        accent: "success",
      },
    ],
    performanceChart: {
      title: "Revenue & EBITDA Trajectory",
      subtitle: "Monthly - Rs. Cr",
      unit: "currency",
      data: revenueTrend,
      series: [
        { key: "revenue", name: "Revenue", color: "var(--chart-1)", kind: "area" },
        { key: "ebitda", name: "EBITDA", color: "var(--chart-2)", kind: "area" },
        {
          key: "target",
          name: "Plan",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    mixChart: {
      title: "Cost Composition",
      subtitle: "Operating expense mix - %",
      unit: "percent",
      data: costBreakdown,
    },
    priorityChart: {
      title: "Operational Priorities",
      subtitle: "Risk vs headroom score",
      unit: "score",
      data: buildTrend(
        priorityMonths,
        "risk",
        [66, 65, 64, 63, 62, 60, 59, 58, 57, 56],
        "headroom",
        [72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
        "target",
        [70, 71, 71, 72, 73, 74, 75, 76, 77, 78],
      ),
      series: [
        { key: "risk", name: "Risk", color: "var(--chart-5)", kind: "bar" },
        { key: "headroom", name: "Headroom", color: "var(--chart-2)", kind: "bar" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    insightTags: ["Profitability", "Risk", "Expansion", "Recovery"],
    recommendations: [
      {
        title: "Own Jaipur recovery",
        body: "Keep a weekly owner check-in on staffing and infra so the franchise does not drift further from plan.",
        impact: "Impact: faster recovery",
        tone: "warning",
      },
      {
        title: "Protect Tier-2 margin",
        body: "Shift a small share of budget toward cities with stronger economics and lower fixed cost drag.",
        impact: "Impact: +margin",
        tone: "success",
      },
      {
        title: "Preserve AI savings",
        body: "Carry the AI-enabled cost savings into the next planning cycle instead of spending them away.",
        impact: "Impact: Rs.3.8 Cr annualized",
        tone: "teal",
      },
      {
        title: "Sequence new launches",
        body: "Approve Coimbatore and Indore only after the launch checklist clears infra and staffing gates.",
        impact: "Impact: lower rollout risk",
        tone: "primary",
      },
    ],
    priorityNotes: [
      "Protect Jaipur recovery",
      "Keep west dispatch green",
      "Hold launch gates tight",
    ],
  },
  cofounder: {
    summary:
      "Strategic view: margin is healthy, but the network still depends on clean recovery sequencing and launch discipline.",
    alerts: [
      {
        level: "warning",
        text: "Network dependency remains concentrated in Jaipur and west dispatch",
      },
      {
        level: "warning",
        text: "Expansion timing should stay tied to infra readiness, not only demand",
      },
      { level: "info", text: "AI savings continue to support the strategic plan" },
    ],
    kpis: [
      {
        label: "Total Revenue (TTM)",
        value: "Rs.124.8 Cr",
        delta: 18.2,
        icon: IndianRupee,
        accent: "primary",
      },
      { label: "Net Profit", value: "Rs.28.6 Cr", delta: 9.7, icon: Wallet, accent: "success" },
      {
        label: "Tier-2 Margin Advantage",
        value: "6.4 pp",
        delta: 1.8,
        icon: Target,
        accent: "teal",
      },
      {
        label: "Expansion Coverage",
        value: "3 cities ready",
        delta: 2.4,
        icon: Sparkles,
        accent: "primary",
      },
      {
        label: "Recovery Watchlist",
        value: "2 cities",
        delta: -0.8,
        icon: ShieldAlert,
        accent: "warning",
      },
    ],
    performanceChart: {
      title: "Revenue & EBITDA Trajectory",
      subtitle: "Monthly - Rs. Cr",
      unit: "currency",
      data: revenueTrend,
      series: [
        { key: "revenue", name: "Revenue", color: "var(--chart-1)", kind: "area" },
        { key: "ebitda", name: "EBITDA", color: "var(--chart-2)", kind: "area" },
        {
          key: "target",
          name: "Plan",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    mixChart: {
      title: "Cost Composition",
      subtitle: "Operating expense mix - %",
      unit: "percent",
      data: costBreakdown,
    },
    priorityChart: {
      title: "Operational Priorities",
      subtitle: "Risk vs headroom score",
      unit: "score",
      data: buildTrend(
        priorityMonths,
        "risk",
        [64, 64, 63, 62, 61, 60, 59, 58, 57, 56],
        "headroom",
        [73, 74, 75, 76, 77, 78, 79, 80, 81, 82],
        "target",
        [70, 71, 71, 72, 73, 74, 75, 76, 77, 78],
      ),
      series: [
        { key: "risk", name: "Risk", color: "var(--chart-5)", kind: "bar" },
        { key: "headroom", name: "Headroom", color: "var(--chart-2)", kind: "bar" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    insightTags: ["Profitability", "Expansion", "AI Ops", "Risk"],
    recommendations: [
      {
        title: "Lock strategy gates",
        body: "Keep the next expansion wave tied to readiness scores, not just market demand.",
        impact: "Impact: cleaner rollout",
        tone: "primary",
      },
      {
        title: "Guard margin discipline",
        body: "Use the strongest margin cities as the template for the next launch sequence.",
        impact: "Impact: higher ROI",
        tone: "success",
      },
      {
        title: "Treat Jaipur as a signal",
        body: "Use the recovery path as a pattern for any future underperforming city.",
        impact: "Impact: lower downside",
        tone: "warning",
      },
      {
        title: "Keep AI savings visible",
        body: "Make the annualized AI savings explicit in strategy reviews and board updates.",
        impact: "Impact: clearer economics",
        tone: "teal",
      },
    ],
    priorityNotes: ["Sequence launch gates", "Protect margin discipline", "Keep recovery visible"],
  },
  business_head: {
    summary:
      "Growth view: pipeline quality is improving, but launches still need ops readiness and margin discipline.",
    alerts: [
      {
        level: "warning",
        text: "Pipeline cities are ready on paper but still blocked by ops dependencies",
      },
      { level: "warning", text: "Tier-1 margin is still lagging tier-2 economics" },
      { level: "info", text: "Coimbatore and Indore remain the clearest next launch candidates" },
    ],
    kpis: [
      {
        label: "Onboarding Conversion",
        value: "68%",
        delta: 4.5,
        icon: Building2,
        accent: "primary",
      },
      {
        label: "Average City Revenue",
        value: "Rs.9.8 Cr",
        delta: 3.2,
        icon: IndianRupee,
        accent: "primary",
      },
      { label: "Gross Margin", value: "58.6%", delta: 3.1, icon: TrendingUp, accent: "success" },
      { label: "Ready Cities", value: "3", delta: 1.2, icon: Sparkles, accent: "teal" },
      { label: "Pipeline Strength", value: "74%", delta: 2.4, icon: Target, accent: "primary" },
    ],
    performanceChart: {
      title: "Growth Quality & Margin",
      subtitle: "Pipeline health and margin discipline - %",
      unit: "percent",
      data: buildTrend(
        performanceMonths,
        "pipeline",
        [58, 59, 60, 61, 63, 64, 66, 67, 69, 70, 72, 74],
        "margin",
        [55, 55, 56, 56, 57, 57, 58, 58, 59, 59, 60, 61],
        "target",
        [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67],
      ),
      series: [
        { key: "pipeline", name: "Pipeline", color: "var(--chart-1)", kind: "area" },
        { key: "margin", name: "Margin", color: "var(--chart-2)", kind: "area" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    mixChart: {
      title: "Expansion Pipeline Mix",
      subtitle: "Stage distribution - % of focus",
      unit: "percent",
      data: buildPieData([
        { name: "Ready", value: 34 },
        { name: "Onboarding", value: 18 },
        { name: "Blocked", value: 24 },
        { name: "Recovery", value: 14 },
        { name: "Watchlist", value: 10 },
      ]),
    },
    priorityChart: {
      title: "Operational Priorities",
      subtitle: "Readiness vs conversion score",
      unit: "score",
      data: buildTrend(
        priorityMonths,
        "readiness",
        [58, 59, 60, 62, 63, 65, 66, 68, 70, 72],
        "conversion",
        [64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
        "target",
        [62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
      ),
      series: [
        { key: "readiness", name: "Readiness", color: "var(--chart-1)", kind: "bar" },
        { key: "conversion", name: "Conversion", color: "var(--chart-2)", kind: "bar" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    insightTags: ["Profitability", "Expansion", "AI Ops", "Risk"],
    recommendations: [
      {
        title: "Close ready cities",
        body: "Move Coimbatore and Indore through the final launch checklist before pipeline momentum cools.",
        impact: "Impact: faster conversion",
        tone: "primary",
      },
      {
        title: "Hold blocked launches",
        body: "Keep blocked cities in a holding pattern until infra and staffing are both green.",
        impact: "Impact: lower churn",
        tone: "warning",
      },
      {
        title: "Lift conversion",
        body: "Use the strongest performing markets as the benchmark for the next funnel review.",
        impact: "Impact: +conversion",
        tone: "success",
      },
      {
        title: "Protect margin",
        body: "Keep the margin floor visible in every expansion review.",
        impact: "Impact: better unit economics",
        tone: "teal",
      },
    ],
    priorityNotes: ["Close ready cities", "Hold blocked launches", "Keep margin floor visible"],
  },
  regional_ops: {
    summary:
      "Rollout view: region health is stable, but infra readiness and staffing gaps are limiting the next wave of onboarding.",
    alerts: [
      { level: "warning", text: "Jaipur infra readiness remains delayed" },
      { level: "warning", text: "Pune support staffing is still under capacity" },
      { level: "info", text: "Coimbatore is close to activation threshold" },
    ],
    kpis: [
      { label: "Region Health", value: "81 / 100", delta: -2.1, icon: Activity, accent: "success" },
      { label: "Staffing Gaps", value: "6 FEs", delta: 0, icon: Users, accent: "warning" },
      { label: "Onboarding Cities", value: "2", delta: 1, icon: Building2, accent: "primary" },
      { label: "Infra Readiness", value: "74%", delta: 2.8, icon: Gauge, accent: "teal" },
      {
        label: "Escalations Closed",
        value: "88%",
        delta: 4.1,
        icon: ShieldAlert,
        accent: "success",
      },
    ],
    performanceChart: {
      title: "Regional Readiness Trend",
      subtitle: "Health, infra, and onboarding readiness - %",
      unit: "percent",
      data: buildTrend(
        performanceMonths,
        "health",
        [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85],
        "readiness",
        [58, 59, 61, 62, 64, 66, 67, 69, 71, 72, 74, 75],
        "target",
        [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
      ),
      series: [
        { key: "health", name: "Health", color: "var(--chart-1)", kind: "area" },
        { key: "readiness", name: "Readiness", color: "var(--chart-2)", kind: "area" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    mixChart: {
      title: "Regional Readiness Mix",
      subtitle: "City-stage weighting - %",
      unit: "percent",
      data: buildPieData([
        { name: "Ready", value: 28 },
        { name: "Onboarding", value: 24 },
        { name: "Infra", value: 20 },
        { name: "Regulatory", value: 16 },
        { name: "Recovery", value: 12 },
      ]),
    },
    priorityChart: {
      title: "Operational Priorities",
      subtitle: "Readiness vs blocker score",
      unit: "score",
      data: buildTrend(
        priorityMonths,
        "readiness",
        [60, 61, 62, 64, 65, 67, 68, 70, 72, 74],
        "blockers",
        [42, 41, 40, 39, 38, 37, 36, 35, 34, 33],
        "target",
        [55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
      ),
      series: [
        { key: "readiness", name: "Readiness", color: "var(--chart-1)", kind: "bar" },
        { key: "blockers", name: "Blockers", color: "var(--chart-5)", kind: "bar" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    insightTags: ["Expansion", "Recovery", "Risk", "AI Ops"],
    recommendations: [
      {
        title: "Fix Jaipur infra",
        body: "Push the infra dependency queue first so onboarding can move without repeated delays.",
        impact: "Impact: faster launch",
        tone: "warning",
      },
      {
        title: "Stage Pune staffing",
        body: "Add enough field support to keep Pune from becoming a repeat escalation hotspot.",
        impact: "Impact: lower backlog",
        tone: "primary",
      },
      {
        title: "Advance Coimbatore",
        body: "Treat Coimbatore as the next controlled activation candidate.",
        impact: "Impact: quicker rollout",
        tone: "success",
      },
      {
        title: "Track readiness weekly",
        body: "Use the same readiness checklist across every region to keep comparisons clean.",
        impact: "Impact: better control",
        tone: "teal",
      },
    ],
    priorityNotes: ["Fix Jaipur infra", "Stage Pune staffing", "Track readiness weekly"],
  },
  ops_head: {
    summary:
      "Execution view: support backlog and dispatch SLA are the bottlenecks; onboarding speed is improving but recovery capacity is still thin.",
    alerts: [
      { level: "danger", text: "Support backlog is up 14% across the west cluster" },
      { level: "warning", text: "Field dispatch SLA remains below target in the west" },
      { level: "info", text: "Onboarding TAT is improving after AI-assisted intake" },
    ],
    kpis: [
      { label: "Avg Onboarding TAT", value: "9 days", delta: -57, icon: Zap, accent: "teal" },
      {
        label: "Support Backlog",
        value: "142 tickets",
        delta: 14,
        icon: ShieldAlert,
        accent: "warning",
      },
      { label: "Dispatch SLA", value: "78%", delta: -6, icon: Activity, accent: "warning" },
      { label: "Field Coverage", value: "96%", delta: 3.4, icon: Users, accent: "success" },
      { label: "Recovery Rate", value: "71%", delta: 4.2, icon: Workflow, accent: "primary" },
    ],
    performanceChart: {
      title: "Execution Health",
      subtitle: "Onboarding and dispatch efficiency - %",
      unit: "percent",
      data: buildTrend(
        performanceMonths,
        "onboarding",
        [52, 53, 55, 56, 58, 60, 62, 64, 66, 68, 70, 72],
        "dispatch",
        [61, 62, 63, 64, 65, 67, 68, 70, 71, 73, 74, 76],
        "target",
        [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
      ),
      series: [
        { key: "onboarding", name: "Onboarding", color: "var(--chart-1)", kind: "area" },
        { key: "dispatch", name: "Dispatch", color: "var(--chart-2)", kind: "area" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    mixChart: {
      title: "Operational Load Mix",
      subtitle: "Execution share across teams - %",
      unit: "percent",
      data: buildPieData([
        { name: "Support", value: 30 },
        { name: "Dispatch", value: 24 },
        { name: "Field", value: 18 },
        { name: "Training", value: 16 },
        { name: "Recovery", value: 12 },
      ]),
    },
    priorityChart: {
      title: "Operational Priorities",
      subtitle: "Backlog risk vs recovery score",
      unit: "score",
      data: buildTrend(
        priorityMonths,
        "backlog",
        [74, 72, 71, 69, 68, 66, 65, 63, 62, 60],
        "recovery",
        [58, 60, 61, 63, 65, 66, 68, 69, 71, 72],
        "target",
        [65, 66, 67, 68, 69, 70, 71, 72, 73, 74],
      ),
      series: [
        { key: "backlog", name: "Backlog Risk", color: "var(--chart-5)", kind: "bar" },
        { key: "recovery", name: "Recovery", color: "var(--chart-2)", kind: "bar" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    insightTags: ["Risk", "Recovery", "AI Ops", "Expansion"],
    recommendations: [
      {
        title: "Add west FEs",
        body: "Increase field engineering coverage in Pune and Ahmedabad to clear the dispatch queue.",
        impact: "Impact: lower backlog",
        tone: "warning",
      },
      {
        title: "Compress onboarding",
        body: "Keep the AI-assisted intake path as the default for new franchise onboarding.",
        impact: "Impact: faster TAT",
        tone: "success",
      },
      {
        title: "Trim support queue",
        body: "Use the support dashboard to clear repeated tickets before they roll into recovery work.",
        impact: "Impact: cleaner queue",
        tone: "primary",
      },
      {
        title: "Protect SLA",
        body: "Use the same SLA target for every west cluster handoff so nothing slips between teams.",
        impact: "Impact: stronger execution",
        tone: "teal",
      },
    ],
    priorityNotes: ["Add west FEs", "Trim support queue", "Protect SLA"],
  },
  cto: {
    summary:
      "Platform view: AI uptime is stable, automation coverage is broadening, and model fallback remains the main release risk.",
    alerts: [
      { level: "warning", text: "AI fallback rate is still above the internal threshold" },
      {
        level: "warning",
        text: "Onboarding model confidence needs review before the next rollout",
      },
      { level: "info", text: "Billing automation remains strong at more than 90% coverage" },
    ],
    kpis: [
      { label: "AI Uptime", value: "99.2%", delta: 1.4, icon: Bot, accent: "teal" },
      { label: "Automation Coverage", value: "76%", delta: 8.9, icon: Zap, accent: "primary" },
      { label: "Model Confidence", value: "91%", delta: 3.4, icon: Sparkles, accent: "success" },
      {
        label: "Fallback Rate",
        value: "4.2%",
        delta: -1.1,
        deltaLabel: "down vs last release",
        icon: ShieldAlert,
        accent: "warning",
      },
      { label: "L1 Deflection", value: "88%", delta: 4.6, icon: Workflow, accent: "success" },
    ],
    performanceChart: {
      title: "Platform Uptime & Automation",
      subtitle: "Reliability and release health - %",
      unit: "percent",
      data: buildTrend(
        performanceMonths,
        "uptime",
        [95.6, 95.8, 96.1, 96.4, 96.7, 97.1, 97.4, 97.8, 98.1, 98.4, 98.7, 99.2],
        "automation",
        [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
        "target",
        [90, 90, 91, 91, 92, 92, 93, 93, 94, 94, 95, 95],
      ),
      series: [
        { key: "uptime", name: "Uptime", color: "var(--chart-1)", kind: "area" },
        { key: "automation", name: "Automation", color: "var(--chart-2)", kind: "area" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    mixChart: {
      title: "Automation Coverage by Workflow",
      subtitle: "AI share weighting across live workflows",
      unit: "percent",
      data: automationByWorkflow.map((row, index) => ({
        name: row.workflow,
        value: row.ai,
        color: chartPalette[index % chartPalette.length],
      })),
    },
    priorityChart: {
      title: "Operational Priorities",
      subtitle: "Risk and confidence score",
      unit: "score",
      data: buildTrend(
        priorityMonths,
        "risk",
        [48, 47, 46, 45, 44, 43, 42, 41, 40, 39],
        "confidence",
        [82, 83, 84, 85, 86, 87, 88, 89, 90, 91],
        "target",
        [80, 80, 81, 81, 82, 82, 83, 83, 84, 84],
      ),
      series: [
        { key: "risk", name: "Risk", color: "var(--chart-5)", kind: "bar" },
        { key: "confidence", name: "Confidence", color: "var(--chart-2)", kind: "bar" },
        {
          key: "target",
          name: "Target",
          color: "var(--muted-foreground)",
          kind: "line",
          dash: "4 4",
        },
      ],
    },
    insightTags: ["AI Ops", "Risk", "Recovery", "Expansion"],
    recommendations: [
      {
        title: "Tighten fallback thresholds",
        body: "Raise the review bar for any workflow that drops below the confidence gate.",
        impact: "Impact: fewer regressions",
        tone: "warning",
      },
      {
        title: "Expand safe automation",
        body: "Promote the highest-confidence workflows into the default automation set.",
        impact: "Impact: higher coverage",
        tone: "success",
      },
      {
        title: "Instrument releases",
        body: "Keep release monitoring visible so the team can spot drift before customers do.",
        impact: "Impact: better control",
        tone: "primary",
      },
      {
        title: "Protect onboarding model",
        body: "Keep onboarding validation in the protected path until the fallback rate cools further.",
        impact: "Impact: safer rollout",
        tone: "teal",
      },
    ],
    priorityNotes: ["Tighten fallback gates", "Expand safe automation", "Instrument releases"],
  },
};

export function buildCommandCenterView(roleKey: RoleKey, searchQuery: string): CommandCenterView {
  const roleView = roleViews[roleKey];
  const q = searchQuery.toLowerCase().trim();
  const cityMatch = q ? franchises.find((city) => city.city.toLowerCase().includes(q)) : undefined;
  const cityView = cityMatch ? cityOverlay(cityMatch, roleKey) : undefined;

  const filteredAlerts = q
    ? typedAlerts.filter((alert) => alert.text.toLowerCase().includes(q))
    : [];
  const filteredInsights = q
    ? typedInsights.filter((item) => (item.title + item.body + item.tag).toLowerCase().includes(q))
    : [];

  const roleInsights = pickInsights(roleView.insightTags);

  const alerts = cityView
    ? cityView.alerts
    : filteredAlerts.length
      ? takeUnique([...filteredAlerts, ...roleView.alerts], 3, (item) => item.text)
      : roleView.alerts;

  const insights = cityView
    ? takeUnique(
        [cityView.insights[0], ...filteredInsights, ...roleInsights],
        4,
        (item) => item.title,
      )
    : filteredInsights.length
      ? takeUnique([...filteredInsights, ...roleInsights], 4, (item) => item.title)
      : roleInsights;

  const recommendations = cityView
    ? takeUnique(
        [cityView.recommendations[0], ...roleView.recommendations],
        4,
        (item) => item.title,
      )
    : roleView.recommendations;

  return {
    summary: cityMatch ? buildCitySummary(cityMatch, roleKey) : roleView.summary,
    alerts,
    kpis: cityMatch ? buildCityKpis(cityMatch) : roleView.kpis,
    performanceChart: roleView.performanceChart,
    mixChart: roleView.mixChart,
    priorityChart: roleView.priorityChart,
    insights,
    recommendations,
    priorityNotes: roleView.priorityNotes,
  };
}
