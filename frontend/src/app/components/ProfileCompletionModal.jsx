/*
// Modal para solicitar nombre y apellidos al profesor

"use client";

import React, { useState } from "react";
import { theme } from "../constants/theme";

const ProfileCompletionModal = ({ isOpen, onSave, token }) => {
    const [tempFirstName, setTempFirstName] = useState("");
    const [tempLastName, setTempLastName] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSave = async () => {
        setError(""); // 🔹 Asegurarse de limpiar errores previos

        if (!tempFirstName.trim() || !tempLastName.trim()) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        if (!token) {
            setError("Error de autenticación. Inicia sesión de nuevo.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/metadata", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ firstName: tempFirstName, lastName: tempLastName }),
            });

            if (!response.ok) {
                setError("Error al guardar los cambios.");
                return;
            }

            onSave(tempFirstName, tempLastName); // 🔹 Llama a la función de la página para actualizar el estado y cerrar el modal
        } catch (error) {
            setError("Hubo un problema con la conexión. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-xl font-semibold mb-4" style={{ color: theme.palette.primary.hex }}>
                    Completa tu perfil
                </h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={tempFirstName}
                    onChange={(e) => setTempFirstName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                />
                <input
                    type="text"
                    placeholder="Apellidos"
                    value={tempLastName}
                    onChange={(e) => setTempLastName(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded text-black"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button
                    onClick={handleSave}
                    className="mt-4 px-6 py-2 rounded-lg text-white w-full"
                    style={{ backgroundColor: theme.palette.primary.hex }}
                >
                    Guardar cambios
                </button>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;*/
