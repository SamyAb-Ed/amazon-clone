
import React, { useContext, useState } from "react";
import Rating from "@mui/material/Rating";
import numeral from "numeral";
import { Link } from "react-router-dom"; 
import classes from "./Product.module.css";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import { DataContext } from "../DataProvider/DataProvider";
import { ActionType } from "../Utility/ActionType";

function ProductCard({ product, flex }) {
  const { image, id, title, rating, price } = product;
  const [currentRating, setCurrentRating] = useState(rating?.rate || 0);
  
  const [state, dispatch] = useContext(DataContext)

  const addItemToCart = () => {
    dispatch({
      type:ActionType.AddToBascket,
      item: {image, id, title, rating, price},
    })
  };
  return (
    <div
      className={`${classes.card_container} ${
        flex ? classes.Product_flexed : ""
      }`}
    >
      <Link to={`/products/${id}`} className={classes.image_link}>
        <img src={image} alt="" className={classes.img_container} />
      </Link>
      <div>
        <h4>{title}</h4>
        <div className={classes.rating}>
          <Rating
            value={currentRating}
            precision={0.1}
            onChange={(event, newValue) => {
              if (typeof newValue === "number") setCurrentRating(newValue);
            }}
          />
          <small>({rating?.count ?? 0})</small>
        </div>
        <CurrencyFormat amount={price} />

        <button className={classes.button}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard