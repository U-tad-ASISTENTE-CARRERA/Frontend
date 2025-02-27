"use client";

import React, { useState, useEffect, use } from "react";
import { theme } from "../../../constants/theme";
import "@fontsource/montserrat";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const StudentInitForm = () => {
  const [user, setUser] = useState({});
  const [languages, setLanguages] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [degree, setDegree] = useState("");
  const [gender, setGender] = useState("");
  const [endDate, setEndDate] = useState("2022-01-01");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

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
      setFirstName(data.metadata.firstName || "");
      setLastName(data.metadata.lastName || "");
      setDni(data.metadata.dni || "");
      setDegree(data.metadata.degree || "");
      setGender(data.metadata.gender || "");
      setLanguages(data.metadata.languages || []);
      setEndDate(data.metadata.endDate || "2022-01-01");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
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
          degree: "INSO_DATA",
          languages,
          gender
        }),
      });

      const data = await response.json();
      console.log(data);
      setError("");
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

  const removeLanguage = (index) => {
    setLanguages((prevLanguages) => prevLanguages.filter((_, i) => i !== index));
  };


  return (
    <div
      className="flex flex-col items-center min-h-screen px-6 py-10"
      style={{ backgroundColor: theme.palette.neutral.hex, fontFamily: "Montserrat" }}
    >
      {/* Título */}
      <h1 className="text-3xl font-bold text-center pt-10 pb-6" style={{ color: theme.palette.primary.hex }}>
        ¡Queremos saber más de ti!
      </h1>

      {/* Formulario */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Sección Información Personal */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>Información personal</h2>

            <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
              className="block w-full p-2 border rounded-md"
              style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
            />

            <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido"
              className="block w-full p-2 border rounded-md"
              style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
            />

            <select required value={gender} onChange={(e) => setGender(e.target.value)}
              className="block w-full p-2 border rounded-md"
              style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
            >
              <option value="" disabled>Género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="prefer not to say">Prefiero no decirlo</option>
            </select>

            <input type="text" required value={dni} onChange={(e) => setDni(e.target.value)}
              placeholder="DNI"
              className="block w-full p-2 border rounded-md"
              style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
            />

            <label className="block text-sm font-medium text-gray-700">Grado</label>
            <select disabled required value={"INSO_DATA"} onChange={() => { }}
              className="block w-full p-2 border rounded-md"
              style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
            >
              <option value="" disabled>Grado</option>
              <option value="INSO+DATA">INSO-DATA</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Fecha de graduación</label>
            <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)}
              min="1900-01-01"
              className="block w-full p-2 border rounded-md"
              style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
            />
          </div>

          {/* Sección de Añadir Idiomas */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
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
                  style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
                />

                {/* Contenedor para el desplegable y el botón de eliminar */}
                <div className="flex items-center gap-3">
                  {/* Selección de nivel */}
                  <select
                    name="level"
                    value={lang.level}
                    onChange={(event) => handleLanguageChange(index, event)}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
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
          </div>



          {/* Botón de enviar */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center space-y-4">
            <button type="submit"
              className="w-full md:w-auto px-6 py-3 text-white rounded-md transition duration-200"
              style={{ backgroundColor: theme.palette.primary.hex, borderRadius: theme.buttonRadios.m, fontWeight: theme.fontWeight.bold }}
            >
              Enviar y comenzar test
            </button>

            {/* Mensajes de error y éxito */}
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mt-2">Bienvenido al GPS Académico de U-tad</p>}
          </div>

        </form>
      </div>
    </div>
  );

};

export default StudentInitForm;
