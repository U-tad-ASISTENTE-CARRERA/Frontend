import React, { useState, useEffect } from "react";
import SelectTutor from "./SelectTutor";

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
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el tutor asignado.");
      const data = await response.json();

      // ✅ Extraer correctamente el tutor desde el array "teachers"
      if (Array.isArray(data.teachers) && data.teachers.length > 0) {
        setTutor(data.teachers[0]); // Tomamos el primer tutor asignado
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
    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el tutor.");

      setTutor(null);
      setShowSelectTutor(false); // Ocultar SelectTutor después de eliminar
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Tutor asignado</h2>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {tutor ? (
        <div className="flex flex-col items-start gap-2">
          <p>
            <strong>Nombre:</strong> {tutor.metadata?.firstName || "Nombre"} {tutor.metadata?.lastName || "Apellido"}
          </p>
          <p>
            <strong>Especialización:</strong> {tutor.metadata?.specialization || "Sin especialización"}
          </p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={handleRemoveTutor}
          >
            Quitar tutor
          </button>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setShowSelectTutor(true)}
        >
          Seleccionar Tutor
        </button>
      )}

      {showSelectTutor && !tutor && <SelectTutor onSelect={fetchTutor} />}
    </div>
  );
};

export default ShowTutor;
