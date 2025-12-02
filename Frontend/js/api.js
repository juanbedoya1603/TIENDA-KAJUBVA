// api.js - Cliente para conectar el frontend con el backend
// Colocar este archivo en la carpeta public/js/

const API_BASE_URL = 'http://localhost:3000/api';

// Utilidad para hacer peticiones
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include' // Para enviar cookies de sesión
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la petición:', error);
        return { success: false, message: 'Error de conexión' };
    }
}

// ==================== PRODUCTOS ====================
const ProductosAPI = {
    // Obtener todos los productos
    obtenerTodos: async (filtros = {}) => {
        const params = new URLSearchParams(filtros);
        return await fetchAPI(`/productos?${params}`);
    },

    // Obtener producto por ID
    obtenerPorId: async (id) => {
        return await fetchAPI(`/productos/${id}`);
    },

    // Obtener productos por tipo (kit, semilla, producto)
    obtenerPorTipo: async (tipo) => {
        return await fetchAPI(`/productos?tipo=${tipo}`);
    },

    // Obtener productos destacados
    obtenerDestacados: async () => {
        return await fetchAPI('/productos?destacado=true');
    }
};

// ==================== CARRITO ====================
const CarritoAPI = {
    // Obtener carrito actual
    obtener: async () => {
        return await fetchAPI('/carrito');
    },

    // Agregar producto al carrito
    agregar: async (productoId, cantidad = 1) => {
        return await fetchAPI('/carrito/agregar', {
            method: 'POST',
            body: JSON.stringify({ producto_id: productoId, cantidad })
        });
    },

    // Actualizar cantidad de un item
    actualizar: async (itemId, cantidad) => {
        return await fetchAPI(`/carrito/actualizar/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ cantidad })
        });
    },

    // Eliminar item del carrito
    eliminar: async (itemId) => {
        return await fetchAPI(`/carrito/eliminar/${itemId}`, {
            method: 'DELETE'
        });
    },

    // Actualizar contador del carrito en el header
    actualizarContador: async () => {
        const resultado = await CarritoAPI.obtener();
        if (resultado.success) {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const totalItems = resultado.data.items.reduce((sum, item) => sum + item.cantidad, 0);
                cartCount.textContent = totalItems;
            }
        }
    }
};

// ==================== USUARIOS ====================
const UsuariosAPI = {
    // Registrar nuevo usuario
    registrar: async (datos) => {
        return await fetchAPI('/registro', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    },

    // Iniciar sesión
    login: async (email, password) => {
        return await fetchAPI('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    // Cerrar sesión
    logout: async () => {
        return await fetchAPI('/logout', {
            method: 'POST'
        });
    },

    // Obtener usuario actual
    obtenerActual: async () => {
        return await fetchAPI('/usuario');
    }
};

// ==================== PEDIDOS ====================
const PedidosAPI = {
    // Crear nuevo pedido
    crear: async (datos) => {
        return await fetchAPI('/pedidos', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    },

    // Obtener pedidos del usuario
    obtenerTodos: async () => {
        return await fetchAPI('/pedidos');
    },

    // Obtener detalle de un pedido
    obtenerPorId: async (id) => {
        return await fetchAPI(`/pedidos/${id}`);
    }
};

// ==================== CONTACTO ====================
const ContactoAPI = {
    // Enviar mensaje de contacto
    enviar: async (datos) => {
        return await fetchAPI('/contacto', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }
};

// ==================== CATEGORÍAS ====================
const CategoriasAPI = {
    // Obtener todas las categorías
    obtenerTodas: async () => {
        return await fetchAPI('/categorias');
    }
};

// ==================== UTILIDADES ====================
// Formatear precio en pesos colombianos
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(precio);
}

// Mostrar notificación (toast)
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notif = document.createElement('div');
    notif.className = `notificacion notificacion-${tipo}`;
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== INICIALIZACIÓN ====================
// Actualizar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    CarritoAPI.actualizarContador();
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProductosAPI,
        CarritoAPI,
        UsuariosAPI,
        PedidosAPI,
        ContactoAPI,
        CategoriasAPI,
        formatearPrecio,
        mostrarNotificacion
    };
}