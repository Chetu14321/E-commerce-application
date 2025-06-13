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
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesMinPrice = priceRange.min ? product.price >= parseInt(priceRange.min) : true;
    const matchesMaxPrice = priceRange.max ? product.price <= parseInt(priceRange.max) : true;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="container py-5">
      {/* Header and Search */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-5 fw-bold text-success">🌿 Agri Mart</h1>
          <p className="text-muted fs-5">Find the best agricultural products easily.</p>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          className="form-control"
          style={{ maxWidth: "300px" }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filters */}
      <div className="row mb-4 g-3">
        <div className="col-sm-6 col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-3 col-md-2">
          <input
            type="number"
            placeholder="Min ₹"
            className="form-control"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
        </div>
        <div className="col-sm-3 col-md-2">
          <input
            type="number"
            placeholder="Max ₹"
            className="form-control"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>

      {/* Products */}
      {currentProducts.length === 0 ? (
        <p className="text-center text-muted">No products match your filters.</p>
      ) : (
        <div className="row g-4">
          {currentProducts.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product._id}>
              <div className="card h-100 shadow-sm border-0 rounded-4">
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
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
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
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Footer */}
      <footer className="bg-success text-white py-4 mt-5 rounded-3">
        <div className="container text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Agri Mart. All rights reserved.
          </p>
          <p>
            <a href="/terms" className="text-light me-3">
              Terms of Service
            </a>
            <a href="/privacy" className="text-light">
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
