/**
 * THE TAVAS COMPASS CAREER INTELLIGENCE FRAMEWORK™ — v1.0 (July 2026)
 * Career Signals — the framework belongs to Tavas Compass.
 * AI interprets. This system evaluates. Point values are fixed here and
 * are never assigned or adjusted by AI.
 *
 * Every signal carries its rationale (purpose / influences / reason).
 * Framework History: v1.0 initial — 16 signals, Compass Index, AI Exposure,
 * Alignment, True North, five report modes.
 */

export type Dimension =
  | "market"
  | "skill"
  | "adaptability"
  | "financial"
  | "momentum";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  market: "Market Position",
  skill: "Skill Currency",
  adaptability: "Adaptability",
  financial: "Financial Runway",
  momentum: "Momentum",
};

export interface StepOption {
  label: string;
  /** Fixed framework value. For profile/choice steps this is an identity code, not a score. */
  value: number;
}

export interface Step {
  id: string;
  /** profile = unscored input · signal = scored 0–4 · choice = unscored selector */
  kind: "profile" | "signal" | "choice";
  /** 1–16 for Career Signals */
  number?: number;
  name: string;
  expert?: string;
  prompt: string;
  options: StepOption[];
  dimension?: Dimension;
  /** Compass Index weight (default 1). Signal 12 = 0.5 per framework v1.0. */
  weight?: number;
}

