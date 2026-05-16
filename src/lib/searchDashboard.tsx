import type { ReactNode } from "react";
import {
  alerts,
  aiCosts,
  automationByWorkflow,
  costBreakdown,
  franchises,
  humanCosts,
  insights,
  revenueTrend,
} from "@/lib/mock/data";

export type SearchHitType =
  | "franchise"
  | "insight"
  | "alert"
  | "workflow"
  | "staffing"
  | "financial";

export type SearchHit = {
  id: string;
  type: SearchHitType;
  title: string;
  description: string;
  to: "/" | "/financial" | "/operations" | "/workforce" | "/insights";
  search?: Record<string, string | undefined>;
  haystack: string;
};

function norm(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function words(q: string) {
  return norm(q)
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
}

function matches(hay: string, q: string): boolean {
  const h = norm(hay);
  const ws = words(q);
  if (!ws.length) return false;
  return ws.every((w) => h.includes(w));
}

function fuzzy(hay: string, q: string): boolean {
  if (matches(hay, q)) return true;
  const h = norm(hay);
  const nq = norm(q).replace(/\s+/g, "");
  if (nq.length < 3) return false;
  return h.includes(nq);
}

function score(hay: string, q: string): number {
  const h = norm(hay);
  const ws = words(q);
  if (!ws.length) return 0;
  let s = 0;
  for (const w of ws) {
    if (h.includes(w)) s += 3;
    if (h.startsWith(w)) s += 1;
  }
  return s - h.length / 400;
}

export function searchDashboard(query: string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const f of franchises) {
    const hay = `${f.city} ${f.state} ${f.status} ${f.alert ?? ""} franchise operations rollout`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `fr-${f.city}`,
        type: "franchise",
        title: `${f.city} (${f.state})`,
        description: [f.status, f.alert].filter(Boolean).join(" - ") || "Franchise record",
        to: "/operations",
        search: { highlight: f.city },
        haystack: hay,
      });
    }
  }

  insights.forEach((it, i) => {
    const hay = `${it.title} ${it.body} ${it.tag}`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `in-${i}`,
        type: "insight",
        title: it.title,
        description: `${it.tag} - ${it.body.slice(0, 110)}`,
        to: "/insights",
        search: { insight: String(i) },
        haystack: hay,
      });
    }
  });

  alerts.forEach((a, i) => {
    if (matches(a.text, q) || fuzzy(a.text, q)) {
      hits.push({
        id: `al-${i}`,
        type: "alert",
        title: "Network alert",
        description: a.text,
        to: "/",
        haystack: a.text,
      });
    }
  });

  automationByWorkflow.forEach((w) => {
    const hay = `${w.workflow} automation ai human fallback dispatch onboarding`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `wf-${w.workflow}`,
        type: "workflow",
        title: w.workflow,
        description: `AI ${w.ai}% - human ${w.human}%`,
        to: "/workforce",
        haystack: hay,
      });
    }
  });

  humanCosts.forEach((r) => {
    const hay = `${r.role} staffing headcount support field engineer`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `st-${r.role}`,
        type: "staffing",
        title: r.role,
        description: `${r.count} people - Rs.${r.monthly}L / mo`,
        to: "/workforce",
        haystack: hay,
      });
    }
  });

  aiCosts.forEach((tool) => {
    const hay = `${tool.tool} ${tool.coverage} ai tooling support automation`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `tool-${tool.tool}`,
        type: "financial",
        title: tool.tool,
        description: `${tool.coverage} - Rs.${tool.monthly}L / mo`,
        to: "/financial",
        haystack: hay,
      });
    }
  });

  const revenueHay = revenueTrend
    .map((row) => `${row.m} revenue ${row.revenue} ebitda ${row.ebitda} target ${row.target}`)
    .join(" ");
  if (matches(revenueHay, q) || fuzzy(revenueHay, q)) {
    hits.push({
      id: "fi-summary",
      type: "financial",
      title: "Execution-linked finance",
      description: "Monthly revenue, EBITDA, and plan tracking",
      to: "/financial",
      haystack: revenueHay,
    });
  }

  const costHay = costBreakdown.map((row) => `${row.name} ${row.value}`).join(" ");
  if (matches(costHay, q) || fuzzy(costHay, q)) {
    hits.push({
      id: "cost-breakdown",
      type: "financial",
      title: "Cost breakdown",
      description: "Human ops, AI tooling, infrastructure, marketing, and G&A",
      to: "/financial",
      haystack: costHay,
    });
  }

  hits.sort((a, b) => score(b.haystack, q) - score(a.haystack, q));

  const seen = new Set<string>();
  const dedup: SearchHit[] = [];
  for (const hit of hits) {
    const key = `${hit.type}-${hit.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(hit);
  }

  return dedup.slice(0, 24);
}

export function highlightText(text: string, query: string): ReactNode {
  const q = norm(query);
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) {
    const w = words(query)[0];
    if (!w) return text;
    const lo = lower.indexOf(w);
    if (lo < 0) return text;
    return (
      <>
        {text.slice(0, lo)}
        <mark className="rounded bg-primary/25 px-0.5 text-foreground">
          {text.slice(lo, lo + w.length)}
        </mark>
        {text.slice(lo + w.length)}
      </>
    );
  }
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-primary/25 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}
