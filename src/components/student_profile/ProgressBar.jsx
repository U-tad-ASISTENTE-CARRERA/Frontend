import React, { useEffect, useState } from "react";
import "@fontsource/montserrat";
import { theme } from "@/constants/theme";

const ProgressBar = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-8 relative">
      <div
        className="h-4 rounded-full transition-all duration-500"
        style={{
          width: `${animatedProgress}%`,
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(62,9,121,1) 37%, rgba(86,0,255,1) 100%)",
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-4">
        <div
          className="absolute top-0 left-1/4 transform -translate-x-1/2"
          style={{ width: "2px", height: "100%", backgroundColor: "gray" }}
        >
          <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
            25%
          </span>
        </div>
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ width: "2px", height: "100%", backgroundColor: "gray" }}
        >
          <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
            50%
          </span>
        </div>
        <div
          className="absolute top-0 left-3/4 transform -translate-x-1/2"
          style={{ width: "2px", height: "100%", backgroundColor: "gray" }}
        >
          <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
            75%
          </span>
        </div>
      </div>

      <h2
        className="text-center mt-8"
        style={{
          color: theme.palette.purple.hex,
          fontFamily: "Montserrat, sans-serif",
          fontSize: theme.fontSizes.xxl,
          fontWeight: theme.fontWeight.bold,
        }}
      >
        {progress.toFixed(1)}%
      </h2>
    </div>
  );
};

export default ProgressBar;
