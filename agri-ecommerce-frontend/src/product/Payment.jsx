import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cartItems, setCartItems] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart/get');
      const items = res.data.items || [];
      setCartItems(items);
      calculateTotal(items);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      const qty = item.quantity || 1;
      return sum + price * qty;
    }, 0);
    setGrossTotal(total);
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear');
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handlePayment = async () => {
    if (!address.trim()) return alert('Please enter your address');
    if (paymentMethod === 'cod') {
      alert('Cash on Delivery not supported yet');
      return;
    }

    try {
      setLoading(true);

      // 1. Create Razorpay order
      const { data: order } = await axios.post('/api/payment/create-order', {
        amount: grossTotal * 100,
        currency: 'INR',
      });

      const options = {
        key: 'rzp_test_yOkqhLaaJlzEik', // ✅ FIXED HERE
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            // 2. Verify payment
            const verifyRes = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              const userRes = await axios.get('/api/users/verify', { withCredentials: true });
              const userId = userRes.data.user._id;

              // 3. Create order
              await axios.post('/api/orders/create', {
                userId,
                items: cartItems.map(item => ({
                  product: item.productId?._id,
                  quantity: item.quantity,
                })),
                totalPrice: grossTotal,
                shippingAddress: address,
              });

              await clearCart();
              navigate('/payment-success');
            } else {
              alert('❌ Payment verification failed.');
            }
          } catch (err) {
            console.error('Order creation failed:', err);
            alert('❌ Error processing order.');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        notes: { address },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('❌ Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-success mb-4">🛒 Checkout</h2>

      <div className="card mb-3">
        <div className="card-header">Your Items</div>
        <div className="card-body">
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ul className="list-group">
              {cartItems.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between">
                  <span>{item.productId?.name || 'Unnamed Product'} × {item.quantity}</span>
                  <strong>₹{item.productId?.price * item.quantity}</strong>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <h5 className="mt-3">Total: ₹{grossTotal}</h5>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">Shipping Address</div>
        <div className="card-body">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter your address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="card mb-3">
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

      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={handlePayment}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? 'Processing...' : `Pay ₹${grossTotal}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
