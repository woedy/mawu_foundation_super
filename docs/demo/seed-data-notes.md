# Demo Seed Data Notes

This guide ensures the web experience and API surfaces rich, investor-ready content during the walkthrough.

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
- API writes signups to `apps/api/data/newsletter-signups.json` via `recordNewsletterSignup`.
- The file is ignored by Git, so you can safely seed it manually (one entry per line, valid JSON array).
- For demo scenarios:
  ```json
  [
    {
      "id": "demo-subscriber-1",
      "email": "investor-preview@mawu.demo",
      "firstName": "Investor",
      "lastName": "Preview",
      "interests": ["investor-updates", "storytelling"],
      "source": "web_footer",
      "consent": true,
      "createdAt": "2024-10-10T10:00:00.000Z",
      "updatedAt": "2024-10-10T10:00:00.000Z"
    }
  ]
  ```
- Trigger a fresh entry by submitting the footer form in incognito mode; success/error banners appear and analytics track the result.

## 4. Analytics domain
- Set `VITE_ANALYTICS_DOMAIN` in `.env` (e.g., `demo.mawufoundation.org`).
- When the domain is present, `initAnalytics` loads the Plausible tagged-events script.
- Use the Plausible dashboard to monitor `story_opened`, `testimonial_cycle`, and `newsletter_subscribed` demo events.

## 5. Stripe & payment data
- Provide test mode keys in `.env`:
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
- The API simulates payment intents without external dependencies when keys are absent, returning contextual messaging so the demo still passes.

## 6. Programs & shop catalog
- Seeded via `apps/api/src/data/programs.ts` and `apps/api/src/data/shop.ts`.
- Update small pieces (spotlight statistics, pricing, impact notes) to align with the investor narrative for the session.

> _Pro tip:_ After editing seed files, run `npm run build --workspace @mawu/web` to catch any TypeScript regressions before the live session.
