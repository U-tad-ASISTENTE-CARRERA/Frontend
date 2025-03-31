import React, { useState, useEffect } from "react";

import { FaDownload } from "react-icons/fa";

const Pupils = ({ students, setStudents, token, setToken }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDownloadReport = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/student/report/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el informe");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `reporte_estudiante_${studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar el informe:", error);
    }
  };

  return (
    <div className='p-4 bg-white rounded-lg'>
      <h2 className='text-lg font-semibold'>
        Alumnos tutelados
      </h2>

      <div className="mt-4 w-full flex items-center">
        <input
          type="text"
          placeholder="Buscar alumno por nombre o apellido..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 mt-6 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Apellidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grupo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descargar informe
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr
                key={student._id || index}
                className="hover:bg-gray-50 transition"
              >
                
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.firstName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.lastName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.yearsCompleted || "No disponible"}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {student.degree || "No disponible"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  <FaDownload
                    className="text-blue-500 cursor-pointer"
                    title="Descargar informe"
                    onClick={() => handleDownloadReport(student._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Pupils;