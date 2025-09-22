import React from "react";
import { useNavigate } from "react-router-dom";
import { categoryInfo } from "./CategoryFullInfos";
import classes from "./Category.module.css";

// Clean category card component using CSS modules
const CategoryCard = ({ data, onClick }) => {
  const handleImageError = (e) => {
    console.log("Image failed to load:", data.image);
    e.target.style.display = "none";
  };

  return (
    <div className={classes.categoryCard} onClick={onClick}>
      <img
        src={data.image}
        alt={data.title}
        className={classes.categoryImage}
        onError={handleImageError}
      />
      <h3 className={classes.categoryTitle}>{data.title}</h3>
      <p className={classes.categoryDescription}>{data.description}</p>
      <div className={classes.categoryFooter}>
        <span className={classes.productCount}>
          {data.productCount} products
        </span>
        <span className={classes.shopNow}>Shop Now →</span>
      </div>
    </div>
  );
};

export default function Category() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryData) => {
    console.log("Navigating to category:", categoryData.name);
    console.log("Full URL:", `/category/${categoryData.name}`);
    navigate(`/category/${categoryData.name}`);
  };
  return (
    <section className={classes.section}>
      <h2 className={classes.sectionTitle}>Our Categories</h2>

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
// export default Category;
