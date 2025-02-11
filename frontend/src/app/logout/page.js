const LogOut = () => {

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
        <div className="overlay">
          <div className="modal">
            <h2>¿Estás seguro de que quieres cerrar tu usuario?</h2>
            <button className="confirm" onClick={ handleLogOut }>Confirmar</button>
            <button className="cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
    )
}

export default LogOut;