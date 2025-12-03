// js/carrito.js - Sistema de carrito con SESIONES
const API_URL = "http://localhost:3000/api";

// ======================================================
// CARGAR CARRITO AL ENTRAR
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    verificarSesionYCargarCarrito();

    document.getElementById("btn-vaciar-carrito")
        ?.addEventListener("click", vaciarCarrito);

    document.getElementById("btn-checkout")
        ?.addEventListener("click", checkout);
});

// ======================================================
// VERIFICAR SESIÓN Y CARGAR CARRITO
// ======================================================
async function verificarSesionYCargarCarrito() {
    try {
        console.log('🔍 Verificando sesión...');
        
        // Primero verificar si hay sesión activa
        const resUsuario = await fetch(`${API_URL}/usuario`, {
            credentials: 'include' // CRÍTICO: enviar cookies
        });

        console.log('📡 Respuesta de /usuario:', resUsuario.status);

        if (!resUsuario.ok) {
            console.log('❌ No hay sesión activa');
            mostrarMensajeLogin();
            return;
        }

        const usuario = await resUsuario.json();
        console.log('✅ Usuario autenticado:', usuario.data.nombre);

        // Ahora cargar el carrito
        await cargarCarrito();

    } catch (error) {
        console.error('❌ Error verificando sesión:', error);
        mostrarMensajeLogin();
    }
}

// ======================================================
// OBTENER CARRITO
// ======================================================
async function cargarCarrito() {
    try {
        console.log('🛒 Cargando carrito...');
        
        const res = await fetch(`${API_URL}/carrito`, {
            credentials: 'include' // CRÍTICO: enviar cookies
        });

        console.log('📡 Respuesta de /carrito:', res.status);

        if (!res.ok) {
            if (res.status === 401) {
                mostrarMensajeLogin();
                return;
            }
            mostrarMensajeError();
            return;
        }

        const resultado = await res.json();
        console.log('📦 Carrito recibido:', resultado);

        if (!resultado.success) {
            mostrarMensajeError();
            return;
        }

        const carrito = resultado.data;

        if (!carrito.items || carrito.items.length === 0) {
            mostrarCarritoVacio();
            return;
        }

        mostrarCarrito(carrito);

    } catch (error) {
        console.error("❌ Error cargando carrito:", error);
        mostrarMensajeError();
    }
}

// ======================================================
// PINTAR EL CARRITO
// ======================================================
function mostrarCarrito(carrito) {
    const contenedor = document.getElementById("carrito-items");
    contenedor.innerHTML = "";

    carrito.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.imagen_url || '/images/default-product.jpg'}" alt="${item.nombre}">
            <div class="cart-info">
                <h3>${item.nombre}</h3>
                <p>${item.descripcion || ''}</p>
                <p>Precio unitario: <strong>$${parseFloat(item.precio_unitario).toLocaleString('es-CO')}</strong></p>
                <div class="cart-quantity">
                    <label>Cantidad:</label>
                    <input type="number" 
                           value="${item.cantidad}" 
                           min="1" 
                           max="${item.stock}"
                           onchange="actualizarCantidad(${item.id}, this.value)">
                    <span class="stock-info">(Stock: ${item.stock})</span>
                </div>
                <p class="cart-subtotal">Subtotal: <strong>$${parseFloat(item.subtotal).toLocaleString('es-CO')}</strong></p>
            </div>
            <button class="btn-eliminar" onclick="eliminarItem(${item.id})">
                🗑️ Eliminar
            </button>
        `;
        contenedor.appendChild(div);
    });

    // Actualizar totales
    document.getElementById("carrito-subtotal").textContent = 
        `$${parseFloat(carrito.total).toLocaleString('es-CO')}`;
    document.getElementById("carrito-total").textContent = 
        `$${parseFloat(carrito.total).toLocaleString('es-CO')}`;
}

// ======================================================
// ACTUALIZAR CANTIDAD
// ======================================================
async function actualizarCantidad(itemId, nuevaCantidad) {
    try {
        console.log(`🔄 Actualizando item ${itemId} a cantidad ${nuevaCantidad}`);
        
        const res = await fetch(`${API_URL}/carrito/actualizar/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ cantidad: parseInt(nuevaCantidad) })
        });

        const resultado = await res.json();

        if (resultado.success) {
            console.log('✅ Cantidad actualizada');
            mostrarNotificacion('Cantidad actualizada', 'success');
            await cargarCarrito(); // Recargar carrito
        } else {
            console.log('❌ Error:', resultado.message);
            mostrarNotificacion(resultado.message, 'error');
            await cargarCarrito(); // Recargar para resetear valores
        }
    } catch (error) {
        console.error('❌ Error actualizando cantidad:', error);
        mostrarNotificacion('Error al actualizar cantidad', 'error');
    }
}

