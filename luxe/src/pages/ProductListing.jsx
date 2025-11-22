import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { mockProducts, categories } from '../lib/mockData';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  
  // UI States
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedColors, priceRange, searchQuery]);

  // Filter Logic
  useEffect(() => {
    let filtered = mockProducts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedColors.length > 0) {
      filtered = filtered.filter(p =>
        p.variants.some(v => selectedColors.includes(v.color))
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, priceRange, selectedColors]);

  const availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Brown', hex: '#5D4037' },
    { name: 'Navy', hex: '#1a1a2e' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Tan', hex: '#d2b48c' },
    { name: 'Cognac', hex: '#8b4513' },
  ];

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedColors([]);
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedColors.length > 0 || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- TOP HEADER & CONTROLS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Collection</h1>
            <p className="text-gray-500 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 focus:ring-0 rounded-full text-sm transition-all duration-300 outline-none"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                showFilters || hasActiveFilters
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-200 hover:border-black'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          </div>
        </div>

        {/* --- COLLAPSIBLE FILTER PANEL --- */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50/50 rounded-xl p-6 mb-10 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Category Filter - FIXED DUPLICATION */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {/* Manual "All" Button */}
                      <button
                         onClick={() => setSelectedCategory('all')}
                         className={`px-4 py-2 text-sm rounded-md transition-all ${
                           selectedCategory === 'all' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-black'
                         }`}
                      >
                        All
                      </button>
                      
                      {/* Mapped Categories (Filtering out 'all' to prevent duplicates) */}
                      {categories
                        .filter(cat => cat.value !== 'all' && cat.value !== 'all-products') // Ensures no duplicate "All" from data
                        .map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`px-4 py-2 text-sm rounded-md transition-all ${
                            selectedCategory === cat.value ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Color</label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map(color => (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`w-8 h-8 rounded-full transition-transform duration-200 flex items-center justify-center ${
                            selectedColors.includes(color.name)
                              ? 'ring-2 ring-black ring-offset-2 scale-110'
                              : 'hover:scale-110 ring-1 ring-black/5'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                          aria-label={`Filter by ${color.name}`}
                        >
                           {selectedColors.includes(color.name) && (
                             <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                           )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price Range</label>
                        <span className="text-xs font-medium">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Clear Filters Link */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <button 
                        onClick={clearAllFilters}
                        className="text-sm text-red-500 hover:text-red-700 font-medium underline-offset-4 hover:underline transition-colors"
                    >
                        Reset all filters
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ACTIVE FILTER CHIPS --- */}
        {hasActiveFilters && !showFilters && (
           <div className="flex flex-wrap gap-2 mb-8">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                  {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 ml-1 hover:text-black" /></button>
                </span>
              )}
              {selectedColors.map(color => (
                <span key={color} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                  {color}
                   <button onClick={() => toggleColor(color)}><X className="w-3 h-3 ml-1 hover:text-black" /></button>
                </span>
              ))}
               {(priceRange[0] > 0 || priceRange[1] < 500) && (
                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                   ${priceRange[0]} - ${priceRange[1]}
                    <button onClick={() => setPriceRange([0, 500])}><X className="w-3 h-3 ml-1 hover:text-black" /></button>
                 </span>
               )}
               <button onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-black transition-colors ml-2">
                  Clear all
               </button>
           </div>
        )}

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-200 rounded-xl">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products match your criteria</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Try adjusting your price range, changing colors, or searching for a different term.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 bg-black text-white hover:bg-gray-900 transition-all rounded-sm uppercase tracking-wide text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}