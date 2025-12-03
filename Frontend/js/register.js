// register.js - Lógica del formulario de registro
// Colocar en: Frontend/js/register.js

const registerForm = document.getElementById('registerForm');
const alertMessage = document.getElementById('alertMessage');

// ==================== VALIDACIONES ====================
function validarFormulario(datos) {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim().length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!datos.email || !emailRegex.test(datos.email)) {
        errores.push('Ingresa un correo electrónico válido');
    }

    if (!datos.password || datos.password.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (datos.password !== datos.confirmPassword) {
        errores.push('Las contraseñas no coinciden');
    }

    if (datos.telefono && !/^[0-9]{10}$/.test(datos.telefono)) {
        errores.push('El teléfono debe tener 10 dígitos');
    }

    if (!datos.terminos) {
        errores.push('Debes aceptar los términos y condiciones');
    }

    return errores;
}

// ==================== MOSTRAR ALERTAS ====================
function mostrarAlerta(mensaje, tipo = 'success') {
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
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        telefono: document.getElementById('telefono').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        direccion: document.getElementById('direccion').value.trim(),
        terminos: document.getElementById('terminos').checked
    };

    const errores = validarFormulario(formData);
    if (errores.length > 0) {
        mostrarAlerta(errores.join('. '), 'error');
        return;
    }

    const btnSubmit = registerForm.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Registrando...';

    try {
        const response = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono || null,
                password: formData.password,
                direccion: formData.direccion || null
            })
        });

        const resultado = await response.json();

        if (resultado.success) {
            mostrarAlerta('✅ ¡Cuenta creada exitosamente! Redirigiendo al login...', 'success');
            registerForm.reset();

            setTimeout(() => {
                window.location.href = 'login.html?registered=true';
            }, 2000);

        } else {
            mostrarAlerta(resultado.message || 'Error al crear la cuenta', 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
    }
});

// ==================== VALIDACIÓN EN TIEMPO REAL ====================
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden');
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
});

const telefonoInput = document.getElementById('telefono');
telefonoInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length > 10) {
        e.target.value = e.target.value.slice(0, 10);
    }
});

// ==================== VERIFICAR SI YA ESTÁ LOGUEADO ====================
document.addEventListener('DOMContentLoaded', async () => {
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
        console.log('Usuario no autenticado (esperado)');
    }
});
