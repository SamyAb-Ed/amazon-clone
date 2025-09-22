// import classes from "./Category.module.css";
// import { Link } from "react-router-dom";

// const CategoryCard = ({ data }) => {
//   console.log(data);
  
//   return (
//     <div className={classes.category}>
//       <Link to={`/category/${data.name}`}>
//       <img src={data?.imgLink} alt="data.title"/>
//         <span>
//           <h3 className={classes.titleCenter}>{data?.title}</h3>
//           <p>shop now</p>
//         </span>
//       </Link>
//     </div>
//   );
// };

// export default CategoryCard;


import classes from "./Category.module.css";
import { Link } from "react-router-dom";

const CategoryCard = ({ data }) => {
  return (
    <div className={classes.category}>
      <Link to={`/Category/${data?.name}`}>
        <img src={data?.imgLink} alt={data?.title} />
        <span>
          <h3 className={classes.titleCenter}>{data?.title}</h3>
          <p>Shop now</p>
        </span>
      </Link>
    </div>
  );
};

export default CategoryCard;