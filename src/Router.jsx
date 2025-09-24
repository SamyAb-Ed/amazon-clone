import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Cart from "./Pages/Cart/Cart";
import Auth from "./Pages/Auth/Auth";
import payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Results from "./Pages/Results/Results";

function Routing() {
  return (
    <Router basename="/Amazon-clone/">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/payment" element={<payment />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/product/:ProductId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default Routing;
