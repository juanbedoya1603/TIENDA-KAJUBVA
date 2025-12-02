// public/js/auth.js - Sistema de autenticación

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    
    if (formLogin) {
        formLogin.addEventListener('submit', handleLogin);
    }
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', handleRegistro);
    }
    
    // Verificar si hay redirect en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect) {
        sessionStorage.setItem('redirect_after_login', redirect);
    }
});

// Manejar login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const btnSubmit = event.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Ingresando...';
    
    try {
        const resultado = await UsuariosAPI.login(email, password);
        
        if (resultado.success) {
            mostrarNotificacion('¡Bienvenido ' + resultado.data.nombre + '!', 'success');
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                const redirect = sessionStorage.getItem('redirect_after_login');
                if (redirect) {
                    sessionStorage.removeItem('redirect_after_login');
                    window.location.href = redirect;
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            mostrarNotificacion(resultado.message || 'Error al iniciar sesión', 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Ingresar';
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al iniciar sesión', 'error');
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Ingresar';
    }
}

// Manejar registro
async function handleRegistro(event) {
    event.preventDefault();
    
    const datos = {
        nombre: document.getElementById('registro-nombre').value,
        email: document.getElementById('registro-email').value,
        password: document.getElementById('registro-password').value,
        telefono: document.getElementById('registro-telefono').value
    };
    
    // Validar contraseña
    if (datos.password.length < 6) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    const btnSubmit = event.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Registrando...';
    
    try {
        const resultado = await UsuariosAPI.registrar(datos);
        
        if (resultado.success) {
            mostrarNotificacion('¡Registro exitoso! Redirigiendo...', 'success');
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            mostrarNotificacion(resultado.message || 'Error al registrarse', 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Registrarme';
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al registrarse', 'error');
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Registrarme';
    }
}

// Mostrar formulario de registro
function mostrarRegistro() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('registro-form').style.display = 'block';
}

// Mostrar formulario de login
function mostrarLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('registro-form').style.display = 'none';
}

// Estilos para el formulario de autenticación
const style = document.createElement('style');
style.textContent = `
    .auth-section {
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        background: #f5f5f5;
    }
    
    .auth-container {
        max-width: 450px;
        width: 100%;
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .auth-form h2 {
        margin-bottom: 30px;
        text-align: center;
        color: #333;
    }
    
    .auth-form .form-group {
        margin-bottom: 20px;
    }
    
    .auth-form label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
    }
    
    .auth-form input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }
    
    .auth-form input:focus {
        outline: none;
        border-color: #4CAF50;
    }
    
    .auth-form button[type="submit"] {
        width: 100%;
        padding: 15px;
        margin-top: 10px;
    }
    
    .auth-form p {
        text-align: center;
        margin-top: 20px;
        color: #666;
    }
    
    .auth-form a {
        color: #4CAF50;
        text-decoration: none;
        font-weight: 500;
    }
    
    .auth-form a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);