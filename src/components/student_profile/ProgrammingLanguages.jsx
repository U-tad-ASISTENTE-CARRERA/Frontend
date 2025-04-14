import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { op_skill } from "@/constants/op_skill";
import { op_level_skill } from "@/constants/level_skill";
import { FaTrash } from "react-icons/fa";

const ProgrammingLanguages = ({ skills, setSkills, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [e, setE] = useState({});
  const [tempSkills, setTempSkills] = useState([]);
  const [deletedSkills, setDeletedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const levelMap = {
    low: op_level_skill[0],
    medium: op_level_skill[1],
    high: op_level_skill[2],
  };

  const reverseLevelMap = Object.fromEntries(
    Object.entries(levelMap).map(([key, value]) => [value, key])
  );

  const convertLanguage = (level) => levelMap[level] || op_level_skill[0];

  useEffect(() => {
    const initializedSkills = skills.map((skill) => ({
      _id: skill._id || null,
      name: skill.name || "",
      level: convertLanguage(skill.level),
    }));
    setTempSkills(initializedSkills);

    const initializedSearch = initializedSkills.reduce((acc, skill, index) => {
      acc[index] = skill.name;
      return acc;
    }, {});
    setSkillSearch(initializedSearch);
  }, [skills]);

  const totalPages = Math.ceil(tempSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = tempSkills.slice(startIndex, startIndex + itemsPerPage);
     
  const handleLevelChange = (index, event) => {
    const updatedSkills = [...tempSkills];
    updatedSkills[index].level = event.target.value;
    setTempSkills(updatedSkills);
  }

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...tempSkills];
    updatedSkills[index].name = value;
    setTempSkills(updatedSkills);
  }

  const addSkill = () => {
    setTempSkills([...tempSkills, { _id: null, name: "", level: op_level_skill[0] }]);
  }

  const handleDeleteSkill = (index) => {
    const skillToDelete = tempSkills[index];
    if (skills.some((sk) => sk._id === skillToDelete._id)) {
      setDeletedSkills((prev) => [...prev, skillToDelete]);
    }
    setTempSkills(tempSkills.filter((_, i) => i !== index));
  }

  const validateForm = () => {
    const newErrors = {};
    tempSkills.forEach((sk, index) => {
      if (!sk.name.trim()) {
        newErrors[`skill-${index}`] = "El campo no puede estar vacío.";
      } else if (!op_skill.includes(sk.name)) {
        newErrors[`language-${index}`] = "Selecciona un idioma válido de la lista.";
      } else if (tempSkills.filter((s) => s.name === sk.name).length > 1) {
        newErrors[`skill-${index}`] = "El lenguaje ya ha sido añadido.";
      }
    });
    setE(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handldeSave = async () => {
    if (!validateForm()) return;
    console.log("Validación exitosa");
    try {
      const formattedSkills = tempSkills.map((skill) => ({
        ...skill,
        level: reverseLevelMap[skill.level],
      }));

      if (deletedSkills.length > 0) {
        await onDelete({ skills: deletedSkills });
        setDeletedSkills([]);
      }
      if (formattedSkills.length > 0) {
        await onSave({ skills: formattedSkills });
        setSkills(formattedSkills);
      }
      console.log("Skills actualizadas:", formattedSkills);
      setIsEditing(false);
    } catch (error) {
      console.log("Error al guardar skills:", error.message);
      console.error("Error al actualizar skills:", error.message);
    }
  }

  const filterOptions = (input) => {
    return op_skill.filter((lang) =>
      lang.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleCancel = () => {
    const resetSkills = skills.map((skill) => ({
      _id: skill._id || null,
      name: skill.name || "",
      level: convertLanguage(skill.level),
    }));
    setTempSkills(resetSkills);

    const resetSearch = resetSkills.reduce((acc, skill, index) => {
      acc[index] = skill.name || "";
      return acc;
    }, {});
    setSkillSearch(resetSearch);

    setDeletedSkills([]);
    setE({});
    setIsEditing(false);
  }

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
    
  return(
    <>
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
                onClick={handldeSave}
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
        
        {/* Lista de lenguajes de programación paginada */}
        {currentItems.map((sk, index) => {
          const globalIndex = startIndex + index;
          const filter_skill = filterOptions(skillSearch[globalIndex] || "");
          const hasError = e[`skill-${globalIndex}`];

          return(
            <div 
              key={globalIndex} 
              className="rounded-md  p-4 border space-y-3"
              style={{borderColor: theme.palette.lightGray.hex}}
              >
              
              <div className="flex items-start gap-3">
                <div className="w-3/4 relative space-y-1">
                  <label className="test-sm font-medium" style={{ color: theme.palette.text.hex }}>
                    Lenguaje de programación
                  </label>

                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        placeholder="Buscar lenguaje de programación..."
                        value={sk.name}
                        onChange={(e) => {
                          const value = e.target.value
                          setSkillSearch({...skillSearch, [globalIndex]: value})
                          handleSkillChange(globalIndex, "")
                          setDropdownOpen({...dropdownOpen, [globalIndex]: true})
                        }}
                        onFocus={() => setDropdownOpen({...dropdownOpen, [globalIndex]: true})}
                        onBlur={() => setTimeout(() => setDropdownOpen((prev) => ({ ...prev, [globalIndex]: false })), 150)}
                        className="block w-full p-2 border rounded-md"
                        style={{
                          borderColor: hasError  
                          ? theme.palette.error.hex
                          : theme.palette.primary.hex,
                          color: theme.palette.text.hex,
                        }}
                      />
                      {dropdownOpen[globalIndex] && filter_skill.length > 0 && (
                        <ul className="absolute z-10 w-full border rounded-md mt-1 max-h-32 overflow-auto bg-white shadow">
                          {filter_skill.map((op) => (
                            <li
                              key={op}
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                              onMouseDown={() => {
                                handleSkillChange(globalIndex, op)
                                setSkillSearch({...skillSearch, [globalIndex]: op})
                                setDropdownOpen({...dropdownOpen, [globalIndex]: false})
                              }}
                            >
                              {op}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) :(
                    <input
                      type="text"
                      value={sk.name}
                      disabled
                      className="block w-full p-2 border rounded-md bg-gray-100"
                      style={{ color: theme.palette.text.hex }}
                    />
                  )}
                  {hasError && (
                    <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                      {e[`skill-${globalIndex}`]}
                    </p>
                  )}
                </div>

                <div className="w-1/4 space-y-1">
                  <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                    Nivel
                  </label>

                  <select
                    name="level"
                    value={sk.level}
                    onChange={(e) => handleLevelChange(globalIndex, e)}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                      color: theme.palette.text.hex,
                    }}
                    disabled={!isEditing}
                  >
                    {op_level_skill.map((level, i) => (
                      <option key={i} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {isEditing && (
                  <div className="pt-6 mt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(globalIndex)}
                      className="text-white p-2 rounded-md transition duration-200"
                      style={{ backgroundColor: theme.palette.error.hex }}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Paginación */}
        {tempSkills.length > itemsPerPage && (
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
        
        {/* Botón para añadir un nuevo lenguaje de programación */}
        {isEditing && (
          <button
            type="button"
            onClick={addSkill}
            className="w-full px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
          >
            Añadir lenguaje de programación
          </button>
        )}
      </div>
    </>
  );
};
  
export default ProgrammingLanguages;