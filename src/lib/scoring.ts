import {
  questions,
  DIMENSION_LABELS,
  type Dimension,
} from "@/data/questions";

export interface DimensionScore {
  dimension: Dimension;
  label: string;
  /** 0–100 */
  score: number;
}

export interface SummaryResult {
  /** 0–100 overall */
  overall: number;
  band: "Strong" | "Developing" | "Vulnerable";
  dimensions: DimensionScore[];
  strengths: DimensionScore[];
  risks: DimensionScore[];
}

export function scoreAnswers(answers: Record<string, number>): SummaryResult {
  const byDimension = new Map<Dimension, { earned: number; possible: number }>();

  for (const q of questions) {
    const earned = answers[q.id] ?? 0;
    const possible = Math.max(...q.options.map((o) => o.value));
    const agg = byDimension.get(q.dimension) ?? { earned: 0, possible: 0 };
    agg.earned += earned;
    agg.possible += possible;
    byDimension.set(q.dimension, agg);
  }

  const dimensions: DimensionScore[] = [...byDimension.entries()].map(
    ([dimension, { earned, possible }]) => ({
      dimension,
      label: DIMENSION_LABELS[dimension],
      score: Math.round((earned / possible) * 100),
    })
  );

  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
  );

  const band: SummaryResult["band"] =
    overall >= 70 ? "Strong" : overall >= 45 ? "Developing" : "Vulnerable";

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);

  return {
    overall,
    band,
    dimensions,
    strengths: sorted.slice(0, 2),
    risks: sorted.slice(-2).reverse(),
  };
}

export const BAND_MESSAGES: Record<SummaryResult["band"], string> = {
  Strong:
    "You're in a solid position. Your foundation is resilient — the opportunity now is to compound it: deepen high-value skills, grow your network, and stay ahead of change instead of reacting to it.",
  Developing:
    "You have real strengths to build on, and a few areas that deserve attention. Small, focused moves over the next 90 days can meaningfully improve your position.",
  Vulnerable:
    "Your current position carries real risk — but risk identified early is risk you can act on. The right moves over the next year can change your trajectory significantly. That's exactly what a clear plan is for.",
};
