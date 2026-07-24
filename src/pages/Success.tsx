import { useEffect, useState } from "react";
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

/** Minimal Markdown renderer for the report (headings, bold, lists, paragraphs). */
function Md({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: JSX.Element[] = [];
  let list: string[] = [];
  let key = 0;

  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="text-cream">{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );

  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={key++} className="my-3 space-y-2">
          {list.map((li, i) => (
            <li key={i} className="flex gap-2 leading-relaxed text-cream/80">
              <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{inline(li)}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      list.push(line.slice(2));
      continue;
    }
    flush();
    if (!line) continue;
    if (line.startsWith("@@INDEX|")) {
      const [, idx, band] = line.split("|");
      out.push(
        <div key={key++} className="my-8 rounded-2xl border border-gold/30 bg-gold/5 px-6 py-8 text-center">
          <p className="text-xs font-medium uppercase tracking-luxe text-gold">
            Compass Index™
          </p>
          <p className="mt-2 font-display text-7xl font-bold text-gold">{idx}</p>
          <p className="mt-1 text-lg font-semibold text-cream">{band}</p>
        </div>
      );
      continue;
    }
    if (line.startsWith("> ")) {
      out.push(
        <blockquote
          key={key++}
          className="my-5 rounded-r-xl border-l-2 border-gold bg-gold/5 px-5 py-4 font-display text-lg italic leading-relaxed text-cream"
        >
          {inline(line.slice(2).replace(/^\*|\*$/g, ""))}
        </blockquote>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(
        <h1 key={key++} className="mt-2 font-display text-3xl font-semibold text-cream">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      out.push(
        <h2 key={key++} className="mt-8 border-b border-gold/25 pb-2 font-display text-xl font-semibold text-gold">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      out.push(
        <h3 key={key++} className="mt-5 font-semibold text-cream">
          {line.slice(4)}
        </h3>
      );
    } else {
      out.push(
        <p key={key++} className="mt-3 leading-relaxed text-cream/80">
          {inline(line)}
        </p>
      );
    }
  }
  flush();
  return <div>{out}</div>;
}

export default function Success() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const sessionId = params.get("session_id");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [reportState, setReportState] = useState<"loading" | "ready" | "error">("loading");
  const [reportError, setReportError] = useState<string | null>(null);

  const isSubscription = plan === "monthly" || plan === "annual";
  const isReport = plan === "report" && !!sessionId;

  useEffect(() => {
    if (!isReport) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/report?session_id=${sessionId}`);
        const data = (await res.json()) as { report?: string; error?: string };
        if (cancelled) return;
        if (res.ok && data.report) {
          setReport(data.report);
          setReportState("ready");
        } else {
          setReportError(data.error ?? "We couldn't prepare your report.");
          setReportState("error");
        }
      } catch {
        if (!cancelled) {
          setReportError("We couldn't prepare your report.");
          setReportState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isReport, sessionId]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-luxe text-gold">
          Payment confirmed
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {isSubscription ? "Welcome aboard." : "Thank you — you're all set."}
        </h1>
        {isSubscription && (
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-cream/75">
            Your Tavas Compass subscription is active. Your first monthly
            check-in and updated action plan will arrive by email.
          </p>
        )}
      </div>

      {/* The report itself */}
      {isReport && reportState === "loading" && (
        <div className="card mt-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <p className="mt-4 font-display text-lg text-cream">
            Your Compass is being read…
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-cream/60">
            Your personalized Career Compass Report is being written from your
            sixteen Career Signals. This takes about half a minute.
          </p>
        </div>
      )}
      {isReport && reportState === "error" && (
        <div className="card mt-10 text-center">
          <p className="font-semibold text-red-400">{reportError}</p>
          <p className="mt-2 text-sm text-cream/60">
            Your purchase is confirmed and your report is safe — refresh this
            page in a moment, or contact support@tavasworld.com and we'll make
            it right.
          </p>
        </div>
      )}
      {isReport && reportState === "ready" && report && (
        <div className="card mt-10">
          <Md text={report} />
          <div className="mt-8 border-t border-gold/20 pt-4 text-center">
            <button
              onClick={() => window.print()}
              className="text-sm font-medium text-gold underline-offset-4 hover:underline"
            >
              Print or save as PDF
            </button>
            <p className="mt-2 text-xs text-cream/50">
              This page is yours — bookmark it. Your report stays available at
              this link.
            </p>
          </div>
        </div>
      )}

      {/* Subscription upsell */}
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

      <div className="mt-10 text-center">
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
