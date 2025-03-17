"use client";

import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import LoadingModal from "@/components/LoadingModal";
import { nameRegex, dateRegex } from "@/utils/ValidatorRegex";

const StudentInitForm = () => {
  const [errors, setErrors] = useState({});
  const [languages, setLanguages] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [degree, setDegree] = useState(""); // Por defecto a INSO_DATA
  const [gender, setGender] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/metadata", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          setError("Error en obteniendo los metadatos");
        }
        const data = await response.json();
        if (data.metadata) {
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (JSON.parse(localStorage.getItem("user")).role == "TEACHER") {
      router.push(`/data_complete/teacher/${id}`);
    } else {
      fetchData();
    }
  }, []);

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


  // TODO: ARREGLAR ESTA FUNCIÓN PARA QUE ESTÉ COMPLETA
  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      firstName.trim() &&
      lastName.trim() &&
      gender.trim() &&
      !errors.endDate
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const today = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD

    const newErrors = {
      firstName: !firstName?.trim()
        ? "El nombre es obligatorio."
        : !nameRegex(firstName)
          ? "Solo se permiten caracteres latinos en el nombre."
          : undefined,

      lastName: !lastName.trim()
        ? "El apellido es obligatorio."
        : !nameRegex(lastName)
          ? "Solo se permiten caracteres latinos en el apellido."
          : undefined,

      gender: !gender ? "El género es obligatorio." : undefined,

      endDate: !dateRegex(endDate)
        ? "Formato inválido."
        : endDate < today
          ? "La fecha de graduación no puede ser anterior a hoy."
          : undefined,

      general: languages.some((lang) => !nameRegex(lang.language))
        ? "Uno o más idiomas tienen caracteres inválidos."
        : undefined,

      ...languages.reduce((acc, lang, index) => {
        if (!nameRegex(lang.language)) {
          acc[`language-${index}`] = "Solo se permiten caracteres latinos.";
        }
        return acc;
      }, {}),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== undefined)) {
      return; // 🚫 Detiene el envío si hay errores
    }

    setSubmitting(true);

    const requestBody = {
      firstName,
      lastName,
      gender,
      endDate,
      degree: "INSO_DATA",
      languages,
    };

    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody), // ✅ Se eliminó la duplicación de `body`
      });

      const data = await response.json();
      setSubmitting(false);

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido.",
          INVALID_USER_ID: "El usuario no existe.",
          INTERNAL_SERVER_ERROR: "Error interno del servidor. Inténtalo más tarde.",
        };
        setErrors({ general: errorMessages[data?.error] || "Error al actualizar los metadatos." });
        return;
      }

      localStorage.setItem("metadata", JSON.stringify(data.updatedFields));
      router.push(`/roadmap_guide/${id}`); // ✅ Se ejecuta solo una vez

    } catch (error) {
      setSubmitting(false);
      setErrors({ general: "Ha ocurrido un error inesperado." });
    }
  };


  const removeLanguage = (index) => {
    setLanguages((prevLanguages) =>
      prevLanguages.filter((_, i) => i !== index)
    );
  };

  if (loading) {
    return <LoadingModal message="Cargando..." />;
  }

  return (
    <div
      className="flex flex-col items-center min-h-screen px-6 py-10"
      style={{
        fontFamily: "Montserrat",
      }}
    >
      {/* Título */}
      <h1
        className="text-3xl font-bold text-center pt-10 pb-6"
        style={{ color: theme.palette.primary.hex }}
      >
        ¡Queremos saber más de ti!
      </h1>

      {/* Formulario */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Sección Información Personal */}
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: theme.palette.text.hex }}
            >
              Información personal
            </h2>

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
              className="block w-full p-2 border rounded-md"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
              }}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido"
              className="block w-full p-2 border rounded-md"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
              }}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full p-2 border rounded-md"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
              }}
            >
              <option value="" disabled>
                Género
              </option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="prefer not to say">Prefiero no decirlo</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Grado
            </label>
            <select
              disabled
              required
              value={"INSO_DATA"}
              onChange={() => { }}
              className="block w-full p-2 border rounded-md"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
              }}
            >
              <option value="" disabled>
                Grado
              </option>
              <option value="INSO+DATA">INSO-DATA</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Fecha de graduación
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min="today"
              className="block w-full p-2 border rounded-md"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
              }}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
          </div>

          {/* Sección de Añadir Idiomas */}
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: theme.palette.text.hex }}
            >
              Añadir idiomas
            </h2>

            {languages.map((lang, index) => (
              <div key={index} className="space-y-2">
                {/* Campo de idioma */}
                <input
                  type="text"
                  name="language"
                  placeholder="Idioma"
                  value={lang.language}
                  onChange={(event) => handleLanguageChange(index, event)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                  }}
                />

                {/* Contenedor para el desplegable y el botón de eliminar */}
                <div className="flex items-center gap-3">
                  {/* Selección de nivel */}
                  <select
                    name="level"
                    value={lang.level}
                    onChange={(event) => handleLanguageChange(index, event)}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: theme.palette.light.hex,
                      color: theme.palette.text.hex,
                    }}
                  >
                    <option value="low">Bajo</option>
                    <option value="medium">Medio</option>
                    <option value="high">Alto</option>
                  </select>

                  {/* Botón de eliminar pequeño */}
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="px-3 py-2 text-sm text-white rounded-md transition duration-200"
                    style={{
                      backgroundColor: theme.palette.error.hex,
                      borderRadius: theme.buttonRadios.s,
                      fontWeight: theme.fontWeight.bold,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Botón para añadir nuevos idiomas */}
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
            {languages.map(
              (_, index) =>
                errors[`language-${index}`] && (
                  <p
                    key={`error-lang-${index}`}
                    className="text-red-500 text-sm"
                  >
                    {errors[`language-${index}`]}
                  </p>
                )
            )}
          </div>

          {/* Botón de enviar */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center space-y-4">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.primary.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.bold,
              }}
              disabled={submitting}
            >
              Enviar y comenzar test
            </button>

            {/* Mensajes de error y éxito */}
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentInitForm;
