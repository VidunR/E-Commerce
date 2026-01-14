import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Check } from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

export function Checkout() {
  const { clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [step, setStep] = useState("shipping");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const shipping = cartSubtotal > 200 ? 0 : 15;
  const tax = cartSubtotal * 0.08;
  const total = cartSubtotal + shipping + tax;

  useEffect(() => {
    const loadCart = async () => {
      setLoadingCart(true);
      try {
        if (!token) {
          const saved = localStorage.getItem("luxuryWalletCart");
          setCartItems(saved ? JSON.parse(saved) : []);
          return;
        }

        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load cart");

        const cart = await res.json();
        const items = (cart.items || []).map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name || "Product",
          price: item.price || item.product?.price || 0,
          quantity: item.quantity,
          variantColor: item.variantColor || ""
        }));
        setCartItems(items);
      } catch (err) {
        console.error("Failed to load cart:", err);
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [token]);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) {
        setLoadingAddresses(false);
        return;
      }

      setLoadingAddresses(true);
      try {
        const res = await fetch("/api/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load addresses");

        const data = await res.json();
        const addressList = data.addresses || [];
        setAddresses(addressList);
        
        const defaultAddress = addressList.find(a => a.isDefault) || addressList[0];
        setSelectedAddressId(defaultAddress?.id || null);
      } catch (err) {
        console.error("Failed to load addresses:", err);
        toast.error("Could not load addresses");
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [token]);

  const validateShipping = () => {
    setErrors({});
    if (addresses.length === 0) {
      setErrors({ address: "Please add a shipping address on your Profile" });
      return false;
    }
    if (!selectedAddressId) {
      setErrors({ address: "Please select a shipping address" });
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      setErrors({ payment: "Select a payment method" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === "shipping") {
      if (!token) {
        toast.error("Please log in to continue");
        navigate("/login");
        return;
      }
      if (!validateShipping()) return;
      setStep("payment");
    } else if (step === "payment") {
      if (!validatePayment()) return;
      setStep("review");
    }
  };

  const handleBack = () => {
    if (step === "review") setStep("payment");
    else if (step === "payment") setStep("shipping");
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Please log in to complete your purchase");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      const orderId = data.orderId || data.order?.id || data.id || `ORD-${Date.now()}`;

      await fetch("/api/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});

      clearCart();
      toast.success("Order placed successfully");
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error(err.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loadingCart || loadingAddresses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Your cart is empty</h2>
          <button onClick={() => navigate("/products")} className="px-6 py-2 bg-black text-white">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator number={1} label="Shipping" active={step === "shipping"} completed={step !== "shipping"} />
            <div className={`h-px w-16 ${step !== "shipping" ? "bg-black" : "bg-black/20"}`} />
            <StepIndicator number={2} label="Payment" active={step === "payment"} completed={step === "review"} />
            <div className={`h-px w-16 ${step === "review" ? "bg-black" : "bg-black/20"}`} />
            <StepIndicator number={3} label="Review" active={step === "review"} completed={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <div className="space-y-6">
                <h2>Choose shipping address</h2>

                {addresses.length === 0 ? (
                  <div className="p-6 bg-white border rounded">
                    <p className="mb-4">You don't have any saved addresses yet.</p>
                    <div className="flex gap-3">
                      <button onClick={() => navigate("/profile")} className="px-6 py-3 bg-black text-white">
                        Add Address
                      </button>
                      <button onClick={() => navigate("/products")} className="px-6 py-3 border">
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {errors.address && <div className="text-red-500">{errors.address}</div>}
                    <div className="grid gap-3">
                      {addresses.map(addr => (
                        <label 
                          key={addr.id} 
                          className={`p-4 border rounded-lg flex justify-between items-start ${
                            selectedAddressId === addr.id ? "border-black bg-gray-50" : "bg-white"
                          }`}
                        >
                          <div>
                            <div className="font-medium">
                              {addr.fullName}
                              {addr.isDefault && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-black text-white rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>{addr.street}</div>
                              <div>{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zipCode}</div>
                              <div>{addr.country}</div>
                              <div className="mt-1">{addr.phone}</div>
                            </div>
                          </div>
                          <input 
                            type="radio" 
                            name="shipping" 
                            checked={selectedAddressId === addr.id} 
                            onChange={() => setSelectedAddressId(addr.id)} 
                          />
                        </label>
                      ))}
                    </div>

                    <div className="pt-4">
                      <button onClick={() => navigate("/profile")} className="px-6 py-3 bg-black text-white mr-3">
                        Add / Manage Addresses
                      </button>
                      <button onClick={handleNext} className="px-6 py-3 border">
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <h2>Payment method</h2>
                {errors.payment && <div className="text-red-500">{errors.payment}</div>}
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border border-black/10 hover:border-black/30 transition cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      Credit / Debit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border border-black/10 hover:border-black/30 transition cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer flex-1">
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                <div className="pt-6 flex gap-4">
                  <button onClick={handleBack} className="px-6 py-3 border">Back</button>
                  <button onClick={handleNext} className="px-6 py-3 bg-black text-white">
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <h2>Review order</h2>

                <div className="p-4 bg-[#f5f5f5] rounded">
                  <h4 className="mb-3">Shipping Address</h4>
                  {selectedAddress ? (
                    <>
                      <p className="text-[13px]">{selectedAddress.fullName}</p>
                      <p className="text-[13px]">{selectedAddress.street}</p>
                      {selectedAddress.addressLine2 && <p className="text-[13px]">{selectedAddress.addressLine2}</p>}
                      <p className="text-[13px]">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                      </p>
                      <p className="text-[13px] mt-2">{selectedAddress.phone}</p>
                    </>
                  ) : (
                    <p className="text-red-500">No shipping address selected</p>
                  )}
                </div>

                <div className="p-4 bg-[#f5f5f5] rounded">
                  <h4 className="mb-3">Payment Method</h4>
                  <p className="text-[13px]">
                    {paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}
                  </p>
                </div>

                <div>
                  <h4 className="mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-[13px]">
                        <span>{item.productName} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={handleBack} className="px-6 py-3 border">Back</button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={placing} 
                    className="flex-1 px-6 py-3 bg-black text-white"
                  >
                    {placing ? "Placing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-black/10 p-6 space-y-4 sticky top-20 bg-white rounded">
              <h3>Order Summary</h3>

              <div className="space-y-2 text-[13px]">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-[#aaaaaa]">{item.productName} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-[13px] pt-3 border-t border-black/10">
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Tax (est.)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-black/10">
                <div className="flex justify-between items-center">
                  <span>Total</span>
                  <span className="text-[24px]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
        completed ? 'bg-black text-white' : active ? 'bg-black text-white' : 'border border-black/20 text-[#aaaaaa]'
      }`}>
        {completed ? <Check className="w-5 h-5" /> : number}
      </div>
      <span className={`text-[13px] ${active ? 'text-black' : 'text-[#aaaaaa]'}`}>{label}</span>
    </div>
  );
}
