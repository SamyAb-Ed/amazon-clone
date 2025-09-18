import React from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { ProductId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Detail Page</h1>
      <p>ProductId: {ProductId || "No ID provided"}</p>
      <p>This is a test page to see if routing works.</p>
    </div>
  );
}

export default ProductDetail;
