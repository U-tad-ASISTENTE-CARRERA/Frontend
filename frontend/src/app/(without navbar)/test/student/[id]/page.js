"use client";

import React, { useState, useEffect } from "react";
import { theme } from "../../../../constants/theme";
import "@fontsource/montserrat";
import moment from "moment";
import { useRouter } from "next/navigation";

const StudentTest = ({ params }) => {
  const { id } = React.use(params);
  const [user, setUser] = useState({});
  const [languages, setLanguages] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("2022-01-01");
  const [dni, setDni] = useState("");
  const [degree, setDegree] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLanguageChange = (index, event) => {
    const { name, value } = event.target;
    setLanguages((prevLanguages) => {
      const newLanguages = [...prevLanguages];
      newLanguages[index] = { ...newLanguages[index], [name]: value };
      return newLanguages;
    });
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
      }
      setSuccess(true);
      router.push(`/home/${id}`);
    } catch (error) {
      console.error(error);
      setError("Ha ocurrido un error inesperado");
    }
  };

  return (
    <>
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{ backgroundColor: theme.palette.neutral.hex }}
      >
        <h1
          className="text-4xl font-bold text-center pb-4"
          style={{
            color: theme.palette.primary.hex,
            fontFamily: "Montserrat",
          }}
        >
          ¡ Queremos saber más de tí !
        </h1>
        <div className="w-full max-w-4xl mt-10 p-6 bg-white rounded-lg shadow-xl transition-transform transform hover:-translate-y-2 hover:opacity-80 duration-300">
          <form onSubmit={handleSubmit} className=" space-y-6 grid grid-cols-3">
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
            <div className="pt-8 pl-8 space-y-6">
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
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm text-center mt-2">
                  Bienvenido al GPS Académico de U-tad
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentTest;
