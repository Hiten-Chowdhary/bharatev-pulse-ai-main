import React from "react";

export default function ChartTooltip({ active, payload, label, total }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const style: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 10,
    color: "var(--muted-foreground)",
    fontSize: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
  };

  return (
    <div style={style}>
      {label && <div style={{ fontSize: 11, marginBottom: 6, color: "var(--muted-foreground)" }}>{label}</div>}
      <div>
        {payload.map((p: any, i: number) => {
          const name = p.name ?? p.dataKey ?? p.data?.name ?? p.dataKey;
          const value = p.value ?? (p.payload && p.payload[p.dataKey]) ?? p.payload?.value;
          const pct = typeof value === "number" && total ? ` · ${Math.round((value / total) * 100)}%` : "";
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{name}</div>
              <div style={{ fontSize: 12, color: "var(--foreground)" }}>{value}{pct}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
