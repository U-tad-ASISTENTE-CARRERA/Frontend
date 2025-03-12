import React, { useState } from "react";
import { theme } from "../../constants/theme";

const WorkExperience = ({ workExperience, setWorkExperience, onSave, onDelete }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempWorkExperience, setTempWorkExperience] = useState([...workExperience]); // Clona los datos originales
  const [deletedWorkExperience, setDeletedWorkExperience] = useState([]); // Guarda los eliminados
  
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Solo caracteres latinos

  // Editar directamente la experiencia laboral sin crear una nueva entrada
  const handleWorkExperienceChange = (index, e) => {
    const updatedWorkExperience = [...tempWorkExperience];
    updatedWorkExperience[index].workExperience = e.target.value.trim();
    setTempWorkExperience(updatedWorkExperience);
  }

  const handleAddworkExperience = () => {
    setTempWorkExperience([...tempWorkExperience, { workExperience: "" }]);
  }

  // Validar los datos
  const validateForm = () => {
    let newErrors = {}; 
    
    tempWorkExperience.forEach((workExperience, index) => {
      if (!workExperience.workExperience.trim()) {
        newErrors[`workExperience-${index}`] = "El campo no puede estar vacío.";
      } else if (!nameRegex.test(workExperience.workExperience)) {
        newErrors[`workExperience-${index}`] = "La experiencia laboral solo puede contener caracteres latinos.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Guardar cambios correctamente sin duplicar experiencias laborales
  const handleSave = async () => {
    if (!validateForm()) return;

    try{
      if(deletedWorkExperience > 0){
        await onDelete({ workExperience: deletedWorkExperience });
        setDeletedWorkExperience([]);
      }

      if(deletedWorkExperience > 0){
        await onSave({ workExperience: tempWorkExperience });
        setWorkExperience(tempWorkExperience);
      }
    } catch (error) {
      console.error("Error al actualizar las experiencias laborales", error.message);
    }
  };

  // Marcar una experiencia laboral para eliminación
  const handleDelete = (index) => { 
    const workExperienceToDelete = tempWorkExperience[index];

    if (workExperience.some((work) => work.workExperience === workExperienceToDelete.workExperience)) {
      setDeletedWorkExperience((prev) => [...prev, workExperienceToDelete]);
    }

    setDeletedWorkExperience(tempWorkExperience.filter((_, i) => i !== index));
  }

  // Cancelar la edición
  const handleCancel = () => {
    setDeletedWorkExperience([...workExperience]);
    setDeletedWorkExperience([]); // Restaurar eliminados
    setErrors({});
    setIsEditing(false);
  };

  return(
    <div className="space-y-4 p-4 bg-white rounded-lg">
      {/* Header con botón de edición */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
            Experiencias Laborales
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

        {/* Mensaje cuando no haya experiencia laboral*/}
        {tempWorkExperience.length === 0 && deletedWorkExperience.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No hay Experiencias guardadas.</p>
          )}

        {/* Lista de experiencia laboral */}
        {tempWorkExperience.map((workExperience, index) => (
          <form key={index} className="flex items-center gap-3">
            {/* Tipo de Trabajo */}
            <div className="w-1/4">
              <label className="block text-sm font-medium">Tipo de Trabajo</label>
              <input
                type="text"
                placeholder="Tipo de trabajo"
                className="block w-full p-2 border rounded-md transition-all"
                value={workExperience.jobType}
                onChange={(e) => {handleWorkExperienceChange(index, e)}}
                disabled={!isEditing}
              />
              {errors[`workExperience-${index}`] && (
                <span className="text-xs text-red-500">{errors[`workExperience-${index}`]}</span>
              )}
            </div>

            {/*<div>
            <label className="block text-sm font-medium">Fecha de entrada</label>
              <input
                type="text"
                placeholder="Fecha de entrada"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={workExperience.startDate}
                onChange={(e) => {handleWorkExperienceChange(index, e)}}
                disabled={!isEditing}
              />
              {errors[`workExperience-${index}`] && (
                <span className="text-xs text-red-500">{errors[`workExperience-${index}`]}</span>
              )}
            </div>*/}

            <div className="w-1/4">
              <label className="block text-sm font-medium">Compañia</label>
              <input
                type="text"
                placeholder="Compañia"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={workExperience.company}
                onChange={(e) => {handleWorkExperienceChange(index, e)}}
                disabled={!isEditing}
              />
              {errors[`workExperience-${index}`] && (
                <span className="text-xs text-red-500">{errors[`workExperience-${index}`]}</span>
              )}
            </div>

            {/*<div>
              <label className="block text-sm font-medium">Fecha de salida</label>
              <input
                type="text"
                placeholder="Fecha de finalización"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={workExperience.endDate}
                onChange={(e) => {handleWorkExperienceChange(index, e)}}
                disabled={!isEditing}
              />
              {errors[`workExperience-${index}`] && (
                <span className="text-xs text-red-500">{errors[`workExperience-${index}`]}</span>
              )}
            </div>*/}

            <div className="w-1/4">
              <label className="block text-sm font-medium">Descripción</label>
              <input
                type="text"
                placeholder="Descripción"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={workExperience.description}
                onChange={(e) => {handleWorkExperienceChange(index, e)}}
                disabled={!isEditing}
              />
              {errors[`workExperience-${index}`] && (
                <span className="text-xs text-red-500">{errors[`workExperience-${index}`]}</span>
              )}
            </div>

            {/*<div>
              <input
                type="text"
                placeholder="Responsabilidades"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={workExperience.responsibilities}
                onChange={(e) => {handleWorkExperienceChange(index, e)}}
                disabled={!isEditing}
              />
              {errors[`workExperience-${index}`] && (
                <span className="text-xs text-red-500">{errors[`workExperience-${index}`]}</span>
              )}
            </div>*/}

            <div className="w-1/5">
              <label className="block text-sm font-medium">Estado</label>
                <select
                  name="endDate"
                  defaultValue={
                    workExperience.endDate === "" ? "En vigor" : "Finalizado"
                  }
                  className="w-full p-2 border rounded-md"
                  style={{
                    borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                >
                  
                  <option className="text-green-500">En vigor</option>
                  <option className="text-red-500">Finalizado</option>
              </select>
            </div>

            {/* Botón de eliminar */}
            {isEditing && (
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="mt-4 px-3 py-2 text-sm text-white rounded-md transition duration-200"
                style={{
                  backgroundColor: theme.palette.error.hex,
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            )}
          </form>
        ))}

        {/* Botón para añadir nuevos idiomas */}
        {isEditing && (
          <button
            type="button"
            onClick={handleAddworkExperience}
            className="w-full px-4 py-2 text-white rounded-md transition duration-200"
            style={{
              backgroundColor: theme.palette.primary.hex,
              fontWeight: "bold",
            }}
          >
            Añadir Experiencia Laboral
          </button>
        )}
    </div>
    );
  };
  
  export default WorkExperience;
  