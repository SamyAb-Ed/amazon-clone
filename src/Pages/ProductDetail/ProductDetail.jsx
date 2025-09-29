import React, { useEffect, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../API/endPoint";
import ProductCard from "../../Components/product/ProductCard";
import Loader from "../../Components/Loader/Loader";
const ProductDetail = () => {
  const { id } = useParams();
  console.log(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${productUrl}/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
      setLoading(false);
  }, [id]);

  return <LayOut>
    { loading ? <Loader /> : product ? <ProductCard product={product} 
    flex={true}
    renderDesc = {true}
    /> : null}
    </LayOut>;
};

export default ProductDetail;
