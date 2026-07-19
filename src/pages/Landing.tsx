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
      <section className="bg-earth text-cream">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-block rounded-full border border-gold/40 px-4 py-1 text-sm font-medium text-gold">
              Career resilience &amp; future planning
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Know where you stand.
              <br />
              Know what to do <span className="text-gold">next</span>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/80">
              Work is changing fast. Tavas Compass gives you a clear, personal
              picture of your career resilience — and a practical plan to
              strengthen it. No fear. No hype. Just clarity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/assessment" className="btn-gold">
                Take the free assessment
              </Link>
              <a href="#how-it-works" className="btn-outline !border-cream/30 !text-cream hover:!border-gold">
                How it works
              </a>
            </div>
            <p className="mt-4 text-sm text-cream/60">
              Free · About 3 minutes · No account required
            </p>
          </div>
        </div>
      </section>

      {/* Sound familiar */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="font-display text-3xl font-bold">Sound familiar?</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {audiences.map((a) => (
            <li key={a} className="card flex items-start gap-3">
              <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
              <span className="leading-relaxed">{a}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-sand">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="font-display text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-earth">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-earth/80">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">
            We're not selling a score.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-earth/80">
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
