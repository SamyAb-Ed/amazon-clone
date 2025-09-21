import React from "react";
import { useNavigate } from "react-router-dom";  
import { categoryInfo } from "./CategoryFullInfos";
import classes from "./Category.module.css";

// Clean card component using CSS modules
const CategoryCard = ({ data, onClick }) => {
  return (
    <div className={classes.categoryCard} onClick={onClick}>
      <img src={data.image} alt={data.title} className={classes.productImage} />
      <h3 className={classes.productTitle}>{data.title}</h3>
      <p className={classes.productPrice}>${data.price}</p>
      <p className={classes.productCategory}>{data.category}</p>
      {data.rating && (
        <div className={classes.productRating}>
          <span className={classes.ratingStars}>
            {"★".repeat(Math.floor(data.rating.rate))}
            {"☆".repeat(5 - Math.floor(data.rating.rate))}
          </span>
          <span>({data.rating.count})</span>
        </div>
      )}
    </div>
  );
};

export default function Category() {
  const navigate = useNavigate();  // ← ADD THIS LINE

  const handleCategoryClick = (categoryData) => {  // ← ADD THIS FUNCTION
    navigate(`/category/${categoryData.category}`);
  };
  return (
    <section className={classes.section}>
      {/* <h2 className={classes.sectionTitle}>Our Categories</h2> */}

      <section className={classes.catagorySection}>
        {/* {categoryInfo.map((info, index) => (
          <CategoryCard key={info.id || index} data={info} /> */}
        {categoryInfo.map((info, index) => (
          <CategoryCard
            key={info.id || index}
            data={info}
            onClick={() => handleCategoryClick(info)}
          />
        ))}
      </section>
    </section>
  );
}