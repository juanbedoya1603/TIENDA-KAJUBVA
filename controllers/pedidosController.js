// controllers/pedidos.controller.js - Lógica de pedidos
const pool = require('../config/database');

const pedidosController = {
    // Crear nuevo pedido
    crear: async (req, res) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            const { direccion_envio, ciudad_envio, telefono_contacto, metodo_pago, notas } = req.body;
            const usuarioId = req.session.usuarioId;

            if (!usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Debe iniciar sesión para realizar un pedido' 
                });
            }

            // Validar datos requeridos
            if (!direccion_envio || !ciudad_envio || !telefono_contacto) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Faltan datos requeridos: dirección, ciudad y teléfono' 
                });
            }

            // Obtener carrito
            const sesionId = req.session.id;
            const [carrito] = await connection.query(
                'SELECT * FROM carritos WHERE sesion_id = ? OR usuario_id = ? ORDER BY fecha_actualizacion DESC LIMIT 1',
                [sesionId, usuarioId]
            );

            if (carrito.length === 0) {
                throw new Error('Carrito no encontrado');
            }

            const carritoId = carrito[0].id;

            // Obtener items del carrito
            const [items] = await connection.query(
                'SELECT * FROM carrito_items WHERE carrito_id = ?',
                [carritoId]
            );

            if (items.length === 0) {
                throw new Error('El carrito está vacío');
            }

            // Calcular total y verificar stock
            let total = 0;
            for (const item of items) {
                const [producto] = await connection.query(
                    'SELECT stock, nombre FROM productos WHERE id = ?',
                    [item.producto_id]
                );

                if (producto.length === 0) {
                    throw new Error(`Producto con ID ${item.producto_id} no encontrado`);
                }

                if (producto[0].stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto[0].nombre}. Disponible: ${producto[0].stock}, Solicitado: ${item.cantidad}`);
                }

                total += parseFloat(item.precio_unitario) * item.cantidad;
            }

            // Generar número de pedido único
            const numeroPedido = 'PED-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

            // Crear pedido
            const [pedidoResult] = await connection.query(
                `INSERT INTO pedidos (usuario_id, numero_pedido, total, direccion_envio, ciudad_envio, telefono_contacto, metodo_pago, notas, estado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
                [usuarioId, numeroPedido, total, direccion_envio, ciudad_envio, telefono_contacto, metodo_pago || 'Sin especificar', notas || '']
            );

            const pedidoId = pedidoResult.insertId;

            // Insertar detalles del pedido y actualizar stock
            for (const item of items) {
                const subtotal = parseFloat(item.precio_unitario) * item.cantidad;
                
                // Insertar detalle
                await connection.query(
                    `INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                     VALUES (?, ?, ?, ?, ?)`,
                    [pedidoId, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
                );

                // Actualizar stock
                await connection.query(
                    'UPDATE productos SET stock = stock - ? WHERE id = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            // Limpiar carrito
            await connection.query('DELETE FROM carrito_items WHERE carrito_id = ?', [carritoId]);

            await connection.commit();

            res.json({ 
                success: true, 
                message: 'Pedido creado exitosamente',
                data: { 
                    pedido_id: pedidoId, 
                    numero_pedido: numeroPedido, 
                    total: total.toFixed(2),
                    cantidad_items: items.length
                }
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error al crear pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al crear pedido' 
            });
        } finally {
            connection.release();
        }
    },

    // Obtener todos los pedidos del usuario
    obtenerTodos: async (req, res) => {
        try {
            const usuarioId = req.session.usuarioId;

            if (!usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Debe iniciar sesión' 
                });
            }

            const [pedidos] = await pool.query(
                `SELECT 
                    id,
                    numero_pedido,
                    total,
                    estado,
                    metodo_pago,
                    direccion_envio,
                    ciudad_envio,
                    fecha_pedido,
                    fecha_actualizacion
                FROM pedidos 
                WHERE usuario_id = ? 
                ORDER BY fecha_pedido DESC`,
                [usuarioId]
            );

            res.json({ 
                success: true, 
                data: pedidos,
                cantidad: pedidos.length
            });
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener pedidos' 
            });
        }
    },

    // Obtener detalle de un pedido específico
    obtenerPorId: async (req, res) => {
        try {
            const usuarioId = req.session.usuarioId;
            const pedidoId = req.params.id;

            if (!usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Debe iniciar sesión' 
                });
            }

            // Obtener información del pedido
            const [pedido] = await pool.query(
                'SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?',
                [pedidoId, usuarioId]
            );

            if (pedido.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }

            // Obtener detalles del pedido
            const [detalles] = await pool.query(`
                SELECT 
                    pd.id,
                    pd.producto_id,
                    pd.cantidad,
                    pd.precio_unitario,
                    pd.subtotal,
                    p.nombre,
                    p.descripcion,
                    p.imagen_url
                FROM pedido_detalles pd
                JOIN productos p ON pd.producto_id = p.id
                WHERE pd.pedido_id = ?
            `, [pedidoId]);

            res.json({ 
                success: true, 
                data: { 
                    pedido: pedido[0], 
                    detalles,
                    cantidad_items: detalles.length
                } 
            });
        } catch (error) {
            console.error('Error al obtener detalle del pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener detalle del pedido' 
            });
        }
    },

    // Cancelar pedido (solo si está en estado 'pendiente')
    cancelar: async (req, res) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const usuarioId = req.session.usuarioId;
            const pedidoId = req.params.id;

            if (!usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Debe iniciar sesión' 
                });
            }

            // Verificar que el pedido existe y pertenece al usuario
            const [pedido] = await connection.query(
                'SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?',
                [pedidoId, usuarioId]
            );

            if (pedido.length === 0) {
                throw new Error('Pedido no encontrado');
            }

            // Solo se pueden cancelar pedidos en estado 'pendiente'
            if (pedido[0].estado !== 'pendiente') {
                throw new Error(`No se puede cancelar un pedido en estado '${pedido[0].estado}'`);
            }

            // Obtener detalles del pedido para restaurar stock
            const [detalles] = await connection.query(
                'SELECT producto_id, cantidad FROM pedido_detalles WHERE pedido_id = ?',
                [pedidoId]
            );

            // Restaurar stock
            for (const detalle of detalles) {
                await connection.query(
                    'UPDATE productos SET stock = stock + ? WHERE id = ?',
                    [detalle.cantidad, detalle.producto_id]
                );
            }

            // Actualizar estado del pedido
            await connection.query(
                'UPDATE pedidos SET estado = ? WHERE id = ?',
                ['cancelado', pedidoId]
            );

            await connection.commit();

            res.json({ 
                success: true, 
                message: 'Pedido cancelado exitosamente' 
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error al cancelar pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al cancelar pedido' 
            });
        } finally {
            connection.release();
        }
    }
};

module.exports = pedidosController;