"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import LoadingModal from "@/components/LoadingModal";
import SidebarNavigation from "@/components/student_profile/SidebarNavigation";
import PersonalInfo from "@/components/student_profile/PersonalInfo";
import Languages from "@/components/student_profile/Languages";
import ProgrammingLanguages from "@/components/student_profile/ProgrammingLanguages";
import Certifications from "@/components/student_profile/Certifications";
import WorkExperience from "@/components/student_profile/WorkExperience";
import ExpedienteAcademico from "@/components/student_profile/ExpedienteAcademico";

import { convertTimestampToDate } from "@/utils/FirebaseDateUtils";

const StudentProfile = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [languages, setLanguages] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [degree, setDegree] = useState("");
  const [yearsCompleted, setYearsCompleted] = useState("");
  const [skills, setSkills] = useState([{ language: "" }]);
  const [certifications, setCertifications] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [gender, setGender] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [academicRecord, setAcademicRecord] = useState([]);


  // Cargar datos del usuario desde la BD
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/metadata", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error obteniendo los metadatos");
        }

        const data = await response.json();

        // Redirigir si no hay metadata
        if (!data.metadata) {
          router.push(`/data_complete/student/${id}`);
          return;
        }

        setFirstName(data.metadata.firstName || "");
        setLastName(data.metadata.lastName || "");
        setDegree(data.metadata.degree || "");
        setYearsCompleted(data.metadata.yearsCompleted || "");
        setLanguages(data.metadata.languages || []);
        setSpecialization(data.metadata.specialization || "");
        setSkills(data.metadata.skills || []);
        setCertifications(data.metadata.certifications || []);
        setWorkExperience(data.metadata.workExperience || []);
        setGender(data.metadata.gender || "");

        // Aplicar conversión de fechas
        setEndDate(convertTimestampToDate(data.metadata.endDate));
        setBirthDate(convertTimestampToDate(data.metadata.birthDate));

        // Cargar Expediente Académico
        if (data.metadata.AH?.subjects) {
          setAcademicRecord(data.metadata.AH.subjects);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para actualizar la metadata en la BD con PATCH
  const handleUpdateMetadata = async (updates) => {
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "No hay cambios válidos.",
          INVALID_USER_ID: "Usuario no encontrado.",
          INTERNAL_SERVER_ERROR: "Error en el servidor.",
        };
        const data = await response.json();
        setError(errorMessages[data?.error] || "Error actualizando los metadatos.");
        return;
      }
      const data = await response.json();
      localStorage.setItem("metadata", JSON.stringify(data.updatedFields));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError("Error inesperado al actualizar los datos.");
    }
  };

  const handleDeleteLanguage = async (languageObj) => {
    try {
      const response = await fetch("http://localhost:3000/metadata", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          languages: [{ language: languageObj.language, level: languageObj.level }], // Enviar como objeto
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors?.[0] || "Error eliminando el idioma.");
      }

      // Eliminar del estado global si la petición fue exitosa
      setLanguages((prevLanguages) =>
        prevLanguages.filter((lang) => lang.language !== languageObj.language)
      );
    } catch (error) {
      console.error("Error al eliminar idioma:", error.message);
    }
  };

  const handleSaveGrades = async (updatedGrades) => {
    try {
      const response = await fetch("http://localhost:3000/AH", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ grades: updatedGrades }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error actualizando expediente académico.");
      }
  
      // 📌 Obtener los datos actualizados después de hacer el PATCH
      fetchAcademicRecord();
  
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    }
  };
  


  const fetchAcademicRecord = async () => {
    try {
      const response = await fetch("http://localhost:3000/AH", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error obteniendo expediente académico.");
      }
  
      const data = await response.json();
      if (data.subjects) {
        setAcademicRecord(data.subjects);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  useEffect(() => {
    fetchAcademicRecord();
  }, []); // Se ejecuta solo una vez al cargar el componente
  

  // Función específica para actualizar los datos personales
  const handleSavePersonalInfo = (updatedData) => {
    handleUpdateMetadata(updatedData);
  };

  // Mensaje de bienvenida según el género
  const getWelcomeMessage = () => {
    if (gender === "male") return "Bienvenido";
    if (gender === "female") return "Bienvenida";
    return "Bienvenid@";
  };

  return (
    <>
      {loading ? (
        <LoadingModal /> // Se muestra mientras se cargan los datos
      ) : (
        <div className="flex flex-col items-center min-h-screen p-6">
          <h1
            className="text-3xl font-bold text-center pt-20 pb-10"
            style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}
          >
            {getWelcomeMessage()} {firstName || "Usuario"}
          </h1>

          <div className="bg-white rounded-lg w-full min-w-full md:min-w-screen">

            {/* Diseño responsive */}
            <div className="w-full max-w-8xl flex flex-col md:flex-row">
              <div className="w-full md:w-64 overflow-x-auto md:overflow-visible">
                <SidebarNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>

              {/* Secciones con actualización a la BD */}
              <div className="flex-1 p-6">
                {activeSection === "personal" && (
                  <PersonalInfo
                    firstName={firstName}
                    lastName={lastName}
                    degree={degree}
                    yearsCompleted={yearsCompleted}
                    endDate={endDate}
                    birthDate={birthDate}
                    gender={gender}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setBirthDate={setBirthDate}
                    setGender={setGender}
                    setEndDate={setEndDate}
                    onSave={handleSavePersonalInfo}
                  />
                )}
                {activeSection === "languages" && (
                  <Languages
                    languages={languages}
                    setLanguages={setLanguages}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleDeleteLanguage}
                  />
                )}
                {activeSection === "programming" &&(
                  <ProgrammingLanguages
                    skills={skills}
                    setSkills={setSkills}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleSavePersonalInfo}
                  />
                )}
                {activeSection === "certifications" &&
                  <Certifications
                    certifications={certifications}
                    setCertifications={setCertifications}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleSavePersonalInfo}
                  />
                }
                {activeSection === "employee" &&
                  <WorkExperience
                    workExperience={workExperience}
                    setWorkExperience={setWorkExperience}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleSavePersonalInfo}
                  />
                }
                {activeSection === "AH" && (
                  <ExpedienteAcademico
                    academicRecord={academicRecord}
                    onSave={handleSaveGrades}
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

export default StudentProfile;
