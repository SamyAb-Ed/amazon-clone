import React, { useState, useEffect } from "react";
import classes from "./ProductDetail.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../Components/Product/ProductCard";

function ProductDetail() {
  const { ProductId } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${ProductId}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ProductId]);

  return (
    <LayOut>
      <ProductCard product={product} />
    </LayOut>
  );
}

export default ProductDetail;
