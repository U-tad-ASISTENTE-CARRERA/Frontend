"use client";

import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect } from "react";
import { styles } from "../constants/theme";
import { useRouter } from "next/navigation";

export default function Navbar() {

  /* 
   isLoggedIn --> variable que permite saber si un usario ha iniciado sesión
   isDropdownOpen --> variable que cambia la opción LogIn por Mi Perfil y Log Out
   isMenuOpen --> variable que permite activar el menu hamburguesa lateral
  */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  /* 
    Comrobamos que exista el token del usuario para poder activar las opciones
    de Mi Perfil y Log Out
  */
  useEffect(() => {
    const IsToken = localStorage.getItem("token");

    if (IsToken){
      setIsLoggedIn(true)
    } else{
      setIsLoggedIn(false)
    }
  });

  /* Recogemos los datos del usuario iniciado para enviarlo a la ruta correcta */
  const handleTypeUser = async(e) => {
      const response =await fetch("http://localhost:3000/",{
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      console.log(response)

      if(!response.ok){
        throw new error("Error al captar al usuario")
      }

      const data = await response.json()
      
      router.push(`/profile/${data.user.role.toLowerCase()}/${data.user.id}`)
  }

  return (
    <>
      {/* Navbar principal */}
      <nav className="bg-blue-600 p-4 flex items-center justify-between rounded-lg shadow-lg m-4">
        <img src="/logo.png" title="Logo" className="h-10 w-10" onClick={() => (router.push("/"))}></img>

        {/* Botón Hamburguesa para móviles */}
        <button
          className="text-white cursor-pointer md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <i className="bi bi-list text-2xl"></i>
        </button>

        <ul className="hidden peer-checked:flex flex-col md:flex md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-white text-lg">
          <li className="md:ml-auto">
            <Link
              href="/"
              className="hover:text-gray-300 transition-colors duration-200 text-nowrap"
            >
              <i className="bi bi-house-door-fill text-4xl"></i>
            </Link>
          </li>

          <li className="md:ml-auto">
            <div
              className="hover:text-gray-300 transition-colors duration-200 text-nowrap"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <i className="bi bi-person-fill text-4xl"></i>

              {isDropdownOpen && (
                <div style={styles.dropdown}>
                  {isLoggedIn ? (
                    <div style={styles.submenu}>
                      <button
                        style={styles.dropdownButton}
                        onClick={() => (handleTypeUser())}
                      >
                        Mi Perfil
                      </button>
                      <button
                        style={styles.dropdownButton}
                        onClick={() => (router.push("/logout"))}
                      >
                        LogOut
                      </button>
                    </div>
                  ) : (
                    <button
                      style={styles.dropdownButton}
                      onClick={() => (router.push("/login"))}
                    >
                      LogIn
                    </button>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-blue-700 shadow-lg transform ${ isMenuOpen ? "translate-x-0" : "translate-x-full"} 
            transition-transform duration-300 flex flex-col p-6 space-y-6`}
          >
            {/* Botón para cerrar la navbar lateral */}
            <button
              className="self-end text-white text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Enlaces a las distintas partes de la web */}
            <Link
              href="/"
              className="text-white text-lg hover:text-gray-300 transition-colors duration-200"
            >
              <i className="bi bi-house-door-fill text-2xl"></i> Inicio
            </Link>

            <div
              className="text-white text-lg hover:text-gray-300 transition-colors duration-200"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <i className="bi bi-person-fill text-2xl"></i> Usuario

              {isDropdownOpen && (
                <div className="bg-blue-600 p-2 rounded-lg mt-2 shadow-md">
                  {isLoggedIn ? (
                    <>
                      <button
                        className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                        onClick={handleTypeUser}
                      >
                        Mi Perfil
                      </button>
                      <button
                        className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                        onClick={() => router.push("/logout")}
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <button
                      className="block w-full text-left text-white py-1 px-2 hover:bg-blue-500 rounded"
                      onClick={() => router.push("/login")}
                    >
                      Iniciar Sesión
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>)}
    </>
  );
}
