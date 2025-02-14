"use client"

import { styles } from "../constants/theme";

const LogOut = () => {

    const handleLogOut = async(e) => {
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify()
        })

        if (!response.ok){
            throw new Error("Error al cerrar sesión")
        } else {
            localStorage.removeItem('token')
            window.location.href = '/'
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