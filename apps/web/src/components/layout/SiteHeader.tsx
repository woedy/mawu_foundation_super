import { NavLink, Link } from "react-router-dom";

import { Button, Container } from "../../design-system";

const navItems = [
  { to: "/vision", label: "Vision" },
  { to: "/volta-focus", label: "Volta Focus" },
  { to: "/programs", label: "Programs" },
  { to: "/stories", label: "Stories" },
  { to: "/voices", label: "Voices" },
  { to: "/shop", label: "Shop" },
  { to: "/donate", label: "Donate" },
];

export const SiteHeader = () => (
  <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-lg">
    <Container className="flex items-center justify-between py-4">
      <Link className="flex items-center gap-3" to="/">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-semibold text-white shadow-soft">
          MF
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">
            Mawu Foundation
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-ink-400">
            Humanity in Motion
          </p>
        </div>
      </Link>
      <nav aria-label="Primary">
        <ul className="hidden items-center gap-8 text-sm font-semibold text-ink-600 md:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                className={({ isActive }) =>
                  `transition hover:text-brand-600 ${
                    isActive ? "text-brand-600" : ""
                  }`
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Button as={Link} to="/donate">
        Give Today
      </Button>
    </Container>
  </header>
);
