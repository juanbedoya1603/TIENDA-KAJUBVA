/* =====================================================
   KAJUBVA - JavaScript Examples
   Ejemplos opcionales de funcionalidad dinámica
   ===================================================== */

// ==========================================
// CARRITO DE COMPRAS
// ==========================================

// Estado del carrito (en memoria)
let carrito = [];

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    mostrarNotificacion('Producto agregado al carrito');
}

// Actualizar cantidad en el carrito
function actualizarCantidad(productoId, nuevaCantidad) {
    const item = carrito.find(item => item.id === productoId);
    
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            item.cantidad = nuevaCantidad;
            actualizarCarrito();
        }
    }
}

// Eliminar del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Actualizar UI del carrito
function actualizarCarrito() {
    // Actualizar contador
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
    
    // Actualizar resumen
    actualizarResumenCarrito();
    
    // Guardar en localStorage (opcional)
    localStorage.setItem('kajubva-carrito', JSON.stringify(carrito));
}

// Actualizar resumen del pedido
function actualizarResumenCarrito() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 80000 ? 0 : 8000;
    const descuento = 0; // Aplicar lógica de cupones aquí
    const total = subtotal + envio - descuento;
    
    // Actualizar elementos en el DOM
    const elements = {
        subtotal: document.querySelector('.summary-row span:last-child'),
        envio: document.querySelectorAll('.summary-row span:last-child')[1],
        total: document.querySelector('.summary-row.total span:last-child')
    };
    
    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toLocaleString()}`;
    if (elements.envio) elements.envio.textContent = `$${envio.toLocaleString()}`;
    if (elements.total) elements.total.textContent = `$${total.toLocaleString()}`;
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('kajubva-carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// ==========================================
// FILTROS Y BÚSQUEDA
// ==========================================

// Filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    const productos = document.querySelectorAll('.product-card');
    
    productos.forEach(producto => {
        const categoriaProducto = producto.dataset.categoria;
        
        if (categoria === 'todos' || categoriaProducto === categoria) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// Ordenar productos
function ordenarProductos(criterio) {
    const contenedor = document.querySelector('.products-grid');
    const productos = Array.from(document.querySelectorAll('.product-card'));
    
    productos.sort((a, b) => {
        const precioA = parseInt(a.dataset.precio);
        const precioB = parseInt(b.dataset.precio);
        
        switch(criterio) {
            case 'menor-precio':
                return precioA - precioB;
            case 'mayor-precio':
                return precioB - precioA;
            case 'destacados':
                return b.dataset.destacado - a.dataset.destacado;
            case 'nuevos':
                return b.dataset.nuevo - a.dataset.nuevo;
            default:
                return 0;
        }
    });
    
    // Re-agregar productos ordenados
    productos.forEach(producto => contenedor.appendChild(producto));
}

// Búsqueda en tiempo real
function buscarProductos(termino) {
    const productos = document.querySelectorAll('.product-card');
    const terminoLower = termino.toLowerCase();
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const descripcion = producto.querySelector('.product-description').textContent.toLowerCase();
        
        if (nombre.includes(terminoLower) || descripcion.includes(terminoLower)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// ==========================================
// TABS DE PRODUCTO
// ==========================================

function inicializarTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remover activo de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Activar seleccionado
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ==========================================
// VALIDACIÓN DE FORMULARIOS
// ==========================================

function validarFormularioContacto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    let errores = [];
    
    // Validar nombre
    if (nombre.length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errores.push('Email inválido');
    }
    
    // Validar mensaje
    if (mensaje.length < 10) {
        errores.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    if (errores.length > 0) {
        mostrarErrores(errores);
        return false;
    }
    
    // Si todo está bien, enviar formulario
    enviarFormulario({ nombre, email, mensaje });
    return true;
}

// ==========================================
// CUPONES DE DESCUENTO
// ==========================================

const cupones = {
    'BIENVENIDO': { tipo: 'porcentaje', valor: 10 },
    'JARDIN20': { tipo: 'porcentaje', valor: 20 },
    'ENVIOGRATIS': { tipo: 'envio-gratis', valor: 0 }
};

function aplicarCupon(codigo) {
    const cupon = cupones[codigo.toUpperCase()];
    
    if (!cupon) {
        mostrarNotificacion('Cupón inválido', 'error');
        return;
    }
    
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    let descuento = 0;
    let envioGratis = false;
    
    if (cupon.tipo === 'porcentaje') {
        descuento = subtotal * (cupon.valor / 100);
    } else if (cupon.tipo === 'envio-gratis') {
        envioGratis = true;
    }
    
    // Actualizar UI con el descuento
    actualizarResumenConDescuento(descuento, envioGratis);
    mostrarNotificacion(`Cupón aplicado: ${cupon.valor}% de descuento`, 'success');
}

// ==========================================
// NOTIFICACIONES
// ==========================================

function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos inline (o agregar a CSS)
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${tipo === 'success' ? 'var(--color-primary)' : 'var(--color-secondary)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ==========================================
// CONTROL DE CANTIDAD
// ==========================================

function inicializarControlesCantidad() {
    document.querySelectorAll('.quantity-controls').forEach(control => {
        const btnMenos = control.querySelector('.qty-btn:first-child');
        const btnMas = control.querySelector('.qty-btn:last-child');
        const input = control.querySelector('.qty-input');
        
        btnMenos.addEventListener('click', () => {
            const valor = parseInt(input.value);
            if (valor > 1) {
                input.value = valor - 1;
                input.dispatchEvent(new Event('change'));
            }
        });
        
        btnMas.addEventListener('click', () => {
            const valor = parseInt(input.value);
            input.value = valor + 1;
            input.dispatchEvent(new Event('change'));
        });
    });
}

// ==========================================
// API CALLS (Ejemplo con fetch)
// ==========================================

// Obtener productos
async function obtenerProductos() {
    try {
        const response = await fetch('http://localhost:3000/api/productos');
        const productos = await response.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        mostrarNotificacion('Error al cargar productos', 'error');
    }
}

// Crear pedido
async function crearPedido(datosCliente) {
    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cliente: datosCliente,
                productos: carrito,
                total: calcularTotal()
            })
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('Pedido creado exitosamente', 'success');
            carrito = [];
            actualizarCarrito();
            // Redirigir a página de confirmación
            window.location.href = 'confirmacion.html?pedido=' + resultado.id;
        }
    } catch (error) {
        console.error('Error al crear pedido:', error);
        mostrarNotificacion('Error al procesar pedido', 'error');
    }
}

// Enviar formulario de contacto
async function enviarFormulario(datos) {
    try {
        const response = await fetch('http://localhost:3000/api/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            mostrarNotificacion('Mensaje enviado exitosamente', 'success');
            document.querySelector('.contact-form').reset();
        }
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        mostrarNotificacion('Error al enviar mensaje', 'error');
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar carrito guardado
    cargarCarrito();
    
    // Inicializar tabs si existen
    if (document.querySelector('.tab-btn')) {
        inicializarTabs();
    }
    
    // Inicializar controles de cantidad
    inicializarControlesCantidad();
    
    // Agregar event listeners a filtros
    const selectCategoria = document.querySelector('select[name="categoria"]');
    if (selectCategoria) {
        selectCategoria.addEventListener('change', (e) => {
            filtrarPorCategoria(e.target.value);
        });
    }
    
    const selectOrden = document.querySelector('select[name="orden"]');
    if (selectOrden) {
        selectOrden.addEventListener('change', (e) => {
            ordenarProductos(e.target.value);
        });
    }
    
    // Formulario de contacto
    const formContacto = document.querySelector('.contact-form');
    if (formContacto) {
        formContacto.addEventListener('submit', validarFormularioContacto);
    }
    
    // Botón aplicar cupón
    const btnCupon = document.querySelector('.coupon-section .btn');
    if (btnCupon) {
        btnCupon.addEventListener('click', () => {
            const codigo = document.querySelector('.coupon-input').value;
            aplicarCupon(codigo);
        });
    }
    
    console.log('KAJUBVA inicializado correctamente');
});

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function calcularTotal() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 80000 ? 0 : 8000;
    return subtotal + envio;
}

function renderizarProductos(productos) {
    const contenedor = document.querySelector('.products-grid');
    contenedor.innerHTML = '';
    
    productos.forEach(producto => {
        const card = crearCardProducto(producto);
        contenedor.appendChild(card);
    });
}

function crearCardProducto(producto) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.categoria = producto.categoria;
    div.dataset.precio = producto.precio;
    
    div.innerHTML = `
        <div class="product-image">
            ${producto.destacado ? '<div class="product-badge">Destacado</div>' : ''}
            <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <div class="product-info">
            <h3>${producto.nombre}</h3>
            <p class="product-description">${producto.descripcion}</p>
            <div class="product-footer">
                <span class="product-price">$${producto.precio.toLocaleString()}</span>
                <button class="btn btn-small" onclick="agregarAlCarrito(${JSON.stringify(producto)})">
                    Agregar
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Agregar animaciones CSS necesarias
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);