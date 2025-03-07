"use client";

import React, { useState, useEffect } from "react";
import "@fontsource/montserrat";
import ErrorPopUp from "../../../components/ErrorPopUp";
import { useRouter, useParams } from "next/navigation";
import { theme } from "../../../constants/theme";
import Image from "next/image";
import "@fontsource/montserrat";
import LoadingModal from "../../../components/LoadingModal";
import ProgressBar from "../../../components/student_profile/ProgressBar";

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [roadmap, setRoadmap] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [metadata, setMetadata] = useState({});
  const [progress, setProgress] = useState(0);

  const fetchMetadataAndRoadmap = async () => {
    const response = await fetch("http://localhost:3000/metadata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log("fetched metadata", data);
    setMetadata(data.metadata);
    setRoadmap(data.metadata.roadmap);
    setProgress(calculateProgress(data.metadata.roadmap));
  };

  const calculateProgress = (_roadmap) => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(_roadmap.body).forEach((section) => {
      Object.values(section).forEach((task) => {
        totalTasks++;
        if (task.status === "done") {
          completedTasks++;
        }
      });
    });

    return (completedTasks / totalTasks) * 100;
  };

  {
    /*Podemos utilizarlo*/
  }

  /*const fetchRoadMap = async () => {
    const response = await fetch("http://localhost:3000/userRoadmap", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      setError("Error al obtener el roadmap");
      return;
    }
    const data = await response.json();
    setRoadmap(data);
  };*/

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
        //fetchRoadMap();
        fetchMetadataAndRoadmap();
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

  if (!roadmap || Object.keys(roadmap).length === 0) return <LoadingModal />;

  return (
    <div
      style={{
        background:
          "linear-gradient(0deg, rgb(0, 33, 71) 0%, rgb(0, 81, 255) 7%, rgb(255, 255, 255) 100%)",
        padding: 12,
      }}
    >
      <div className="flex items-center justify-center gap-x-8 p-8">
        <Image
          src="/student.png"
          alt="Student"
          className="w-32"
          width={600}
          height={600}
        />
        <div className="flex flex-col items-left">
          <h1
            style={{
              color: theme.palette.text.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xxxxl,
            }}
          >
            {metadata.firstName}
            {"   "}
            {metadata.lastName}
          </h1>
          <h3
            style={{
              color: theme.palette.text.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xl,
            }}
          >
            {metadata.gender == "male" ? "Hombre" : "Mujer"}
          </h3>
        </div>
      </div>
      <div
        className="flex items-center justify-center min-h-screen p-8"
        style={{}}
      >
        <div
          className="w-full p-8 bg-white shadow-lg"
          style={{ borderRadius: theme.buttonRadios.xxl }}
        >
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
            <ProgressBar progress={progress} />
          </div>
          <div className="grid grid-cols-3 gap-10 mt-24 ">
            {roadmap.body &&
              Object.entries(roadmap.body).map(([sectionName, sectionData]) => (
                <Section
                  key={sectionName}
                  sectionName={sectionName}
                  sectionData={sectionData}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ sectionName, sectionData }) => {
  /*const calculateSectionProgress = () => {
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

  const sectionProgress = calculateSectionProgress();*/

  return (
    <div
      className="flex flex-col justify-between bg-white p-6 rounded-lg shadow-md"
      style={{
        borderColor: theme.palette.light.hex,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div>
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: theme.palette.purple.hex }}
        >
          {sectionName}
        </h2>
        {/*Experimental*/}
        {/*<div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${sectionProgress}%` }}
        ></div>
      </div>
      */}
        <div className="space-y-4">
          {Object.entries(sectionData).map(([taskName, taskData]) => (
            <Task
              key={taskName}
              taskName={taskName}
              taskData={taskData}
              sectionName={sectionName}
            />
          ))}
        </div>
      </div>

      {/*Experimental*/}
      {/*}
      {sectionProgress === 100 && (
        <div className="mt-4">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
            ¡Sección completada!
          </span>
        </div>
      )}
      */}
    </div>
  );
};

const Task = ({ taskName, taskData, sectionName }) => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

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
    window.location.reload();
  };

  const toggleResources = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  return (
    <div
      className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg"
      style={{
        borderColor: theme.palette.light.hex,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div className="w-fullflex items-center justify-between">
        <h3
          className="font-medium mb-2"
          style={{ color: theme.palette.dark.hex, fontSize: 20 }}
        >
          {taskName}
        </h3>
        <Image
          src={`/assets/${taskData.skill}.png`}
          alt={""}
          width={40}
          height={40}
          style={{ marginTop: 24 }}
        />
      </div>
      <div className="flex-grow mb-2" style={{ minHeight: "200px" }}>
        <p
          className="text-gray-700 mb-2 mt-10"
          style={{ color: theme.palette.text.hex }}
        >
          {taskData.description}
        </p>
      </div>
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
      <div className="flex items-center justify-left">
        <button
          onClick={toggleResources}
          className="w-20% text-m items-center px-4 py-2 mt-10 rounded-md transition duration-200"
          style={{
            backgroundColor: "white",
            borderRadius: theme.buttonRadios.xl,
            fontWeight: theme.fontWeight.bold,
            border: "3px solid",
            borderColor: theme.palette.dark.hex,
            color: theme.palette.dark.hex,
          }}
        >
          {isResourcesOpen ? "Ocultar Recursos" : "Mostrar Recursos"}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isResourcesOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 mt-4">
          {taskData.resources.map((resource, index) => (
            <Resource key={index} resource={resource} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleMarkAsDone}
        className="w-full px-4 py-2 mt-10 text-white rounded-md transition duration-200 transform hover:scale-105"
        style={{
          background:
            "radial-gradient(circle, rgba(44,69,228,1) 0%, rgba(96,169,255,1) 100%)",
          borderRadius: theme.buttonRadios.xl,
          fontWeight: theme.fontWeight.bold,
          fontFamily: "Montserrat, sans-serif",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        Finalizar
      </button>
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
