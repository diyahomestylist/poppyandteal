import React, { useState, useEffect } from 'react';
import { Search, Menu, ShoppingBag, X } from 'lucide-react';
import { cartActions } from '../data/mock';

const Header = ({ onSearchToggle, onCartToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      setCartItemCount(cartActions.getCartItemCount());
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Poppy & Teal" 
            className="h-12 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a 
            href="#home" 
            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
          >
            Home
          </a>
          <div className="relative group">
            <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins flex items-center">
              Shop
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <a href="#wall-art" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wall Art</a>
              <a href="#plant-hangers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Plant Hangers</a>
              <a href="#home-decor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Home Decor</a>
              <a href="#lighting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Lighting</a>
            </div>
          </div>
          <a 
            href="#about" 
            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
          >
            About
          </a>
          <a 
            href="#contact" 
            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
          >
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button 
            onClick={onSearchToggle}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search size={20} className="text-gray-700" />
          </button>

          {/* Cart */}
          <button 
            onClick={onCartToggle}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingBag size={20} className="text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="container mx-auto px-6 py-4 space-y-4">
            <a 
              href="#home" 
              className="block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#shop" 
              className="block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </a>
            <a 
              href="#about" 
              className="block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors font-poppins"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;