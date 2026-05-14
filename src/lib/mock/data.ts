/** Mock operational + financial intelligence — prototype dashboard data only */

export type FranchiseStatus = "Active" | "Onboarding" | "Pipeline";

export type FranchiseRegion = "North" | "West" | "South" | "Central";

export type FranchiseRow = {
  city: string;
  state: string;
  /** 0–100 SVG map position */
  mapX: number;
  mapY: number;
  region: FranchiseRegion;
  status: FranchiseStatus;
  health: number;
  revenue: number;
  adoption: number;
  infra: number;
  alert: string | null;
  /** Days behind internal onboarding SLA */
  onboardingSlipDays: number;
  chargingDependency: "stable" | "fragile" | "blocked";
  marketSaturation: "normal" | "elevated" | "high";
  staffingGap: string | null;
  dependencyAlert: string | null;
  deployBottleneck: boolean;
  regionalUnderperform: boolean;
  /** 0–100, higher = more operational risk */
  riskScore: number;
  marginVolatility: "low" | "moderate" | "high";
  failedActivationsYtd: number;
  regulatoryDelayWeeks: number;
  supportBacklog: number;
  aiLowConfidencePct: number;
  humanFallbackPct: number;
};

export type InsightCategory =
  | "operational_risk"
  | "expansion"
  | "ai_recommendation"
  | "staffing_alerts"
  | "financial_risk";

export type ImpactLevel = "critical" | "high" | "medium" | "low";
export type EscalationStatus = "open" | "owned" | "watch" | "clearing";

export type ExecutiveInsight = {
  tag: string;
  title: string;
  body: string;
  severity: "danger" | "warning" | "success" | "info";
  /** Model / heuristic confidence — intentionally imperfect */
  confidence: number;
  actions: string[];
  category: InsightCategory;
  impactLevel: ImpactLevel;
  affectedCities: string[];
  escalationStatus: EscalationStatus;
  /** One-line “what to do” for cards */
  shortRecommendation: string;
};

/** Revenue in ₹ Cr — includes a believable operational dip (May infra churn) */
export const revenueTrend = [
  { m: "Jan", revenue: 41, ebitda: 7.6, target: 40 },
  { m: "Feb", revenue: 46, ebitda: 9.2, target: 45 },
  { m: "Mar", revenue: 53, ebitda: 11.4, target: 50 },
  { m: "Apr", revenue: 59, ebitda: 14.1, target: 55 },
  { m: "May", revenue: 56, ebitda: 12.8, target: 62 },
  { m: "Jun", revenue: 62, ebitda: 15.9, target: 68 },
  { m: "Jul", revenue: 69, ebitda: 17.2, target: 75 },
  { m: "Aug", revenue: 76, ebitda: 20.1, target: 82 },
  { m: "Sep", revenue: 81, ebitda: 22.4, target: 88 },
  { m: "Oct", revenue: 88, ebitda: 25.6, target: 95 },
  { m: "Nov", revenue: 94, ebitda: 28.9, target: 102 },
  { m: "Dec", revenue: 102, ebitda: 31.2, target: 110 },
];

export const costBreakdown = [
  { name: "Human Ops", value: 41, color: "var(--chart-1)" },
  { name: "AI Tooling", value: 11, color: "var(--chart-2)" },
  { name: "Infrastructure", value: 24, color: "var(--chart-3)" },
  { name: "Marketing", value: 12, color: "var(--chart-4)" },
  { name: "G&A", value: 12, color: "var(--chart-5)" },
];

/** Share of resolved workflow volume — remainder is human / hybrid */
export const aiVsHuman = [
  { name: "AI / Assisted", value: 58 },
  { name: "Human / Override", value: 42 },
];

