import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Cart from './Pages/Cart/Cart';
import SignUp from './Pages/Auth/SignUp';
import payment from './Pages/Payment/Payment';
import Orders from './Pages/Orders/Orders';
import ProductDetail from './Pages/ProductDetail/ProductDetail';

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/payment" element={<payment />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="category/:categoryName" element={<Results />} />
        <Route path="productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default Routing