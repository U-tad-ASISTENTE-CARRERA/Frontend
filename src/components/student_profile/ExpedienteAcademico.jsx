import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { subjectsByYear } from "@/constants/subjectsByYear";
import { gradeRegex } from "@/utils/ValidatorRegex";

const ExpedienteAcademico = ({ academicRecord, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [grades, setGrades] = useState({});
  const [tempGrades, setTempGrades] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [activeYear, setActiveYear] = useState(1);

  useEffect(() => {
    if (academicRecord.length > 0) {
      const extractedGrades = {};
      academicRecord.forEach((subject) => {
        extractedGrades[subject.name] = subject.grade !== null ? subject.grade.toString() : "";
      });
      setGrades(extractedGrades);
      setTempGrades({ ...extractedGrades });
    }
  }, [academicRecord]);

  // Manejar cambios en la nota
  const handleGradeChange = (subjectName, value) => {
    let normalizedValue = value.replace(",", "."); // Convertir comas en puntos

    // Validar que el número tiene máximo un punto decimal y 2 decimales
    if (/^\d{1,2}(\.\d{0,2})?$/.test(normalizedValue)) {
      setGrades((prevGrades) => ({
        ...prevGrades,
        [subjectName]: normalizedValue.replace(/^0+(\d)/, "$1"), // Evita 08.5 → 8.5
      }));
    }
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.entries(grades).forEach(([subject, grade]) => {
      if (grade !== "" && !gradeRegex(grade)) {
        newErrors[subject] = "Nota inválida (debe ser entre 0 y 10, con hasta 2 decimales)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    const updatedGrades = Object.entries(grades)
      .filter(([subject, grade]) => grade !== tempGrades[subject]) // Solo cambios
      .map(([subject, grade]) => ({
        name: subject,
        grade: grade === "" ? null : parseFloat(grade), // Convertir a número o dejar null
      }));

    if (updatedGrades.length === 0) {
      setIsEditing(false);
      return;
    }

    onSave(updatedGrades);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setErrors({});
    setTempGrades({ ...grades }); // Actualizar valores después de guardar
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempGrades({ ...grades }); // Guardar una copia antes de editar
    setIsEditing(true);
  };

  const handleCancel = () => {
    setGrades({ ...tempGrades }); // Restaurar valores originales
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Expediente académico</h2>

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
            onClick={() => (isEditing ? handleCancel() : handleEdit())}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: isEditing ? theme.palette.error.hex : theme.palette.primary.hex, fontWeight: "bold" }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      {/* Menú de selección de año */}
      <div className="flex gap-2 mb-4">
        {Object.keys(subjectsByYear).map((year) => (
          <button
            key={year}
            className={`px-4 py-2 text-sm rounded-md ${
              activeYear === parseInt(year) ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveYear(parseInt(year))}
          >
            Curso {year}
          </button>
        ))}
      </div>

      {/* Tabla de notas con validación */}
      <div className="flex flex-col gap-2">
        {subjectsByYear[activeYear].map((subjectName, index) => (
          <div
            key={subjectName}
            className="flex items-center gap-4 p-2 rounded-md"
            style={{ backgroundColor: index % 2 === 0 ? theme.palette.neutral.hex : "transparent" }}
          >
            {/* Nombre de la asignatura */}
            <label className="text-sm font-medium w-3/5">{subjectName}</label>

            {/* Campo editable */}
            <input
              type="number"
              value={grades[subjectName] || ""}
              onChange={(e) => {handleGradeChange(subjectName, e.target.value)}}
              className="block w-1/5 p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />

            {isEditing && errors[subjectName] && <p className="text-red-500 text-xs">{errors[subjectName]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpedienteAcademico;
