import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      {/* Added max-w-7xl mx-auto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-widest text-black">LUXE</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium minimalist wallets crafted for the modern individual.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-black">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products?category=bifold"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Bifold Wallets
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=cardholder"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Cardholders
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=travel"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Travel Wallets
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=all"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-black">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-black">Newsletter</h4>
            <p className="text-sm text-gray-500">
              Subscribe for exclusive offers and updates.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-white border-gray-200 focus:border-black transition-all"
              />
              <Button
                variant="ghost"
                className="bg-black text-white hover:bg-black/90 transition-all px-6"
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2025 LUXE. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}