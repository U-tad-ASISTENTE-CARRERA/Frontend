"use client";

import React, { useState, useEffect } from "react";
import { theme } from "../../../constants/theme";
import "@fontsource/montserrat";
import "../../../globals.css";
import { setRequestMeta } from "next/dist/server/request-meta";

const Profile = ({ params }) => {
  const { id } = React.use(params);
  const [user, setUser] = useState({});
  const [languages, setLanguages] = useState([{ language: "", level: "" }]);
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
          throw new Error("Error en obteniendo los metadatos");
        }
        const data = await response.json();
        setLanguages(data.metadata.languages);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLanguageChange = (index, event) => {
    const newLanguages = [...languages];
    newLanguages[index][event.target.name] = event.target.value;
    setLanguages(newLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "" }]);
  };

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(user);
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          languages: languages,
          specialization: specialization,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los metadatos");
      }
      const data = await response.json();
      console.log(data);
      setSuccess(true);
      setError("");
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-evenly min-h-screen"
        style={{ backgroundColor: theme.palette.neutral.hex }}
      >
        <div className="w-full max-w-md ml-32 p-8 bg-white rounded-lg shadow-lg">
          <h2
            className="text-2xl font-bold text-center pb-8"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            Mi panel: {id}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: theme.palette.text.hex }}
            >
              Añadir idiomas
            </h2>
            {languages.map((lang, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="language"
                  placeholder="Language"
                  value={lang.language}
                  onChange={(event) => handleLanguageChange(index, event)}
                  className="block w-full mt-1 p-3 border border-gray-300"
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
                  className="block w-full mt-2 p-3 border border-gray-300"
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
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = theme.palette.dark.hex)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  theme.palette.primary.hex)
              }
            >
              Añadir idioma
            </button>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: theme.palette.text.hex }}
            >
              Especialiazación
            </h2>
            <input
              type="text"
              value={specialization}
              onChange={handleSpecializationChange}
              placeholder="Especialización"
              className="block w-full mt-1 p-3 border border-gray-300"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
                fontFamily: "Montserrat, sans-serif",
                borderRadius: theme.buttonRadios.m,
              }}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.primary.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.bold,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = theme.palette.dark.hex)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  theme.palette.primary.hex)
              }
            >
              Actualizar
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center">
                Metadatos actualizados con éxito
              </p>
            )}
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
            className="text-xl font-semibold mb-2"
            style={{ color: theme.palette.text.hex }}
          >
            Idiomas
          </h3>
          <ul className="list-disc pl-5 m-6 ml-0">
            {languages.map((lang, index) => (
              <li style={{ color: theme.palette.light.hex }} key={index}>
                {lang.language} - {lang.level}
              </li>
            ))}
          </ul>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: theme.palette.text.hex }}
          >
            Especialización
          </h3>
          <p style={{ color: theme.palette.light.hex }}>
            {user.specialization ? user.specialization : "Sin especialización"}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
