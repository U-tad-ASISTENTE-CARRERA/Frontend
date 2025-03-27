"use client";

import React, { useState } from "react";
import Image from "next/image";
import { theme } from "@/constants/theme";
import Resource from "@/components/Roadmap/Resource";
import { MdClose } from "react-icons/md";

const Task = ({ taskName, taskData, sectionName, updateProgress }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsDone = async () => {
    const response = await fetch("http://localhost:3000/userRoadmap", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        sectionName,
        topicName: taskName,
        newStatus: "done",
      }),
    });
    if (updateProgress) updateProgress();
    window.location.reload();
  };

  const toggleTask = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card clickable */}
      <div
        onClick={toggleTask}
        className="cursor-pointer w-24 h-24 bg-white rounded-2xl shadow-md border border-gray-200 flex items-center justify-center transition hover:shadow-lg"
      >
        <Image
          src={
            taskData.status === "doing"
              ? `/icons/${taskData.skill}.png`
              : `/si.png`
          }
          alt={taskName}
          width={50}
          height={50}
        />
      </div>

      {/* Panel expandible */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          } w-full`}
      >
        <div className="relative bg-white p-6 mt-4 rounded-xl shadow-lg border border-gray-200">
          {/* Close button */}
          <button
            onClick={toggleTask}
            className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
          >
            <MdClose size={24} />
          </button>

          <h3
            className="text-lg font-semibold text-center mb-2"
            style={{ color: theme.palette.dark.hex }}
          >
            {taskName}
          </h3>

          <p
            className="text-center text-sm mb-4"
            style={{ color: theme.palette.text.hex }}
          >
            {taskData.description}
          </p>

          {/* Recursos */}
          <div className="mt-6 text-center ">
            <h4
              className="text-md font-semibold mb-1"
              style={{ color: theme.palette.primary.hex }}
            >
              Cursos recomendados
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Las asignaturas que cubren estos conocimientos autocompletarán esta sección automáticamente.
            </p>
            <div className="space-y-2">
              {taskData.resources?.map((resource, i) => (
                <Resource key={i} resource={resource} />
              ))}
            </div>
          </div>


          {/* Acción */}
          <div className="flex justify-center mt-6">
            {taskData.status === "doing" ? (
              <button
                onClick={handleMarkAsDone}
                className="px-6 py-2 text-white text-lg font-bold rounded-full shadow-md transition-colors duration-300"
                style={{
                  backgroundColor: theme.palette.primary.hex,
                  fontFamily: "Montserrat",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.palette.secondary.hex;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.palette.primary.hex;
                }}
              >
                Completar sección
              </button>
            ) : (
              <div
                className="px-6 py-2 text-white text-lg font-bold rounded-full shadow-md"
                style={{
                  backgroundColor: "#26a269",
                  fontFamily: "Montserrat",
                }}
              >
                Sección completada
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
