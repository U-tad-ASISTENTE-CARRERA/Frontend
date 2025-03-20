"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";

import LoadingModal from "@/components/LoadingModal";

const UserList = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
          throw new Error(errorData.error || "Error al obtener la lista de usuarios");
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      setLoading(true);
      const response = await fetch(`http://localhost:3000/admin/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el usuario");
      }

      setUsers(users.filter(user => user.id !== userId));
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDownloadProfile = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`http://localhost:3000/admin/student?studentId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener el perfil del estudiante");
      }

      const userData = await response.json();
      
      // Crear un archivo JSON y descargarlo
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `student_profile_${userId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleEditUser = (userId) => {
    router.push(`/home/admin/${id}/users/edit/${userId}`);
  };

  const filteredUsers = users.filter(user => {
    if (!user || !user.email) return false;
    
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (user.metadata?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.metadata?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <LoadingModal message="Cargando usuarios..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto mb-6">
        <div className="bg-white bg-opacity-95 rounded-lg shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            Gestión de Usuarios
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/home/admin/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div 
            className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center"
            style={{ 
              backgroundColor: theme.palette.neutral.hex, 
              borderBottomColor: theme.palette.light.hex 
            }}
          >
            <div className="flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="w-full px-4 py-2 border rounded-md transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  borderColor: theme.palette.light.hex,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <div className="relative w-full md:w-64">
              <select
                className="appearance-none w-full px-4 py-2 pr-8 border rounded-md 
                transition-all duration-300 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  borderColor: theme.palette.light.hex,
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <option value="all">Todos los roles</option>
                <option value="STUDENT">Estudiantes</option>
                <option value="TEACHER">Profesores</option>
                <option value="ADMIN">Administradores</option>
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3"
                style={{ 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: theme.palette.primary.hex 
                }}
              >
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.metadata?.firstName} {user.metadata?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                        user.role === "TEACHER" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {user.role === "ADMIN" ? "Admin" :
                         user.role === "TEACHER" ? "Profesor" :
                         "Estudiante"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.metadata?.specialization || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {user.role !== "ADMIN" && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleEditUser(user.id)}
                            title="Editar usuario"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        )}

                        {/* {(user.role === "STUDENT" || user.role === "TEACHER" )&& (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleDownloadProfile(user.id)}
                            title="Descargar perfil"
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        )} */}
                        
                        {user.role !== "ADMIN" && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(user.id)}
                            title="Eliminar usuario"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;