import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { op_skill } from "@/constants/op_skill";
import { op_level_skill } from "@/constants/level_skill";
import { FaTrash } from "react-icons/fa";

const ProgrammingLanguages = ({ skills, setSkills, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [e, setE] = useState({})
  const [tempSkills, setTempSkills] = useState([...skills])
  const [deletedSkills, setDeletedSkills] = useState([])
  const [skillSearch, setSkillSearch] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState({})
     
  const handleLevelChange = (index, event) => {
    const updateSkill = [...tempSkills]
    updateSkill[index].level = event.target.value
    setTempSkills(updateSkill)
  }

  const handleSkillChange = (index, event) => {
      const updateSkill = [...tempSkills]
      updateSkill[index].skill = event
      setTempSkills(updateSkill)
  }

  const addSkill = () => {
    setTempSkills([...tempSkills, {skill: "", level: "Bajo"}])
  }

  const handleDeleteSkill = (index) => {
    const skillDelete = tempSkills[index]

    if(skills.some((sk) => sk.skill === skillDelete.skill)) {
      setDeletedSkills((prev) => [...prev, skillDelete])
    }

    setTempSkills(tempSkills.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    let newErrors = {}
    tempSkills.forEach((sk, index) => {
      if(!sk.skill.trim()){
        newErrors[`skill-${index}`] = "El campo no puede estar vacío."
      }else if (!op_skill.includes(sk.skill)){
        newErrors[`language-${index}`] = "Selecciona un idioma válido de la lista.";
      }  else if(tempSkills.filter((s) => (s.skill === sk.skill)).length > 1){
        newErrors[`skill-${index}`] = "El lenguaje ya ha sido añadido."
      }
    })
    setE(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handldeSave = async () => {
    if(!validateForm()) return
    try{
      if(deletedSkills.length > 0){
        console.log("Eliminando skill:", deletedSkills)
        await onDelete({skills: deletedSkills})
        setDeletedSkills([])
      }

      if(tempSkills.length > 0){
        console.log("Enviando skills:", tempSkills)
        await onSave({skills: tempSkills})
        setSkills(tempSkills)
      }

      setIsEditing(false)
    } catch(error){
      console.error("Error al actualizar skills:", error.message)
    }
  }

  const filterOptions = (input) => {
    return op_skill.filter((lang) =>
      lang.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleCancel = () => {
    setTempSkills([...skills])
    setDeletedSkills([])
    setE({})
    setIsEditing(false)
  }
    
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
        
        {/* Lista de lenguajes de programación */}

        {tempSkills.map((sk, index) => {
          const filter_skill = filterOptions(skillSearch[index] || "")
          const hassError = e[`skill-${index}`]

          return(
            <div 
              key={index} 
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
                        value={skillSearch[index] || sk.skill}
                        onChange={(e) => {
                          const value = e.target.value
                          setSkillSearch({...skillSearch, [index]: value})
                          handleSkillChange(index, "")
                          setDropdownOpen({...dropdownOpen, [index]: true})
                        }}
                        onFocus={() => setDropdownOpen({...dropdownOpen, [index]: true})}
                        onBlur={() => setTimeout(() => setDropdownOpen((prev) => ({ ...prev, [index]: false })), 150)}
                        className="block w-full p-2 border rounded-md"
                        style={{
                          borderColor: hassError  
                          ? theme.palette.error.hex
                          : theme.palette.primary.hex,
                          color: theme.palette.text.hex,
                        }}
                      />
                      {dropdownOpen[index] && filter_skill.length > 0 && (
                        <ul className="absolute z-10 w-full border rounded-md mt-1 max-h-32 overflow-auto bg-white shadow">
                          {filter_skill.map((op) => (
                            <li
                              key={op}
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                              onMouseDown={() => {
                                handleSkillChange(index, op)
                                setSkillSearch({...skillSearch, [index]: op})
                                setDropdownOpen({...dropdownOpen, [index]: false})
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
                      value={sk.skill}
                      disabled
                      className="block w-full p-2 border rounded-md bg-gray-100"
                      style={{ color: theme.palette.text.hex }}
                    />
                  )}
                  {hassError && (
                    <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                      {e[`skill-${index}`]}
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
                    onChange={(e) => handleLevelChange(index, e)}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                      color: theme.palette.text.hex,
                    }}
                    disabled={!isEditing}
                  >
                    {op_level_skill.map((op, i) => (
                      <option key={i} value={op}>{op}</option>
                    ))}
                  </select>
                </div>

                {isEditing && (
                  <div className="pt-6 mt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(index)}
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