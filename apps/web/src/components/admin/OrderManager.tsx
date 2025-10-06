import { useState } from "react";
import { api } from "../../lib/api";
import { Button, Card, Heading, Body } from "../../design-system";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: string;
  selectedVariations?: Record<string, string>;
}

interface Order {
  id: number;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: string;
  currency: string;
  stripePaymentIntentId?: string;
  status: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderManagerProps {
  orders: Order[];
  onRefresh: () => void;
}

export const OrderManager = ({ orders, onRefresh }: OrderManagerProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setLoading(true);
    try {
      await api.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      onRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      alert(`Failed to update order status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatVariations = (variations?: Record<string, string>) => {
    if (!variations || Object.keys(variations).length === 0) return '';
    return Object.entries(variations)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const formatAddress = (address?: Order['shippingAddress']) => {
    if (!address) return 'No address provided';
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (selectedOrder) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Heading level={2}>Order Details</Heading>
          <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
            Back to Orders
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="space-y-3">
              <div>
                <Body className="font-medium">Order ID</Body>
                <Body variant="muted">MF-{selectedOrder.id.toString().padStart(8, '0')}</Body>
              </div>
              <div>
                <Body className="font-medium">Status</Body>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                    disabled={loading}
                    className="text-sm rounded border border-ink-300 px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <Body className="font-medium">Total Amount</Body>
                <Body variant="muted">{selectedOrder.currency} {selectedOrder.totalAmount}</Body>
              </div>
              <div>
                <Body className="font-medium">Order Date</Body>
                <Body variant="muted">{new Date(selectedOrder.createdAt).toLocaleString()}</Body>
              </div>
              {selectedOrder.stripePaymentIntentId && (
                <div>
                  <Body className="font-medium">Payment ID</Body>
                  <Body variant="muted" className="font-mono text-xs">{selectedOrder.stripePaymentIntentId}</Body>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <Body className="font-medium">Name</Body>
                <Body variant="muted">{selectedOrder.customerName}</Body>
              </div>
              <div>
                <Body className="font-medium">Email</Body>
                <Body variant="muted">{selectedOrder.customerEmail}</Body>
              </div>
              <div>
                <Body className="font-medium">Shipping Address</Body>
                <Body variant="muted">{formatAddress(selectedOrder.shippingAddress)}</Body>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="border border-ink-100 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Body className="font-medium">{item.productName}</Body>
                    <Body variant="muted" className="mt-1">
                      Quantity: {item.quantity} × {selectedOrder.currency} {item.price}
                    </Body>
                    {item.selectedVariations && (
                      <Body variant="muted" className="mt-1">
                        Variations: {formatVariations(item.selectedVariations)}
                      </Body>
                    )}
                  </div>
                  <Body className="font-semibold">
                    {selectedOrder.currency} {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </Body>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Heading level={2}>Order Management</Heading>
        <Body variant="muted">{orders.length} total orders</Body>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div 
              className="flex items-center justify-between"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <Body className="font-semibold">
                      Order MF-{order.id.toString().padStart(8, '0')}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      {order.customerName} • {order.customerEmail}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.currency} {order.totalAmount}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Body>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {orders.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <Body variant="muted">No orders found</Body>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};