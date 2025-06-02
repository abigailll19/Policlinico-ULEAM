function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;

    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Función para validar formato de correo
function validarCorreo(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value.trim();

        if (!email || !pass) {
            alert('Por favor completa todos los campos de inicio de sesión.');
            return;
        }

        if (!validarCorreo(email)) {
            alert('Por favor ingresa un correo válido.');
            return;
        }

        // Redirección según el dominio del correo
        if (email.endsWith('@est.uleam.com') || email.endsWith('@prof.uleam.com')) {
            localStorage.setItem('rol', 'paciente');
            window.location.href = 'agendarcita_paciente.html';
        } else if (email.endsWith('@admin.uleam.com')) {
            localStorage.setItem('rol', 'administrador');
            window.location.href = 'panel_admin.html';
        } else if (email.endsWith('@odont.uleam.com')) {
            const usuario = email.split('@')[0].toLowerCase();

            if (usuario === 'garcia' || usuario === 'mendoza') {
                localStorage.setItem('rol', 'odontologo');
                window.location.href = 'panel_odontologo.html';
            } else {
                alert('Solo se permite el acceso a los doctores autorizados: Garcia y Dra Mendoza.');
            }
        } else {
            alert('Dominio de correo no reconocido. Contacta al administrador.');
        }

    });
});


