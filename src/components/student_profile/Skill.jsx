import React, { useState } from "react";
import { theme } from "@/constants/theme";

const Skill =({skills, setSkills, onSave, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [e, setE] = useState({})
    const [tempSkills, setTempSkills] = useState([...skills])
    const [deletedSkills, setDeletedSkills] = useState([])

    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/

    const op_skill = ["C++", "C#", "C", "Python", "R", "React", "Next", "JavaScript",
      "Java", "Scala", "HTML", "CSS", "Rust", "Bash", "Sql", "Ruby", "Keras", "Tableau",
      "Spark", "Mongo", "MariaDb", "p5.js"
     ]
     
    const handleSkillChange = (index, event) => {
        const updateSkill = [...tempSkills]
        updateSkill[index].skill = event.target.value.trim()
        setTempSkills(updateSkill)
    }

    const addSkill = () => {
        setTempSkills([...tempSkills, {skill: ""}])
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
            if (!sk.skill.trim()){
                newErrors[`skill-${index}`] = "El campo no puede estar vacío."
            } else if (!nameRegex.test(sk.skill)){
                newErrors[`skill-${index}`] = "El campo solo puede contener caracteres latinos"
            }
        })

        setE(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handldeSave = async () => {
        if (!validateForm()) return

        try{
            if(deletedSkills.length > 0){
                console.log("Eliminando skill:", deletedSkills)
                await onDelete({skills: tempSkills})
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
        
          {/* Lista de lenguajes de Programación */}
          {tempSkills.map((sk, index) => (
            <div key={index} className="flex items-center gap-4">
              <select
                name="skill"
                value = {sk.skill}
                onChange={(event) => handleSkillChange(index, event)}
                className="w-full p-2 border rounded-md"
                style={{
                  borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                  color: theme.palette.text.hex,
                }}
                disabled={!isEditing}
              >
                
              </select>
        
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
    </>
    );
};

export default Skill;