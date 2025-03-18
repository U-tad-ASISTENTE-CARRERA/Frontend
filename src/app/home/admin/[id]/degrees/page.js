"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import LoadingModal from "@/components/LoadingModal";

const DegreeList = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [expandedDegree, setExpandedDegree] = useState(null);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch("http://localhost:3000/degrees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener la lista de titulaciones");
        }

        const data = await response.json();
        setDegrees(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDegrees();
  }, []);

  const handleDelete = async (degreeName) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la titulación "${degreeName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/degrees/${encodeURIComponent(degreeName)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la titulación");
      }

      setDegrees(degrees.filter(degree => degree.name !== degreeName));
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
      const response = await fetch("http://localhost:3000/degrees", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir la titulación");
      }

      const data = await response.json();
      
      setDegrees([...degrees, data]);
      setShowUploadModal(false);
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleDegreeDetails = (degreeName) => {
    if (expandedDegree === degreeName) {
      setExpandedDegree(null);
    } else {
      setExpandedDegree(degreeName);
    }
  };

  const filteredDegrees = degrees.filter(degree => 
    degree.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingModal message="Cargando titulaciones..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.primary.hex }}>
          Gestión de Titulaciones
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-white rounded-md flex items-center gap-2"
            style={{ backgroundColor: theme.palette.success.hex }}
          >
            <i className="bi bi-upload"></i>
            Subir Titulación
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
            placeholder="Buscar titulaciones..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: theme.palette.light.hex }}
          />
        </div>

        <div className="overflow-hidden">
          {filteredDegrees.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredDegrees.map((degree) => (
                <li key={degree.name} className="hover:bg-gray-50">
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleDegreeDetails(degree.name)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: theme.palette.dark.hex }}>
                        {degree.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {degree.subjects ? `${degree.subjects.length} asignaturas` : 'No hay datos de asignaturas'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm">
                        {expandedDegree === degree.name ? 'Ocultar detalles' : 'Ver detalles'}
                      </span>
                      <i className={`bi ${expandedDegree === degree.name ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </div>
                  </div>

                  {expandedDegree === degree.name && degree.subjects && (
                    <div className="px-4 pb-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Nombre
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Créditos
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Tipo
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Categoría
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Año
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Mención
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {degree.subjects.map((subject, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {subject.name}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {subject.credits}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    subject.type === "B" ? "bg-green-100 text-green-800" :
                                    subject.type === "OB" ? "bg-blue-100 text-blue-800" :
                                    subject.type === "OP" ? "bg-purple-100 text-purple-800" :
                                    "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {subject.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {subject.label}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {subject.year}º
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {subject.mention || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-900 border border-red-200 rounded-md hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(degree.name);
                          }}
                        >
                          <i className="bi bi-trash mr-1"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No se encontraron titulaciones
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.palette.dark.hex }}>
              Subir Nueva Titulación
            </h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Archivo JSON de la Titulación
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                  style={{ borderColor: theme.palette.light.hex }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo se aceptan archivos JSON con el formato adecuado para titulaciones.
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

export default DegreeList;