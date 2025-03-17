import React, { useState, useEffect } from "react";

const SelectTutor = ({ onSelect }) => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/teacher`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener los tutores.");
      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor");

      setTutors(data);
      setFilteredTutors(data);
      console.log("Tutores cargados:", data);

      // Extraer especializaciones únicas desde `metadata.specialization`
      const uniqueSpecializations = [...new Set(data.map((t) => t.metadata?.specialization || "Otra"))];
      setSpecializations(uniqueSpecializations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTutors = () => {
    let filtered = [...tutors];

    if (selectedSpecialization) {
      filtered = filtered.filter((tutor) => tutor.metadata?.specialization === selectedSpecialization);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((tutor) => {
        const fullName = `${tutor.metadata?.firstName || ""} ${tutor.metadata?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredTutors(filtered);
  };

  useEffect(() => {
    filterTutors();
  }, [searchTerm, selectedSpecialization]);

  const handleSelect = async (tutorId) => {
    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ teacherId: tutorId }),
      });

      if (!response.ok) throw new Error("Error al asignar el tutor.");
      onSelect(); // Llamar la función de actualización en ShowTutor
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Seleccionar un tutor</h2>

      {/* Filtro por nombre */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      {/* Filtro por especialización */}
      <select
        value={selectedSpecialization}
        onChange={(e) => setSelectedSpecialization(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="">Todas las especializaciones</option>
        {specializations.map((spec) => (
          <option key={spec} value={spec}>
            {spec}
          </option>
        ))}
      </select>

      {loading ? <p>Cargando tutores...</p> : null}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <li key={tutor.id} className="flex justify-between items-center border-b py-2">
              <p>
                {tutor.metadata?.firstName || "Nombre"} {tutor.metadata?.lastName || "Apellido"} -{" "}
                {tutor.metadata?.specialization || "Sin especialización"}
              </p>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={() => handleSelect(tutor.id)}
              >
                Seleccionar
              </button>
            </li>
          ))
        ) : (
          <p>No hay tutores disponibles con estos criterios.</p>
        )}
      </ul>
    </div>
  );
};

export default SelectTutor;
