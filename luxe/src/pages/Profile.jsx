import React, { useState } from 'react';
import { User, MapPin, Package, Plus, Edit2, Trash2, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import { mockAddresses, mockOrders } from '../lib/mockData';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from "sonner";

export function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
  });
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast.success('Default address updated');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'shipped': return <Truck className="w-3 h-3 mr-1" />;
      case 'cancelled': return <XCircle className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your personal details and order history.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="flex flex-col md:flex-row w-full md:w-auto bg-transparent gap-2 h-auto p-0 border-b border-border pb-1">
            <TabsTrigger 
                value="profile" 
                className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none justify-start md:justify-center text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
                value="addresses"
                className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none justify-start md:justify-center text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger 
                value="orders"
                className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none justify-start md:justify-center text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-2xl bg-white p-8 border border-black/5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold tracking-tight">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Details
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-gray-500">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-500">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="px-8 py-2.5 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-all shadow-md"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-2.5 border border-gray-300 text-sm font-medium uppercase tracking-wider hover:border-black hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                  <h2 className="text-xl font-semibold tracking-tight">Saved Addresses</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your shipping and billing locations.</p>
              </div>
              <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={() => setEditingAddress(null)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                  </DialogHeader>
                  <AddressForm
                    address={editingAddress}
                    onSave={(address) => {
                      if (editingAddress) {
                        setAddresses(addresses.map(addr =>
                          addr.id === address.id ? address : addr
                        ));
                        toast.success('Address updated');
                      } else {
                        setAddresses([...addresses, { ...address, id: Date.now().toString() }]);
                        toast.success('Address added');
                      }
                      setAddressModalOpen(false);
                    }}
                    onCancel={() => setAddressModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map(address => (
                <div
                  key={address.id}
                  className="group relative p-6 bg-white border border-gray-200 rounded-lg hover:border-black/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">{address.fullName}</h4>
                      {address.isDefault && (
                        <Badge className="bg-black text-white hover:bg-black px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-sm">Default</Badge>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingAddress(address);
                          setAddressModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1.5 mb-6 font-light">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    <p className="pt-2 text-gray-900">{address.phone}</p>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-xs font-medium text-gray-400 hover:text-black underline-offset-4 hover:underline transition-colors uppercase tracking-wide"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                 <h2 className="text-xl font-semibold tracking-tight">Order History</h2>
                 <p className="text-sm text-gray-500 mt-1">View status and details of your purchases.</p>
            </div>

            <div className="space-y-6">
              {mockOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-black/20 transition-all duration-300 shadow-sm"
                >
                  <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">Order #{order.orderNumber}</h4>
                        <Badge variant="outline" className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="uppercase tracking-wider text-[10px] font-bold">
                             {order.status}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                         Placed on {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                  <Package className="w-6 h-6" />
                              </div>
                              <div>
                                  <p className="font-medium text-gray-900">{item.productName}</p>
                                  <p className="text-gray-500 text-xs">Color: {item.variantColor} • Qty: {item.quantity}</p>
                              </div>
                          </div>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                        <button className="text-sm font-medium text-black hover:underline underline-offset-4">View Invoice</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    address || {
      id: '',
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      isDefault: false,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</Label>
            <Input
            id="fullName"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="bg-gray-50 border-gray-200"
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</Label>
            <Input
            id="phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            required
            className="bg-gray-50 border-gray-200"
            />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1" className="text-xs font-bold uppercase tracking-wider text-gray-500">Address Line 1</Label>
        <Input
          id="addressLine1"
          value={formData.addressLine1}
          onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
          required
          className="bg-gray-50 border-gray-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2" className="text-xs font-bold uppercase tracking-wider text-gray-500">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          value={formData.addressLine2}
          onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
          className="bg-gray-50 border-gray-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-gray-500">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            required
            className="bg-gray-50 border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-xs font-bold uppercase tracking-wider text-gray-500">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={e => setFormData({ ...formData, state: e.target.value })}
            required
            className="bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-xs font-bold uppercase tracking-wider text-gray-500">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
            required
            className="bg-gray-50 border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-gray-500">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            required
            className="bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
        <button
          type="submit"
          className="flex-1 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-gray-200 text-sm font-bold uppercase tracking-wider hover:border-black hover:bg-white transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}