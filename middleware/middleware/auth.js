// middleware/auth.js - Middleware para verificar autenticación

// Verificar si el usuario está autenticado
const verificarAutenticacion = (req, res, next) => {
    if (!req.session.usuarioId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Debe iniciar sesión para acceder a este recurso' 
        });
    }
    next();
};

// Verificar si el usuario es administrador (opcional para futuras funciones)
const verificarAdmin = (req, res, next) => {
    if (!req.session.usuarioId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Debe iniciar sesión' 
        });
    }
    
    if (!req.session.esAdmin) {
        return res.status(403).json({ 
            success: false, 
            message: 'No tiene permisos de administrador' 
        });
    }
    
    next();
};

module.exports = { 
    verificarAutenticacion,
    verificarAdmin
};