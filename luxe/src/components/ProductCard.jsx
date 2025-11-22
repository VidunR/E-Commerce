import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { toast } from "sonner";
import { ImageWithFallback } from "./ImageWithFallback";

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = product.variants[0];
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      variantId: firstVariant.id,
      variantColor: firstVariant.color,
      quantity: 1,
      price: product.price,
    });

    toast.success('Added to cart', {
      description: `${product.name} - ${firstVariant.color}`,
    });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = product.variants[0];
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      variantId: firstVariant.id,
      variantColor: firstVariant.color,
      quantity: 1,
      price: product.price,
    });

    navigate('/checkout');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="group block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3 rounded-sm">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Hover Actions Overlay - Top Right */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
        >
          <button
            onClick={handleQuickAdd}
            className="bg-white p-2.5 text-black rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
            aria-label="Quick add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleQuickView}
            className="bg-white p-2.5 text-black rounded-full shadow-md hover:bg-black hover:text-white transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Out of Stock
          </div>
        )}

        {/* FIXED: Buy Now Button - Absolute Positioned at Bottom of Image */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
           <button
            onClick={handleBuyNow}
            className="w-full py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors shadow-lg"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-black group-hover:text-gray-600 transition-colors">
                {product.name}
            </h3>
            <p className="text-sm font-medium text-black">${product.price}</p>
        </div>
       
        {/* Variant Colors - Reserved height prevents jumping */}
        <div className="h-5">
           <div className={`flex items-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {product.variants.map(variant => (
              <div
                  key={variant.id}
                  className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: variant.colorHex }}
                  title={variant.color}
              />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}