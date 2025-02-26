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
    setActiveSection(info);
  };

  return (
    <>
      {firstName === "" || lastName === "" ? (
        <ErrorPopUp
          message={"Debes completar tus datos básicos"}
          path={`/data_complete/teacher/${id}`}
        />
      ) : (
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
                onClick={() => handleInformation("personal")}
              >
                Información Personal
              </button>

              <button
                className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
                style={{ color: theme.palette.text.hex }}
                onClick={() => handleInformation("languages")}
              >
                Idiomas
              </button>

              <button
                className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
                style={{ color: theme.palette.text.hex }}
                onClick={() => handleInformation("programming")}
              >
                Lenguajes de Programación
              </button>

              <button
                className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
                style={{ color: theme.palette.text.hex }}
                onClick={() => handleInformation("certifications")}
              >
                Certificaciones
              </button>

              <button
                className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
                style={{ color: theme.palette.text.hex }}
                onClick={() => handleInformation("academic")}
              >
                Expediente Académico
              </button>

              <button
                className="block w-full text-center mb-6 text-white py-1 px-2 hover:bg-slate-300 rounded font-semibold"
                style={{ color: theme.palette.text.hex }}
                onClick={() => handleInformation("employee")}
              >
                Experiencias Laborales
              </button>
            </div>

            {/* Información variable */}
            <div className="bg-gray-200 p-2 mt-2 shadow-md col-span-4">
              {/* Sección de Información Personal */}
              {activeSection === "personal" && (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <h2
                      className="text-lg font-semibold mb-1"
                      style={{ color: theme.palette.text.hex }}
                    >
                      Información Personal
                    </h2>
                    <input
                      type="text"
                      name="firstName"
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
                  </div>
                  <div>
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="lastName"
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
                  </div>
                  <div>
                    <label>DNI</label>
                    <input
                      type="text"
                      name="dni"
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
                  </div>
                  <div>
                    <label>Grado</label>
                    <input
                      disabled
                      type="text"
                      name="degree"
                      value={"INSO+DATA"}
                      onChange={() => {}}
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
                  <button type="submit">Guardar</button>
                </form>
              )}
              {/* Sección de Idiomas */}
              {activeSection === "languages" && (
                <form onSubmit={handleSubmit}>
                  {languages.map((lang, index) => (
                    <div key={index} className="mb-4">
                      <label>Idioma</label>
                      <input
                        type="text"
                        name={`language-${index}`}
                        value={lang.language}
                        onChange={(e) => {
                          const newLanguages = [...languages];
                          newLanguages[index].language = e.target.value;
                          setLanguages(newLanguages);
                        }}
                        className="block w-full mt-1 p-2 border border-gray-300"
                        style={{
                          borderColor: theme.palette.light.hex,
                          color: theme.palette.text.hex,
                          fontFamily: "Montserrat, sans-serif",
                          borderRadius: theme.buttonRadios.m,
                        }}
                      />
                      <label>Nivel</label>
                      <select
                        name={`level-${index}`}
                        value={lang.level}
                        onChange={(e) => {
                          const newLanguages = [...languages];
                          newLanguages[index].level = e.target.value;
                          setLanguages(newLanguages);
                        }}
                        className="block w-full mt-2 p-2 border border-gray-300"
                        style={{
                          borderColor: theme.palette.light.hex,
                          color: theme.palette.text.hex,
                          fontFamily: "Montserrat, sans-serif",
                          borderRadius: theme.buttonRadios.m,
                        }}
                      >
                        <option value="low">Básico</option>
                        <option value="medium">Intermedio</option>
                        <option value="high">Avanzado</option>
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
                    Añadir Idioma
                  </button>
                  <button type="submit">Guardar</button>
                </form>
              )}
              {/* Sección de Lenguajes de Programación */}
              {activeSection === "programming" && (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
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
                  <button type="submit">Guardar</button>
                </form>
              )}
              {/* Sección de Certificaciones */}
              {activeSection === "certifications" && (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
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
                  <button type="submit">Guardar</button>
                </form>
              )}
              {/* Sección de Expediente Académico */}
              {activeSection === "academic" && (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
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
                  <button type="submit">Guardar</button>
                </form>
              )}
              {/* Sección de Experiencia Laboral */}
              {activeSection === "employee" && (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
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
                  <button type="submit">Guardar</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
