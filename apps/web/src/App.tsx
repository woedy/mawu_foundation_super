import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { initAnalytics } from "./lib/analytics";
import { CartProvider } from "./contexts/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { SiteLayout } from "./components/layout/SiteLayout";
import { LandingPage } from "./pages/LandingPage";
import { VisionPage } from "./pages/VisionPage";
import { VoltaFocusPage } from "./pages/VoltaFocusPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { VoicesPage } from "./pages/VoicesPage";
import { EnhancedShopPage } from "./pages/EnhancedShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { ShopCheckoutPage } from "./pages/ShopCheckoutPage";
import { ShopSuccessPage } from "./pages/ShopSuccessPage";
import { EnhancedDonatePage } from "./pages/EnhancedDonatePage";
import { DonationCheckoutPage } from "./pages/DonationCheckoutPage";
import { DonationSuccessPage } from "./pages/DonationSuccessPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { ProgramDetailPage } from "./pages/ProgramDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<SiteLayout />} path="/">
                <Route index element={<LandingPage />} />
                <Route element={<VisionPage />} path="vision" />
                <Route element={<VoltaFocusPage />} path="volta-focus" />
                <Route element={<ProgramsPage />} path="programs" />
                <Route element={<ProgramDetailPage />} path="programs/:slug" />
                <Route element={<StoriesPage />} path="stories" />
                <Route element={<VoicesPage />} path="voices" />
                <Route element={<EnhancedShopPage />} path="shop" />
                <Route element={<ProductDetailPage />} path="shop/product/:slug" />
                <Route element={<CartPage />} path="shop/cart" />
                <Route element={<ShopCheckoutPage />} path="shop/checkout" />
                <Route element={<ShopSuccessPage />} path="shop/success" />
                <Route element={<EnhancedDonatePage />} path="donate" />
                <Route element={<DonationCheckoutPage />} path="donate/checkout" />
                <Route element={<DonationSuccessPage />} path="donate/success" />
                <Route element={<AdminLoginPage />} path="admin/login" />
                <Route element={<AdminDashboardPage />} path="admin/dashboard" />
                <Route element={<NotFoundPage />} path="*" />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
