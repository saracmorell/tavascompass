// Session-scoped answer storage (kept simple for Phase 1).
import type { SummaryResult } from "@/lib/scoring";

let lastResult: SummaryResult | null = null;

export function setResult(r: SummaryResult) {
  lastResult = r;
  try {
    sessionStorage.setItem("compass:result", JSON.stringify(r));
  } catch {
    /* private mode — in-memory only */
  }
}

export function getResult(): SummaryResult | null {
  if (lastResult) return lastResult;
  try {
    const raw = sessionStorage.getItem("compass:result");
    return raw ? (JSON.parse(raw) as SummaryResult) : null;
  } catch {
    return null;
  }
}
