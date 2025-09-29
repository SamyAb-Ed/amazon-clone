import React, { useEffect, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import classes from "./Results.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../API/endPoint";
import ProductCard from "../../Components/product/ProductCard";
import Loader from "../../Components/Loader/Loader";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryName } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${productUrl}/category/${categoryName}`)
      .then((res) => {
        console.log(res);
        console.log("Hello Console Ninja!");
        setResults(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <LayOut>
      {loading ? (
        <Loader />
      ) : (
        <section>
          <h1 style={{ padding: "30px" }}>Results</h1>
          <p style={{ padding: "30px" }}>category/{categoryName}</p>
          <div className={classes.products_container}>
            {results?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </LayOut>
  );
};

export default Results;
