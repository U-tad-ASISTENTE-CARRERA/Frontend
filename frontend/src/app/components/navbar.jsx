'use client'

import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect} from "react";
import { styles } from '../constants/theme';

export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        //Comprobamos si existe un token
        const IsToken = localStorage.getItem('token')

        if (IsToken) {
            //preguntar como sacar la información del usuario
            fetch("http://localhost:3000/login", {
                body: JSON.stringify()
            }).then(response => response.json())
            .then(data => setIsLoggedIn(data.loggedIn))
            .catch(error => console.error('Error:', error));
        }
    })


    const handleLogOut = async(e) => {
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify()
        })

        if (!response.ok){
            throw new Error("Error al cerrar sesión")
        } else {
            sessionStorage.removeItem('token')
            window.location.href = '/'
        }
    }

    return(
        <nav className= "bg-blue-600 p-4 flex items-center justify-between rounded-lg shadow-lg m-4">
            <img src="/logo.png" title="Logo" className="h-10 w-10"></img>
                
            <input type="checkbox" id="menu-toggle" className="hidden peer" />

            <label htmlFor="menu-toggle" className="text-white cursor-pointer md:hidden">
                <i className="bi bi-list text-2xl"></i>
            </label>

			<ul className="hidden peer-checked:flex flex-col md:flex md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-white text-lg">
                <li className="md:ml-auto">
                    <Link href="/" className="hover:text-gray-300 transition-colors duration-200 text-nowrap">
                        <i className="bi bi-house-door-fill text-4xl"></i>
                    </Link>
                </li>
                
                <li>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Introducción</a>
                </li>

                <li>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Catálogo</a>
                </li>

                <li>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Ayuda</a>
                </li>

                <li className="md:ml-auto">
                    <div className="hover:text-gray-300 transition-colors duration-200 text-nowrap" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                        <i className="bi bi-person-fill text-4xl"></i>

                        {isDropdownOpen && (
                            <div style={styles.dropdown}>
                                {isLoggedIn ? (
                                    <div style={styles.submenu}>
                                        <button style={styles.dropdownButton} onClick={() => window.location.href = '/profile'}>Mi Perfil</button>
                                        <button style={styles.dropdownButton} onClick={() => setIsModalOpen(true)}>LogOut</button>
                                    </div>
                                ) : (
                                    <button style={styles.dropdownButton} onClick={() => window.location.href = '/login'}>LogIn</button>
                                )}
                            </div>
                        )}

                        {isModalOpen && (
                            <div style={styles.overlay}>
                                <div style={styles.modal}>
                                    <h2>¿Estás seguro de que quieres cerrar sesión?</h2>
                                    <button style={{...style.modalButton, ...style.confirm}} onClick={handleLogOut}>Salir</button>
                                    <button style={{...style.modalButton, ...style.cancel}} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                </div>
                            </div>
                        )}

                    </div>
                </li>
            </ul>   
		</nav>
    )
}


