import React, { useState } from "react";
import { theme } from "@/constants/theme";

const Languages = ({ languages, setLanguages, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempLanguages, setTempLanguages] = useState([...languages]); // Clona los datos originales
  const [deletedLanguages, setDeletedLanguages] = useState([]); // Guarda los eliminados

  const op_level = ["A1", "A2", "B1", "B2", "C1", "C2"]

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Solo caracteres latinos

  // Editar directamente el idioma sin crear una nueva entrada
  const handleLanguageChange = (index, event) => {
    const updatedLanguages = [...tempLanguages];
    updatedLanguages[index].language = event.target.value.trim(); // Edita directamente
    setTempLanguages(updatedLanguages);
  };

  // Editar el nivel del idioma
  const handleLevelChange = (index, event) => {
    const updatedLanguages = [...tempLanguages];
    updatedLanguages[index].level = event.target.value;
    setTempLanguages(updatedLanguages);
  };

  // Agregar un nuevo idioma sin duplicar
  const addLanguage = () => {
    setTempLanguages([...tempLanguages, { language: "", level: "A1" }]);
  };

  // Marcar un idioma para eliminación
  const markLanguageForDeletion = (index) => {
    const languageToDelete = tempLanguages[index];

    // Si el idioma ya estaba en la BD, marcarlo para eliminarlo
    if (languages.some((lang) => lang.language === languageToDelete.language)) {
      setDeletedLanguages((prev) => [...prev, languageToDelete]);
    }

    // Removerlo de la UI temporalmente
    setTempLanguages(tempLanguages.filter((_, i) => i !== index));
  };

  // Validar que los datos sean correctos antes de enviarlos
  const validateForm = () => {
    let newErrors = {};
    tempLanguages.forEach((lang, index) => {
      if (!lang.language.trim()) {
        newErrors[`language-${index}`] = "El campo no puede estar vacío.";
      } else if (!nameRegex.test(lang.language)) {
        newErrors[`language-${index}`] = "El idioma solo puede contener caracteres latinos.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar cambios correctamente sin duplicar idiomas
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Si se eliminaron idiomas, hacer DELETE primero
      if (deletedLanguages.length > 0) {
        console.log("📤 Eliminando idiomas:", deletedLanguages);
        await onDelete({ languages: deletedLanguages });
        setDeletedLanguages([]);
      }

      // Si hay idiomas para actualizar, hacer PATCH
      if (tempLanguages.length > 0) {
        console.log("📤 Enviando PATCH con:", tempLanguages);
        await onSave({ languages: tempLanguages });
        setLanguages(tempLanguages);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar idiomas:", error.message);
    }
  };

  // Cancelar cambios y restaurar valores originales
  const handleCancel = () => {
    setTempLanguages([...languages]);
    setDeletedLanguages([]); // Restaurar eliminados
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      {/* Header con botón de edición */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
          Añadir idiomas
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

      {/* Mensaje cuando no hay idiomas */}
      {tempLanguages.length === 0 && deletedLanguages.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No hay idiomas guardados.</p>
      )}

      {/* Lista de idiomas */}
      {tempLanguages.map((lang, index) => (
        <div key={index} className="flex items-center gap-3">
          {/* Idioma */}
          <div className="w-3/4">
            <label className="block text-sm font-medium">Idioma</label>
            <input
              type="text"
              placeholder="Idioma"
              value={lang.language}
              onChange={(event) => handleLanguageChange(index, event)}
              className="block w-full p-2 border rounded-md"
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                color: theme.palette.text.hex,
              }}
              disabled={!isEditing}
            />
            {errors[`language-${index}`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`language-${index}`]}</p>
            )}
          </div>

          {/* Nivel */}
          <div className="w-1/4">
            <label className="block text-sm font-medium">Nivel</label>
            <select
              name="level"
              value={lang.level}
              onChange={(event) => handleLevelChange(index, event)}
              className="w-full p-2 border rounded-md"
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                color: theme.palette.text.hex,
              }}
              disabled={!isEditing}
            >
             {op_level.map((op, index) =>(
              <option key={index} value={op}>
                {op}
              </option>
             ))
             }
            </select>
          </div>

          {/* Botón de eliminar */}
          {isEditing && (
            <button
              type="button"
              onClick={() => markLanguageForDeletion(index)}
              className="px-3 py-2 text-sm text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.error.hex,
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {/* Botón para añadir nuevos idiomas */}
      {isEditing && (
        <button
          type="button"
          onClick={addLanguage}
          className="w-full px-4 py-2 text-white rounded-md transition duration-200"
          style={{
            backgroundColor: theme.palette.primary.hex,
            fontWeight: "bold",
          }}
        >
          Añadir idioma
        </button>
      )}
    </div>
  );
};

export default Languages;