export const humanCosts = [
  { role: "Franchise Managers", count: 44, monthly: 18.9 },
  { role: "Support Teams", count: 91, monthly: 23.4 },
  { role: "Operations Staff", count: 66, monthly: 20.2 },
  { role: "Sales Teams", count: 37, monthly: 14.9 },
  { role: "Field Engineers", count: 48, monthly: 15.8 },
];

export const aiCosts = [
  { tool: "Claude (Anthropic)", monthly: 4.4, coverage: "Exec briefs, low-confidence review queue" },
  { tool: "OpenAI GPT", monthly: 3.8, coverage: "Support copilots, draft responses" },
  { tool: "Gemini", monthly: 1.5, coverage: "Doc + site-survey vision checks" },
  { tool: "WhatsApp Automation", monthly: 1.2, coverage: "Franchise comms, SLA nudges" },
  { tool: "Voice AI (IVR)", monthly: 0.95, coverage: "Inbound triage — high fallback in west" },
  { tool: "CRM Automation", monthly: 0.85, coverage: "Pipeline + handoff" },
];

export const franchises: FranchiseRow[] = [
  {
    city: "Bengaluru", state: "KA", mapX: 54, mapY: 74, region: "South", status: "Active", health: 84, revenue: 14.2, adoption: 86, infra: 82,
    alert: "Charging hub B scheduled maintenance — 36h degraded capacity",
    onboardingSlipDays: 0, chargingDependency: "stable", marketSaturation: "elevated", staffingGap: null,
    dependencyAlert: "Third-party CMS API version skew on billing webhook",
    deployBottleneck: false, regionalUnderperform: false, riskScore: 38, marginVolatility: "moderate",
    failedActivationsYtd: 0, regulatoryDelayWeeks: 0, supportBacklog: 42, aiLowConfidencePct: 11, humanFallbackPct: 19,
  },
  {
    city: "Pune", state: "MH", mapX: 36, mapY: 56, region: "West", status: "Active", health: 66, revenue: 9.4, adoption: 81, infra: 54,
    alert: "Support backlog + staffing gap — L2 escalation rate 1.9× network avg",
    onboardingSlipDays: 0, chargingDependency: "fragile", marketSaturation: "normal", staffingGap: "−4 L1, −2 FE west",
    dependencyAlert: "Field dispatch queue blocked on spare transformer lead time (14d)",
    deployBottleneck: true, regionalUnderperform: true, riskScore: 72, marginVolatility: "high",
    failedActivationsYtd: 1, regulatoryDelayWeeks: 0, supportBacklog: 186, aiLowConfidencePct: 22, humanFallbackPct: 34,
  },
  {
    city: "Hyderabad", state: "TG", mapX: 48, mapY: 62, region: "South", status: "Active", health: 80, revenue: 12.1, adoption: 77, infra: 79,
    alert: null,
    onboardingSlipDays: 0, chargingDependency: "stable", marketSaturation: "normal", staffingGap: null,
    dependencyAlert: null,
    deployBottleneck: false, regionalUnderperform: false, riskScore: 44, marginVolatility: "low",
    failedActivationsYtd: 0, regulatoryDelayWeeks: 0, supportBacklog: 61, aiLowConfidencePct: 14, humanFallbackPct: 21,
  },
  {
    city: "Chennai", state: "TN", mapX: 56, mapY: 78, region: "South", status: "Active", health: 78, revenue: 10.8, adoption: 74, infra: 76,
    alert: "Regional saturation warning — fleet CAC up 11% QoQ",
    onboardingSlipDays: 0, chargingDependency: "stable", marketSaturation: "high", staffingGap: null,
    dependencyAlert: null,
    deployBottleneck: false, regionalUnderperform: false, riskScore: 52, marginVolatility: "moderate",
    failedActivationsYtd: 0, regulatoryDelayWeeks: 0, supportBacklog: 74, aiLowConfidencePct: 16, humanFallbackPct: 24,
  },
  {
    city: "Delhi NCR", state: "DL", mapX: 44, mapY: 30, region: "North", status: "Active", health: 82, revenue: 16.2, adoption: 79, infra: 80,
    alert: "Regulatory filing queue delay — 2 franchises awaiting DISCOM sign-off",
    onboardingSlipDays: 0, chargingDependency: "fragile", marketSaturation: "elevated", staffingGap: "−1 compliance lead",
    dependencyAlert: "Manual override spike on KYC edge cases (PAN/Aadhaar mismatch)",
    deployBottleneck: false, regionalUnderperform: false, riskScore: 49, marginVolatility: "moderate",
    failedActivationsYtd: 2, regulatoryDelayWeeks: 5, supportBacklog: 98, aiLowConfidencePct: 19, humanFallbackPct: 28,
  },
  {
    city: "Mumbai", state: "MH", mapX: 34, mapY: 52, region: "West", status: "Active", health: 79, revenue: 14.9, adoption: 75, infra: 78,
    alert: "Infra maintenance spike — transformer vendor pass-through +₹18L this quarter",
    onboardingSlipDays: 0, chargingDependency: "stable", marketSaturation: "elevated", staffingGap: null,
    dependencyAlert: null,
    deployBottleneck: false, regionalUnderperform: false, riskScore: 46, marginVolatility: "high",
    failedActivationsYtd: 1, regulatoryDelayWeeks: 2, supportBacklog: 112, aiLowConfidencePct: 17, humanFallbackPct: 26,
  },
  {
    city: "Ahmedabad", state: "GJ", mapX: 28, mapY: 48, region: "West", status: "Active", health: 71, revenue: 7.6, adoption: 67, infra: 68,
    alert: "AI triage confidence down — manual verification temporarily increased",
    onboardingSlipDays: 0, chargingDependency: "fragile", marketSaturation: "normal", staffingGap: "−2 support (attrition)",
    dependencyAlert: "CRM ↔ onboarding service version conflict — hotfix rolled back once",
    deployBottleneck: true, regionalUnderperform: true, riskScore: 64, marginVolatility: "moderate",
    failedActivationsYtd: 1, regulatoryDelayWeeks: 0, supportBacklog: 131, aiLowConfidencePct: 27, humanFallbackPct: 39,
  },
  {
    city: "Jaipur", state: "RJ", mapX: 32, mapY: 40, region: "West", status: "Onboarding", health: 48, revenue: 1.9, adoption: 61, infra: 36,
    alert: "Charging infra downtime + staffing shortage — hybrid onboarding required",
    onboardingSlipDays: 23, chargingDependency: "blocked", marketSaturation: "normal", staffingGap: "−3 FE, −2 onboarding",
    dependencyAlert: "DISCOM feeder upgrade slipped — dependency on landlord transformer",
    deployBottleneck: true, regionalUnderperform: true, riskScore: 88, marginVolatility: "high",
    failedActivationsYtd: 2, regulatoryDelayWeeks: 6, supportBacklog: 54, aiLowConfidencePct: 34, humanFallbackPct: 52,
  },
  {
    city: "Kochi", state: "KL", mapX: 42, mapY: 86, region: "South", status: "Onboarding", health: 56, revenue: 1.6, adoption: 69, infra: 52,
    alert: "Onboarding delayed — Kerala EV policy clarification pending",
    onboardingSlipDays: 14, chargingDependency: "fragile", marketSaturation: "normal", staffingGap: "−1 regional ops",
    dependencyAlert: null,
    deployBottleneck: false, regionalUnderperform: false, riskScore: 69, marginVolatility: "moderate",
    failedActivationsYtd: 1, regulatoryDelayWeeks: 4, supportBacklog: 38, aiLowConfidencePct: 21, humanFallbackPct: 41,
  },
  {
    city: "Indore", state: "MP", mapX: 40, mapY: 46, region: "Central", status: "Pipeline", health: 0, revenue: 0, adoption: 62, infra: 46,
    alert: null,
    onboardingSlipDays: 0, chargingDependency: "fragile", marketSaturation: "normal", staffingGap: "Hiring freeze on FE until Q2",
    dependencyAlert: "Expansion rollout delayed — charger OEM allocation conflict with Jaipur recovery",
    deployBottleneck: true, regionalUnderperform: false, riskScore: 58, marginVolatility: "moderate",
    failedActivationsYtd: 0, regulatoryDelayWeeks: 0, supportBacklog: 0, aiLowConfidencePct: 0, humanFallbackPct: 0,
  },
  {
    city: "Lucknow", state: "UP", mapX: 50, mapY: 38, region: "North", status: "Pipeline", health: 0, revenue: 0, adoption: 56, infra: 41,
    alert: null,
    onboardingSlipDays: 0, chargingDependency: "fragile", marketSaturation: "normal", staffingGap: null,
    dependencyAlert: "Land acquisition slower than model — push Q3 vs Q2 gate",
    deployBottleneck: false, regionalUnderperform: false, riskScore: 55, marginVolatility: "low",
    failedActivationsYtd: 0, regulatoryDelayWeeks: 0, supportBacklog: 0, aiLowConfidencePct: 0, humanFallbackPct: 0,
  },
  {
    city: "Coimbatore", state: "TN", mapX: 50, mapY: 82, region: "South", status: "Pipeline", health: 0, revenue: 0, adoption: 65, infra: 49,
    alert: null,
    onboardingSlipDays: 0, chargingDependency: "stable", marketSaturation: "elevated", staffingGap: null,
    dependencyAlert: null,
    deployBottleneck: false, regionalUnderperform: false, riskScore: 41, marginVolatility: "low",
    failedActivationsYtd: 0, regulatoryDelayWeeks: 0, supportBacklog: 0, aiLowConfidencePct: 0, humanFallbackPct: 0,
  },
];

