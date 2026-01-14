import React, { useEffect, useState } from "react";
import { Loader2, Eye } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import OrderDetailModal from "./OrderDetailModal";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin – Orders</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.user?.email || 'N/A'}</td>
                <td className="p-4 font-medium">${order.totalPrice}</td>
                <td className="p-4 capitalize">{order.status}</td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-black hover:text-white transition"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={(updated) => {
            setOrders(prev =>
              prev.map(o => (o.id === updated.id ? updated : o))
            );
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
