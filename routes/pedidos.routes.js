// routes/pedidos.routes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');
const { verificarAutenticacion } = require('../middleware/auth');

// Todas las rutas de pedidos requieren autenticación
router.use(verificarAutenticacion);

// Crear nuevo pedido
router.post('/', pedidosController.crear);

// Obtener pedidos del usuario
router.get('/', pedidosController.obtenerTodos);

// Obtener detalle de un pedido
router.get('/:id', pedidosController.obtenerPorId);

// Cancelar pedido
router.put('/:id/cancelar', pedidosController.cancelar);

module.exports = router;