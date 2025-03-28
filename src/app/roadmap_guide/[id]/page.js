"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@components/ErrorPopUp";
import LoadingModal from "@components/LoadingModal";
import RoadmapTest from "@/components/student_profile/RoadmapGuide/RoadmapTest";

const RoadmapGuide = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      if (JSON.parse(localStorage.getItem("user")).role === "TEACHER") {
        return (
          <ErrorPopUp
            message={"No tienes acceso a esta página."}
            path={`/home/student/${params.id}`}
          />
        );
      } else {
        setLoading(false);
      }
    } else {
      return (
        <ErrorPopUp
          message={"Debes iniciar sesión para ver esta página."}
          path={`/login`}
        />
      );
    }
  }, []);

  const generateRoadmap = async () => {
    try {
      const response = await fetch("http://localhost:3000/userRoadmap", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (specialization) => {
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          specialization,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido",
          INVALID_USER_ID: "El usuario no existe",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };

        setError(
          errorMessages[data?.error] || "Error al actualizar los metadatos"
        );
        return;
      } else {
        setSuccess(true);
        generateRoadmap();
        router.push(`/home/student/${params.id}`);
      }
    } catch (error) {
      console.error(error);
      setError("Ha ocurrido un error inesperado");
    }
  };

  if (loading) {
    return <LoadingModal message="Cargando..." />;
  }

  return (
    <div>
      <RoadmapTest onSubmit={handleSubmit} />

      {error && (
        <p
          style={{
            color: theme.palette.error.hex,
            fontFamily: "Montserrat, sans-serif",
          }}
          className="text-red-500 text-sm text-center"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default RoadmapGuide;
