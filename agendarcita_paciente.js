// Variables globales
let selectedDoctor = '';
let selectedDate = '';
let selectedTime = '';

// Datos por defecto para localStorage
const defaultCitasData = {
    doctors: {
        'garcia': {
            name: 'Dr. García',
            specialty: 'Odontología General'
        },
        'mendoza': {
            name: 'Dra. Mendoza',
            specialty: 'Endodoncia'
        }   
    },
    availability: {
        'garcia': {
            '18': ['9:00 am', '10:00 am', '3:00 pm'],
            '19': ['9:00 am', '12:00 M', '4:00 pm'],
            '21': ['10:00 am', '12:00 M', '3:00 pm', '4:00 pm'],
            '22': ['9:00 am', '10:00 am', '12:00 M', '3:00 pm', '4:00 pm'],
            '23': ['9:00 am', '3:00 pm'],
            '24': ['10:00 am', '12:00 M']
        },
        'mendoza': {
            '18': ['10:00 am', '12:00 M', '4:00 pm'],
            '19': ['9:00 am', '3:00 pm', '4:00 pm'],
            '21': ['9:00 am', '10:00 am', '12:00 M'],
            '22': ['9:00 am', '12:00 M', '3:00 pm'],
            '23': ['10:00 am', '12:00 M', '4:00 pm'],
            '24': ['9:00 am', '3:00 pm', '4:00 pm']
        }
    },
    appointments: []
};

// Función para inicializar localStorage
function initializeLocalStorage() {
    const existingData = localStorage.getItem('citas_paciente');
    
    if (!existingData) {
        localStorage.setItem('citas_paciente', JSON.stringify(defaultCitasData));
        console.log('localStorage inicializado con datos por defecto');
    } else {
        console.log('localStorage ya existe con datos previos');
    }
}

// Función para obtener datos de localStorage
function getCitasData() {
    const data = localStorage.getItem('citas_paciente');
    return data ? JSON.parse(data) : defaultCitasData;
}

// Función para guardar datos en localStorage
function saveCitasData(data) {
    localStorage.setItem('citas_paciente', JSON.stringify(data));
}

// Función para guardar una nueva cita
function saveAppointment(doctor, date, time) {
    const citasData = getCitasData();
    const newAppointment = {
        id: Date.now(),
        doctor: doctor,
        date: date,
        time: time,
        status: 'confirmada',
        createdAt: new Date().toISOString()
    };
    
    citasData.appointments.push(newAppointment);
    saveCitasData(citasData);
    
    console.log('Cita guardada:', newAppointment);
    return newAppointment;
}

// Selección de doctor
document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedDoctor = this.dataset.doctor;
        updateAppointmentSummary();
        updateTimeSlots();
    });
});

// Selección de fecha
document.querySelectorAll('.date-btn:not(.unavailable)').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        selectedDate = this.dataset.date;
        updateDateTitle();
        updateAppointmentSummary();
        updateTimeSlots();
    });
});

// Selección de hora
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        selectedTime = this.dataset.time;
        updateAppointmentSummary();
    });
});

function updateDateTitle() {
    const dateTitle = document.querySelector('.section:nth-child(3) .section-title');
    if (selectedDate) {
        dateTitle.innerHTML = `<span class="section-number">3</span>Horarios disponibles - ${selectedDate} de mayo`;
    }
}

function updateTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-btn');
    const citasData = getCitasData();
    const availability = citasData.availability;

    timeSlots.forEach(slot => {
        slot.classList.remove('unavailable');
        slot.style.display = 'block';

        if (selectedDoctor && selectedDate) {
            const availableTimes = availability[selectedDoctor][selectedDate] || [];
            
            // Verificar si el horario ya está ocupado
            const isBooked = citasData.appointments.some(appointment => 
                appointment.doctor === selectedDoctor && 
                appointment.date === selectedDate && 
                appointment.time === slot.dataset.time &&
                appointment.status === 'confirmada'
            );
            
            if (!availableTimes.includes(slot.dataset.time) || isBooked) {
                slot.classList.add('unavailable');
                slot.style.display = 'none';
            }
        }
    });

    // Limpiar selección de hora si ya no está disponible
    if (selectedTime && selectedDoctor && selectedDate) {
        const availableTimes = availability[selectedDoctor][selectedDate] || [];
        const isBooked = citasData.appointments.some(appointment => 
            appointment.doctor === selectedDoctor && 
            appointment.date === selectedDate && 
            appointment.time === selectedTime &&
            appointment.status === 'confirmada'
        );
        
        if (!availableTimes.includes(selectedTime) || isBooked) {
            selectedTime = '';
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            updateAppointmentSummary();
        }
    }
}

function updateAppointmentSummary() {
    const summary = document.querySelector('.appointment-summary');
    const details = document.getElementById('appointmentDetails');
    const confirmBtn = document.getElementById('confirmBtn');
    const citasData = getCitasData();

    if (selectedDoctor && selectedDate && selectedTime) {
        const doctorInfo = citasData.doctors[selectedDoctor];

        details.innerHTML = `
            <strong>Doctor:</strong> ${doctorInfo.name} - ${doctorInfo.specialty}<br>
            <strong>Fecha:</strong> ${selectedDate} de Mayo, 2025<br>
            <strong>Hora:</strong> ${selectedTime}
        `;

        summary.style.display = 'block';
        confirmBtn.disabled = false;
    } else {
        summary.style.display = 'none';
        confirmBtn.disabled = true;
    }
}

// Confirmar cita
document.getElementById('confirmBtn').addEventListener('click', function () {
    if (selectedDoctor && selectedDate && selectedTime) {
        const citasData = getCitasData();
        const doctorInfo = citasData.doctors[selectedDoctor];
        
        // Guardar la cita en localStorage
        const newAppointment = saveAppointment(selectedDoctor, selectedDate, selectedTime);

        const modalText = document.getElementById('modalText');
        modalText.innerHTML = `
            Su cita con ${doctorInfo.name} ha sido confirmada para el ${selectedDate} de Mayo a las ${selectedTime}.
            <br><br>
            Le enviaremos un recordatorio 24 horas antes de su cita.
            <br><br>
            <small>ID de cita: ${newAppointment.id}</small>
        `;

        document.getElementById('confirmModal').style.display = 'flex';
    }
});

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';

    // Reset form
    selectedDoctor = '';
    selectedDate = '';
    selectedTime = '';

    document.querySelectorAll('.doctor-card, .date-btn, .time-btn').forEach(el => {
        el.classList.remove('selected');
    });

    document.querySelector('.appointment-summary').style.display = 'none';
    document.getElementById('confirmBtn').disabled = true;

    // Reset time slots visibility
    document.querySelectorAll('.time-btn').forEach(slot => {
        slot.style.display = 'block';
        slot.classList.remove('unavailable');
    });
    
    // Actualizar disponibilidad después de confirmar cita
    updateTimeSlots();
}

// Función para ver todas las citas guardadas (opcional para debugging)
function viewAllAppointments() {
    const citasData = getCitasData();
    console.log('Todas las citas:', citasData.appointments);
    return citasData.appointments;
}

// Función para limpiar todas las citas (opcional para testing)
function clearAllAppointments() {
    const citasData = getCitasData();
    citasData.appointments = [];
    saveCitasData(citasData);
    console.log('Todas las citas han sido eliminadas');
    updateTimeSlots(); // Refresh availability
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    updateTimeSlots();
    
    // Opcional: agregar funciones globales para debugging
    window.viewAllAppointments = viewAllAppointments;
    window.clearAllAppointments = clearAllAppointments;
    window.getCitasData = getCitasData;
});

