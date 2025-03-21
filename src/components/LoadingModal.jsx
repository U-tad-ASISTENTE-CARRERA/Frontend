import React from "react";
import { theme } from "@/constants/theme";

const LoadingModal = ({ message = "Cargando datos..." }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        zIndex: 50,
      }}
    >
      <div
        className="p-6 rounded-lg shadow-lg flex flex-col items-center"
        style={{
          backgroundColor: theme.palette.background.hex,
          borderRadius: theme.buttonRadios.l,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          className="animate-spin h-12 w-12 border-4 rounded-full mb-4"
          style={{
            borderColor: `${theme.palette.primary.hex} transparent ${theme.palette.light.hex} transparent`,
            borderWidth: "4px",
          }}
        ></div>
        <p
          className="text-lg font-semibold"
          style={{ color: theme.palette.text.hex }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
