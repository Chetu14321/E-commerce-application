import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Checkout handler
  const handleCheckout = () => {
    navigate('/payment');
  };

  // ✅ Fetch cart when component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart/get');
      console.log("Cart API Response:", response.data);
      if (response.data?.items?.length >= 0) {
        setCartItems(response.data.items);
        calculateTotal(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 1),
      0
    );
    setGrossTotal(total);
  };

  const increaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const decreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete('/api/cart/remove', { data: { itemId } });
      const filtered = cartItems.filter((item) => item._id !== itemId);
      setCartItems(filtered);
      calculateTotal(filtered);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear');
      setCartItems([]);
      setGrossTotal(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold text-success">🛒 Your Shopping Cart</h1>

      {loading ? (
        <div className="text-center fs-5">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="alert alert-info text-center fs-5">
          Your cart is currently empty.
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {cartItems.map((item) => {
              const product = item.productId || {};
              return (
                <div className="col" key={item._id}>
                  <div className="card h-100 shadow-sm border-0 rounded-4">
                    <img
                      src={product.image}
                      className="card-img-top rounded-top-4"
                      style={{ height: "180px", objectFit: "cover" }}
                      alt={product.name}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-semibold text-truncate">{product.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        Category: {product.category || "vegetable"} <br />
                        Stock: {product.stock ?? "0"}
                      </p>
                      <small className="text-muted mb-2">
                        Added: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                      </small>
                      <p className="fw-bold text-success mb-3">
                        ₹{product.price} × {item.quantity} = ₹{(product.price * item.quantity).toFixed(2)}
                      </p>

                      <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <button
                          className="btn btn-sm btn-outline-secondary px-2"
                          onClick={() => decreaseQuantity(item._id)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary px-2"
                          onClick={() => increaseQuantity(item._id)}
                        >
                          ＋
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm mt-auto"
                        onClick={() => removeFromCart(item._id)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-4 bg-light rounded shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <h4 className="fw-bold mb-0">Total: ₹{grossTotal.toFixed(2)}</h4>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-outline-warning w-100 w-sm-auto" onClick={clearCart}>
                  🧹 Clear Cart
                </button>
                <button
                  className="btn btn-success w-100 w-sm-auto"
                  onClick={handleCheckout}
                >
                  ✅ Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
