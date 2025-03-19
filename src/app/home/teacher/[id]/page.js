"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import LoadingModal from "@/components/LoadingModal";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";

const NotificationsInbox = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});

  const fetchMetadata = async () => {
    const response = await fetch("http://localhost:3000/metadata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setMetadata(data.metadata);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/student/teacher/notification",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        setError(data.message || "Error al obtener las notificaciones");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "TEACHER") {
        fetchMetadata();
        fetchNotifications();
      } else {
        setError("No tienes acceso a esta página.");
      }
    } else {
      setError("Debes iniciar sesión para ver esta página.");
    }
  }, []);

  if (error) {
    return (
      <ErrorPopUp
        message={error}
        path={
          error === "Debes iniciar sesión para ver esta página."
            ? "/login"
            : "/home/teacher"
        }
      />
    );
  }

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="flex items-center justify-center gap-x-8 p-8">
        <Image
          src="/instructor.png"
          alt="Profesor"
          className="w-32 fade-left"
          width={600}
          height={600}
        />
        <div className="m-8 flex flex-col items-left fade-up">
          <h1
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xxxxl,
              fontWeight: theme.fontWeight.bold,
            }}
          >
            {metadata.firstName}
            {"   "}
            {metadata.lastName}
          </h1>
          <h3
            style={{
              color: theme.palette.text.hex,
              fontFamily: "Montserrat",
              fontSize: theme.fontSizes.xxl,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            {metadata.specialization}
          </h3>
        </div>
      </div>
      <div
        className="flex items-center justify-left gap-64 w-full max-w-4xl bg-white shadow-lg p-6"
        style={{ borderRadius: theme.buttonRadios.xxl }}
      >
        <Image
          src="/notifications.png"
          alt="Notificaciones"
          className="w-16 fade-left ml-4"
          width={200}
          height={200}
        />

        <div className="space-y-4 flex flex-col">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="p-4 shadow-sm"
                style={{
                  backgroundColor: theme.palette.neutral.hex,
                  borderLeft: `4px solid ${theme.palette.primary.hex}`,
                  borderRadius: theme.buttonRadios.l,
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2
                      style={{
                        fontSize: theme.fontSizes.l,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.palette.dark.hex,
                      }}
                    >
                      {notification.message}
                    </h2>
                    <p
                      style={{
                        fontSize: theme.fontSizes.m,
                        color: theme.palette.text.hex,
                      }}
                    >
                      {new Date(notification.date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={{}}
                    className="px-3 py-1 transition duration-200"
                    style={{
                      backgroundColor: theme.palette.success.hex,
                      color: theme.palette.background.hex,
                      fontSize: theme.fontSizes.m,
                      fontWeight: theme.fontWeight.bold,
                      borderRadius: theme.buttonRadios.xl,
                    }}
                  >
                    Marcar como leído
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                fontSize: theme.fontSizes.m,
                color: theme.palette.gray.hex,
                textAlign: "center",
              }}
            >
              No hay notificaciones nuevas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/*const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/student/teacher/notification/${notificationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Error al marcar como leído");
    }
  } catch (error) {
    console.error("Error de conexión", error);
  }
};*/

export default NotificationsInbox;