// ======================================================
// ELIMINAR ITEM
// ======================================================
async function eliminarItem(itemId) {
    if (!confirm('¿Eliminar este producto del carrito?')) {
        return;
    }

    try {
        console.log(`🗑️ Eliminando item ${itemId}`);
        
        const res = await fetch(`${API_URL}/carrito/eliminar/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const resultado = await res.json();

        if (resultado.success) {
            console.log('✅ Item eliminado');
            mostrarNotificacion('Producto eliminado del carrito', 'success');
            await cargarCarrito();
        } else {
            mostrarNotificacion(resultado.message, 'error');
        }
    } catch (error) {
        console.error('❌ Error eliminando item:', error);
        mostrarNotificacion('Error al eliminar producto', 'error');
    }
}

// ======================================================
// VACIAR CARRITO
// ======================================================
async function vaciarCarrito() {
    if (!confirm('¿Vaciar todo el carrito?')) {
        return;
    }

    try {
        console.log('🗑️ Vaciando carrito...');
        
        const res = await fetch(`${API_URL}/carrito/vaciar`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const resultado = await res.json();

        if (resultado.success) {
            console.log('✅ Carrito vaciado');
            mostrarNotificacion('Carrito vaciado', 'success');
            mostrarCarritoVacio();
        } else {
            mostrarNotificacion(resultado.message, 'error');
        }
    } catch (error) {
        console.error('❌ Error vaciando carrito:', error);
        mostrarNotificacion('Error al vaciar carrito', 'error');
    }
}

// ======================================================
// CHECKOUT
// ======================================================
async function checkout() {
    try {
        // Verificar que hay sesión
        const resUsuario = await fetch(`${API_URL}/usuario`, {
            credentials: 'include'
        });

        if (!resUsuario.ok) {
            mostrarMensajeLogin();
            return;
        }

        // Aquí iría la lógica de checkout real
        // Por ahora solo un alert
        alert("Función de checkout en desarrollo. Próximamente podrás completar tu compra.");
        
    } catch (error) {
        console.error('❌ Error en checkout:', error);
        mostrarNotificacion('Error al procesar el checkout', 'error');
    }
}

// ======================================================
// MENSAJES AUXILIARES
// ======================================================
function mostrarCarritoVacio() {
    const contenedor = document.querySelector(".cart-layout");
    contenedor.innerHTML = `
        <div class="mensaje-carrito">
            <h2>🛒 Tu carrito está vacío</h2>
            <p>Agrega productos desde nuestro catálogo</p>
            <a href="/productos.html" class="btn btn-primary">Ver Productos</a>
        </div>
    `;
}

function mostrarMensajeLogin() {
    const contenedor = document.querySelector(".cart-layout");
    contenedor.innerHTML = `
        <div class="mensaje-carrito">
            <h2>🔐 Debes iniciar sesión</h2>
            <p>Para ver tu carrito necesitas iniciar sesión o registrarte</p>
            <a href="/login.html" class="btn btn-primary">Iniciar Sesión</a>
        </div>
    `;
}

function mostrarMensajeError() {
    const contenedor = document.querySelector(".cart-layout");
    contenedor.innerHTML = `
        <div class="mensaje-carrito">
            <h2>❌ Error al cargar el carrito</h2>
            <p>Ocurrió un error al cargar tu carrito. Por favor intenta nuevamente.</p>
            <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
        </div>
    `;
}

// ======================================================
// UTILIDAD: MOSTRAR NOTIFICACIONES
// ======================================================
function mostrarNotificacion(mensaje, tipo = 'info') {
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