export const franchiseDependencyEdges: { fromCity: string; toCity: string; label: string }[] = [
  { fromCity: "Jaipur", toCity: "Indore", label: "Charger OEM allocation" },
  { fromCity: "Pune", toCity: "Ahmedabad", label: "West escalation / dispatch" },
  { fromCity: "Delhi NCR", toCity: "Jaipur", label: "Regulatory playbook share" },
];

export const insights: ExecutiveInsight[] = [
  {
    tag: "Recovery · Jaipur",
    title: "Franchise recovery: stabilize charging + verification path",
    body: "Jaipur has shown declining operational efficiency for 3 consecutive months due to charging infra instability and support staffing shortage. Unit economics will not hold without a deliberate recovery sprint.",
    severity: "danger",
    confidence: 72,
    category: "operational_risk",
    impactLevel: "critical",
    affectedCities: ["Jaipur"],
    escalationStatus: "open",
    shortRecommendation: "Hybrid verification + temporary support redeploy until infra uptime recovers.",
    actions: [
      "Temporarily increase manual verification for Jaipur onboarding pipeline (KYC + site readiness).",
      "Redistribute 2 regional support leads from Chennai pod to Jaipur for 6 weeks.",
      "Pause AI-heavy auto-approval on onboarding until infra uptime > 92% for 14 days.",
    ],
  },
  {
    tag: "Dispatch · West",
    title: "Clear Pune West cluster backlog before monsoon FE surge",
    body: "Escalations are concentrated in Pune and Ahmedabad with field dispatch as the binding constraint — not ticket volume alone.",
    severity: "warning",
    confidence: 76,
    category: "staffing_alerts",
    impactLevel: "high",
    affectedCities: ["Pune", "Ahmedabad"],
    escalationStatus: "owned",
    shortRecommendation: "Add contract field engineers and daily war-room triage on top L2 tickets.",
    actions: [
      "Deploy 2 additional field engineers in Pune West cluster (contract-to-hire).",
      "Route top 15% L2 tickets through human war-room triage twice daily until backlog < 80.",
      "Shift onboarding workload for MH-GJ corridor to shared regional ops pod.",
    ],
  },
  {
    tag: "AI Ops",
    title: "Reduce automation dependency on low-confidence onboarding flows",
    body: "Network-wide AI low-confidence cases rose after document edge-case policy change. Savings remain real, but execution risk is rising in onboarding and L1.",
    severity: "warning",
    confidence: 68,
    category: "ai_recommendation",
    impactLevel: "high",
    affectedCities: ["Ahmedabad", "Delhi NCR"],
    escalationStatus: "watch",
    shortRecommendation: "Cap auto-approval and add a small human verification bench before next model push.",
    actions: [
      "Reduce AI automation dependency for low-confidence onboarding flows — cap auto-pass at 68% until retrain ships.",
      "Stand up a 3-person verification bench for PAN/Aadhaar mismatch queue (Delhi + remote).",
      "Track AI operational savings weekly vs escalation cost — freeze new AI spend if net < ₹12L/mo.",
    ],
  },
  {
    tag: "Expansion",
    title: "Sequence Indore after Jaipur dependency clears",
    body: "Deployment pipeline has an OEM allocation conflict; activating Indore on schedule would starve Jaipur recovery and increase rollback risk.",
    severity: "info",
    confidence: 74,
    category: "expansion",
    impactLevel: "medium",
    affectedCities: ["Indore", "Jaipur"],
    escalationStatus: "clearing",
    shortRecommendation: "Gate Indore launch on Jaipur charger milestone to avoid double failure.",
    actions: [
      "Gate Indore go-live on Jaipur charger install milestone (target: 21 days).",
      "Use Coimbatore as southern buffer market with shared ops pod — lower capex coupling.",
    ],
  },
  {
    tag: "Financial",
    title: "Contain operational cost leakage in support + infra",
    body: "Support escalation cost and infra maintenance spikes explain most of the margin variance vs plan in the last 60 days — not revenue softness.",
    severity: "warning",
    confidence: 71,
    category: "financial_risk",
    impactLevel: "high",
    affectedCities: ["Mumbai", "Pune"],
    escalationStatus: "watch",
    shortRecommendation: "Dual-source infra vendor and track escalation rupees per city weekly.",
    actions: [
      "Instrument escalation cost per city — chargeback 20% of L2 cost to franchise P&L where SLA miss is local.",
      "Negotiate transformer maintenance cap with vendor or dual-source for Mumbai + Pune.",
    ],
  },
  {
    tag: "Regulatory",
    title: "Unblock DISCOM queue for Delhi NCR onboarding",
    body: "Two franchises are stuck in regulatory approval with predictable cash conversion delay.",
    severity: "info",
    confidence: 79,
    category: "operational_risk",
    impactLevel: "medium",
    affectedCities: ["Delhi NCR"],
    escalationStatus: "owned",
    shortRecommendation: "Weekly DISCOM cadence + one named owner for each pending feeder file.",
    actions: [
      "Assign dedicated regulatory liaison + weekly DISCOM office cadence for pending feeders.",
      "Communicate revised onboarding TAT to partners with SLA exceptions documented.",
    ],
  },
];

