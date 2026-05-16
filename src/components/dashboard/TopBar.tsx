import { Bell, Search, ChevronDown, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { executiveProfiles } from "@/lib/roleConfig";
import { franchises, insights, alerts as mockAlerts, automationByWorkflow, costBreakdown, aiCosts } from "@/lib/mock/data";

type SearchItem = { id: string; title: string; subtitle?: string; group: string; payload?: any };

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { profile, setProfileId, searchQuery, setSearchQuery } = useDashboardRole();
  const [openProfile, setOpenProfile] = useState(false);

  const query = searchQuery;
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!query || !query.trim()) return setResults([]);
    const q = query.toLowerCase();
    const out: SearchItem[] = [];

    // cities / franchises
    for (const f of franchises) {
      if (f.city.toLowerCase().includes(q) || (f.alert || "").toLowerCase().includes(q)) {
        out.push({ id: `city-${f.city}`, title: f.city, subtitle: `${f.status} · Health ${f.health || "—"}`, group: "Franchises", payload: f });
      }
    }

    // insights
    for (const it of insights) {
      if (it.title.toLowerCase().includes(q) || it.body.toLowerCase().includes(q) || it.tag.toLowerCase().includes(q)) {
        out.push({ id: `insight-${it.title}`, title: it.title, subtitle: it.tag, group: "AI Insights", payload: it });
      }
    }

    // alerts
    for (const a of mockAlerts) {
      if (a.text.toLowerCase().includes(q)) out.push({ id: `alert-${a.text.slice(0, 24)}`, title: a.text, group: "Alerts", payload: a });
    }

    // workflows
    for (const w of automationByWorkflow) {
      if (w.workflow.toLowerCase().includes(q)) out.push({ id: `wf-${w.workflow}`, title: w.workflow, subtitle: `AI ${w.ai}% · Human ${w.human}%`, group: "Workflows", payload: w });
    }

    // cost tools
    for (const t of aiCosts) {
      if (t.tool.toLowerCase().includes(q)) out.push({ id: `tool-${t.tool}`, title: t.tool, subtitle: t.coverage, group: "AI Tooling", payload: t });
    }

    // cost breakdown
    for (const c of costBreakdown) {
      if (c.name.toLowerCase().includes(q)) out.push({ id: `cost-${c.name}`, title: c.name, subtitle: `${c.value}%`, group: "Costs", payload: c });
    }

    // months / revenue
    // quick match: month names
    const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
    if (months.some((m) => m.startsWith(q))) out.push({ id: 'rev-month', title: 'Revenue trend', subtitle: 'Monthly · ₹ Cr', group: 'Financials' });

    setResults(out.slice(0, 12));
  }, [query]);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>

        <div className="hidden md:flex relative flex-1 max-w-md mx-auto items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/60">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input ref={inputRef} value={query} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" placeholder="Search cities, KPIs, insights, onboarding…" />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>

          {results.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full max-h-72 overflow-y-auto rounded-md border border-border bg-card/95 shadow-lg z-40">
                  <div className="p-2 space-y-1">
                {results.map((r) => (
                  <div key={r.id} className="flex items-start gap-2 p-2 rounded hover:bg-background/50 cursor-pointer" onClick={() => {
                    setSearchQuery(r.title);
                    // show lightweight detail: focus input and keep query
                    inputRef.current?.focus();
                  }}>
                    <div className="text-[11px] text-muted-foreground w-20">{r.group}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{r.title}</div>
                      {r.subtitle && <div className="text-[11px] text-muted-foreground truncate">{r.subtitle}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card/60 text-xs text-muted-foreground hover:text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> SOC2 · ISO27001
          </button>
          <button className="relative h-9 w-9 grid place-items-center rounded-md border border-border bg-card/60 hover:bg-card">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </button>

          <div className="relative">
            <div onClick={() => setOpenProfile((v) => !v)} className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md border border-border bg-card/60 cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-teal grid place-items-center text-[11px] font-semibold">{profile.initials}</div>
              <div className="hidden sm:block">
                <div className="text-xs font-medium leading-tight">{profile.name}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{profile.title}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-60 rounded-md border border-border bg-card/95 shadow-lg z-50">
                <div className="p-2">
                  {executiveProfiles.map((p) => (
                    <button key={p.id} onClick={() => { setProfileId(p.id); setOpenProfile(false); }} className="flex w-full items-center gap-2 px-2 py-2 rounded hover:bg-background/40 text-left">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-teal grid place-items-center text-[11px] font-semibold">{p.initials}</div>
                      <div className="min-w-0">
                        <div className="text-sm">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
