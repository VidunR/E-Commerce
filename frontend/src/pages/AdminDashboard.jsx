import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/products" className="p-6 border rounded hover:shadow">
            <h3 className="font-semibold">Products</h3>
            <p className="text-sm text-gray-500 mt-2">Create, edit and remove products</p>
          </Link>
          <Link to="/admin/orders" className="p-6 border rounded hover:shadow">
            <h3 className="font-semibold">Orders</h3>
            <p className="text-sm text-gray-500 mt-2">View and update orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
