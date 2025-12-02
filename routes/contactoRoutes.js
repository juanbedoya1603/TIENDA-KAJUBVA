// routes/contacto.routes.js - Rutas de contacto
const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contacto.controller');
const { verificarAdmin } = require('../middleware/auth');

// POST /api/contacto - Enviar mensaje de contacto (público)
// Body: { nombre, email, asunto, mensaje }
router.post('/', contactoController.enviar);

// GET /api/contacto - Obtener todos los mensajes (solo admin)
router.get('/', verificarAdmin, contactoController.obtenerTodos);

// PUT /api/contacto/:id/leido - Marcar mensaje como leído (solo admin)
router.put('/:id/leido', verificarAdmin, contactoController.marcarLeido);

module.exports = router;