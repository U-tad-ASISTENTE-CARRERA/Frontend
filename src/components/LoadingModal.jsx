import React from "react";
import Lottie from "lottie-react";
import animationData from "../lotties/loading_v4.json";
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
          opacity: 0.8,
          borderRadius: theme.buttonRadios.l,
        }}
        loop={true}
        speed={2}
      />
    </div>
  );
};

export default LoadingModal;
