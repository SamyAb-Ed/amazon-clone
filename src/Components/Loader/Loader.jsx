import React from 'react'
import FadeLoader from "react-spinners/FadeLoader";
function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
        <FadeLoader
        color="#36d7b7"
        height={15} />
    </div>
  )
}

export default Loader