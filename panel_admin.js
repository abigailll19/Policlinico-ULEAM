// Configurar fecha actual
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    document.getElementById('current-date').textContent = today.toLocaleDateString('es-ES', options);
});

// Funciones para mostrar secciones
function showSection(section) {
    if (section === 'usuarios') {
        document.getElementById('appointment-modal').style.display = 'block';
        return;
    }

    const modal = document.getElementById('section-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');

    switch (section) {
        case 'usuarios':
            title.textContent = 'Agendar Citas';
            content.innerHTML = `
                <p><strong>Citas programadas hoy:</strong> 12</p>
                <p><strong>Citas disponibles:</strong> 8</p>
                <p><strong>Pacientes nuevos:</strong> 3</p>
                <br>
                <p>Aquí podrás agendar nuevas citas y gestionar horarios disponibles.</p>
            `;
            break;
        case 'citas_hoy':
            window.location.href = "citas_hoy_admin.html";   
            return;

        case 'buscar_paciente':
            window.location.href = "busqueda_pacientes_admin.html";
            return;

    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('section-modal').style.display = 'none';
}

// Funciones para elementos recientes
function viewRecentItem(name) {
    const modal = document.getElementById('recent-modal');
    const details = document.getElementById('recent-details');

    details.innerHTML = `
        <p><strong>Paciente:</strong> ${name}</p>
        <p><strong>Cita:</strong> Consulta general</p>
        <p><strong>Estado:</strong> ✅ Confirmada</p>
        <p><strong>Cédula:</strong> 1234567890</p>
        <p><strong>Email:</strong> ${name.toLowerCase().replace(' ', '.')}@email.com</p>
        <p><strong>Teléfono:</strong> 0987654321</p>
        <p><strong>Hora:</strong> ${name.includes('Juan') ? '10:30' : name.includes('María') ? '11:00' : name.includes('Pedro') ? '11:30' : '12:15'}</p>
    `;

    modal.style.display = 'block';
}

function closeRecentModal() {
    document.getElementById('recent-modal').style.display = 'none';
}

function editRecord() {
    alert('Función de edición disponible próximamente');
    closeRecentModal();
}



// Funciones para el modal de agendar citas
let selectedDoctor = null;

function selectDoctor(element, doctorName) {
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.classList.remove('selected');
    });

    element.classList.add('selected');
    selectedDoctor = doctorName;

    const scheduleBtn = document.getElementById('schedule-btn');
    scheduleBtn.disabled = false;
    scheduleBtn.style.opacity = '1';
}

function consultSchedule() {
    if (!selectedDoctor) {
        alert('Por favor selecciona un doctor primero');
        return;
    }
    window.location.href = "agregar_paciente_admin.html";

    
}

function closeAppointmentModal() {
    document.getElementById('appointment-modal').style.display = 'none';
    selectedDoctor = null;

    document.querySelectorAll('.doctor-card').forEach(card => {
        card.classList.remove('selected');
    });

    const scheduleBtn = document.getElementById('schedule-btn');
    scheduleBtn.disabled = true;
    scheduleBtn.style.opacity = '0.5';
}

// Cerrar modales al hacer clic fuera
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
};

// Simular datos en tiempo real
setInterval(function () {
    const recentItems = document.querySelectorAll('.recent-item');
    if (Math.random() > 0.95) {
        const names = ['Ana Silva', 'Carlos Ruiz', 'Laura Mendez', 'Roberto Castro'];
        const times = ['13:45', '14:10', '14:30', '14:55'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomTime = times[Math.floor(Math.random() * times.length)];

        if (recentItems.length < 6) {
            const newItem = document.createElement('div');
            newItem.className = 'recent-item';
            newItem.textContent = `${randomName} - ${randomTime}`;
            newItem.onclick = () => viewRecentItem(randomName);
            document.querySelector('.recent-items').appendChild(newItem);
        }
    }
}, 1000);
