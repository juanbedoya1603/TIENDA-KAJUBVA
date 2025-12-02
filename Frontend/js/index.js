// public/js/index.js - Script para la página principal (index.html)

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar productos destacados
    await cargarProductosDestacados();
    
    // Actualizar contador del carrito
    await CarritoAPI.actualizarContador();
    
    // Verificar si hay usuario logueado (opcional)
    await verificarSesion();
});

// Cargar productos destacados en la sección "Productos Destacados"
async function cargarProductosDestacados() {
    const grid = document.querySelector('.featured-products .products-grid');
    
    if (!grid) return;
    
    try {
        // Obtener productos destacados desde el backend
        const resultado = await ProductosAPI.obtenerDestacados();
        
        if (!resultado.success) {
            console.error('Error al cargar productos destacados');
            return;
        }
        
        const productos = resultado.data.slice(0, 3); // Solo mostrar 3
        
        // Limpiar grid y renderizar productos
        grid.innerHTML = '';
        
        productos.forEach(producto => {
            const card = crearTarjetaProducto(producto);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error al cargar productos destacados:', error);
    }
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Determinar badge
    let badge = '';
    if (producto.es_destacado) {
        badge = '<div class="product-badge">Más Vendido</div>';
    } else if (producto.es_nuevo) {
        badge = '<div class="product-badge">Nuevo</div>';
    }
    
    card.innerHTML = `
        <div class="product-image">
            ${badge}
            ${producto.imagen_url 
                ? `<img src="${producto.imagen_url}" alt="${producto.nombre}">` 
                : `<div class="placeholder-image">${producto.nombre}</div>`
            }
        </div>
        <div class="product-info">
            <h3>${producto.nombre}</h3>
            <p class="product-description">${producto.descripcion || ''}</p>
            <div class="product-footer">
                <span class="product-price">${formatearPrecio(producto.precio)}</span>
                <a href="producto-detalle.html?id=${producto.id}" class="btn btn-small">Ver Detalles</a>
            </div>
        </div>
    `;
    
    return card;
}

// Verificar si hay sesión activa (opcional)
async function verificarSesion() {
    const resultado = await UsuariosAPI.obtenerActual();
    
    if (resultado.success) {
        // Usuario logueado - podrías mostrar su nombre en algún lugar
        console.log('Usuario logueado:', resultado.data.nombre);
        // Aquí podrías agregar el nombre del usuario en el header si quieres
    }
}