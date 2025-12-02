// server.js - Archivo principal del servidor KAJUBVA
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
// 1. CORS (PRIMERO)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Sesiones (ANTES de archivos estáticos)
app.use(session({
    secret: process.env.SESSION_SECRET || 'kajubva-secret-key-2025',
    resave: false,
    saveUninitialized: false,  // ✅ CAMBIADO A FALSE
    cookie: { 
        secure: false,
        httpOnly: true,  // ✅ AGREGADO
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'  // ✅ AGREGADO
    }
}));

// 4. Archivos estáticos
app.use(express.static('Frontend'));  // ✅ Frontend es correcto

// ==================== RUTAS HTML ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));  // ✅ CAMBIADO
});

app.get('/productos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'productos.html'));  // ✅ CAMBIADO
});

app.get('/kits.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'kits.html'));  // ✅ CAMBIADO
});

app.get('/semillas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'semillas.html'));  // ✅ CAMBIADO
});

app.get('/sobre-nosotros.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'sobre-nosotros.html'));  // ✅ CAMBIADO
});

app.get('/contacto.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'contacto.html'));  // ✅ CAMBIADO
});

app.get('/carrito.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'carrito.html'));  // ✅ CAMBIADO
});

app.get('/producto-detalle.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'producto-detalle.html'));  // ✅ CAMBIADO
});

// ==================== RUTAS DEL API ====================
const productosRoutes = require('./routes/productos.routes');
const carritoRoutes = require('./routes/carrito.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const contactoRoutes = require('./routes/contacto.routes');
const categoriasRoutes = require('./routes/categorias.routes');

// Usar rutas
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/categorias', categoriasRoutes);

// ==================== MANEJO DE ERRORES 404 ====================
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
    console.log(`🌱 Servidor KAJUBVA corriendo en http://localhost:${PORT}`);
    console.log(`📦 API REST disponible en http://localhost:${PORT}/api`);
    console.log(`📄 Frontend disponible en http://localhost:${PORT}`);
});