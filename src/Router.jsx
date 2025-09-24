import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Cart from "./Pages/Cart/Cart";
import Auth from "./Pages/Auth/Auth";
import Payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import OrderConfirmation from "./Pages/OrderConfirmation/OrderConfirmation";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Results from "./Pages/Results/Results";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function Routing() {
  return (
    <Router basename="/Amazon-clone/">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/payments" element={
          <ProtectedRoute msg= {"You must log in to pay"} redirect={"/payments"}>
            <Elements stripe={stripePromise}></Elements>
            <Payment />
            <Elements />
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
        <Payment />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orders" element={
          <ProtectedRoute msg= {"You must log in to see Oreder details"} redirect={"/Orders"}>
          <Orders />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId" element={<OrderConfirmation />} />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/product/:ProductId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default Routing;
