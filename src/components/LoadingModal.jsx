import React from "react";
import Lottie from "lottie-react";
import animationData from "../lotties/loading_v1.json";

const LoadingModal = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        loop={true}
      />
    </div>
  );
};

export default LoadingModal;
