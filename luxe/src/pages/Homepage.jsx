import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, Shield } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../lib/mockData';
import { ImageWithFallback } from "../components/ImageWithFallback.jsx";

export function Homepage() {
  const featuredProducts = mockProducts.slice(0, 4);
  
  // Spotlight State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div className="min-h-screen">
      {/* --- NEW SPOTLIGHT HERO SECTION --- */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative h-[85vh] bg-black flex items-center justify-center overflow-hidden cursor-default group"
      >
        {/* 1. Background Image (Dimmed) */}
        <div className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-30">
          <ImageWithFallback
            src="public\products\wallet6.jpg"
            alt="Premium luxury wallet on dark background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. The Spotlight Effect Layer */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.4), transparent 40%)`
          }}
        />

        {/* 3. Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
            Crafted for Minimalists
          </h1>
          <p className="mb-10 text-[18px] text-white/70 max-w-2xl mx-auto leading-relaxed">
            Premium Italian leather wallets designed for the modern individual.
            Experience the perfect balance of function and form.
          </p>
          <Link
            to="/products"
            className="inline-block px-12 py-4 bg-white text-black font-medium tracking-wide hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-sm"
          >
            Shop Featured
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3 group hover:-translate-y-1 transition-transform duration-300">
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold">Worldwide Shipping</h4>
              <p className="text-sm text-gray-500">Free shipping on orders over $200</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group hover:-translate-y-1 transition-transform duration-300">
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-semibold">30-Day Returns</h4>
              <p className="text-sm text-gray-500">Hassle-free returns and exchanges</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group hover:-translate-y-1 transition-transform duration-300">
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold">Secure Payments</h4>
              <p className="text-sm text-gray-500">Industry-standard encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">Featured Collection</h2>
            <p className="text-gray-500">Discover our most popular designs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/products"
              className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Secondary Banner */}
      <section className="bg-[#111] text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Timeless Design</h2>
              <p className="text-white/60 mb-8 text-lg leading-relaxed">
                Each wallet is meticulously crafted from premium Italian leather,
                designed to age beautifully and last a lifetime. Our minimalist
                approach ensures every detail serves a purpose.
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Explore Collection
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden">
              <ImageWithFallback
                src="public\products\wallet3.jpg"
                alt="Minimalist wallet detail"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}