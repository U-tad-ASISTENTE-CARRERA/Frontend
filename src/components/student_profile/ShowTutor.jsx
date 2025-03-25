import React, { useState, useEffect } from "react";
import { FaUserPlus, FaTrash, FaFileAlt } from "react-icons/fa";
import ConfirmPopup from "../ConfirmPopUp";
import LoadingModal from "../LoadingModal";
import { theme } from "@/constants/theme";

const ShowTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);

  useEffect(() => {
    fetchAssignedTutors();
  }, []);

  const fetchAssignedTutors = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener tutores asignados");
      const data = await response.json();
      const assignedIds = data.teachers.map(t => t.id);
      setTutors(data.teachers);
      fetchAvailableTutors(assignedIds);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchAvailableTutors = async (assignedIds) => {
    try {
      const response = await fetch(`http://localhost:3000/teacher`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener los tutores.");
      const data = await response.json();
      const available = data.filter(t => !assignedIds.includes(t.id));

      const uniqueSpecializations = [...new Set(data.map((t) => t.metadata?.specialization || "Otra"))];
      setSpecializations(uniqueSpecializations);
      filterTutors(available, searchTerm, selectedSpecialization);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTutors = (baseList, search, specialization) => {
    let filtered = [...baseList];

    if (specialization) {
      filtered = filtered.filter((tutor) => tutor.metadata?.specialization === specialization);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((tutor) => {
        const fullName = `${tutor.metadata?.firstName || ""} ${tutor.metadata?.lastName || ""}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      });
    }

    setFilteredTutors(filtered);
  };

  useEffect(() => {
    filterTutors(filteredTutors, searchTerm, selectedSpecialization);
  }, [searchTerm, selectedSpecialization]);

  const handleSelect = async (tutorId) => {
    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ teacherId: tutorId }),
      });

      if (!response.ok) throw new Error("Error al asignar el tutor.");
      fetchAssignedTutors();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmRemoveTutor = (tutorId) => {
    setSelectedTutorId(tutorId);
    setShowConfirmPopup(true);
  };

  const handleRemoveTutor = async () => {
    setShowConfirmPopup(false);
    try {
      const response = await fetch("http://localhost:3000/student/teacher", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ teacherId: selectedTutorId }),
      });

      if (!response.ok) throw new Error("Error al eliminar el tutor.");
      fetchAssignedTutors();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      <div className="relative p-6 bg-white rounded-lg">

        <h2 className="text-lg font-semibold mb-5">Tutores asignados</h2>

        {tutors.length >= 3 && (
          <div
            className="flex items-center gap-3 p-4 text-sm mt-4 mb-5"
            style={{
              backgroundColor: `${theme.palette.warning.hex}20`,
              borderLeft: `4px solid ${theme.palette.warning.hex}`
            }}
          >
            <i className="bi bi-exclamation-triangle-fill" style={{ color: theme.palette.warning.hex }}></i>
            <p className="m-0">Has alcanzado el número máximo de tutores asignados (3).</p>
          </div>
        )}

        {tutors.length == 0 && (
          <p
            style={{
              color: theme.palette.text.hex,
            }}
          >
            No hay ningún tutor asignado.
          </p>
        )}

        {loading ? (
          <LoadingModal />
        ) : (
          <div className="space-y-4">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="relative flex items-center justify-between p-4 border rounded-md"
              >
                <div className="absolute left-0 top-0 h-full w-2 rounded-l-md" style={{ backgroundColor: theme.palette.primary.hex }}></div>
                <div className="pl-4">
                  <p className="text-lg font-semibold" style={{ color: theme.palette.primary.hex }}>
                    {tutor.metadata?.firstName} {tutor.metadata?.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {tutor.metadata?.specialization || "Sin especialización"}
                  </p>
                </div>
                <div className="flex items-center gap-4">

                  <button
                    className="flex items-center gap-2 px-3 py-1 rounded-full hover:opacity-80 transition"
                    onClick={() => confirmRemoveTutor(tutor.id)}
                    title="Quitar tutor"
                    style={{
                      backgroundColor: `${theme.palette.error.hex}20`,
                      color: theme.palette.error.hex,
                    }}
                  >
                    <FaTrash className="text-sm" />
                    <span className="text-sm">Quitar tutor</span>
                  </button>

                  <button
                    className="flex items-center gap-2 px-3 py-1 rounded-full hover:opacity-80 transition"
                    title="Enviar informe"
                    style={{ backgroundColor: `${theme.palette.primary.hex}20`, color: theme.palette.primary.hex }}
                  >
                    <FaFileAlt className="text-sm" />
                    <span className="text-sm">Enviar informe</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {tutors.length < 3 && (
        <div className="mt-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h2
              className="text-sm font-semibold mb-4"
              style={{
                color: theme.palette.text.hex,
              }}
            >
              SELECCIONAR UN TUTOR
            </h2>
            <div className="flex flex-col md:flex-row gap-3 w-full mb-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none"
                  style={{ borderColor: theme.palette.primary.hex }}
                />
              </div>
              <div className="w-full md:w-1/3">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none"
                  style={{ borderColor: theme.palette.primary.hex }}
                >
                  <option value="">Todas las especializaciones</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>


            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialización</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTutors.length > 0 ? (
                    filteredTutors.map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tutor.metadata?.firstName} {tutor.metadata?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tutor.metadata?.specialization || "Sin especialización"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            className="flex items-center gap-2 px-3 py-1 rounded-full hover:opacity-80 transition"
                            onClick={() => handleSelect(tutor.id)}
                            title="Seleccionar tutor"
                            style={{ backgroundColor: `${theme.palette.primary.hex}20`, color: theme.palette.primary.hex }}
                          >
                            <FaUserPlus className="text-sm" />
                            <span className="text-sm">Seleccionar</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay tutores disponibles con estos criterios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <ConfirmPopup
          message="¿Estás seguro de que deseas eliminar este tutor?"
          onConfirm={handleRemoveTutor}
          onCancel={() => setShowConfirmPopup(false)}
        />
      )}
    </div>
  );
};

export default ShowTutor;