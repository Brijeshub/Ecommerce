import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const Header = ({ adminToken, onLogout, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) => {
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-cyan-800 text-cyan-200 shadow-md">
      <div className="container mx-auto px-4 py-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Navigation Bar */}
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold text-yellow-200">
            Lee Cart
          </Link>
          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-cyan-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/cart" className="hover:underline relative">
            Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-1">
                {getTotalItems()}
              </span>
            )}
          </Link>
          <Link to="/order-history" className="hover:underline">
            Order History
          </Link>
          {adminToken ? (
            <>
              <Link to="/admin-dashboard" className="hover:underline">
                Admin Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin-login" className="hover:underline">
              Admin Login
            </Link>
          )}
        </nav>
        {/* Mobile Navigation Sidebar */}
        <motion.div
          className="md:hidden fixed top-0 left-0 h-full w-64 bg-cyan-800 text-cyan-200 z-50"
          initial={{ x: '-100%' }}
          animate={{ x: isMenuOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 px-6 py-8">
            <button
              onClick={toggleMenu}
              className="self-end text-cyan-200 focus:outline-none"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link to="/" className="hover:underline text-lg" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/cart" className="hover:underline text-lg relative" onClick={toggleMenu}>
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-1">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <Link to="/order-history" className="hover:underline text-lg" onClick={toggleMenu}>
              Order History
            </Link>
            {adminToken ? (
              <>
                <Link to="/admin-dashboard" className="hover:underline text-lg" onClick={toggleMenu}>
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => { onLogout(); toggleMenu(); }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-left text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin-login" className="hover:underline text-lg" onClick={toggleMenu}>
                Admin Login
              </Link>
            )}
          </div>
        </motion.div>
        {/* Backdrop */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
          ></div>
        )}
        </div>
      </div>
    </header>
  );
};

export default Header;
