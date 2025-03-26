"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import Image from "next/image";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import LoadingModal from "@/components/LoadingModal";
import Roadmap from "@/components/Roadmap/Roadmap";

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [roadmap, setRoadmap] = useState({ body: {} });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [metadata, setMetadata] = useState({});
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetadataAndRoadmap = async () => {
    const response = await fetch("http://localhost:3000/metadata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log("Metadata", data);
    localStorage.setItem("metadata", JSON.stringify(data.metadata));
    setMetadata(data.metadata);
    setRoadmap(data.metadata.roadmap);
    setProgress(
      calculateProgress(JSON.parse(localStorage.getItem("metadata")).roadmap)
    );
  };

  function calculateProgress(_roadmap) {
    if (!_roadmap || !_roadmap.body) return 0;

    let totalTasks = 0;
    let completedTasks = 0;

    Object.entries(_roadmap.body).forEach(([sectionName, sectionData]) => {
      const tasks = Object.entries(sectionData).slice(1);

      tasks.forEach(([taskName, taskData]) => {
        if (taskData && typeof taskData === "object" && "status" in taskData) {
          totalTasks++;
          if (taskData.status === "done") {
            completedTasks++;
          }
        }
      });
    });

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    console.log(
      `Progreso calculado: ${progress}% (${completedTasks}/${totalTasks} tareas completadas)`
    );

    return progress;
  }

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
    console.log(progress);
  }, []);

  if (roadmap || Object.keys(roadmap).length > 0) {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }
  if (isLoading) return <LoadingModal />;

  return (
    <div>
      <div className="flex items-center justify-center gap-x-8 p-8">
        <Image
          src="/student.png"
          alt="Student"
          className="w-32 fade-left"
          width={600}
          height={600}
        />
        <div className="m-8 flex flex-col items-left fade-up">
          <h1
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xxxxl,
              fontWeight: theme.fontWeight.bold,
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
              fontSize: theme.fontSizes.xxl,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            Alumn{metadata.gender == "male" ? "o" : "a"} de{" "}
            {metadata.degree == "INSO_DATA"
              ? "INSO con mención en DATA"
              : metadata.degree}
          </h3>
        </div>
      </div>

      <Roadmap
        roadmap={roadmap}
        metadata={metadata}
        progress={progress}
        setProgress={setProgress}
      />
    </div>
  );
};

export default Home;
