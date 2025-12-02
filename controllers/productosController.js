// controllers/productos.controller.js - Lógica de productos
const pool = require('../config/database');

const productosController = {
    // Obtener todos los productos con filtros
    obtenerTodos: async (req, res) => {
        try {
            const { tipo, categoria, destacado, limite } = req.query;
            let query = 'SELECT * FROM vista_productos WHERE 1=1';
            const params = [];

            // Filtro por tipo (kit, semilla, producto)
            if (tipo) {
                query += ' AND tipo = ?';
                params.push(tipo);
            }

            // Filtro por categoría (slug)
            if (categoria) {
                query += ' AND categoria_slug = ?';
                params.push(categoria);
            }

            // Filtro por destacados
            if (destacado === 'true') {
                query += ' AND es_destacado = 1';
            }

            // Ordenar por ID descendente (más recientes primero)
            query += ' ORDER BY id DESC';

            // Limitar resultados
            if (limite) {
                query += ' LIMIT ?';
                params.push(parseInt(limite));
            }

            const [productos] = await pool.query(query, params);
            
            res.json({ 
                success: true, 
                data: productos,
                cantidad: productos.length 
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener productos' 
            });
        }
    },

    // Obtener producto por ID
    obtenerPorId: async (req, res) => {
        try {
            const [producto] = await pool.query(
                'SELECT * FROM vista_productos WHERE id = ?',
                [req.params.id]
            );
            
            if (producto.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Producto no encontrado' 
                });
            }
            
            res.json({ 
                success: true, 
                data: producto[0] 
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener producto' 
            });
        }
    },

    // Buscar productos por nombre
    buscar: async (req, res) => {
        try {
            const { q } = req.query; // query string: ?q=tomate
            
            if (!q || q.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Debe proporcionar un término de búsqueda' 
                });
            }

            const [productos] = await pool.query(
                `SELECT * FROM vista_productos 
                 WHERE nombre LIKE ? OR descripcion LIKE ?
                 ORDER BY es_destacado DESC, id DESC`,
                [`%${q}%`, `%${q}%`]
            );

            res.json({ 
                success: true, 
                data: productos,
                cantidad: productos.length,
                termino: q
            });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al buscar productos' 
            });
        }
    }
};

module.exports = productosController;