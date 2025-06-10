import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/api/users/verify", { withCredentials: true });
        setUser(userRes.data.user);

        const productRes = await axios.get("/api/products/all");
        const products = productRes.data.products || productRes.data || [];
        setTotalProducts(products.length);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <p className="text-center mt-5">Loading dashboard...</p>;
  }

  return (
    <div className="container py-4">
      {/* User Profile Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow rounded-4 h-100">
            <h4 className="text-primary">My Profile</h4>
            <hr />
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        </div>

        {/* Total Product Count */}
        <div className="col-md-8">
          <div className="card p-4 shadow rounded-4 text-center bg-light h-100">
            <h6>Total Products</h6>
            <h2 className="text-success fw-bold">{totalProducts}</h2>
            <p>Manage and explore agriculture products from your dashboard</p>
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="row">
        <div className="col-md-12">
          <div className="card p-4 shadow rounded-4">
            <h5 className="mb-3">Dashboard Overview</h5>
            <p>
              Welcome to your agriculture e-commerce control panel! From here you can track your product stats,
              manage your account, and keep an eye on business activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
