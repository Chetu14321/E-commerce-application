import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../product/CartContext";

export default function Menu() {
  const { isLogin, setIsLogin, setToken, setUser, user } = useAuth();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // const [searchTerm, setSearchTerm] = useState("");

  const LogoutHandler = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await axios
        .post(`/api/users/logout`)
        .then((res) => {
          toast.success(res.data.msg);
          setIsLogin(false);
          setToken(false);
          setUser(false);
          navigate(`/`);
        })
        .catch((err) => {
          toast.error(err.response.data.msg);
        });
    } else {
      toast.warning("Logout failed");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          {/* Title + Search */}
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <NavLink className="navbar-brand mb-0" to={"/"}>
              E-Commerce Application
            </NavLink>

            {/* 🔍 Search Bar */}
            {/* <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/?q=${searchTerm}`);
              }}
            >
              <input
                type="text"
                placeholder="Search products..."
                className="form-control form-control-sm"
                style={{ maxWidth: "300px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form> */}
          </div>

          {/* Icons */}
          <div className="d-flex align-items-center gap-3">
            <NavLink
              to={isLogin ? `/dashboard/${user?.role}` : "/login"}
              className="text-white"
              title={isLogin ? "Dashboard" : "Login"}
            >
              <FaUserCircle size={24} />
            </NavLink>

            <NavLink to="/cart" className="position-relative">
              <FaShoppingCart size={24} className="text-white" />
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

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
                  <NavLink to={"/"} className={"nav-link"}>
                    Home
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              {isLogin ? (
                <ul className="nav nav-pills flex-column text-center">
                  <li className="nav-item">
                    <NavLink
                      to={`/dashboard/${user?.role}`}
                      className={"nav-link"}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      onClick={() => LogoutHandler()}
                      className={"nav-link btn-danger"}
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              ) : (
                <ul className="nav nav-pills flex-column text-center">
                  <li className="nav-item">
                    <NavLink to={"/login"} className={"nav-link"}>
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={"/register"} className={"nav-link"}>
                      Register
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
