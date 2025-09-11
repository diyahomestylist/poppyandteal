import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { products, categories, cartActions } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    
    cartActions.addToCart(product);
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
            >
              <Eye size={20} className="rotate-45" />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-t-lg"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-medium text-gray-900 mb-2 font-poppins">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 font-poppins">{product.category}</p>
            <p className="text-gray-700 mb-6 font-poppins leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-light text-gray-900 font-poppins">
                ${product.price}
              </span>
              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={!product.inStock}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-poppins text-sm font-medium ${
                  product.inStock
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} />
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="py-20 bg-gray-50" id="shop">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 font-poppins">
              Our Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
              Each piece is lovingly handcrafted using premium materials, creating unique macramé art 
              that brings natural beauty and bohemian elegance to your space.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 font-poppins ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium font-poppins">Out of Stock</span>
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                        <Heart size={18} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Eye size={18} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 font-poppins">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-light text-gray-900 font-poppins">
                        ${product.price}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          product.inStock
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductGrid;