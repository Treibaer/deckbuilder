// src/LoadingCard.js
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingCard = () => {
  return (
    <div className="loadingCard">
      <Skeleton height={30} width={`50%`} style={{ marginTop: "10px" }} />
      <Skeleton
        className="preview"
        width={224 - 20}
        height={314 - 20}
        style={{ marginTop: "28px" }}
      />
    </div>
  );
};

export default LoadingCard;
