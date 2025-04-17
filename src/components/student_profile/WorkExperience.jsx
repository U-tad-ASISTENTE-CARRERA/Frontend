import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { FaTrash } from "react-icons/fa";

const WorkExperience = ({ workExperience, setWorkExperience, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempWorkExperience, setTempWorkExperience] = useState([...workExperience]);
  const [deletedWorkExperience, setDeletedWorkExperience] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const handleInputChange = (index, field, value) => {
    const updatedWorkExperience = [...tempWorkExperience];
    updatedWorkExperience[index][field] = field === "jobType" || field === "description" ? value : value.trim();
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
      if (!work.jobType) {
        newErrors[`jobType-${index}`] = "El tipo de trabajo no puede estar vacío.";
      }
      if (!work.company) {
        newErrors[`company-${index}`] = "La compañía no puede estar vacía.";
      }
      if (!work.startDate || isNaN(new Date(work.startDate).getTime())) {
        newErrors[`startDate-${index}`] = "La fecha de inicio es obligatoria y debe ser válida.";
      } else if (new Date(work.startDate) > new Date()) {
        newErrors[`startDate-${index}`] = "La fecha de inicio no puede ser posterior a la fecha actual.";
      }
      if (!work.description) {
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

  const totalPages = Math.ceil(tempWorkExperience.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = tempWorkExperience.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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

      {/* Lista de experiencias laborales paginada */}
      {currentItems.map((work, index) => {
        const globalIndex = startIndex + index;
        const hasError =
          errors[`jobType-${globalIndex}`] ||
          errors[`company-${globalIndex}`] ||
          errors[`startDate-${globalIndex}`] ||
          errors[`description-${globalIndex}`];

        return (
          <div
            key={globalIndex}
            className="rounded-md p-4 border space-y-3"
            style={{ borderColor: theme.palette.lightGray.hex }}
          >
            <div className="flex items-start gap-3">
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Tipo de trabajo
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Tipo de trabajo"
                    value={work.jobType}
                    onChange={(e) => handleInputChange(globalIndex, "jobType", e.target.value)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: errors[`jobType-${globalIndex}`] ? theme.palette.error.hex : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {work.jobType || "—"}
                  </p>
                )}

                {errors[`jobType-${globalIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`jobType-${globalIndex}`]}
                  </p>
                )}
              </div>


              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Fecha de inicio
                </label>

                {isEditing ? (
                  <input
                    type="date"
                    value={work.startDate}
                    onChange={(e) => handleInputChange(globalIndex, "startDate", e.target.value)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: errors[`startDate-${globalIndex}`] ? theme.palette.error.hex : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {work.startDate
                      ? new Date(work.startDate).toLocaleDateString("es-ES")
                      : "—"}
                  </p>
                )}

                {errors[`startDate-${globalIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`startDate-${globalIndex}`]}
                  </p>
                )}
              </div>


              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Fecha de finalización
                </label>

                {isEditing ? (
                  <input
                    type="date"
                    value={work.endDate || ""}
                    onChange={(e) => handleInputChange(globalIndex, "endDate", e.target.value)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {work.endDate
                      ? new Date(work.endDate).toLocaleDateString("es-ES")
                      : "—"}
                  </p>
                )}
              </div>


              {isEditing && (
                <div className="pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(globalIndex)}
                    className="text-white p-2 rounded-md transition duration-200"
                    style={{ backgroundColor: theme.palette.error.hex }}
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3">

              {/* Campo Compañía */}
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Compañía
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Compañía"
                    value={work.company}
                    onChange={(e) => handleInputChange(globalIndex, 'company', e.target.value)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {work.company || "—"}
                  </p>
                )}
                {errors[`company-${globalIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`company-${globalIndex}`]}
                  </p>
                )}
              </div>

              {/* Campo Descripción */}
              <div className="w-2/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Descripción
                </label>
                {isEditing ? (
                  <textarea
                    placeholder="Descripción"
                    value={work.description}
                    onChange={(e) => handleInputChange(globalIndex, 'description', e.target.value)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                      overflow: "hidden",
                      resize: "none",
                      height: "auto",
                    }}
                    rows={3}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent whitespace-pre-line"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {work.description || "—"}
                  </p>
                )}
                {errors[`description-${globalIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`description-${globalIndex}`]}
                  </p>
                )}
              </div>

            </div>

          </div>
        );
      })}

      {/* Paginación */}
      {tempWorkExperience.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Siguiente
          </button>
        </div>
      )}

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
