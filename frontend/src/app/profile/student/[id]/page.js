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
  const [birthDate, setBirthDate] = useState("2022-01-01");
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
      setBirthDate(data.metadata.birthDate || "");
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

  const handleLanguageChange = (index, event) => {
    const { name, value } = event.target;
    setLanguages((prevLanguages) => {
      const newLanguages = [...prevLanguages];
      newLanguages[index] = { ...newLanguages[index], [name]: value };
      return newLanguages;
    });
  };

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
          birthDate,
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

  return (
    <>
      {firstName == "" && lastName == "" ? (
        <ErrorPopUp
          message={"Debes completar tus datos básicos"}
          path={`/data_complete/student/${id}`}
        />
      ) : (
        <div
          className="flex items-center justify-evenly min-h-screen"
          style={{ backgroundColor: theme.palette.neutral.hex }}
        >
          <div className="w-full max-w-4xl ml-32 m-20 p-6 bg-white rounded-lg shadow-lg">
            <h2
              className="text-xl font-bold text-center pb-4"
              style={{
                color: theme.palette.primary.hex,
                fontFamily: "Montserrat",
              }}
            >
              Mi panel: {id}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 grid grid-cols-3"
            >
              {/* Sección de Información Personal */}
              <div className="m-8 space-y-3">
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: theme.palette.text.hex }}
                >
                  Información Personal
                </h2>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
                <input
                  type="date"
                  value={moment(birthDate).format("YYYY-MM-DD")}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="DNI"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="Grado"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
              </div>

              {/* Sección de Añadir Idiomas */}
              <div className="m-8 space-y-3">
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: theme.palette.text.hex }}
                >
                  Añadir Idiomas
                </h2>
                {languages.map((lang, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      name="language"
                      placeholder="Idioma"
                      value={lang.language}
                      onChange={(event) => handleLanguageChange(index, event)}
                      className="block w-full mt-1 p-2 border border-gray-300"
                      style={{
                        borderColor: theme.palette.light.hex,
                        color: theme.palette.text.hex,
                        fontFamily: "Montserrat, sans-serif",
                        borderRadius: theme.buttonRadios.m,
                      }}
                    />
                    <select
                      name="level"
                      value={lang.level}
                      onChange={(event) => handleLanguageChange(index, event)}
                      className="block w-full mt-2 p-2 border border-gray-300"
                      style={{
                        borderColor: theme.palette.light.hex,
                        color: theme.palette.text.hex,
                        fontFamily: "Montserrat, sans-serif",
                        borderRadius: theme.buttonRadios.m,
                      }}
                    >
                      <option value="low">Bajo</option>
                      <option value="medium">Medio</option>
                      <option value="high">Alto</option>
                    </select>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLanguage}
                  className="w-full px-4 py-2 text-white rounded-md transition duration-200"
                  style={{
                    backgroundColor: theme.palette.primary.hex,
                    borderRadius: theme.buttonRadios.m,
                    fontWeight: theme.fontWeight.bold,
                  }}
                >
                  Añadir idioma
                </button>
              </div>

              {/* Sección de Especialización */}
              <div className="m-8 space-y-3">
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: theme.palette.text.hex }}
                >
                  Especialización
                </h2>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Especialización"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
              </div>

              {/* Sección de Lenguajes de Programación */}
              <div className="m-8 space-y-3">
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: theme.palette.text.hex }}
                >
                  Habilidades
                </h2>
                <input
                  type="text"
                  value={programmingLanguages
                    .map((lang) => lang.language)
                    .join(", ")}
                  onChange={(e) => {
                    const newLanguages = e.target.value
                      .split(",")
                      .map((lang) => ({ language: lang.trim() }));
                    setProgrammingLanguages(newLanguages);
                  }}
                  placeholder="HTML , JS , PHP..."
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
              </div>

              {/* Sección de Certificaciones */}
              <div className="m-8 space-y-3">
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: theme.palette.text.hex }}
                >
                  Certificaciones
                </h2>
                <input
                  type="text"
                  value={certifications.join(", ")}
                  onChange={(e) =>
                    setCertifications(
                      e.target.value.split(",").map((cert) => cert.trim())
                    )
                  }
                  placeholder="Certificaciones"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
              </div>

              {/* Sección de Experiencia Laboral */}
              <div className="m-8 space-y-3">
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: theme.palette.text.hex }}
                >
                  Experiencia
                </h2>
                <input
                  type="text"
                  value={workExperience.join(", ")}
                  onChange={(e) =>
                    setWorkExperience(
                      e.target.value.split(",").map((exp) => exp.trim())
                    )
                  }
                  placeholder="Experiencia Laboral"
                  className="block w-full mt-1 p-2 border border-gray-300"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: theme.buttonRadios.m,
                  }}
                />
              </div>

              {/* Botón de Envío */}
              <div className="pt-8 pl-8 pb-8 space-y-6">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white rounded-md transition duration-200"
                  style={{
                    backgroundColor: theme.palette.primary.hex,
                    borderRadius: theme.buttonRadios.m,
                    fontWeight: theme.fontWeight.bold,
                  }}
                >
                  Actualizar
                </button>

                {/* Mensajes de error y éxito */}
                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-green-500 text-sm text-center mt-2">
                    Metadatos actualizados con éxito
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="w-full justify-end max-w-md p-8 bg-white rounded-lg shadow-lg mr-32">
            <h2
              className="text-2xl font-bold text-center pb-4 mb-6"
              style={{
                color: theme.palette.primary.hex,
                fontFamily: "Montserrat",
              }}
            >
              Información del Usuario
            </h2>
            <h3
              className="text-xl font-semibold mb-2 mt-2"
              style={{ color: theme.palette.text.hex }}
            >
              Idiomas
            </h3>
            <ul className="list-disc pl-5 m-6 ml-0">
              {languages.map((lang, index) => (
                <li style={{ color: theme.palette.light.hex }} key={index}>
                  {lang.language} : {getLangLevel(lang.level)}
                </li>
              ))}
            </ul>

            <h3
              className="text-xl font-semibold mb-2 mt-2"
              style={{ color: theme.palette.text.hex }}
            >
              Especialización
            </h3>
            <p style={{ color: theme.palette.light.hex }}>
              {specialization ? specialization : "Sin especialización"}
            </p>

            <h3
              className="text-xl font-semibold mb-2 mt-2"
              style={{ color: theme.palette.text.hex }}
            >
              Habilidades
            </h3>
            <p style={{ color: theme.palette.light.hex }}>
              {programmingLanguages.length > 0
                ? programmingLanguages.join(", ")
                : "Sin habilidades"}
            </p>

            <h3
              className="text-xl font-semibold mb-2 mt-2"
              style={{ color: theme.palette.text.hex }}
            >
              Certificaciones
            </h3>
            <p style={{ color: theme.palette.light.hex }}>
              {certifications.length > 0
                ? certifications.join(", ")
                : "Sin certificaciones"}
            </p>

            <h3
              className="text-xl font-semibold mb-2 mt-2"
              style={{ color: theme.palette.text.hex }}
            >
              Experiencia Laboral
            </h3>
            <p style={{ color: theme.palette.light.hex }}>
              {workExperience.length > 0
                ? workExperience.join(", ")
                : "Sin experiencia laboral"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
