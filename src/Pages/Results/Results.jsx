import React, { useEffect, useState } from "react";
import classes from "./Results.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/EndPoints";
import ProductCard from "../../Components/Product/ProductCard";
import Loader from "../../Components/Loader/Loader";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryName } = useParams();

  useEffect(() => {
    setLoading(true);
    console.log("Fetching products for category:", categoryName);
    console.log("API URL:", `${productUrl}/category/${categoryName}`);

    // First, let's try to get all products to see what categories exist
    let allProducts = [];
    axios
      .get(`${productUrl}/products`)
      .then((res) => {
        console.log("All products:", res.data);
        allProducts = res.data;
        const categories = [
          ...new Set(res.data.map((product) => product.category)),
        ];
        console.log("Available categories:", categories);

        // If direct API calls fail, try filtering all products by category
        setTimeout(() => {
          if (results.length === 0) {
            console.log(
              "Trying to filter all products by category:",
              categoryName
            );
            const filteredProducts = allProducts.filter(
              (product) =>
                product.category?.toLowerCase() === categoryName?.toLowerCase()
            );
            console.log("Filtered products:", filteredProducts);
            if (filteredProducts.length > 0) {
              setResults(filteredProducts);
            }
          }
        }, 2000);
      })
      .catch((err) => {
        console.error("Error fetching all products:", err);
      });

    // Now try to get products for the specific category
    // Try different API endpoints
    const apiEndpoints = [
      `${productUrl}/category/${categoryName}`,
      `${productUrl}/products/category/${categoryName}`,
      `${productUrl}/products?category=${categoryName}`,
    ];

    const tryApiEndpoints = async () => {
      for (const endpoint of apiEndpoints) {
        try {
          console.log("Trying API endpoint:", endpoint);
          const res = await axios.get(endpoint);
          console.log("API Response for category:", res.data);
          setResults(res.data);
          return;
        } catch (err) {
          console.error(`API Error for ${endpoint}:`, err);
          console.error("Error details:", err.response?.data);
        }
      }
      console.error("All API endpoints failed");
    };

    tryApiEndpoints().finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <LayOut>
      {loading ? (
        <Loader />
      ) : (
        <section>
          <h1 style={{ padding: "30px" }}>Results </h1>
          <p style={{ padding: "30px" }}>Category: {categoryName}</p>
          <hr />
          <div className={classes.products_container}>
            {results && results.length > 0 ? (
              results.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  renderDesc={false}
                  renderAdd={true}
                />
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>No products found for category: {categoryName}</p>
                <p>Please check the console for debugging information.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </LayOut>
  );
};

export default Results;
