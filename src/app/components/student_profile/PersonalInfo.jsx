import React, { useState, useEffect } from "react";
import { theme } from "../../constants/theme";

const PersonalInfo = ({
  firstName,
  lastName,
  dni,
  birthDate,
  endDate,
  gender,
  degree,
  yearsCompleted,
  setFirstName,
  setLastName,
  setDni,
  setBirthDate,
  setEndDate,
  setGender,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFirstName, setTempFirstName] = useState(firstName);
  const [tempLastName, setTempLastName] = useState(lastName);
  const [tempDni, setTempDni] = useState(dni);
  const [tempBirthDate, setTempBirthDate] = useState(birthDate || "");
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [tempGender, setTempGender] = useState(gender);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Validaciones
  const dniRegex = /^\d{8}[A-Z]$/;
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;

  // Sincronizar estados cuando cambian las props
  useEffect(() => {
    setTempFirstName(firstName || "");
    setTempLastName(lastName || "");
    setTempDni(dni || "");
    setTempBirthDate(birthDate || "");
    setTempEndDate(endDate || "");
    setTempGender(gender || "");
  }, [firstName, lastName, dni, birthDate, endDate, gender]);

  // Función para validar el formulario
  const isFormValid = () => {
    setErrors({
      firstName: !tempFirstName.trim()
        ? "El nombre es obligatorio."
        : !nameRegex.test(tempFirstName)
          ? "El nombre solo puede contener caracteres latinos."
          : undefined,

      lastName: !tempLastName.trim()
        ? "El apellido es obligatorio."
        : !nameRegex.test(tempLastName)
          ? "El apellido solo puede contener caracteres latinos."
          : undefined,

      dni: !tempDni.trim()
        ? "El DNI es obligatorio."
        : !dniRegex.test(tempDni)
          ? "Formato incorrecto (8 dígitos + letra)."
          : undefined,

      gender: !tempGender ? "El género es obligatorio." : undefined,
    });

    return Object.values(errors).every((error) => error === undefined);
  };

  // Función para actualizar la BD con PATCH sin borrar campos
  const handleSave = async () => {
    setSuccess(false);

    if (!isFormValid()) {
      return;
    }

    // Solo actualizar los campos modificados
    const updates = {};
    if (tempFirstName !== firstName) updates.firstName = tempFirstName;
    if (tempLastName !== lastName) updates.lastName = tempLastName;
    if (tempDni !== dni) updates.dni = tempDni;
    if (tempBirthDate !== birthDate) updates.birthDate = tempBirthDate;
    if (tempEndDate !== endDate) updates.endDate = tempEndDate;
    if (tempGender !== gender) updates.gender = tempGender;

    if (Object.keys(updates).length === 0) {
      setError("No hay cambios para actualizar.");
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
        setError(errorMessages[data?.error] || "Error actualizando los metadatos.");
        return;
      }

      const updatedData = await response.json();

      // Mantener todos los datos existentes y actualizar solo los modificados
      setFirstName(updatedData.firstName || tempFirstName);
      setLastName(updatedData.lastName || tempLastName);
      setDni(updatedData.dni || tempDni);
      setBirthDate(updatedData.birthDate || tempBirthDate);
      setEndDate(updatedData.endDate || tempEndDate);
      setGender(updatedData.gender || tempGender);

      setSuccess(true);
      setIsEditing(false);
    } catch (error) {
      setErrors({ general: "Error inesperado al actualizar los datos." });
    }
  };

  const handleCancel = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setTempDni(dni);
    setTempBirthDate(birthDate);
    setTempEndDate(endDate);
    setTempGender(gender);
    setIsEditing(false);
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
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={tempFirstName}
              onChange={(e) => setTempFirstName(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Apellidos</label>
            <input
              type="text"
              value={tempLastName}
              onChange={(e) => setTempLastName(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">DNI</label>
            <input
              type="text"
              value={tempDni}
              onChange={(e) => setTempDni(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />
            {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
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
          <label className="block text-sm font-medium">Género</label>
          <select
            value={tempGender}
            onChange={(e) => setTempGender(e.target.value)}
            className="block w-full p-2 border rounded-md transition-all"
            style={{
              borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              color: theme.palette.text.hex,
            }}
            disabled={!isEditing}
          >
            <option value="">Selecciona tu género</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="prefer not to say">Prefiero no decirlo</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        </form>
      </div>

      {/* Sección de Información académica */}
      <div>
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
              value={yearsCompleted ? `${yearsCompleted}º` : "SIN CALCULAR"}
              className="block w-full p-2 border rounded-md"
              disabled
            />
            <p className="text-xs text-gray-500">Este campo no es editable</p>
          </div>


          <div>
            <label className="block text-sm font-medium">Grado</label>
            <input type="text" value={degree} className="block w-full p-2 border rounded-md bg-gray-200" disabled />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de graduación</label>
            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              className="block w-full p-2 border rounded-md transition-all"
              disabled={!isEditing}
              style={{
                borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex,
              }}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default PersonalInfo;
