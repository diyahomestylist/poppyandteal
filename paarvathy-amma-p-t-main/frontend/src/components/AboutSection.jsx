import React from 'react';
import { Heart, Leaf, Award } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: 'Handcrafted with Love',
      description: 'Every piece is lovingly made by hand with attention to detail and quality craftsmanship.'
    },
    {
      icon: Leaf,
      title: 'Natural Materials',
      description: 'We use only premium, sustainable materials including organic cotton and jute cords.'
    },
    {
      icon: Award,
      title: 'Unique Designs',
      description: 'Each macramé piece is an original design, bringing bohemian elegance to your space.'
    }
  ];

  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 font-poppins">
              About Poppy & Teal
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-poppins">
              Welcome to Poppy & Teal, where traditional macramé artistry meets modern design. 
              Our passion for creating beautiful, handcrafted pieces stems from a love of natural 
              textures and bohemian aesthetics.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 font-poppins">
              Each piece in our collection is carefully designed and crafted using time-honored 
              techniques, premium materials, and a commitment to quality that you can see and feel. 
              From wall hangings to plant hangers, every item tells a story of craftsmanship and care.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                    <feature.icon size={24} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-poppins text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="/images/IMG_3122.JPG" 
                alt="Macramé wall hanging" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <img 
                src="/images/IMG_3131.JPG" 
                alt="Plant hanger" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img 
                src="/images/IMG_3139.JPG" 
                alt="Feather design" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <img 
                src="/images/IMG_3151.JPG" 
                alt="Geometric pattern" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;