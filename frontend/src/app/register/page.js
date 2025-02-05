// pages/register.js
"use client";

import React from "react";
import { theme } from "../constants/theme";
import "@fontsource/montserrat"; // Importa la fuente aquí
import "../globals.css";

const Register = () => {
  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: theme.palette.neutral.hex }}
      >
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2
            className="text-2xl font-bold text-center pb-8"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            Regístrate
          </h2>
          <form className="space-y-6">
            <div>
              <input
                type="text"
                id="username"
                required
                className="block w-full mt-1 p-3 border border-gray-300"
                placeholder="Nombre de usuario"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                required
                className="block w-full mt-1 p-3 border border-gray-300"
                placeholder="tuemail@live.u-tad.com"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                required
                className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                placeholder="Contraseña"
                style={{
                  borderColor: theme.palette.light.hex,
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.primary.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.bold,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = theme.palette.dark.hex)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  theme.palette.primary.hex)
              }
            >
              Regístrate
            </button>
          </form>
          <p
            className="text-sm text-center mt-8"
            style={{ color: theme.palette.text.hex }}
          >
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              style={{ color: theme.palette.dark.hex }}
              className="hover:underline"
            >
              Inicia sesiónn
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
