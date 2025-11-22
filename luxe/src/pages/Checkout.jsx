import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Check } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from "sonner";


export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState('shipping');
  const [errors, setErrors] = useState({});

  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const shipping = cartTotal > 200 ? 0 : 15;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingData.fullName) newErrors.fullName = 'Full name is required';
    if (!shippingData.email) newErrors.email = 'Email is required';
    if (!shippingData.phone) newErrors.phone = 'Phone is required';
    if (!shippingData.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!shippingData.city) newErrors.city = 'City is required';
    if (!shippingData.state) newErrors.state = 'State is required';
    if (!shippingData.zipCode) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod !== 'card') return true;

    const newErrors = {};
    
    if (!cardData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!cardData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!cardData.cvv) newErrors.cvv = 'CVV is required';
    if (!cardData.cardName) newErrors.cardName = 'Name on card is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'shipping' && validateShipping()) {
      setStep('payment');
    } else if (step === 'payment' && validatePayment()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${orderNumber}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-black text-white hover:bg-black/90 transition-minimal"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator
              number={1}
              label="Shipping"
              active={step === 'shipping'}
              completed={step === 'payment' || step === 'review'}
            />
            <div className={`h-px w-16 ${step !== 'shipping' ? 'bg-black' : 'bg-black/20'}`} />
            <StepIndicator
              number={2}
              label="Payment"
              active={step === 'payment'}
              completed={step === 'review'}
            />
            <div className={`h-px w-16 ${step === 'review' ? 'bg-black' : 'bg-black/20'}`} />
            <StepIndicator
              number={3}
              label="Review"
              active={step === 'review'}
              completed={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="space-y-6">
                <h2>Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shippingData.fullName}
                      onChange={e => setShippingData({ ...shippingData, fullName: e.target.value })}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && <p className="text-[13px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingData.email}
                      onChange={e => setShippingData({ ...shippingData, email: e.target.value })}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-[13px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingData.phone}
                      onChange={e => setShippingData({ ...shippingData, phone: e.target.value })}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-[13px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      value={shippingData.addressLine1}
                      onChange={e => setShippingData({ ...shippingData, addressLine1: e.target.value })}
                      className={errors.addressLine1 ? 'border-red-500' : ''}
                    />
                    {errors.addressLine1 && <p className="text-[13px] text-red-500 mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      value={shippingData.addressLine2}
                      onChange={e => setShippingData({ ...shippingData, addressLine2: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingData.city}
                      onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && <p className="text-[13px] text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingData.state}
                      onChange={e => setShippingData({ ...shippingData, state: e.target.value })}
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && <p className="text-[13px] text-red-500 mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingData.zipCode}
                      onChange={e => setShippingData({ ...shippingData, zipCode: e.target.value })}
                      className={errors.zipCode ? 'border-red-500' : ''}
                    />
                    {errors.zipCode && <p className="text-[13px] text-red-500 mt-1">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingData.country}
                      onChange={e => setShippingData({ ...shippingData, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <h2>Payment Method</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border border-black/10 hover:border-black/30 transition-minimal cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-black/10 hover:border-black/30 transition-minimal cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="w-5 h-5" />
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-black/10 hover:border-black/30 transition-minimal cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer flex-1">Cash on Delivery</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={e => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className={errors.cardNumber ? 'border-red-500' : ''}
                      />
                      {errors.cardNumber && <p className="text-[13px] text-red-500 mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardData.expiryDate}
                        onChange={e => setCardData({ ...cardData, expiryDate: e.target.value })}
                        className={errors.expiryDate ? 'border-red-500' : ''}
                      />
                      {errors.expiryDate && <p className="text-[13px] text-red-500 mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                        className={errors.cvv ? 'border-red-500' : ''}
                      />
                      {errors.cvv && <p className="text-[13px] text-red-500 mt-1">{errors.cvv}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={cardData.cardName}
                        onChange={e => setCardData({ ...cardData, cardName: e.target.value })}
                        className={errors.cardName ? 'border-red-500' : ''}
                      />
                      {errors.cardName && <p className="text-[13px] text-red-500 mt-1">{errors.cardName}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-6">
                <h2>Review Order</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-[#f5f5f5]">
                    <h4 className="mb-3">Shipping Address</h4>
                    <p className="text-[13px]">{shippingData.fullName}</p>
                    <p className="text-[13px]">{shippingData.addressLine1}</p>
                    {shippingData.addressLine2 && <p className="text-[13px]">{shippingData.addressLine2}</p>}
                    <p className="text-[13px]">
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                    </p>
                    <p className="text-[13px] mt-2">{shippingData.email}</p>
                    <p className="text-[13px]">{shippingData.phone}</p>
                  </div>

                  <div className="p-4 bg-[#f5f5f5]">
                    <h4 className="mb-3">Payment Method</h4>
                    <p className="text-[13px]">
                      {paymentMethod === 'card' && 'Credit/Debit Card'}
                      {paymentMethod === 'paypal' && 'PayPal'}
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-[13px]">
                          <span>
                            {item.productName} - {item.variantColor} × {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step !== 'shipping' && (
                <button
                  onClick={() => setStep(step === 'review' ? 'payment' : 'shipping')}
                  className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-minimal"
                >
                  Back
                </button>
              )}
              {step !== 'review' ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-black text-white hover:bg-black/90 transition-minimal"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 px-6 py-3 bg-black text-white hover:bg-black/90 transition-minimal"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-black/10 p-6 space-y-4 sticky top-20">
              <h3>Order Summary</h3>

              <div className="space-y-2 text-[13px]">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-[#aaaaaa]">
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-[13px] pt-3 border-t border-black/10">
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
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
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-minimal ${
          completed
            ? 'bg-black text-white'
            : active
            ? 'bg-black text-white'
            : 'border border-black/20 text-[#aaaaaa]'
        }`}
      >
        {completed ? <Check className="w-5 h-5" /> : number}
      </div>
      <span className={`text-[13px] ${active ? 'text-black' : 'text-[#aaaaaa]'}`}>
        {label}
      </span>
    </div>
  );
}
