import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Navbar() {
  const { cartCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/profile', label: 'Profile' },
    { path: '/admin', label: 'Dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      {/* Added max-w-7xl and mx-auto to center content and prevent overflow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-widest text-black">LUXE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive(link.path) ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                }`}
              >
                <span>{link.label}</span>
                {/* Improved Hover/Active State: Simple underline instead of background fill */}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-black" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <Link
              to="/search"
              className="p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full"
            >
              <Search className="w-5 h-5" />
            </Link>
            
            <Link
              to="/profile"
              className="hidden md:block p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-white sm:w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg tracking-wide transition-colors ${
                        isActive(link.path) ? 'font-medium text-black' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-6 border-t border-gray-100">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-6 text-center bg-black text-white hover:bg-black/90 transition-all text-sm uppercase tracking-wider"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}