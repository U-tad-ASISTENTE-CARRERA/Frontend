import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { nameRegex } from "@/utils/ValidatorRegex";
import { FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const Certifications = ({ certifications, setCertifications, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempCertifications, setTempCertifications] = useState([...certifications]);
  const [deletedCertifications, setDeletedCertifications] = useState([]);

  const handleNameChange = (index, event) => {
    const updatedCertifications = [...tempCertifications];
    updatedCertifications[index].name = event.target.value.trim();
    setTempCertifications(updatedCertifications);
  };

  const handleDateChange = (index, event) => {
    const updatedCertifications = [...tempCertifications];
    updatedCertifications[index].date = event.target.value.trim();
    setTempCertifications(updatedCertifications);
  };

  const handleInstitutionChange = (index, event) => {
    const updatedCertifications = [...tempCertifications];
    updatedCertifications[index].institution = event.target.value.trim();
    setTempCertifications(updatedCertifications);
  };

  const addCertification = () => {
    setTempCertifications([
      ...tempCertifications,
      { uuid: uuidv4(), name: "", date: "", institution: "" },
    ]);
  };

  const validateForm = () => {
    let newErrors = {};

    tempCertifications.forEach((cert, index) => {
      // Validar nombre
      if (!cert.name.trim()) {
        newErrors[`certification-${index}`] = "El nombre no puede estar vacío.";
      } else if (!nameRegex(cert.name)) {
        newErrors[`certification-${index}`] = "El nombre solo puede contener caracteres latinos.";
      }

      // Validar fecha
      if (!cert.date || isNaN(new Date(cert.date).getTime())) {
        newErrors[`certification-date-${index}`] = "La fecha es obligatoria y debe ser válida.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (index) => {
    const certificationToDelete = tempCertifications[index];

    if (certifications.some((cert) => cert.name === certificationToDelete.name)) {
      setDeletedCertifications((prev) => [...prev, certificationToDelete]);
    }

    setTempCertifications(tempCertifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (deletedCertifications.length > 0) {
        console.log("Eliminando certificaciones:", deletedCertifications);
        await onDelete({ certifications: deletedCertifications });
        setDeletedCertifications([]);
      }

      if (tempCertifications.length > 0) {
        const existingIds = certifications.map(c => c.uuid);

        const updated = tempCertifications.filter(c => existingIds.includes(c.uuid));
        const created = tempCertifications.filter(c => !existingIds.includes(c.uuid));

        await onSave({
          certifications: [...updated, ...created],
        });
        
        setCertifications(tempCertifications);
      }

      setIsEditing(false);
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
      {tempCertifications.map((certification, index) => {
        const hasError = errors[`certification-${index}`] || errors[`certification-date-${index}`];

        return (
          <div 
            key={index} 
            className="rounded-md p-4 border space-y-3"
            style={{ borderColor: theme.palette.lightGray.hex }}
          >
            <div className="flex items-start gap-3">
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la certificación"
                  value={certification.name}
                  onChange={(e) => handleNameChange(index, e)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`certification-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`certification-${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Institución
                </label>
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
              </div>

              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Fecha de obtención
                </label>
                <input
                  type="date"
                  value={certification.date}
                  onChange={(e) => handleDateChange(index, e)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                    color: theme.palette.text.hex,
                  }}
                  disabled={!isEditing}
                />
                {errors[`certification-date-${index}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`certification-date-${index}`]}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
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

      {/* Botón para añadir nuevas certificaciones */}
      {isEditing && (
        <button
          type="button"
          onClick={addCertification}
          className="w-full px-4 py-2 text-white rounded-md transition duration-200"
          style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
        >
          Añadir Certificación
        </button>
      )}
    </div>
  );
};

export default Certifications;
