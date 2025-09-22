import React from "react";
import { useParams } from "react-router-dom";
import { categoryInfo } from "./CategoryFullInfos";
import classes from "./Category.module.css";

function CategoryDetail() {
  const { categoryName } = useParams();

  // Find the category by name (convert URL param to match category names)
  const category = categoryInfo.find(
    (cat) =>
      cat.name?.toLowerCase().replace(/'/g, "") === categoryName?.toLowerCase()
  );

  if (!category) {
    return (
      <div className={classes.category_detail}>
        <h2>Category not found</h2>
        <p>The category "{categoryName}" does not exist.</p>
      </div>
    );
  }

  return (
    <div className={classes.category_detail}>
      <h2>{category.title}</h2>
      <div className={classes.category_content}>
        <img src={category.image} alt={category.title} />
        <div className={classes.category_info}>
          <h3>{category.title}</h3>
          <p className={classes.description}>{category.description}</p>
          <div className={classes.productCount}>
            <span>{category.productCount} products available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryDetail;
