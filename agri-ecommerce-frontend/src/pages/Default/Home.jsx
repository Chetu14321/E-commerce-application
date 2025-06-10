import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../product/CartContext";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      const response = await axios.post(
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

  // Filter by search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container py-5">
      {/* Heading and Search */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5">
        <div className="text-center text-md-start">
          <h1 className="display-5 fw-bold text-success">🌿 Welcome to Agri Mart</h1>
          <p className="text-muted fs-5">Shop top-quality agricultural products at the best prices.</p>
        </div>
        <div className="mt-3 mt-md-0">
          <input
            type="text"
            placeholder="Search products..."
            className="form-control"
            style={{ maxWidth: "300px" }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 when searching
            }}
          />
        </div>
      </div>

      {/* Products */}
      {currentProducts.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
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
                  <h6 className="text-success fw-bold mb-3">₹{product.price}</h6>
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
      <footer className="bg-primary text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Agri Mart. All rights reserved.
          </p>
          <p>
            <a href="/terms" className="text-light me-3">
              Terms of Service!
            </a>
            <a href="/privacy" className="text-light">
              Privacy Policy..
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
