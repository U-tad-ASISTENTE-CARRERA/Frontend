"use client";

// TODO: Eliminar la especialización si no se selecciona ninguna

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import LoadingModal from "@/components/LoadingModal";

const TeacherEdit = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [metadata, setMetadata] = useState({}); // Estado para almacenar los datos del usuario

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3000/metadata", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }

                const data = await response.json();
                const metadata = data.metadata || {}; // Manejar posibles valores undefined

                // Cargar datos actuales en los campos
                setFirstName(metadata.firstName || "");
                setLastName(metadata.lastName || "");
                setGender(metadata.gender || "");
                setSpecialization(metadata.specialization || "");
                setMetadata(metadata); // Guardar los datos en el estado

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const validateField = (field, value) => {
        let error = "";
        if (!value.trim()) {
            error = `El campo ${field} es obligatorio.`;
        } 
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error || undefined,
        }));
    };

    const handleChange = (field, value, setter) => {
        setter(value);
        validateField(field, value);
    };

    const isFormValid = () => {
        return (
            Object.values(errors).every((error) => !error) &&
            firstName.trim() &&
            lastName.trim() &&
            gender.trim()
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            setErrors({
                firstName: !firstName?.trim() ? "El nombre es obligatorio." : undefined,
                lastName: !lastName.trim() ? "El apellido es obligatorio." : undefined,
                gender: !gender ? "El género es obligatorio." : undefined,
            });
            return;
        }

        setSubmitting(true);

        const requestBody = {
            firstName,
            lastName,
            gender,
            specialization: specialization.trim() ? specialization : null, // Usar null para eliminar la especialización
        };

        try {
            const response = await fetch("http://localhost:3000/metadata", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            setSubmitting(false);

            if (!response.ok) {
                const errorMessages = {
                    USER_NOT_FOUND: "El usuario no existe.",
                    NO_VALID_FIELDS_TO_UPDATE: "No hay cambios válidos en los campos.",
                    INTERNAL_SERVER_ERROR: "Error interno del servidor. Inténtalo más tarde.",
                };
                setErrors({ general: errorMessages[data?.error] || "Error al actualizar los metadatos." });
                return;
            }

            // Redirigir tras actualizar los datos
            router.push(`/profile/teacher/${id}`);
        } catch (error) {
            setSubmitting(false);
            setErrors({ general: "Ha ocurrido un error inesperado." });
        }
    };

    if (loading) {
        return <LoadingModal message="Cargando datos del perfil..." />;
    }

    return (
        <>
            <div className="flex flex-col items-center min-h-screen">

                {/* Título */}
                <h1 className="text-3xl font-bold text-center pt-20 pb-10" style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}>
                    Editar perfil
                </h1>

                {/* Campos editables */}
                <div className="w-full max-w-4xl p-6">

                    {/* Botón volver atrás */}
                    <div className="w-full max-w-3xl mb-10">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            ← Volver atrás
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

                        {/* Información personal */}
                        <div className="m-4 space-y-3">
                            <h2 className="text-lg font-semibold mb-1" style={{ color: theme.palette.text.hex }}>
                                Información personal
                            </h2>

                            <p style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}>
                                Nombre:
                            </p>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => handleChange("Nombre", e.target.value, setFirstName)}
                                placeholder="Nombre"
                                className="block w-full p-2 border border-gray-300 rounded-md"
                                style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

                            <p style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}>
                                Apellidos:
                            </p>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => handleChange("Apellido", e.target.value, setLastName)}
                                placeholder="Apellido"
                                className="block w-full p-2 border border-gray-300 rounded-md"
                                style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

                            
                        </div>

                        {/* Género y Especialización */}
                        <div className="m-4 space-y-3">
                            <h2 className="text-lg font-semibold mb-1" style={{ color: theme.palette.text.hex }}>Género</h2>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md"
                                style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
                            >
                                <option value="">Selecciona tu género</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="prefer not to say">Prefiero no decirlo</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

                            <h2 className="text-lg font-semibold mb-1" style={{ color: theme.palette.text.hex }}>Especialización</h2>

                            <select
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md"
                                style={{ borderColor: theme.palette.light.hex, color: theme.palette.text.hex }}
                            >
                                <option value="">Selecciona tu especialización</option>
                                <option value="Base de datos">Base de datos</option>
                                <option value="Frontend">Frontend</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="col-span-1 md:col-span-2 text-white px-4 py-2 rounded-md"
                            style={{ backgroundColor: theme.palette.primary.hex }}
                            disabled={submitting}
                        >
                            {submitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </form>
                </div >
            </div >
        </>
    );
};

export default TeacherEdit;
