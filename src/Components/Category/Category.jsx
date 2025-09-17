import React from "react";
import { categoryInfo } from "./CategoryFullInfos";
import CategoryCard from "./CategoryCard";
import classes from "./Category.module.css";

function Category() {
  return (
    <section className={classes.catagory_container}>
      {categoryInfo.map((info) => (
        <CategoryCard data={info} key={info.id} />
      ))}
    </section>
  );
}

export default Category;
