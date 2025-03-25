import React from "react";
import Lottie from "lottie-react";
import animationData from "../lotties/loading_v3.json";
import { theme } from "@/constants/theme";

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        style={{
          width: "300px",
          height: "300px",
          backgroundColor: "white",
          opacity: 0.8,
          borderRadius: theme.buttonRadios.l,
        }}
        loop={true}
      />
    </div>
  );
};

export default LoadingModal;
