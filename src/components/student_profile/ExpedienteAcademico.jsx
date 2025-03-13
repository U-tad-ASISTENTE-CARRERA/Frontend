import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { subjectsByYear } from "@/constants/subjectsByYear";

const ExpedienteAcademico = ({ academicRecord, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [grades, setGrades] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [activeYear, setActiveYear] = useState(1);

  // 📌 Inicializar `grades` con `academicRecord`
  useEffect(() => {
    if (academicRecord.length > 0) {
      const extractedGrades = {};
      academicRecord.forEach((subject) => {
        extractedGrades[subject.name] = subject.grade || "";
      });
      setGrades(extractedGrades);
    }
  }, [academicRecord]);

  const handleGradeChange = (subjectName, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subjectName]: value,
    }));
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.entries(grades).forEach(([subject, grade]) => {
      if (grade < 0 || grade > 10 || isNaN(grade)) {
        newErrors[subject] = "Nota inválida (debe ser entre 0 y 10)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    // 📌 Llamar la función `onSave` pasada como prop en `StudentProfile.jsx`
    const updatedGrades = academicRecord.map((subject) => ({
      name: subject.name,
      grade: grades[subject.name],
    }));

    onSave(updatedGrades);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Expediente Académico</h2>
        <div className="flex gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-md transition duration-200"
              style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
            >
              Guardar cambios
            </button>
          )}
          <button
            type="button"
            onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: isEditing ? theme.palette.error.hex : theme.palette.primary.hex, fontWeight: "bold" }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      {success && <p className="text-green-500 text-sm">Notas actualizadas correctamente</p>}

      {/* Menú de selección de año */}
      <div className="flex gap-2 mb-4">
        {Object.keys(subjectsByYear).map((year) => (
          <button
            key={year}
            className={`px-4 py-2 text-sm rounded-md ${
              activeYear === parseInt(year)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveYear(parseInt(year))}
          >
            Año {year}
          </button>
        ))}
      </div>

      {/* Tabla de notas */}
      <div className="flex flex-col gap-4">
        {subjectsByYear[activeYear].map((subjectName) => (
          <div key={subjectName} className="flex items-center gap-4">
            <label className="text-sm font-medium w-3/5">{subjectName}</label>
            <input
              type="number"
              value={grades[subjectName] || ""}
              onChange={(e) => handleGradeChange(subjectName, e.target.value)}
              className="block w-1/5 p-2 border rounded-md transition-all"
              disabled={!isEditing}
              min="0"
              max="10"
              step="0.1"
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />
            {errors[subjectName] && <p className="text-red-500 text-xs">{errors[subjectName]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpedienteAcademico;
