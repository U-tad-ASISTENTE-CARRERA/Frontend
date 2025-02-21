"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { theme } from "../../../../constants/theme";
import "@fontsource/montserrat";
import ProfileCompletionModal from "../../../../components/ProfileCompletionModal";

const Teacher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [birthDate, setBirthDate] = useState("SIN COMPLETAR");
  const [dni, setDni] = useState("SIN COMPLETAR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState(null);

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

    setLoading(true);
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

      setFirstName(data.metadata.firstName || null);
      setLastName(data.metadata.lastName || null);
      setBirthDate(data.metadata.birthDate || "SIN COMPLETAR");
      setDni(data.metadata.dni || "SIN COMPLETAR");

      if (!data.metadata.firstName || !data.metadata.lastName) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, id]);

  const handleSave = async (newFirstName, newLastName) => {
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: newFirstName,
          lastName: newLastName,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los datos");
      }

      setShowModal(false);
      fetchData(); // 🔹 Volver a hacer `GET` para actualizar los datos en pantalla
    } catch (error) {
      setError("Error al guardar los cambios.");
    }
  };

  return (
    <>
      {/* Abrir modal para añadir el nombre y los apellidos si están vacíos */}
      <ProfileCompletionModal
        isOpen={showModal}
        onSave={handleSave}
        token={token}
      />

      {loading ? (
        <p>Cargando...</p>
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
            <strong>Nombre:</strong> {firstName ?? "SIN COMPLETAR"}
          </p>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>Apellidos:</strong> {lastName ?? "SIN COMPLETAR"}
          </p>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>DNI:</strong> {dni || "SIN COMPLETAR"}
          </p>
          <p style={{ color: theme.palette.text.hex }}>
            <strong>Fecha de nacimiento:</strong> {birthDate || "SIN COMPLETAR"}
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
