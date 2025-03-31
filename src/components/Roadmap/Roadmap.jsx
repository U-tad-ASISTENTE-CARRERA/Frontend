"use client";

import React, { useState } from "react";
import { theme } from "@/constants/theme";
import ProgressBar from "@/components/student_profile/ProgressBar";
import Section from "@/components/Roadmap/Section";
import SectionPopup from "@/components/Roadmap/SectionPopUp";
import { FaArrowRight, FaTrophy } from "react-icons/fa";

const Roadmap = ({ roadmap, metadata, progress, setProgress }) => {
  const [selectedSection, setSelectedSection] = useState(null);

  const openSectionPopup = (sectionName, sectionData) => {
    setSelectedSection({ sectionName, sectionData });
  };

  const closeSectionPopup = () => {
    setSelectedSection(null);
  };

  return (
    <div className="flex items-center justify-center p-8 fade pb-20">
      <div
        className="w-full"
        style={{ borderRadius: theme.buttonRadios.xxl }}
      >
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{
            color: theme.palette.primary.hex,
            fontFamily: "Montserrat",
          }}
        >
          {roadmap.name}
        </h1>

        {/* Bubble con progreso */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 px-6 py-2 rounded-full shadow-md text-white font-semibold"
            style={{ backgroundColor: theme.palette.primary.hex }}>
            <FaTrophy size={18} />
            Progreso: {Math.round(progress)}%
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-10">
          <ProgressBar progress={progress} />
        </div>

        {/* Camino visual de secciones con flechas y separación */}
        <div className="flex items-center justify-between gap-4 mt-6 px-6">
          {roadmap.body &&
            Object.entries(roadmap.body).map(([sectionName, sectionData], index, arr) => (
              <React.Fragment key={sectionName}>
                <Section
                  sectionName={sectionName}
                  sectionData={sectionData}
                  onClick={() => openSectionPopup(sectionName, sectionData)}
                />
                {index < arr.length - 1 && (
                  <div className="flex-1 border-dotted border-t-2 border-gray-300 flex justify-center">
                    <FaArrowRight className="-mt-2 text-blue-500 bg-white px-1" size={16} />
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>

      </div>

      {selectedSection && (
        <SectionPopup
          sectionName={selectedSection.sectionName}
          sectionData={selectedSection.sectionData}
          onClose={closeSectionPopup}
          updateProgress={() => {
            const newProgress = calculateProgress(roadmap);
            setProgress(newProgress);
          }}
        />
      )}
    </div>
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

export default Roadmap;
