import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../product/CartContext";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products/all")
      .then((res) => {
        const data = res.data.products || res.data || [];
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  }, []);

  const handleViewDetails = (productId) => {
    if (!user) {
      alert("Please login to view product details!");
      navigate("/login");
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = async (product) => {
    const productId = product._id;
    const quantity = 1;
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/api/cart/add",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item added to cart successfully!");
      addToCart(product);
      // navigate("home");
    } catch (error) {
      alert("login first");
      console.error("Error adding to cart:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesMinPrice = priceRange.min ? product.price >= parseInt(priceRange.min) : true;
    const matchesMaxPrice = priceRange.max ? product.price <= parseInt(priceRange.max) : true;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="container-fluid py-4 d-flex flex-column min-vh-100% bg-light">
      {/* Moving Message */}
      <div className="  text-black py-2 mb-3 text-center">
        <marquee behavior="scroll" direction="left" scrollamount="5">
          🌱 Welcome to Agri Mart! — Best deals on fresh & organic farm products. Shop now! 🚜
        </marquee>
      </div>

      <div className="row flex-grow-1">
        {/* Left Sidebar for Categories */}
        <div className="col-md-2 border-end bg-white p-3">
          <h5 className="text-success">Categories</h5>
          <ul className="list-group">
            <li className={`list-group-item ${selectedCategory === "" ? "active" : ""}`} onClick={() => setSelectedCategory("")}>All</li>
            {uniqueCategories.map((cat, idx) => (
              <li
                key={idx}
                className={`list-group-item ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
              <img src="/logo192.png" alt="Agri Mart Logo" width="60" height="60" className="rounded-circle" />
              <div>
                <h1 className="fw-bold text-success mb-1">Agri Mart</h1>
                <p className="text-muted mb-0">Fresh & Organic. Direct from farms.</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="form-control shadow-sm"
              style={{ maxWidth: "300px" }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Price Filter */}
          <div className="row mb-4 g-3">
            <div className="col-sm-3">
              <input
                type="number"
                placeholder="Min ₹"
                className="form-control"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
            </div>
            <div className="col-sm-3">
              <input
                type="number"
                placeholder="Max ₹"
                className="form-control"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length === 0 ? (
            <p className="text-center text-muted">No products match your filters.</p>
          ) : (
            <div className="row g-4">
              {currentProducts.map((product) => (
                <div className="col-6 col-sm-4 col-md-3" key={product._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="card-img-top rounded-top-4"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <h6 className="text-success fw-bold mb-2">₹{product.price}</h6>
                      <p className="text-muted small mb-2">{product.category}</p>
                      <div className="mt-auto">
                        <button
                          className="btn btn-sm btn-outline-success w-100 mb-2"
                          onClick={() => handleViewDetails(product._id)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm btn-success w-100"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((num) => (
                  <li
                    key={num + 1}
                    className={`page-item ${currentPage === num + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => setCurrentPage(num + 1)}>
                      {num + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Extended Footer */}
   <footer className="bg-dark text-white mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4">
            <h5>About Agri Mart</h5>
            <p className="small text-muted">
              We bring quality agricultural products directly from trusted farms. 100% organic and fresh.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-white">Home</Link></li>
              <li><Link to="/privacy-policy" className="text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="text-white">Refund Policy</Link></li>
              <li><Link to="/shipping" className="text-white">Shipping Info</Link></li>
              <li><Link to="/contact" className="text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Razorpay Logo */}
          <div className="col-md-4 text-center">
            <img
              src="https://yourcdn.com/rzp-logo.png"
              alt="Razorpay"
              height="40"
            />
            <p className="small mt-2">Powered by Razorpay</p>
          </div>
        </div>

        {/* Copyright */}
        <hr className="border-secondary" />
        <p className="text-center small mb-0">
          &copy; {new Date().getFullYear()} Agri Mart. All rights reserved.
        </p>
      </div>
    </footer>

    </div>
  );
};

export default Home;