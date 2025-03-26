import React,{ useState, useEffect } from 'react';
import { theme } from '@/constants/theme';

import { nameRegex } from "@/utils/ValidatorRegex";

const PersonalInfo = ({firstName, lastName, gender, specialization, setFirstName, setLastName, setGender, setSpecialization}) => {
    const [activeTab, setActiveTab] = useState("recent");

    const [isEditing, setIsEditing] = useState(false);
    const [tempFirstName, setTempFirstName] = useState(firstName);
    const [tempLastName, setTempLastName] = useState(lastName);
    const [tempGender, setTempGender] = useState(gender);
    const [tempSpecialization, setTempSpecialization] = useState(specialization);

    const [deletionReason, setDeletionReason] = useState("");
    const [deletionMessage, setDeletionMessage] = useState("");

    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.title = activeTab === "recent"
          ? "Perfil de profesor | Asistente de Carrera Profesional"
          : "Asistente de Carrera Profesional";
    }, [activeTab]);

    useEffect(() => {
        setTempFirstName(firstName || "");
        setTempLastName(lastName || "");
        setTempGender(gender || "");
        setTempSpecialization(specialization || "");
    }, [firstName, lastName, gender, specialization]);

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
          specialization: !tempSpecialization ? "La especialización es obligatoria." : undefined,
        };
    
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === undefined);
    };

    const handleSave = async () => {
        setErrors({});

        if (!isFormValid()) return;

        const update = {}

        if(tempFirstName !== firstName) update.firstName = tempFirstName;
        if(tempLastName !== lastName) update.lastName = tempLastName;   
        if(tempGender !== gender) update.gender = tempGender;
        if(tempSpecialization !== specialization) update.specialization = tempSpecialization;

        if (Object.keys(update).length === 0) {
            setIsEditing(false);
            return;
        }

        try{
            const response = await fetch("http://localhost:3000/metadata", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(update),
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
            setGender(update.gender || tempGender);
            setSpecialization(update.specialization || tempSpecialization);

            setIsEditing(false);
        } catch(error) {
            console.error("Error al actualizar la información personal:", error);
        }
    }

    const handleCancel = () => {    
        setFirstName(firstName);
        setLastName(lastName);
        setGender(gender)
        setSpecialization(specialization);

        setErrors({});
        setIsEditing(false);
    }

    const onRequest = async () => {
        const result = await handleRequestDeletion(deletionReason);
        if (result.success) {
          setDeletionMessage("Se ha solicitado darse de baja. Los administradores atenderán tu petición.");
        } else {
          setDeletionMessage(result.message);
        }
    };

    const onCancel = async() => {
        const result = await handleCancelDeletion();
        if(result.success) {
            setDeletionMessage("Se ha cancelado tu solicitud de baja");
        } else{
            setDeletionMessage(result.message);
        }
    }

    return(
        <div className='p-4 bg-white rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold'>Información principal</h2>

                <div className='flex gap-2'>
                    {isEditing && (
                        <button
                            type='button'
                            className="px-4 py-2 text-white rounded-md transition duration-200"
                            style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
                            onClick={handleSave}
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

            <div className='mb-10'>
                <h3
                    className='text-md font-semibold mb-3'
                    style={{ color: theme.palette.dark.hex }}
                >
                    Información personal
                </h3>

                <form className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                        <label className="text-sm font-medium flex items-center gap-1">
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
                        <label className="text-sm font-medium flex items-center gap-1">
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
                        <label className="text-sm font-medium flex items-center gap-1">
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

                    <div>
                        <label className="text-sm font-medium flex items-center gap-1">
                            Especialización
                        </label>
                    
                        <select
                            value={tempSpecialization}
                            onChange={(e) => setTempSpecialization(e.target.value)}
                            className="block w-full p-2 border rounded-md transition-all"
                            disabled={!isEditing}
                            style={{
                                borderColor: errors.specialization
                                ? theme.palette.error.hex
                                : (isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex),
                                color: theme.palette.text.hex,
                            }}
                        >
                            <option value="">Selecciona tu especialización</option>
                            <option value="math">Base de datos</option>
                            <option value= "">Frontend</option>
                        </select>
                        {isEditing && errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PersonalInfo;