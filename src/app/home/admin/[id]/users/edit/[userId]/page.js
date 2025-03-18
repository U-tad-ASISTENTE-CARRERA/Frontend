"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import LoadingModal from "@/components/LoadingModal";

const UserEdit = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; 
  const userId = params?.userId; 
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }

        const response = await fetch("http://localhost:3000/admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al obtener los datos de usuarios");
        }

        const allUsers = await response.json();
        const foundUser = allUsers.find(u => u.id === userId);
        
        if (!foundUser) {
          throw new Error("Usuario no encontrado");
        }
        
        setUser(foundUser);
        setEmail(foundUser.email || "");
        setRole(foundUser.role || "");
        setFirstName(foundUser.metadata?.firstName || "");
        setLastName(foundUser.metadata?.lastName || "");
        setSpecialization(foundUser.metadata?.specialization || "");
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const updateData = {};
      
      if (email && email !== user.email) updateData.email = email;
      if (role && role !== user.role) updateData.role = role;
      
      const metadataUpdate = {};
      if (firstName !== undefined && firstName !== user.metadata?.firstName) {
        metadataUpdate.firstName = firstName;
      }

      if (lastName !== undefined && lastName !== user.metadata?.lastName) {
        metadataUpdate.lastName = lastName;
      }
      
      if (specialization !== undefined && specialization !== user.metadata?.specialization) {
        metadataUpdate.specialization = specialization;
      }
      
      if (Object.keys(metadataUpdate).length > 0) {
        updateData.metadata = metadataUpdate;
      }
      
      if (changePassword && password) {
        updateData.password = password;
      }

      if (Object.keys(updateData).length === 0) {
        setSuccess("No se han realizado cambios");
        setSaving(false);
        return;
      }

      console.log("Datos a actualizar:", updateData);

      const response = await fetch(`http://localhost:3000/admin/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Error al actualizar el usuario");
      }

      setSuccess("Usuario actualizado correctamente");
      
      if (responseData.updatedUser) {
        setUser({...user, ...responseData.updatedUser});
      } else {
        const updatedUser = {...user};
        if (updateData.email) updatedUser.email = updateData.email;
        if (updateData.role) updatedUser.role = updateData.role;
        
        if (updateData.metadata) {
          updatedUser.metadata = {...(updatedUser.metadata || {}), ...updateData.metadata};
        }
        
        setUser(updatedUser);
        
        if (updateData.email) setEmail(updateData.email);
        if (updateData.role) setRole(updateData.role);
      }
      
      setPassword("");
      setChangePassword(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/home/admin/${id}/users`);
  };

  if (loading) {
    return <LoadingModal message="Cargando datos del usuario..." />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Usuario no encontrado.
        </div>
        <div className="mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.palette.primary.hex }}>
          Editar Usuario: {user.email}
        </h1>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-white rounded-md"
          style={{ backgroundColor: theme.palette.primary.hex }}
        >
          Volver
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: theme.palette.light.hex }}
                disabled={user.role === "ADMIN"} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: theme.palette.light.hex }}
                disabled={user.role === "ADMIN"} 
              >
                <option value="STUDENT">Estudiante</option>
                <option value="TEACHER">Profesor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: theme.palette.light.hex }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: theme.palette.light.hex }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialización
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: theme.palette.light.hex }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo relevante para profesores y estudiantes
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="changePassword"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                  Cambiar contraseña
                </label>
              </div>
              
              {changePassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="w-full px-4 py-2 border rounded-md"
                  style={{ borderColor: theme.palette.light.hex }}
                />
              )}
              {changePassword && (
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: theme.palette.primary.hex }}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;