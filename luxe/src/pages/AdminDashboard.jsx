import React, { useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, Plus, Edit2, Trash2, Search, TrendingUp, ArrowUpRight } from 'lucide-react';
import { mockProducts, mockOrders } from '../lib/mockData';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from "sonner";
import { ImageWithFallback } from "../components/ImageWithFallback.jsx";

export function AdminDashboard() {
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Updates
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatsCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toFixed(2)}`} 
            icon={DollarSign} 
            trend="+12.5%" 
          />
          <StatsCard 
            title="Total Orders" 
            value={totalOrders} 
            icon={ShoppingCart} 
            trend="+4.2%" 
          />
          <StatsCard 
            title="Active Products" 
            value={totalProducts} 
            icon={Package} 
            trend="+2" 
          />
          <StatsCard 
            title="Customers" 
            value="1,234" 
            icon={Users} 
            trend="+8.1%" 
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-1">
              <TabsList className="bg-transparent p-0 h-auto gap-6">
                <TabTrigger value="products">Products</TabTrigger>
                <TabTrigger value="orders">Orders</TabTrigger>
                <TabTrigger value="inventory">Inventory</TabTrigger>
              </TabsList>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
              </div>

              <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-all shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                  <DialogHeader className="border-b border-gray-100 pb-4 mb-4">
                    <DialogTitle className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    product={editingProduct}
                    onSave={(product) => {
                      if (editingProduct) {
                        setProducts(products.map(p => p.id === product.id ? product : p));
                        toast.success('Product updated');
                      } else {
                        setProducts([...products, { ...product, id: Date.now().toString() }]);
                        toast.success('Product added');
                      }
                      setProductModalOpen(false);
                    }}
                    onCancel={() => setProductModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[300px] text-xs font-semibold uppercase tracking-wider text-gray-500">Product</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">SKU</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Price</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category</TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-gray-200">
                            <ImageWithFallback
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                             <span className="font-medium text-gray-900">{product.name}</span>
                             {product.stock <= 5 && (
                                <p className="text-xs text-red-500 font-medium mt-0.5">Low Stock</p>
                             )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 font-mono">{product.sku}</TableCell>
                      <TableCell className="font-medium">${product.price}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 10 ? 'outline' : 'destructive'} className={product.stock > 10 ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50' : ''}>
                          {product.stock} units
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 capitalize">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setProductModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Order #</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Date</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium font-mono">{order.orderNumber}</TableCell>
                      <TableCell className="text-sm text-gray-500">{order.date}</TableCell>
                      <TableCell className="text-sm font-medium">{order.shippingAddress.fullName}</TableCell>
                      <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="text-sm font-medium text-black hover:underline underline-offset-4">
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">SKU</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Stock</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Variant Breakdown</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-sm text-gray-500 font-mono">{product.sku}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map(v => (
                                <span key={v.id} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs border border-gray-200">
                                    <span className="w-2 h-2 rounded-full mr-1.5 border border-gray-300" style={{ backgroundColor: v.colorHex }}></span>
                                    {v.color}: <span className="ml-1 font-semibold text-gray-900">{v.stock}</span>
                                </span>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.inStock ? 'outline' : 'destructive'} className={product.inStock ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* --- Helper Components --- */

function StatsCard({ title, value, icon: Icon, trend }) {
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <div className="p-2 bg-gray-50 rounded-full">
                    <Icon className="w-4 h-4 text-gray-900" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
                <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend}
                </span>
            </div>
        </div>
    );
}

function TabTrigger({ value, children }) {
    return (
        <TabsTrigger 
            value={value}
            className="px-0 pb-2 bg-transparent border-b-2 border-transparent rounded-none text-gray-500 font-medium hover:text-black data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none transition-all"
        >
            {children}
        </TabsTrigger>
    );
}

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    product || {
      id: '',
      sku: '',
      name: '',
      price: 0,
      description: '',
      category: 'bifold',
      images: ['https://images.unsplash.com/photo-1627123423411-a0b3f6acb165?w=800&q=80'],
      variants: [{ id: '', color: 'Black', colorHex: '#000000', stock: 0 }],
      stock: 0,
      inStock: true,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku" className="text-xs font-bold uppercase tracking-wider text-gray-500">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={e => setFormData({ ...formData, sku: e.target.value })}
            required
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-gray-500">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            required
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</Label>
          <Select value={formData.category} onValueChange={value => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bifold">Bifold</SelectItem>
              <SelectItem value="cardholder">Cardholder</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="zip">Zip Around</SelectItem>
              <SelectItem value="money-clip">Money Clip</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-200 focus:bg-white focus:border-black outline-none transition-all min-h-[120px] text-sm"
          required
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="flex-1 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-md hover:bg-gray-900 transition-all shadow-md"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-gray-200 text-sm font-bold uppercase tracking-wider rounded-md hover:border-black hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}