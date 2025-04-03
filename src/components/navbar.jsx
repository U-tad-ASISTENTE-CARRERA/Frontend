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
} from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat";
import { theme } from "@/constants/theme";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const lastScrollY = useRef(0);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserRole(data.user?.role);
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !isLoggedIn) fetchUserData();
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY <= lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTypeUserProfile = async () => {
    const res = await fetch("http://localhost:3000/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setIsSidebarOpen(false);
    router.push(`/profile/${data.user.role.toLowerCase()}/${data.user.id}`);
  };

  const handleTypeUserHome = async () => {
    if (!localStorage.getItem("token")) return router.push("/");
    const res = await fetch("http://localhost:3000/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    router.push(`/home/${data.user.role.toLowerCase()}/${data.user.id}`);
  };

  return (
    <>
      <div className="h-[64px] w-full" />

      <nav
        className="fixed top-0 left-0 right-0 z-40 bg-blue-600 p-3 flex items-center justify-between shadow-lg transition-transform duration-300"
        style={{ transform: showNavbar ? "translateY(0%)" : "translateY(-100%)" }}
      >
        <div className="flex items-center cursor-pointer" onClick={handleTypeUserHome}>
          <img src="/logo.png" title="Logo" className="h-8 w-8 rounded-full" />
          <p
            className="text-white ml-3 text-sm font-medium"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Asistente de Carrera Profesional
          </p>
        </div>

        <button
          className="text-white cursor-pointer p-2 rounded-full hover:bg-blue-700 transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars className="text-2xl" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 ${isSidebarOpen ? "bg-black bg-opacity-60" : "bg-transparent"} transition-opacity duration-300 pointer-events-none`}
      >
        <div
          ref={sidebarRef}
          className={`fixed top-0 right-0 w-64 h-full bg-blue-700 shadow-lg flex flex-col p-6 space-y-6 transform rounded-l-2xl z-60 transition-transform duration-500 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="self-end text-white p-2 rounded-full hover:bg-blue-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes className="text-lg" />
          </button>

          <div className="flex flex-col space-y-1 pb-4 border-b border-blue-600">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-3xl text-white" />
              <h3 className="text-white text-lg font-semibold">
                {isLoggedIn ? "Mi cuenta" : "Sesión no iniciada"}
              </h3>
            </div>
            {userRole && (
              <p className="text-white text-sm ml-10">
                {userRole === "STUDENT"
                  ? "Estudiante"
                  : userRole === "TEACHER"
                    ? "Profesor"
                    : "Administrador"}
              </p>
            )}
          </div>


          <div className="flex flex-col space-y-2">
            <button
              className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg"
              onClick={handleTypeUserHome}
            >
              <FaHome className="mr-3" /> Inicio
            </button>
            {isLoggedIn ? (
              <>
                <button
                  className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg"
                  onClick={handleTypeUserProfile}
                >
                  <FaUser className="mr-3" /> Mi perfil
                </button>

                <button
                  className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg"
                  onClick={() => {
                    router.push("/logout");
                    setIsSidebarOpen(false);
                  }}
                >
                  <FaSignOutAlt className="mr-3" /> Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg"
                  onClick={() => {
                    router.push("/login");
                    setIsSidebarOpen(false);
                  }}
                >
                  <FaSignInAlt className="mr-3" /> Iniciar sesión
                </button>

                <button
                  className="flex items-center text-white text-sm hover:bg-blue-600 p-3 rounded-lg"
                  onClick={() => {
                    router.push("/register");
                    setIsSidebarOpen(false);
                  }}
                >
                  <FaUserPlus className="mr-3" /> Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}