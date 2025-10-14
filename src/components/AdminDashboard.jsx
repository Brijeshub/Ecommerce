import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = ({ token, onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    thumbnail: '',
    brand: '',
    category: '',
    stock: '',
    discountPercentage: '',
    rating: '',
    images: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [footerForm, setFooterForm] = useState({ bio: '', profile: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/footer');
      if (res.ok) {
        const data = await res.json();
        setFooterForm(data);
      }
    } catch (err) {
      console.error('Failed to fetch footer:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5001/api/products/${editingId}`
        : 'http://localhost:5001/api/products';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          discountPercentage: parseFloat(form.discountPercentage) || 0,
          rating: parseFloat(form.rating) || 0,
          stock: parseInt(form.stock) || 0,
          brand: form.brand,
          category: form.category,
          thumbnail: form.thumbnail,
          images: form.images ? form.images.split(',').map(img => img.trim()) : [],
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to save product');
      }
      setForm({ title: '', price: '', description: '', thumbnail: '', brand: '', category: '', stock: '', discountPercentage: '', rating: '', images: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      price: product.price,
      description: product.description,
      thumbnail: product.thumbnail,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      images: product.images ? product.images.join(', ') : '',
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete product');
      }
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFooterChange = (e) => {
    setFooterForm({ ...footerForm, [e.target.name]: e.target.value });
  };

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(footerForm),
      });
      if (!res.ok) {
        throw new Error('Failed to update footer');
      }
      alert('Footer updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-36">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-800 text-cyan-300 px-4 py-2  rounded hover:bg-cyan-900"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/admin-orders')}
            className="bg-cyan-800 text-cyan-300 px-4 py-2 rounded hover:bg-cyan-900"
          >
            View Orders
          </button>
        </div>
        <h1 className="text-2xl font-bold absolute -mt-60 text-cyan-300">Admin Dashboard - Product Management</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
          step="0.01"
          min="0"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
          min="0"
        />
        <input
          type="number"
          name="discountPercentage"
          placeholder="Discount Percentage (optional)"
          value={form.discountPercentage}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          step="0.01"
          min="0"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-5, optional)"
          value={form.rating}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          step="0.1"
          min="0"
          max="5"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
        />
        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
          required
        />
        <textarea
          name="images"
          placeholder="Images URLs (comma-separated)"
          value={form.images}
          onChange={handleChange}
          className="w-full p-2 border rounded text-white border-cyan-800"
        />
        <button
          type="submit"
          className="bg-cyan-800 text-cyan-300 px-4 py-2 rounded hover:bg-cyan-700"
        >
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover mb-2" />
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-gray-300">{product.description}</p>
              <p className="font-bold mt-2 text-red-700">₹{product.price}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Footer Content Management</h2>
        <form onSubmit={handleFooterSubmit} className="space-y-4 max-w-md">
          <textarea
            name="bio"
            placeholder="Admin Biography"
            value={footerForm.bio}
            onChange={handleFooterChange}
            className="w-full p-2 border rounded text-white border-cyan-800"
            rows="3"
          />
          <textarea
            name="profile"
            placeholder="Profile Content"
            value={footerForm.profile}
            onChange={handleFooterChange}
            className="w-full p-2 border rounded text-white border-cyan-800"
            rows="3"
          />
          <button
            type="submit"
            className="bg-cyan-800 text-cyan-300 px-4 py-2 rounded hover:bg-cyan-700"
          >
            Update Footer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
