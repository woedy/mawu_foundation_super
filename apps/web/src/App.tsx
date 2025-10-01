import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { initAnalytics } from "./lib/analytics";
import { CartProvider } from "./contexts/CartContext";
import { SiteLayout } from "./components/layout/SiteLayout";
import { LandingPage } from "./pages/LandingPage";
import { VisionPage } from "./pages/VisionPage";
import { VoltaFocusPage } from "./pages/VoltaFocusPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { VoicesPage } from "./pages/VoicesPage";
import { EnhancedShopPage } from "./pages/EnhancedShopPage";
import { CartPage } from "./pages/CartPage";
import { ShopCheckoutPage } from "./pages/ShopCheckoutPage";
import { ShopSuccessPage } from "./pages/ShopSuccessPage";
import { EnhancedDonatePage } from "./pages/EnhancedDonatePage";
import { DonationCheckoutPage } from "./pages/DonationCheckoutPage";
import { DonationSuccessPage } from "./pages/DonationSuccessPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />} path="/">
            <Route index element={<LandingPage />} />
            <Route element={<VisionPage />} path="vision" />
            <Route element={<VoltaFocusPage />} path="volta-focus" />
            <Route element={<ProgramsPage />} path="programs" />
            <Route element={<StoriesPage />} path="stories" />
            <Route element={<VoicesPage />} path="voices" />
            <Route element={<EnhancedShopPage />} path="shop" />
            <Route element={<CartPage />} path="shop/cart" />
            <Route element={<ShopCheckoutPage />} path="shop/checkout" />
            <Route element={<ShopSuccessPage />} path="shop/success" />
            <Route element={<EnhancedDonatePage />} path="donate" />
            <Route element={<DonationCheckoutPage />} path="donate/checkout" />
            <Route element={<DonationSuccessPage />} path="donate/success" />
            <Route element={<NotFoundPage />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
