// Funcionalidad de búsqueda
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const patientCards = document.querySelectorAll('.patient-card');
    
    patientCards.forEach(card => {
        const patientName = card.querySelector('.patient-name').textContent.toLowerCase();
        if (patientName.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Función para ver paciente
function verPaciente(nombre) {
    // Guarda el nombre del paciente seleccionado en localStorage
    localStorage.setItem('pacienteActual', nombre);

    // Redirige a la página del odontograma
    window.location.href = "odontograma.html";
}


// Efectos visuales adicionales
document.querySelectorAll('.patient-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('ver-btn')) {
            this.style.backgroundColor = '#f8f9fa';
            setTimeout(() => {
                this.style.backgroundColor = 'white';
            }, 150);
        }

    });
});


