# Investor Demo Walkthrough Script

Use this script to guide a 15-minute investor preview that blends storytelling with live product moments. Each segment includes the target duration, the goal, and specific UI checkpoints.

## 0:00 – 1:30 | Opening narrative
- **Goal:** Anchor investors in the mission and today’s ask.
- **Script cues:**
  - "Mawu Foundation is engineering resilient futures across Africa, starting with a concentrated season in Ghana’s Volta Region."
  - Spotlight how the static demo keeps investor previews smooth (design system, curated data, offline resilience).
- **Visuals:** Static title slide or the hero header paused at the mission statement.

## 1:30 – 4:30 | Home experience & impact signals
- Navigate to the landing page hero (`/` route) with the Volta hero background.
- Highlight the looping metrics block and explain the quarterly refresh cadence.
- CTA callouts: "Fuel the mission" vs. "Tour Volta initiatives".
- Mention the inline notice that clarifies donation flows are showcased as upcoming Stripe integrations.

## 4:30 – 7:30 | Programs & Impact Explorer
- Scroll to the Programs section and demonstrate:
  - Region toggle (Volta vs Pan-African) and category filters.
  - Detail drawer that injects quotes, support pathways, and gallery assets.
- Mention the new Stories/Testimonial sections as downstream engagement loops.
- Reinforce that all data is maintained in repo TypeScript files, making refreshes quick before each investor session.

## 7:30 – 9:30 | Storytelling & community voices
- Transition to the **Stories** section. Open the most recent markdown-powered dispatch and narrate the field update.
- Call out the Plausible analytics hook (`story_opened`) for measuring narrative resonance when analytics are enabled.
- Slide to the **Voices** carousel and cycle to a donor, volunteer, and beneficiary testimonial, commenting on the rotation cadence.

## 9:30 – 11:30 | Get Involved & commerce
- Demonstrate the donation panel highlighting Stripe-first messaging plus clearly labelled "Coming Soon" methods.
- Show the volunteer and partnership CTAs pointing to follow-up conversations for the next integration phase.
- Showcase the merch grid, tying each SKU back to the Creative Economy Studio narrative from the story feed.

## 11:30 – 13:00 | Operational credibility
- Summarise how demo data lives in `apps/web/src/data` and markdown stories, making governance artifacts easy to refresh.
- Mention the newsletter form in the footer, the simulated confirmation banner, and how Plausible captures `newsletter_subscribed` events.

## 13:00 – 15:00 | Close with KPIs and roadmap
- Transition to KPI highlights (see `kpi-briefing.md` for talk tracks).
- Present the roadmap slide: near-term shipping goals + 6-12 month horizon.
- End with funding ask and call-to-action for investor diligence follow-up.

### Demo operator checklist
- ✅ `npm run dev --workspace @mawu/web`
- ✅ Optional: `VITE_ANALYTICS_DOMAIN` set in `.env`
- ✅ Plausible dashboard tab ready (if streaming events)
- ✅ Browser cache cleared or use incognito to replay newsletter success message
- ✅ Demo data reviewed in `apps/web/src/data` and `apps/web/src/stories`

> _Reminder:_ Keep the live tour under 15 minutes to leave room for questions and deeper dives.
