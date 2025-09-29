import { Outlet } from "react-router-dom";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export const SiteLayout = () => (
  <div className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-100 text-ink-900">
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <SiteHeader />
    <main className="flex flex-col" id="main">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
);
