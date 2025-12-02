const API_URL = "http://localhost:3000/api"; // cambia el puerto si tu backend usa otro

// -------------------------------
// REGISTRO DE USUARIO
// -------------------------------
export async function registrarUsuario(datosUsuario) {
    try {
        const response = await fetch(`${API_URL}/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // IMPORTANTE para enviar cookies de sesión
            body: JSON.stringify(datosUsuario)
        });

        return await response.json();
    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        return { success: false, message: "Error de conexión" };
    }
}

// -------------------------------
// LOGIN
// -------------------------------
export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        return await response.json();
    } catch (error) {
        console.error("Error en login:", error);
        return { success: false, message: "Error de conexión" };
    }
}

// -------------------------------
// VER USUARIO LOGEADO
// -------------------------------
export async function obtenerUsuario() {
    try {
        const response = await fetch(`${API_URL}/usuario`, {
            method: "GET",
            credentials: "include"
        });

        return await response.json();
    } catch (error) {
        console.error("Error en obtenerUsuario:", error);
        return { success: false, message: "Error de conexión" };
    }
}

// -------------------------------
// LOGOUT
// -------------------------------
export async function logout() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });

        return await response.json();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return { success: false, message: "Error de conexión" };
    }
}
