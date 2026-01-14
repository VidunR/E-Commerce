import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, User, LogOut, Heart } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { toast } from 'sonner';

export function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    ...(user ? [{ path: '/profile', label: 'Profile' }] : []),
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Dashboard' }] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-widest text-black">LUXE</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

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
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-black" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="hidden md:block p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full"
                  title={`Welcome, ${user.name}`}
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden md:block p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 text-sm bg-black text-white hover:bg-black/90 transition-all"
              >
                Sign In
              </Link>
            )}

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

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-all rounded-full">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-white sm:w-[300px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Access navigation links and account options</SheetDescription>
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
                    {user ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 px-2">
                          Welcome, {user.name}
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full py-3 px-6 text-center bg-black text-white hover:bg-black/90 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-6 text-center bg-black text-white hover:bg-black/90 transition-all text-sm uppercase tracking-wider"
                      >
                        Sign In
                      </Link>
                    )}
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
