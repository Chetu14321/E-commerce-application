import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../product/CartContext";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

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
      <footer className="bg-success text-white pt-5 pb-4">
  <div className="container">
    <div className="row">
      {/* About Section */}
      <div className="col-md-4 mb-4">
        <h5 className="text-uppercase mb-3">🌾 About Agri Mart</h5>
        <p className="small">
          We connect you with fresh, organic agricultural products directly from the farms. Trusted by farmers and loved by consumers across India.
        </p>
        <div>
          <a href="https://facebook.com" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com" className="text-white me-3"><i className="fab fa-twitter"></i></a>
          <a href="https://instagram.com" className="text-white me-3"><i className="fab fa-instagram"></i></a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="col-md-4 mb-4">
        <h5 className="text-uppercase mb-3">Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="/" className="text-white text-decoration-none">🏠 Home</a></li>
          <li><a href="/about" className="text-white text-decoration-none">ℹ️ About Us</a></li>
          <li><a href="/products" className="text-white text-decoration-none">🛒 Products</a></li>
          <li><a href="/contact" className="text-white text-decoration-none">📞 Contact</a></li>
        </ul>
      </div>

      {/* Contact & Newsletter */}
      <div className="col-md-4 mb-4">
        <h5 className="text-uppercase mb-3">📬 Stay Connected</h5>
        <p className="small mb-1">Email: support@agrimart.com</p>
        <p className="small mb-3">Phone: +91 9876543210</p>
        <form className="d-flex">
          <input type="email" className="form-control me-2" placeholder="Subscribe to newsletter" />
          <button className="btn btn-outline-light" type="submit">Subscribe</button>
        </form>
      </div>
    </div>

    <hr className="border-light" />

    <div className="text-center small">
      &copy; {new Date().getFullYear()} Agri Mart — All rights reserved | Built with ❤️ by AgriTech Team
    </div>
  </div>
</footer>

    </div>
  );
};

export default Home;