import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { steps, SIGNAL_COUNT } from "@/data/signals";
import { scoreAnswers } from "@/lib/scoring";
import { setResult } from "@/lib/storage";

export default function Assessment() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const step = steps[index];
  const progress = Math.round((index / steps.length) * 100);
  const isLast = index === steps.length - 1;

  const signalsSoFar = step.kind === "profile" ? 0 : step.number ?? 0;
  const header =
    step.kind === "profile"
      ? step.name
      : `Career Signal #${step.number} — ${step.name}`;
  const counter =
    step.kind === "profile"
      ? `Your profile · ${index + 1} of 2`
      : `Signal ${signalsSoFar} of ${SIGNAL_COUNT}`;

  function next() {
    if (selected === null) return;
    const updated = { ...answers, [step.id]: selected };
    setAnswers(updated);
    if (isLast) {
      setResult(scoreAnswers(updated));
      navigate("/results");
    } else {
      const upcoming = steps[index + 1];
      setSelected(updated[upcoming.id] ?? null);
      setIndex(index + 1);
    }
  }

  function back() {
    if (index === 0) return;
    const prev = steps[index - 1];
    setSelected(answers[prev.id] ?? null);
    setIndex(index - 1);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-cream/60">
          <span>{counter}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-espresso">
          <div
            className="h-full rounded-full bg-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-luxe text-gold">
        {header}
      </p>
      {step.expert && (
        <p className="mt-1 text-xs text-cream/50">Asked by {step.expert}</p>
      )}
      <h1 className="mt-3 font-display text-2xl font-semibold leading-snug sm:text-3xl">
        {step.prompt}
      </h1>

      <div className="mt-8 space-y-3">
        {step.options.map((opt, i) => {
          const active = selected === i;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full rounded-xl border px-5 py-4 text-left leading-snug transition ${
                active
                  ? "border-gold bg-gold/10 font-semibold text-cream"
                  : "border-gold/15 bg-espresso text-cream/85 hover:border-gold/50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={index === 0}
          className="text-sm font-medium text-cream/60 transition hover:text-cream disabled:invisible"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={selected === null}
          className="btn-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLast ? "See my results" : "Next"}
        </button>
      </div>
    </section>
  );
}
