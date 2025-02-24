"use client";

import React, { useState } from "react";
import { theme } from "../constants/theme";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateForm = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailRegex.test(email) ||
      (!email.endsWith("live.u-tad.com") && !email.endsWith("u-tad.com"))
    ) {
      setError("El correo debe terminar en live.u-tad.com o u-tad.com");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        const errorMessages = {
          INVALID_CREDENTIALS: "Usuario no encontrado",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };

        setError(errorMessages[data?.error] || "Error al acceder");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log(data);
      if (data.user.role == "STUDENT") {
        router.push(`/profile/student/${data.user.id}`);
      } else if (data.user.role == "TEACHER") {
        router.push(`/profile/teacher/${data.user.id}`);
      }
    } catch (error) {
      setError("Ha ocurrido un error inesperado");
      console.log(error);
    }
  };

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
            Iniciar Sesión
          </h2>
          <form className="space-y-6" onSubmit={validateForm}>
            <div>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full mt-1 p-3 border border-gray-300 "
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                placeholder="Contraseña"
                style={{
                  color: theme.palette.text.hex,
                  borderColor: theme.palette.light.hex,
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
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
              Iniciar Sesión
            </button>
          </form>
          <p
            className="text-sm text-center mt-8"
            style={{ color: theme.palette.dark.hex }}
          >
            Olvidaste tu contraseña?{" "}
            <a
              href="/reset-password"
              style={{ color: theme.palette.complementary.hex }}
              className="hover:underline"
            >
              Recupérala
            </a>
          </p>
          <p
            className="text-sm text-center mt-8"
            style={{ color: theme.palette.text.hex }}
          >
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              style={{ color: theme.palette.dark.hex }}
              className="hover:underline"
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
