import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Heading, Section, Button } from "../design-system";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [adminRes, ordersRes, donationsRes] = await Promise.all([
        api.get("/api/admin/me"),
        api.get("/api/admin/orders"),
        api.get("/api/admin/donations"),
      ]);
      setAdmin(adminRes.admin);
      setOrders(ordersRes.orders);
      setDonations(donationsRes.donations);
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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <Section>
      <div className="mb-8 flex items-center justify-between">
        <Heading level={1}>Admin Dashboard</Heading>
        <Button onClick={handleLogout} variant="secondary">Logout</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-lg border border-ink-200 bg-white p-6">
          <h3 className="text-sm font-medium text-ink-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white p-6">
          <h3 className="text-sm font-medium text-ink-500">Total Donations</h3>
          <p className="mt-2 text-3xl font-bold">{donations.length}</p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white p-6">
          <h3 className="text-sm font-medium text-ink-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">
            GHS {(orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0) + donations.reduce((sum, d) => sum + parseFloat(d.amount), 0)).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="rounded border p-4">
                <div className="flex justify-between">
                  <span className="font-medium">{order.customerName}</span>
                  <span className={`px-2 py-1 rounded text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-ink-600 mt-1">{order.customerEmail}</p>
                <p className="text-sm font-semibold mt-2">GHS {order.totalAmount}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Recent Donations</h2>
          <div className="space-y-4">
            {donations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="rounded border p-4">
                <div className="flex justify-between">
                  <span className="font-medium">{donation.anonymous ? 'Anonymous' : donation.donorName}</span>
                  <span className={`px-2 py-1 rounded text-xs ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {donation.status}
                  </span>
                </div>
                {!donation.anonymous && <p className="text-sm text-ink-600 mt-1">{donation.donorEmail}</p>}
                <p className="text-sm font-semibold mt-2">GHS {donation.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
