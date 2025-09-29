import { Link } from "react-router-dom";

import { Body, Container, Heading } from "../../design-system";
import { NewsletterSignup } from "../NewsletterSignup";

const exploreLinks = [
  { to: "/vision", label: "Vision" },
  { to: "/volta-focus", label: "Volta Focus" },
  { to: "/programs", label: "Programs" },
  { to: "/stories", label: "Stories" },
  { to: "/voices", label: "Voices" },
];

const engageLinks = [
  { to: "/donate", label: "Donate" },
  { to: "/shop", label: "Shop" },
];

export const SiteFooter = () => (
  <footer className="bg-ink-900 py-16 text-white">
    <Container className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6" id="newsletter">
        <Heading className="text-white" level={3}>
          Stay connected to the movement
        </Heading>
        <Body className="text-white/75" variant="light">
          Receive quarterly impact letters, volunteering opportunities, and
          regional expansion news as we scale across Africa.
        </Body>
        <NewsletterSignup />
        <p className="text-xs text-white/50">
          (c) {new Date().getFullYear()} Mawu Foundation. Crafted for investor
          previews--content subject to change.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 text-sm text-white/80 sm:grid-cols-3">
        <div className="space-y-3">
          <p className="font-semibold uppercase tracking-[0.18em] text-white/60">
            Explore
          </p>
          {exploreLinks.map((link) => (
            <Link className="transition hover:text-brand-200" key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="space-y-3">
          <p className="font-semibold uppercase tracking-[0.18em] text-white/60">
            Engage
          </p>
          {engageLinks.map((link) => (
            <Link className="transition hover:text-brand-200" key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <a className="transition hover:text-brand-200" href="#newsletter">
            Newsletter
          </a>
        </div>
        <div className="space-y-3">
          <p className="font-semibold uppercase tracking-[0.18em] text-white/60">
            Connect
          </p>
          <a className="transition hover:text-brand-200" href="mailto:hello@mawufoundation.org">
            hello@mawufoundation.org
          </a>
          <a className="transition hover:text-brand-200" href="tel:+233000000000">
            +233 000 000 000
          </a>
          <Link className="transition hover:text-brand-200" to="/vision">
            Transparency hub
          </Link>
        </div>
      </div>
    </Container>
  </footer>
);
