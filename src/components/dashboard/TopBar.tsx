import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Search, ChevronDown, ShieldCheck } from "lucide-react";
import { useDashboardRole } from "@/context/DashboardRoleContext";
import { executiveProfiles } from "@/lib/roleConfig";
import { highlightText, searchDashboard, type SearchHit } from "@/lib/searchDashboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { profile, setProfileId, welcomeLine, readingHint } = useDashboardRole();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchDashboard(q), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const typeLabel = (t: SearchHit["type"]) => {
    const m: Record<SearchHit["type"], string> = {
      franchise: "City",
      insight: "Insight",
      alert: "Alert",
      failure_metric: "Risk metric",
      expansion: "Expansion",
      predictive_risk: "Forecast",
      workflow: "Workflow",
      staffing: "Staffing",
      financial: "Finance",
    };
    return m[t];
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="flex flex-col gap-2 px-6 py-3">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>}
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
              <span className="text-teal/90 font-medium">{welcomeLine}</span>
              <span className="text-muted-foreground/70"> · </span>
              <span>{readingHint}</span>
            </p>
          </div>

          <div ref={wrapRef} className="hidden md:block flex-1 max-w-md min-w-[200px] relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/60 focus-within:border-primary/40">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-muted-foreground"
                placeholder="Search cities, alerts, risks, onboarding…"
                aria-autocomplete="list"
                aria-expanded={open}
              />
              <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 shrink-0">⌘K</kbd>
            </div>
            {open && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-border bg-popover shadow-xl max-h-[min(70vh,22rem)] overflow-y-auto z-50">
                {!q.trim() && <div className="px-3 py-2 text-[11px] text-muted-foreground">Type to search the mock ops dataset…</div>}
                {q.trim() && results.length === 0 && (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">No matching operational records found.</div>
                )}
                {results.map((hit) => (
                  <Link
                    key={hit.id}
                    to={hit.to}
                    search={hit.search as Record<string, string | undefined>}
                    className="block px-3 py-2.5 border-b border-border/60 last:border-0 hover:bg-secondary/60 transition text-left"
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{typeLabel(hit.type)}</span>
                    </div>
                    <div className="text-sm font-medium mt-0.5">{highlightText(hit.title, q)}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{highlightText(hit.description, q)}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card/60 text-xs text-muted-foreground hover:text-foreground"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-teal" /> SOC2 · ISO27001
            </button>
            <button type="button" className="relative h-9 w-9 grid place-items-center rounded-md border border-border bg-card/60 hover:bg-card">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md border border-border bg-card/60 hover:bg-card text-left max-w-[200px]"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-teal grid place-items-center text-[11px] font-semibold shrink-0">
                    {profile.initials}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <div className="text-xs font-medium leading-tight truncate">{profile.name}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight truncate">{profile.title}</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  View as role (layout + priorities change)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {executiveProfiles.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    className={cn("flex flex-col items-start gap-0.5 py-2 cursor-pointer", p.id === profile.id && "bg-secondary/80")}
                    onClick={() => setProfileId(p.id)}
                  >
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">{p.title}</span>
                    {p.attribution && <span className="text-[10px] text-muted-foreground/80 leading-tight">{p.attribution}</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
