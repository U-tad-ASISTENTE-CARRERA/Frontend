"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { theme } from "../../../constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "../../../components/ErrorPopUp";

const Teacher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  // Estados inicializados con valores por defecto
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("SIN COMPLETAR");
  const [dni, setDni] = useState("SIN COMPLETAR");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedToken = localStorage.getItem("token");

      if (!storedToken) {
        const urlToken = searchParams.get("token");
        if (urlToken) {
          localStorage.setItem("token", urlToken);
          storedToken = urlToken;
        }
      }

      setToken(storedToken);
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!token || !id) return;
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener metadatos del profesor");
      }

      const data = await response.json();
      console.log("✅ Datos recibidos:", data);

      // Asegúrate de que los valores nunca sean undefined o null
      setFirstName(data.metadata.firstName || "");
      setLastName(data.metadata.lastName || "");
      setBirthDate(data.metadata.birthDate || "");
      setDni(data.metadata.dni || "");

      /*if (!data.metadata.firstName || !data.metadata.lastName) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }*/
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, id]); // Añade token e id como dependencias

  return (
    <>
      {firstName === "" || lastName === "" ? (
        <ErrorPopUp
          message={"Debes completar tus datos básicos"}
          path={`/data_complete/teacher/${id}`}
        />
      ) : (
        <div className="flex flex-col items-start justify-start min-h-screen p-10">
          <h1
            className="text-2xl font-bold mb-6"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            Bienvenid@ {firstName || "Usuario"}
          </h1>

          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: theme.palette.dark.hex }}
          >
            Detalles del perfil
          </h2>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>Nombre:</strong> {firstName}
          </p>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>Apellidos:</strong> {lastName}
          </p>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>DNI:</strong> {dni}
          </p>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>Fecha de nacimiento:</strong> {birthDate}
          </p>

          <button
            onClick={() => router.push(`/profile/teacher/${id}/edit`)}
            className="mt-4 px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: theme.palette.primary.hex }}
          >
            Modificar
          </button>

          <h2
            className="text-xl font-semibold mt-6"
            style={{ color: theme.palette.dark.hex }}
          >
            Alumnos tutelados
          </h2>
          {/* TODO: Añadir alumnos */}

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>
      )}
    </>
  );
};

export default Teacher;
