import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdSchool, MdWorkspacePremium, MdWork } from "react-icons/md";
import { theme } from "@/constants/theme";

const StudentHeaderCard = ({ metadata, onSendReport }) => {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    const fetchAssignedTutor = async () => {
      try {
        const teacherId = metadata?.teacherList?.[0];
        if (!teacherId) return;

        const response = await fetch(`http://localhost:3000/teacher/${teacherId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener el tutor");

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setTutor(data[0]);
          console.log("Tutor asignado:", data[0]);
        } else {
          throw new Error("No se encontró ningún tutor en la respuesta");
        }

      } catch (err) {
        console.error("Error fetching assigned tutor:", err.message);
      }
    };

    fetchAssignedTutor();
  }, [metadata.teacherList]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-8 bg-white rounded-2xl shadow-md border border-gray-200">
  {/* Bloque izquierdo: avatar + info */}
  <div className="flex items-center gap-6 w-full md:w-auto">
    <div
      className="rounded-xl overflow-hidden border-4 border-blue-100 bg-white"
      style={{
        width: "112px",
        aspectRatio: "1",
        minWidth: "96px",
        maxWidth: "128px",
      }}
    >
      <Image
        src="/student.png"
        alt="Foto del estudiante"
        width={112}
        height={112}
        className="object-cover w-full h-full"
      />
    </div>

    <div className="flex flex-col justify-center gap-2">
      <h1
        className="text-3xl font-bold"
        style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}
      >
        {metadata.firstName} {metadata.lastName}
      </h1>

      <h3
        className="text-lg font-medium"
        style={{ color: theme.palette.text.hex, fontFamily: "Montserrat" }}
      >
        Alumn{metadata.gender === "male" ? "o" : "a"} de{" "}
        {metadata.degree === "INSO_DATA"
          ? "INSO con mención en DATA"
          : metadata.degree}
      </h3>

      <div className="flex gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 text-blue-800 font-medium text-sm">
          <MdSchool size={18} />
          {Array.isArray(metadata.yearsCompleted)
            ? `${Math.max(...metadata.yearsCompleted) + 1}º${metadata.degree?.startsWith("INSO") ? " INSO" : ""}`
            : "1º"}
        </div>
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-green-50 text-green-800 font-medium text-sm">
          <MdWorkspacePremium size={18} />
          {metadata.certifications?.length || 0} certificaciones
        </div>
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-50 text-yellow-800 font-medium text-sm">
          <MdWork size={18} />
          {metadata.workExperience?.length || 0} experiencias
        </div>
      </div>
    </div>
  </div>

  {/* Card lateral: tutor e informe */}
  <div
    className="w-full md:w-[200px] bg-gray-50 border rounded-xl p-4 shadow-sm text-center"
    style={{ borderColor: theme.palette.lightGray.hex }}
  >
    <h4
      className="text-sm font-medium mb-2"
      style={{ color: theme.palette.gray.hex }}
    >
      Tutor asignado
    </h4>

    <p
      className="text-base font-semibold"
      style={{ color: theme.palette.text.hex }}
    >
      {tutor
        ? `${tutor.metadata.firstName} ${tutor.metadata.lastName}`
        : "Sin tutor asignado"}
    </p>

    {!metadata.informeEnviado && tutor && (
      <button
        onClick={onSendReport}
        className="mt-4 px-4 py-2 text-sm font-medium rounded-full w-full md:w-auto"
        style={{
          backgroundColor: theme.palette.primary.hex,
          color: theme.palette.background.hex,
        }}
      >
        Enviar informe
      </button>
    )}

    {metadata.informeEnviado && (
      <p
        className="mt-4 text-xs font-medium"
        style={{ color: theme.palette.success.hex }}
      >
        Informe ya enviado
      </p>
    )}
  </div>
</div>

  );
};

export default StudentHeaderCard;
