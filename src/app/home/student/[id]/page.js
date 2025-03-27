"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import Image from "next/image";
import "@fontsource/montserrat";
import LoadingModal from "@/components/LoadingModal";
import Roadmap from "@/components/Roadmap/Roadmap";
import CareerOpportunityComponent from "@/components/Roadmap/CareerOpportunityComponent";
import { AlertSystemRoadmap } from "@/components/Roadmap/AlertSystemRoadmap";
import { subjectsByYear } from "@/constants/subjectsByYear";

const Home = () => {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState({ body: {} });
  const [metadata, setMetadata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetadataAndRoadmap = async () => {
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      localStorage.setItem("metadata", JSON.stringify(data.metadata));
      setMetadata(data.metadata);
      setRoadmap(data.metadata.roadmap);
      setProgress(calculateProgress(data.metadata.roadmap));
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const calculateProgress = (_roadmap) => {
    if (!_roadmap || !_roadmap.body) return 0;
    let totalTasks = 0;
    let completedTasks = 0;
    Object.entries(_roadmap.body).forEach(([_, sectionData]) => {
      const tasks = Object.entries(sectionData).slice(1);
      tasks.forEach(([_, taskData]) => {
        if (taskData && typeof taskData === "object" && "status" in taskData) {
          totalTasks++;
          if (taskData.status === "done") completedTasks++;
        }
      });
    });
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) return router.replace(`/login`);
    if (user.role !== "STUDENT" || user.id !== params.id) return router.replace(`/unauthorized`);
    fetchMetadataAndRoadmap();
  }, []);

  useEffect(() => {
    if (metadata) {
      setTimeout(() => setIsLoading(false), 2000);
    }
  }, [metadata]);

  const generateAlerts = () => {
    if (!metadata) return [];
  
    const alerts = [];
    const academicRecord = metadata?.AH?.subjects || [];
  
    if (academicRecord.length === 0) {
      alerts.push({
        id: "academic-empty",
        type: "warning",
        keyword: "empty",
        action: {
          label: "Ir al perfil",
          path: `/profile/student/${params.id}`,
        },
      });
      return alerts;
    }
  
    const hasPassedYear = (year) => {
      const yearSubjects = academicRecord.filter(
        (s) => Number(s.year) === year && s.grade !== null && s.grade !== undefined && s.grade !== ""
      );
  
      const total = yearSubjects.length;
      const failed = yearSubjects.filter((s) => Number(s.grade) < 5).length;
  
      // Consideramos aprobado si ha cursado al menos una asignatura del año y tiene como máximo 2 suspensas
      return total > 0 && failed <= 2;
    };
  
    const passedFirst = hasPassedYear(1);
    const passedSecond = hasPassedYear(2);
  
    if (!passedFirst || !passedSecond) {
      alerts.push({
        id: "academic-incomplete",
        type: "warning",
        keyword: "incomplete",
        action: {
          label: "Ir al perfil",
          path: `/profile/student/${params.id}`,
        },
      });
    }
  
    return alerts;
  };
  

  if (isLoading || !metadata) return <LoadingModal />;

  const alerts = generateAlerts();

  if (alerts.length > 0) {
    return (
      <div className="p-10 space-y-6">
        <AlertSystemRoadmap alerts={alerts} />
      </div>
    );
  }

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
            {metadata.firstName} {metadata.lastName}
          </h1>
          <h3
            style={{
              color: theme.palette.text.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xxl,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            Alumn{metadata.gender === "male" ? "o" : "a"} de {metadata.degree === "INSO_DATA" ? "INSO con mención en DATA" : metadata.degree}
          </h3>
        </div>
      </div>

      <Roadmap
        roadmap={roadmap}
        metadata={metadata}
        progress={progress}
        setProgress={setProgress}
      />

      <div className="bg-white shadow-lg m-12 rounded-lg p-10">
        <CareerOpportunityComponent />
      </div>

    </div>
  );
};

export default Home;
