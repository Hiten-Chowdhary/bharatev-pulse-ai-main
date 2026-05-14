import type { ReactNode } from "react";
import type { ExecutiveInsight } from "@/lib/mock/data";
import {
  alerts,
  automationByWorkflow,
  expansionCandidates,
  failureSignals,
  financialIntelligence,
  franchises,
  humanCosts,
  insights,
  predictiveRisks,
} from "@/lib/mock/data";

export type SearchHitType =
  | "franchise"
  | "insight"
  | "alert"
  | "failure_metric"
  | "expansion"
  | "predictive_risk"
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
    const hay = `${f.city} ${f.state} ${f.status} ${f.alert ?? ""} ${f.dependencyAlert ?? ""} ${f.staffingGap ?? ""} onboarding delay slip support backlog franchise`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `fr-${f.city}`,
        type: "franchise",
        title: `${f.city} (${f.state})`,
        description: [f.status, f.alert, f.dependencyAlert].filter(Boolean).join(" · ") || "Franchise record",
        to: "/operations",
        search: { highlight: f.city },
        haystack: hay,
      });
    }
  }

  insights.forEach((it: ExecutiveInsight, i: number) => {
    const hay = `${it.title} ${it.body} ${it.tag} ${it.actions.join(" ")} ${(it.affectedCities ?? []).join(" ")} ${it.category}`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `in-${i}`,
        type: "insight",
        title: it.title,
        description: `${it.tag} · ${it.shortRecommendation ?? `${it.body.slice(0, 110)}…`}`,
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

  failureSignals.forEach((f, i) => {
    const hay = `${f.label} ${f.detail} ${f.value}${f.suffix} support backlog onboarding ai fallback`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `fail-${i}`,
        type: "failure_metric",
        title: f.label,
        description: `${f.value}${f.suffix} — ${f.detail}`,
        to: "/",
        haystack: hay,
      });
    }
  });

  predictiveRisks.forEach((t, i) => {
    if (matches(t, q) || fuzzy(t, q)) {
      hits.push({
        id: `risk-${i}`,
        type: "predictive_risk",
        title: "Forecast risk",
        description: t,
        to: "/insights",
        haystack: t,
      });
    }
  });

  expansionCandidates.forEach((x) => {
    const hay = `${x.c} expansion city pipeline ${x.why}`;
    if (matches(hay, q) || fuzzy(hay, q)) {
      hits.push({
        id: `ex-${x.c}`,
        type: "expansion",
        title: x.c,
        description: x.why,
        to: "/insights",
        haystack: hay,
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
        description: `AI ${w.ai}% · human ${w.human}%`,
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
        description: `${r.count} people · ₹${r.monthly}L / mo`,
        to: "/workforce",
        haystack: hay,
      });
    }
  });

  const fi = financialIntelligence;
  const fiHay = `financial ${fi.costLeakageNote} ${fi.highBurnZones} margin volatility escalation ${fi.aiVsManpowerDeltaNote}`;
  if (matches(fiHay, q) || fuzzy(fiHay, q)) {
    hits.push({
      id: "fi-summary",
      type: "financial",
      title: "Execution-linked finance",
      description: `Leakage ₹${fi.costLeakageLakh}L · high-burn: ${fi.highBurnZones}`,
      to: "/financial",
      haystack: fiHay,
    });
  }

  hits.sort((a, b) => score(b.haystack, q) - score(a.haystack, q));

  const seen = new Set<string>();
  const dedup: SearchHit[] = [];
  for (const h of hits) {
    const k = `${h.type}-${h.title}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(h);
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
        <mark className="bg-primary/25 text-foreground rounded px-0.5">{text.slice(lo, lo + w.length)}</mark>
        {text.slice(lo + w.length)}
      </>
    );
  }
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-foreground rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
