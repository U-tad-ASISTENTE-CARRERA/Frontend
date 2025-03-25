import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { op_level } from "@/constants/opLevel";
import { availableLanguages } from "@/constants/availableLanguages";
import { FaTrash } from "react-icons/fa";

const Languages = ({ languages, setLanguages, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempLanguages, setTempLanguages] = useState([...languages]);
  const [deletedLanguages, setDeletedLanguages] = useState([]);
  const [languageSearch, setLanguageSearch] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});

  const handleLanguageChange = (index, value) => {
    const updated = [...tempLanguages];
    updated[index].language = value;
    setTempLanguages(updated);
  };

  const handleLevelChange = (index, event) => {
    const updated = [...tempLanguages];
    updated[index].level = event.target.value;
    setTempLanguages(updated);
  };

  const addLanguage = () => {
    setTempLanguages([...tempLanguages, { language: "", level: "A1" }]);
  };

  const markLanguageForDeletion = (index) => {
    const languageToDelete = tempLanguages[index];
    if (languages.some((lang) => lang.language === languageToDelete.language)) {
      setDeletedLanguages((prev) => [...prev, languageToDelete]);
    }
    setTempLanguages(tempLanguages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let newErrors = {};
    tempLanguages.forEach((lang, index) => {
      if (!lang.language.trim()) {
        newErrors[`language-${index}`] = "El campo no puede estar vacío.";
      } else if (!availableLanguages.includes(lang.language)) {
        newErrors[`language-${index}`] = "Selecciona un idioma válido de la lista.";
      } else if (tempLanguages.filter((l) => (l.language === lang.language)).length > 1) {
        newErrors[`language-${index}`] = "El idioma ya ha sido añadido.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (deletedLanguages.length > 0) {
        await onDelete({ languages: deletedLanguages });
        setDeletedLanguages([]);
      }
      if (tempLanguages.length > 0) {
        await onSave({ languages: tempLanguages });
        setLanguages(tempLanguages);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar idiomas:", error.message);
    }
  };

  const handleCancel = () => {
    setTempLanguages([...languages]);
    setDeletedLanguages([]);
    setErrors({});
    setIsEditing(false);
  };

  const filterOptions = (input) => {
    return availableLanguages.filter((lang) =>
      lang.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div className="space-y-4 p-4">
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

      {tempLanguages.length === 0 && deletedLanguages.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No hay idiomas guardados.</p>
      )}




      {tempLanguages.map((lang, index) => {
        const filtered = filterOptions(languageSearch[index] || "");
        const hasError = errors[`language-${index}`];

        return (
          <div
            key={index}
            className="rounded-md border p-4 space-y-3 bg-white"
            style={{
              borderColor: theme.palette.lightGray.hex,
            }}
          >


            <div className="flex items-start gap-3">
              {/* Campo de idioma */}
              <div className="w-3/4 relative space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Idioma
                </label>

                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Buscar idioma..."
                      value={languageSearch[index] || lang.language}
                      onChange={(e) => {
                        const value = e.target.value;
                        setLanguageSearch({ ...languageSearch, [index]: value });
                        handleLanguageChange(index, "");
                        setDropdownOpen({ ...dropdownOpen, [index]: true });
                      }}
                      onFocus={() => setDropdownOpen({ ...dropdownOpen, [index]: true })}
                      onBlur={() =>
                        setTimeout(() => setDropdownOpen((prev) => ({ ...prev, [index]: false })), 150)
                      }
                      className="block w-full p-2 border rounded-md"
                      style={{
                        borderColor: hasError
                          ? theme.palette.error.hex
                          : theme.palette.primary.hex,
                        color: theme.palette.text.hex,
                      }}
                    />
                    {dropdownOpen[index] && filtered.length > 0 && (
                      <ul className="absolute z-10 w-full border rounded-md mt-1 max-h-32 overflow-auto bg-white shadow">
                        {filtered.map((option) => (
                          <li
                            key={option}
                            onMouseDown={() => {
                              handleLanguageChange(index, option);
                              setLanguageSearch({ ...languageSearch, [index]: option });
                              setDropdownOpen({ ...dropdownOpen, [index]: false });
                            }}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={lang.language}
                    disabled
                    className="block w-full p-2 border rounded-md bg-gray-100"
                    style={{ color: theme.palette.text.hex }}
                  />
                )}
                {hasError && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`language-${index}`]}
                  </p>
                )}
              </div>

              {/* Campo de nivel */}
              <div className="w-1/4 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Nivel
                </label>
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
                  {op_level.map((op, i) => (
                    <option key={i} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              {/* Botón de eliminar */}
              {isEditing && (
                <div className="pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => markLanguageForDeletion(index)}
                    className="text-white p-2 rounded-md transition duration-200"
                    style={{ backgroundColor: theme.palette.error.hex }}
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}



      {isEditing && (
        <button
          type="button"
          onClick={addLanguage}
          className="w-full px-4 py-2 text-white rounded-md transition duration-200"
          style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
        >
          Añadir idioma
        </button>
      )}
    </div>
  );
};

export default Languages;
