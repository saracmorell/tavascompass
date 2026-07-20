/**
 * Tavas Compass Career Intelligence Framework™ v1.0 — scoring engine.
 * All values are deterministic and fixed by the framework.
 * AI interprets; this system evaluates.
 */
import { steps, DIMENSION_LABELS, type Dimension } from "@/data/signals";

export interface DimensionScore {
  dimension: Dimension;
  label: string;
  /** 0–100 */
  score: number;
}

export type Band = "Strong" | "Developing" | "Vulnerable";
export type Alignment = "Strong" | "Steady" | "Mixed" | "Strained";
export type AiExposure = "Low" | "Moderate" | "Elevated";
export type Mode = "Climb" | "Defend" | "Reinvent" | "Rebuild" | "Land";

export interface SummaryResult {
  /** Compass Index, 0–100 */
  overall: number;
  band: Band;
  dimensions: DimensionScore[];
  strengths: DimensionScore[];
  risks: DimensionScore[];
  alignment: Alignment;
  aiExposure: AiExposure;
  mode: Mode;
  ambition: string;
  roleFamily: string;
  tenure: string;
  /** Raw answers (option index per step id) — the anonymous answer vector for the Learning Loop. */
  answers: Record<string, number>;
}

/** Answers are stored as the INDEX of the chosen option per step id. */
export function scoreAnswers(answers: Record<string, number>): SummaryResult {
  const byId = new Map(steps.map((s) => [s.id, s]));
  const pick = (id: string) => {
    const step = byId.get(id)!;
    const idx = answers[id] ?? 0;
    return step.options[Math.min(idx, step.options.length - 1)];
  };

  // ----- Compass Index: Signals 1–14 (S12 half weight), scaled 0–100 -----
  const byDimension = new Map<Dimension, { earned: number; possible: number }>();
  let earnedTotal = 0;
  let possibleTotal = 0;

  for (const s of steps) {
    if (s.kind !== "signal" || !s.dimension) continue; // s15 excluded (no dimension)
    const w = s.weight ?? 1;
    const max = Math.max(...s.options.map((o) => o.value));
    const v = pick(s.id).value;
    earnedTotal += v * w;
    possibleTotal += max * w;
    const agg = byDimension.get(s.dimension) ?? { earned: 0, possible: 0 };
    agg.earned += v * w;
    agg.possible += max * w;
    byDimension.set(s.dimension, agg);
  }

  const overall = Math.round((earnedTotal / possibleTotal) * 100);
  const band: Band = overall >= 70 ? "Strong" : overall >= 45 ? "Developing" : "Vulnerable";

  const dimensions: DimensionScore[] = [...byDimension.entries()].map(
    ([dimension, { earned, possible }]) => ({
      dimension,
      label: DIMENSION_LABELS[dimension],
      score: Math.round((earned / possible) * 100),
    })
  );
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);

  // ----- Alignment (Signal 15) — separate from the Index by design -----
  const ALIGNMENT: Alignment[] = ["Strained", "Mixed", "Steady", "Strong"];
  const alignment = ALIGNMENT[pick("s15").value];

  // ----- AI Exposure: role base rate × routine modifier × fluency modifier -----
  // Deterministic lookup fixed by framework v1.0.
  const ROLE_BASE = [0.75, 0.6, 0.5, 0.3, 0.2, 0.35, 0.5, 0.3, 0.6, 0.5];
  const ROUTINE_MOD: Record<number, number> = { 4: -0.15, 3: -0.05, 1: 0.1, 0: 0.2 };
  const FLUENCY_MOD: Record<number, number> = { 4: -0.2, 3: -0.1, 1: 0.05, 0: 0.15 };
  const role = answers["p1"] ?? 9;
  const exposureScore =
    (ROLE_BASE[role] ?? 0.5) +
    (ROUTINE_MOD[pick("s2").value] ?? 0) +
    (FLUENCY_MOD[pick("s3").value] ?? 0);
  const aiExposure: AiExposure =
    exposureScore < 0.35 ? "Low" : exposureScore <= 0.6 ? "Moderate" : "Elevated";

  // ----- True North (Signal 16) — the sixteenth expert -----
  const MODES: Mode[] = ["Climb", "Defend", "Reinvent", "Rebuild", "Land"];
  const mode = MODES[answers["s16b"] ?? 1] ?? "Defend";
  const ambition = byId.get("s16a")!.options[answers["s16a"] ?? 0].label;
  const roleFamily = byId.get("p1")!.options[answers["p1"] ?? 9].label;
  const tenure = byId.get("p2")!.options[answers["p2"] ?? 0].label;

  return {
    overall,
    band,
    dimensions,
    strengths: sorted.slice(0, 2),
    risks: sorted.slice(-2).reverse(),
    alignment,
    aiExposure,
    mode,
    ambition,
    roleFamily,
    tenure,
    answers,
  };
}

export const BAND_MESSAGES: Record<Band, string> = {
  Strong:
    "You're in a solid position. Your foundation is resilient — the opportunity now is to compound it: deepen high-value skills, grow your network, and stay ahead of change instead of reacting to it.",
  Developing:
    "You have real strengths to build on, and a few areas that deserve attention. Small, focused moves over the next 90 days can meaningfully improve your position.",
  Vulnerable:
    "Your current position carries real risk — but risk identified early is risk you can act on. The right moves over the next year can change your trajectory significantly. That's exactly what a clear plan is for.",
};

export const ALIGNMENT_NOTES: Record<Alignment, string> = {
  Strong: "Your work and your sense of purpose are pulling in the same direction.",
  Steady: "Mostly satisfied — worth protecting as you make your next moves.",
  Mixed: "Some days pull against you. Your course should account for that.",
  Strained: "Resilience isn't the same as fulfillment — your course starts there.",
};

export const EXPOSURE_NOTES: Record<AiExposure, string> = {
  Low: "Your work leans on judgment and presence — AI is a tool here, not a threat.",
  Moderate: "Parts of your routine work are automatable. Used well, that's an advantage.",
  Elevated: "A meaningful share of tasks like yours is being automated. Your plan addresses it head-on.",
};
