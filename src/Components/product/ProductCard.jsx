import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import classes from "./Product.module.css";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import { Link } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";

const ProductCard = ({ product, flex, renderDesc }) => {
  const { image, title, id, rating, price, description, category } = product;
  console.log(product);
  const [state, dispatch] = useContext(DataContext);
  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: { image, title, id, rating, price, description },
    });
  };

  return (
    <div
      className={`${classes.card_container} ${
        flex ? classes.product_flexed : ""
      }`}
    >
      <Link to={`/product/${id}`}>
        <img src={image} alt="" />
      </Link>
      <div>
        <h3>{title}</h3>
        {category && (
          <div className={classes.category_link}>
            <Link to={`/category/${encodeURIComponent(category)}`}>
              <small>Category: {category}</small>
            </Link>
          </div>
        )}
        {renderDesc && <div style={{maxWidth:"750px"}}>{description}</div>}
        <div className={classes.rating}>
          {/* rating */}
          <Rating value={rating?.rate ?? 0} precision={0.1} readOnly />
          {/* count */}
          <small>{rating?.count ?? 0}</small>
        </div>
        <div>
          {/* price */}
          <CurrencyFormat amount={price} />
        </div>
        <button className={classes.button} onClick={addToCart}>
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
