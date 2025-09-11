import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X, Instagram, Mail, Phone, MessageCircle } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const macrame_images = [
    { src: '/IMG_3122.JPG', title: 'Handcrafted Bags', subtitle: 'Where Creativity Meets Elegance' },
    { src: '/IMG_3131.JPG', title: 'Boho Wall Hangings', subtitle: 'Artful Charm for Your Space' },
    { src: '/IMG_3136.JPG', title: 'Plant Hangers', subtitle: 'Bring Nature Indoors' },
    { src: '/IMG_3139.JPG', title: 'Custom Creations', subtitle: 'Designed Just for You' },
    { src: '/IMG_3144.JPG', title: 'Statement Pieces', subtitle: 'Made with Love & Passion' },
    { src: '/IMG_3145.JPG', title: 'Organic Collection', subtitle: 'Sustainably Sourced Materials' },
    { src: '/IMG_3147.JPG', title: 'Fashion Forward', subtitle: 'Modern Macramé Accessories' },
    { src: '/IMG_3151.JPG', title: 'Home Décor', subtitle: 'Transform Your Living Space' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % macrame_images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [macrame_images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % macrame_images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + macrame_images.length) % macrame_images.length);
  };

  const handleWhatsAppOrder = () => {
    const message = "Hi! I'm interested in your macramé products from Poppy and Teal. Could you please share more details?";
    const phoneNumber = "919381340487"; // Remove + from the number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="preloader">
        <div className="loader-container">
          <div className="macrame-loader">
            <div className="knot knot-1"></div>
            <div className="knot knot-2"></div>
            <div className="knot knot-3"></div>
          </div>
          <div className="loader-text">
            <h3>Poppy & Teal</h3>
            <p>Crafting Beautiful Macramé Art...</p>
          </div>
        </div>
        <div className="fun-facts">
          <p>Did you know?</p>
          <ul>
            <li>Macramé originated in the 13th century with Arab weavers</li>
            <li>Each piece takes 3-8 hours of meticulous hand-knotting</li>
            <li>We use only eco-friendly, sustainably sourced materials</li>
            <li>Every creation is unique - no two pieces are exactly alike</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav-brand">
            <img src="/logo.png" alt="Poppy & Teal" className="logo" />
            <span className="brand-text">Poppy & Teal</span>
          </div>
          
          <nav className={`nav-menu ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <button className="whatsapp-btn" onClick={handleWhatsAppOrder}>
              <MessageCircle size={18} />
              Order Now
            </button>
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Social Sidebar */}
      <div className="social-sidebar">
        <a href="https://instagram.com/poppyandteal" target="_blank" rel="noopener noreferrer" className="social-link">
          <Instagram size={20} />
          <span>Instagram</span>
        </a>
        <a href="mailto:poppyandteal@gmail.com" className="social-link">
          <Mail size={20} />
          <span>Email</span>
        </a>
        <a href="tel:+919381340487" className="social-link">
          <Phone size={20} />
          <span>Call</span>
        </a>
        <button className="social-link message-btn" onClick={handleWhatsAppOrder}>
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </button>
      </div>

      {/* Hero Slider */}
      <section className="hero-slider">
        <div className="slider-container">
          {macrame_images.map((image, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image.src})` }}
            >
              <div className="slide-content">
                <div className="slide-text">
                  <span className="slide-number">{String(index + 1).padStart(2, '0')}.</span>
                  <h2 className="slide-title">{image.title}</h2>
                  <p className="slide-subtitle">{image.subtitle}</p>
                  <button className="cta-btn" onClick={handleWhatsAppOrder}>
                    Shop Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="slider-controls">
          <button className="control-btn prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="control-btn next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slider Indicators */}
        <div className="slider-indicators">
          {macrame_images.map((image, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              style={{ backgroundImage: `url(${image.src})` }}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="featured-preview">
        <div className="container">
          <div className="section-header">
            <h2>Our Signature Collections</h2>
            <p>Handcrafted with love, designed to inspire</p>
          </div>
          
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="/IMG_3154.JPG" alt="Macramé Bags" />
              </div>
              <div className="product-info">
                <h3>Statement Bags</h3>
                <p>From ₹1,200</p>
                <button className="product-btn" onClick={handleWhatsAppOrder}>
                  View Collection
                </button>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/IMG_3159.JPG" alt="Wall Hangings" />
              </div>
              <div className="product-info">
                <h3>Wall Hangings</h3>
                <p>From ₹800</p>
                <button className="product-btn" onClick={handleWhatsAppOrder}>
                  View Collection
                </button>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/IMG_3162.JPG" alt="Plant Hangers" />
              </div>
              <div className="product-info">
                <h3>Plant Hangers</h3>
                <p>From ₹450</p>
                <button className="product-btn" onClick={handleWhatsAppOrder}>
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Where Creativity Meets Elegance</h2>
              <p>At Poppy and Teal, we bring timeless macramé art to life with a modern twist. Each piece is handcrafted with love, passion, and precision, designed to add warmth, charm, and a touch of boho sophistication to your everyday life.</p>
              
              <div className="features">
                <div className="feature">
                  <h4>Handcrafted Excellence</h4>
                  <p>Every piece is meticulously hand-knotted by skilled artisans</p>
                </div>
                <div className="feature">
                  <h4>Sustainable Materials</h4>
                  <p>Eco-friendly, sustainably sourced materials for conscious living</p>
                </div>
                <div className="feature">
                  <h4>Custom Designs</h4>
                  <p>Personalized creations tailored to your style and space</p>
                </div>
              </div>

              <div className="ceo-quote">
                <blockquote>
                  "Macramé products made with love. That's what you get from us."
                </blockquote>
                <cite>— Shanthi Rajendran, CEO</cite>
              </div>
            </div>
            
            <div className="about-image">
              <img src="/IMG_3164.JPG" alt="Artisan at work" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/logo.png" alt="Poppy & Teal" />
              <h3>Poppy & Teal</h3>
              <p>Handcrafted Macramé Art</p>
            </div>
            
            <div className="footer-contact">
              <h4>Get in Touch</h4>
              <p>📩 poppyandteal@gmail.com</p>
              <p>📞 +91-9381340487</p>
              <p>📸 @poppyandteal</p>
            </div>
            
            <div className="footer-cta">
              <h4>Ready to Order?</h4>
              <button className="footer-whatsapp-btn" onClick={handleWhatsAppOrder}>
                <MessageCircle size={20} />
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;