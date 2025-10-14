import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card',
    discountCode: '',
  });
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyDiscount = () => {
    if (formData.discountCode === 'SAVE10') {
      const discount = getTotalPrice() * 0.1;
      setDiscountAmount(discount);
      setAppliedDiscount('10% off applied');
    } else if (formData.discountCode === 'SAVE20') {
      const discount = getTotalPrice() * 0.2;
      setDiscountAmount(discount);
      setAppliedDiscount('20% off applied');
    } else {
      setDiscountAmount(0);
      setAppliedDiscount('Invalid discount code');
    }
  };

  const finalTotal = getTotalPrice() - discountAmount;

  const generateClientInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Client Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${formData.name}`, 20, 40);
    doc.text(`Email: ${formData.email}`, 20, 50);
    doc.text(`Address: ${formData.address}, ${formData.city}, ${formData.zipCode}`, 20, 60);
    doc.text(`Payment Method: ${formData.paymentMethod}`, 20, 70);
    doc.text(`Discount Applied: ${appliedDiscount}`, 20, 80);
    doc.text('Order Summary:', 20, 100);
    let y = 110;
    cart.forEach((item) => {
      doc.text(`${item.title} x ${item.quantity} - ₹${item.price * item.quantity}`, 20, y);
      y += 10;
    });
    doc.text(`Discount: -₹${discountAmount}`, 20, y + 10);
    doc.text(`Total: ₹${finalTotal}`, 20, y + 20);
    doc.save('client_invoice.pdf');
  };

  const generateAdminInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Admin Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${formData.name}`, 20, 40);
    doc.text(`Customer Email: ${formData.email}`, 20, 50);
    doc.text(`Shipping Address: ${formData.address}, ${formData.city}, ${formData.zipCode}`, 20, 60);
    doc.text(`Payment Method: ${formData.paymentMethod}`, 20, 70);
    doc.text(`Discount Code: ${formData.discountCode}`, 20, 80);
    doc.text(`Discount Amount: ₹${discountAmount}`, 20, 90);
    doc.text('Order Details:', 20, 110);
    let y = 120;
    cart.forEach((item) => {
      doc.text(`${item.title} x ${item.quantity} - ₹${item.price * item.quantity}`, 20, y);
      y += 10;
    });
    doc.text(`Total Amount: ₹${finalTotal}`, 20, y + 10);
    doc.save('admin_invoice.pdf');
  };

  const handlePayment = async () => {
    if (formData.paymentMethod === 'razorpay') {
      alert('Razorpay payment would be processed here. Integrate real Razorpay for live payments.');
      handleSubmit();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // Send order to backend
    const orderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      paymentMethod: formData.paymentMethod,
      discountCode: formData.discountCode,
      discountAmount: discountAmount,
      items: cart.map(item => ({
        name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total: finalTotal,
    };

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        throw new Error('Failed to place order');
      }
      alert('Order placed successfully! You can now download your invoice.');
      clearCart();
      navigate('/order-history', { state: { email: formData.email } });
    } catch (error) {
      alert('Failed to place order: ' + error.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-cyan-400">Checkout</h1>
        <p className="text-cyan-400">Your cart is empty. Add some items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-cyan-400">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Order Summary</h2>
          <div className="space-y-2 text-cyan-400">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>{item.title} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-4 text-cyan-400">
            <div className="flex justify-between font-bold">
              <span>Subtotal:</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedDiscount}):</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={generateClientInvoice}
              className="w-full bg-cyan-800 text-cyan-200 py-2 px-4 rounded-md hover:bg-cyan-900 mb-2"
            >
              Download Client Invoice
            </button>
            {/* <button
              onClick={generateAdminInvoice}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Download Admin Invoice
            </button> */}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Shipping & Payment Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-400">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-400">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="mt-1 block w-full border text-cyan-400 bg-cyan-950 border-cyan-500 rounded-md shadow-sm p-2 text-sm md:text-base"
              >
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="qr">QR Code</option>
                <option value="razorpay">Razorpay</option>
                <option value="other">Other</option>
              </select>
            </div>
            {formData.paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-cyan-400">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cyan-400">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate || ''}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      required
                      className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-400">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv || ''}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                    />
                  </div>
                </div>
              </>
            )}
            {formData.paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-cyan-400">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId || ''}
                  onChange={handleChange}
                  placeholder="Enter UPI ID"
                  required
                  className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                />
              </div>
            )}
            {formData.paymentMethod === 'qr' && (
              <div>
                <label className="block text-sm font-medium text-cyan-400">Scan QR Code</label>
                <div className="mt-2 p-4 border text-cyan-400 rounded-md">
                  <img src="https://via.placeholder.com/200x200?text=QR+Code" alt="QR Code" className="mx-auto" />
                  <p className="text-center mt-2 text-sm text-cyan-400">Scan this QR code to pay</p>
                </div>
              </div>
            )}
            {formData.paymentMethod === 'razorpay' && (
              <div>
                <label className="block text-sm font-medium text-cyan-400">Razorpay Payment</label>
                <p className="mt-1 text-sm text-cyan-400">Click the button below to proceed with Razorpay payment.</p>
              </div>
            )}
            {formData.paymentMethod === 'other' && (
              <div>
                <label className="block text-sm font-medium text-cyan-400">Other Payment Details</label>
                <textarea
                  name="paymentDetails"
                  value={formData.paymentDetails || ''}
                  onChange={handleChange}
                  placeholder="Enter payment details"
                  required
                  className="mt-1 block w-full border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                  rows="3"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-cyan-400">Discount Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="discountCode"
                  value={formData.discountCode}
                  onChange={handleChange}
                  placeholder="Enter discount code"
                  className="mt-1 block flex-1 border text-cyan-400 rounded-md shadow-sm p-2 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={applyDiscount}
                  className="mt-1 bg-cyan-500 text-cyan-200 px-4 py-2 rounded-md hover:bg-cyan-600"
                >
                  Apply
                </button>
              </div>
              {appliedDiscount && (
                <p className={`mt-1 text-sm ${discountAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {appliedDiscount}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handlePayment}
              className="w-full bg-cyan-500 text-cyan-200 py-2 px-4 rounded-md hover:bg-cyan-600 text-sm md:text-base"
            >
              {formData.paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
