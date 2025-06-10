import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../product/CartContext"; // Import your cart context

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from URL
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart(); // Access the addToCart function from context
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setProduct(res.data.product || res.data))
      .catch(err => {
        console.error("Failed to fetch product:", err);
        setProduct(null); // Handle error case
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product); // Add the product to the cart
    navigate("/cart"); // Redirect to cart page
  };

  if (!product) {
    return <div className="text-center mt-5">Product not found or loading error!</div>;
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Left Side - Product Images */}
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="d-block w-100 img-fluid rounded shadow-sm"
                  style={{ height: "400px", objectFit: "contain" }}
                />
              </div>
              {/* Additional images if available */}
              {product.additional_images?.map((img, index) => (
                <div className="carousel-item" key={index}>
                  <img
                    src={img || "/placeholder.jpg"}
                    alt={product.name}
                    className="d-block w-100 img-fluid rounded shadow-sm"
                    style={{ height: "400px", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/* Right Side - Product Information */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h3 className="text-success fw-bold mb-3">₹{product.price}</h3>

          {/* Add to Cart Button */}
          <button className="btn btn-success w-100" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <hr className="my-4" />

          {/* Product Rating and Review */}
          <div className="d-flex justify-content-start align-items-center">
            <span className="badge bg-warning text-dark me-2">
              <i className="fas fa-star"></i> {product.rating || "4.5"} / 5
            </span>
            <span>({product.reviews?.length} Reviews)</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Product Details:</h5>
        <ul>
          <li>Brand: {product.brand}</li>
          <li>Category: {product.category}</li>
          <li>Stock: {product.stock ? "In Stock" : "Out of Stock"}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
