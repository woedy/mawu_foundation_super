import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Heading, Section, Button, Card, Body } from "../design-system";
import { ProductManager } from "../components/admin/ProductManager";
import { OrderManager } from "../components/admin/OrderManager";
import { DonationManager } from "../components/admin/DonationManager";

type AdminView = 'dashboard' | 'products' | 'orders' | 'donations';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [adminRes, ordersRes, donationsRes, productsRes] = await Promise.all([
        api.get("/api/admin/me"),
        api.get("/api/admin/orders"),
        api.get("/api/admin/donations"),
        api.get("/api/products"),
      ]);
      setAdmin(adminRes.admin);
      setOrders(ordersRes.orders);
      setDonations(donationsRes.donations);
      setProducts(productsRes.products);
    } catch (err) {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.post("/api/admin/logout");
    navigate("/admin/login");
  };

  const refreshData = () => {
    loadData();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  const renderNavigation = () => (
    <div className="mb-8 flex flex-wrap gap-4">
      <Button 
        variant={currentView === 'dashboard' ? 'primary' : 'ghost'}
        onClick={() => setCurrentView('dashboard')}
      >
        Dashboard
      </Button>
      <Button 
        variant={currentView === 'products' ? 'primary' : 'ghost'}
        onClick={() => setCurrentView('products')}
      >
        Products
      </Button>
      <Button 
        variant={currentView === 'orders' ? 'primary' : 'ghost'}
        onClick={() => setCurrentView('orders')}
      >
        Orders
      </Button>
      <Button 
        variant={currentView === 'donations' ? 'primary' : 'ghost'}
        onClick={() => setCurrentView('donations')}
      >
        Donations
      </Button>
    </div>
  );

  const renderDashboardView = () => (
    <>
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Total Products</h3>
          <p className="mt-2 text-3xl font-bold">{products.length}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Total Donations</h3>
          <p className="mt-2 text-3xl font-bold">{donations.length}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">
            GHS {(orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0) + donations.reduce((sum, d) => sum + parseFloat(d.amount), 0)).toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="rounded border border-ink-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{order.customerName}</span>
                    <Body variant="muted" className="mt-1">{order.customerEmail}</Body>
                    <Body className="mt-2 font-semibold">{order.currency} {order.totalAmount}</Body>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <Body variant="muted" className="mt-2">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </Body>
              </div>
            ))}
            {orders.length === 0 && (
              <Body variant="muted">No orders yet</Body>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Recent Donations</h2>
          <div className="space-y-4">
            {donations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="rounded border border-ink-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{donation.anonymous ? 'Anonymous' : donation.donorName}</span>
                    {!donation.anonymous && <Body variant="muted" className="mt-1">{donation.donorEmail}</Body>}
                    <Body className="mt-2 font-semibold">{donation.currency} {donation.amount}</Body>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    donation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    donation.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donation.status}
                  </span>
                </div>
                <Body variant="muted" className="mt-2">
                  {donation.frequency} • {new Date(donation.createdAt).toLocaleDateString()}
                </Body>
              </div>
            ))}
            {donations.length === 0 && (
              <Body variant="muted">No donations yet</Body>
            )}
          </div>
        </Card>
      </div>
    </>
  );

  return (
    <Section>
      <div className="mb-8 flex items-center justify-between">
        <Heading level={1}>Admin Dashboard</Heading>
        <Button onClick={handleLogout} variant="secondary">Logout</Button>
      </div>

      {renderNavigation()}

      {currentView === 'dashboard' && renderDashboardView()}
      {currentView === 'products' && <ProductManager products={products} onRefresh={refreshData} />}
      {currentView === 'orders' && <OrderManager orders={orders} onRefresh={refreshData} />}
      {currentView === 'donations' && <DonationManager donations={donations} onRefresh={refreshData} />}
    </Section>
  );
};
