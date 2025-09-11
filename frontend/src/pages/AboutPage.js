import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Leaf, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="page-header">
        <div className="container">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>About Poppy & Teal</h1>
        </div>
      </header>

      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Where Creativity Meets Elegance</h2>
              <p>At Poppy and Teal, we bring timeless macramé art to life with a modern twist. Each piece is handcrafted with love, passion, and precision, designed to add warmth, charm, and a touch of boho sophistication to your everyday life.</p>
            </div>
            <div className="hero-image">
              <img src="/IMG_3177.JPG" alt="Our Story" />
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <Heart size={48} className="value-icon" />
              <h3>Made with Love</h3>
              <p>Every piece is crafted with passion and attention to detail, ensuring each creation tells its own unique story.</p>
            </div>
            
            <div className="value-card">
              <Leaf size={48} className="value-icon" />
              <h3>Sustainable</h3>
              <p>We use only eco-friendly, sustainably sourced materials for environmentally conscious living.</p>
            </div>
            
            <div className="value-card">
              <Users size={48} className="value-icon" />
              <h3>Community Focused</h3>
              <p>Supporting local artisans and bringing handmade art to homes across India and beyond.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ceo-section">
        <div className="container">
          <div className="ceo-content">
            <div className="ceo-image">
              <img src="/IMG_3179.JPG" alt="Shanthi Rajendran" />
            </div>
            <div className="ceo-text">
              <h2>Meet Our Founder</h2>
              <h3>Shanthi Rajendran</h3>
              <blockquote>
                "Macramé products made with love. That's what you get from us. I started Poppy and Teal with a simple vision - to bring the ancient art of macramé into modern homes while preserving its traditional craftsmanship."
              </blockquote>
              <p>With over a decade of experience in textile arts, Shanthi has dedicated her life to mastering the intricate art of macramé and sharing its beauty with the world.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;