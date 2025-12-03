document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    configurarEventos();
    await CarritoAPI.actualizarContador();
});

async function cargarProductos() {
    const grid = document.querySelector('.products-grid');
    
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const filtros = {};
        
        if (urlParams.get('tipo')) filtros.tipo = urlParams.get('tipo');
        if (urlParams.get('categoria')) filtros.categoria = urlParams.get('categoria');
        
        const resultado = await ProductosAPI.obtenerTodos(filtros);
        
        if (!resultado.success) {
            throw new Error(resultado.message);
        }
        
        const productos = resultado.data;
        
        if (productos.length === 0) {
            grid.innerHTML = '<p class="text-center">No hay productos disponibles.</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        productos.forEach(producto => {
            const card = crearTarjetaProducto(producto);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        grid.innerHTML = '<p class="error">Error al cargar productos.</p>';
        mostrarNotificacion('Error al cargar productos', 'error');
    }
}

function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
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
            <div class="product-specs-mini">
                <span>📦 ${producto.tipo}</span>
                ${producto.stock > 0 
                    ? `<span class="stock-disponible">✓ Stock: ${producto.stock}</span>` 
                    : '<span class="sin-stock">Sin stock</span>'
                }
            </div>
            <div class="product-footer">
                <span class="product-price">${formatearPrecio(producto.precio)}</span>
                <div class="product-actions">
                    <a href="producto-detalle.html?id=${producto.id}" class="btn btn-small btn-secondary">Ver Detalles</a>
                    ${producto.stock > 0 
                        ? `<button class="btn btn-small btn-agregar" data-id="${producto.id}">
                               Agregar
                           </button>` 
                        : '<button class="btn btn-small" disabled>Sin Stock</button>'
                    }
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function configurarEventos() {
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const productoId = e.target.dataset.id;
            await agregarAlCarrito(productoId, e.target);
        }
    });
}

async function agregarAlCarrito(productoId, boton) {
    try {
        const resultado = await CarritoAPI.agregar(productoId, 1);
        
        if (resultado.success) {
            mostrarNotificacion('¡Producto agregado al carrito!', 'success');
            await CarritoAPI.actualizarContador();
            
            const textoOriginal = boton.textContent;
            boton.textContent = '✓ Agregado';
            boton.disabled = true;
            setTimeout(() => {
                boton.textContent = textoOriginal;
                boton.disabled = false;
            }, 2000);
        } else {
            mostrarNotificacion(resultado.message || 'Error', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al agregar', 'error');
    }
}