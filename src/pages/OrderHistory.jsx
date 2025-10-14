import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

const OrderTracking = ({ status, trackingNumber, estimatedDelivery }) => {
  const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2 text-cyan-400">Order Tracking</h4>
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= currentStepIndex
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-cyan-400">{step}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      {trackingNumber && (
        <p className="text-sm text-cyan-400">Tracking Number: {trackingNumber}</p>
      )}
      {estimatedDelivery && (
        <p className="text-sm text-cyan-400">
          Estimated Delivery: {new Date(estimatedDelivery).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const OrderHistory = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  const fetchOrders = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5001/api/user-orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Name: ${order.customerName}`, 20, 60);
    doc.text(`Email: ${order.customerEmail}`, 20, 70);
    doc.text(`Address: ${order.address}, ${order.city}, ${order.zipCode}`, 20, 80);
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, 90);
    doc.text(`Status: ${order.status}`, 20, 100);
    doc.text('Items:', 20, 120);
    let y = 130;
    order.items.forEach((item) => {
      doc.text(`${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`, 20, y);
      y += 10;
    });
    doc.text(`Total: ₹${order.total}`, 20, y + 10);
    doc.save(`invoice_${order._id}.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-cyan-400">Order History</h1>
      <div className="mb-4">
        <label className="block text-lg font-medium text-cyan-400">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-cyan-800 text-cyan-300 rounded-md shadow-sm p-2"
          placeholder="Enter your email"
        />
        <button
          onClick={fetchOrders}
          className="mt-2 bg-cyan-800 text-cyan-200 py-2 px-4 rounded-md hover:bg-cyan-900"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'View Orders'}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {fetched && orders.length === 0 && <p className="text-red-500">No orders found for this email.</p>}
      {orders.length > 0 && (
        <div className="space-y-4 text-cyan-400">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-cyan-400">Order ID: {order._id}</h3>
                  <p className="text-cyan-400">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm font-bold ${
                  order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                  order.status === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                  order.status === 'Processing' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-cyan-400">Name: {order.customerName}</p>
              <p className="text-cyan-400">Email: {order.customerEmail}</p>
              <p className="text-cyan-400">Address: {order.address}, {order.city}, {order.zipCode}</p>
              <p className="text-cyan-400">Total: ₹{order.total}</p>
              <h4 className="font-semibold mt-2 text-cyan-400">Items:</h4>
              <ul className="list-disc list-inside mb-4 text-cyan-400">
                {order.items.map((item, index) => (
                  <li key={index}>{item.name} x {item.quantity} - ₹{item.price * item.quantity}</li>
                ))}
              </ul>
              <button
                onClick={() => downloadInvoice(order)}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mb-4"
              >
                Download Invoice
              </button>
              <OrderTracking
                status={order.status}
                trackingNumber={order.trackingNumber}
                estimatedDelivery={order.estimatedDelivery}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
