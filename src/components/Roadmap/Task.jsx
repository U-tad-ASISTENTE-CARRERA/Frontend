"use client";

import React, { useState } from "react";
import Image from "next/image";
import { theme } from "@/constants/theme";
import Resource from "@/components/Roadmap/Resource";

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
        sectionName: sectionName,
        topicName: taskName,
        newStatus: "done",
      }),
    });
    const data = await response.json();
    console.log(data);
    if (updateProgress) updateProgress();
    window.location.reload();
  };

  const toggleTask = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="cursor-pointer" onClick={toggleTask}>
        {taskData.status == "doing" ? (
          <Image
            src={`/icons/${taskData.skill}.png`}
            alt={taskName}
            width={60}
            height={60}
          />
        ) : (
          <Image src={`/si.png`} alt={taskName} width={60} height={60} />
        )}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="flex flex-col justify-between bg-gray-50 p-8 rounded-lg mt-4 mb-4"
          style={{
            borderColor: theme.palette.light.hex,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <h3
            className="font-medium mb-2 text-center"
            style={{ color: theme.palette.dark.hex, fontSize: 16 }}
          >
            {taskName}
          </h3>
          <p
            className="text-gray-700 mb-2 text-sm text-center"
            style={{ color: theme.palette.text.hex }}
          >
            {taskData.description}
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={toggleTask}
              className="w-20% text-sm items-center px-3 py-1 mt-2 rounded-md transition duration-200"
              style={{
                backgroundColor: "white",
                borderRadius: theme.buttonRadios.xl,
                fontWeight: theme.fontWeight.bold,
                border: "2px solid",
                borderColor: theme.palette.dark.hex,
                color: theme.palette.dark.hex,
              }}
            >
              {isOpen ? "Ocultar" : "Detalles"}
            </button>
          </div>
          <div className="space-y-2 mt-2">
            {taskData.resources &&
              taskData.resources.map((resource, index) => (
                <Resource key={index} resource={resource} />
              ))}
          </div>
          <div className="flex items-center justify-center">
            {taskData.status == "doing" ? (
              <button
                type="button"
                onClick={handleMarkAsDone}
                className="w-2/3 items-center px-3 py-2 mt-8 rounded-md transition duration-200 text-white"
                style={{
                  background:
                    "radial-gradient(circle, rgba(44,69,228,1) 0%, rgba(96,169,255,1) 100%)",
                  borderRadius: theme.buttonRadios.xl,
                  fontWeight: theme.fontWeight.bold,
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  fontSize: theme.fontSizes.xl,
                }}
              >
                Finalizar
              </button>
            ) : (
              <button
                type="button"
                className="w-2/3 items-center px-3 py-2 mt-8 rounded-md transition duration-200 text-white"
                style={{
                  background:
                    "radial-gradient(circle, rgb(0, 112, 24) 0%, rgb(15, 211, 64) 100%)",
                  borderRadius: theme.buttonRadios.xl,
                  fontWeight: theme.fontWeight.bold,
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  fontSize: theme.fontSizes.xl,
                }}
              >
                Finalizado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
