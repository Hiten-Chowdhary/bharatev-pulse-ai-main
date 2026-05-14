import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label, value, delta, deltaLabel, icon: Icon, accent = "primary", hint,
}: {
  label: string; value: string; delta?: number; deltaLabel?: string;
  icon?: LucideIcon; accent?: "primary" | "teal" | "success" | "warning" | "danger"; hint?: string;
}) {
  const accentMap: Record<string, string> = {
    primary: "text-primary bg-primary/10 ring-primary/20",
    teal: "text-teal bg-teal/10 ring-teal/20",
    success: "text-success bg-success/10 ring-success/20",
    warning: "text-warning bg-warning/10 ring-warning/20",
    danger: "text-destructive bg-destructive/10 ring-destructive/20",
  };
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
        </div>
        {Icon && (
          <div className={cn("h-9 w-9 grid place-items-center rounded-lg ring-1", accentMap[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md",
            positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10")}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
        {(deltaLabel || hint) && <span className="text-muted-foreground">{deltaLabel ?? hint}</span>}
      </div>
    </div>
  );
}

export function Panel({ title, subtitle, action, children, className }: {
  title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            {title && <div className="text-sm font-semibold tracking-tight">{title}</div>}
            {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
