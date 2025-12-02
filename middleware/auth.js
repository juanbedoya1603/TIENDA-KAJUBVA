// middleware/auth.js - Middleware de autenticación

// Verificar si el usuario está autenticado
const verificarAutenticacion = (req, res, next) => {
    // Verificar si existe la sesión y el usuario
    if (req.session && req.session.usuario) {
        // Usuario autenticado, continuar
        next();
    } else {
        // Usuario no autenticado
        return res.status(401).json({
            success: false,
            message: 'Debes iniciar sesión para acceder a este recurso'
        });
    }
};

// Verificar si el usuario es administrador (opcional para futuro)
const verificarAdmin = (req, res, next) => {
    if (req.session && req.session.usuario && req.session.usuario.rol === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos de administrador'
        });
    }
};

// Verificar si el usuario ya está autenticado (para rutas de login/registro)
const verificarNoAutenticado = (req, res, next) => {
    if (req.session && req.session.usuario) {
        // Ya está autenticado, redirigir o enviar error
        return res.status(400).json({
            success: false,
            message: 'Ya has iniciado sesión'
        });
    } else {
        next();
    }
};

module.exports = {
    verificarAutenticacion,
    verificarAdmin,
    verificarNoAutenticado
};