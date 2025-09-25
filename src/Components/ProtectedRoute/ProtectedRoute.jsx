import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";

const ProtectedRoute = ({ children, msg, redirect }) => {
  const navigate = useNavigate();
  const [state, dispatch, loading] = useContext(DataContext);
  const { user } = state;

  useEffect(() => {
    if (!loading && !user) {
      console.log(
        "ProtectedRoute - Redirecting to auth, user not authenticated"
      );
      navigate("/auth", { state: { msg, redirect } });
    }
  }, [user, loading, navigate, msg, redirect]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Loading...</h3>
        <p>Checking authentication status...</p>
      </div>
    );
  }

  // If user is authenticated, render children
  if (user) {
    return children;
  }

  // If not authenticated and not loading, return null (will redirect)
  return null;
};

export default ProtectedRoute;
