import React, { useEffect, useState } from "react";
import classes from "./Product.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load products. Please try again later.");
        // Set some fallback products for demo
        setProducts([
          {
            id: 1,
            title: "Sample Product 1",
            price: 29.99,
            image: "https://via.placeholder.com/300x200",
            rating: { rate: 4.5, count: 100 },
            description: "This is a sample product for demonstration.",
          },
          {
            id: 2,
            title: "Sample Product 2",
            price: 39.99,
            image: "https://via.placeholder.com/300x200",
            rating: { rate: 4.2, count: 85 },
            description: "This is another sample product for demonstration.",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={classes.product_container}>
      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error}</p>
          <p>Showing sample products instead:</p>
          {products.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      ) : (
        products.map((p) => <ProductCard product={p} key={p.id} />)
      )}
    </section>
  );
};

export default Product;
