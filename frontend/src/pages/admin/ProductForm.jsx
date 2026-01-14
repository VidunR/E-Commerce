import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export default function AdminProductForm({ token, product, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [],
    stock: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        images: (product.images || []).map(i => i.url),
        stock: product.inventory?.stockCount ?? 0,
      });
    }
  }, [product]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const addImageField = () => setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  const updateImage = (idx, val) => setForm(prev => ({ ...prev, images: prev.images.map((s, i) => i === idx ? val : s) }));
  const removeImage = (idx) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        images: form.images.filter(Boolean),
        stock: Number(form.stock || 0),
      };

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed');
      }

      toast.success(product ? 'Updated' : 'Created');
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6 p-4 border rounded bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-xs">Name</Label>
          <Input value={form.name} onChange={e => handleChange('name', e.target.value)} required />
        </div>

        <div>
          <Label className="text-xs">Description</Label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Price</Label>
            <Input value={form.price} onChange={e => handleChange('price', e.target.value)} type="number" min="0" step="0.01" required />
          </div>
          <div>
            <Label className="text-xs">Stock</Label>
            <Input value={form.stock} onChange={e => handleChange('stock', e.target.value)} type="number" min="0" />
          </div>
        </div>

        <div>
          <Label className="text-xs">Images (relative path e.g. products/wallet1.jpg)</Label>
          <div className="space-y-2">
            {form.images.map((img, idx) => (
              <div className="flex gap-2" key={idx}>
                <Input value={img} onChange={e => updateImage(idx, e.target.value)} />
                <button type="button" onClick={() => removeImage(idx)} className="px-3 py-1 border rounded text-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addImageField} className="px-3 py-1 border rounded">Add image</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button disabled={saving} className="px-4 py-2 bg-black text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
