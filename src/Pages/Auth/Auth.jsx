import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function Auth() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to="/auth/signin" replace />} />
    </Routes>
  );
}

export default Auth;
