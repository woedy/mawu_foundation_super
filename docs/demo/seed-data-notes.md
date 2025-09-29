# Demo Seed Data Notes

This guide ensures the web experience ships with rich, investor-ready content during the walkthrough without relying on a backend.

## 1. Markdown stories
- Location: `apps/web/src/stories/`
- Format: Markdown with front matter (see sample `solar-learning-labs.md`).
- **To add a new story:**
  1. Duplicate an existing file.
  2. Update `title`, `author`, `date`, `category`, `excerpt`, `image`, and `tags`.
  3. Write 2–3 paragraphs of narrative content.
- Vite consumes these files via `import.meta.glob` so no rebuild is required—refresh the browser to see changes.

## 2. Testimonials carousel
- Source file: `apps/web/src/data/testimonials.ts`
- Segments supported: `donor`, `volunteer`, `beneficiary`.
- Each record includes name, role, location, highlight, full quote, and portrait URL.
- Keep the array to 3–5 entries for a tight carousel rotation (autoplay cycles every 9s).

## 3. Newsletter ledger
- Newsletter submissions are simulated client-side and display a confirmation banner without persisting to disk.
- Update copy in `apps/web/src/components/NewsletterSignup.tsx` if you need session-specific messaging.
- Analytics events (`newsletter_subscribed`) still fire when Plausible is enabled.

## 4. Analytics domain
- Set `VITE_ANALYTICS_DOMAIN` in `.env` (e.g., `demo.mawufoundation.org`).
- When the domain is present, `initAnalytics` loads the Plausible tagged-events script.
- Use the Plausible dashboard to monitor `story_opened`, `testimonial_cycle`, and `newsletter_subscribed` demo events.

## 5. Programs & shop catalog
- Primary data lives in `apps/web/src/data/programs-fallback.ts` and `apps/web/src/data/shop-fallback.ts`.
- Update spotlights, pricing, impact notes, and availability flags to align with the investor narrative for the session.
- Re-run `npm run build --workspace @mawu/web` if you want a production snapshot of the latest edits.

> _Pro tip:_ After editing seed files, run `npm run build --workspace @mawu/web` to catch any TypeScript regressions before the live session.
