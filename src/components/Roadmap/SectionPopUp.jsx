"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";
import { theme } from "@/constants/theme";
import Task from "@/components/Roadmap/Task";

const SectionPopup = ({
  sectionName,
  sectionData,
  onClose,
  updateProgress,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 fade-fast">
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl relative pb-12"
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
        <div className="flex justify-center gap-x-6 mt-12">
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

export default SectionPopup;
