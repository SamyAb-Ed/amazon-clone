import { useState } from "react";
import Header from "./Components/Header/Header";
import Carousel from "./Components/Carousel/Carousel";
import Category from "./Components/Category/Category";
import Product from "./Components/Product/Product";
import CategoryDetail from "./Components/Category/CategoryDetail";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Orders from "./Pages/Orders/Orders";
import Auth from "./Pages/Auth/Auth";
import Results from "./Pages/Results/Results";
import { Routes, Route } from "react-router-dom";
import { DataProvider } from "./Components/DataProvider/DataProvider";
import AuthListener from "./Components/Utility/AuthListener";

function App() {
  const [count, setCount] = useState(0);

  return (
    <DataProvider>
      <AuthListener>
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:ProductId" element={<ProductDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </AuthListener>
    </DataProvider>
  );
}

export default App;
