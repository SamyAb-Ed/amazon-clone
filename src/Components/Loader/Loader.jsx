import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import classes from "./Loader.module.css";

function Loader({
  color = "#36d7b7",
  height = 15,
  loading = true,
  fullscreen = false,
  message,
}) {
  if (!loading) return null;

  return (
    <div
      className={`${classes.loader_container} ${
        fullscreen ? classes.fullscreen : ""
      }`}
    >
      <FadeLoader
        color={color}
        height={height}
        loading={loading}
        aria-label="Loading content"
      />
      {message && <p className={classes.loader_message}>{message}</p>}
    </div>
  );
}

export default Loader;
