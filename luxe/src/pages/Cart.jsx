import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { ImageWithFallback } from "../components/ImageWithFallback.jsx";

export function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 200 ? 0 : 15;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-[#aaaaaa]" />
          <div>
            <h2 className="mb-2">Your cart is empty</h2>
            <p className="text-[#aaaaaa]">
              Start shopping to add items to your cart
            </p>
          </div>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-black text-white hover:bg-black/90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-black/10 hover:border-black/20 transition"
              >
                <Link
                  to={`/product/${item.productId}`}
                  className="w-24 h-24 bg-[#f5f5f5] shrink-0"
                >
                  <ImageWithFallback
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="hover:underline"
                    >
                      <h4>{item.productName}</h4>
                    </Link>
                    {item.variantColor && (
                      <p className="text-[13px] text-[#aaaaaa]">
                        Color: {item.variantColor}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-black/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-black hover:text-white transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-[13px]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-black hover:text-white transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-[16px]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 h-fit hover:text-red-600 transition"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-black/10 p-6 space-y-6 sticky top-20">
              <h3>Order Summary</h3>

              <div className="space-y-3 text-[13px]">
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

              {cartTotal < 200 && (
                <p className="text-[13px] text-[#aaaaaa]">
                  Add ${(200 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-black text-white hover:bg-black/90 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-[13px] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
