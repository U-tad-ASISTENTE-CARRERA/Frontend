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
import { MdSchool, MdWorkspacePremium, MdWork } from "react-icons/md"

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
    const academicRecord = metadata?.AH?.subjects;

    if (!metadata?.AH || !Array.isArray(academicRecord) || academicRecord.length === 0) {
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

    const requiredSubjects = [...subjectsByYear[1], ...subjectsByYear[2]];

    const missingSubjects = requiredSubjects.filter((req) => {
      const subject = academicRecord.find((s) => s.name === req);
      return !subject || typeof subject.grade !== "number" || subject.grade < 0;
    });

    const hasPassedYear = (year) => {
      const yearSubjects = academicRecord.filter(
        (s) => Number(s.year) === year && typeof s.grade === "number"
      );
      const total = yearSubjects.length;
      const failed = yearSubjects.filter((s) => s.grade < 5).length;
      return total > 0 && failed <= 2;
    };

    const passedFirst = hasPassedYear(1);
    const passedSecond = hasPassedYear(2);

    if (!passedFirst || !passedSecond || missingSubjects.length > 0) {
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

      <div className="flex justify-center w-full px-6 py-10 ">
        <div className="w-full max-w-6xl space-y-8">
          {/* Cabecera del estudiante */}
          <div className="flex justify-between items-start p-8 bg-white rounded-2xl shadow-md border border-gray-200 gap-6">
            {/* Izquierda: Avatar + datos */}
            <div className="flex items-center gap-6">
              <div
                className="rounded-xl overflow-hidden border-4 border-blue-100 bg-white"
                style={{
                  width: "112px",
                  aspectRatio: "1",
                  minWidth: "96px",
                  maxWidth: "128px",
                }}
              >
                <Image
                  src="/student.png"
                  alt="Foto del estudiante"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col justify-center gap-2">
                <h1
                  className="text-3xl font-bold"
                  style={{
                    color: theme.palette.primary.hex,
                    fontFamily: "Montserrat",
                  }}
                >
                  {metadata.firstName} {metadata.lastName}
                </h1>

                <h3
                  className="text-lg font-medium"
                  style={{
                    color: theme.palette.text.hex,
                    fontFamily: "Montserrat",
                  }}
                >
                  Alumn{metadata.gender === "male" ? "o" : "a"} de{" "}
                  {metadata.degree === "INSO_DATA"
                    ? "INSO con mención en DATA"
                    : metadata.degree}
                </h3>

                <div className="flex gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 text-blue-800 font-medium text-sm">
                    <MdSchool size={18} />
                    {Array.isArray(metadata.yearsCompleted)
                      ? `${Math.max(...metadata.yearsCompleted) + 1}º${metadata.degree?.startsWith("INSO") ? " INSO" : ""
                      }`
                      : "1º"}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-green-50 text-green-800 font-medium text-sm">
                    <MdWorkspacePremium size={18} />
                    {metadata.certifications?.length || 0} certificaciones
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-50 text-yellow-800 font-medium text-sm">
                    <MdWork size={18} />
                    {metadata.workExperience?.length || 0} experiencias
                  </div>
                </div>
              </div>
            </div>

            {/* Derecha: Card extra */}
            <div className="hidden md:block min-w-[200px] bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm text-center">
              <h4 className="text-sm text-gray-500 font-medium mb-2">Estado actual</h4>
              <p className="text-xl font-bold text-blue-600" style={{ fontFamily: "Montserrat" }}>
                {Math.round(progress)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">progreso total</p>
            </div>
          </div>


          {/* Roadmap */}
          <div className="bg-white rounded-2xl shadow-md p-10">
            <Roadmap
              roadmap={roadmap}
              metadata={metadata}
              progress={progress}
              setProgress={setProgress}
            />
          </div>

          {/* Oportunidades */}
          <div className="bg-white rounded-2xl shadow-md p-10">
            <CareerOpportunityComponent />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Home;
