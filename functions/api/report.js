// Tavas Compass Report Engine — Framework v1.0
// Doctrine: the Framework thinks (all scores computed & fixed before this runs).
// AI only writes. Event-driven: runs ONCE per paid session, cached in KV forever.

const SIGNAL_MEANING = {
  s1: ["growing demand", "steady demand", "tightening demand", "shrinking demand"],
  s2: ["little routine work", "quarter routine", "half routine", "mostly routine"],
  s3: ["uses AI daily", "uses AI weekly", "tried AI a few times", "rarely/never uses AI"],
  s4: ["strong recruiter visibility", "stale profile", "thin profile", "no professional presence"],
  s5: ["leadership sees their impact", "manager-only visibility", "work invisible to leadership", "unknown standing with leadership"],
  s6: ["tracks measurable wins", "results with digging", "work not measured", "never framed results"],
  s7: ["highly transferable skills", "somewhat transferable", "specialized skills", "unsure what transfers"],
  s8: ["adapts fast to change", "adjusts after stress", "drained by change", "feels stuck in change"],
  s9: ["rising internally", "solid internally", "flat for years", "exposed to restructuring"],
  s10: ["strong outside network", "moderate network", "weak network", "no network"],
  s11: ["6+ months runway", "3-6 months runway", "1-3 months runway", "under 1 month runway"],
  s12: ["free to move", "location constraint", "family commitments", "financial obligations", "health constraint", "other constraint"],
  s13: ["learned new skill in last 3 months", "within last year", "1-3 years ago", "can't remember learning"],
  s14: ["3-year plan in motion", "picture but no plan", "vague sense of direction", "no picture yet"],
  s15: ["genuinely enjoys work", "mostly satisfied", "mixed feelings", "dreads Mondays"],
};

const SIGNAL_NAMES = {
  s1: "Market Demand", s2: "Routine Exposure", s3: "AI Fluency", s4: "Findability",
  s5: "Leadership Visibility", s6: "Provable Results", s7: "Skill Portability",
  s8: "Change Response", s9: "Internal Standing", s10: "Professional Network",
  s11: "Financial Runway", s12: "Freedom to Move", s13: "Learning Momentum", s14: "Three-Year Clarity",
};
// Fixed per-signal point values (mirror of the framework tables) for strongest/weakest ranking.
const SIGNAL_POINTS = {
  s1: [4,3,1,0], s2: [4,3,1,0], s3: [4,3,1,0], s4: [4,2,1,0], s5: [4,3,1,0],
  s6: [4,3,1,0], s7: [4,3,1,0], s8: [4,3,1,0], s9: [4,3,1,0], s10: [4,3,1,0],
  s11: [4,3,1,0], s12: [4,2,2,1,1,2], s13: [4,3,1,0], s14: [4,2,1,0],
};

const CLOSING = `## The Needle Moves

Your Compass Index is not a prediction — it's a starting point.

Every skill you build, every relationship you strengthen, and every deliberate decision you make can change your direction.

The future isn't fixed. **Neither is your Compass.**`;

const MODE_BRIEF = {
  Climb: "They are trying to move up. Write an ambitious optimization plan.",
  Defend: "They are trying to stay relevant. Write a protection-and-reposition plan.",
  Reinvent: "They are trying to reinvent their career. Write a courageous but sequenced transition plan.",
  Rebuild: "They are recovering from a setback. Write a steady, confidence-restoring plan. Extra warmth, zero judgment.",
  Land: "They are planning toward retirement. Write a consolidation and legacy plan.",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet(ctx) {
  const sid = new URL(ctx.request.url).searchParams.get("session_id");
  if (!sid || !/^cs_[a-zA-Z0-9_]+$/.test(sid)) return json({ error: "Invalid session." }, 400);

  // Write once, serve forever.
  const cached = await ctx.env.REPORTS.get("report:" + sid);
  if (cached) return json({ report: cached, cached: true });

  if (!ctx.env.STRIPE_SECRET_KEY || !ctx.env.ANTHROPIC_API_KEY)
    return json({ error: "Report engine not configured." }, 503);

  // Verify payment with Stripe — the only gate.
  const sres = await fetch("https://api.stripe.com/v1/checkout/sessions/" + sid, {
    headers: { Authorization: "Bearer " + ctx.env.STRIPE_SECRET_KEY },
  });
  const session = await sres.json();
  if (!sres.ok) return json({ error: "Could not verify purchase." }, 502);
  if (session.payment_status !== "paid") return json({ error: "Payment not completed." }, 402);
  if ((session.metadata || {}).plan !== "report") return json({ error: "Not a report purchase." }, 400);

  let core = {};
  const answers = {};
  try {
    core = JSON.parse(session.metadata.m1 || "{}");
    (session.metadata.m2 || "").split(",").forEach((kv) => {
      const parts = kv.split(":");
      if (parts[0]) answers[parts[0]] = parseInt(parts[1], 10);
    });
  } catch (e) { /* degrade gracefully */ }

  // Framework-owned ranking: strongest and weakest signals by fixed point values.
  const ranked = Object.keys(SIGNAL_NAMES)
    .filter((id) => answers[id] !== undefined && SIGNAL_POINTS[id] && SIGNAL_POINTS[id][answers[id]] !== undefined)
    .map((id) => ({ id, name: SIGNAL_NAMES[id], pts: SIGNAL_POINTS[id][answers[id]] }))
    .sort((a, b) => b.pts - a.pts);
  const strongest = ranked.slice(0, 3).map((r) => r.name);
  const weakest = ranked.slice(-3).reverse().map((r) => r.name);

  const signalNotes = Object.entries(SIGNAL_MEANING)
    .map(([id, opts]) => (answers[id] !== undefined && opts[answers[id]] ? "- " + id + ": " + opts[answers[id]] : null))
    .filter(Boolean)
    .join("\n");

  const system = "You are the report writer for Tavas Compass, a luxury career intelligence platform.\n" +
    "THE TAVAS COMPASS WRITING SIGNATURE - every sentence must be: calm, hopeful, intelligent, practical. Never fear-based, never sensational, never clinical, never shaming.\n" +
    "The Tavas Compass Career Intelligence Framework has already computed every score deterministically - you never invent, adjust, or second-guess numbers. You interpret and write.\n" +
    (MODE_BRIEF[core.md] || MODE_BRIEF.Defend) + "\n" +
    "Alignment rule: if Alignment is Strained or Mixed, acknowledge it early - resilience is not fulfillment - and let it shape the course. If Strong, build on it.\n" +
    "GROUNDING RULE: describe only what their responses show. Write 'your responses suggest' or 'you told us' - never claim to know their inner life or feelings beyond what they reported.\n" +
    "POSITIVE REINFORCEMENT: after each strength, add a short 'Why this matters:' moment that builds earned confidence (e.g. why that trait is rarer or more valuable than they think). The reader must finish energized, not just analyzed.\n" +
    "PERSONALIZED RECOMMENDATIONS: every recommendation must name the signal that drives it (e.g. 'Because Findability was one of your lowest signals, ...'). No generic advice.\n" +
    "ONE UNFORGETTABLE LINE: include exactly one short, quotable sentence unique to their situation, set alone as a '> ' blockquote somewhere in Where You Stand or Your Course. It must be hopeful and specific, never generic.\n" +
    'Their stated ambition ("' + (core.am || "stability") + '") must visibly shape the recommendations and their order.\n\n' +
    "FORMAT: Markdown. Do NOT write a title and do NOT restate the Compass Index number in your opening - the report header above your text already displays it iconically. Begin with a single italic essence line as a '> ' blockquote (one sentence capturing their situation with dignity, e.g. 'A career with real potential, ready for its next phase.'). Then these sections in order:\n" +
    "## Where You Stand  (2-3 paragraphs weaving in Alignment and AI Exposure; do not repeat the Index number more than once)\n" +
    "## What Is Moving Your Index  (two lists, EXACTLY as provided in the data: 'Your strongest signals:' then 'Signals holding you back:' - one line of insight after each list explaining how they add up to " + core.o + ")\n" +
    "## Reading Your Compass  (Tailwinds subsection and Headwinds subsection from their dimension scores, each strength followed by a 'Why this matters:' moment)\n" +
    "## AI Impact Assessment  (their exposure level, which tasks shift, how their AI fluency changes the picture)\n" +
    "## Your Transferable Skills  (3-4 concrete skill translations for their role family)\n" +
    "### \ud83d\udcc8 Your Greatest Opportunity  (followed by a 1-2 sentence '> ' callout naming the single highest-leverage move)\n" +
    '## Your Course  (three subsections: "First 30 Days", "Days 31-90", "Months 4-12" - each with 3 specific actions tied to named signals)\n' +
    "### \ud83c\udfaf First Action This Week  (followed by a 1-2 sentence '> ' callout: the one thing to do in the next 7 days)\n" +
    "## Learning Priorities  (3 ranked priorities with reasoning)\n" +
    "## Certifications Worth Your Time  (2-3 real, well-known certifications relevant to their field with realistic time/cost notes)\n" +
    "## Headwinds  (2-3 honest risks with mitigation, calm not alarming)\n" +
    "### \u26a0\ufe0f Your Biggest Risk  (followed by a 1-2 sentence '> ' callout, framed as manageable)\n" +
    "## On the Horizon  (realistic salary/opportunity trajectory - directional ranges, no guarantees)\n" +
    "## Your Next Step  (brief, warm, practical close - do NOT write a grand philosophical ending; the report's fixed closing follows your text)\n\n" +
    "Rules: use their actual numbers. Be specific, not generic. No disclaimers inside the body. 1200-1600 words total.";

  const user = "FRAMEWORK DATA (computed by Tavas Compass, fixed):\n" +
    "Compass Index: " + core.o + " (" + core.b + ")\n" +
    "Alignment: " + core.al + "\n" +
    "AI Exposure: " + core.ex + "\n" +
    "Report Mode: " + core.md + "\n" +
    "Ambition: " + core.am + "\n" +
    "Role family: " + core.rf + " | Tenure: " + core.tn + "\n" +
    "Dimension scores (0-100): " + JSON.stringify(core.d) + "\n" +
    "Your strongest signals (use EXACTLY these): " + strongest.join(", ") + "\n" +
    "Signals holding you back (use EXACTLY these): " + weakest.join(", ") + "\n" +
    "Signal readings:\n" + signalNotes;

  const models = ["claude-sonnet-5", "claude-sonnet-4-5"];
  let md = null;
  let lastErr = null;
  for (const model of models) {
    const ares = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ctx.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 6000,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: user }],
      }),
    });
    const out = await ares.json();
    if (ares.ok) {
      md = (out.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      break;
    }
    lastErr = (out && out.error && out.error.message) || "AI service error";
    if (!out || !out.error || out.error.type !== "not_found_error") break;
  }
  if (!md) return json({ error: lastErr || "Report generation failed." }, 502);

  // Framework-owned presentation: iconic Compass Index header + fixed brand closing.
  const essence = "";
  const final =
    "# Your Career Compass Report\n" +
    "@@INDEX|" + core.o + "|" + core.b + "\n\n" +
    md.trim() + "\n\n" + CLOSING + "\n";

  await ctx.env.REPORTS.put("report:" + sid, final);
  return json({ report: final, cached: false });
}
