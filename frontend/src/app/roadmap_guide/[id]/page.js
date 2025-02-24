"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "../../constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "../../components/ErrorPopUp";

const RoadmapGuide = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("user")) &&
      localStorage.getItem("token")
    ) {
      setUser(JSON.parse(localStorage.getItem("user")));
      console.log(user, "Usuario: ");
      if (user.role === "TEACHER") {
        return (
          <ErrorPopUp
            message={"No tienes acceso a esta página."}
            path={`/home/${params.id}`}
          />
        );
      } else {
        //Asignamos de momento solo la especialización de Analista de datos.
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido",
          INVALID_USER_ID: "El usuario no existe",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };

        try {
          fetch("http://localhost:3000/metadata", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ specialization: "Analista de datos" }),
          })
            .then((response) => {
              if (response.ok) {
                setSuccess("Especialización actualizada correctamente.");
                router.push(`/home/${params.id}`);
              } else {
                setError(
                  errorMessages[error] ||
                    "Error al actualizar la especialización."
                );
              }
            })
            .catch((error) => {
              setError(
                errorMessages[error] ||
                  "Error al actualizar la especialización."
              );
            });
        } catch (error) {
          setError(
            errorMessages[error] || "Error al actualizar la especialización."
          );
        }
      }
    } else {
      return (
        <ErrorPopUp
          message={"Debes iniciar sesión para ver esta página."}
          path={`/login`}
        />
      );
    }
  }, [params.id, user]);

  const questions = [
    "¿Cuánto te apasiona trabajar con datos y descubrir patrones ocultos?",
    "¿Cuánta experiencia o conocimientos tienes en programación (especialmente Python o R)?",
    "¿Cómo de bien te sientes con las matemáticas y la estadística?",
    "¿Cuánto has trabajado con herramientas de análisis de datos como Excel, SQL o Tableau?",
    "¿Cómo de cómodo te sientes aprendiendo conceptos nuevos y complejos de manera autodidacta?",
  ];

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    console.log("Respuestas actualizadas:", newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Todas las preguntas han sido respondidas:", answers);
  };

  return (
    <div
      className="flex flex-col items-center justify-start pt-24 min-h-screen"
      style={{ backgroundColor: theme.palette.neutral.hex }}
    >
      <h1
        className="text-2xl m-24 font-bold text-center"
        style={{
          color: theme.palette.primary.hex,
          fontFamily: "Montserrat",
        }}
      >
        Podemos sugerirte una ruta de aprendizaje
      </h1>
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2
          className="text-2xl font-bold text-center pb-8"
          style={{
            color: theme.palette.primary.hex,
            fontFamily: "Montserrat",
          }}
        >
          ¡Responde sin miedo!
        </h2>
        {currentQuestion < questions.length ? (
          <div className="space-y-6">
            <p
              className="text-center"
              style={{
                color: theme.palette.text.hex,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {questions[currentQuestion]}
            </p>
            <input
              type="range"
              min="0"
              max="5"
              value={answers[currentQuestion] || 0}
              onChange={(e) => handleAnswer(parseInt(e.target.value))}
              className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
                fontFamily: "Montserrat, sans-serif",
                borderRadius: theme.buttonRadios.m,
              }}
            />
            <span
              className="block font-bold text-center"
              style={{
                color: theme.palette.primary.hex,
                fontSize: "25px",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {answers[currentQuestion] || 0}
            </span>
          </div>
        ) : (
          <p
            className="text-center"
            style={{
              color: theme.palette.success.hex,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            ¡Gracias por completar el test!
          </p>
        )}
        <div className="flex justify-evenly mt-6">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Anterior
            </button>
          )}
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Enviar
            </button>
          )}
          {error && (
            <p
              style={{
                color: theme.palette.error.hex,
                fontFamily: "Montserrat, sans-serif",
              }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              style={{
                color: theme.palette.success.hex,
                fontFamily: "Montserrat, sans-serif",
              }}
              className="text-green-500 text-sm text-center"
            >
              ¡Gracias por completar el test!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapGuide;
