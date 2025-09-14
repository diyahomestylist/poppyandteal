import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Instagram, MessageCircle, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `Hi! I'm ${formData.name}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`;
    const phoneNumber = '919080961400'; // no '+' for wa.me
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuickWhatsApp = () => {
    const message = "Hi! I'd like to know more about your macramé products.";
    const phoneNumber = '919080961400';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-page">
      <header className="page-header">
        <div className="container">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you!</p>
        </div>
      </header>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="6"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  <Send size={20} />
                  Send via WhatsApp
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>Contact Information</h2>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <Phone size={24} />
                  </div>
                  <div className="method-info">
                    <h4>Phone</h4>
                    <p>+91-9080961400</p>
                    <small>Available 9 AM - 7 PM</small>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <Mail size={24} />
                  </div>
                  <div className="method-info">
                    <h4>Email</h4>
                    <p>poppyandteal@gmail.com</p>
                    <small>We reply within 24 hours</small>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <Instagram size={24} />
                  </div>
                  <div className="method-info">
                    <h4>Instagram</h4>
                    <p>@poppyandteal</p>
                    <small>Follow for daily updates</small>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <MessageCircle size={24} />
                  </div>
                  <div className="method-info">
                    <h4>WhatsApp</h4>
                    <p>Quick responses</p>
                    <button className="whatsapp-quick-btn" onClick={handleQuickWhatsApp}>
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* end contact-info-section */}
          </div>

          {/* FAQ Section (kept inside the same container, outside the grid) */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>How long does it take to create a custom piece?</h4>
                <p>Custom pieces typically take 1–2 weeks, depending on complexity and current orders.</p>
              </div>

              <div className="faq-item">
                <h4>Do you ship across India?</h4>
                <p>Yes, we ship nationwide with secure packaging to ensure your macramé pieces arrive safely.</p>
              </div>

              <div className="faq-item">
                <h4>What materials do you use?</h4>
                <p>We use high-quality, eco-friendly cotton and jute cords sourced sustainably.</p>
              </div>

              <div className="faq-item">
                <h4>Can I return or exchange items?</h4>
                <p>Due to the handmade nature, we accept returns only for damaged items. Please contact us within 48 hours of delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
