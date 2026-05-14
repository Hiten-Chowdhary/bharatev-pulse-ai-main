import { useMemo, useState } from "react";
import type { FranchiseRow } from "@/lib/mock/data";
import { franchiseDependencyEdges } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

type NodeKind = "healthy" | "attention" | "critical" | "onboarding" | "pipeline";

function classify(f: FranchiseRow): NodeKind {
  if (f.status === "Pipeline") return "pipeline";
  if (f.status === "Onboarding") return "onboarding";
  if (f.riskScore >= 70 || f.health < 55) return "critical";
  if (f.riskScore >= 50 || f.health < 78) return "attention";
  return "healthy";
}

const nodeRing: Record<NodeKind, string> = {
  healthy: "fill-emerald-500 stroke-emerald-300",
  attention: "fill-amber-500 stroke-amber-300",
  critical: "fill-red-500 stroke-red-400",
  onboarding: "fill-sky-500 stroke-sky-300",
  pipeline: "fill-slate-500 stroke-slate-400",
};

const REGION_STYLE: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
  West: { x: 8, y: 32, w: 38, h: 42, label: "West" },
  North: { x: 34, y: 10, w: 32, h: 32, label: "North" },
  South: { x: 42, y: 58, w: 50, h: 38, label: "South" },
  Central: { x: 32, y: 38, w: 28, h: 28, label: "Central" },
};

export function IndiaOpsMap({ franchises, highlightCity }: { franchises: FranchiseRow[]; highlightCity?: string }) {
  const [hover, setHover] = useState<FranchiseRow | null>(null);

  const posByCity = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const f of franchises) m.set(f.city, { x: f.mapX, y: f.mapY });
    return m;
  }, [franchises]);

  const edges = useMemo(() => {
    return franchiseDependencyEdges
      .map((e) => {
        const a = posByCity.get(e.fromCity);
        const b = posByCity.get(e.toCity);
        if (!a || !b) return null;
        return { ...e, a, b };
      })
      .filter(Boolean) as { fromCity: string; toCity: string; label: string; a: { x: number; y: number }; b: { x: number; y: number } }[];
  }, [posByCity]);

  const aiAssist = (f: FranchiseRow) => Math.max(0, Math.min(100, 100 - f.humanFallbackPct));

  return (
    <div className="relative rounded-lg border border-border bg-gradient-to-b from-card/80 to-background/60 overflow-hidden">
      <div className="absolute top-2 left-2 z-10 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/70 px-2 py-1 rounded border border-border">
        Hover cities · dashed lines = shared dependencies
      </div>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-[min(72vh,520px)] touch-none"
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="India franchise operational map"
      >
        <defs>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="hsl(0 0% 100% / 0.04)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {Object.entries(REGION_STYLE).map(([k, r]) => (
          <g key={k}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={3}
              fill="hsl(var(--primary) / 0.04)"
              stroke="hsl(var(--border))"
              strokeWidth="0.25"
              strokeDasharray="1 1"
            />
            <text x={r.x + 1.2} y={r.y + 3.5} fill="hsl(var(--muted-foreground))" fontSize="3.2" className="select-none">
              {r.label}
            </text>
          </g>
        ))}

        {edges.map((e) => (
          <g key={`${e.fromCity}-${e.toCity}`}>
            <line
              x1={e.a.x}
              y1={e.a.y}
              x2={e.b.x}
              y2={e.b.y}
              stroke="hsl(var(--primary) / 0.35)"
              strokeWidth="0.35"
              strokeDasharray="1.2 0.8"
            />
            <text
              x={(e.a.x + e.b.x) / 2}
              y={(e.a.y + e.b.y) / 2 - 1}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="2.4"
              className="select-none"
            >
              {e.label}
            </text>
          </g>
        ))}

        {franchises.map((f) => {
          const k = classify(f);
          const r = 2.1;
          const hl = highlightCity && f.city.toLowerCase() === highlightCity.toLowerCase();
          return (
            <g
              key={f.city}
              transform={`translate(${f.mapX}, ${f.mapY})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(f)}
            >
              <circle r={r + (hl ? 0.8 : 0)} className={cn(nodeRing[k], "transition-opacity", hl && "stroke-primary stroke-[0.45]")} strokeWidth="0.2" />
              <text x={r + 1.2} y={1} fill="hsl(var(--foreground) / 0.9)" fontSize="3" className="select-none">
                {f.city}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-20 w-[220px] rounded-lg border border-border bg-card/95 backdrop-blur px-3 py-2 shadow-xl text-[11px]"
          style={{
            left: `clamp(8px, ${(hover.mapX / 100) * 100}%, calc(100% - 228px))`,
            top: "12%",
          }}
        >
          <div className="text-sm font-semibold">{hover.city}</div>
          <div className="text-muted-foreground text-[10px] mb-2">
            {hover.region} · {hover.status}
            {hover.onboardingSlipDays >= 10 && <span className="text-destructive"> · {hover.onboardingSlipDays}d late vs SLA</span>}
          </div>
          <dl className="space-y-1 text-[10px]">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Revenue (TTM)</dt>
              <dd className="tabular-nums font-medium">{hover.status === "Pipeline" ? "—" : `₹${hover.revenue} Cr`}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Health</dt>
              <dd className="tabular-nums">{hover.status === "Pipeline" ? "—" : hover.health}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Onboarding</dt>
              <dd>
                {hover.status === "Onboarding" ? (hover.onboardingSlipDays ? `${hover.onboardingSlipDays}d slip` : "In progress") : hover.status}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Staffing</dt>
              <dd className="text-right leading-tight">{hover.staffingGap ?? "Within plan vs model"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">AI assisted (est.)</dt>
              <dd className="tabular-nums">{hover.status === "Pipeline" ? "—" : `${aiAssist(hover)}%`}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Ops risk score</dt>
              <dd className="tabular-nums">{hover.riskScore}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground bg-background/80 backdrop-blur rounded border border-border px-2 py-1.5">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Healthy
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Needs attention
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-sky-500" /> Onboarding
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-500" /> Pipeline
        </span>
      </div>
    </div>
  );
}
