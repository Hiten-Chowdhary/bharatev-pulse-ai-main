import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LineChart, MapPin, Users, Sparkles, Settings, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Command Center", icon: LayoutDashboard },
  { to: "/financial", label: "Financial Intelligence", icon: LineChart },
  { to: "/operations", label: "Franchise Operations", icon: MapPin },
  { to: "/workforce", label: "Workforce & AI Ops", icon: Users },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="relative h-9 w-9 rounded-lg bg-primary/15 grid place-items-center glow-primary">
          <Zap className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">BharatEV</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Ops Intelligence</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Workspace</div>
        {nav.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <Link key={to} to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}>
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
          <Settings className="h-4 w-4" /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <div className="mt-3 mx-1 rounded-lg border border-sidebar-border bg-card/60 p-3">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Environment</div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Production · v3.2.1
          </div>
        </div>
      </div>
    </aside>
  );
}
