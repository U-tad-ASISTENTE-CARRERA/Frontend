"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import LoadingModal from "@/components/LoadingModal";

const RoadmapViewer = () => {
  const router = useRouter();
  const params = useParams();
  const { id, roadmapId } = params;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`http://localhost:3000/roadmaps/${roadmapId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el roadmap");
        }

        const data = await response.json();
        setRoadmap(data);
        
        const initialExpandedState = {};
        Object.keys(data.body || {}).forEach(section => {
          initialExpandedState[section] = false;
        });
        setExpandedSections(initialExpandedState);
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (roadmapId) {
      fetchRoadmap();
    }
  }, [roadmapId]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  if (loading) {
    return <LoadingModal message="Cargando roadmap..." />;
  }

  if (!roadmap) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          No se pudo cargar el roadmap
        </div>
        <button
          onClick={() => router.push(`/home/admin/${id}/roadmaps`)}
          className="px-4 py-2 text-white rounded-md"
          style={{ backgroundColor: theme.palette.primary.hex }}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.primary.hex }}>
          Detalles del Roadmap
        </h1>
        <button
          onClick={() => router.push(`/home/admin/${id}/roadmaps`)}
          className="px-4 py-2 text-white rounded-md"
          style={{ backgroundColor: theme.palette.primary.hex }}
        >
          Volver
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-8 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Nombre del Roadmap
          </label>
          <input
            type="text"
            value={roadmap.name}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
            style={{ borderColor: theme.palette.light.hex }}
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: theme.palette.dark.hex }}>
            Contenido del Roadmap
          </h2>
        </div>

        <div className="space-y-4">
          {roadmap.body && Object.keys(roadmap.body).length > 0 ? (
            Object.keys(roadmap.body).map((section) => (
              <div key={section} className="border rounded-lg overflow-hidden">
                <div 
                  className="px-4 py-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection(section)}
                >
                  <h3 className="font-semibold" style={{ color: theme.palette.dark.hex }}>
                    {section}
                  </h3>
                  <i className={`bi ${expandedSections[section] ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </div>

                {expandedSections[section] && (
                  <div className="p-4">
                    {Object.keys(roadmap.body[section]).length > 0 ? (
                      Object.keys(roadmap.body[section]).map((topic) => (
                        <div key={topic} className="mb-6 border p-4 rounded-lg">
                          <div className="mb-3">
                            <h4 className="font-medium" style={{ color: theme.palette.dark.hex }}>
                              {topic}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Descripción</label>
                              <textarea
                                value={roadmap.body[section][topic].description || ""}
                                readOnly
                                className="w-full px-3 py-2 border rounded-md bg-gray-100"
                                rows="3"
                              ></textarea>
                            </div>

                            <div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Estado</label>
                                <input
                                  type="text"
                                  value={roadmap.body[section][topic].status || "doing"}
                                  readOnly
                                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                                />
                              </div>

                              <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Habilidad</label>
                                <input
                                  type="text"
                                  value={roadmap.body[section][topic].skill || ""}
                                  readOnly
                                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-1">Asignatura</label>
                                <input
                                  type="text"
                                  value={roadmap.body[section][topic].subject || ""}
                                  readOnly
                                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Recursos</label>
                            <div className="space-y-3">
                              {roadmap.body[section][topic].resources && 
                                roadmap.body[section][topic].resources.map((resource, idx) => (
                                <div key={idx} className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={resource.description || ""}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded-md bg-gray-100"
                                  />
                                  <input
                                    type="text"
                                    placeholder="URL"
                                    value={resource.link || ""}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded-md bg-gray-100"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-4">
                        No hay temas en esta sección.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8 border rounded-lg">
              Este roadmap no tiene contenido.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapViewer;