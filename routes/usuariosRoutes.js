// routes/usuarios.routes.js - Rutas de usuarios y autenticación
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarAutenticacion } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
// POST /api/registro - Registrar nuevo usuario
// Body: { nombre, email, password, telefono, direccion, ciudad }
router.post('/registro', usuariosController.registrar);

// POST /api/login - Iniciar sesión
// Body: { email, password }
router.post('/login', usuariosController.login);

// POST /api/logout - Cerrar sesión
router.post('/logout', usuariosController.logout);

// Rutas protegidas (requieren autenticación)
// GET /api/usuario - Obtener usuario actual
router.get('/usuario', verificarAutenticacion, usuariosController.obtenerActual);

// PUT /api/usuario/perfil - Actualizar perfil
// Body: { nombre, telefono, direccion, ciudad }
router.put('/usuario/perfil', verificarAutenticacion, usuariosController.actualizarPerfil);

// PUT /api/usuario/password - Cambiar contraseña
// Body: { password_actual, password_nuevo }
router.put('/usuario/password', verificarAutenticacion, usuariosController.cambiarPassword);

module.exports = router;