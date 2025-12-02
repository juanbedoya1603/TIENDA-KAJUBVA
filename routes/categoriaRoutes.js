// routes/categorias.routes.js - Rutas de categorías
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');

// GET /api/categorias - Obtener todas las categorías
router.get('/', categoriasController.obtenerTodas);

// GET /api/categorias/:id - Obtener categoría por ID
router.get('/:id', categoriasController.obtenerPorId);

// GET /api/categorias/slug/:slug - Obtener categoría por slug con productos
router.get('/slug/:slug', categoriasController.obtenerPorSlug);

module.exports = router;