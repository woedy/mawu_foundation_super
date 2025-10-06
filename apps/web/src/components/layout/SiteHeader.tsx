import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { Body, Button, Container } from "../../design-system";
import { useCart } from "../../contexts/CartContext";

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
  const { itemCount } = useCart();

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
          <picture>
            <source srcSet="/web_logo_48.webp" type="image/webp" />
            <img 
              src="/web_logo_48.png" 
              alt="Mawu Foundation Logo" 
              className="h-12 w-12 object-contain"
              loading="eager"
              width="48"
              height="48"
            />
          </picture>
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
        <div className="flex items-center gap-4">
          <div className="hidden md:flex md:items-center md:gap-4">
            <Link to="/shop/cart" className="relative">
              <svg
                className="h-6 w-6 text-ink-600 hover:text-brand-600 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <Button as={Link} to="/donate">
              Give Today
            </Button>
          </div>
          <div className="flex md:hidden">
            <Button as={Link} to="/donate" className="mr-3">
              Give
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
        </div>
      </Container>
      
      {/* Mobile Navigation */}
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
          <div className="space-y-4">
            <Link 
              to="/shop/cart" 
              className="flex items-center justify-center gap-2 rounded-lg border border-ink-100 bg-white px-4 py-3 text-base font-medium text-ink-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              onClick={closeMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>View Cart</span>
              {itemCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <Button as={Link} className="w-full justify-center" onClick={closeMenu} to="/donate">
              Donate Now
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
