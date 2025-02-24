"use client";

import React, { useState, useEffect } from "react";
import { theme } from "../../../constants/theme";
import "@fontsource/montserrat";
import moment from "moment";
import ProfileCompletionModal from "../../../components/ProfileCompletionModal";
import {
  useRouter,
  useSearchParams,
  useParams,
  redirect,
} from "next/navigation";
import ErrorPopUp from "../../../components/ErrorPopUp";

const Profile = ({ params }) => {
  const { id } = React.use(params);
  const [user, setUser] = useState({});
  const [languages, setLanguages] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [firstName, setFirstName] = useState("");
  const searchParams = useSearchParams();
  const [lastName, setLastName] = useState("");

  //const [birthDate, setBirthDate] = useState("2022-01-01");

  const [dni, setDni] = useState("");
  const [degree, setDegree] = useState("");
  const [programmingLanguages, setProgrammingLanguages] = useState([
    { language: "" },
  ]);
  const [certifications, setCertifications] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("personal");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error en obteniendo los metadatos");
      }
      const data = await response.json();
      setFirstName(data.metadata.firstName || "");
      setLastName(data.metadata.lastName || "");

      // setBirthDate(data.metadata.birthDate || "");

      setDni(data.metadata.dni || "");
      setDegree(data.metadata.degree || "");
      setLanguages(data.metadata.languages || []);
      setSpecialization(data.metadata.specialization || "Sin especialización");
      setProgrammingLanguages(data.metadata.programmingLanguages || []);
      setCertifications(data.metadata.certifications || []);
      setWorkExperience(data.metadata.workExperience || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLangLevel = (level) => {
    switch (level) {
      case "low":
        return "Básico";
      case "medium":
        return "Intermedio";
      case "high":
        return "Avanzado";
      default:
        return level;
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "low" }]);
  };

  const dniRegex = (dni) => {
    const dniPattern = /^\d{8}[A-Z]$/;
    return dniPattern.test(dni);
  };

  const dateRegex = (dateString) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return (
      datePattern.test(dateString) && !isNaN(new Date(dateString).getTime())
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dniRegex(dni)) {
      setError(
        "El DNI debe tener el formato correcto (8 dígitos seguidos de una letra)."
      );
      return;
    }

    if (!dateRegex(birthDate)) {
      setError("La fecha de nacimiento debe estar en el formato YYYY-MM-DD.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          // birthDate,
          dni,
          degree,
          languages,
          specialization,
          programmingLanguages,
          certifications,
          workExperience,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };

        setError(
          errorMessages[data?.error] || "Error al actualizar los metadatos"
        );
        return;
      }
      setSuccess(true);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError("Ha ocurrido un error inesperado");
    }
  };

  /* Función que permite cambier el estado de la información que queremos mostrar por pantallas*/
  const handleInformation = (info) => {
    setActiveSection();
  };

  return (
    <>
      <div
        className="flex items-center justify-evenly min-h-screen"
        style={{ backgroundColor: theme.palette.neutral.hex }}
      >
        <div className="w-full max-w-8xl ml-32 m-20 p-6 bg-white rounded-lg shadow-lg grid grid-cols-5 gap-3">
          {/* Botones para cambiar la información */}
          <div className="bg-gray-200 p-2 mt-2 shadow-md grid grid-cols-1">
            <button
              className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
              style={{ color: theme.palette.text.hex }}
              onClick={handleInformation("personal")}
            >
              Información Personal
            </button>

            <button
              className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
              style={{ color: theme.palette.text.hex }}
              onClick={handleInformation("languages")}
            >
              Idiomas
            </button>

            <button
              className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
              style={{ color: theme.palette.text.hex }}
              onClick={handleInformation("programming")}
            >
              Lenguajes de Programación
            </button>

            <button
              className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
              style={{ color: theme.palette.text.hex }}
              onClick={handleInformation("certifications")}
            >
              Certificaciones
            </button>

            <button
              className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
              style={{ color: theme.palette.text.hex }}
              onClick={handleInformation("academic")}
            >
              Expediente Académico
            </button>

            <button
              className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
              style={{ color: theme.palette.text.hex }}
              onClick={handleInformation("employee")}
            >
              Experiencias Laborales
            </button>
          </div>

          {/* Información variable */}
          <div className="bg-gray-200 p-2 mt-2 shadow-md col-span-4">
            {section.personal && (
              <div>
                <p>prueba personal</p>
              </div>
            )}
            {section.programming && (
              <div>
                <p>prueba programming</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
