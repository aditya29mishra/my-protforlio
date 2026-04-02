import React from "react";
import "../styles/ShimmerLoader.css";

const ShimmerLoader = ({ height = "100px", borderRadius = "8px", style = {} }) => {
  return (
    <div
      className="shimmer-wrapper"
      style={{
        height,
        borderRadius,
        ...style,
      }}
    >
      <div className="shimmer-animation" />
    </div>
  );
};

export default ShimmerLoader;
