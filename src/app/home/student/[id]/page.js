"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import Image from "next/image";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import LoadingModal from "@/components/LoadingModal";
import ProgressBar from "@/components/student_profile/ProgressBar";
import { FaTimes } from "react-icons/fa";

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
  const [selectedSection, setSelectedSection] = useState(null);

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
  }

  const openSectionPopup = (sectionName, sectionData) => {
    setSelectedSection({ sectionName, sectionData });
  };

  const closeSectionPopup = () => {
    setSelectedSection(null);
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

  if (!roadmap || Object.keys(roadmap).length === 0) return <LoadingModal />;

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
            {metadata.gender == "male" ? "Hombre" : "Mujer"}
          </h3>
        </div>
      </div>
      <div
        className="flex items-center justify-center p-8 fade pb-20"
        style={{}}
      >
        <div
          className="w-full p-12 bg-white shadow-lg"
          style={{ borderRadius: theme.buttonRadios.xxl }}
        >
          <h1
            className="text-3xl font-bold text-center mb-12"
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
          <div className="flex flex-wrap justify-evenly gap-4 mt-8">
            {roadmap.body &&
              Object.entries(roadmap.body).map(([sectionName, sectionData]) => (
                <Section
                  key={sectionName}
                  sectionName={sectionName}
                  sectionData={sectionData}
                  onClick={() => openSectionPopup(sectionName, sectionData)}
                />
              ))}
          </div>
        </div>
      </div>

      {selectedSection && (
        <SectionPopup
          sectionName={selectedSection.sectionName}
          sectionData={selectedSection.sectionData}
          onClose={closeSectionPopup}
          updateProgress={() =>
            setProgress(
              calculateProgress(
                JSON.parse(localStorage.getItem("metadata")).roadmap
              )
            )
          }
        />
      )}
    </div>
  );
};

const Section = ({ sectionName, sectionData, onClick }) => {
  const allTasksDone = Object.values(sectionData)
    .slice(1)
    .every((task) => task.status === "done");

  console.log(Object.values(sectionData).every((task) => task.status));

  return (
    <div
      className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md cursor-pointer"
      style={{
        borderColor: theme.palette.light.hex,
        fontFamily: "Montserrat, sans-serif",
      }}
      onClick={onClick}
    >
      {allTasksDone ? (
        <Image src={`/si.png`} alt={sectionName} width={40} height={40} />
      ) : (
        <Image
          src={`/assets/${sectionData[Object.keys(sectionData)[1]].skill}.png`}
          alt={sectionName}
          width={40}
          height={40}
        />
      )}
    </div>
  );
};

const SectionPopup = ({
  sectionName,
  sectionData,
  onClose,
  updateProgress,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 fade-fast">
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl relative"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition duration-200"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            background: "none",
            border: "none",
          }}
        >
          <FaTimes color={theme.palette.complementary.hex} />
        </button>

        <h2
          className="text-2xl font-semibold mb-4 mt-4 text-center"
          style={{ color: theme.palette.dark.hex }}
        >
          {sectionName}
        </h2>
        <div className="flex gap-x-6 mt-12">
          {Object.entries(sectionData)
            .slice(1)
            .map(([taskName, taskData]) => (
              <Task
                key={taskName}
                taskName={taskName}
                taskData={taskData}
                sectionName={sectionName}
                updateProgress={updateProgress}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

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
    updateProgress();
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
            src={`/assets/${taskData.skill}.png`}
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

const Resource = ({ resource }) => {
  return (
    <div className="flex justify-center items-center mt-4">
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: theme.palette.primary.hex }}
        className="hover:underline text-center"
      >
        {resource.description}
      </a>
    </div>
  );
};

export default Home;
