import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Share2, Truck, Package } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { useCart } from '../lib/CartContext';
import { toast } from "sonner";
import { motion } from "framer-motion"; // IMPORTED FOR ANIMATION

import { ImageWithFallback } from "../components/ImageWithFallback.jsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = mockProducts.find(p => p.id === id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants[0].id || ''
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-black text-white hover:bg-black/90 transition-minimal"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const selectedVariantData = product.variants.find(v => v.id === selectedVariant);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    if (!selectedVariantData) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      variantId: selectedVariant,
      variantColor: selectedVariantData.color,
      quantity,
      price: product.price,
    });

    toast.success('Added to cart', {
      description: `${product.name} - ${selectedVariantData.color} (${quantity})`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          {/* --- IMAGE CAROUSEL (Wrapped in Motion) --- */}
          <div className="space-y-4 sticky top-24 h-fit">
            <motion.div 
                // This layoutId connects to the ProductCard image for smooth morphing
                layoutId={`product-image-${product.id}`}
                className="relative aspect-square bg-[#f5f5f5] overflow-hidden group rounded-sm"
            >
              <ImageWithFallback
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white rounded-full"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white rounded-full"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square bg-[#f5f5f5] overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'ring-1 ring-black ring-offset-2'
                        : 'hover:opacity-80'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-baseline gap-4">
                <p className="text-2xl font-medium">${product.price}</p>
                <p className="text-sm text-gray-400">SKU: {product.sku}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">In Stock ({selectedVariantData?.stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Color Variants */}
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-wide">Color: <span className="text-gray-500 font-normal">{selectedVariantData?.color}</span></label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`w-12 h-12 rounded-full border transition-all duration-200 ${
                      selectedVariant === variant.id
                        ? 'border-black ring-1 ring-black ring-offset-2 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.color}
                    aria-label={`Select ${variant.color} color`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-wide">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariantData?.stock || 99, quantity + 1))}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full py-4 border border-black font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-full">
                    <Truck className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Free Shipping</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    On orders over $200. Estimated delivery: 5-7 business days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-full">
                    <Package className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Easy Returns</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    30-day return policy on all products
                  </p>
                </div>
              </div>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share this product
            </button>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="border-t border-gray-100 mt-4">
              <AccordionItem value="details">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider">Product Details</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-gray-600 list-disc pl-4">
                    <li>Premium Italian leather</li>
                    <li>RFID protection</li>
                    <li>Dimensions: 4.5" x 3.5" x 0.4"</li>
                    <li>Weight: 2.1 oz</li>
                    <li>Card capacity: 8 cards</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider">Care Instructions</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Clean with a soft, dry cloth. Avoid exposure to water and direct sunlight.
                    Condition leather every 3-6 months to maintain its natural oils and luster.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider">Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Free standard shipping on orders over $200. Express shipping available.
                    30-day return policy for unworn items in original packaging. Return shipping is free for exchanges.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
}