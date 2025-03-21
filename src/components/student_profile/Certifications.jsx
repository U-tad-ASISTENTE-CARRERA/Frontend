import React, { useState } from "react";
import { theme } from "@/constants/theme";

const Certifications = ({ certifications, setCertifications, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempCertifications, setTempCertifications] = useState([...certifications]); 
  const [deletedCertifications, setDeletedCertifications] = useState([]); 

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Solo caracteres latinos

  const handleNameChange = (index, event) => {
    const updatedCertifications = [...tempCertifications]
    updatedCertifications[index].name = event.target.value.trim()
    setTempCertifications(updatedCertifications)
  }

  const handleDateChange = (index, event) => {
    const updatedCertifications = [...tempCertifications]
    updatedCertifications[index].date = event.target.value.trim()
    setTempCertifications(updatedCertifications)
  }
  
  const handleInstitutionChange = (index, event) => {
    const updatedCertifications = [...tempCertifications]
    updatedCertifications[index].institution = event.target.value.trim()
    setTempCertifications(updatedCertifications)
  }

  const addCertification = () => {
    setTempCertifications([...tempCertifications, { name: "", date: "", institution: ""}]);
  }

  const validateForm = () => {
    let newErrors = {}; 
    
    tempCertifications.forEach((cert, index) => {
      if (!cert.name.trim()) {
        newErrors[`certification-${index}`] = "El campo no puede estar vacío.";
        console.log("Something wrong")
      } else if (!nameRegex.test(cert.certification)) {
        newErrors[`certification-${index}`] = "La certificación solo puede contener caracteres latinos.";
        console.log("Something wrong 2")
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleDelete = (index) => {
    const certificationToDelete = tempCertifications[index];

    if (certifications.some((cert) => cert.name === certificationToDelete.name)) {
      setDeletedCertifications((prev) => [...prev, certificationToDelete]);
    }

    setTempCertifications(tempCertifications.filter((_, i) => i !== index));
  }

  const handleSave = async () => {    
    if (!validateForm()) return;

    try{
      if(deletedCertifications.length > 0){
        console.log("Eliminando certificaciones:", deletedCertifications)
        await onDelete({ certifications: deletedCertifications });
        setDeletedCertifications([]);
      }

      if(tempCertifications.length > 0){
        console.log("Enviando certificaciones:", tempCertifications)
        await onSave({ certifications: tempCertifications });
        setCertifications(tempCertifications);
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Error al actualizar las certificaciones", error.message);
    }
  };

  const handleCancel = () => {
    setTempCertifications([...certifications]);
    setDeletedCertifications([]); 
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      {/* Header con botón de edición */}
        <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
                Certificaciones
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

          {/* Mensaje cuando no hay certificaciones */}
          {tempCertifications.length === 0 && deletedCertifications.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No hay certificaciones guardadas.</p>
          )}

          {/* Lista de certificaciones */}
          {tempCertifications.map((certification, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Nombre */}
              <div className="w-2/5">
                <input
                  type="text"
                  placeholder="Nombre de la certificación"
                  value={certification.name}
                  onChange={(e) => handleNameChange(index, e)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />

                {errors[`certification-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`certification-${index}`]}</p>
                )}
              </div>

              {/* Fecha */}
              <div className="w-1/5">
                <input
                  type="text"
                  placeholder="Fecha de obtención"
                  value={certification.date}
                  onChange={(e) => handleDateChange(index, e)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                    color: theme.palette.text.hex,
                   }}
                  disabled={!isEditing}
                />

                {errors[`certification-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`certification-${index}`]}</p>
                )}
              </div>

              {/* Institución */}
              <div className="w-2/5">
                <input
                  type="text"
                  placeholder="Nombre de la institución"
                  value={certification.institution}
                  onChange={(e) => handleInstitutionChange(index, e)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />

                {errors[`certification-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`certification-${index}`]}</p>
                )}
              </div>

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
                    ✕
                  </button>
              )}
            </div>
          ))}

          {/* Botón para añadir nuevos idiomas */}
            {isEditing && (
              <button
                type="button"
                onClick={addCertification}
                className="w-full px-4 py-2 text-white rounded-md transition duration-200"
                style={{
                  backgroundColor: theme.palette.primary.hex,
                  fontWeight: "bold",
                 }}
              >
                Añadir Certificación
              </button>
            )}
      </div>
  );
};
  
export default Certifications;
  