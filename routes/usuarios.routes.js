// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarAutenticacion } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', usuariosController.registrar);
router.post('/login', usuariosController.login);
router.post('/logout', usuariosController.logout);

// Rutas protegidas (requieren autenticación)
router.get('/usuario', verificarAutenticacion, usuariosController.obtenerActual);
router.put('/usuario/perfil', verificarAutenticacion, usuariosController.actualizarPerfil);
router.put('/usuario/password', verificarAutenticacion, usuariosController.cambiarPassword);

module.exports = router;