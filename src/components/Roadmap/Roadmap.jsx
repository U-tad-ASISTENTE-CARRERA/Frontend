"use client";

import React, { useState } from "react";
import { theme } from "@/constants/theme";
import ProgressBar from "@/components/student_profile/ProgressBar";
import Section from "@/components/Roadmap/Section";
import SectionPopup from "@/components/Roadmap/SectionPopup";

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
        <div className="flex flex-wrap justify-evenly gap-4 mt-12">
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
