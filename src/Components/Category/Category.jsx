import React from "react";
import { useNavigate } from "react-router-dom";
import { categoryInfo } from "./CategoryFullInfos";
import "./Category.css";

// Simple category card component
function CategoryCard({ category, onCategoryClick }) {
  return (
    <div className="category-card" onClick={() => onCategoryClick(category)}>
      <img
        src={category.image}
        alt={category.title}
        className="category-image"
        onError={(e) => {
          e.target.style.display = "none";
          console.log("Image failed to load:", category.image);
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

  return (
    <div className="category-container">
      <h2 className="category-title-main">Our Categories</h2>

      <div className="category-grid">
        {categoryInfo.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onCategoryClick={handleCategoryClick}
          />
        ))}
      </div>
    </div>
  );
}

export default Category;
