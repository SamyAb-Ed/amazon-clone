// import { useState } from "react";
// import Header from "./Components/Header/Header";
// import Carousel from "./Components/Carousel/Carousel";
// import Category from "./Components/Category/Category";
// import Product from "./Components/Product/Product";
// import CategoryDetail from "./Components/Category/CategoryDetail";
// import Cart from "./Pages/Cart/Cart";
// import ProductDetail from "./Pages/ProductDetail/ProductDetail";
// import Orders from "./Pages/Orders/Orders";
// import SignUp from "./Pages/Auth/SignUp";
// import { Routes, Route } from "react-router-dom";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <>
//               <Carousel />
//               <Category />
//               <Product />
//             </>
//           }
//         />
//         <Route path="/category/:categoryName" element={<Results />} />
//         <Route
//           path="/cart"
//           element={
//             <div>
//               {" "}
//               <h3>Cart Page</h3>
//             </div>
//           }
//         />
//         <Route path="/product/:ProductId" element={<ProductDetail />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/login" element={<SignUp />} />
//         {/* <Route path="/signup" element={<SignUp />} /> */}
//         {/* Add more routes here, e.g.: */}
//       </Routes>
//     </>
//   );
// }

// export default App;

import { useState } from "react";
import Header from "./Components/Header/Header";
import Carousel from "./Components/Carousel/Carousel";
import Category from "./Components/Category/Category";
import Product from "./Components/Product/Product";
import CategoryDetail from "./Components/Category/CategoryDetail";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Orders from "./Pages/Orders/Orders";
import SignUp from "./Pages/Auth/SignUp";
import Results from "./Pages/Results/Results";
import { Routes, Route } from "react-router-dom";
import { DataProvider } from "./Components/DataProvider/DataProvider"; // Add this import

function App() {
  const [count, setCount] = useState(0);

  return (
    <DataProvider>
      {" "}
      {/* Wrap everything with DataProvider */}
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Carousel />
              <Category />
              <Product />
            </>
          }
        />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route
          path="/cart"
          element={
            <div>
              {" "}
              <h3>Cart Page</h3>
            </div>
          }
        />
        <Route path="/product/:ProductId" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<SignUp />} />
      </Routes>
    </DataProvider>
  );
}

export default App;
