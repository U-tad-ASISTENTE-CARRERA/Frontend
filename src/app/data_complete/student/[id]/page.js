"use client";

import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import LoadingModal from "@/components/LoadingModal";
import { nameRegex, dateRegex } from "@/utils/ValidatorRegex";
import ErrorPopUp from "@/components/ErrorPopUp";
import { FaLongArrowAltRight } from "react-icons/fa";

const StudentInitForm = () => {
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [degree, setDegree] = useState("INSO_DATA");
  const [gender, setGender] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [submitting, setSubmitting] = useState(false);
  // const [metadataError, setMetadataError] = useState(false);

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

        // Comprobar si la metadata está completa
        if (data.metadata && Object.keys(data.metadata).length > 0) {

          // setMetadataError(true);

          router.push(`/profile/${JSON.parse(localStorage.getItem("user")).role == "STUDENT"
            ? "student"
            : "teacher"
            }/${id}`);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };

    if (JSON.parse(localStorage.getItem("user")).role == "TEACHER") {
      router.push(`/data_complete/teacher/${id}`);
    } else {
      fetchData();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const today = new Date().toISOString().split("T")[0];

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
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== undefined)) {
      return;
    }

    setSubmitting(true);

    const requestBody = {
      firstName,
      lastName,
      gender,
      endDate,
      degree: "INSO_DATA",
    };

    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setSubmitting(false);

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido.",
          INVALID_USER_ID: "El usuario no existe.",
          INTERNAL_SERVER_ERROR:
            "Error interno del servidor. Inténtalo más tarde.",
        };
        setErrors({
          general:
            errorMessages[data?.error] || "Error al actualizar los metadatos.",
        });
        return;
      }

      localStorage.setItem("metadata", JSON.stringify(data.updatedFields));
      router.push(`/roadmap_guide/${id}`);
    } catch (error) {
      setSubmitting(false);
      setErrors({ general: "Ha ocurrido un error inesperado." });
    }
  };

  if (loading) {
    return <LoadingModal />;
  }

  // if (metadataError) {
  //   return (
  //     <ErrorPopUp
  //       message={"No tienes acceso a esta página"}
  //       path={`/profile/${JSON.parse(localStorage.getItem("user")).role == "STUDENT"
  //         ? "student"
  //         : "teacher"
  //         }/${id}`}
  //     />
  //   );
  // }

  return (
    <div
      className="flex flex-col items-center min-h-screen"
    >
      {/* Título */}
      <h1
        className="text-2xl font-bold text-center pt-20"
        style={{ color: theme.palette.primary.hex }}
      >
        ¡Queremos saber más de ti!
      </h1>

      {/* Formulario */}
      <div className="w-50% max-w-4xl bg-white p-16 mt-12 shadow-md flex justify-center" style={{borderRadius: theme.buttonRadios.xl}}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
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


          {/* Botón de enviar */}
          <div className="col-span-1 md:col-span-2 flex flex-col justify-left space-y-4 mt-5">
            <button
              type="submit"
              className="flex items-center justify-center w-64 px-6 py-3 text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.primary.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.semibold,
              }}
              disabled={submitting}
            >
              Comenzar test
              <FaLongArrowAltRight className="ml-4" />
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
