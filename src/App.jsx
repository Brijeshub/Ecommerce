import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import Header from './components/header/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query and category
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        (product.name || product.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleAdminLogin = (token) => {
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
  };

  return (
    <CartProvider>
      <Router>
        <Header
          adminToken={adminToken}
          onLogout={handleAdminLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        <Routes>
          <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleAdminLogin} />} />
          <Route path="/admin-dashboard" element={adminToken ? <AdminDashboard token={adminToken} onLogout={handleAdminLogout} /> : <Navigate to="/admin-login" />} />
          <Route path="/admin-orders" element={adminToken ? <AdminOrders token={adminToken} /> : <Navigate to="/admin-login" />} />
          <Route path="/" element={<ProductList products={filteredProducts} isLoading={loading} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </Router>
    </CartProvider>
  );
}

export default App;