export const steps: Step[] = [
  // ---------- PROFILE ----------
  {
    // Powers AI Exposure base rate + report personalization. Not scored.
    id: "p1",
    kind: "profile",
    name: "Your Field",
    prompt: "What best describes your current role?",
    options: [
      { label: "Office & Administration", value: 0 },
      { label: "Creative & Marketing", value: 1 },
      { label: "Technology", value: 2 },
      { label: "Healthcare", value: 3 },
      { label: "Skilled Trades", value: 4 },
      { label: "Education", value: 5 },
      { label: "Sales & Service", value: 6 },
      { label: "Leadership & Management", value: 7 },
      { label: "Finance & Legal", value: 8 },
      { label: "Other", value: 9 },
    ],
  },
  {
    // Personalizes report tone and benchmarks. Not scored.
    id: "p2",
    kind: "profile",
    name: "Your Experience",
    prompt: "How many years have you been in your field?",
    options: [
      { label: "Under 3 years", value: 0 },
      { label: "3–7 years", value: 1 },
      { label: "8–15 years", value: 2 },
      { label: "15+ years", value: 3 },
    ],
  },

  // ---------- CAREER SIGNALS ----------
  {
    // Purpose: external demand for the user's work.
    // Influences: Compass Index; urgency of Your Course; Headwinds.
    // Reason: effort cannot fully offset a shrinking market.
    id: "s1",
    kind: "signal",
    number: 1,
    name: "Market Demand",
    expert: "The Labor Economist",
    dimension: "market",
    prompt: "Is demand for what you do growing or shrinking?",
    options: [
      { label: "Growing — more openings and rising pay in my field", value: 4 },
      { label: "Steady — demand feels stable", value: 3 },
      { label: "Tightening — fewer postings, more competition", value: 1 },
      { label: "Shrinking — roles like mine are being cut or consolidated", value: 0 },
    ],
  },
  {
    // Purpose: share of work that is procedural and automatable.
    // Influences: Compass Index; AI Exposure; task-shift recommendations.
    // Reason: automation displaces tasks before jobs; routine share is the leading indicator.
    id: "s2",
    kind: "signal",
    number: 2,
    name: "Routine Exposure",
    expert: "The AI Strategist",
    dimension: "market",
    prompt: "How much of your typical workweek is routine — tasks that follow the same steps each time?",
    options: [
      { label: "Very little — mostly judgment, creativity, or people work", value: 4 },
      { label: "Maybe a quarter of it", value: 3 },
      { label: "About half", value: 1 },
      { label: "Most of it", value: 0 },
    ],
  },
  {
    // Purpose: active use of AI tools in real work.
    // Influences: Compass Index; AI Exposure (mitigator); learning priorities.
    // Reason: within the same role, daily AI users and avoiders face different futures.
    id: "s3",
    kind: "signal",
    number: 3,
    name: "AI Fluency",
    expert: "The AI Strategist",
    dimension: "market",
    prompt: "How often do you use AI tools in your actual work?",
    options: [
      { label: "Daily — they're part of how I work now", value: 4 },
      { label: "Weekly — I use them for certain tasks", value: 3 },
      { label: "I've tried them a few times", value: 1 },
      { label: "Rarely or never", value: 0 },
    ],
  },
  {
    // Purpose: whether opportunity can locate the user.
    // Influences: Compass Index; presence recommendations.
    // Reason: most opportunities surface via search and referral before posting.
    id: "s4",
    kind: "signal",
    number: 4,
    name: "Findability",
    expert: "The Recruiter",
    dimension: "market",
    prompt: "If a recruiter searched for someone like you today, would they find you?",
    options: [
      { label: "Yes — updated profile, clear results, active presence", value: 4 },
      { label: "Mostly — profile exists but it's a year or more out of date", value: 2 },
      { label: "Barely — a thin profile with job titles only", value: 1 },
      { label: "No real professional presence at all", value: 0 },
    ],
  },
  {
    // Purpose: whether decision-makers can see the user's value.
    // Influences: Compass Index; internal positioning; salary guidance.
    // Reason: budget and promotion decisions are made about known quantities.
    id: "s5",
    kind: "signal",
    number: 5,
    name: "Leadership Visibility",
    expert: "The Fortune 500 CEO",
    dimension: "skill",
    prompt: "How visible is the impact of your work to the people who decide budgets and promotions?",
    options: [
      { label: "Very — leadership knows what I deliver and what it's worth", value: 4 },
      { label: "Somewhat — my manager knows, leadership doesn't", value: 3 },
      { label: "Not very — my work is important but invisible", value: 1 },
      { label: "I honestly couldn't say what leadership knows about me", value: 0 },
    ],
  },
  {
    // Purpose: evidence-based career value.
    // Influences: Compass Index; resume recommendations; interview coaching; salary negotiation.
    // Reason: hiring managers evaluate demonstrated outcomes, not responsibilities held.
    id: "s6",
    kind: "signal",
    number: 6,
    name: "Provable Results",
    expert: "The Hiring Manager",
    dimension: "skill",
    prompt: "If asked in an interview tomorrow, could you point to three specific results you've delivered — with numbers?",
    options: [
      { label: "Easily — I track my wins", value: 4 },
      { label: "I could get there with some digging", value: 3 },
      { label: "I'd struggle — my work doesn't get measured that way", value: 1 },
      { label: "No — I've never framed my work as results", value: 0 },
    ],
  },
  {
    // Purpose: transferability of the skill base across fields.
    // Influences: Compass Index; Transferable Skills Review; reinvention feasibility.
    // Reason: portability separates a setback from a dead end.
    id: "s7",
    kind: "signal",
    number: 7,
    name: "Skill Portability",
    expert: "The Career Coach",
    dimension: "skill",
    prompt: "If you had to change careers tomorrow, how confident are you that your skills would transfer?",
    options: [
      { label: "Very confident — my skills apply to many fields", value: 4 },
      { label: "Somewhat confident — some would transfer", value: 3 },
      { label: "Not very confident — my skills feel specialized", value: 1 },
      { label: "I honestly don't know what would transfer", value: 0 },
    ],
  },
  {
    // Purpose: psychological adaptability to disruption.
    // Influences: Compass Index; pacing of Your Course.
    // Reason: identical plans fail or succeed on tolerance for transition.
    id: "s8",
    kind: "signal",
    number: 8,
    name: "Change Response",
    expert: "The I-O Psychologist",
    dimension: "adaptability",
    prompt: "When your industry or role changes unexpectedly, how do you usually respond?",
    options: [
      { label: "I adapt quickly and often find opportunity in it", value: 4 },
      { label: "I adjust after some initial stress", value: 3 },
      { label: "I find change draining and slow to navigate", value: 1 },
      { label: "I tend to feel stuck or anxious about it", value: 0 },
    ],
  },
  {
    // Purpose: trajectory inside the current organization.
    // Influences: Compass Index; internal-vs-external strategy split.
    // Reason: the best next move is often inside — or urgently outside; standing decides.
    id: "s9",
    kind: "signal",
    number: 9,
    name: "Internal Standing",
    expert: "The HR Executive",
    dimension: "adaptability",
    prompt: "Inside your current organization, how would your standing be described?",
    options: [
      { label: "Rising — recently promoted, stretched, or asked to lead", value: 4 },
      { label: "Solid — reliable, well-reviewed, in good graces", value: 3 },
      { label: "Flat — same role and scope for years", value: 1 },
      { label: "Exposed — restructures or new management have me uneasy", value: 0 },
    ],
  },
  {
    // Purpose: reachable relationships beyond the employer.
    // Influences: Compass Index; networking actions.
    // Reason: networks move opportunity before markets do.
    id: "s10",
    kind: "signal",
    number: 10,
    name: "Professional Network",
    expert: "The Recruiter",
    dimension: "adaptability",
    prompt: "How strong is your professional network outside your current employer?",
    options: [
      { label: "Strong — I could reach many people for opportunities", value: 4 },
      { label: "Moderate — a handful of useful connections", value: 3 },
      { label: "Weak — mostly limited to current coworkers", value: 1 },
      { label: "Almost nonexistent", value: 0 },
    ],
  },
  {
    // Purpose: time the user can sustain a transition.
    // Influences: Compass Index; risk tolerance of recommended moves.
    // Reason: runway converts career decisions from necessity to choice.
    id: "s11",
    kind: "signal",
    number: 11,
    name: "Financial Runway",
    expert: "The Financial Planner",
    dimension: "financial",
    prompt: "If your income stopped today, how long could you cover your essential expenses?",
    options: [
      { label: "6+ months", value: 4 },
      { label: "3–6 months", value: 3 },
      { label: "1–3 months", value: 1 },
      { label: "Less than 1 month", value: 0 },
    ],
  },
  {
    // Purpose: identifies the binding constraint on mobility. HALF WEIGHT.
    // Influences: Compass Index (0.5); constraint-aware filtering of recommendations.
    // Reason: advice that ignores real constraints is advice the user cannot take.
    // The constraint is addressed, never judged.
    id: "s12",
    kind: "signal",
    number: 12,
    name: "Freedom to Move",
    expert: "The Financial Planner",
    dimension: "financial",
    weight: 0.5,
    prompt: "If a better opportunity appeared tomorrow, what would most likely prevent you from taking it?",
    options: [
      { label: "Nothing — I could move on it", value: 4 },
      { label: "Location", value: 2 },
      { label: "Family commitments", value: 2 },
      { label: "Financial obligations", value: 1 },
      { label: "Health", value: 1 },
      { label: "Something else", value: 2 },
    ],
  },
  {
    // Purpose: recency and habit of deliberate skill acquisition.
    // Influences: Compass Index; learning priorities; certifications.
    // Reason: the habit of learning outlasts any single skill.
    id: "s13",
    kind: "signal",
    number: 13,
    name: "Learning Momentum",
    expert: "The Career Coach",
    dimension: "momentum",
    prompt: "When did you last intentionally learn a new skill for your career?",
    options: [
      { label: "Within the last 3 months", value: 4 },
      { label: "Within the last year", value: 3 },
      { label: "1–3 years ago", value: 1 },
      { label: "I can't remember", value: 0 },
    ],
  },
  {
    // Purpose: whether the user has a direction and a plan.
    // Influences: Compass Index; how directive vs. exploratory the report is.
    // Reason: execution advice serves the directed; discovery advice serves the searching.
    id: "s14",
    kind: "signal",
    number: 14,
    name: "Three-Year Clarity",
    expert: "The Fortune 500 CEO",
    dimension: "momentum",
    prompt: "Do you have a clear picture of where you want to be professionally in three years?",
    options: [
      { label: "Yes — and a plan I'm actively working", value: 4 },
      { label: "A picture, but no real plan yet", value: 2 },
      { label: "Only a vague sense", value: 1 },
      { label: "No — that's what I'm hoping to find out", value: 0 },
    ],
  },
  {
    // Purpose: fulfillment, measured separately from resilience. NOT in the Index.
    // Influences: report tone; Climb-vs-Reinvent tension; check-in focus.
    // Reason: Index 91 + Alignment Strong needs optimization;
    // Index 91 + Alignment Strained needs permission. Different reports.
    id: "s15",
    kind: "signal",
    number: 15,
    name: "Alignment",
    expert: "The Career Coach",
    prompt: "How fulfilled do you feel by your current work?",
    options: [
      { label: "I genuinely enjoy what I do", value: 3 },
      { label: "Mostly satisfied", value: 2 },
      { label: "Mixed feelings", value: 1 },
      { label: "I dread Mondays", value: 0 },
    ],
  },
  {
    // Purpose: the user's stated ambition — the sixteenth expert speaks. Unscored.
    // Influences: reorders every recommendation in the report.
    // Reason: identical scores with different ambitions must produce different reports.
    id: "s16a",
    kind: "choice",
    number: 16,
    name: "True North",
    expert: "You",
    prompt: "What matters most to you over the next three years?",
    options: [
      { label: "Higher income", value: 0 },
      { label: "Better work-life balance", value: 1 },
      { label: "Leadership", value: 2 },
      { label: "A career change", value: 3 },
      { label: "Business ownership", value: 4 },
      { label: "Stability", value: 5 },
      { label: "Remote work", value: 6 },
      { label: "Earlier retirement", value: 7 },
    ],
  },
  {
    // Purpose: the user's present stance. Selects the report mode. Unscored.
    // Influences: one of five report modes — Climb / Defend / Reinvent / Rebuild / Land.
    // Reason: the user is the sixteenth expert.
    id: "s16b",
    kind: "choice",
    number: 16,
    name: "True North",
    expert: "You",
    prompt: "Which statement feels most true today?",
    options: [
      { label: "I'm trying to move up", value: 0 },
      { label: "I'm trying to stay relevant", value: 1 },
      { label: "I'm trying to reinvent my career", value: 2 },
      { label: "I'm trying to recover from a setback", value: 3 },
      { label: "I'm planning for retirement", value: 4 },
    ],
  },
];

export const SIGNAL_COUNT = 16;
