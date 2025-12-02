// controllers/categorias.controller.js - Lógica de categorías
const pool = require('../config/database');

const categoriasController = {
    // Obtener todas las categorías
    obtenerTodas: async (req, res) => {
        try {
            const [categorias] = await pool.query(
                'SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre ASC'
            );

            res.json({ 
                success: true, 
                data: categorias,
                cantidad: categorias.length
            });
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener categorías' 
            });
        }
    },

    // Obtener categoría por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const [categoria] = await pool.query(
                'SELECT * FROM categorias WHERE id = ? AND activo = 1',
                [id]
            );

            if (categoria.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Categoría no encontrada' 
                });
            }

            res.json({ 
                success: true, 
                data: categoria[0]
            });
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener categoría' 
            });
        }
    },

    // Obtener categoría por slug
    obtenerPorSlug: async (req, res) => {
        try {
            const { slug } = req.params;

            const [categoria] = await pool.query(
                'SELECT * FROM categorias WHERE slug = ? AND activo = 1',
                [slug]
            );

            if (categoria.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Categoría no encontrada' 
                });
            }

            // Obtener productos de esta categoría
            const [productos] = await pool.query(
                'SELECT * FROM vista_productos WHERE categoria_slug = ?',
                [slug]
            );

            res.json({ 
                success: true, 
                data: {
                    categoria: categoria[0],
                    productos,
                    cantidad_productos: productos.length
                }
            });
        } catch (error) {
            console.error('Error al obtener categoría por slug:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener categoría' 
            });
        }
    }
};

module.exports = categoriasController;