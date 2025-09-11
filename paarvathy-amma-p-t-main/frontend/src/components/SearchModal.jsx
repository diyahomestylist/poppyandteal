import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { products } from '../data/mock';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="container mx-auto px-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 font-poppins">Search Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="py-8">
          <div className="relative max-w-2xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for macramé products..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-poppins"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto pb-8">
          {searchTerm.trim() && (
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-6 font-poppins">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 font-poppins">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 font-poppins">{product.category}</p>
                        <p className="text-lg font-light text-gray-900 font-poppins">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-poppins">No products found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {!searchTerm.trim() && (
            <div className="text-center py-12">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-poppins">Start typing to search for products...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;