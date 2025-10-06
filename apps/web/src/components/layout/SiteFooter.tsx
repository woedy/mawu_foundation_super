import { Link } from "react-router-dom";

import { Body, Container, Heading } from "../../design-system";
import { NewsletterSignup } from "../NewsletterSignup";

type NavigationLink = { label: string } & ({ to: string } | { href: string });

const isRouteLink = (link: NavigationLink): link is NavigationLink & { to: string } => "to" in link;

const commitments = [
  "Community stewardship councils guide every investment.",
  "Transparent budgets and dashboards keep partners aligned.",
  "Long-term maintenance plans protect local infrastructure.",
];

const navigationColumns = [
  {
    title: "Explore",
    links: [
      { to: "/vision", label: "Vision & thesis" },
      { to: "/volta-focus", label: "Volta focus" },
      { to: "/programs", label: "Programs" },
      { to: "/stories", label: "Stories" },
    ],
  },
  {
    title: "Participate",
    links: [
      { to: "/donate", label: "Donate" },
      { to: "/voices", label: "Voices hub" },
      { to: "/shop", label: "Shop the movement" },
      { to: "/volta-focus", label: "Season priorities" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/vision", label: "Accountability" },
      { to: "/stories", label: "Field reports" },
      { href: "mailto:hello@mawufoundation.org", label: "Contact" },
      { href: "https://plausible.io/", label: "Analytics (optional)" },
    ],
  },
  {
    title: "Follow",
    links: [
      { href: "https://twitter.com/mawufoundation", label: "Twitter" },
      { href: "https://www.linkedin.com/company/mawufoundation", label: "LinkedIn" },
      { href: "https://instagram.com/mawufoundation", label: "Instagram" },
    ],
  },
// Using `satisfies` ensures TypeScript understands the discriminated union for href/to links.
] satisfies Array<{ title: string; links: NavigationLink[] }>;

export const SiteFooter = () => (
  <footer className="bg-ink-900 text-white">
    <Container className="space-y-12 py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <Link className="flex items-center gap-3 text-left" to="/">
            <picture>
              <source srcSet="/web_logo_48.webp" type="image/webp" />
              <img 
                src="/web_logo_48.png" 
                alt="Mawu Foundation Logo" 
                className="h-12 w-12 object-contain"
                loading="lazy"
                width="48"
                height="48"
              />
            </picture>
            <div>
              <p className="font-display text-lg font-semibold text-white">Mawu Foundation</p>
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Rooted in community power</p>
            </div>
          </Link>
          <Body className="max-w-xl text-white/80" variant="light">
            We partner with communities across Ghana's Volta Region to expand access to health, learning, climate resilience,
            and dignified livelihoods. Every pilot is co-created with local leaders to unlock prosperity that outlasts aid
            cycles.
          </Body>
          <ul className="space-y-3 text-sm text-white/70">
            {commitments.map((item) => (
              <li className="flex items-start gap-3" key={item}>
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-brand-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 text-sm text-white/60">
            <p>Field office: Ho, Volta Region, Ghana</p>
            <a className="transition hover:text-brand-200" href="mailto:hello@mawufoundation.org">
              hello@mawufoundation.org
            </a>
            <a className="transition hover:text-brand-200" href="tel:+233000000000">
              +233 000 000 000
            </a>
          </div>
        </div>
        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8" id="newsletter">
          <Heading className="text-white" level={3}>
            Stay close to the work
          </Heading>
          <Body className="text-white/75" variant="light">
            Quarterly stories, seasonal priorities, and partner briefings delivered straight to your inbox.
          </Body>
          <NewsletterSignup />
          <p className="text-xs text-white/45">
            We send a single update each quarter and you can unsubscribe at any time.
          </p>
        </div>
      </div>
      <div className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {navigationColumns.map((column) => (
          <div className="space-y-4" key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{column.title}</p>
            <ul className="space-y-3 text-sm text-white/75">
              {column.links.map((link) => (
                <li key={link.label}>
                  {isRouteLink(link) ? (
                    <Link className="transition hover:text-brand-200" to={link.to}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      className="transition hover:text-brand-200"
                      href={link.href}
                      rel="noreferrer"
                      target={link.href?.startsWith("http") ? "_blank" : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Mawu Foundation. Empowering communities across Ghana's Volta Region.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-white/60">
          <a className="transition hover:text-brand-200" href="#newsletter">
            Newsletter
          </a>
          <Link className="transition hover:text-brand-200" to="/vision">
            Transparency hub
          </Link>
          <Link className="transition hover:text-brand-200" to="/stories">
            Field stories
          </Link>
        </div>
      </div>
    </Container>
  </footer>
);
