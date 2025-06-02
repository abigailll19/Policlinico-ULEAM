// Base de datos simulada de pacientes
const patientsDB = [
    {
        id: 'luisa',
        name: 'Luisa Mendoza',
        email: 'luisa.mendoza@clinicadentu.com',
        phone: '+593 99 123 4567',
        age: 34,
        cedula: '1315251288',
        registered: '15 de Marzo, 2024'
    },
    {
        id: 'antonio',
        name: 'Antonio Gómez',
        email: 'antonio.gomez@clinicadentu.com',
        phone: '+593 98 765 4321',
        age: 42,
        cedula: '0987654321',
        registered: '22 de Febrero, 2024'
    },
    {
        id: 'maria',
        name: 'María Rodríguez',
        email: 'maria.rodriguez@clinicadentu.com',
        phone: '+593 97 555 1234',
        age: 28,
        cedula: '1234567890',
        registered: '08 de Abril, 2024'
    }
];

function toggleInfo(patientId) {
    const infoDiv = document.getElementById(`info-${patientId}`);
    const button = infoDiv.previousElementSibling;

    if (infoDiv.style.display === 'none' || infoDiv.style.display === '') {
        infoDiv.style.display = 'block';
        button.textContent = 'Ocultar Información';
        button.style.backgroundColor = '#d0d0d0';
    } else {
        infoDiv.style.display = 'none';
        button.textContent = 'Ver Información';
        button.style.backgroundColor = '#f0f0f0';
    }
}

function searchPatients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');

    if (searchTerm === '') {
        resultsContainer.style.display = 'block';
        noResults.style.display = 'none';
        updateStatusBar(patientsDB.length);
        return;
    }

    const filteredPatients = patientsDB.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.cedula.includes(searchTerm) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm)
    );

    if (filteredPatients.length === 0) {
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
        updateStatusBar(0);
    } else {
        resultsContainer.style.display = 'block';
        noResults.style.display = 'none';
        updateStatusBar(filteredPatients.length);

        // Mostrar solo los pacientes que coincidan
        patientsDB.forEach(patient => {
            const patientCard = document.querySelector(`[onclick="toggleInfo('${patient.id}')"]`).parentElement;
            if (filteredPatients.some(fp => fp.id === patient.id)) {
                patientCard.style.display = 'block';
            } else {
                patientCard.style.display = 'none';
            }
        });
    }
}

function updateStatusBar(count) {
    const statusBar = document.querySelector('.status-bar');
    statusBar.textContent = `Clínica Dental - Sistema de Gestión de Pacientes | ${count} paciente${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
}

function toggleFilter() {
    alert('Función de filtros en desarrollo...');
}

// Inicializar con el placeholder de la búsqueda
document.getElementById('searchInput').addEventListener('focus', function () {
    this.placeholder = 'Escriba para buscar...';
});

document.getElementById('searchInput').addEventListener('blur', function () {
    if (this.value === '') {
        this.placeholder = 'Buscar por cédula, nombre o teléfono...';
    }
});
