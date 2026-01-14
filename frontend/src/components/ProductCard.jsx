import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { useWishlist } from '../lib/WishlistContext';
import { toast } from "sonner";
import { ImageWithFallback } from "./ImageWithFallback";

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const wish = isInWishlist(product.id);

  if (!product || !product.images) {
    return null;
  }
  


  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(Number(product.id), 1);
      toast.success('Added to cart', {
        description: product.name,
      });
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(Number(product.id), 1);
      navigate('/checkout');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wish) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
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
          src={product.images?.[0] || ''}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Wishlist Button - Top Left */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 left-3 bg-white p-2.5 rounded-full shadow-md hover:bg-black hover:text-white transition-colors z-10"
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${wish ? 'fill-black text-black' : 'text-black'}`} />
        </button>

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
       

      </div>
    </div>
  );
}