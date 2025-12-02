// =============================
// PRODUCTO DETALLE
// =============================

// Obtener ID desde URL
function obtenerIdProducto() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const productId = obtenerIdProducto();
let productoActual = null;

// =============================
// CARGAR DETALLE
// =============================
async function cargarDetalleProducto() {
    try {
        const response = await fetch(`${API_URL}/productos/${productId}`);
        if (!response.ok) throw new Error("No se pudo cargar el producto");

        const data = await response.json();
        productoActual = data.producto;

        pintarProducto(productoActual);
        cargarRelacionados(productoActual.categoria);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("product-name").innerText = "Producto no encontrado.";
    }
}

// =============================
// MOSTRAR DATOS
// =============================
function pintarProducto(p) {
    document.getElementById("product-name").innerText = p.nombre;
    document.getElementById("breadcrumb-name").innerText = p.nombre;
    document.getElementById("product-price").innerText = `$${p.precio.toLocaleString()}`;
    document.getElementById("product-description").innerText = p.descripcion_corta ?? "Sin descripción.";
    document.getElementById("descripcion-completa").innerText = p.descripcion_larga ?? "Sin descripción.";
    document.getElementById("main-image").innerHTML = `<img src="${p.imagen_principal}" class="img-main">`;

    // thumbnails
    const thumbs = document.getElementById("thumbnails");
    thumbs.innerHTML = "";
    p.imagenes.forEach(img => {
        const mini = document.createElement("img");
        mini.src = img;
        mini.classList.add("thumb");
        mini.onclick = () => cambiarImagen(img);
        thumbs.appendChild(mini);
    });

    // especificaciones
    if (p.especificaciones?.length > 0) {
        const specs = document.getElementById("specs-list");
        specs.innerHTML = p.especificaciones.map(s => `<li>${s}</li>`).join("");
        document.getElementById("product-specs").style.display = "block";
    }

    // características
    if (p.caracteristicas?.length > 0) {
        const feats = document.getElementById("features-list");
        feats.innerHTML = p.caracteristicas.map(c => `<li>${c}</li>`).join("");
        document.getElementById("product-features").style.display = "block";
    }

    mostrarStock(p.stock);
}

function cambiarImagen(img) {
    document.getElementById("main-image").innerHTML = `<img src="${img}" class="img-main">`;
}

function mostrarStock(stock) {
    const t = document.getElementById("stock-text");
    if (stock > 10) {
        t.innerText = "Disponible";
        t.style.color = "green";
    } else if (stock > 0) {
        t.innerText = `Quedan ${stock} unidades`;
        t.style.color = "orange";
    } else {
        t.innerText = "Agotado";
        t.style.color = "red";
    }
}

// =============================
// RELACIONADOS
// =============================
async function cargarRelacionados(categoria) {
    try {
        const response = await fetch(`${API_URL}/productos/categoria/${categoria}`);
        const data = await response.json();

        const cont = document.getElementById("related-products");
        cont.innerHTML = data.productos.slice(0, 4).map(pr => `
            <div class="product-card">
                <img src="${pr.imagen_principal}" class="product-img">
                <h3>${pr.nombre}</h3>
                <p>$${pr.precio.toLocaleString()}</p>
                <a href="producto-detalle.html?id=${pr.id}" class="btn btn-secondary">Ver</a>
            </div>
        `).join("");

    } catch (err) {
        console.error("Relacionados error:", err);
    }
}

// =============================
// AGREGAR AL CARRITO
// =============================
async function agregarAlCarrito() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Debes iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    const cantidad = parseInt(document.getElementById("quantity").value);

    try {
        const res = await fetch(`${API_URL}/carrito/agregar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                productId: productoActual.id,
                cantidad
            })
        });

        const data = await res.json();
        console.log("Carrito actualizado:", data);

        actualizarContadorCarrito();
        alert("Producto agregado al carrito");

    } catch (error) {
        console.error("Error al agregar al carrito:", error);
    }
}

// =============================
// INICIALIZAR
// =============================
document.addEventListener("DOMContentLoaded", () => {
    cargarDetalleProducto();
    actualizarContadorCarrito();
});
