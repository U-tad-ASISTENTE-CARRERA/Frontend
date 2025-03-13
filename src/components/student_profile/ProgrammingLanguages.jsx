import React, { useState } from "react";
import { theme } from "@/constants/theme";

const ProgrammingLanguages = ({ programmingLanguages, setProgrammingLanguages, onSave, onDelete }) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [tempProgrammingLanguages, setTempProgrammingLanguages] = useState([...programmingLanguages]);
    const [deletedProgrammingLanguages, setDeletedProgrammingLanguages] = useState([]);

    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;

    const handleProgrammingLanguagesChange = (index, e) => {
      const updateLanguagesProgramming = [...tempProgrammingLanguages];
      updateLanguagesProgramming[index].skills = e.target.value.trim();
      setTempProgrammingLanguages(updateLanguagesProgramming);
    };

    const handleAddProgrammingLanguages = () => {
      setTempProgrammingLanguages([...tempProgrammingLanguages, { skills: "" }]);
    };

    const validateForm = () => {
      let newErrors = {};
      tempProgrammingLanguages.forEach((lang, index) => {
        if (!lang.skills.trim()) {
          newErrors[`skills-${index}`] = "El campo no puede estar vacío.";
        } else if (!nameRegex.test(lang.skills)) {
          newErrors[`skills-${index}`] = "El lenguaje de programación solo puede contener caracteres latinos.";
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    const handleDelete = (index) => {
      const programmingLanguagesToDelete = tempProgrammingLanguages[index];

      if (programmingLanguages.some((lang) => lang.skills === programmingLanguagesToDelete.skills)) {
        setDeletedProgrammingLanguages((prev) => [...prev, programmingLanguagesToDelete]);
      }

      setTempProgrammingLanguages(tempProgrammingLanguages.filter((_, i) => i !== index));
    }

    const handleSave = async () => {
      if (!validateForm()) return;

      try{
        if(deletedProgrammingLanguages > 0){
          await onDelete({ programmingLanguages: deletedProgrammingLanguages });
          setDeletedProgrammingLanguages([]);
        }

        if(tempProgrammingLanguages.length >0){
          await onSave({ programmingLanguages: tempProgrammingLanguages });
          setProgrammingLanguages(tempProgrammingLanguages);
        }
        
        setIsEditing(false);
      } catch (error){
        console.error(error);
      }
    }

    const handleCancel = () => {  
      setTempProgrammingLanguages([...programmingLanguages]);
      setDeletedProgrammingLanguages([]);
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
        {tempProgrammingLanguages.length === 0 && deletedProgrammingLanguages.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No hay Lenguajes de programación guardadas.</p>
        )}

        {/* Lista de lenguajes de Programación */}
        {tempProgrammingLanguages.map((lang, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="text"
              value={lang.skills}
              onChange={(e) => handleProgrammingLanguagesChange(index, e)}
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
            onClick={handleAddProgrammingLanguages}
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
  