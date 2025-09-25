import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";
import "./Product.css";

function Product() {
  // State for FakeStore API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from FakeStore API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching from FakeStore API:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle retry button click
  const handleRetry = () => {
    fetchProducts();
  };

  // Fetch products when component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Show loading spinner while fetching
  if (loading) {
    return <Loader message="Loading products..." fullscreen={true} />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="error" style={{ textAlign: "center", padding: "20px" }}>
        <h3>Error loading products</h3>
        <p style={{ color: "#666" }}>{error}</p>
        <button
          onClick={handleRetry}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Retrying..." : "Retry"}
        </button>
      </div>
    );
  }

  // Show products in a simple grid
  return (
    <div className="products-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Our Products</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>FakeStore API</span>
          <span style={{ fontSize: "12px", color: "#888" }}>
            ({products.length} products)
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3>No products found</h3>
          <p style={{ color: "#666" }}>Unable to load products from the API.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard renderAdd={true} key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Product;
