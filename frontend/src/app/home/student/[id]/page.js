"use client";

import React, { useState, useEffect } from "react";
import "@fontsource/montserrat";
import ErrorPopUp from "../../../components/ErrorPopUp";
import { useRouter, useParams } from "next/navigation";
import { theme } from "../../../constants/theme";
import Image from "next/image";

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const metadata = JSON.parse(localStorage.getItem("metadata"));

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
    console.log(metadata);
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

  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(roadmap.body).forEach((section) => {
      Object.values(section).forEach((task) => {
        totalTasks++;
        if (task.status === "done") {
          completedTasks++;
        }
      });
    });

    return (completedTasks / totalTasks) * 100;
  };

  const progress = calculateProgress();

  return (
    <>
      <div className="flex items-center justify-center gap-x-8 p-8">
        <Image
          src="/student.png"
          alt="Student"
          className="w-24"
          width={500}
          height={500}
        />
        <div className="flex flex-col items-left">
          <h1
            style={{
              color: theme.palette.text.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xxl,
            }}
          >
            {metadata["metadata.firstName"] || "Name"} {metadata["metadata.lastName"] || "Last"}
          </h1>
          <h3
            style={{
              color: theme.palette.text.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.l,
            }}
          >
            {metadata["metadata.gender"] || ""}
          </h3>
        </div>
      </div>
      <div
        className="flex items-center justify-center min-h-screen p-8"
        style={{}}
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
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${50}%` }}
            ></div>
            <h2 className="text-center mt-4">{progress}%</h2>
          </div>
          <div className="grid grid-cols-3 gap-10 mt-24 ">
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
  const calculateSectionProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(sectionData).forEach((task) => {
      totalTasks++;
      if (task.status === "done") {
        completedTasks++;
      }
    });

    return (completedTasks / totalTasks) * 100;
  };

  const sectionProgress = calculateSectionProgress();

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
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${sectionProgress}%` }}
        ></div>
      </div>
      <div className="space-y-4">
        {Object.entries(sectionData).map(([taskName, taskData]) => (
          <Task key={taskName} taskName={taskName} taskData={taskData} />
        ))}
      </div>
      {sectionProgress === 100 && (
        <div className="mt-4">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
            ¡Sección completada!
          </span>
        </div>
      )}
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
