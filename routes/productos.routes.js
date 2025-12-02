// routes/productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

// Buscar productos (debe ir ANTES de /:id)
router.get('/buscar', productosController.buscar);

// Obtener todos los productos (con filtros opcionales)
router.get('/', productosController.obtenerTodos);

// Obtener producto por ID
router.get('/:id', productosController.obtenerPorId);

module.exports = router;