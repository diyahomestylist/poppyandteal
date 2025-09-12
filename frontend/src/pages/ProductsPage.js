import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Filter } from 'lucide-react';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const products = [
    { id: 1, name: 'Boho Shoulder Bag', category: 'bags', price: 1500, image: '/IMG_3122.JPG', description: 'Handwoven macramé shoulder bag perfect for daily use' },
    { id: 2, name: 'Wall Hanging - Nature', category: 'home-decor', price: 1200, image: '/IMG_3131.JPG', description: 'Beautiful wall hanging with natural motifs' },
    { id: 3, name: 'Plant Hanger Set', category: 'home-decor', price: 800, image: '/IMG_3136.JPG', description: 'Set of 3 hanging planters for your green friends' },
    { id: 4, name: 'Statement Clutch', category: 'bags', price: 900, image: '/IMG_3139.JPG', description: 'Elegant evening clutch with intricate patterns' },
    { id: 5, name: 'Decorative Wall Art', category: 'home-decor', price: 1800, image: '/IMG_3144.JPG', description: 'Large statement piece for living rooms' },
    { id: 6, name: 'Crossbody Bag', category: 'bags', price: 1300, image: '/IMG_3145.JPG', description: 'Versatile crossbody bag for modern lifestyle' },
    { id: 7, name: 'Table Runner', category: 'home-decor', price: 600, image: '/IMG_3147.JPG', description: 'Elegant macramé table runner for dining' },
    { id: 8, name: 'Bohemian Tote', category: 'bags', price: 1600, image: '/IMG_3151.JPG', description: 'Spacious tote bag with boho charm' }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'bags', name: 'Bags & Accessories' },
    { id: 'home-decor', name: 'Home Décor' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleWhatsAppOrder = (product) => {
    const message = `Hi! I'm interested in the ${product.name} (₹${product.price}) from your Poppy and Teal collection. Could you please share more details?`;
    const phoneNumber = "919381340487";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="products-page">
      <header className="page-header">
        <div className="container">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>Our Products</h1>
          <p>Discover our handcrafted macramé collection</p>
        </div>
      </header>

      <section className="products-content">
        <div className="container">
          {/* Category Filter */}
          <div className="filter-section">
            <div className="filter-header">
              <Filter size={20} />
              <span>Filter by Category</span>
            </div>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button 
                      className="overlay-btn"
                      onClick={() => handleWhatsAppOrder(product)}
                    >
                      <MessageCircle size={20} />
                      Order via WhatsApp
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">₹{product.price}</div>
                  <button 
                    className="product-btn"
                    onClick={() => handleWhatsAppOrder(product)}
                  >
                    <MessageCircle size={18} />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Orders Section */}
          <div className="custom-orders">
            <div className="custom-content">
              <h2>Need Something Custom?</h2>
              <p>We create personalized macramé pieces tailored to your specific needs and style preferences.</p>
              <button 
                className="custom-btn"
                onClick={() => {
                  const message = "Hi! I'm interested in a custom macramé piece. Could we discuss my requirements?";
                  const phoneNumber = "919381340487";
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <MessageCircle size={20} />
                Discuss Custom Order
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
