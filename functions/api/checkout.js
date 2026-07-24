// Cloudflare Pages Function: POST /api/checkout
// Creates a Stripe Checkout Session. Requires env var STRIPE_SECRET_KEY.
// Uses inline price_data so it works identically in test and live mode.

const PLANS = {
  report: {
    mode: "payment",
    name: "Tavas Compass Full Report",
    description:
      "Personalized career resilience report with a 30/90/365-day action roadmap.",
    unit_amount: 900,
  },
  monthly: {
    mode: "subscription",
    name: "Tavas Compass Subscription",
    description: "Monthly re-assessment, updated action plan, and progress tracking.",
    unit_amount: 900,
    interval: "month",
  },
  annual: {
    mode: "subscription",
    name: "Tavas Compass Subscription (Annual)",
    description: "A full year of monthly re-assessments and updated action plans. Save 27%.",
    unit_amount: 7900,
    interval: "year",
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(ctx) {
  const key = ctx.env.STRIPE_SECRET_KEY;
  if (!key) return json({ error: "Checkout is not configured yet." }, 503);

  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const plan = PLANS[body.plan];
  if (!plan) return json({ error: "Unknown plan." }, 400);

  const origin = new URL(ctx.request.url).origin;
  const p = new URLSearchParams();
  p.set("mode", plan.mode);
  p.set("success_url", `${origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${body.plan}`);
  p.set("cancel_url", `${origin}/results`);
  p.set("allow_promotion_codes", "true");
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "usd");
  p.set("line_items[0][price_data][unit_amount]", String(plan.unit_amount));
  p.set("line_items[0][price_data][product_data][name]", plan.name);
  p.set("line_items[0][price_data][product_data][description]", plan.description);
  if (plan.mode === "subscription") {
    p.set("line_items[0][price_data][recurring][interval]", plan.interval);
  }
  if (typeof body.email === "string" && body.email.includes("@")) {
    p.set("customer_email", body.email);
  }
  // Carry the full framework result so the report engine can write from it.
  // m1 = computed scores (JSON) · m2 = raw answer vector (CSV). Both fixed by the framework.
  if (body.m1 && typeof body.m1 === "string") p.set("metadata[m1]", body.m1.slice(0, 490));
  if (body.m2 && typeof body.m2 === "string") p.set("metadata[m2]", body.m2.slice(0, 490));
  p.set("metadata[plan]", body.plan);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: p,
  });

  const session = await res.json();
  if (!res.ok) {
    return json({ error: session?.error?.message || "Payment service error." }, 502);
  }
  return json({ url: session.url });
}
