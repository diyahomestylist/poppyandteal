import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { cartActions } from '../data/mock';

const ShoppingCart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      updateCart();
    }
  }, [isOpen]);

  const updateCart = () => {
    const items = cartActions.getCart();
    const totalAmount = cartActions.getCartTotal();
    setCartItems(items);
    setTotal(totalAmount);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      cartActions.removeFromCart(productId);
    } else {
      cartActions.updateQuantity(productId, newQuantity);
    }
    updateCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (productId) => {
    cartActions.removeFromCart(productId);
    updateCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = () => {
    // Mock checkout process
    alert('Thank you for your order! This is a demo checkout.');
    localStorage.removeItem('macrame_cart');
    updateCart();
    window.dispatchEvent(new Event('cartUpdated'));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900 font-poppins">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-poppins">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-poppins text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 font-poppins text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-poppins">{item.category}</p>
                      <p className="text-sm font-light text-gray-900 font-poppins">
                        ${item.price}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="text-sm font-medium font-poppins min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors self-start"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900 font-poppins">Total</span>
                  <span className="text-xl font-light text-gray-900 font-poppins">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-poppins font-medium"
                >
                  Checkout
                </button>
                <button
                  onClick={onClose}
                  className="w-full mt-2 text-gray-600 py-2 text-sm font-poppins hover:text-gray-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;