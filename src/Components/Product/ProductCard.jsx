import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import numeral from "numeral";
import classes from "./Product.module.css";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";

function ProductCard({ product, flex }) {
  const { image, id, title, rating, price } = product;
  const [currentRating, setCurrentRating] = useState(rating?.rate || 0);

  return (
    <div className={classes.card_container}>
      <a href="">
        <div className={classes.image_wrap}>
          <img src={image} alt={title} />
        </div>
      </a>
      <div>
        <h4>{title}</h4>
        <div className={classes.rating}>
          <Rating
            value={currentRating}
            precision={0.5}
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
}

export default ProductCard;
