import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart/get');
      console.log("Cart API Response:", response.data); // Debug
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
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    setGrossTotal(total);
  };

  const increaseQuantity = (productId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const decreaseQuantity = (productId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete('/api/cart/remove', { data: { productId } });
      const filtered = cartItems.filter((item) => item._id !== productId);
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

      {/* Optional: Debug JSON */}
      {/* <pre>{JSON.stringify(cartItems, null, 2)}</pre> */}

      {loading ? (
        <div className="text-center fs-5">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="alert alert-info text-center fs-5">
          Your cart is currently empty.
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {cartItems.map((items) => (
              <div className="col" key={items._id}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <img
                    src={items.image || "https://via.placeholder.com/200"}
                    alt={items.name}
                    className="card-img-top rounded-top-4"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-semibold text-truncate">{items.name}</h5>
                    <p className="card-text text-muted small mb-2">
                      Category: {items.category || "N/A"} <br />
                      Stock: {items.stock ?? "0"}
                    </p>
                    <small className="text-muted mb-2">
                      Added: {items.createdAt ? new Date(items.createdAt).toLocaleDateString() : "N/A"}
                    </small>
                    <p className="fw-bold text-success mb-3">
                      ₹{items.price} × {items.quantity} = ₹{(items.price * items.quantity).toFixed(2)}
                    </p>

                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                      <button
                        className="btn btn-sm btn-outline-secondary px-2"
                        onClick={() => decreaseQuantity(items._id)}
                        disabled={items.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="fw-bold">{items.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary px-2"
                        onClick={() => increaseQuantity(items._id)}
                      >
                        ＋
                      </button>
                    </div>

                    <button
                      className="btn btn-outline-danger btn-sm mt-auto"
                      onClick={() => removeFromCart(items._id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-5 p-4 bg-light rounded shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <h4 className="fw-bold mb-0">Total: ₹{grossTotal.toFixed(2)}</h4>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-outline-warning w-100 w-sm-auto" onClick={clearCart}>
                  🧹 Clear Cart
                </button>
                <button
                  className="btn btn-success w-100 w-sm-auto"
                  onClick={() => alert("Checkout coming soon!")}
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
