import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { ActionType } from "../../Components/Utility/ActionType";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import Loader from "../../Components/Loader/Loader";
import "./ProductDetail.css";

function ProductDetail() {
  const { ProductId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(DataContext);

  useEffect(() => {
    // Fetch single product data
    fetch(`https://fakestoreapi.com/products/${ProductId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [ProductId]);

  const addToCart = () => {
    dispatch({
      type: ActionType.AddToBascket,
      item: product,
    });
  };

  if (loading) return <Loader message="Loading product details..." />;
  if (!product) return <div className="error_message">Product not found</div>;

  return (
    <div className="product_detail_container">
      <div className="product_detail_content">
        {/* Product Image */}
        <div className="product_image_container">
          <img
            src={product.image}
            alt={product.title}
            className="product_image"
          />
        </div>

        {/* Product Info */}
        <div className="product_info">
          <h1 className="product_title">{product.title}</h1>

          <div className="rating_container">
            <Rating
              value={product.rating?.rate || 0}
              precision={0.1}
              readOnly
            />
            <span className="review_count">
              ({product.rating?.count || 0} reviews)
            </span>
          </div>

          <div className="price">
            <CurrencyFormat amount={product.price} />
          </div>

          <p className="description">{product.description}</p>

          <div className="category_info">
            <span className="category_label">Category:</span> {product.category}
          </div>

          <button onClick={addToCart} className="add_to_cart_button">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
