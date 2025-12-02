// routes/pedidos.routes.js - Rutas de pedidos
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');
const { verificarAutenticacion } = require('../middleware/auth');

// Todas las rutas de pedidos requieren autenticación
router.use(verificarAutenticacion);

// POST /api/pedidos - Crear nuevo pedido
// Body: { direccion_envio, ciudad_envio, telefono_contacto, metodo_pago, notas }
router.post('/', pedidosController.crear);

// GET /api/pedidos - Obtener todos los pedidos del usuario
router.get('/', pedidosController.obtenerTodos);

// GET /api/pedidos/:id - Obtener detalle de un pedido
router.get('/:id', pedidosController.obtenerPorId);

// PUT /api/pedidos/:id/cancelar - Cancelar pedido
router.put('/:id/cancelar', pedidosController.cancelar);

module.exports = router;