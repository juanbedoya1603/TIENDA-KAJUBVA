// server.js - Archivo principal del servidor KAJUBVA
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'kajubva-secret-key-2025',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// ==================== RUTAS HTML ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/productos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});

app.get('/kits.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'kits.html'));
});

app.get('/semillas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'semillas.html'));
});

app.get('/sobre-nosotros.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sobre-nosotros.html'));
});

app.get('/contacto.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contacto.html'));
});

app.get('/carrito.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'carrito.html'));
});

app.get('/producto-detalle.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'producto-detalle.html'));
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
app.use('/api', usuariosRoutes); // Login, registro, logout
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