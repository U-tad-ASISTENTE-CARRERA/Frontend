import React, { useState, useEffect } from "react";
import SelectTutor from "./SelectTutor";
import { FaUserTie, FaTrash } from "react-icons/fa";

const ShowTutor = () => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSelectTutor, setShowSelectTutor] = useState(false);

  useEffect(() => {
    fetchTutor();
  }, []);

  const fetchTutor = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el tutor asignado.");
      const data = await response.json();

      if (Array.isArray(data.teachers) && data.teachers.length > 0) {
        setTutor(data.teachers[0]);
      } else {
        setTutor(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTutor = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar el tutor?")) return;

    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el tutor.");

      setTutor(null);
      setShowSelectTutor(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      {/* Bloque de Tutor Asignado */}
      <div className="relative flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200">
        <div className="absolute left-0 top-0 h-full w-2 bg-blue-500 rounded-l-lg"></div>

        <div className="flex-grow">
          <h2 className="text-sm font-semibold text-gray-500">TUTOR ASIGNADO</h2>
          {loading ? (
            <p className="text-gray-600 mt-2">Cargando...</p>
          ) : tutor ? (
            <div className="mt-1">
              <p className="text-xl text-blue-500 font-semibold">
                {tutor.metadata?.firstName} {tutor.metadata?.lastName}
              </p>
              <p className="text-gray-600 text-sm">
                {tutor.metadata?.specialization || "Sin especialización"}
              </p>
            </div>
          ) : (
            <button
              className="mt-2 text-blue-500 font-semibold flex items-center gap-1 hover:underline"
              onClick={() => setShowSelectTutor(true)}
            >
              + Seleccionar Tutor
            </button>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}

        </div>

        <div className="flex items-center gap-3">
          {/* Botón de eliminar */}
          {tutor && (
            <button
              className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full text-red-500 hover:bg-red-200 transition"
              onClick={handleRemoveTutor}
              title="Quitar tutor"
            >
              <FaTrash className="text-lg" />
            </button>
          )}

          {/* Icono del tutor */}
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <FaUserTie className="text-blue-500 text-lg" />
          </div>
        </div>
      </div>

      {/* Contenedor de selección de tutor debajo del bloque de tutor asignado */}
      {showSelectTutor && !tutor && (
        <div className="mt-6">
          <SelectTutor onSelect={fetchTutor} />
        </div>
      )}
    </div>
  );
};

export default ShowTutor;
