// routes/carrito.routes.js
const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');
const { verificarAutenticacion } = require('../middleware/auth');

// Todas las rutas del carrito requieren autenticación
router.use(verificarAutenticacion);

// Obtener carrito del usuario
router.get('/', carritoController.obtener);

// Agregar producto al carrito
router.post('/agregar', carritoController.agregar);

// Actualizar cantidad de un item
router.put('/actualizar/:item_id', carritoController.actualizar);

// Eliminar item del carrito
router.delete('/eliminar/:item_id', carritoController.eliminar);

// Vaciar carrito
router.delete('/vaciar', carritoController.vaciar);

module.exports = router;