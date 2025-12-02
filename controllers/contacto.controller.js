// controllers/contacto.controller.js - Lógica de mensajes de contacto
const pool = require('../config/database');

const contactoController = {
    // Enviar mensaje de contacto
    enviar: async (req, res) => {
        try {
            const { nombre, email, asunto, mensaje } = req.body;

            // Validar datos requeridos
            if (!nombre || !email || !mensaje) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Nombre, email y mensaje son requeridos' 
                });
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Formato de email inválido' 
                });
            }

            // Validar longitud del mensaje
            if (mensaje.length < 10) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El mensaje debe tener al menos 10 caracteres' 
                });
            }

            // Insertar mensaje
            await pool.query(
                'INSERT INTO mensajes_contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)',
                [nombre, email, asunto || 'Sin asunto', mensaje]
            );

            res.json({ 
                success: true, 
                message: 'Mensaje enviado exitosamente. Te responderemos pronto.' 
            });
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al enviar mensaje de contacto' 
            });
        }
    },

    // Obtener todos los mensajes (solo para admin - opcional)
    obtenerTodos: async (req, res) => {
        try {
            // Verificar si el usuario es admin (puedes agregar esta lógica)
            if (!req.session.esAdmin) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permisos para acceder a esta información' 
                });
            }

            const { leido } = req.query;
            let query = 'SELECT * FROM mensajes_contacto WHERE 1=1';
            const params = [];

            // Filtrar por leído/no leído
            if (leido !== undefined) {
                query += ' AND leido = ?';
                params.push(leido === 'true' ? 1 : 0);
            }

            query += ' ORDER BY fecha_envio DESC';

            const [mensajes] = await pool.query(query, params);

            res.json({ 
                success: true, 
                data: mensajes,
                cantidad: mensajes.length
            });
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener mensajes' 
            });
        }
    },

    // Marcar mensaje como leído (solo para admin - opcional)
    marcarLeido: async (req, res) => {
        try {
            // Verificar si el usuario es admin
            if (!req.session.esAdmin) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permisos para realizar esta acción' 
                });
            }

            const { id } = req.params;

            await pool.query(
                'UPDATE mensajes_contacto SET leido = 1 WHERE id = ?',
                [id]
            );

            res.json({ 
                success: true, 
                message: 'Mensaje marcado como leído' 
            });
        } catch (error) {
            console.error('Error al marcar mensaje como leído:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar mensaje' 
            });
        }
    }
};

module.exports = contactoController;