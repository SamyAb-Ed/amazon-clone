import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import classes from "./Product.module.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading products...
        </div>
      ) : (
        <div className={classes.products_grid}>
          {products && products.length > 0 ? (
            products.map((singleProduct) => (
              <ProductCard product={singleProduct} key={singleProduct.id} />
            ))
          ) : (
            <div>No products found</div>
          )}
        </div>
      )}
    </section>
  );
}

export default Product;
