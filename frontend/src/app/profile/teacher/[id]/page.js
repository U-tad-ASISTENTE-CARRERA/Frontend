"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "../../../constants/theme";
import moment from "moment";
import "@fontsource/montserrat";
import "../../../globals.css";

const Teacher = ({params}) => {
    const { id } = React.use(params)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [dni, setDni] = useState("")
    const [specialization, setSpecialization] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {

            setLoading(true)

            try{
                const response = await fetch("http://localhost:3000/metadata", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if(!response.ok){
                    throw new Error("Error al obtener metedatos del profesor")
                }

                const data = await response.json()

                setFirstName(data.metadata.firstName || "")
                setLastName(data.metadata.lastName || "")
                setBirthDate(data.metadata.birthDate ||"")
                setDni(data.metadata.dni || "")
                setSpecialization(data.metadata.specialization || "Sin especialización")

            } catch (error){
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const dniRegex = (dni) => {
        const dniPattern = /^\d{8}[A-Z]$/
        return dniPattern.test(dni)
    }

    const dateRegex = (dateString) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        return (
          datePattern.test(dateString) && !isNaN(new Date(dateString).getTime())
        )
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        if (!dniRegex(dni)) {
            setError(
              "El DNI debe tener el formato correcto (8 dígitos seguidos de una letra)."
            )
            return
        }
      
        if (!dateRegex(birthDate)) {
            setError(
                "La fecha de nacimiento debe estar en el formato YYYY-MM-DD."
            )
            return
        }

        try{
            const response = await fetch("http://localhost:3000/metadata", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({firstName, lastName, birthDate, dni, specialization})
            })

            if (!response.ok){
                throw new Error("Error al actualizar los metadatos del profesor")
            }

            const data = await response.json()

            console.log(data)

            if(!response.ok){
                const errorMessages = {
                    NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido",
                    INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
                  }
          
                  setError(
                    errorMessages[data?.error] || "Error al actualizar los metadatos"
                  )
                  return
            }

            setSuccess(true);
            window.location.reload()
        } catch (error){
            console.error(error);
            setError("Ha ocurrido un error inesperado");
        }
    }

    return(
        <>
        {loading ? (
            <p>Cargando...</p>
        ) : (
            <div 
                className="flex items-center justify-evenly min-h-screen"
                style={{ backgroundColor: theme.palette.neutral.hex }}
            >
                <div className="w-full max-w-4xl ml-32 p-6 bg-white rounded-lg shadow-lg">
                    <h2 
                        className="text-xl font-bold text-center pb-4"
                        style={{
                            color: theme.palette.primary.hex,
                            fontFamily: "Montserrat",
                        }}
                    >
                        Mi panel : {id}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-3">
                        {/* Sección de Información Personal */}
                        <div className="m-8 space-y-3">
                            <h2
                                className="text-lg font-semibold mb-1"
                                style={{ color: theme.palette.text.hex }}
                            >
                                Información Personal
                            </h2>

                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Nombre"
                                className="block w-full mt-1 p-2 border border-gray-300"
                                style={{
                                    borderColor: theme.palette.light.hex,
                                    color: theme.palette.text.hex,
                                    fontFamily: "Montserrat, sans-serif",
                                    borderRadius: theme.buttonRadios.m,
                                }}
                            />

                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Apellido"
                                className="block w-full mt-1 p-2 border border-gray-300"
                                style={{
                                    borderColor: theme.palette.light.hex,
                                    color: theme.palette.text.hex,
                                    fontFamily: "Montserrat, sans-serif",
                                    borderRadius: theme.buttonRadios.m,
                                }}
                            />

                            <input
                                type="date"
                                value={moment(birthDate).format("YYYY-MM-DD")}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="block w-full mt-1 p-2 border border-gray-300"
                                style={{
                                    borderColor: theme.palette.light.hex,
                                    color: theme.palette.text.hex,
                                    fontFamily: "Montserrat, sans-serif",
                                    borderRadius: theme.buttonRadios.m,
                                }}
                            />

                            <input
                                type="text"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="DNI"
                                className="block w-full mt-1 p-2 border border-gray-300"
                                style={{
                                    borderColor: theme.palette.light.hex,
                                    color: theme.palette.text.hex,
                                    fontFamily: "Montserrat, sans-serif",
                                    borderRadius: theme.buttonRadios.m,
                                }}
                            />
                        </div>

                        {/* Sección de Especialización */}
                        <div className="m-8 space-y-3">
                            <h2
                                className="text-lg font-semibold mb-1"
                                style={{ color: theme.palette.text.hex }}
                            >
                                Especialización
                            </h2>

                            <input
                                type="text"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                placeholder="Especialización"
                                className="block w-full mt-1 p-2 border border-gray-300"
                                style={{
                                    borderColor: theme.palette.light.hex,
                                    color: theme.palette.text.hex,
                                    fontFamily: "Montserrat, sans-serif",
                                    borderRadius: theme.buttonRadios.m,
                                }}
                            />
                        </div>

                        {/* Botón de Envío */}
                        <div className="pt-8 pl-8 space-y-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white rounded-md transition duration-200"
                                style={{
                                    backgroundColor: theme.palette.primary.hex,
                                    borderRadius: theme.buttonRadios.m,
                                    fontWeight: theme.fontWeight.bold,
                                }}
                            >
                                Actualizar
                            </button>
                        
                        {/* Mensajes de error y éxito */}
                            {error && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="text-green-500 text-sm text-center mt-2">
                                    Metadatos actualizados con éxito
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                <div className="w-full justify-end max-w-md p-8 bg-white rounded-lg shadow-lg mr-32">
                    <h2
                        className="text-2xl font-bold text-center pb-4 mb-6"
                        style={{
                            color: theme.palette.primary.hex,
                            fontFamily: "Montserrat",
                        }}
                    >
                        Información del Usuario
                    </h2> 

                    <h3
                        className="text-xl font-semibold mb-2 mt-2"
                        style={{ color: theme.palette.text.hex }}
                    >
                        Especialización
                    </h3>

                    <p style={{ color: theme.palette.light.hex }}>
                        {specialization ? specialization : "Sin especialización"}
                    </p>
                </div>
            </div>
        )}
        </>
    )
}

export default Teacher;