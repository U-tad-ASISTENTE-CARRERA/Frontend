"use client";

import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat";
import { theme } from "@/constants/theme";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToken, setIsToken] = useState("");
  const router = useRouter();
  const userSidebarRef = useRef(null);

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
      if (
        userSidebarRef.current &&
        !userSidebarRef.current.contains(event.target)
      ) {
        setIsUserSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userSidebarRef]);

  const handleTypeUserProfile = async (e) => {
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

    setIsUserSidebarOpen(false);
    setIsMenuOpen(false);

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

      if (data?.user?.id && data?.user?.role) {
        router.push(`/home/${data.user.role.toLowerCase()}/${data.user.id}`);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <>
      <nav
        className="bg-blue-600 p-3 flex items-center justify-between shadow-lg mx-2 mt-2"
        style={{ borderRadius: theme.buttonRadios.l }}
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={handleTypeUserHome}
        >
          <img src="/logo.png" title="Logo" className="h-8 w-8 rounded-full" />
          <p
            className="text-white ml-3 text-sm font-medium"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Asistente de Carrera
          </p>
        </div>

        <button
          className="text-white cursor-pointer md:hidden p-2 rounded-full hover:bg-blue-700 transition-colors"
          onClick={() => setIsMenuOpen(true)}
        >
          <FaBars className="text-2xl" />
        </button>

        <div className="hidden md:flex items-center space-x-4">
          <button
            className="text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => handleTypeUserHome()}
            title="Inicio"
          >
            <FaHome className="text-2xl" />
          </button>

          <button
            className="text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => setIsUserSidebarOpen(true)}
            title="Usuario"
          >
            <FaUser className="text-xl" />
          </button>
        </div>
      </nav>

      {isUserSidebarOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ease-in-out duration-300 ${
            isUserSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsUserSidebarOpen(false)}
        >
          <div
            ref={userSidebarRef}
            className={`fixed top-0 right-0 w-64 h-full bg-blue-700 shadow-lg flex flex-col p-6 space-y-6 transform transition-transform duration-500 ease-in-out rounded-l-2xl ${
              isUserSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              onClick={() => setIsUserSidebarOpen(false)}
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="flex items-center space-x-3 pb-4 border-b border-blue-600">
              <FaUserCircle className="text-3xl text-white" />
              <h3 className="text-white text-lg font-semibold">
                {isLoggedIn ? "Mi cuenta" : "Usuario"}
              </h3>
            </div>

            <div className="flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <button
                    className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors duration-200"
                    onClick={() => handleTypeUserProfile()}
                  >
                    <FaUser className="mr-3" />
                    Mi perfil
                  </button>

                  <button
                    className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      router.push("/logout");
                      setIsUserSidebarOpen(false);
                    }}
                  >
                    <FaSignOutAlt className="mr-3" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      router.push("/login");
                      setIsUserSidebarOpen(false);
                    }}
                  >
                    <FaSignInAlt className="mr-3" />
                    Iniciar sesión
                  </button>

                  <button
                    className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      router.push("/register");
                      setIsUserSidebarOpen(false);
                    }}
                  >
                    <FaUserPlus className="mr-3" />
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ease-in-out duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-blue-700 shadow-lg flex flex-col p-6 space-y-6 transform transition-transform duration-500 ease-in-out rounded-l-2xl ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTimes className="text-lg" />
            </button>

            <button
              className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors"
              onClick={() => router.back()}
            >
              <FaArrowLeft className="mr-3" />
              Volver atrás
            </button>

            <button
              className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors"
              onClick={() => (handleTypeUserHome(), setIsMenuOpen(false))}
            >
              <FaHome className="mr-3" />
              Inicio
            </button>

            <button
              className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                setIsUserSidebarOpen(true);
              }}
            >
              <FaUser className="mr-3" />
              Usuario
            </button>
          </div>
        </div>
      )}
    </>
  );
}
