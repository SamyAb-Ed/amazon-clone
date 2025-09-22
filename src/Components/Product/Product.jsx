import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Product.css";

function Product() {
  // State to store products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products when component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Simple function to get products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  // Show loading message while fetching
  if (loading) {
    return (
      <div className="loading">
        <h3>Loading products...</h3>
      </div>
    );
  }

  // Show products in a simple grid
  return (
    <div className="products-container">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard renderAdd={true} key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Product;
