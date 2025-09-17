import { useState } from "react";
import Header from "./Components/Header/Header";
import Carousel from "./Components/Carousel/Carousel";
import Category from "./Components/Category/Category";
import Product from "./Components/Product/Product";
import CategoryDetail from "./Components/Category/CategoryDetail";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
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
        <Route path="/category/:categoryName" element={<CategoryDetail />} />
        <Route
          path="/cart"
          element={
            <div>
              <h1>Cart Page</h1>
              <p>This is the cart page</p>
            </div>
          }
        />
        <Route path="/product/:ProductId" element={<ProductDetail />} />
        {/* Add more routes here, e.g.: */}
      </Routes>
    </>
  );
}

export default App;
