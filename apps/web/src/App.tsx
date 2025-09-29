import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { initAnalytics } from "./lib/analytics";
import { SiteLayout } from "./components/layout/SiteLayout";
import { LandingPage } from "./pages/LandingPage";
import { VisionPage } from "./pages/VisionPage";
import { VoltaFocusPage } from "./pages/VoltaFocusPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { VoicesPage } from "./pages/VoicesPage";
import { ShopPage } from "./pages/ShopPage";
import { DonatePage } from "./pages/DonatePage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />} path="/">
          <Route index element={<LandingPage />} />
          <Route element={<VisionPage />} path="vision" />
          <Route element={<VoltaFocusPage />} path="volta-focus" />
          <Route element={<ProgramsPage />} path="programs" />
          <Route element={<StoriesPage />} path="stories" />
          <Route element={<VoicesPage />} path="voices" />
          <Route element={<ShopPage />} path="shop" />
          <Route element={<DonatePage />} path="donate" />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
