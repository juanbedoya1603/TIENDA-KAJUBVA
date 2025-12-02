// public/js/contacto.js - Script para contacto.html

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');
    
    if (formulario) {
        formulario.addEventListener('submit', enviarMensaje);
    }
    
    // Actualizar contador del carrito
    CarritoAPI.actualizarContador();
});

// Enviar mensaje de contacto
async function enviarMensaje(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const asunto = document.getElementById('asunto')?.value.trim() || '';
    const mensaje = document.getElementById('mensaje').value.trim();
    
    // Validar datos
    if (!nombre || !email || !mensaje) {
        mostrarNotificacion('Por favor, completa todos los campos requeridos', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarNotificacion('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Deshabilitar botón de envío
    const btnEnviar = event.target.querySelector('button[type="submit"]');
    const textoOriginal = btnEnviar.textContent;
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    
    try {
        const datos = {
            nombre,
            email,
            asunto,
            mensaje
        };
        
        const resultado = await ContactoAPI.enviar(datos);
        
        if (resultado.success) {
            mostrarNotificacion(resultado.message || '¡Mensaje enviado exitosamente!', 'success');
            
            // Limpiar formulario
            event.target.reset();
        } else {
            mostrarNotificacion(resultado.message || 'Error al enviar el mensaje', 'error');
        }
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        mostrarNotificacion('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
    } finally {
        // Rehabilitar botón
        btnEnviar.disabled = false;
        btnEnviar.textContent = textoOriginal;
    }
}

// Estilos adicionales para el formulario
const style = document.createElement('style');
style.textContent = `
    #form-contacto {
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #4CAF50;
    }
    
    .form-group textarea {
        min-height: 150px;
        resize: vertical;
    }
    
    .form-group .required {
        color: #f44336;
    }
    
    button[type="submit"] {
        width: 100%;
        padding: 15px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 18px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    button[type="submit"]:hover:not(:disabled) {
        background: #45a049;
    }
    
    button[type="submit"]:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);