import React, { useState } from "react";
import { theme } from "@/constants/theme";

const ProgrammingLanguages = ({ skills, setSkills, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempSkills, setTempSkills] = useState([...skills]);
  const [deletedSkills, setDeletedSkills] = useState([]);

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;

  const handleSkillsChange = (index, e) => {
    const updateSkills = [...tempSkills];
    updateSkills[index].skill = e.target.value.trim();
    setTempSkills(updateSkills);
  };

  const handleAddSkills = () => {
    setTempSkills([...tempSkills, { skill: "" }]);
  };

  const validateForm = () => {
    let newErrors = {};
    tempSkills.forEach((lang, index) => {
      if (!lang.skill.trim()) {
        newErrors[`skill-${index}`] = "El campo no puede estar vacío.";
      } else if (!nameRegex.test(lang.skills)) {
        newErrors[`skill-${index}`] = "El lenguaje de programación solo puede contener caracteres latinos.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleDelete = (index) => {
    const skillsToDelete = tempSkills[index];

    if (skills.some((lang) => lang.skill === skillsToDelete.skill)) {
      setDeletedSkills((prev) => [...prev, skillsToDelete]);
    }

    setTempSkills(tempSkills.filter((_, i) => i !== index));
  }

  const handleSave = async () => {
    if (!validateForm()) return;

    try{
      if(deletedSkills.length > 0){
        await onDelete({ skills: deletedSkills });
        setDeletedSkills([]);
      }

      if(tempSkills.length >0){
        await onSave({ skills: tempSkills });
        setSkills(tempSkills);
      }
        
      setIsEditing(false);
    } catch (error){
      console.error(error);
    }
  }

  const handleCancel = () => {  
    setTempSkills([...skills]);
    setDeletedSkills([]);
    setErrors({});
    setIsEditing(false);
  }
  
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      {/* Header con botón de edición */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
            Lenguajes de Programación
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

        {/* Mensaje cuando no hay lenguajes de programación */}
        {tempSkills.length === 0 && deletedSkills.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No hay Lenguajes de programación guardadas.</p>
        )}

        {/* Lista de lenguajes de Programación */}
        {tempSkills.map((lang, index) => (
        <div key={index} className="flex items-center gap-4">
          <input
            type="text"
            value={lang.skills}
            onChange={(e) => handleSkillsChange(index, e)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            disabled={!isEditing}
          />

          {/* Botón de eliminar */}
          {isEditing && (
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="px-3 py-2 text-sm text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.error.hex,
                fontWeight: "bold",
              }}
            >
              X
            </button>
          )}
        </div>
      ))}

      {/* Botón para añadir un nuevo lenguaje de programación */}
      {isEditing && (
        <button
          type="button"
          onClick={handleAddSkills}
          className="w-full px-4 py-2 text-white rounded-md transition duration-200"
          style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
        >
          Añadir lenguaje de programación
        </button>
      )}
    </div>
  );
};
  
export default ProgrammingLanguages;
  