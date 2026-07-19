# Tavas Compass

Career resilience & future planning platform. Second product in the Tavas ecosystem.
**Independent codebase** — shares patterns and design language with Tavas, never code.

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS v3 · React Router 6

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Deploy (Cloudflare Pages)

1. Push this repo to GitHub (`tavas-compass`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build` · Output directory: `dist`
4. Every push to `main` auto-deploys. Custom domain: tavascompass.com.

`public/_redirects` handles SPA routing fallback.

## Configuration

- `VITE_WAITLIST_ENDPOINT` — POST endpoint for email capture on the results
  page (e.g. Formspree form URL or a Supabase Edge Function). Until set, the
  form shows a "not connected" notice.

## Phase roadmap

- **Phase 1 (this repo, live):** Landing, free 10-question assessment,
  Career Resilience Snapshot, waitlist capture.
- **Phase 2:** Stripe checkout ($29 full report), separate Supabase project
  (own auth/DB — isolated from the Tavas app), report generation + PDF.
- **Phase 3:** Accounts, quarterly reassessments, subscription.

## Ecosystem rules

- Brand tokens live in `tailwind.config.js` (earth `#362417`, gold `#F5A623`) —
  copied from Tavas, not shared, by design.
- Never modify the Tavas app repo from here. Fully independent.
