"use client";

import React, { useState, useEffect, use } from "react";
import { theme } from "../../../constants/theme";
import "@fontsource/montserrat";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const StudentTest = () => {
  const [user, setUser] = useState({});
  const [languages, setLanguages] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [degree, setDegree] = useState("");
  const [gender, setGender] = useState("");
  const [institution, setInstitution] = useState("");
  const [endDate, setEndDate] = useState("2022-01-01");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).role == "TEACHER") {
      router.push(`/data_complete/teacher/${id}`);
    }
  });

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

    if (!dateRegex(endDate)) {
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
          endDate,
          dni,
          degree,
          languages,
          gender,
          institution,
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
      router.push(`/roadmap_guide/${id}`);
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
          <form onSubmit={handleSubmit} className=" space-y-6 grid grid-cols-2">
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
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nombre"
                className="block w-full mt-1 p-2 border"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />

              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido"
                className="block w-full mt-1 p-2 border"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />

              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="block w-full mt-1 p-2 border"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              >
                <option value="" disabled>
                  Género
                </option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="prefer not to say">Prefiero no decirlo</option>
              </select>

              <input
                type="text"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
                className="block w-full mt-1 p-2 border"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />

              <select
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="block w-full mt-1 p-2 border"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              >
                <option value="" disabled>
                  Grado
                </option>
                <option value="MAIS">MAIS</option>
                <option value="FIIS">FIIS</option>
                <option value="INSO_GAME">INSO+VIDEOJUEGOS</option>
                <option value="INSO_CYBER">INSO+CYBER</option>
                <option value="INSO_DATA">INSO+DATA</option>
              </select>

              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institución Educativa"
                className="block w-full mt-1 p-2 border"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />

              <label className="block text-sm font-medium text-gray-700">
                Fecha de graduación
              </label>
              <input
                type="date"
                required
                value={moment({ endDate }).format("YYYY-MM-DD")}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full mt-1 p-2 border"
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
                    className="block w-full mt-1 p-2 border"
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
                    className="block w-full mt-2 p-2 border"
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
                Enviar y comenzar test
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
