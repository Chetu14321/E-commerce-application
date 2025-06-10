import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("/api/users/all"),
          axios.get("/api/products/all"),
          axios.get("/api/orders"),
        ]);

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          
          
        });
        // console.log()
      } catch (err) {
        console.error(err.response.msg);
      }
    };

    fetchStats();
  }, [stats.users]);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-12 bg-dark text-white vh-100 p-3">
          <h4 className="text-center mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link text-yellow" to="#">
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/users">
                Users
                
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/orders">
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Dashboard Content */}
        <div className="col-md-9 col-12 p-4">
          <h2 className="mb-4">Dashboard Overview</h2>
          <div className="row g-4">
            {/* Total Users Card */}
            <div className="col-md-4 col-12">
              <div className="card text-bg-primary shadow rounded-3">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Users</h5>
                  <p className="display-6">{stats.users}</p>
                </div>
              </div>
            </div>

            {/* Total Products Card */}
            <div className="col-md-4 col-12">
              <div className="card text-bg-success shadow rounded-3">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Products</h5>
                  <p className="display-6">{stats.products}</p>
                </div>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="col-md-4 col-12">
              <div className="card text-bg-warning shadow rounded-3">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="display-6">{stats.orders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="mt-4">
            <h3>Quick Actions</h3>
            <div className="row g-4">
              <div className="col-md-4 col-12">
                <div className="card text-bg-light shadow rounded-3">
                  <div className="card-body text-center">
                    <h5 className="card-title">Add Product</h5>
                    <Link to="/products" className="btn btn-primary">
                      Add Product
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="card text-bg-light shadow rounded-3">
                  <div className="card-body text-center">
                    <h5 className="card-title">View Orders</h5>
                    <Link to="/orders" className="btn btn-warning">
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="card text-bg-light shadow rounded-3">
                  <div className="card-body text-center">
                    <h5 className="card-title">Manage Users</h5>
                    <Link to="/users" className="btn btn-info">
                      Manage Users
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
