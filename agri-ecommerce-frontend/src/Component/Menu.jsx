import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useCart } from "../product/CartContext"; // import your custom hook

export default function Menu() {
  const { isLogin, setIsLogin, setToken, setUser, user } = useAuth();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount(); // Get cart count

  const LogoutHandler = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await axios.post(`/api/users/logout`)
        .then(res => {
          toast.success(res.data.msg);
          setIsLogin(false);
          setToken(false);
          setUser(false);
          navigate(`/`);
        })
        .catch(err => {
          toast.error(err.response.data.msg);
        });
    } else {
      toast.warning("Logout failed");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
        <div className="container">
          <NavLink className="navbar-brand" to={'/'}>
            E-Commerce Application
          </NavLink>

          {/* Profile + Cart Icons */}
          <div className="d-flex align-items-center ms-auto gap-3">
            {/* Profile Icon */}
            <NavLink
              to={isLogin ? `/dashboard/${user?.role}` : "/login"}
              className="text-white"
              title={isLogin ? "Dashboard" : "Login"}
            >
              <FaUserCircle size={24} />
            </NavLink>

            {/* Cart Icon */}
            <NavLink to="/cart" className="position-relative">
              <FaShoppingCart size={24} className="text-white" />
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.7rem', transition: 'all 0.3s ease' }}
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Menu Toggle Button for Mobile View */}
            <button
              className="btn btn-outline-light"
              data-bs-toggle="offcanvas"
              data-bs-target="#menu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu */}
      <div className="offcanvas offcanvas-end" id="menu">
        <div className="offcanvas-header">
          <h3 className="offcanvas-title">E-Commerce</h3>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <div className="card">
            <div className="card-body">
              <ul className="nav flex-column nav-pills text-center">
                <li className="nav-item">
                  <NavLink to={'/'} className={'nav-link'}>Home</NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              {
                isLogin ? (
                  <ul className="nav nav-pills flex-column text-center">
                    <li className="nav-item">
                      <NavLink to={`/dashboard/${user?.role}`} className={'nav-link'}>Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink onClick={() => LogoutHandler()} className={'nav-link btn-danger'}>Logout</NavLink>
                    </li>
                  </ul>
                ) : (
                  <ul className="nav nav-pills flex-column text-center">
                    <li className="nav-item">
                      <NavLink to={'/login'} className={'nav-link'}>Login</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to={'/register'} className={'nav-link'}>Register</NavLink>
                    </li>
                  </ul>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
