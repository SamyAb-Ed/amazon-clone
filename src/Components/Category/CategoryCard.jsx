import React from "react";
import classes from "./Category.module.css";
import { Link } from "react-router-dom";

function CategoryCard({ data }) {
  return (
    <div className={classes.category}>
      <Link to={`/category/${data.category.toLowerCase().replace(/'/g, "")}`}>
        <span>
          <h3>{data.title}</h3>
        </span>
        <img src={data.image} alt="" />
        <p>shop now</p>
      </Link>
    </div>
  );
}

export default CategoryCard;
