import { useId, useMemo, useState } from "react";
import { franchises } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

type Franchise = (typeof franchises)[number];
type NodeTone = "healthy" | "attention" | "critical" | "onboarding";
type MetricTone = "neutral" | "positive" | "negative" | "critical" | "watch";

type FranchiseNode = Franchise & {
  mapX: number;
  mapY: number;
  cluster: "North" | "West" | "Central" | "South";
  tone: NodeTone;
  franchiseName: string;
  profitLoss: number;
  ebitda: number;
  operationalHealth: number;
  staffingAvailability: string;
  onboardingStatus: string;
  aiAutomation: number;
  riskStatus: "Low" | "Watch" | "Attention" | "Critical";
  summary: string;
};

type NodeMeta = Omit<FranchiseNode, keyof Franchise>;

const nodeMeta: Record<string, NodeMeta> = {
  Bengaluru: {
    mapX: 52,
    mapY: 76,
    cluster: "South",
    tone: "healthy",
    franchiseName: "Bengaluru Franchise",
    profitLoss: 4.1,
    ebitda: 25,
    operationalHealth: 92,
    staffingAvailability: "Stable",
    onboardingStatus: "Live",
    aiAutomation: 84,
    riskStatus: "Low",
    summary: "Core hub with strong automation and the healthiest execution profile.",
  },
  Pune: {
    mapX: 37,
    mapY: 57,
    cluster: "West",
    tone: "attention",
    franchiseName: "Pune Franchise",
    profitLoss: 1.1,
    ebitda: 14,
    operationalHealth: 71,
    staffingAvailability: "Tight",
    onboardingStatus: "Live",
    aiAutomation: 70,
    riskStatus: "Attention",
    summary: "Support capacity is tight and needs more field coverage before the next ramp.",
  },
  Hyderabad: {
    mapX: 56,
    mapY: 59,
    cluster: "South",
    tone: "healthy",
    franchiseName: "Hyderabad Franchise",
    profitLoss: 2.9,
    ebitda: 20,
    operationalHealth: 88,
    staffingAvailability: "Stable",
    onboardingStatus: "Live",
    aiAutomation: 77,
    riskStatus: "Low",
    summary: "Balanced operating profile with strong AI-assisted support handling.",
  },
  Chennai: {
    mapX: 66,
    mapY: 79,
    cluster: "South",
    tone: "healthy",
    franchiseName: "Chennai Franchise",
    profitLoss: 2.3,
    ebitda: 19,
    operationalHealth: 85,
    staffingAvailability: "Stable",
    onboardingStatus: "Live",
    aiAutomation: 74,
    riskStatus: "Low",
    summary: "Stable growth pocket with consistent field execution and high service quality.",
  },
  "Delhi NCR": {
    mapX: 67,
    mapY: 18,
    cluster: "North",
    tone: "healthy",
    franchiseName: "Delhi NCR Franchise",
    profitLoss: 4.2,
    ebitda: 24,
    operationalHealth: 90,
    staffingAvailability: "Stable",
    onboardingStatus: "Live",
    aiAutomation: 81,
    riskStatus: "Low",
    summary: "Large revenue base with strong profitability and low operational drag.",
  },
  Mumbai: {
    mapX: 31,
    mapY: 59,
    cluster: "West",
    tone: "healthy",
    franchiseName: "Mumbai Franchise",
    profitLoss: 3.8,
    ebitda: 22,
    operationalHealth: 87,
    staffingAvailability: "Stable",
    onboardingStatus: "Live",
    aiAutomation: 76,
    riskStatus: "Low",
    summary: "High-value market with strong margin quality and steady throughput.",
  },
  Ahmedabad: {
    mapX: 38,
    mapY: 42,
    cluster: "West",
    tone: "attention",
    franchiseName: "Ahmedabad Franchise",
    profitLoss: 1.0,
    ebitda: 16,
    operationalHealth: 78,
    staffingAvailability: "Balanced",
    onboardingStatus: "Live",
    aiAutomation: 68,
    riskStatus: "Attention",
    summary: "Healthy demand, but service coverage and dispatch latency need attention.",
  },
  Jaipur: {
    mapX: 57,
    mapY: 30,
    cluster: "North",
    tone: "onboarding",
    franchiseName: "Jaipur Franchise",
    profitLoss: -0.4,
    ebitda: 8,
    operationalHealth: 54,
    staffingAvailability: "Constrained",
    onboardingStatus: "Delayed",
    aiAutomation: 58,
    riskStatus: "Critical",
    summary: "Onboarding is delayed and support capacity remains below readiness threshold.",
  },
  Kochi: {
    mapX: 47,
    mapY: 91,
    cluster: "South",
    tone: "onboarding",
    franchiseName: "Kochi Franchise",
    profitLoss: 0.5,
    ebitda: 12,
    operationalHealth: 61,
    staffingAvailability: "Scaling",
    onboardingStatus: "Onboarding",
    aiAutomation: 66,
    riskStatus: "Watch",
    summary: "Early-stage activation with acceptable demand but still maturing on staffing.",
  },
  Indore: {
    mapX: 49,
    mapY: 46,
    cluster: "Central",
    tone: "onboarding",
    franchiseName: "Indore Franchise",
    profitLoss: 0.2,
    ebitda: 10,
    operationalHealth: 49,
    staffingAvailability: "Shared pod",
    onboardingStatus: "Pre-launch",
    aiAutomation: 61,
    riskStatus: "Watch",
    summary: "Activation candidate with a good automation baseline but moderate readiness.",
  },
  Lucknow: {
    mapX: 74,
    mapY: 28,
    cluster: "North",
    tone: "onboarding",
    franchiseName: "Lucknow Franchise",
    profitLoss: -0.2,
    ebitda: 9,
    operationalHealth: 52,
    staffingAvailability: "Planned",
    onboardingStatus: "Pre-launch",
    aiAutomation: 56,
    riskStatus: "Watch",
    summary: "Pipeline city with good demand shape, but staffing is not yet locked.",
  },
  Coimbatore: {
    mapX: 55,
    mapY: 85,
    cluster: "South",
    tone: "onboarding",
    franchiseName: "Coimbatore Franchise",
    profitLoss: 0.4,
    ebitda: 13,
    operationalHealth: 68,
    staffingAvailability: "Shared pod",
    onboardingStatus: "Pre-launch",
    aiAutomation: 63,
    riskStatus: "Watch",
    summary: "Near-activation market with solid infra readiness and decent AI coverage.",
  },
};

const nodeToneStyles: Record<NodeTone, string> = {
  healthy: "bg-emerald-400 ring-emerald-300/30",
  attention: "bg-amber-400 ring-amber-300/30",
  critical: "bg-rose-500 ring-rose-300/30",
  onboarding: "bg-sky-400 ring-sky-300/30",
};

const riskStyles: Record<FranchiseNode["riskStatus"], string> = {
  Low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Watch: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  Attention: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Critical: "border-rose-400/30 bg-rose-400/10 text-rose-200",
};

const statusStyles: Record<string, string> = {
  Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Onboarding: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  Pipeline: "border-muted-foreground/30 bg-muted/20 text-muted-foreground",
};

const clusters = [
  { label: "North", x: 70, y: 21, rx: 14, ry: 11 },
  { label: "West", x: 36, y: 53, rx: 17, ry: 16 },
  { label: "Central", x: 51, y: 46, rx: 11, ry: 10 },
  { label: "South", x: 55, y: 79, rx: 18, ry: 16 },
];

const links: Array<[string, string]> = [
  ["Delhi NCR", "Jaipur"],
  ["Delhi NCR", "Lucknow"],
  ["Mumbai", "Pune"],
  ["Pune", "Ahmedabad"],
  ["Hyderabad", "Bengaluru"],
  ["Bengaluru", "Chennai"],
  ["Chennai", "Coimbatore"],
  ["Kochi", "Bengaluru"],
  ["Indore", "Ahmedabad"],
];

const INDIA_OUTLINE =
  "M 43 7 C 49 8 54 11 59 15 L 63 20 L 67 25 L 71 29 L 75 33 L 79 36 L 81 40 L 80 44 L 77 47 L 75 51 L 75 56 L 77 61 L 76 66 L 73 71 L 69 76 L 66 81 L 63 86 L 59 90 L 55 94 L 51 97 L 47 95 L 44 91 L 41 86 L 38 81 L 34 76 L 30 71 L 28 66 L 27 61 L 28 55 L 27 50 L 25 46 L 23 42 L 23 37 L 24 33 L 27 29 L 31 25 L 34 20 L 37 15 L 40 11 Z";

const NORTHEAST_OUTLINE = "M 75 33 L 81 32 L 86 35 L 89 39 L 88 43 L 84 43 L 80 41 L 77 37 Z";

function formatCr(value: number) {
  const formatted = Number.isInteger(Math.abs(value))
    ? `${Math.abs(value)}`
    : Math.abs(value).toFixed(1);
  return `${value < 0 ? "-" : ""}Rs.${formatted} Cr`;
}

function formatPercent(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function pctBar(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`;
}

function computeCurve(from: FranchiseNode, to: FranchiseNode) {
  const midX = (from.mapX + to.mapX) / 2;
  const lift = Math.abs(from.mapY - to.mapY) > 12 ? 8 : 4;
  return `M ${from.mapX} ${from.mapY} C ${midX} ${Math.min(from.mapY, to.mapY) - lift}, ${midX} ${
    Math.min(from.mapY, to.mapY) - lift
  }, ${to.mapX} ${to.mapY}`;
}

export function IndiaOpsMap({
  franchises: inputFranchises,
  highlightCity,
}: {
  franchises: Franchise[];
  highlightCity?: string;
}) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const uid = useId();

  const nodes = useMemo<FranchiseNode[]>(() => {
    return inputFranchises
      .map((franchise) => {
        const meta = nodeMeta[franchise.city];
        if (!meta) return null;
        return { ...franchise, ...meta };
      })
      .filter(Boolean) as FranchiseNode[];
  }, [inputFranchises]);

  const nodesByCity = useMemo(() => new Map(nodes.map((node) => [node.city, node])), [nodes]);
  const hoveredNode = hoveredCity ? (nodesByCity.get(hoveredCity) ?? null) : null;

  const highlightedNode = useMemo(() => {
    if (!highlightCity) return null;
    const q = highlightCity.trim().toLowerCase();
    if (!q) return null;

    return (
      nodes.find(
        (node) =>
          node.city.toLowerCase().includes(q) ||
          node.state.toLowerCase().includes(q) ||
          node.franchiseName.toLowerCase().includes(q),
      ) ?? null
    );
  }, [highlightCity, nodes]);

  const activeNode = hoveredNode ?? highlightedNode;

  const connections = useMemo(() => {
    return links
      .map(([fromCity, toCity]) => {
        const from = nodesByCity.get(fromCity);
        const to = nodesByCity.get(toCity);
        if (!from || !to) return null;
        return { from, to, path: computeCurve(from, to) };
      })
      .filter(Boolean) as Array<{ from: FranchiseNode; to: FranchiseNode; path: string }>;
  }, [nodesByCity]);

  const statusCounts = useMemo(() => {
    return nodes.reduce(
      (acc, node) => {
        acc.total += 1;
        acc.health += node.operationalHealth;
        if (node.status === "Active") acc.active += 1;
        else if (node.status === "Onboarding") acc.onboarding += 1;
        else acc.pipeline += 1;
        return acc;
      },
      { total: 0, active: 0, onboarding: 0, pipeline: 0, health: 0 },
    );
  }, [nodes]);

  const averageHealth = statusCounts.total
    ? Math.round(statusCounts.health / statusCounts.total)
    : 0;

  const tooltipStyle = activeNode
    ? {
        left: `${Math.min(Math.max(activeNode.mapX, 20), 80)}%`,
        top: `${activeNode.mapY < 35 ? Math.min(activeNode.mapY + 5, 86) : Math.max(activeNode.mapY - 4, 12)}%`,
        transform: `translate(-50%, ${activeNode.mapY < 35 ? "0" : "-100%"})`,
      }
    : undefined;

  const activeRiskTone: MetricTone = activeNode
    ? activeNode.riskStatus === "Critical"
      ? "critical"
      : activeNode.riskStatus === "Attention" || activeNode.riskStatus === "Watch"
        ? "watch"
        : "positive"
    : "positive";

  return (
    <div
      className="relative h-full min-h-[560px] overflow-hidden rounded-2xl border border-border/70"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.12), transparent 0 28%), radial-gradient(circle at 82% 20%, rgba(16, 185, 129, 0.10), transparent 0 24%), radial-gradient(circle at 50% 84%, rgba(59, 130, 246, 0.08), transparent 0 25%), linear-gradient(180deg, rgba(8, 12, 22, 0.96), rgba(4, 8, 16, 0.98))",
      }}
    >
      <div className="absolute inset-0 opacity-70">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern id={`${uid}-grid`} width="6" height="6" patternUnits="userSpaceOnUse">
              <path
                d="M 6 0 L 0 0 0 6"
                fill="none"
                stroke="white"
                strokeOpacity="0.03"
                strokeWidth="0.25"
              />
            </pattern>
            <linearGradient id={`${uid}-india`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.36" />
              <stop offset="100%" stopColor="var(--card)" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id={`${uid}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.24" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill={`url(#${uid}-grid)`} />

          {clusters.map((cluster) => (
            <ellipse
              key={cluster.label}
              cx={cluster.x}
              cy={cluster.y}
              rx={cluster.rx}
              ry={cluster.ry}
              fill="var(--primary)"
              fillOpacity="0.055"
              stroke="var(--primary)"
              strokeOpacity="0.11"
              strokeWidth="0.3"
              strokeDasharray="1.6 1.6"
            />
          ))}

          <path
            d={INDIA_OUTLINE}
            fill={`url(#${uid}-india)`}
            stroke="var(--border)"
            strokeWidth="0.45"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={NORTHEAST_OUTLINE}
            fill={`url(#${uid}-india)`}
            stroke="var(--border)"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />

          {connections.map((connection) => (
            <path
              key={`${connection.from.city}-${connection.to.city}`}
              d={connection.path}
              fill="none"
              stroke={`url(#${uid}-line)`}
              strokeWidth="0.35"
              strokeDasharray="1.6 1.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <text x="70" y="15" fill="var(--muted-foreground)" fontSize="2.8" textAnchor="middle">
            North cluster
          </text>
          <text x="36" y="49" fill="var(--muted-foreground)" fontSize="2.8" textAnchor="middle">
            West cluster
          </text>
          <text x="51" y="42" fill="var(--muted-foreground)" fontSize="2.8" textAnchor="middle">
            Central corridor
          </text>
          <text x="55" y="73" fill="var(--muted-foreground)" fontSize="2.8" textAnchor="middle">
            South cluster
          </text>
        </svg>
      </div>

      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
          India operational intelligence map
        </span>
        <span className="rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[10px] text-muted-foreground backdrop-blur-xl">
          {statusCounts.active} active / {statusCounts.onboarding} onboarding /{" "}
          {statusCounts.pipeline} pipeline
        </span>
      </div>

      <div className="absolute right-4 top-4 z-10 hidden flex-wrap gap-2 md:flex">
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-200">
          Healthy
        </span>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] text-amber-200">
          Attention
        </span>
        <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[10px] text-rose-200">
          Critical
        </span>
        <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[10px] text-sky-200">
          New / Onboarding
        </span>
      </div>

      <div className="absolute inset-0">
        {nodes.map((node) => {
          const isActive = activeNode?.city === node.city;
          const isPinned = highlightedNode?.city === node.city;
          const riskTone: MetricTone =
            node.riskStatus === "Critical"
              ? "critical"
              : node.riskStatus === "Attention" || node.riskStatus === "Watch"
                ? "watch"
                : "positive";

          return (
            <button
              key={node.city}
              type="button"
              aria-label={`${node.franchiseName}, ${node.city}. Revenue ${formatCr(node.revenue)}. Operational health ${node.operationalHealth}%`}
              onMouseEnter={() => setHoveredCity(node.city)}
              onMouseLeave={() =>
                setHoveredCity((current) => (current === node.city ? null : current))
              }
              onFocus={() => setHoveredCity(node.city)}
              onBlur={() => setHoveredCity((current) => (current === node.city ? null : current))}
              className={cn(
                "group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-none transition duration-300",
                isActive && "scale-110",
                isPinned && !isActive && "scale-105",
              )}
              style={{ left: `${node.mapX}%`, top: `${node.mapY}%` }}
            >
              <span
                className={cn(
                  "relative block h-3 w-3 rounded-full ring-4 ring-offset-2 ring-offset-background/80 transition duration-300",
                  nodeToneStyles[node.tone],
                  isActive && "shadow-[0_0_0_10px_rgba(255,255,255,0.06)]",
                )}
              >
                <span className="absolute inset-0 rounded-full bg-white/30 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
                {node.tone === "onboarding" && (
                  <span className="absolute inset-[-5px] rounded-full border border-sky-300/20 animate-pulse" />
                )}
                {node.riskStatus === "Critical" && (
                  <span className="absolute inset-[-8px] rounded-full border border-rose-300/25" />
                )}
              </span>

              <span
                className={cn(
                  "pointer-events-none absolute top-1/2 whitespace-nowrap rounded-full border border-white/10 bg-background/80 px-2 py-0.5 text-[10px] text-foreground/80 opacity-0 shadow-lg backdrop-blur-xl transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                  node.mapX > 62 ? "-translate-y-1/2 -translate-x-[110%]" : "ml-3 -translate-y-1/2",
                  isActive && "opacity-100",
                )}
              >
                {node.city}
              </span>

              {isActive && (
                <span className="absolute inset-[-11px] rounded-full border border-primary/25 shadow-[0_0_0_6px_rgba(59,130,246,0.08)]" />
              )}
              {isPinned && !isActive && (
                <span className="absolute inset-[-9px] rounded-full border border-primary/20" />
              )}
            </button>
          );
        })}
      </div>

      {activeNode && (
        <div
          className="absolute z-20 w-[min(320px,calc(100%-24px))] rounded-2xl border border-white/10 bg-card/95 p-3 text-xs text-foreground shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-in fade-in-0 zoom-in-95"
          style={tooltipStyle}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-foreground">
                {activeNode.franchiseName}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {activeNode.city} - {activeNode.state} - {activeNode.cluster}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  statusStyles[activeNode.status],
                )}
              >
                {activeNode.status}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  riskStyles[activeNode.riskStatus],
                )}
              >
                {activeNode.riskStatus}
              </span>
            </div>
          </div>

          <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {activeNode.summary}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MetricCell label="Revenue" value={formatCr(activeNode.revenue)} />
            <MetricCell
              label="Profit / Loss"
              value={formatCr(activeNode.profitLoss)}
              tone={activeNode.profitLoss >= 0 ? "positive" : "negative"}
            />
            <MetricCell label="EBITDA" value={formatPercent(activeNode.ebitda)} />
            <MetricCell
              label="Operational Health"
              value={`${activeNode.operationalHealth}%`}
              progress={activeNode.operationalHealth}
            />
            <MetricCell label="Staffing Availability" value={activeNode.staffingAvailability} />
            <MetricCell label="Onboarding Status" value={activeNode.onboardingStatus} />
            <MetricCell
              label="AI Automation"
              value={`${activeNode.aiAutomation}%`}
              progress={activeNode.aiAutomation}
            />
            <MetricCell label="Risk Status" value={activeNode.riskStatus} tone={activeRiskTone} />
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-background/70 px-3 py-2 text-[10px] text-muted-foreground backdrop-blur-xl">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Healthy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Attention
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Critical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          New / Onboarding
        </span>
        <span className="ml-auto hidden items-center gap-2 md:flex">
          <span>Avg operational health</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-foreground">
            {averageHealth}/100
          </span>
        </span>
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  progress,
  tone = "neutral",
}: {
  label: string;
  value: string;
  progress?: number;
  tone?: MetricTone;
}) {
  const toneClasses: Record<MetricTone, string> = {
    neutral: "text-foreground",
    positive: "text-emerald-200",
    negative: "text-rose-200",
    critical: "text-rose-200",
    watch: "text-sky-200",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-sm font-semibold", toneClasses[tone])}>{value}</div>
      {typeof progress === "number" && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-teal transition-all duration-500"
            style={{ width: pctBar(progress) }}
          />
        </div>
      )}
    </div>
  );
}
