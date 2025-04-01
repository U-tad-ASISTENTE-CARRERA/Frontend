import React from "react";
import Lottie from "lottie-react";
import animationData from "../lotties/404.json";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-start items-center min-h-screen">
      {/* Añadido pt-16 para dejar espacio para el Navbar */}
      <div className="flex flex-col items-center justify-center">
        <Lottie
          animationData={animationData}
          className="flex justify-center items-center"
          style={{
            width: "400px",
            height: "400px",
            opacity: 0.8,
            borderRadius: theme.buttonRadios.l,
          }}
          loop={true}
          speed={2}
        />
        <h1
          style={{
            fontSize: "40px",
            color: "#3e80bc",
            fontWeight: theme.fontWeight.bold,
            fontFamily: "Montserrat",
            marginBottom: "25px",
          }}
        >
          Ups! No encontramos esa página
        </h1>
        <button
          onClick={() => {
            router.back();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition"
        >
          <FaArrowLeft />
          <span>Volver</span>
        </button>
      </div>
    </div>
  );
};

export default Custom404;
