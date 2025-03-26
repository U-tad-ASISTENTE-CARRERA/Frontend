"use client";

import { useState } from "react";
import { theme } from "@/constants/theme";
import { BiLogOut } from "react-icons/bi";
import { MdCancel } from "react-icons/md";

const LogOut = () => {
  const [error, setError] = useState("");

  const handleLogOut = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        setError("Error al cerrar sesión");
        return;
      }

      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      // localStorage.removeItem("metadata");
      
      localStorage.clear();

      window.location.href = "/";

    } catch (error) { }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center font-[Montserrat]">
      <div
        className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-sm w-full"
        style={{ borderLeft: `4px solid ${theme.palette.primary.hex}` }}
      >
        <div className="flex items-center justify-center">
          <div>

            <p className="text-sm font-medium text-gray-500 uppercase">
              Confirmar acción
            </p>

            {error && (
              <p className="text-sm text-red-600 mt-2">
                {error}
              </p>
            )}

          </div>

        </div>

        <div className="mt-6 flex flex-col gap-3">

          {/* Botón para cerrar sesión */}
          <button
            className="w-full px-4 py-2 text-white rounded-md font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.palette.error.hex }}
            onClick={handleLogOut}
          >
            <BiLogOut className="text-lg" /> Cerrar sesión
          </button>

          {/* Botón para cancelar y cerrar el "pop-up" */}
          <button
            className="w-full px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.palette.gray.hex,
              color: theme.palette.text.hex,
            }}
            onClick={() => {
              const user = JSON.parse(localStorage.getItem("user"));
              if (user?.role && user?.id) {
                window.location.href = `/home/${user.role.toLowerCase()}/${user.id}`;
              } else {
                window.location.href = "/";
              }
            }}
          >
            <MdCancel className="text-lg" /> Cancelar
          </button>

        </div>
      </div>
    </div>
  );
};

export default LogOut;