export const alerts = [
  { level: "danger" as const, text: "Jaipur: charging infra downtime + 23d onboarding slip — recovery workflow active" },
  { level: "warning" as const, text: "Operational cost leakage: support escalations + infra spikes ≈ ₹42L vs plan (60d)" },
  { level: "warning" as const, text: "Pune West: deployment bottleneck — FE spare parts lead time blocking 11 dispatches" },
  { level: "info" as const, text: "AI-assisted paths saved est. ₹2.9 Cr YTD — offset partially by higher human fallback in west" },
];

export const burnRunway = [
  { m: "Jan", burn: 29, runway: 21 },
  { m: "Feb", burn: 31, runway: 20 },
  { m: "Mar", burn: 30, runway: 21 },
  { m: "Apr", burn: 33, runway: 19 },
  { m: "May", burn: 35, runway: 18 },
  { m: "Jun", burn: 34, runway: 19 },
  { m: "Jul", burn: 36, runway: 18 },
  { m: "Aug", burn: 37, runway: 17 },
  { m: "Sep", burn: 38, runway: 17 },
  { m: "Oct", burn: 39, runway: 16 },
];

export const automationByWorkflow = [
  { workflow: "Onboarding", ai: 61, human: 39 },
  { workflow: "Support L1", ai: 71, human: 29 },
  { workflow: "Support L2", ai: 44, human: 56 },
  { workflow: "Field Dispatch", ai: 36, human: 64 },
  { workflow: "Billing", ai: 84, human: 16 },
  { workflow: "Compliance", ai: 58, human: 42 },
];

