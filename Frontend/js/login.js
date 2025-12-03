// login.js - Lógica del formulario de login
// Colocar en: Frontend/js/login.js

const loginForm = document.getElementById('loginForm');
const alertMessage = document.getElementById('alertMessage');

// ==================== MOSTRAR ALERTAS ====================
function mostrarAlerta(mensaje, tipo = 'success') {
    if (!alertMessage) return;
    
    alertMessage.textContent = mensaje;
    alertMessage.style.display = 'block';
    
    if (tipo === 'success') {
        alertMessage.style.backgroundColor = 'rgb(34, 195, 88)';
        alertMessage.style.color = 'white';
    } else if (tipo === 'error') {
        alertMessage.style.backgroundColor = '#e74c3c';
        alertMessage.style.color = 'white';
    } else if (tipo === 'info') {
        alertMessage.style.backgroundColor = 'rgb(131, 191, 252)';
        alertMessage.style.color = 'white';
    }

    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 5000);
}

// ==================== MANEJAR ENVÍO DEL FORMULARIO ====================
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            mostrarAlerta('Por favor completa todos los campos', 'error');
            return;
        }

        const btnSubmit = loginForm.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Iniciando sesión...';

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // IMPORTANTE: para enviar/recibir cookies de sesión
                body: JSON.stringify({ email, password })
            });

            const resultado = await response.json();

            if (resultado.success) {
                mostrarAlerta('✅ ¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                // Actualizar contador del carrito
                if (typeof CarritoAPI !== 'undefined') {
                    await CarritoAPI.actualizarContador();
                }

                // Obtener URL de redirección (si viene de otra página)
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'productos.html';

                setTimeout(() => {
                    window.location.href = redirect;
                }, 1500);

            } else {
                mostrarAlerta(resultado.message || 'Email o contraseña incorrectos', 'error');
            }

        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = textoOriginal;
        }
    });
}

// ==================== VERIFICAR SI YA ESTÁ LOGUEADO ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si hay mensaje de registro exitoso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        mostrarAlerta('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');
    }

    // Verificar si ya está autenticado
    try {
        const response = await fetch('http://localhost:3000/api/usuario', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            mostrarAlerta('Ya tienes una sesión activa. Redirigiendo...', 'info');
            setTimeout(() => {
                window.location.href = 'productos.html';
            }, 1500);
        }
    } catch (error) {
        // Usuario no autenticado (esperado)
        console.log('Usuario no autenticado');
    }
});