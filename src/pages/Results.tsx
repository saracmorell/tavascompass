import { useState } from "react";
import { Link } from "react-router-dom";
import { getResult } from "@/lib/storage";
import { BAND_MESSAGES } from "@/lib/scoring";

const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as
  | string
  | undefined;

export default function Results() {
  const result = getResult();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  if (!result) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">No results yet</h1>
        <p className="mt-4 text-earth/80">
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

  const bandColor =
    result.band === "Strong"
      ? "text-green-700"
      : result.band === "Developing"
        ? "text-gold-deep"
        : "text-red-700";

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-earth/60">
        Your free summary
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
        Career Resilience Snapshot
      </h1>

      {/* Overall */}
      <div className="card mt-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-earth/60">
          Overall resilience
        </p>
        <p className="mt-2 font-display text-6xl font-bold">{result.overall}</p>
        <p className={`mt-1 text-lg font-semibold ${bandColor}`}>
          {result.band}
        </p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-earth/80">
          {BAND_MESSAGES[result.band]}
        </p>
      </div>

      {/* Dimensions */}
      <div className="card mt-6">
        <h2 className="font-display text-xl font-bold">Your five dimensions</h2>
        <div className="mt-5 space-y-4">
          {result.dimensions.map((d) => (
            <div key={d.dimension}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{d.label}</span>
                <span className="text-earth/60">{d.score}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-sand">
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
          <h3 className="font-display text-lg font-bold">Leading strengths</h3>
          <ul className="mt-3 space-y-2">
            {result.strengths.map((s) => (
              <li key={s.dimension} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-display text-lg font-bold">Watch areas</h3>
          <ul className="mt-3 space-y-2">
            {result.risks.map((r) => (
              <li key={r.dimension} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red-600" />
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full report waitlist */}
      <div className="card mt-6 border-gold/40 bg-gold/5">
        <h2 className="font-display text-xl font-bold">
          Your full report is coming
        </h2>
        <p className="mt-2 leading-relaxed text-earth/80">
          The comprehensive Compass Report goes far deeper: detailed analysis,
          transferable skills, career opportunities, learning priorities, and a
          personalized 30 / 90 / 365-day roadmap. Join the list and be first to
          get it — plus early-access pricing.
        </p>
        {status === "done" ? (
          <p className="mt-4 font-semibold text-green-700">
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
              className="flex-1 rounded-full border-2 border-earth/15 bg-white px-5 py-3 outline-none transition focus:border-gold"
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
          <p className="mt-3 text-sm text-red-700">
            {WAITLIST_ENDPOINT
              ? "Something went wrong — please try again."
              : "Signup isn't connected yet (set VITE_WAITLIST_ENDPOINT)."}
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/assessment"
          className="text-sm font-medium text-earth/60 underline-offset-4 transition hover:text-earth hover:underline"
        >
          Retake the assessment
        </Link>
      </div>
    </section>
  );
}
