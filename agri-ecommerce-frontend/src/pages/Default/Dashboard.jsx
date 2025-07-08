import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/api/users/verify", { withCredentials: true });
        const userData = userRes.data.user;
        setUser(userData);
        setFormData({ name: userData.name, email: userData.email, mobile: userData.mobile });

        const orderRes = await axios.get(`/api/orders/user/${userData._id}`, { withCredentials: true });
        setOrders(orderRes.data || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/users/update/${user._id}`, formData, { withCredentials: true });
      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!user) {
    return <p className="text-center mt-5">Loading dashboard...</p>;
  }

  return (
    <div className="container py-4">
      {/* Professional User Profile Section */}
      <div className="card mb-4 shadow rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center gap-4">
            <img
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="rounded-circle border"
              width={100}
              height={100}
            />
            <div>
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control mb-2"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control mb-2"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="form-control mb-2"
                    placeholder="Mobile"
                  />
                  <button className="btn btn-sm btn-success" onClick={handleUpdate}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h4 className="mb-1 text-primary">{user.name}</h4>
                  <p className="mb-1 text-muted">{user.email}</p>
                  <p className="mb-1 text-muted">+91 {user.mobile}</p>
                  <span className="badge bg-secondary text-capitalize">{user.role}</span>
                </>
              )}
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline-primary dropdown-toggle"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* My Orders Button */}
      <div className="text-end mb-3">
        <button className="btn btn-outline-primary" onClick={() => setShowOrders(!showOrders)}>
          {showOrders ? "Hide Orders" : "Show My Orders"}
        </button>
      </div>

      {/* Orders Section */}
      {showOrders && (
        <div className="card p-4 shadow rounded-4 mb-4">
          <h5 className="mb-3">My Orders</h5>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr onClick={() => toggleOrderDetails(order._id)} style={{ cursor: 'pointer' }}>
                      <td>{order._id}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>{order.status}</td>
                      <td>{order.items.length} item(s)</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>

                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan={5}>
                          <div className="bg-light p-3 rounded">
                            <h6 className="mb-2">Order Items:</h6>
                            {order.items.map((item, index) => (
                              <div key={index} className="mb-1">
                                {typeof item.product === "object" && item.product !== null
                                  ? item.product.name
                                  : item.product} × {item.quantity}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Dashboard Overview */}
      <div className="card p-4 shadow rounded-4">
        <h5 className="mb-3">Dashboard Overview</h5>
        <p>
          Welcome to your agriculture e-commerce control panel! From here you can track your orders,
          manage your account, and keep an eye on your activity.
        </p>
      </div>
    </div>
  );
}