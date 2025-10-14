import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-cyan-300">Your Cart</h1>
        <p className="text-red-500">Your cart is empty.</p>
        <Link to="/" className="text-yellow-500 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-cyan-400">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded">
            <div className="flex items-center mb-2 md:mb-0">
              <img src={item.thumbnail} alt={item.title} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded mr-4" />
              <div>
                <h3 className="font-semibold text-sm md:text-base text-cyan-200">{item.title}</h3>
                <p className="text-yellow-400 text-xs md:text-sm">₹{item.price}</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-start md:space-x-2">
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-2 py-1 bg-cyan-500 hover:bg-cyan-800 rounded text-sm"
                >
                  -
                </button>
                <span className="mx-2 text-sm text-cyan-200">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-2 py-1 bg-cyan-500 hover:bg-cyan-800 rounded text-sm"
                >
                  +
                </button>
              </div>
              <div className="text-right md:ml-4">
                <p className="font-semibold text-sm md:text-base text-yellow-400">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:underline text-xs md:text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-400">Total: ₹{getTotalPrice()}</h2>
          <Link
            to="/checkout"
            className="bg-cyan-800 text-cyan-300 px-6 py-2 rounded hover:bg-cyan-900"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
