# Investor Demo Walkthrough Script

Use this script to guide a 15-minute investor preview that blends storytelling with live product moments. Each segment includes the target duration, the goal, and specific UI checkpoints.

## 0:00 – 1:30 | Opening narrative
- **Goal:** Anchor investors in the mission and today''s ask.
- **Script cues:**
  - "Mawu Foundation is engineering resilient futures across Africa, starting with a concentrated season in Ghana''s Volta Region."
  - Spotlight why the monorepo enables rapid experimentation (shared config, design system).
- **Visuals:** Static title slide or the hero header paused at the mission statement.

## 1:30 – 4:30 | Home experience & impact signals
- Navigate to the landing page hero (`/` route) with the Volta hero background.
- Highlight the looping metrics block and explain the quarterly refresh cadence.
- CTA callouts: "Fuel the mission" vs. "Tour Volta initiatives".
- Reference the transparency of fallback messaging if the API is offline (shows operational resilience).

## 4:30 – 7:30 | Programs & Impact Explorer
- Scroll to the Programs section and demonstrate:
  - Region toggle (Volta vs Pan-African) and category filters.
  - Detail drawer that injects quotes, support pathways, and gallery assets.
- Mention the new Stories/Testimonial sections as downstream engagement loops.
- Share how the programs payload sources from `/programs` with mock data ready for live swap.

## 7:30 – 9:30 | Storytelling & community voices
- Transition to the **Stories** section. Open the most recent markdown-powered dispatch and narrate the field update.
- Call out the Plausible analytics hook (`story_opened`) for measuring narrative resonance.
- Slide to the **Voices** carousel and cycle to a donor, volunteer, and beneficiary testimonial, commenting on the rotation and audit logging.

## 9:30 – 11:30 | Get Involved & commerce
- Demonstrate the donation panel (Stripe intent) and the placeholder CTA for future payment methods.
- Emphasize inactive payment error handling in the API.
- Showcase the merch grid, tying each SKU back to the Creative Economy Studio narrative from the story feed.

## 11:30 – 13:00 | Backend credibility & operations
- Switch to terminal or screenshots highlighting:
  - Newsletter sign-up endpoint (`POST /engage/newsletter`) persisting to the ledger.
  - Payment webhook storage flows.
- Mention the newsletter form in the footer and the success/error banners.

## 13:00 – 15:00 | Close with KPIs and roadmap
- Transition to KPI highlights (see `kpi-briefing.md` for talk tracks).
- Present the roadmap slide: near-term shipping goals + 6-12 month horizon.
- End with funding ask and call-to-action for investor diligence follow-up.

### Demo operator checklist
- ✅ `npm run dev --workspace @mawu/api`
- ✅ `npm run dev --workspace @mawu/web`
- ✅ Stripe test keys and `VITE_ANALYTICS_DOMAIN` loaded in `.env`
- ✅ Plausible dashboard tab ready (optional live metrics)
- ✅ Browser cache cleared or use incognito to replay newsletter success message

> _Reminder:_ Keep the live tour under 15 minutes to leave room for questions and deeper dives.
