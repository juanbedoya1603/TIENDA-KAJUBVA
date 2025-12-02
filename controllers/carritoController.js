// controllers/carrito.controller.js - Lógica del carrito de compras
const pool = require('../config/database');

const carritoController = {
    // Obtener carrito del usuario/sesión
    obtener: async (req, res) => {
        try {
            const sesionId = req.session.id;
            const usuarioId = req.session.usuarioId || null;

            // Buscar carrito existente
            let [carrito] = await pool.query(
                'SELECT * FROM carritos WHERE sesion_id = ? OR usuario_id = ? ORDER BY fecha_actualizacion DESC LIMIT 1',
                [sesionId, usuarioId]
            );

            // Si no existe carrito, crear uno nuevo
            if (carrito.length === 0) {
                const [result] = await pool.query(
                    'INSERT INTO carritos (usuario_id, sesion_id) VALUES (?, ?)',
                    [usuarioId, sesionId]
                );
                const carritoId = result.insertId;
                
                return res.json({ 
                    success: true, 
                    data: { 
                        id: carritoId, 
                        items: [], 
                        total: 0,
                        cantidad_items: 0 
                    } 
                });
            }

            const carritoId = carrito[0].id;

            // Obtener items del carrito con información de productos
            const [items] = await pool.query(`
                SELECT 
                    ci.id,
                    ci.producto_id,
                    ci.cantidad,
                    ci.precio_unitario,
                    p.nombre,
                    p.descripcion,
                    p.imagen_url,
                    p.stock,
                    (ci.cantidad * ci.precio_unitario) as subtotal
                FROM carrito_items ci
                JOIN productos p ON ci.producto_id = p.id
                WHERE ci.carrito_id = ?
            `, [carritoId]);

            // Calcular total
            const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
            const cantidadItems = items.reduce((sum, item) => sum + item.cantidad, 0);

            res.json({ 
                success: true, 
                data: { 
                    id: carritoId, 
                    items, 
                    total: total.toFixed(2),
                    cantidad_items: cantidadItems
                } 
            });
        } catch (error) {
            console.error('Error al obtener carrito:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener carrito' 
            });
        }
    },

    // Agregar producto al carrito
    agregar: async (req, res) => {
        try {
            const { producto_id, cantidad = 1 } = req.body;
            const sesionId = req.session.id;
            const usuarioId = req.session.usuarioId || null;

            // Validar cantidad
            if (cantidad < 1) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La cantidad debe ser mayor a 0' 
                });
            }

            // Verificar que el producto existe y tiene stock
            const [producto] = await pool.query(
                'SELECT * FROM productos WHERE id = ? AND activo = 1',
                [producto_id]
            );

            if (producto.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Producto no encontrado' 
                });
            }

            if (producto[0].stock < cantidad) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stock insuficiente. Disponible: ${producto[0].stock}` 
                });
            }

            // Buscar o crear carrito
            let [carrito] = await pool.query(
                'SELECT * FROM carritos WHERE sesion_id = ? OR usuario_id = ? ORDER BY fecha_actualizacion DESC LIMIT 1',
                [sesionId, usuarioId]
            );

            let carritoId;
            if (carrito.length === 0) {
                const [result] = await pool.query(
                    'INSERT INTO carritos (usuario_id, sesion_id) VALUES (?, ?)',
                    [usuarioId, sesionId]
                );
                carritoId = result.insertId;
            } else {
                carritoId = carrito[0].id;
            }

            // Verificar si el producto ya está en el carrito
            const [itemExistente] = await pool.query(
                'SELECT * FROM carrito_items WHERE carrito_id = ? AND producto_id = ?',
                [carritoId, producto_id]
            );

            if (itemExistente.length > 0) {
                // Actualizar cantidad (verificar stock total)
                const nuevaCantidad = itemExistente[0].cantidad + cantidad;
                
                if (producto[0].stock < nuevaCantidad) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Stock insuficiente. Ya tienes ${itemExistente[0].cantidad} en el carrito. Disponible: ${producto[0].stock}` 
                    });
                }

                await pool.query(
                    'UPDATE carrito_items SET cantidad = cantidad + ? WHERE id = ?',
                    [cantidad, itemExistente[0].id]
                );
            } else {
                // Insertar nuevo item
                await pool.query(
                    'INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                    [carritoId, producto_id, cantidad, producto[0].precio]
                );
            }

            res.json({ 
                success: true, 
                message: 'Producto agregado al carrito' 
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al agregar producto al carrito' 
            });
        }
    },

    // Actualizar cantidad de un item
    actualizar: async (req, res) => {
        try {
            const { cantidad } = req.body;
            const { item_id } = req.params;

            if (cantidad < 1) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La cantidad debe ser mayor a 0' 
                });
            }

            // Verificar stock disponible
            const [item] = await pool.query(
                `SELECT ci.*, p.stock, p.nombre 
                 FROM carrito_items ci 
                 JOIN productos p ON ci.producto_id = p.id 
                 WHERE ci.id = ?`,
                [item_id]
            );

            if (item.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Item no encontrado en el carrito' 
                });
            }

            if (item[0].stock < cantidad) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stock insuficiente para ${item[0].nombre}. Disponible: ${item[0].stock}` 
                });
            }

            await pool.query(
                'UPDATE carrito_items SET cantidad = ? WHERE id = ?', 
                [cantidad, item_id]
            );

            res.json({ 
                success: true, 
                message: 'Cantidad actualizada' 
            });
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar cantidad' 
            });
        }
    },

    // Eliminar item del carrito
    eliminar: async (req, res) => {
        try {
            const { item_id } = req.params;

            const [result] = await pool.query(
                'DELETE FROM carrito_items WHERE id = ?', 
                [item_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Item no encontrado' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Producto eliminado del carrito' 
            });
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al eliminar producto del carrito' 
            });
        }
    },

    // Vaciar carrito completo
    vaciar: async (req, res) => {
        try {
            const sesionId = req.session.id;
            const usuarioId = req.session.usuarioId || null;

            const [carrito] = await pool.query(
                'SELECT * FROM carritos WHERE sesion_id = ? OR usuario_id = ? ORDER BY fecha_actualizacion DESC LIMIT 1',
                [sesionId, usuarioId]
            );

            if (carrito.length === 0) {
                return res.json({ 
                    success: true, 
                    message: 'El carrito ya está vacío' 
                });
            }

            await pool.query(
                'DELETE FROM carrito_items WHERE carrito_id = ?',
                [carrito[0].id]
            );

            res.json({ 
                success: true, 
                message: 'Carrito vaciado exitosamente' 
            });
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al vaciar el carrito' 
            });
        }
    }
};

module.exports = carritoController;