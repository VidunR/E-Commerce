// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import { Edit3, Loader2 } from "lucide-react";
import EditProductModal from "./EditProductModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load DB products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin – Products</h1>

      {/* Products Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{p.id}</td>

                <td className="p-4">
                  <img
                    src={p.images?.[0]?.url ? `/${p.images[0].url}` : '/products/placeholder.png'}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-4">{p.name}</td>

                <td className="p-4">${p.price}</td>

                <td className="p-4">{p.inventory?.stockCount || 0}</td>

                <td className="p-4">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="px-4 py-2 flex items-center gap-2 border rounded hover:bg-black hover:text-white transition"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSaved={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}