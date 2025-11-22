import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail } from 'lucide-react';

export function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8 py-12">
        <CheckCircle className="w-20 h-20 mx-auto text-green-600" />
        
        <div className="space-y-4">
          <h1>Order Confirmed!</h1>
          <p className="text-[#aaaaaa]">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="bg-[#f5f5f5] p-8 space-y-4">
          <div className="space-y-2">
            <p className="text-[13px] text-[#aaaaaa]">Order Number</p>
            <p className="text-[24px]">{orderNumber}</p>
          </div>
          <p className="text-[13px] text-[#aaaaaa]">
            A confirmation email has been sent to your email address
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <div className="p-6 border border-black/10 space-y-3">
            <Package className="w-8 h-8 mx-auto" />
            <h4>Track Your Order</h4>
            <p className="text-[13px] text-[#aaaaaa]">
              You'll receive tracking information via email once your order ships
            </p>
          </div>

          <div className="p-6 border border-black/10 space-y-3">
            <Mail className="w-8 h-8 mx-auto" />
            <h4>Order Updates</h4>
            <p className="text-[13px] text-[#aaaaaa]">
              We'll keep you updated on your order status every step of the way
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            to="/products"
            className="px-8 py-3 bg-black text-white hover:bg-black/90 transition-minimal"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-minimal"
          >
            View Orders
          </Link>
        </div>

        <div className="pt-8 border-t border-black/10">
          <h4 className="mb-4">What happens next?</h4>
          <div className="space-y-3 text-[13px] text-left max-w-md mx-auto">
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px]">1</span>
              <p>Order confirmation email sent</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px]">2</span>
              <p>Your order is being prepared (1-2 business days)</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px]">3</span>
              <p>Shipped & tracking information sent (5-7 business days)</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px]">4</span>
              <p>Delivered to your door</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
