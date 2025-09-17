import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import classes from "./Product.module.css";

function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section>
      {products && products.length > 0 ? (
        <div className={classes.products_grid}>
          {products.map((singleProduct) => (
            <ProductCard product={singleProduct} key={singleProduct.id} />
          ))}
        </div>
      ) : (
        <div>Loading products...</div>
      )}
    </section>
  );
}

export default Product;
