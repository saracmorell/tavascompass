import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "@/data/questions";
import { scoreAnswers } from "@/lib/scoring";
import { setResult } from "@/lib/storage";

export default function Assessment() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[index];
  const progress = Math.round((index / questions.length) * 100);
  const isLast = index === questions.length - 1;

  function choose(value: number) {
    setSelected(value);
  }

  function next() {
    if (selected === null) return;
    const updated = { ...answers, [q.id]: selected };
    setAnswers(updated);
    setSelected(null);
    if (isLast) {
      setResult(scoreAnswers(updated));
      navigate("/results");
    } else {
      setIndex(index + 1);
    }
  }

  function back() {
    if (index === 0) return;
    const prev = questions[index - 1];
    setSelected(answers[prev.id] ?? null);
    setIndex(index - 1);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-cream/60">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-espresso">
          <div
            className="h-full rounded-full bg-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h1 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
        {q.prompt}
      </h1>

      <div className="mt-8 space-y-3">
        {q.options.map((opt) => {
          const active = selected === opt.value && selected !== null;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => choose(opt.value)}
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
