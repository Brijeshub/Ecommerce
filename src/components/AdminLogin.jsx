import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded admin login for demo
    if (username === 'admin' && password === 'admin123') {
      onLoginSuccess('admin-secret-token');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-md mx-auto my-44 p-4 bg-cyan-800 rounded shadow">
      <h2 className="text-center text-xl font-sans mb-4">Admin Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-cyan-900 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-cyan-900 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-cyan-900 text-cyan-200 py-2 rounded hover:bg-cyan-800"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
