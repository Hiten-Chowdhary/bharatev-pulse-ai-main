/**
 * Role-based dashboard personalization for BharatEV Ops Intelligence.
 * Public showcase builds use generic executive labels for the profile selector.
 */

export type RoleKey = "ceo" | "cofounder" | "business_head" | "ops_head" | "regional_ops" | "cto";

export type ExecutiveProfile = {
  id: string;
  name: string;
  title: string;
  initials: string;
  roleKey: RoleKey;
  /** Shown under name in selector — transparency on sourcing */
  attribution?: string;
};

export const executiveProfiles: ExecutiveProfile[] = [
  {
    id: "vivek-gupta",
    name: "CEO",
    title: "Executive Leadership",
    initials: "CE",
    roleKey: "ceo",
    attribution: "Co-founder, Scale100x (public)",
  },
  {
    id: "jatin-solanki",
    name: "Executive Leadership",
    title: "Strategic Oversight",
    initials: "EL",
    roleKey: "cofounder",
    attribution: "Co-founder, Scale100x (public)",
  },
  {
    id: "pradnya-kaddi",
    name: "Business Lead",
    title: "Growth & pipeline",
    initials: "BL",
    roleKey: "business_head",
    attribution: "Marketing leadership, Scale100x (public profile)",
  },
  {
    id: "yash-dhruv",
    name: "Regional Operations",
    title: "Rollout & readiness",
    initials: "RO",
    roleKey: "regional_ops",
    attribution: "Capital & partnerships, Scale100x (public profile)",
  },
  {
    id: "ops-command-demo",
    name: "Operations Head",
    title: "Fleet & deployment (demo seat)",
    initials: "OH",
    roleKey: "ops_head",
    attribution: "Not a public individual — shared ops console",
  },
  {
    id: "cto-ai-demo",
    name: "CTO",
    title: "AI Systems Lead (demo seat)",
    initials: "CT",
    roleKey: "cto",
    attribution: "Not a public individual — engineering oversight view",
  },
];

export const defaultProfileId = "vivek-gupta";

export function welcomeForRole(role: RoleKey): string {
  const m: Record<RoleKey, string> = {
    ceo: "3 expansion risks need review today — Jaipur dependency, west dispatch, and DISCOM queue.",
    cofounder:
      "Network is growing with uneven execution — prioritize Jaipur recovery before Indore gate.",
    business_head:
      "Pipeline has 3 cities ready on paper but 2 are dependency-blocked; align GTM with ops reality.",
    ops_head:
      "Support backlog is up ~12% in the west cluster; dispatch and spare parts are the binding constraints.",
    regional_ops:
      "City rollout view: focus on onboarding slips and regulatory delays before pushing net-new signings.",
    cto: "AI fallback rate crossed internal threshold on onboarding workflows — tighten review queue before scaling automation.",
  };
  return m[role];
}

/** Short hint under page titles for mid-level readers */
export function roleReadingHint(role: RoleKey): string {
  const m: Record<RoleKey, string> = {
    ceo: "Full network view. Red badges need an owner this week.",
    cofounder: "Strategic + execution mix. Follow dependency tags before dates.",
    business_head: "Growth-first: cities, revenue, pipeline. Deep staffing is summarized only.",
    ops_head: "Day-to-day execution: tickets, people in the field, and install blockers.",
    regional_ops: "Rollout and partner readiness — fewer investor-style metrics on purpose.",
    cto: "Automation health, fallbacks, and deploy risk — not full P&L detail.",
  };
  return m[role];
}

export type NavPath = "/" | "/financial" | "/operations" | "/workforce" | "/insights";

export function isNavVisible(role: RoleKey, path: NavPath): boolean {
  if (role === "business_head" && path === "/workforce") return false;
  if (role === "cto" && path === "/financial") return false;
  if (role === "regional_ops" && (path === "/financial" || path === "/workforce")) return false;
  if (role === "ops_head" && path === "/financial") return true;
  return true;
}

export type CommandSection =
  | "kpis_all"
  | "kpis_exec"
  | "kpis_ops"
  | "kpis_cto"
  | "charts_revenue"
  | "cost_mix"
  | "burn_runway"
  | "financial_linkage"
  | "failure_signals"
  | "insights_feed";

export function commandSectionVisible(role: RoleKey, s: CommandSection): boolean {
  if (s === "insights_feed") return true;
  if (s === "kpis_all") return role === "ceo" || role === "cofounder";
  if (s === "kpis_exec") return role === "business_head" || role === "regional_ops";
  if (s === "kpis_ops") return role === "ops_head";
  if (s === "kpis_cto") return role === "cto";
  if (s === "charts_revenue") return !["ops_head", "cto"].includes(role);
  if (s === "cost_mix") return !["ops_head", "cto"].includes(role);
  if (s === "burn_runway") return !["ops_head", "cto"].includes(role);
  if (s === "financial_linkage") return ["ceo", "cofounder", "business_head"].includes(role);
  if (s === "failure_signals") return true;
  return true;
}

export function financialSectionVisible(
  role: RoleKey,
  section: "investor_kpis" | "op_cost_strip" | "pl_chart" | "staffing_detail" | "franchise_table",
): boolean {
  if (role === "ops_head" && section === "pl_chart") return false;
  if (role === "ops_head" && section === "franchise_table") return false;
  if (role === "business_head" && section === "staffing_detail") return false;
  if (
    role === "cto" &&
    (section === "investor_kpis" || section === "pl_chart" || section === "franchise_table")
  )
    return false;
  return true;
}

export function workforceSectionVisible(
  role: RoleKey,
  section: "charts" | "optimization",
): boolean {
  if (role === "business_head" && section === "optimization") return false;
  if (role === "business_head") return section === "charts";
  return true;
}
