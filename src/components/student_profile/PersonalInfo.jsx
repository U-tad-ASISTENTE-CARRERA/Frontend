import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";

import { nameRegex } from "@/utils/ValidatorRegex";

const PersonalInfo = ({
  firstName,
  lastName,
  birthDate,
  endDate,
  gender,
  degree,
  yearsCompleted,
  setFirstName,
  setLastName,
  setBirthDate,
  setEndDate,
  setGender,
  deletionRequested,
  handleRequestDeletion,
  handleCancelDeletion
}) => {
  // Texto de la cabecera
  const [activeTab, setActiveTab] = useState("recent");

  // Otras variables
  const [isEditing, setIsEditing] = useState(false);
  const [tempFirstName, setTempFirstName] = useState(firstName);
  const [tempLastName, setTempLastName] = useState(lastName);
  const [tempBirthDate, setTempBirthDate] = useState(birthDate || "");
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [tempGender, setTempGender] = useState(gender);

  // Solicitud de dada de baja
  const [deletionReason, setDeletionReason] = useState("");
  const [deletionMessage, setDeletionMessage] = useState("");

  // Error
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = activeTab === "recent"
      ? "Perfil de estudiante | Asistente de Carrera Profesional"
      : "Asistente de Carrera Profesional";
  }, [activeTab]);

  useEffect(() => {
    setTempFirstName(firstName || "");
    setTempLastName(lastName || "");
    setTempBirthDate(birthDate || "");
    setTempEndDate(endDate || "");
    setTempGender(gender || "");
  }, [firstName, lastName, birthDate, endDate, gender]);

  const isFormValid = () => {
    const newErrors = {
      firstName: !tempFirstName.trim()
        ? "El nombre es obligatorio."
        : !nameRegex(tempFirstName)
          ? "El nombre solo puede contener caracteres latinos."
          : undefined,

      lastName: !tempLastName.trim()
        ? "El apellido es obligatorio."
        : !nameRegex(tempLastName)
          ? "El apellido solo puede contener caracteres latinos."
          : undefined,

      gender: !tempGender ? "El género es obligatorio." : undefined,
      endDate:
        new Date(tempEndDate).getTime() < new Date(endDate).getTime()
          ? "No puedes seleccionar una fecha anterior a la actual."
          : undefined,
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === undefined);
  };

  const handleSave = async () => {
    setErrors({});

    if (!isFormValid()) return;

    const updates = {};
    if (tempFirstName !== firstName) updates.firstName = tempFirstName;
    if (tempLastName !== lastName) updates.lastName = tempLastName;
    if (tempBirthDate !== birthDate) updates.birthDate = tempBirthDate;
    if (tempEndDate !== endDate) updates.endDate = tempEndDate;
    if (tempGender !== gender) updates.gender = tempGender;

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "No hay cambios válidos.",
          INVALID_USER_ID: "Usuario no encontrado.",
          INTERNAL_SERVER_ERROR: "Error en el servidor.",
        };
        const data = await response.json();
        setErrors({ general: errorMessages[data?.error] || "Error actualizando los metadatos." });
        return;
      }

      const updatedData = await response.json();
      setFirstName(updatedData.firstName || tempFirstName);
      setLastName(updatedData.lastName || tempLastName);
      setBirthDate(updatedData.birthDate || tempBirthDate);
      setEndDate(updatedData.endDate || tempEndDate);
      setGender(updatedData.gender || tempGender);

      setIsEditing(false);
    } catch (error) {
      setErrors({ general: "Error inesperado al actualizar los datos." });
    }
  };

  const handleCancel = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setTempBirthDate(birthDate);
    setTempEndDate(endDate);
    setTempGender(gender);

    // Limpia los errores cuando el usuario cancela
    setErrors({});
    setIsEditing(false);
  };

  const onRequest = async () => {
    const result = await handleRequestDeletion(deletionReason);
    if (result.success) {
      setDeletionMessage("Se ha solicitado darse de baja. Los administradores atenderán tu petición.");
    } else {
      setDeletionMessage(result.message);
    }
  };

  const onCancel = async () => {
    const result = await handleCancelDeletion();
    if (result.success) {
      setDeletionMessage("Se ha cancelado tu solicitud de baja.");
    } else {
      setDeletionMessage(result.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">

      {/* Cabecera y botones */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Información principal</h2>
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

      {/* Sección de Información personal */}
      <div className="mb-10">
        <h3
          className="text-md font-semibold mb-3"
          style={{ color: theme.palette.dark.hex }}
        >
          Información personal
        </h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium flex items-center gap-1">
              Nombre
              {isEditing && <p className="text-red-500 text-xs mt-1">*</p>}
            </label>

            <input
              type="text"
              value={tempFirstName}
              onChange={(e) => setTempFirstName(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: errors.firstName
                  ? theme.palette.error.hex
                  : (isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex),
                color: theme.palette.text.hex,
              }}
            />
            {isEditing && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium flex items-center gap-1">
              Apellidos
              {isEditing && <p className="text-red-500 text-xs mt-1">*</p>}
            </label>

            <input
              type="text"
              value={tempLastName}
              onChange={(e) => setTempLastName(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: errors.lastName
                  ? theme.palette.error.hex
                  : (isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex),
                color: theme.palette.text.hex,
              }}
            />
            {isEditing && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>



          <div>
            <label className="block text-sm font-medium">Fecha de nacimiento</label>
            <input
              type="date"
              value={tempBirthDate}
              onChange={(e) => setTempBirthDate(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />
          </div>

          <div>

            <label className="block text-sm font-medium flex items-center gap-1">
              Género
              {isEditing && <span className="text-red-500 text-xs ml-1">*</span>}
            </label>

            <select
              value={tempGender}
              onChange={(e) => setTempGender(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              style={{
                borderColor: errors.gender
                  ? theme.palette.error.hex
                  : (isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex),
                color: theme.palette.text.hex,
              }}
              disabled={!isEditing}
            >
              <option value="">Selecciona tu género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="prefer not to say">Prefiero no decirlo</option>
            </select>
            {isEditing && errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

        </form>
      </div>

      {/* Sección de Información académica */}
      <div className="mb-10">
        <h3
          className="text-md font-semibold mb-3"
          style={{ color: theme.palette.dark.hex }}
        >
          Información académica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Curso académico</label>
            <input
              type="text"
              value={yearsCompleted?.length > 0 ? `${yearsCompleted[yearsCompleted.length - 1]}º` : "SIN CALCULAR"}
              className="block w-full p-2 border rounded-md"
              disabled
            />
            <p className="text-xs text-gray-500">Este campo no es editable</p>
          </div>


          <div>
            <label className="block text-sm font-medium flex items-center gap-1">
              Grado
              {isEditing && <p className="text-red-500 text-xs mt-1">*</p>}
            </label>
            <input type="text" value={degree} className="block w-full p-2 border rounded-md bg-gray-200" disabled />
          </div>

          <div>

            <label className="block text-sm font-medium flex items-center gap-1">
              Fecha de graduación
              {isEditing && <p className="text-red-500 text-xs mt-1">*</p>}
            </label>

            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: errors.endDate
                  ? theme.palette.error.hex
                  : (isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex),
                color: theme.palette.text.hex,
              }}
            />

            {isEditing && errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>

        </div>
      </div>

      {/* Sección de Configuración de la cuenta */}
      <div>
        <h3
          className="text-md font-semibold mb-3"
          style={{ color: theme.palette.dark.hex }}
        >
          Configuración de la cuenta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="col-span-2 space-y-4 mt-2">
            {deletionRequested ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div
                  className="flex items-center gap-3 p-4 text-sm"
                  style={{
                    backgroundColor: `${theme.palette.warning.hex}20`,
                    borderLeft: `4px solid ${theme.palette.warning.hex}`
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill" style={{ color: theme.palette.warning.hex }}></i>
                  <p className="">
                    Ya has solicitado la baja de la cuenta. Si cambiaste de opinión, puedes cancelarla.
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-full font-semibold text-white"
                  style={{ backgroundColor: theme.palette.secondary.hex }}
                >
                  Cancelar solicitud de baja
                </button>
              </div>
            ) : (
              <>
                {!deletionReason && (
                  <div>
                    <button
                      onClick={() => setDeletionReason(" ")} // activa el formulario
                      className="px-4 py-2 rounded-full text-white font-semibold"
                      style={{ backgroundColor: theme.palette.secondary.hex }}
                    >
                      Solicitar baja de la cuenta
                    </button>
                  </div>
                )}

                {deletionReason && (
                  <div className="p-4 border rounded-md bg-gray-50 space-y-3 mt-2">
                    <label className="text-sm font-medium block">
                      ¿Por qué deseas darte de baja?
                    </label>
                    <textarea
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-md resize-none"
                      style={{
                        borderColor: theme.palette.primary.hex,
                        color: theme.palette.text.hex,
                      }}
                      placeholder="Explica brevemente el motivo..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDeletionReason("")}
                        className="px-4 py-2 rounded-full text-gray-700 font-semibold border"
                        style={{ borderColor: theme.palette.lightGray.hex }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={onRequest}
                        disabled={!deletionReason.trim()}
                        className="px-4 py-2 rounded-full text-white font-semibold transition disabled:opacity-50"
                        style={{ backgroundColor: theme.palette.error.hex }}
                      >
                        Confirmar baja
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>


        </div>
      </div>

    </div>
  );
};

export default PersonalInfo;
