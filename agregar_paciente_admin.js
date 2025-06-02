let patientsData = JSON.parse(localStorage.getItem('infopacientes.json')) || {
    '2025-05-01': [
        { name: 'María García', time: '09:00' },
        { name: 'Carlos López', time: '10:30' }
    ],
    '2025-05-02': [
        { name: 'Ana Martínez', time: '11:00' }
    ],
    '2025-05-03': [
        { name: 'Pedro Rodríguez', time: '14:00' },
        { name: 'Laura Fernández', time: '15:30' },
        { name: 'José Morales', time: '16:00' }
    ],
    '2025-05-04': [
        { name: 'Alejandra Muñoz', time: '08:30' },
        { name: 'Alejandra Muñoz', time: '09:45' }
    ]
};

let currentMonth = 4; // Mayo (0-indexado)
let currentYear = 2025;
let selectedDate = null;

const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function getDayStatus(dateStr) {
    const patients = patientsData[dateStr] || [];
    if (patients.length === 0) return 'available'; // Verde
    if (patients.length >= 3) return 'full'; // Rojo
    return 'partial'; // Naranja
}

function getDayColor(status) {
    switch (status) {
        case 'available': return '#90c695'; // Verde
        case 'partial': return '#ff9800';   // Naranja
        case 'full': return '#f44336';      // Rojo
        default: return '#e0e0e0';          // Gris para días fuera del mes
    }x
}

function generateCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Ajustar para que lunes sea 0
    const daysInMonth = lastDay.getDate();

    document.getElementById('monthYear').textContent = `${months[currentMonth]} ${currentYear}`;

    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.height = '40px';
        calendarGrid.appendChild(emptyDiv);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const status = getDayStatus(dateStr);

        dayDiv.textContent = day;
        dayDiv.style.cssText = `
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${getDayColor(status)};
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            border: 2px solid transparent;
        `;

        dayDiv.onclick = () => selectDate(day, dateStr);
        calendarGrid.appendChild(dayDiv);
    }
}

function selectDate(day, dateStr) {
    selectedDate = dateStr;
    const date = new Date(currentYear, currentMonth, day);
    const dayName = dayNames[date.getDay()];
    const monthName = months[currentMonth];

    document.getElementById('selected-date').textContent =
        `${dayName} ${day} de ${monthName}`;

    showPatientsPanel();
    updatePatientsList();
}

function showPatientsPanel() {
    document.getElementById('patients-panel').style.display = 'block';
}

function updatePatientsList() {
    const patients = patientsData[selectedDate] || [];
    const patientsList = document.getElementById('patients-list');
    const addButton = document.getElementById('add-patient-btn');

    patientsList.innerHTML = '';

    patients.forEach((patient, index) => {
        const patientDiv = document.createElement('div');
        patientDiv.style.cssText = `
            background-color: white;
            border: 2px solid #4a5d23;
            border-radius: 20px;
            padding: 8px 15px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        patientDiv.innerHTML = `
            <div>
                <div style="font-weight: bold;">${patient.name}</div>
                <div style="font-size: 12px; color: #666;">${patient.time}</div>
            </div>
            <button onclick="removePatient(${index})" style="
                background: #f44336; 
                color: white; 
                border: none; 
                border-radius: 50%; 
                width: 20px; 
                height: 20px; 
                cursor: pointer;
                font-size: 12px;
            ">×</button>
        `;

        patientsList.appendChild(patientDiv);
    });

    // Mostrar u ocultar botón "Agregar Paciente"
    if (patients.length >= 3) {
        addButton.style.backgroundColor = '#f44336'; // rojo
        addButton.disabled = true;                    // deshabilitado
    } else {
        addButton.style.backgroundColor = '#ff9800'; // naranja
        addButton.disabled = false;                   // habilitado
    }
}

function showAddPatientForm() {
    document.getElementById('add-patient-form').style.display = 'block';
    document.getElementById('add-patient-btn').style.display = 'none';
    document.getElementById('patient-name').focus();
}

function cancelAddPatient() {
    document.getElementById('add-patient-form').style.display = 'none';
    document.getElementById('add-patient-btn').style.display = 'block';
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-time').value = '';
}

function addPatient() {
    const name = document.getElementById('patient-name').value.trim();
    const time = document.getElementById('patient-time').value;

    if (!name || !time) {
        alert('Por favor complete todos los campos');
        return;
    }

    if (!patientsData[selectedDate]) {
        patientsData[selectedDate] = [];
    }

    patientsData[selectedDate].push({ name, time });

    // Ordenar por hora
    patientsData[selectedDate].sort((a, b) => a.time.localeCompare(b.time));

    // Guardar en localStorage
    localStorage.setItem('infopacientes.json', JSON.stringify(patientsData));


    updatePatientsList();
    generateCalendar();
    cancelAddPatient();
}

function removePatient(index) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
        patientsData[selectedDate].splice(index, 1);

        if (patientsData[selectedDate].length === 0) {
            delete patientsData[selectedDate];
        }

        // Guardar en localStorage
        localStorage.setItem('infopacientes.json', JSON.stringify(patientsData));

        updatePatientsList();
        generateCalendar();
    }
}

// Inicializar calendario
generateCalendar();
