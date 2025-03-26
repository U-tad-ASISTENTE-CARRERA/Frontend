"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import LoadingModal from "@/components/LoadingModal";
import { FaDownload } from "react-icons/fa";
import SidebarNavigation from "@/components/teacher_profile/SidebarNavigationTeacher";
import Pupils from "@components/teacher_profile/Pupils";
import PersonalInfo from "@/components/teacher_profile/PersonalInfo";

const Teacher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentsError, setStudentsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedToken = localStorage.getItem("token");
      if (!storedToken) {
        const urlToken = searchParams.get("token");
        if (urlToken) {
          localStorage.setItem("token", urlToken);
          storedToken = urlToken;
        }
      }
      setToken(storedToken);
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!token || !id) return;
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener metadatos del profesor");
      }
      const data = await response.json();
      if (!data.metadata) {
        router.push(`/data_complete/teacher/${id}`);
        return;
      }
      const metadata = data.metadata || {};

      setShowModal(Object.keys(metadata).length === 0);

      setFirstName(metadata.firstName);
      setLastName(metadata.lastName);
      setGender(metadata.gender);
      setSpecialization(metadata.specialization);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!token || !id) return;
    try {
      const response = await fetch(
        "http://localhost:3000/student/teacher/getAllStudents",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la lista de estudiantes");
      }

      const data = await response.json();

      setStudents(data.message === "No students found" ? [] : data);
    } catch (error) {
      setStudentsError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, [token, id]);

  const getWelcomeMessage = () => {
    if (gender === "male") return "Bienvenido";
    if (gender === "female") return "Bienvenida";
    return "Bienvenid@";
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);

  return (
    <>
      {isLoading && <LoadingModal message="Cargando perfil..." />}

      {!isLoading && showModal && (
        <ErrorPopUp
          message={"Debes completar tus datos básicos"}
          path={`/data_complete/teacher/${id}`}
        />
      )}

      {!isLoading && !showModal && (
        <div className="flex flex-col items-center min-h-screen p-6">
          <h1
            className="text-3xl font-bold text-center pt-20 pb-10"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            {getWelcomeMessage()} {firstName || "Usuario"}
          </h1>

          <div className="bg-white w-full min-w-full md:win-w-screen rounded-lg">
            <div className="w-full max-w-8xl flex flex-col md:flex-row">
              <div className="w-full md:w-64 overflow-x-auto md:overflow-visible">
                <SidebarNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>

              <div className="flex-1 p-6">
                {activeSection === "personal" && (
                  <PersonalInfo
                    firstName={firstName}
                    lastName={lastName}
                    gender={gender}
                    specialization={specialization} 
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setGender={setGender}
                    setSpecialization={setSpecialization}
                  />
                )}

                {activeSection === "pupils" && (
                  <Pupils
                    students={students}
                    setStudents={setStudents}
                    token={token}
                    setToken={setToken}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teacher;
