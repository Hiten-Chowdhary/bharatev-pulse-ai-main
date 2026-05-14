export const revenueTrend = [
  { m: "Jan", revenue: 42, ebitda: 8, target: 40 },
  { m: "Feb", revenue: 48, ebitda: 10, target: 45 },
  { m: "Mar", revenue: 55, ebitda: 13, target: 50 },
  { m: "Apr", revenue: 61, ebitda: 16, target: 55 },
  { m: "May", revenue: 68, ebitda: 18, target: 62 },
  { m: "Jun", revenue: 74, ebitda: 21, target: 68 },
  { m: "Jul", revenue: 82, ebitda: 24, target: 75 },
  { m: "Aug", revenue: 88, ebitda: 27, target: 82 },
  { m: "Sep", revenue: 95, ebitda: 31, target: 88 },
  { m: "Oct", revenue: 104, ebitda: 35, target: 95 },
  { m: "Nov", revenue: 112, ebitda: 39, target: 102 },
  { m: "Dec", revenue: 124, ebitda: 44, target: 110 },
];

export const costBreakdown = [
  { name: "Human Ops", value: 38, color: "var(--chart-1)" },
  { name: "AI Tooling", value: 12, color: "var(--chart-2)" },
  { name: "Infrastructure", value: 22, color: "var(--chart-3)" },
  { name: "Marketing", value: 14, color: "var(--chart-4)" },
  { name: "G&A", value: 14, color: "var(--chart-5)" },
];

export const aiVsHuman = [
  { name: "AI Automated", value: 76 },
  { name: "Human Operated", value: 24 },
];

export const humanCosts = [
  { role: "Franchise Managers", count: 42, monthly: 18.4 },
  { role: "Support Teams", count: 86, monthly: 22.1 },
  { role: "Operations Staff", count: 64, monthly: 19.8 },
  { role: "Sales Teams", count: 38, monthly: 14.6 },
  { role: "Field Engineers", count: 51, monthly: 16.2 },
];

export const aiCosts = [
  { tool: "Claude (Anthropic)", monthly: 4.2, coverage: "Reasoning, ops summaries" },
  { tool: "OpenAI GPT", monthly: 3.6, coverage: "Support copilots" },
  { tool: "Gemini", monthly: 1.4, coverage: "Doc/vision tasks" },
  { tool: "WhatsApp Automation", monthly: 1.1, coverage: "Franchise comms" },
  { tool: "Voice AI (IVR)", monthly: 0.9, coverage: "Inbound triage" },
  { tool: "CRM Automation", monthly: 0.8, coverage: "Pipeline + handoff" },
];

export const franchises = [
  { city: "Bengaluru", state: "KA", status: "Active", health: 92, revenue: 14.2, adoption: 88, infra: 90, alert: null },
  { city: "Pune", state: "MH", status: "Active", health: 71, revenue: 9.8, adoption: 84, infra: 62, alert: "Support staffing under capacity" },
  { city: "Hyderabad", state: "TG", status: "Active", health: 88, revenue: 12.4, adoption: 80, infra: 86, alert: null },
  { city: "Chennai", state: "TN", status: "Active", health: 85, revenue: 11.1, adoption: 79, infra: 82, alert: null },
  { city: "Delhi NCR", state: "DL", status: "Active", health: 90, revenue: 16.6, adoption: 82, infra: 88, alert: null },
  { city: "Mumbai", state: "MH", status: "Active", health: 87, revenue: 15.3, adoption: 78, infra: 85, alert: null },
  { city: "Ahmedabad", state: "GJ", status: "Active", health: 78, revenue: 7.9, adoption: 70, infra: 74, alert: null },
  { city: "Jaipur", state: "RJ", status: "Onboarding", health: 54, revenue: 2.1, adoption: 66, infra: 41, alert: "Charging infra readiness delayed" },
  { city: "Kochi", state: "KL", status: "Onboarding", health: 61, revenue: 1.8, adoption: 72, infra: 58, alert: null },
  { city: "Indore", state: "MP", status: "Pipeline", health: 0, revenue: 0, adoption: 64, infra: 49, alert: null },
  { city: "Lucknow", state: "UP", status: "Pipeline", health: 0, revenue: 0, adoption: 59, infra: 44, alert: null },
  { city: "Coimbatore", state: "TN", status: "Pipeline", health: 0, revenue: 0, adoption: 68, infra: 52, alert: null },
];

export const insights = [
  { tag: "Profitability", title: "Tier-2 franchises outperform Tier-1 on margin",
    body: "Tier-2 cities are showing 6.4pp higher operational margin driven by lower rent + AI-handled support. Recommend reallocating 8% of expansion budget to Tier-2.", severity: "info" },
  { tag: "Risk", title: "Support escalations up 14% MoM",
    body: "Spike concentrated in Pune and Ahmedabad. AI triage covered 71% of tickets; remainder bottlenecked on field engineer dispatch. Recommend 6 additional FEs in west zone.", severity: "warning" },
  { tag: "AI Ops", title: "Onboarding TAT reduced from 21 → 9 days",
    body: "AI-assisted documentation and KYC workflows cut franchise onboarding TAT by 57%. Projected annual savings: ₹3.8 Cr.", severity: "success" },
  { tag: "Expansion", title: "Coimbatore + Indore ready for activation",
    body: "Adoption potential and infra readiness scores both crossed activation threshold. Recommend Q1 launch with shared regional ops pod.", severity: "info" },
  { tag: "Recovery", title: "Jaipur loss-making for 3 consecutive months",
    body: "Recommend staffing optimization (-2 ops), localized WhatsApp campaigns, and partial AI takeover of inbound support to restore unit economics within 60 days.", severity: "danger" },
];

export const alerts = [
  { level: "danger", text: "Jaipur franchise: 3rd consecutive loss-making month — recovery plan required" },
  { level: "warning", text: "Pune support tickets +14% — staffing review recommended" },
  { level: "info", text: "AI onboarding workflow saved 12 days TAT in October" },
];

export const burnRunway = [
  { m: "Jan", burn: 28, runway: 22 },
  { m: "Feb", burn: 30, runway: 21 },
  { m: "Mar", burn: 31, runway: 21 },
  { m: "Apr", burn: 33, runway: 20 },
  { m: "May", burn: 34, runway: 20 },
  { m: "Jun", burn: 35, runway: 19 },
  { m: "Jul", burn: 36, runway: 19 },
  { m: "Aug", burn: 37, runway: 18 },
  { m: "Sep", burn: 38, runway: 18 },
  { m: "Oct", burn: 39, runway: 17 },
];

export const automationByWorkflow = [
  { workflow: "Onboarding", ai: 82, human: 18 },
  { workflow: "Support L1", ai: 88, human: 12 },
  { workflow: "Support L2", ai: 54, human: 46 },
  { workflow: "Field Dispatch", ai: 41, human: 59 },
  { workflow: "Billing", ai: 92, human: 8 },
  { workflow: "Compliance", ai: 76, human: 24 },
];
