import React from "react";
import { useNavigate } from "react-router-dom";
import { categoryInfo } from "./CategoryFullInfos";
import "./Category.css";

// Simple category card component
function CategoryCard({ category, onCategoryClick }) {
  return (
    <div className="category-card" onClick={() => onCategoryClick(category)}>
      <img
        src={category.image || category.imgLink}
        alt={category.title}
        className="category-image"
        onError={(e) => {
          console.log(
            "Image failed to load:",
            category.image || category.imgLink
          );
          // Try fallback image
          if (
            e.target.src !== "https://via.placeholder.com/300x200?text=No+Image"
          ) {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          } else {
            e.target.style.display = "none";
          }
        }}
      />
      <h3 className="category-title">{category.title}</h3>
      <p className="category-description">{category.description}</p>
      <div className="category-footer">
        <span className="product-count">{category.productCount} products</span>
        <span className="shop-now">Shop Now →</span>
      </div>
    </div>
  );
}

// Main Category component
function Category() {
  const navigate = useNavigate();

  // Handle category click - navigate to category page
  const handleCategoryClick = (category) => {
    navigate(`/category/${category.name}`);
  };

  // Debug: Log category data
  console.log("Category data:", categoryInfo);

  return (
    <div className="category-container">
      <h2 className="category-title-main">Our Categories</h2>

      <div className="category-grid">
        {categoryInfo.map((category) => {
          console.log(
            `Rendering category ${category.title} with image:`,
            category.image || category.imgLink
          );
          return (
            <CategoryCard
              key={category.id}
              category={category}
              onCategoryClick={handleCategoryClick}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Category;
