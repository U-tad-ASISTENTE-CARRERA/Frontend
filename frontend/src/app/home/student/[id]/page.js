"use client";

import React, { useState, useEffect } from "react";
import "@fontsource/montserrat";
import ErrorPopUp from "../../../components/ErrorPopUp";
import { useRouter, useParams } from "next/navigation";
import { theme } from "../../../constants/theme";

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchRoadMap = async () => {
    const response = await fetch(
      "http://localhost:3000/roadmaps/student/Data Analyst",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      setError("Error al obtener el roadmap");
      return;
    }
    const data = await response.json();
    console.log(data);
    setRoadmap(data);
  };

  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      if (JSON.parse(localStorage.getItem("user")).role === "TEACHER") {
        return (
          <ErrorPopUp
            message={"No tienes acceso a esta página."}
            path={`/home/teacher/${params.id}`}
          />
        );
      } else {
        fetchRoadMap();
      }
    } else {
      return (
        <ErrorPopUp
          message={"Debes iniciar sesión para ver esta página."}
          path={`/login`}
        />
      );
    }
  }, []);

  if (!roadmap) return <div>Loading...</div>;

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen p-8"
        style={{ backgroundColor: theme.palette.neutral.hex }}
      >
        <div className="w-full p-8 bg-white rounded-lg shadow-lg">
          <h1
            className="text-3xl font-bold text-center mb-8"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            {roadmap.name}
          </h1>
          <div className="space-y-8">
            {Object.entries(roadmap.body).map(([sectionName, sectionData]) => (
              <Section
                key={sectionName}
                sectionName={sectionName}
                sectionData={sectionData}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Section = ({ sectionName, sectionData }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md"
      style={{
        borderColor: theme.palette.light.hex,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: theme.palette.primary.hex }}
      >
        {sectionName}
      </h2>
      <div className="space-y-4">
        {Object.entries(sectionData).map(([taskName, taskData]) => (
          <Task key={taskName} taskName={taskName} taskData={taskData} />
        ))}
      </div>
    </div>
  );
};

const Task = ({ taskName, taskData }) => {
  return (
    <div
      className="bg-gray-50 p-4 rounded-lg"
      style={{
        borderColor: theme.palette.light.hex,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h3
        className="text-xl font-medium mb-2"
        style={{ color: theme.palette.dark.hex }}
      >
        {taskName}
      </h3>
      <p
        className="text-gray-700 mb-2"
        style={{ color: theme.palette.text.hex }}
      >
        {taskData.description}
      </p>
      <div className="flex items-center mb-2">
        <span
          className="text-sm font-medium"
          style={{ color: theme.palette.text.hex }}
        >
          Estado:
        </span>
        <span
          className="ml-2 text-sm"
          style={{ color: theme.palette.text.hex }}
        >
          {taskData.status}
        </span>
      </div>
      <div className="space-y-2">
        {taskData.resources.map((resource, index) => (
          <Resource key={index} resource={resource} />
        ))}
      </div>
    </div>
  );
};

const Resource = ({ resource }) => {
  return (
    <div className="flex items-center">
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: theme.palette.primary.hex }}
        className="hover:underline"
      >
        {resource.description}
      </a>
    </div>
  );
};

export default Home;
