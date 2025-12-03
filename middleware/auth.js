// middleware/auth.js - Middleware de autenticación CORREGIDO

// Verificar si el usuario está autenticado
const verificarAutenticacion = (req, res, next) => {
    console.log('\n🔐 MIDDLEWARE AUTH - Verificando autenticación...');
    console.log('🔑 Session ID:', req.sessionID);
    console.log('👤 Usuario ID en sesión:', req.session.usuarioId);
    console.log('📦 Sesión completa:', JSON.stringify(req.session, null, 2));
    
    // ✅ CAMBIO AQUÍ: Verificar usuarioId en lugar de usuario
    if (req.session && req.session.usuarioId) {
        console.log('✅ MIDDLEWARE AUTH - Usuario autenticado, continuando...');
        next();
    } else {
        console.log('❌ MIDDLEWARE AUTH - Usuario NO autenticado');
        return res.status(401).json({
            success: false,
            message: 'Debes iniciar sesión para acceder a este recurso'
        });
    }
};

// Verificar si el usuario es administrador (opcional para futuro)
const verificarAdmin = (req, res, next) => {
    if (req.session && req.session.usuarioId && req.session.rol === 'admin') {
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
    if (req.session && req.session.usuarioId) {
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