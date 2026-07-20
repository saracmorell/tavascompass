import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

async function startCheckout(
  plan: "monthly" | "annual",
  setBusy: (b: boolean) => void,
  setError: (e: string | null) => void
) {
  setBusy(true);
  setError(null);
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error ?? "Something went wrong — please try again.");
      setBusy(false);
    }
  } catch {
    setError("Something went wrong — please try again.");
    setBusy(false);
  }
}

export default function Success() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSubscription = plan === "monthly" || plan === "annual";

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
      <p className="text-xs font-medium uppercase tracking-luxe text-gold">
        Payment confirmed
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        {isSubscription ? "Welcome aboard." : "Thank you — you're all set."}
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-cream/75">
        {isSubscription
          ? "Your Tavas Compass subscription is active. Your first monthly check-in and updated action plan will arrive by email."
          : "Your full Compass Report is being prepared and will arrive in your inbox shortly. Check your spam folder if you don't see it."}
      </p>

      {!isSubscription && (
        <div className="card mx-auto mt-10 max-w-lg !border-gold/40 bg-gold/5 text-left">
          <h2 className="font-display text-xl font-semibold">
            Keep your compass current
          </h2>
          <p className="mt-2 leading-relaxed text-cream/75">
            Work changes every month — your plan should too. Subscribers get a
            monthly re-assessment, an updated action plan, and progress
            tracking over time.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => startCheckout("monthly", setBusy, setError)}
              disabled={busy}
              className="btn-gold flex-1 disabled:opacity-60"
            >
              $9 / month
            </button>
            <button
              onClick={() => startCheckout("annual", setBusy, setError)}
              disabled={busy}
              className="btn-gold flex-1 disabled:opacity-60"
            >
              $79 / year — save 27%
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      )}

      <div className="mt-10">
        <Link
          to="/"
          className="text-sm font-medium text-cream/60 underline-offset-4 transition hover:text-cream hover:underline"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
