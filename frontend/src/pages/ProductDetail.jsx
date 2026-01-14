import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Share2, Truck, Package } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ImageWithFallback } from "../components/ImageWithFallback.jsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!data.product) return;

        const processed = {
          ...data.product,
          inStock: data.product.inventory?.stockCount > 0,
          images: data.product.images?.map(i => {
            const url = i?.url || i || '';
            if (!url || typeof url !== 'string') return '';
            if (url.startsWith('http')) return url;
            return url.startsWith('/') ? url : `/${url}`;
          }).filter(Boolean) || []
        };

        setProduct(processed);
      } catch (err) {
        console.error('Failed to load product:', err);
      }
    };

    const loadRecommended = async () => {
      try {
        const res = await fetch(`/api/recommendations/${id}`);
        const data = await res.json();
        setRecommended(data.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      }
    };

    loadProduct();
    loadRecommended();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);

        const userReviewData = data.reviews?.find(r => r.userId === user?.id);
        if (userReviewData) {
          setUserReview(userReviewData);
          setRating(userReviewData.rating);
          setComment(userReviewData.comment || '');
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };

    if (user) loadReviews();
  }, [id, user]);

  const handleSubmitReview = async () => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to submit review');
        return;
      }

      toast.success('Review submitted successfully');
      setUserReview(data.review);
      setReviews(prev => [data.review, ...prev.filter(r => r.userId !== data.review.userId)]);
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(Number(product.id), quantity);
      toast.success('Added to cart', {
        description: `${product.name} (${quantity})`
      });
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          <div className="space-y-4 sticky top-24 h-fit">
            <motion.div 
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

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square bg-[#f5f5f5] overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index ? 'ring-1 ring-black ring-offset-2' : 'hover:opacity-80'
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

            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">
                    In Stock ({product.inventory?.stockCount} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-red-600">Out of Stock</span>
                </>
              )}
            </div>

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
                    onClick={() => setQuantity(Math.min(product.inventory?.stockCount || 99, quantity + 1))}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

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

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share this product
            </button>

            <Accordion type="single" collapsible className="border-t border-gray-100 mt-4">
              <AccordionItem value="details">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider">
                  Product Details
                </AccordionTrigger>
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
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Clean with a soft, dry cloth. Avoid exposure to water and direct sunlight.
                    Condition leather every 3-6 months to maintain its natural oils and luster.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Free standard shipping on orders over $200. Express shipping available.
                    30-day return policy for unworn items in original packaging. Return shipping is free for exchanges.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
              
              {avgRating > 0 && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-yellow-500 text-2xl">
                    {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
                  </span>
                  <span className="text-lg font-medium">{avgRating} / 5</span>
                  <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                </div>
              )}

              {token ? (
                <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-4">
                    {userReview ? 'Edit your review' : 'Write a review'}
                  </h4>

                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:scale-110 transition`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="w-full border p-3 rounded mb-4 min-h-[100px]"
                    placeholder="Share your experience with this product..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />

                  <button
                    onClick={handleSubmitReview}
                    className="px-6 py-3 bg-black text-white rounded hover:bg-gray-900 transition"
                  >
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-8">
                  <a href="/login" className="underline">Login</a> to write a review.
                </p>
              )}

              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{r.user?.name || 'User'}</div>
                      <div className="text-yellow-500">
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
          {recommended.length === 0 ? (
            <p className="text-gray-500">No related products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map(item => (
                <div
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
