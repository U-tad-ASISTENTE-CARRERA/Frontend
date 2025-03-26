"use client";

import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect, useRef } from "react";
import { styles } from "@/constants/theme";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat";

export default function Navbar() {
  /* 
   isLoggedIn --> variable que permite saber si un usario ha iniciado sesión
   isDropdownOpen --> variable que cambia la opción Iniciar sesión por Mi perfil y Log Out
   isMenuOpen --> variable que permite activar el menu hamburguesa lateral
  */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToken, setIsToken] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null);

  /* 
    Comrobamos que exista el token del usuario para poder activar las opciones
    de Mi perfil y Log Out
  */
  useEffect(() => {
    setIsToken(localStorage.getItem("token"));

    if (isToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  /* Recogemos los datos del usuario iniciado para enviarlo a la ruta correcta */
  const handleTypeUserProfile = async (e) => {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log(response);

    if (!response.ok) {
      throw new error("Error al captar al usuario");
    }

    const data = await response.json();

    setIsDropdownOpen(false);

    router.push(`/profile/${data.user.role.toLowerCase()}/${data.user.id}`);
  };

  const handleTypeUserHome = async (e) => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    } else {
      const response = await fetch("http://localhost:3000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new error("Error al captar al usuario");
      }

      const data = await response.json();

      router.push(`/home/${data.user.role.toLowerCase()}/${data.user.id}`);
    }
  };

  return (
    <>
      {/* Navbar principal */}
      <nav className="bg-blue-600 p-4 flex items-center justify-between shadow-lg">
        <div className="flex col-span-2">
          <img
            src="/logo.png"
            title="Logo"
            className="h-10 w-10"
            onClick={() => router.push("/")}
          ></img>
          <p
            className="text-white ml-3 mt-2"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
          >
            Asistente de Carrera Profesional
          </p>
        </div>

        {/* Botón Hamburguesa para móviles */}
        <button
          className="text-white cursor-pointer md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <i className="bi bi-list text-2xl"></i>
        </button>

        <ul className="hidden peer-checked:flex flex-col md:flex md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-white text-lg">
          <li className="md:ml-auto">
            <i
              className="bi bi-house-door-fill text-4xl hover:text-gray-300 transition-colors duration-200 text-nowrap"
              onClick={() => handleTypeUserHome()}
            ></i>
          </li>

          <li className="md:ml-auto" ref={dropdownRef}>
            <div
              className="hover:text-gray-300 transition-colors duration-200 text-nowrap"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <i className="bi bi-person-fill text-4xl"></i>

              {isDropdownOpen && (
                <div style={styles.dropdown}>
                  {isLoggedIn ? (
                    <div style={styles.submenu}>
                      <button
                        style={styles.dropdownButton}
                        onClick={() => handleTypeUserProfile()}
                      >
                        Mi perfil
                      </button>

                      <div style={{ height: "1px", backgroundColor: "gray", margin: "8px 0" }}></div>

                      <button
                        style={styles.dropdownButton}
                        onClick={() => (
                          router.push("/logout"), setIsDropdownOpen(false)
                        )}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <button
                        style={styles.dropdownButton}
                        onClick={() => (
                          router.push("/login"), setIsDropdownOpen(false)
                        )}
                      >
                        Iniciar sesión
                      </button>

                      <div style={{ height: "1px", backgroundColor: "gray", margin: "8px 0" }}></div>

                      <button
                        style={styles.dropdownButton}
                        onClick={() => (
                          router.push("/register"), setIsDropdownOpen(false)
                        )}
                      >
                        Registrate
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>

      {/* Sidebar lateral derecho */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ease-in-out duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-blue-700 shadow-lg flex flex-col p-6 space-y-6 transform transition-transform duration-500 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón para cerrar la navbar lateral */}
            <button
              className="self-end text-white text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Enlaces a las distintas partes de la web */}
            <div
              className="text-white text-lg hover:text-gray-300 transition-colors duration-200"
              onClick={() => (handleTypeUserHome(), setIsMenuOpen(false))}
            >
              <div className="flex flex-row items-center">
                <i className="bi bi-house-door-fill text-2xl"></i> 
                <p className="ml-2">Inicio</p>
              </div>
            </div>

            <div
              className="text-white text-lg hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex flex-row items-center">
                <i className="bi bi-person-fill text-2xl"></i> 
                <p className="ml-2">Usuario</p>
                <i
                  className={`${
                    isDropdownOpen
                      ? "bi bi-chevron-down ml-3"
                      : "bi bi-chevron-left ml-3"
                  }`}
                ></i>
              </div>

              {isDropdownOpen && (
                <div className="bg-blue-600 p-2 rounded-lg mt-2 shadow-md">
                  {isLoggedIn ? (
                    <>
                      <button
                        className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                        onClick={() => (handleTypeUserProfile(), setIsDropdownOpen(false), setIsMenuOpen(false))}
                      >
                        Mi perfil
                      </button>

                      <div style={{ height: "1px", backgroundColor: "blue", margin: "8px 0" }}></div>

                      <button
                        className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                        onClick={() => (router.push("/logout"), setIsDropdownOpen(false), setIsMenuOpen(false))}
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <button
                        className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                        onClick={() => (router.push("/login"), setIsDropdownOpen(false), setIsMenuOpen(false))}
                      >
                        Iniciar sesión
                      </button>

                      <div style={{ height: "1px", backgroundColor: "blue", margin: "8px 0" }}></div>

                      <button
                        className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                        onClick={() => (router.push("/register"), setIsDropdownOpen(false), setIsMenuOpen(false))}
                      >
                        Registrate
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
