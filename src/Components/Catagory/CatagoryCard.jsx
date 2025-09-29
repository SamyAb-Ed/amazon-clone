import React from "react";
import classes from "./catagory.module.css";
import { Link } from "react-router-dom";
const CatagoryCard = ({ data }) => {
  
  return (
    <div className={classes.catagory}>
      <Link to={`/category/${encodeURIComponent(data.name)}`}>
        <span>
          <h2>{data.title}</h2>
        </span>
        <img src={data.image} alt="" />
        <p>shop now</p>
      </Link>
    </div>
  );
};

export default CatagoryCard;
