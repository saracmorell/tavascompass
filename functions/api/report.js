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

  const signalNotes = Object.entries(SIGNAL_MEANING)
    .map(([id, opts]) => (answers[id] !== undefined && opts[answers[id]] ? "- " + id + ": " + opts[answers[id]] : null))
    .filter(Boolean)
    .join("\n");

  const system = "You are the report writer for Tavas Compass, a luxury career intelligence platform.\n" +
    "Voice: sophisticated, confident, warm, direct. Never gimmicky, never clinical, never shaming.\n" +
    "The Tavas Compass Career Intelligence Framework has already computed every score deterministically - you never invent, adjust, or second-guess numbers. You interpret and write.\n" +
    (MODE_BRIEF[core.md] || MODE_BRIEF.Defend) + "\n" +
    "Alignment rule: if Alignment is Strained or Mixed, acknowledge it early - resilience is not fulfillment - and let it shape the course. If Strong, build on it.\n" +
    'Their stated ambition ("' + (core.am || "stability") + '") must visibly shape the recommendations and their order.\n\n' +
    "Write the complete Career Compass Report in Markdown with EXACTLY these sections, in this order:\n" +
    "# Your Career Compass Report\n" +
    "## Where You Stand  (2-3 paragraphs: Compass Index " + core.o + ", what it means, their Alignment and AI Exposure readings woven in)\n" +
    "## Reading Your Compass  (Tailwinds subsection and Headwinds subsection, grounded in their dimension scores)\n" +
    "## AI Impact Assessment  (their exposure level, which of their tasks shift, how their AI fluency changes the picture)\n" +
    "## Your Transferable Skills  (3-4 concrete skill translations for their role family)\n" +
    '## Your Course  (three subsections: "First 30 Days", "Days 31-90", "Months 4-12" - each with 3 specific actions)\n' +
    "## Learning Priorities  (3 ranked priorities with reasoning)\n" +
    "## Certifications Worth Your Time  (2-3 real, well-known certifications relevant to their field with realistic time/cost notes)\n" +
    "## Headwinds  (2-3 honest risks with mitigation)\n" +
    "## On the Horizon  (realistic salary/opportunity trajectory for their path - directional ranges, no guarantees)\n" +
    "## Your Next Step  (short, motivating close in their mode's voice)\n\n" +
    "Rules: use their actual numbers. Be specific, not generic. No disclaimers inside the body. 1100-1500 words total.";

  const user = "FRAMEWORK DATA (computed by Tavas Compass, fixed):\n" +
    "Compass Index: " + core.o + " (" + core.b + ")\n" +
    "Alignment: " + core.al + "\n" +
    "AI Exposure: " + core.ex + "\n" +
    "Report Mode: " + core.md + "\n" +
    "Ambition: " + core.am + "\n" +
    "Role family: " + core.rf + " | Tenure: " + core.tn + "\n" +
    "Dimension scores (0-100): " + JSON.stringify(core.d) + "\n" +
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

  await ctx.env.REPORTS.put("report:" + sid, md);
  return json({ report: md, cached: false });
}
