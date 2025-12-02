// routes/categorias.routes.js
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');

// Obtener categoría por slug (debe ir ANTES de /:id)
router.get('/slug/:slug', categoriasController.obtenerPorSlug);

// Obtener todas las categorías
router.get('/', categoriasController.obtenerTodas);

// Obtener categoría por ID
router.get('/:id', categoriasController.obtenerPorId);

module.exports = router;