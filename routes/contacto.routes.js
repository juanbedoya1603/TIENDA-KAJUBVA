// routes/contacto.routes.js
const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contacto.controller');

// Enviar mensaje de contacto (público)
router.post('/', contactoController.enviar);

module.exports = router;