import { useState } from "react";
import { Link } from "react-router-dom";
import { getResult } from "@/lib/storage";
import { BAND_MESSAGES, ALIGNMENT_NOTES, EXPOSURE_NOTES } from "@/lib/scoring";

const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as
  | string
  | undefined;

export default function Results() {
  const result = getResult();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [buyBusy, setBuyBusy] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  if (!result) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">No results yet</h1>
        <p className="mt-4 text-cream/75">
          Take the free assessment to see where you stand.
        </p>
        <Link to="/assessment" className="btn-gold mt-8">
          Start the assessment
        </Link>
      </section>
    );
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!WAITLIST_ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          source: "tavas-compass-results",
          overall: result!.overall,
          band: result!.band,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }


  async function buyReport() {
    setBuyBusy(true);
    setBuyError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "report",
          email: email || undefined,
          // m1 = computed framework scores; m2 = raw answer vector (Learning Loop format)
          m1: JSON.stringify({
            o: result!.overall,
            b: result!.band,
            al: result!.alignment,
            ex: result!.aiExposure,
            md: result!.mode,
            am: result!.ambition,
            rf: result!.roleFamily,
            tn: result!.tenure,
            d: Object.fromEntries(
              result!.dimensions.map((d) => [d.label, d.score])
            ),
          }),
          m2: Object.entries(result!.answers)
            .map(([k, v]) => `${k}:${v}`)
            .join(","),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setBuyError(data.error ?? "Something went wrong — please try again.");
        setBuyBusy(false);
      }
    } catch {
      setBuyError("Something went wrong — please try again.");
      setBuyBusy(false);
    }
  }

  const bandColor =
    result.band === "Strong"
      ? "text-green-400"
      : result.band === "Developing"
        ? "text-gold"
        : "text-red-400";

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-luxe text-gold">
        Your free summary
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        Career Resilience Snapshot
      </h1>

      {/* Overall */}
      <div className="card mt-8 text-center">
        <p className="text-xs font-medium uppercase tracking-luxe text-cream/50">
          Compass Index
        </p>
        <p className="mt-2 font-display text-6xl font-bold text-gold">{result.overall}</p>
        <p className={`mt-1 text-lg font-semibold ${bandColor}`}>
          {result.band}
        </p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-cream/75">
          {BAND_MESSAGES[result.band]}
        </p>
      </div>

      {/* Readings: Alignment + AI Exposure */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-luxe text-cream/50">
            Alignment
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-gold">
            {result.alignment}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            {ALIGNMENT_NOTES[result.alignment]}
          </p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-luxe text-cream/50">
            AI Exposure
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-gold">
            {result.aiExposure}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            {EXPOSURE_NOTES[result.aiExposure]}
          </p>
        </div>
      </div>

      {/* Dimensions */}
      <div className="card mt-6">
        <h2 className="font-display text-xl font-semibold">Your five dimensions</h2>
        <div className="mt-5 space-y-4">
          {result.dimensions.map((d) => (
            <div key={d.dimension}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-cream/85">{d.label}</span>
                <span className="text-cream/60">{d.score}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-night">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & risks */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-lg font-semibold">Tailwinds</h3>
          <ul className="mt-3 space-y-2">
            {result.strengths.map((s) => (
              <li key={s.dimension} className="flex items-center gap-2 text-cream/85">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-display text-lg font-semibold">Headwinds</h3>
          <ul className="mt-3 space-y-2">
            {result.risks.map((r) => (
              <li key={r.dimension} className="flex items-center gap-2 text-cream/85">
                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buy the full report */}
      <div className="card mt-6 !border-gold/40 bg-gold/5">
        <h2 className="font-display text-xl font-semibold">
          Get your full Compass Report
        </h2>
        <p className="mt-2 leading-relaxed text-cream/75">
          The comprehensive Compass Report goes far deeper: your full Compass
          Index analysis, AI impact, transferable skills, Your Course — a
          personalized 30 / 90 / 365-day plan — plus what's on the horizon
          for your field. Built from your answers.
        </p>
        <button
          onClick={buyReport}
          disabled={buyBusy}
          className="btn-gold mt-5 w-full disabled:opacity-60 sm:w-auto"
        >
          {buyBusy ? "Opening secure checkout…" : "Get my full report — $9"}
        </button>
        {buyError && <p className="mt-3 text-sm text-red-400">{buyError}</p>}
      </div>

      {/* Email list */}
      <div className="card mt-6">
        <h2 className="font-display text-xl font-semibold">
          Not ready yet? Stay in the loop
        </h2>
        <p className="mt-2 leading-relaxed text-cream/75">
          Join the list for career resilience insights and early-access
          offers. No spam — just clarity.
        </p>
        {status === "done" ? (
          <p className="mt-4 font-semibold text-green-400">
            You're on the list. Watch your inbox — clarity is on the way.
          </p>
        ) : (
          <form onSubmit={submitEmail} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-gold/20 bg-night px-5 py-3 text-cream outline-none transition placeholder:text-cream/40 focus:border-gold"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-gold disabled:opacity-60"
            >
              {status === "sending" ? "Joining…" : "Join the list"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">
            {WAITLIST_ENDPOINT
              ? "Something went wrong — please try again."
              : "Signup isn't connected yet (set VITE_WAITLIST_ENDPOINT)."}
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/assessment"
          className="text-sm font-medium text-cream/60 underline-offset-4 transition hover:text-cream hover:underline"
        >
          Retake the assessment
        </Link>
      </div>
    </section>
  );
}
