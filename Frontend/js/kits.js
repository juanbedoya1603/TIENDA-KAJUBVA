// kits.js - Lógica para la página de kits.html
// Colocar este archivo en public/js/ y vincularlo en kits.html antes del </body>

// Cargar productos cuando la página esté lista
document.addEventListener('DOMContentLoaded', async () => {
    await cargarKits();
    configurarEventos();
});

// Función para cargar los kits desde el backend
async function cargarKits() {
    const grid = document.querySelector('.products-grid');
    
    // Mostrar loading
    grid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    try {
        // Obtener kits del backend
        const resultado = await ProductosAPI.obtenerPorTipo('kit');
        
        if (!resultado.success) {
            throw new Error(resultado.message);
        }
        
        const kits = resultado.data;
        
        if (kits.length === 0) {
            grid.innerHTML = '<p>No hay kits disponibles en este momento.</p>';
            return;
        }
        
        // Limpiar grid
        grid.innerHTML = '';
        
        // Renderizar cada kit
        kits.forEach(kit => {
            const card = crearTarjetaKit(kit);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error al cargar kits:', error);
        grid.innerHTML = '<p class="error">Error al cargar los productos. Por favor, intenta nuevamente.</p>';
        mostrarNotificacion('Error al cargar productos', 'error');
    }
}

// Crear tarjeta de producto
function crearTarjetaKit(kit) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Parsear especificaciones si es JSON
    let especificaciones = {};
    try {
        especificaciones = typeof kit.especificaciones === 'string' 
            ? JSON.parse(kit.especificaciones) 
            : kit.especificaciones || {};
    } catch (e) {
        console.warn('Error al parsear especificaciones:', e);
    }
    
    // Determinar badge
    let badge = '';
    if (kit.es_destacado) {
        badge = '<div class="product-badge">Más Vendido</div>';
    } else if (kit.es_nuevo) {
        badge = '<div class="product-badge">Nuevo</div>';
    }
    
    card.innerHTML = `
        <div class="product-image">
            ${badge}
            ${kit.imagen_url 
                ? `<img src="${kit.imagen_url}" alt="${kit.nombre}">` 
                : `<div class="placeholder-image">${kit.nombre}</div>`
            }
        </div>
        <div class="product-info">
            <h3>${kit.nombre}</h3>
            <p class="product-description">${kit.descripcion || ''}</p>
            <div class="product-specs-mini">
                <span>🌱 ${kit.variedades} variedades</span>
                <span>📦 Kit completo</span>
                ${kit.stock > 0 
                    ? `<span class="stock-disponible">✓ Stock: ${kit.stock}</span>` 
                    : '<span class="sin-stock">Sin stock</span>'
                }
            </div>
            <div class="product-footer">
                <span class="product-price">${formatearPrecio(kit.precio)}</span>
                <div class="product-actions">
                    <a href="producto-detalle.html?id=${kit.id}" class="btn btn-small btn-secondary">Ver Detalles</a>
                    ${kit.stock > 0 
                        ? `<button class="btn btn-small btn-agregar" data-id="${kit.id}">
                               Agregar al Carrito
                           </button>` 
                        : '<button class="btn btn-small" disabled>Sin Stock</button>'
                    }
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Configurar eventos de la página
function configurarEventos() {
    // Delegar eventos para botones "Agregar al Carrito"
    document.querySelector('.products-grid').addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const productoId = e.target.dataset.id;
            await agregarAlCarrito(productoId);
        }
    });
}

// Agregar producto al carrito
async function agregarAlCarrito(productoId) {
    try {
        const resultado = await CarritoAPI.agregar(productoId, 1);
        
        if (resultado.success) {
            mostrarNotificacion('¡Producto agregado al carrito!', 'success');
            await CarritoAPI.actualizarContador();
            
            // Animación opcional del botón
            const btn = document.querySelector(`[data-id="${productoId}"]`);
            if (btn) {
                btn.textContent = '✓ Agregado';
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = 'Agregar al Carrito';
                    btn.disabled = false;
                }, 2000);
            }
        } else {
            mostrarNotificacion(resultado.message || 'Error al agregar al carrito', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al agregar al carrito', 'error');
    }
}

// Estilos adicionales para los estados
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 40px;
        font-size: 18px;
        color: #666;
    }
    
    .error {
        text-align: center;
        padding: 40px;
        color: #f44336;
    }
    
    .product-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    
    .btn-agregar {
        background: #4CAF50;
        transition: all 0.3s ease;
    }
    
    .btn-agregar:hover {
        background: #45a049;
        transform: translateY(-2px);
    }
    
    .btn-agregar:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
    }
    
    .stock-disponible {
        color: #4CAF50;
        font-weight: 500;
    }
    
    .sin-stock {
        color: #f44336;
        font-weight: 500;
    }
`;
document.head.appendChild(style);