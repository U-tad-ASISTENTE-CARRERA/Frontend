"use client";

import { useState } from "react";
import { styles } from "../constants/theme";
import { theme } from "../constants/theme";

const LogOut = () => {
  const [error, setError] = useState("");

  const handleLogOut = async (e) => {
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
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("metadata");
        window.location.href = "/";
      }
    } catch (error) {}
  };

  return (
    <div style={{ ...styles.overlay, fontFamily: "Montserrat" }}>
      <div
        style={{
          ...styles.modal,
          background: theme.palette.background.hex,
          color: theme.palette.text.hex,
          borderRadius: theme.buttonRadios.m,
        }}
      >
        <h2
          style={{
            fontSize: theme.fontSizes.xl,
            fontWeight: theme.fontWeight.bold,
          }}
        >
          ¿Estás seguro de que quieres cerrar sesión?
        </h2>

        {/* Mostrar error si existe */}
        {error && (
          <p
            style={{
              color: theme.palette.error.hex,
              fontSize: theme.fontSizes.m,
            }}
          >
            {error}
          </p>
        )}

        <button
          style={{
            ...styles.modalButton,
            backgroundColor: theme.palette.error.hex,
            color: theme.palette.background.hex,
            borderRadius: theme.buttonRadios.m,
          }}
          onClick={handleLogOut}
        >
          Salir
        </button>
        <button
          style={{
            ...styles.modalButton,
            backgroundColor: theme.palette.gray.hex,
            color: theme.palette.text.hex,
            borderRadius: theme.buttonRadios.m,
          }}
          onClick={() => (window.location.href = "/")}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default LogOut;
