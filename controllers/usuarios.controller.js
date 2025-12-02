// controllers/usuarios.controller.js - Lógica de usuarios y autenticación
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const usuariosController = {
    // Registrar nuevo usuario
    registrar: async (req, res) => {
        try {
            const { nombre, email, password, telefono, direccion, ciudad } = req.body;

            // Validar datos requeridos
            if (!nombre || !email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Nombre, email y contraseña son requeridos' 
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

            // Validar longitud de contraseña
            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La contraseña debe tener al menos 6 caracteres' 
                });
            }

            // Verificar si el email ya existe
            const [existente] = await pool.query(
                'SELECT id FROM usuarios WHERE email = ?', 
                [email]
            );
            
            if (existente.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El email ya está registrado' 
                });
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar usuario
            const [result] = await pool.query(
                'INSERT INTO usuarios (nombre, email, password, telefono, direccion, ciudad) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, email, hashedPassword, telefono || null, direccion || null, ciudad || null]
            );

            // Iniciar sesión automáticamente
            req.session.usuarioId = result.insertId;
            req.session.nombre = nombre;
            req.session.email = email;

            res.json({ 
                success: true, 
                message: 'Usuario registrado exitosamente', 
                data: { 
                    id: result.insertId, 
                    nombre,
                    email
                } 
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al registrar usuario' 
            });
        }
    },

    // Iniciar sesión
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validar datos requeridos
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email y contraseña son requeridos' 
                });
            }

            // Buscar usuario
            const [usuarios] = await pool.query(
                'SELECT * FROM usuarios WHERE email = ? AND activo = 1', 
                [email]
            );

            if (usuarios.length === 0) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Email o contraseña incorrectos' 
                });
            }

            const usuario = usuarios[0];

            // Verificar contraseña
            const passwordValido = await bcrypt.compare(password, usuario.password);

            if (!passwordValido) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Email o contraseña incorrectos' 
                });
            }

            // Crear sesión
            req.session.usuarioId = usuario.id;
            req.session.nombre = usuario.nombre;
            req.session.email = usuario.email;

            res.json({ 
                success: true, 
                message: 'Inicio de sesión exitoso',
                data: { 
                    id: usuario.id, 
                    nombre: usuario.nombre, 
                    email: usuario.email,
                    telefono: usuario.telefono,
                    direccion: usuario.direccion,
                    ciudad: usuario.ciudad
                }
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al iniciar sesión' 
            });
        }
    },

    // Cerrar sesión
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al cerrar sesión' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Sesión cerrada exitosamente' 
            });
        });
    },

    // Obtener usuario actual
    obtenerActual: async (req, res) => {
        try {
            if (!req.session.usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'No hay sesión activa' 
                });
            }

            const [usuarios] = await pool.query(
                'SELECT id, nombre, email, telefono, direccion, ciudad, fecha_registro FROM usuarios WHERE id = ?',
                [req.session.usuarioId]
            );

            if (usuarios.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuario no encontrado' 
                });
            }

            res.json({ 
                success: true, 
                data: usuarios[0]
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener información del usuario' 
            });
        }
    },

    // Actualizar perfil de usuario
    actualizarPerfil: async (req, res) => {
        try {
            const usuarioId = req.session.usuarioId;

            if (!usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Debe iniciar sesión' 
                });
            }

            const { nombre, telefono, direccion, ciudad } = req.body;

            // Validar que al menos un campo sea proporcionado
            if (!nombre && !telefono && !direccion && !ciudad) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Debe proporcionar al menos un campo para actualizar' 
                });
            }

            // Construir query dinámicamente
            let query = 'UPDATE usuarios SET ';
            const params = [];
            const updates = [];

            if (nombre) {
                updates.push('nombre = ?');
                params.push(nombre);
            }
            if (telefono !== undefined) {
                updates.push('telefono = ?');
                params.push(telefono);
            }
            if (direccion !== undefined) {
                updates.push('direccion = ?');
                params.push(direccion);
            }
            if (ciudad !== undefined) {
                updates.push('ciudad = ?');
                params.push(ciudad);
            }

            query += updates.join(', ') + ' WHERE id = ?';
            params.push(usuarioId);

            await pool.query(query, params);

            // Actualizar sesión si se cambió el nombre
            if (nombre) {
                req.session.nombre = nombre;
            }

            res.json({ 
                success: true, 
                message: 'Perfil actualizado exitosamente' 
            });
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar perfil' 
            });
        }
    },

    // Cambiar contraseña
    cambiarPassword: async (req, res) => {
        try {
            const usuarioId = req.session.usuarioId;

            if (!usuarioId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Debe iniciar sesión' 
                });
            }

            const { password_actual, password_nuevo } = req.body;

            // Validar datos
            if (!password_actual || !password_nuevo) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Debe proporcionar la contraseña actual y la nueva' 
                });
            }

            if (password_nuevo.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La nueva contraseña debe tener al menos 6 caracteres' 
                });
            }

            // Obtener usuario
            const [usuarios] = await pool.query(
                'SELECT password FROM usuarios WHERE id = ?',
                [usuarioId]
            );

            if (usuarios.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuario no encontrado' 
                });
            }

            // Verificar contraseña actual
            const passwordValido = await bcrypt.compare(password_actual, usuarios[0].password);

            if (!passwordValido) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'La contraseña actual es incorrecta' 
                });
            }

            // Encriptar nueva contraseña
            const hashedPassword = await bcrypt.hash(password_nuevo, 10);

            // Actualizar contraseña
            await pool.query(
                'UPDATE usuarios SET password = ? WHERE id = ?',
                [hashedPassword, usuarioId]
            );

            res.json({ 
                success: true, 
                message: 'Contraseña actualizada exitosamente' 
            });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al cambiar contraseña' 
            });
        }
    }
};

module.exports = usuariosController;