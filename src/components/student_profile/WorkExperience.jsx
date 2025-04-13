import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { FaTrash } from "react-icons/fa";

const WorkExperience = ({ workExperience, setWorkExperience, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempWorkExperience, setTempWorkExperience] = useState([...workExperience]);
  const [deletedWorkExperience, setDeletedWorkExperience] = useState([]);

  const handleInputChange = (index, field, value) => {
    const updatedWorkExperience = [...tempWorkExperience];
    updatedWorkExperience[index][field] = value.trim();
    setTempWorkExperience(updatedWorkExperience);
  };

  const addWorkExperience = () => {
    setTempWorkExperience([
      ...tempWorkExperience,
      { jobType: "", company: "", responsibilities: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const validateForm = () => {
    let newErrors = {};

    tempWorkExperience.forEach((work, index) => {
      if (!work.jobType.trim()) {
        newErrors[`jobType-${index}`] = "El tipo de trabajo no puede estar vacío.";
      }
      if (!work.company.trim()) {
        newErrors[`company-${index}`] = "La compañía no puede estar vacía.";
      }
      if (!work.responsibilities.trim()) {
        newErrors[`responsibilities-${index}`] = "Las responsabilidades no pueden estar vacías.";
      }
      if (!work.startDate || isNaN(new Date(work.startDate).getTime())) {
        newErrors[`startDate-${index}`] = "La fecha de inicio es obligatoria y debe ser válida.";
      }
      if (work.endDate && isNaN(new Date(work.endDate).getTime())) {
        newErrors[`endDate-${index}`] = "La fecha de finalización debe ser válida.";
      }
      if (!work.description.trim()) {
        newErrors[`description-${index}`] = "La descripción no puede estar vacía.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (index) => {
    const workToDelete = tempWorkExperience[index];

    if (workExperience.some((work) => work.jobType === workToDelete.jobType)) {
      setDeletedWorkExperience((prev) => [...prev, workToDelete]);
    }

    setTempWorkExperience(tempWorkExperience.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (deletedWorkExperience.length > 0) {
        console.log("Eliminando experiencias laborales:", deletedWorkExperience);
        await onDelete({ workExperience: deletedWorkExperience });
        setDeletedWorkExperience([]);
      }

      if (tempWorkExperience.length > 0) {
        const existingIds = workExperience.map(w => w.jobType);

        const updated = tempWorkExperience.filter(w => existingIds.includes(w.jobType));
        const created = tempWorkExperience.filter(w => !existingIds.includes(w.jobType));

        await onSave({
          workExperience: [...updated, ...created],
        });
        
        setWorkExperience(tempWorkExperience);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar las experiencias laborales", error.message);
    }
  };

  const handleCancel = () => {
    setTempWorkExperience([...workExperience]);
    setDeletedWorkExperience([]);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      {/* Header con botón de edición */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
          Experiencia laboral
        </h2>

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
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: isEditing ? theme.palette.error.hex : theme.palette.primary.hex, fontWeight: "bold" }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      {/* Mensaje cuando no hay experiencias laborales */}
      {tempWorkExperience.length === 0 && deletedWorkExperience.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No hay experiencias laborales guardadas.</p>
      )}

      {/* Lista de experiencias laborales */}
      {tempWorkExperience.map((work, index) => {
        const hasError = errors[`jobType-${index}`] || errors[`company-${index}`] || errors[`responsibilities-${index}`] || errors[`startDate-${index}`] || errors[`endDate-${index}`] || errors[`description-${index}`];

        return (
          <div 
            key={index} 
            className="rounded-md p-4 border space-y-3"
            style={{ borderColor: theme.palette.lightGray.hex }}
          >
            <div className="flex items-start gap-3">
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Tipo de trabajo
                </label>
                <input
                  type="text"
                  placeholder="Tipo de trabajo"
                  value={work.jobType}
                  onChange={(e) => handleInputChange(index, 'jobType', e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`jobType-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`jobType-${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={work.startDate}
                  onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`startDate-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`startDate-${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Fecha de finalización
                </label>
                <input
                  type="date"
                  value={work.endDate || ""}
                  onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`endDate-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`endDate-${index}`]}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="text-white p-2 rounded-md transition duration-200"
                    style={{ backgroundColor: theme.palette.error.hex }}
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Responsabilidades
                </label>
                <input
                  type="text"
                  placeholder="Responsabilidades"
                  value={work.responsibilities}
                  onChange={(e) => handleInputChange(index, 'responsibilities', e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`responsibilities-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`responsibilities-${index}`]}
                  </p>
                )}
              </div>

              <div className="w-2/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Compañía
                </label>
                <input
                  type="text"
                  placeholder="Compañía"
                  value={work.company}
                  onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`company-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`company-${index}`]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                Descripción
              </label>
              <input
                type="text"
                placeholder="Descripción"
                value={work.description}
                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                className="block w-full p-2 border rounded-md"
                style={{
                  borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                  color: theme.palette.text.hex,
                }}
                disabled={!isEditing}
              />
              {errors[`description-${index}`] && (
                <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                  {errors[`description-${index}`]}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Botón para añadir nuevas experiencias laborales */}
      {isEditing && (
        <button
          type="button"
          onClick={addWorkExperience}
          className="w-full px-4 py-2 text-white rounded-md transition duration-200"
          style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
        >
          Añadir Experiencia Laboral
        </button>
      )}
    </div>
  );
};

export default WorkExperience;
