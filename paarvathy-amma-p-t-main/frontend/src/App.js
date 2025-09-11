import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import ProductGrid from './components/ProductGrid';
import AboutSection from './components/AboutSection';
import SocialSidebar from './components/SocialSidebar';
import SearchModal from './components/SearchModal';
import ShoppingCart from './components/ShoppingCart';
import ContactModal from './components/ContactModal';
import { Toaster } from './components/ui/toaster';

// Import Poppins font from Google Fonts
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="App font-poppins">
      {/* Fixed Header */}
      <Header 
        onSearchToggle={() => setIsSearchOpen(true)}
        onCartToggle={() => setIsCartOpen(true)}
      />

      {/* Social Sidebar - matching studio-master style */}
      <SocialSidebar onContactClick={() => setIsContactOpen(true)} />

      {/* Main Content */}
      <main>
        {/* Hero Slider - exact style as studio-master */}
        <HeroSlider />

        {/* Products Section */}
        <ProductGrid />

        {/* About Section */}
        <AboutSection />
      </main>

      {/* Footer - Simple like studio-master */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-poppins text-sm">
            Copyright &copy; {new Date().getFullYear()} Poppy & Teal. All rights reserved. 
            Handcrafted with <span className="text-red-400">♥</span> for macramé lovers.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;