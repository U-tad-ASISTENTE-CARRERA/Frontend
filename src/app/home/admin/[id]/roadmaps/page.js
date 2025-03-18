"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import LoadingModal from "@/components/LoadingModal";

const RoadmapList = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch("http://localhost:3000/roadmaps", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener la lista de roadmaps");
        }

        const data = await response.json();
        setRoadmaps(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleDelete = async (roadmapName) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el roadmap "${roadmapName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/roadmaps/${encodeURIComponent(roadmapName)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el roadmap");
      }

      setRoadmaps(roadmaps.filter(roadmap => roadmap.name !== roadmapName));
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecciona un archivo");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/roadmaps", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al subir el roadmap");
      }

      const data = await response.json();
      
      setRoadmaps([...roadmaps, data]);
      setShowUploadModal(false);
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap => 
    roadmap.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingModal message="Cargando roadmaps..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.primary.hex }}>
          Gestión de Roadmaps
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-white rounded-md flex items-center gap-2"
            style={{ backgroundColor: theme.palette.success.hex }}
          >
            <i className="bi bi-upload"></i>
            Subir Roadmap
          </button>
          <button
            onClick={() => router.push(`/home/admin/${id}`)}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: theme.palette.primary.hex }}
          >
            Volver
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Buscar roadmaps..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: theme.palette.light.hex }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredRoadmaps.length > 0 ? (
            filteredRoadmaps.map((roadmap) => (
              <div 
                key={roadmap.name} 
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: theme.palette.light.hex }}
              >
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold truncate" style={{ color: theme.palette.dark.hex }}>
                    {roadmap.name}
                  </h3>
                </div>
                <div className="px-6 py-4">
                  {roadmap.body && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.keys(roadmap.body).map((section, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {countTopics(roadmap.body)} temas
                      </p>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Actualizado: {formatDate(roadmap.updatedAt)}
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t flex justify-end gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-900 px-2 py-1"
                    onClick={() => {
                      const url = `/home/admin/${id}/roadmaps/edit/${roadmap.name}`;
                      console.log("Navigating to:", url);
                      router.push(url);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i> Ver Detalles
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 px-2 py-1"
                    onClick={() => handleDelete(roadmap.name)}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-8 text-center text-gray-500">
              No se encontraron roadmaps
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.palette.dark.hex }}>
              Subir Nuevo Roadmap
            </h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Archivo JSON del Roadmap
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                  style={{ borderColor: theme.palette.light.hex }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo se aceptan archivos JSON con el formato adecuado para roadmaps.
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: theme.palette.primary.hex }}
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Subir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function countTopics(body) {
  let count = 0;
  Object.values(body).forEach(section => {
    count += Object.keys(section).length;
  });
  return count;
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default RoadmapList;