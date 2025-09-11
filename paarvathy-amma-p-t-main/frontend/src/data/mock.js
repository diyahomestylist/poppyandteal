// Mock data for macramé products
export const products = [
  {
    id: 1,
    name: "Bohemian Wall Hanging",
    price: 89.99,
    category: "Wall Art",
    image: "/images/IMG_3122.JPG",
    description: "Beautiful handcrafted macramé wall hanging featuring intricate patterns and natural cotton cord.",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Spiral Plant Hanger",
    price: 45.50,
    category: "Plant Hangers",
    image: "/images/IMG_3131.JPG",
    description: "Elegant spiral design plant hanger perfect for your favorite hanging plants.",
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Macramé Table Runner",
    price: 65.00,
    category: "Home Decor",
    image: "/images/IMG_3136.JPG",
    description: "Sophisticated table runner that adds a touch of boho elegance to any dining space.",
    inStock: true,
    featured: false
  },
  {
    id: 4,
    name: "Feather Wall Art",
    price: 72.99,
    category: "Wall Art",
    image: "/images/IMG_3139.JPG",
    description: "Stunning feather-inspired macramé piece that creates beautiful shadows and textures.",
    inStock: true,
    featured: true
  },
  {
    id: 5,
    name: "Hanging Planters Set",
    price: 120.00,
    category: "Plant Hangers",
    image: "/images/IMG_3144.JPG",
    description: "Set of three matching plant hangers in different sizes for a cohesive look.",
    inStock: false,
    featured: false
  },
  {
    id: 6,
    name: "Dream Catcher Macramé",
    price: 55.99,
    category: "Wall Art",
    image: "/images/IMG_3145.JPG",
    description: "Traditional dream catcher design with modern macramé twist.",
    inStock: true,
    featured: true
  },
  {
    id: 7,
    name: "Boho Curtain Tie-backs",
    price: 38.50,
    category: "Home Decor",
    image: "/images/IMG_3147.JPG",
    description: "Pair of decorative curtain tie-backs that add bohemian charm to any window.",
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "Geometric Wall Piece",
    price: 95.00,
    category: "Wall Art",
    image: "/images/IMG_3151.JPG",
    description: "Modern geometric design combining traditional macramé with contemporary aesthetics.",
    inStock: true,
    featured: true
  },
  {
    id: 9,
    name: "Mini Plant Hangers",
    price: 35.99,
    category: "Plant Hangers",
    image: "/images/IMG_3154.JPG",
    description: "Perfect for small plants and succulents, sold as a set of two.",
    inStock: true,
    featured: false
  },
  {
    id: 10,
    name: "Macramé Mirror Frame",
    price: 110.00,
    category: "Home Decor",
    image: "/images/IMG_3159.JPG",
    description: "Beautiful mirror surrounded by intricate macramé work, perfect statement piece.",
    inStock: true,
    featured: true
  },
  {
    id: 11,
    name: "Wedding Backdrop",
    price: 280.00,
    category: "Special Occasions",
    image: "/images/IMG_3162.JPG",
    description: "Large ceremonial backdrop perfect for weddings and special events.",
    inStock: true,
    featured: false
  },
  {
    id: 12,
    name: "Macramé Lampshade",
    price: 78.99,
    category: "Lighting",
    image: "/images/IMG_3164.JPG",
    description: "Elegant lampshade that creates beautiful light patterns through macramé openings.",
    inStock: true,
    featured: true
  }
];

export const categories = [
  "All",
  "Wall Art",
  "Plant Hangers", 
  "Home Decor",
  "Special Occasions",
  "Lighting"
];

export const heroSlides = [
  {
    id: 1,
    image: "/images/IMG_3122.JPG",
    title: "Handcrafted with Love",
    subtitle: "01."
  },
  {
    id: 2,
    image: "/images/IMG_3131.JPG",
    title: "Bohemian Elegance",
    subtitle: "02."
  },
  {
    id: 3,
    image: "/images/IMG_3139.JPG",
    title: "Natural Beauty",
    subtitle: "03."
  },
  {
    id: 4,
    image: "/images/IMG_3144.JPG",
    title: "Modern Macramé",
    subtitle: "04."
  },
  {
    id: 5,
    image: "/images/IMG_3151.JPG",
    title: "Artisan Quality",
    subtitle: "05."
  }
];

// Shopping cart functionality
export const cartActions = {
  addToCart: (product) => {
    const cart = JSON.parse(localStorage.getItem('macrame_cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('macrame_cart', JSON.stringify(cart));
    return cart;
  },
  
  removeFromCart: (productId) => {
    const cart = JSON.parse(localStorage.getItem('macrame_cart') || '[]');
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('macrame_cart', JSON.stringify(updatedCart));
    return updatedCart;
  },
  
  updateQuantity: (productId, quantity) => {
    const cart = JSON.parse(localStorage.getItem('macrame_cart') || '[]');
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
    localStorage.setItem('macrame_cart', JSON.stringify(cart));
    return cart;
  },
  
  getCart: () => {
    return JSON.parse(localStorage.getItem('macrame_cart') || '[]');
  },
  
  getCartTotal: () => {
    const cart = JSON.parse(localStorage.getItem('macrame_cart') || '[]');
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartItemCount: () => {
    const cart = JSON.parse(localStorage.getItem('macrame_cart') || '[]');
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};