export const failureSignals = [
  { label: "Failed onboarding", value: "6.1", suffix: "%", detail: "target 3.5%" },
  { label: "Manual override", value: "18", suffix: "%", detail: "onboarding + KYC" },
  { label: "AI escalation rate", value: "12.4", suffix: "%", detail: "L1 → L2" },
  { label: "Unresolved support", value: "312", suffix: "tix", detail: "> 48h SLA" },
  { label: "Failed activations (YTD)", value: "7", suffix: "", detail: "network" },
  { label: "Deploy rollbacks (90d)", value: "4", suffix: "", detail: "onboarding stack" },
  { label: "Low-confidence workflow", value: "21", suffix: "%", detail: "rolling 30d" },
  { label: "Support overload days", value: "9", suffix: "/qtr", detail: "sites >120% capacity" },
];

export const financialIntelligence = {
  costLeakageLakh: 42,
  costLeakageNote: "escalations + vendor pass-through vs budget",
  infraMaintenanceSpikeLakh: 18,
  aiToolingRoiMultiple: 2.9,
  staffingUtilizationPct: 78,
  franchiseMarginVolatilityNote: "σ +4.1pp vs prior quarter",
  highBurnZones: "Pune, Jaipur, Ahmedabad",
  escalationCostImpactLakh: 26,
  aiOperationalSavingsCr: 2.9,
  aiVsManpowerDeltaNote: "AI saves ₹2.9 Cr YTD; human fallback cost ₹1.1 Cr (est.)",
};

export const predictiveRisks = [
  "Pune staffing overload risk in 45d: FE utilization already 112% — without hires, SLA breach probability ~38%.",
  "Jaipur: 68% chance of another activation miss if DISCOM + landlord transformer path is not owned by a single DRI this week.",
  "Mumbai margin volatility tied to infra vendor spikes — hedge with dual-source RFP before monsoon maintenance window.",
  "AI low-confidence cluster in Ahmedabad: projected 11% increase in manual queue next month if policy exceptions persist.",
];

export const expansionCandidates = [
  { c: "Coimbatore", s: 79, why: "Strong adoption signal but elevated saturation — need differentiated site strategy" },
  { c: "Indore", s: 72, why: "Tier-2 margin upside; blocked by deployment dependency conflict with Jaipur recovery" },
  { c: "Lucknow", s: 66, why: "Demand credible; land + regulatory timeline risk — model as Q3 gate not Q2" },
  { c: "Surat", s: 63, why: "Fleet-led demand; local staffing pool thin — plan co-employed FE bench" },
];

export function franchiseOpsCounts() {
  const active = franchises.filter((f) => f.status === "Active").length;
  const onboarding = franchises.filter((f) => f.status === "Onboarding").length;
  const delayedOnboarding = franchises.filter((f) => f.status === "Onboarding" && f.onboardingSlipDays >= 10).length;
  const pipeline = franchises.filter((f) => f.status === "Pipeline").length;
  return { active, onboarding, delayedOnboarding, pipeline };
}
