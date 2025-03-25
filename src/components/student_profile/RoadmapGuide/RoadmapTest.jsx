"use client";

import React, { useState } from "react";
import { theme } from "@constants/theme";
import "@fontsource/montserrat";

const RoadmapTest = ({
  onSubmit,
  onSpecializationChange,
  initialSpecialization = "",
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [recommendedSpecialization, setRecommendedSpecialization] =
    useState("");
  const [specialization, setSpecialization] = useState(initialSpecialization);

  const questions = [
    "¿Cuánto te apasiona trabajar con datos y descubrir patrones ocultos?",
    "¿Cuánta experiencia o conocimientos tienes en programación (especialmente Python o R)?",
    "¿Cómo de bien te sientes con las matemáticas y la estadística?",
    "¿Cuánto has trabajado con herramientas de análisis de datos como Excel, SQL o Tableau?",
    "¿Cómo de cómodo te sientes aprendiendo conceptos nuevos y complejos de manera autodidacta?",
  ];

  const calculateSpecialization = (answers) => {
    const total = answers.reduce((acc, val) => acc + val, 0);
    if (total >= 15) return "Artificial Intelligence";
    if (total >= 10) return "Data Analyst";
    if (total >= 5) return "Backend Development";
    return "Frontend Developer";
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
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
    const recommended = calculateSpecialization(answers);
    setRecommendedSpecialization(recommended);
    setSpecialization(recommended);
    setShowSpecializationModal(true);
  };

  const confirmSpecialization = () => {
    setShowSpecializationModal(false);
    onSubmit(specialization);
    if (onSpecializationChange) {
      onSpecializationChange(specialization);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen"
      style={{
        fontFamily: "Montserrat",
      }}
    >
      <h1
        className="text-3xl m-24 font-bold text-center"
        style={{
          color: theme.palette.primary.hex,
          fontFamily: "Montserrat",
        }}
      >
        Test para ruta de aprendizaje
      </h1>
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2
          className="text-2xl font-bold text-center pb-8"
          style={{
            color: theme.palette.primary.hex,
            fontFamily: "Montserrat",
          }}
        >
          Responde para recibir recomendaciones
        </h2>
        {currentQuestion < questions.length && (
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
              className="block w-full mt-1 p-3 border border-gray-300 rounded-md"
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
        </div>
      </div>

      {showSpecializationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Especialización Recomendada
            </h2>
            <p className="mb-4">
              Tu especialización recomendada es:{" "}
              <strong style={{ color: theme.palette.primary.hex }}>
                {recommendedSpecialization}
              </strong>
            </p>
            <div className="mb-4">
              <label className="block mb-2">
                ¿Quieres cambiar tu especialización?
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="block w-full p-4 pl-2 pr-4 ml-0 m-8"
                style={{ borderRadius: theme.buttonRadios.m }}
              >
                <option value="Frontend Developer">Frontend</option>
                <option value="Backend Development">Backend</option>
                <option value="Artificial Intelligence">AI</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>
            <div className="flex justify-left">
              <button
                onClick={confirmSpecialization}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapTest;
