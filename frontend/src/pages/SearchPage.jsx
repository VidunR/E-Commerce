import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../lib/mockData';
import { ProductCard } from '../components/ProductCard';

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Get first 8 products to show by default
  const defaultProducts = mockProducts.slice(0, 8);

  // Handle search logic
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const results = mockProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(results);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setFilteredProducts([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- SEARCH INPUT --- */}
        <div className="max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-bold text-center mb-8">Search</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-full text-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* --- RESULTS AREA --- */}
        <div>
          {query.length === 0 ? (
            /* DEFAULT VIEW (No Search) */
            <div className="space-y-6">
               <h2 className="text-xl font-bold">Popular Products</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {defaultProducts.map((product) => (
                     <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* NO RESULTS */
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found for "{query}"</p>
              <button 
                onClick={clearSearch} 
                className="mt-4 text-sm font-bold underline hover:text-gray-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* SEARCH RESULTS */
            <div className="space-y-6">
              <p className="text-sm text-gray-500">Found {filteredProducts.length} results</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}