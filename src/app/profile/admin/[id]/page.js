"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import LoadingModal from "@/components/LoadingModal";
import ErrorPopUp from "@/components/ErrorPopUp";

const AdminActionCard = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center p-6 transition-all bg-white border rounded-lg cursor-pointer hover:shadow-lg hover:bg-gray-50"
    style={{ borderColor: theme.palette.light.hex }}
  >
    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full" style={{ backgroundColor: theme.palette.primary.hex }}>
      <i className={`text-2xl bi bi-${icon} text-white`}></i>
    </div>
    <h3 className="mb-2 text-lg font-semibold" style={{ color: theme.palette.dark.hex }}>
      {title}
    </h3>
    <p className="text-sm text-center text-gray-600">{description}</p>
  </div>
);

const AdminProfile = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
          return <ErrorPopUp message="Debes iniciar sesión para ver esta página." path="/login" />;
        }
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role !== "ADMIN") {
          return <ErrorPopUp message="No tienes acceso a esta página." path={`/home/${user.role.toLowerCase()}/${id}`} />;
        }
        
        const response = await fetch("http://localhost:3000/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Error al obtener datos del usuario");
        }
        
        const userData = await response.json();
        setEmail(userData.user.email || "");
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingModal message="Cargando perfil..." />;
  }

  if (error) {
    return <ErrorPopUp message={error} path={`/login`} />;
  }

  const adminActions = [
    {
      icon: "people-fill",
      title: "Gestionar Usuarios",
      description: "Administrar usuarios, roles y permisos del sistema",
      path: `/home/admin/${id}/users`
    },
    {
      icon: "map",
      title: "Gestionar Roadmaps",
      description: "Crear y editar rutas de aprendizaje personalizadas",
      path: `/home/admin/${id}/roadmaps`
    },
    {
      icon: "mortarboard-fill",
      title: "Gestionar Titulaciones",
      description: "Configurar grados, asignaturas y planes académicos",
      path: `/home/admin/${id}/degrees`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-10">
          <h1 
            className="text-3xl font-bold"
            style={{ fontFamily: "Montserrat", color: theme.palette.primary.hex }}
          >
            Panel de Administrador
          </h1>
          <button
            onClick={() => router.push(`/home/admin/${id}`)}
            className="px-5 py-2 text-white rounded-md shadow-md transition-colors hover:bg-opacity-90"
            style={{ backgroundColor: theme.palette.primary.hex, fontFamily: "Montserrat" }}
          >
            Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="p-6 bg-white border rounded-lg shadow-md md:col-span-1">
            <h2 
              className="pb-4 mb-4 text-xl font-semibold border-b"
              style={{ color: theme.palette.dark.hex, borderColor: theme.palette.light.hex }}
            >
              Información de Cuenta
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 font-medium">{email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Rol</p>
                <p className="mt-1 font-medium">Administrador</p>
              </div>
              
              <div className="pt-4 mt-4 border-t" style={{ borderColor: theme.palette.light.hex }}>
                <p className="mb-2 text-sm font-medium text-gray-500">Estado</p>
                <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  Activo
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h2 
              className="mb-6 text-2xl font-semibold"
              style={{ color: theme.palette.dark.hex, fontFamily: "Montserrat" }}
            >
              Acciones de Administración
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {adminActions.map((action, index) => (
                <AdminActionCard
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  onClick={() => router.push(action.path)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;