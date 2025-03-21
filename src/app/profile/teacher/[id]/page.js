"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import LoadingModal from "@/components/LoadingModal";
import { FaDownload } from "react-icons/fa";

const Teacher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentsError, setStudentsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      const metadata = data.metadata || {};

      setShowModal(Object.keys(metadata).length === 0);

      setFirstName(metadata.firstName);
      setLastName(metadata.lastName);
      setGender(metadata.gender);
      setSpecialization(metadata.specialization);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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

      setStudents(data.message === "No students found" ? [] : data);
    } catch (error) {
      setStudentsError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, [token, id]);

  const getWelcomeMessage = () => {
    if (gender === "male") return "Bienvenido";
    if (gender === "female") return "Bienvenida";
    return "Bienvenid@";
  };

  const handleDownloadReport = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3000/student/report/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el informe");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `reporte_estudiante_${studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar el informe:", error);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isLoading && <LoadingModal message="Cargando perfil..." />}

      {!isLoading && showModal && (
        <ErrorPopUp message={"Debes completar tus datos básicos"} path={`/data_complete/teacher/${id}`} />
      )}

      {!isLoading && !showModal && (
        <div className="flex flex-col items-center min-h-screen p-6">
          <h1 className="text-3xl font-bold text-center pt-20 pb-10" style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}>
            {getWelcomeMessage()} {firstName || "Usuario"}
          </h1>

          <div className="w-full max-w-6xl flex flex-col items-start pt-6 leading-relaxed">
            
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.palette.dark.hex }}>
              Detalles del perfil
            </h2>
            <p style={{ color: theme.palette.text.hex }}><strong>Nombre:</strong> {firstName}</p>
            <p style={{ color: theme.palette.text.hex }}><strong>Apellidos:</strong> {lastName}</p>
            <p style={{ color: theme.palette.text.hex }}><strong>Género:</strong> {gender ? (gender === "male" ? "Masculino" : gender === "female" ? "Femenino" : "Prefiero no decirlo") : "SIN COMPLETAR"}</p>
            <p style={{ color: theme.palette.text.hex }}><strong>Especialización:</strong> {specialization || "No especificado"}</p>
            
            <h2 className="text-xl font-semibold mt-10" style={{ color: theme.palette.dark.hex }}>
              Alumnos tutelados
            </h2>

            <div className="mt-4 w-full flex items-center">
              <input
                type="text"
                placeholder="Buscar alumno por nombre o apellido..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 mt-6 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellidos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descargar informe</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id || index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{student.firstName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.lastName}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{student.degree || "No disponible"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.yearsCompleted || "No disponible"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <FaDownload className="text-blue-500 cursor-pointer" title="Descargar informe" onClick={() => handleDownloadReport(student._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teacher;
