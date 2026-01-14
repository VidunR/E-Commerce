import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";

export default function OrderDetailModal({ order, onClose, onStatusUpdated }) {
  const { token } = useAuth();
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const statuses = ["pending-payment", "paid", "processing", "shipped", "delivered", "cancelled"];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update');
      }
      
      toast.success('Order status updated');
      onStatusUpdated(data.order);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Update failed');
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Customer</h3>
            <p>{order.user.email}</p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p>{order.address.fullName}</p>
            <p>{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
            <p>{order.address.country}</p>
            <p>Phone: {order.address.phone}</p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Items</h3>

            <div className="space-y-3">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <select
              className="border p-3 rounded w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
