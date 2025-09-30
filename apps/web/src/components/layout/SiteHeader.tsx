import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { Body, Button, Container } from "../../design-system";

const navItems = [
  { to: "/vision", label: "Vision" },
  { to: "/volta-focus", label: "Volta Focus" },
  { to: "/programs", label: "Programs" },
  { to: "/stories", label: "Stories" },
  { to: "/voices", label: "Voices" },
  { to: "/shop", label: "Shop" },
  { to: "/donate", label: "Donate" },
];

export const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-lg">
      <Container className="flex items-center justify-between py-4">
        <Link className="flex items-center gap-3" to="/" onClick={closeMenu}>
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
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-semibold text-ink-600">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `transition hover:text-brand-600 ${isActive ? "text-brand-600" : ""}`
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:block">
          <Button as={Link} to="/donate">
            Give Today
          </Button>
        </div>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          className="inline-flex items-center justify-center rounded-full border border-ink-100/80 bg-white/90 p-2 text-ink-900 shadow-soft transition hover:border-brand-200 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
          onClick={toggleMenu}
          type="button"
        >
          <span className="sr-only">{isMenuOpen ? "Close navigation" : "Open navigation"}</span>
          <span aria-hidden className="relative block h-5 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 ease-in-out ${
                isMenuOpen ? "translate-y-2.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ease-in-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 ease-in-out ${
                isMenuOpen ? "-translate-y-2.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </Container>
      <div
        className={`md:hidden overflow-hidden border-t border-ink-100/60 bg-white/95 shadow-lg transition-[max-height,opacity] duration-200 ease-in-out ${
          isMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        id="mobile-navigation"
      >
        <Container className="space-y-6 py-6">
          <nav aria-label="Mobile primary">
            <ul className="space-y-4 text-base font-semibold text-ink-800">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    className={({ isActive }) =>
                      `block rounded-lg px-1 py-1 transition hover:text-brand-600 ${
                        isActive ? "text-brand-600" : ""
                      }`
                    }
                    onClick={closeMenu}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3">
            <Button as={Link} className="w-full justify-center" onClick={closeMenu} to="/donate">
              Give Today
            </Button>
            <Body className="text-sm text-ink-500" variant="muted">
              We are building alongside communities in Ghana's Volta Region. Explore each route to learn how investments drive
              shared prosperity.
            </Body>
          </div>
        </Container>
      </div>
    </header>
  );
};
