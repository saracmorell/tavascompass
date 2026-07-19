import { Link } from "react-router-dom";

const steps = [
  {
    title: "Assess",
    body: "Answer honest questions about your career, skills, finances, and habits. No fluff, no personality quiz clichés.",
  },
  {
    title: "Understand",
    body: "See where you stand: your strengths, your risks, your transferable skills, and how exposed your role is to change.",
  },
  {
    title: "Act",
    body: "Get a practical roadmap — what to learn, what to build, and what to stop worrying about over the next 30, 90, and 365 days.",
  },
];

const audiences = [
  "You're wondering whether your role will look the same in five years",
  "You're considering a career change but don't know where to start",
  "You keep hearing “learn new skills” but nobody says which ones",
  "You want a practical plan, not predictions or hype",
];

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-night">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <p className="text-xs font-medium uppercase tracking-luxe text-gold sm:text-sm">
            Navigate your future with confidence
          </p>
          <span className="mx-auto mt-8 block h-28 w-28 overflow-hidden rounded-full sm:h-36 sm:w-36">
            <img
              src="/TCLogoTrans.png"
              alt=""
              className="w-[160%] max-w-none -ml-[30%] -mt-[12%]"
            />
          </span>
          <h1 className="mt-8 font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Know where you stand.
            <br />
            Know what to do <span className="text-gold">next</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/75">
            Work is changing fast. Tavas Compass gives you a clear, personal
            picture of your career resilience — and a practical plan to
            strengthen it. No fear. No hype. Just clarity.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/assessment" className="btn-gold">
              Take the free assessment
            </Link>
            <a href="#how-it-works" className="btn-outline">
              How it works
            </a>
          </div>
          <p className="mt-5 text-sm text-cream/50">
            Free · About 3 minutes · No account required
          </p>
        </div>
      </section>

      {/* Sound familiar */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
          Sound familiar?
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {audiences.map((a) => (
            <li key={a} className="card flex items-start gap-3">
              <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
              <span className="leading-relaxed text-cream/85">{a}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-espresso">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-gold/15 bg-night p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-night">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-cream/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            We're not selling a score.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/75">
            A number doesn't change your life. Clarity does. Every question we
            ask and every recommendation we make exists to help you answer one
            thing: <em>what should I do next?</em>
          </p>
          <Link to="/assessment" className="btn-gold mt-8">
            Start the free assessment
          </Link>
        </div>
      </section>
    </>
  );
}
