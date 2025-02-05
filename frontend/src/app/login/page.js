// pages/login.js
"use client";

import React from "react";
import theme from "../../app/constants/theme.json";

const Login = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: theme.theme.palette.neutral.hex }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: theme.theme.palette.primary.hex }}
        >
          Iniciar Sesión
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              required
              className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="tuemail@ejemplo.com"
              style={{ borderColor: theme.theme.palette.light.hex }}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              required
              className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="********"
              style={{ borderColor: theme.theme.palette.light.hex }}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-md transition duration-200"
            style={{
              backgroundColor: theme.theme.palette.primary.hex,
              borderRadius: theme.theme.buttonRadios.m,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                theme.theme.palette.dark.hex)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                theme.theme.palette.primary.hex)
            }
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-sm text-center">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            style={{ color: theme.theme.palette.complementary.hex }}
            className="hover:underline"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
