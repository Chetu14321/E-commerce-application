import React, { useState } from 'react';

const Payment = () => {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = () => {
    if (!address) {
      alert('Please enter your address');
      return;
    }
    alert('Payment Successful!');
  };

  return (
    <div className="container py-5">
      <h1 className="text-success text-center mb-4">🛒 Checkout Page</h1>
      
      {/* Billing Summary */}
      <div className="card mb-4">
        <div className="card-header">Billing Summary</div>
        <div className="card-body">
          <p>Product: Premium Subscription</p>
          <p>Price: ₹999</p>
          <p>Tax: ₹99</p>
          <hr />
          <p><strong>Total: ₹1098</strong></p>
        </div>
      </div>

      {/* Address Section */}
      <div className="card mb-4">
        <div className="card-header">Shipping Address</div>
        <div className="card-body">
          <textarea
            className="form-control"
            placeholder="Enter your address"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card mb-4">
        <div className="card-header">Payment Method</div>
        <div className="card-body">
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Pay Button */}
      <div className="text-center">
        <button className="btn btn-primary" onClick={handlePayment}>
          Proceed to Pay ₹1098
        </button>
      </div>
    </div>
  );
};

export default Payment;
