import { Bell, Search, ChevronDown, ShieldCheck } from "lucide-react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-auto items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/60">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" placeholder="Search franchises, KPIs, insights…" />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card/60 text-xs text-muted-foreground hover:text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> SOC2 · ISO27001
          </button>
          <button className="relative h-9 w-9 grid place-items-center rounded-md border border-border bg-card/60 hover:bg-card">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </button>
          <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md border border-border bg-card/60">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-teal grid place-items-center text-[11px] font-semibold">AR</div>
            <div className="hidden sm:block">
              <div className="text-xs font-medium leading-tight">Arjun Rao</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Chief Executive</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
