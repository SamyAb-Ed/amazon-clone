import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
import { ActionType } from "../Utility/ActionType";
import "./ProductCard.css";

function ProductCard({
  product,
  showAddButton = true,
  showDescription = false,
  isCartItem = false,
  onRemove,
  onIncrement,
  onDecrement,
  quantity = 1,
}) {
  // Get product details
  const { image, id, title, rating, price } = product;

  // Get cart context
  const [state, dispatch] = useContext(DataContext);

  console.log("ProductCard - Current state:", state);
  console.log("ProductCard - DataContext available:", !!DataContext);
  console.log("ProductCard - Dispatch function:", typeof dispatch);

  // Add product to cart
  const addToCart = () => {
    console.log("Adding to cart:", { image, id, title, rating, price });
    dispatch({
      type: ActionType.AddToBasket,
      item: { image, id, title, rating, price },
    });
    console.log("Dispatch called, current state:", state);
    // Alert removed - cart count will show the update instead
  };

  return (
    <div className={`product-card ${isCartItem ? "cart-item" : ""}`}>
      {/* Product Image */}
      <Link to={`/product/${id}`} className="product-link">
        <img src={image} alt={title} className="product-image" />
      </Link>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title">{title}</h3>

        {/* Description - only show if requested */}
        {showDescription && (
          <p className="product-description">
            This is a great product with excellent quality and features.
          </p>
        )}

        {/* Rating */}
        <div className="product-rating">
          <span>⭐ {rating?.rate || 0}</span>
          <span>({rating?.count || 0} reviews)</span>
        </div>

        {/* Price */}
        <div className="product-price">${price}</div>

        {/* Quantity controls for cart items */}
        {isCartItem && (
          <div className="quantity-controls">
            <button onClick={() => onDecrement && onDecrement(product)}>
              -
            </button>
            <span>Qty: {quantity}</span>
            <button onClick={() => onIncrement && onIncrement(product)}>
              +
            </button>
            <button
              onClick={() => onRemove && onRemove(product)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        )}

        {/* Add to Cart Button - only show if not in cart */}
        {showAddButton && !isCartItem && (
          <button className="add-to-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
