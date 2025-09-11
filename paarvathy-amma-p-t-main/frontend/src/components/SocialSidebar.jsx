import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const SocialSidebar = ({ onContactClick }) => {
  const [showTooltip, setShowTooltip] = useState(null);

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white shadow-lg rounded-r-lg overflow-hidden">
      <div className="flex flex-col">
        {/* Social Links */}
        {socialLinks.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            className="relative p-4 hover:bg-gray-50 transition-colors group"
            onMouseEnter={() => setShowTooltip(index)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <link.icon size={20} className="text-gray-700 group-hover:text-gray-900" />
            
            {/* Tooltip */}
            {showTooltip === index && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap font-poppins">
                {link.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </a>
        ))}

        {/* Contact Message */}
        <button
          onClick={onContactClick}
          className="relative p-4 hover:bg-gray-50 transition-colors group"
          onMouseEnter={() => setShowTooltip('contact')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Mail size={20} className="text-gray-700 group-hover:text-gray-900" />
          
          {/* Tooltip */}
          {showTooltip === 'contact' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap font-poppins">
              Contact Us
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialSidebar;