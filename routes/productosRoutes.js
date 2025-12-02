// routes/productos.routes.js - Rutas de productos
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

// GET /api/productos - Obtener todos los productos (con filtros opcionales)
// Query params: ?tipo=kit&categoria=aromaticas&destacado=true&limite=10
router.get('/', productosController.obtenerTodos);

// GET /api/productos/buscar?q=tomate - Buscar productos
router.get('/buscar', productosController.buscar);

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', productosController.obtenerPorId);

module.exports = router;