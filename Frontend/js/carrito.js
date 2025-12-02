const API_URL = "http://localhost:3000/api";

// ======================================================
// CARGAR CARRITO AL ENTRAR
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

    document.getElementById("btn-vaciar-carrito")
        .addEventListener("click", vaciarCarrito);

    document.getElementById("btn-checkout")
        .addEventListener("click", checkout);
});

// ======================================================
// OBTENER CARRITO
// ======================================================
async function cargarCarrito() {
    const token = localStorage.getItem("token");

    if (!token) {
        mostrarMensajeLogin();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/carrito`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            mostrarMensajeError();
            return;
        }

        const carrito = await res.json();

        if (!carrito || carrito.length === 0) {
            mostrarCarritoVacio();
            return;
        }

        mostrarCarrito(carrito);

    } catch (error) {
        console.error("Error cargando carrito:", error);
        mostrarMensajeError();
    }
}

// ======================================================
// PINTAR EL CARRITO
// ======================================================
function mostrarCarrito(items) {
    const contenedor = document.querySelector(".cart-items");
    contenedor.innerHTML = "";

    let total = 0;

    items.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        contenedor.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-info">
                    <h3>${item.nombre}</h3>
                    <p>Cantidad: <strong>${item.cantidad}</strong></p>
                    <p>Precio unidad: $${item.precio}</p>
                    <p>Subtotal: <strong>$${subtotal}</strong></p>
                </div>
            </div>
        `;
    });

    document.getElementById("carrito-total").innerText = `$${total}`;
}

// ======================================================
// MENSAJES AUXILIARES
// ======================================================
function mostrarCarritoVacio() {
    document.querySelector(".cart-layout").innerHTML = `
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde el catálogo.</p>
    `;
}

function mostrarMensajeLogin() {
    document.querySelector(".cart-layout").innerHTML = `
        <h2>Debes iniciar sesión</h2>
        <a href="login.html" class="btn btn-primary">Iniciar Sesión</a>
    `;
}

function mostrarMensajeError() {
    document.querySelector(".cart-layout").innerHTML = `
        <h2>Error al cargar el carrito</h2>
        <p>Intenta nuevamente.</p>
    `;
}

// ======================================================
// VACIAR CARRITO
// ======================================================
async function vaciarCarrito() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        await fetch(`${API_URL}/carrito`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        mostrarCarritoVacio();
    } catch (error) {
        console.error(error);
        mostrarMensajeError();
    }
}

// ======================================================
// CHECKOUT
// ======================================================
function checkout() {
    const token = localStorage.getItem("token");

    if (!token) {
        mostrarMensajeLogin();
        return;
    }

    alert("Compra realizada con éxito!");
}
