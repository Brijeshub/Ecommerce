import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    trackingNumber: '',
    estimatedDelivery: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        headers: {
          Authorization: 'Bearer admin-secret-token',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Admin Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${order.customerName}`, 20, 40);
    doc.text(`Customer Email: ${order.customerEmail}`, 20, 50);
    doc.text(`Shipping Address: ${order.address}, ${order.city}, ${order.zipCode}`, 20, 60);
    doc.text(`Card Number: **** **** **** ${order.cardNumber.slice(-4)}`, 20, 70);
    doc.text('Order Details:', 20, 90);
    let y = 100;
    order.items.forEach((item) => {
      doc.text(`${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`, 20, y);
      y += 10;
    });
    doc.text(`Total Amount: ₹${order.total}`, 20, y + 10);
    doc.save(`admin_invoice_${order._id}.pdf`);
  };

  const handleEdit = (order) => {
    setEditingId(order._id);
    setEditForm({
      status: order.status || 'Ordered',
      trackingNumber: order.trackingNumber || '',
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : '',
    });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin-secret-token',
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        throw new Error('Failed to update order');
      }
      const updatedOrder = await res.json();
      setOrders(orders.map(order => order._id === id ? updatedOrder : order));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ status: '', trackingNumber: '', estimatedDelivery: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-cyan-200">Admin Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <p className="mb-4 text-cyan-300">Total Orders: {orders.length}</p>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded shadow text-cyan-300">
                {editingId === order._id ? (
                  <div>
                    <h3 className="font-semibold">Edit Order Status</h3>
                    <div className="mt-2">
                      <label className="block text-sm font-medium">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="mt-1 block w-full border border-cyan-300 rounded-md p-2"
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium">Tracking Number</label>
                      <input
                        type="text"
                        value={editForm.trackingNumber}
                        onChange={(e) => setEditForm({ ...editForm, trackingNumber: e.target.value })}
                        className="mt-1 block w-full border border-cyan-300 rounded-md p-2"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium">Estimated Delivery</label>
                      <input
                        type="date"
                        value={editForm.estimatedDelivery}
                        onChange={(e) => setEditForm({ ...editForm, estimatedDelivery: e.target.value })}
                        className="mt-1 block w-full border border-cyan-300 rounded-md p-2"
                      />
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleSave(order._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p><strong>Customer:</strong> {order.customerName} ({order.customerEmail})</p>
                    <p><strong>Address:</strong> {order.address}, {order.city}, {order.zipCode}</p>
                    <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {order.status || 'Ordered'}</p>
                    {order.trackingNumber && <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>}
                    {order.estimatedDelivery && <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
                    <p><strong>Total:</strong> ₹{order.total}</p>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => generateInvoice(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
