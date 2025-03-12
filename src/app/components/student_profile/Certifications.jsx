import React, { useState } from "react";
import { theme } from "../../constants/theme";

const Certifications = ({ certifications, setCertifications, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempCertifications, setTempCertifications] = useState([...certifications]); // Clona los datos originales
  const [deletedCertifications, setDeletedCertifications] = useState([]); // Guarda los eliminados

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Solo caracteres latinos

  // Editar directamente la cerificación sin crear una nueva entrada
  const handleCertificationChange = (index, e) => {
    const updateCertification = [...tempCertifications];
    updateCertification[index].certification = e.target.value.trim();
    setTempCertifications(updateCertification);
  }

  //Agregar una nueva certificación
  const handleAddCertification = () => {
    setTempCertifications([...tempCertifications, { certification: "" }]);
  }

  // Validar los datos
  const validateForm = () => {
    let newErrors = {}; 
    
    tempCertifications.forEach((certification, index) => {
      if (!certification.certification.trim()) {
        newErrors[`certification-${index}`] = "El campo no puede estar vacío.";
      } else if (!nameRegex.test(certification.certification)) {
        newErrors[`certification-${index}`] = "La certificación solo puede contener caracteres latinos.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Marcar una certificación para eliminación
  const handleDelete = (index) => {
    const certificationToDelete = tempCertifications[index];

    if (certifications.some((cert) => cert.certification === certificationToDelete.certification)) {
      setDeletedCertifications((prev) => [...prev, certificationToDelete]);
    }

    setTempCertifications(tempCertifications.filter((_, i) => i !== index));
  }

  // Guardar cambios correctamente sin duplicar certificaciones
  const handleSave = async () => {
    if (!validateForm()) return;

    try{
      if(deletedCertifications > 0){
        await onDelete({ certifications: deletedCertifications });
        setDeletedCertifications([]);
      }

      if(deletedCertifications > 0){
        await onSave({ certifications: tempCertifications });
        setCertifications(tempCertifications);
      }
    } catch (error) {
      console.error("Error al actualizar las certificaciones", error.message);
    }
  };

  // Cancelar cambios y restaurar valores originales
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
                  onChange={(e) => handleCertificationChange(index, e)}
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
                  onChange={(e) => handleCertificationChange(index, e)}
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
                  onChange={(e) => handleCertificationChange(index, e)}
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
                onClick={handleAddCertification}
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
  