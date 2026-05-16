import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TooltipEntry = {
  name?: string;
  dataKey?: string;
  value?: number | string | Array<number | string>;
  color?: string;
  fill?: string;
  stroke?: string;
  percent?: number;
  payload?: Record<string, unknown>;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: ReactNode;
  className?: string;
  contextLabel?: string;
  total?: number;
  valueFormatter?: (value: number, entry: TooltipEntry, index: number) => ReactNode;
  showPercent?: boolean;
  hideLabel?: boolean;
};

function formatValue(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function toNumber(value: TooltipEntry["value"]) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === "number") return first;
    const parsed = Number(first);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function resolveLabel(label: ReactNode, payload: TooltipEntry[]) {
  if (typeof label === "string" || typeof label === "number") {
    return label;
  }

  const [first] = payload;
  return first?.name ?? first?.dataKey ?? null;
}

function resolvePercent(entry: TooltipEntry, value: number | null, total?: number) {
  if (typeof entry.percent === "number" && Number.isFinite(entry.percent)) {
    return entry.percent <= 1 ? entry.percent * 100 : entry.percent;
  }

  if (typeof value === "number" && typeof total === "number" && total > 0) {
    return (value / total) * 100;
  }

  return null;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  className,
  contextLabel,
  total,
  valueFormatter,
  showPercent = false,
  hideLabel = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const title = hideLabel ? null : resolveLabel(label, payload);

  return (
    <div
      className={cn(
        "pointer-events-none min-w-[13rem] max-w-[18rem] rounded-2xl border border-white/10 bg-card/95 px-3 py-3 text-xs text-foreground shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        className,
      )}
    >
      {contextLabel && (
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {contextLabel}
        </div>
      )}

      {title !== null && title !== undefined && (
        <div className={cn("text-sm font-semibold text-foreground", contextLabel && "mt-1")}>
          {title}
        </div>
      )}

      <div className={cn("space-y-2", (contextLabel || title !== null) && "mt-3")}>
        {payload
          .filter((entry) => entry?.value !== undefined)
          .map((entry, index) => {
            const numericValue = toNumber(entry.value);
            const indicatorColor = entry.color ?? entry.fill ?? entry.stroke ?? "var(--primary)";
            const formattedValue =
              numericValue === null
                ? "—"
                : (valueFormatter?.(numericValue, entry, index) ?? formatValue(numericValue));
            const percent = resolvePercent(entry, numericValue, total);

            return (
              <div
                key={`${entry.dataKey ?? entry.name ?? index}`}
                className="flex items-start gap-2"
              >
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border border-white/20"
                  style={{ backgroundColor: indicatorColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[11px] text-muted-foreground">
                      {entry.name ?? entry.dataKey ?? "Value"}
                    </span>
                    <span className="font-mono text-sm font-medium tabular-nums text-foreground">
                      {formattedValue}
                    </span>
                  </div>

                  {showPercent && percent !== null && (
                    <div className="mt-1 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {Math.round(percent)}% share
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
