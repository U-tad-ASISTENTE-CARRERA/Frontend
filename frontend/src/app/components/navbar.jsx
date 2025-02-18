"use client";

import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect } from "react";
import { styles } from "../constants/theme";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const IsToken = localStorage.getItem("token");

    if (IsToken){
      setIsLoggedIn(true)
    } else{
      setIsLoggedIn(false)
    }
  });

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
    <nav className="bg-blue-600 p-4 flex items-center justify-between rounded-lg shadow-lg m-4">
      <img src="/logo.png" title="Logo" className="h-10 w-10" onClick={() => (window.location.href = "/")}></img>

      <input type="checkbox" id="menu-toggle" className="hidden peer" />

      <label
        htmlFor="menu-toggle"
        className="text-white cursor-pointer md:hidden"
      >
        <i className="bi bi-list text-2xl"></i>
      </label>

      <ul className="hidden peer-checked:flex flex-col md:flex md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-white text-lg">
        <li className="md:ml-auto">
          <Link
            href="/"
            className="hover:text-gray-300 transition-colors duration-200 text-nowrap"
          >
            <i className="bi bi-house-door-fill text-4xl"></i>
          </Link>
        </li>

        <li>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Introducción
          </a>
        </li>

        <li>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Catálogo
          </a>
        </li>

        <li>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Ayuda
          </a>
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
                      onClick={() => (window.location.href = "/logout")}
                    >
                      LogOut
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.dropdownButton}
                    onClick={() => (window.location.href = "/login")}
                  >
                    LogIn
                  </button>
                )}
              </div>
            )}

            {isModalOpen && (
              <div style={styles.overlay}>
                <div style={styles.modal}>
                  <h2>¿Estás seguro de que quieres cerrar sesión?</h2>
                  <button
                    style={{ ...styles.modalButton, ...styles.confirm }}
                    onClick={() => (window.location.href = "/")}
                  >
                    Salir
                  </button>
                  <button
                    style={{ ...styles.modalButton, ...styles.cancel }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}
