"use client"

import { useState } from "react";
import { styles } from "../constants/theme";

const LogOut = () => {
    const [error, setError] = useState("");

    const handleLogOut = async(e) => {
        setError("");

        try{
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })

            if (!response.ok){
                setError("Error al cerrar sesión")
                return
            } else {
                localStorage.removeItem('token')
                window.location.href = '/'
            }
        } catch (error){

        }
    }

    return(
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>¿Estás seguro de que quieres cerrar sesión?</h2>
                    <button
                        style={{ ...styles.modalButton, ...styles.confirm }}
                        onClick={() => (handleLogOut())}
                    >
                        Salir
                    </button>
                    <button
                        style={{ ...styles.modalButton, ...styles.cancel }}
                        onClick={() => window.location.href = "/"}
                    >
                        Cancelar
                    </button>
            </div>
        </div>
    )
}

export default LogOut;