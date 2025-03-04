"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { theme } from "../../../constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "../../../components/ErrorPopUp";
import LoadingModal from "../../../components/LoadingModal";

const Teacher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [dni, setDni] = useState("SIN COMPLETAR");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentsError, setStudentsError] = useState("");

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
      const metadata = data.metadata || {}; // Evitar undefined

      // Activar modal si no hay metadatos
      setShowModal(Object.keys(metadata).length === 0);

      // Guardar datos introducidos
      setFirstName(metadata.firstName);
      setLastName(metadata.lastName);
      setDni(metadata.dni);
      setGender(metadata.gender);
      setSpecialization(metadata.specialization);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener la lista de estudiantes tutelados
  const fetchStudents = async () => {
    if (!token || !id) return;
    try {
      const response = await fetch("http://localhost:3000/student/teacher/getAllStudents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la lista de estudiantes");
      }

      const data = await response.json();

      if (data.message === "No students found") {
        setStudents([]);
      } else {
        setStudents(data);
      }

    } catch (error) {
      setStudentsError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, [token, id]);

  // Determinar el mensaje de bienvenida según el género
  const getWelcomeMessage = () => {
    if (gender === "male") return "Bienvenido";
    if (gender === "female") return "Bienvenida";
    return "Bienvenid@";
  };

  return (
    <>
      {/* Mensaje de carga */}
      {isLoading && <LoadingModal message="Cargando perfil..." />}

      {/* Mostrar modal si no hay datos en metadata */}
      {!isLoading && showModal && (
        <ErrorPopUp
          message={"Debes completar tus datos básicos"}
          path={`/data_complete/teacher/${id}`}
        />
      )}

      {/* Mostrar el perfil si no se está redirigiendo */}
      {!isLoading && !showModal && (
        <div className="flex flex-col items-center min-h-screen">

          <h1 className="text-3xl font-bold text-center pt-20 pb-10" style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}>
            {getWelcomeMessage()} {firstName || "Usuario"}
          </h1>

          <div className="w-full max-w-6xl flex flex-col items-start pt-6 leading-relaxed">

            <div className="w-full">

              {/* DATOS PERSONALES */}
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
                <strong>Género:</strong> {gender ? (gender === "male" ? "Masculino" : gender === "female" ? "Femenino" : "Prefiero no decirlo") : "SIN COMPLETAR"}
              </p>
              <p style={{ color: theme.palette.text.hex }}>
                <strong>Especialización:</strong> {specialization || "No especificado"}
              </p>

              <button
                onClick={() => router.push(`/profile/teacher/${id}/edit`)}
                className="mt-4 px-6 py-2 rounded-lg text-white"
                style={{ backgroundColor: theme.palette.primary.hex }}
              >
                Modificar
              </button>


              {/* ALUMNOS ASOCIADOS AL PROFESOR */}
              <h2
                className="text-xl font-semibold mt-20"
                style={{ color: theme.palette.dark.hex }}
              >
                Alumnos tutelados
              </h2>

              {/* Código a añadir */}
              <div className="w-full overflow-x-auto mt-6 mb-20">
                {studentsError ? (
                  <p className="text-red-500">{studentsError}</p>
                ) : students.length === 0 ? (
                  <p className="text-gray-500">No hay estudiantes asignados.</p>
                ) : (
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Nombre</th>
                        <th className="py-2 px-4 border-b text-left">Apellidos</th>
                        <th className="py-2 px-4 border-b text-left">DNI</th>
                        <th className="py-2 px-4 border-b text-left">Grupo</th>
                        <th className="py-2 px-4 border-b text-left">Grado</th>
                        <th className="py-2 px-4 border-b text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student._id || index} className="hover:bg-gray-50 transition">
                          <td className="py-2 px-4 border-b">{student.firstName}</td>
                          <td className="py-2 px-4 border-b">{student.lastName}</td>
                          <td className="py-2 px-4 border-b">{student.dni || "No disponible"}</td>
                          <td className="py-2 px-4 border-b">{student.degree || "No disponible"}</td>
                          <td className="py-2 px-4 border-b">{student.yearsCompleted || "No disponible"}</td>
                          <td className="py-2 px-4 border-b">{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teacher;
